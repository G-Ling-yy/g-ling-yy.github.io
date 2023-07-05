<template>
  <div class="container flex-center" ref="containerDom">
    <!-- loading -->
    <div v-if="loading" class="loading flex-center">
      <ma-spin size="large" />
    </div>

    <!-- 无内容提示 -->
    <div v-else-if="!src" class="tip">暂无媒体类型证据</div>

    <template v-else-if="type === 'video'">
      <video
        :autoplay="autoplay"
        :class="[controlsShow ? 'show-controls' : '']"
        controls
        controlsList="nodownload"
        crossorigin
        disablePictureInPicture
        disable
        loop
        muted
        :poster="poster"
        ref="videoDom"
        :src="src"
        @mouseenter="controlsShow = true"
        @mouseleave="videoMouseLeaveHandler"
        @mousemove="videoMouseMoveHandler"
      ></video>

      <!-- 标记层canvas -->
      <canvas
        :height="casHeight"
        :width="casWidth"
        ref="canvasDom"
      ></canvas>

      <!-- 标框数据存在标记 -->
      <div
        v-if="markDataExistShow && !isPlayerFullScreen"
        class="mark-exist-tip"
      >
        <div><icon icon="flag-fill" /></div>
        <span>有标注</span>
      </div>

      <!-- 控制层controls -->
      <div
        :class="[
          'controls',
          controlsShow && 'show',
          isPlayerFullScreen && 'fullscreen'
        ]"
        @mouseenter="isMouseOnControl = true"
        @mouseleave="isMouseOnControl = false"
      >
        <!-- 截图按钮 -->
        <div
          v-if="userInfo.userType == 1 && showSnapshotBtn"
          class="snapshot-btn btn"
          @click="showSnapshot"
        >
          <icon icon="image-add-line" />
        </div>
        <!-- 白板 -->
        <!-- <div v-if="snapshotShow" class="white-panel"></div> -->

        <!-- 全屏按钮 -->
        <div
          class="fullscreen-btn btn"
          @click="togglePlayerFullScreen"
        ></div>
      </div>
    </template>

    <template v-else-if="type === 'image'">
      <img
        :src="src"
        alt="报警截图图片"
        @dblclick="imgDblClickHandler"
      />
    </template>

    <!-- 截图弹窗 -->
    <Snapshot
      :extraData="{
        alarmId: extraData.alarmId,
        frameIndex: Math.round(
          (videoDom?.currentTime || 0) * frameRate
        )
      }"
      :media="videoDom"
      :show="snapshotShow"
      @close="closeSnapshot"
    />
  </div>
</template>

<script setup>
/* 自带标框功能的视频播放器 */
/* eslint no-unused-vars: off */
import {
  ref,
  reactive,
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'
import { debounce } from '@/utils/lodash'
import { drawSimpleArrow } from '@scripts/canvas-self-methods'
import { useStore } from 'vuex'
import axios from 'axios'

const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: 'video'
    },

    autoplay: {
      type: Boolean,
      default: false
    },

    src: {
      type: String,
      default: ''
    },

    // 封面url
    poster: {
      type: String,
      default: ''
    },

    // 显示截图按钮
    showSnapshotBtn: {
      type: Boolean,
      default: false
    },

    // 额外数据
    extraData: {
      type: Object,
      default: () => ({})
    },

    // 标框数据地址（作为获取标框数据的参数）
    framesUrl: {
      type: String,
      default: ''
    }
  }),
  store = useStore()

/* Snapshot 组件判断加载 */
let Snapshot = 'div'
if (props.showSnapshotBtn) {
  Snapshot = require('./Snapshot.vue').default
}

// 用户部分信息
const userInfo = reactive({
  userType: store.getters['user/userType']
})

let curRequestVideoFrameCallback // 视频回调标记值
const containerDom = ref(), // container元素dom
  videoDom = ref(), // video元素dom
  canvasDom = ref(), // canvas元素dom
  casHeight = ref(0), // canvas元素高度
  casWidth = ref(0), // canvas元素宽度
  // video视频帧回调
  videoFrameCallback = (now, matedata) => {
    const index = Math.round(matedata.mediaTime * frameRate)
    if (framesData.length && frameRate === +frameRate) {
      if (framesData[index]?.objects?.length) {
        // 不画框改箭头了
        // drawRectsBydata(framesData[index])
        drawArrowsBydata(framesData[index])
      } else {
        // 清空画布
        ctx?.clearRect(
          0,
          0,
          casWidth.value,
          casHeight.value
        )
      }

      // 继续下一帧回调
      videoDom.value?.requestVideoFrameCallback?.(
        videoFrameCallback
      )
    } else {
      // 取消视频回调
      videoDom.value?.cancelVideoFrameCallback?.(
        curRequestVideoFrameCallback
      )
    }
  },
  // 根据数据绘制矩形框
  drawRectsBydata = data => {
    if (!ctx) return initCCtx()

    data.objects.forEach(({ regions }) => {
      if (
        regions[0].x < 0 ||
        regions[1].x < 0 ||
        regions[0].y < 0 ||
        regions[1].y < 0
      )
        return

      const x =
          Math.round(
            (regions[0].x / data.width) * casWidth.value
          ) + 2,
        y =
          Math.round(
            (regions[0].y / data.height) * casHeight.value
          ) + 2,
        x1 =
          Math.round(
            (regions[1].x / data.width) * casWidth.value
          ) - 2,
        y1 =
          Math.round(
            (regions[1].y / data.height) * casHeight.value
          ) - 2,
        width = x === x1 ? 0 : Math.abs(x1 - x),
        height = y === y1 ? 0 : Math.abs(y1 - y)

      ctx.strokeRect(x, y, width, height)
    })
  },
  // 根据数据绘制箭头
  drawArrowsBydata = data => {
    if (!ctx) return initCCtx()

    // 清空画布
    ctx?.clearRect(0, 0, casWidth.value, casHeight.value)

    // 箭头大小尺寸
    const arrowSize = 40

    data.objects.forEach(({ regions }) => {
      const { x: x0, y: y0 } = regions[0],
        { x: x1, y: y1 } = regions[1],
        x = (Number(x0) + Number(x1)) / 2,
        y = (Number(y0) + Number(y1)) / 2,
        endX = Math.round(
          (x / data.width) * casWidth.value
        ),
        endY = Math.round(
          (y / data.height) * casHeight.value
        )

      if (endX < 0 || endY < 0) return

      // 起始点坐标
      let startX = endX - arrowSize,
        startY = endY - arrowSize

      /* ＃字四边缘判断 */
      // 上边缘
      endY < arrowSize && (startY = endY + arrowSize)
      // 右边缘
      endX > casWidth.value - arrowSize &&
        (startX = endX - arrowSize)
      // 下边缘
      endY > casHeight.value - arrowSize &&
        (startY = endY - arrowSize)
      // 左边缘
      endX < arrowSize && (startX = endX + arrowSize)

      // 绘制简易箭头
      drawSimpleArrow(
        ctx,
        startX,
        startY,
        endX,
        endY,
        15,
        (Math.PI / 180) * 35
      )
    })
  }

let framesData = [], // 帧数据
  frameRate = props.extraData.frameRate, // 帧率
  ctx, // canvas上下文对象
  stopVideoDomWatch // 对videoDom的监听取消

// 初始化canvas尺寸和ctx
const initCCtx = () => {
    // 设置canvas宽高及上下文对象
    casHeight.value = videoDom.value.offsetHeight
    casWidth.value = videoDom.value.offsetWidth
    ctx = canvasDom.value.getContext('2d')
    nextTick(() => {
      ctx.lineWidth = 3
      ctx.strokeStyle = '#1890ff'
      ctx.lineJoin = 'round'
    })
  },
  // 标框数据存在显隐
  markDataExistShow = ref(false),
  // 获取标框json数据
  getFramesData = () =>
    axios.get(props.framesUrl).then(res => {
      if (res.status === 200 && res.data?.length) {
        framesData = res.data

        // 判断标框数据有效存在
        for (let i = 0; i < framesData.length; i++) {
          const data = framesData[i]?.objects
          if (data?.length) {
            for (let j = 0; j < data.length; j++) {
              const { regions } = data[j]

              if (
                regions[0].x >= 0 &&
                regions[1].x >= 0 &&
                regions[0].y >= 0 &&
                regions[1].y >= 0
              ) {
                markDataExistShow.value = true
                break
              }
            }
          }
        }

        // 更新帧率和标记数据
        updateFramesParams()

        // 判断为video添加视频帧回调
        judgeAddVideoFrameCb()
      }
    }),
  // 为video集中绑定相关事件
  setEventsOnVideo = () => {
    if (!videoDom.value) return

    // video获取数据后初始化canvas尺寸和ctx
    videoDom.value.onloadeddata = () => {
      // 视频文件加载时间过长
      if (!videoDom.value) return

      // 设置播放时间节点
      videoDom.value.currentTime =
        props.extraData?.currentTime || 0

      initCCtx()

      // 更新帧率和标记数据
      updateFramesParams()

      // 判断为video添加视频帧回调
      judgeAddVideoFrameCb()
    }

    // video暂停触发
    videoDom.value.onpause = () => {
      controlsShow.value = true
    }

    // video播放触发
    videoDom.value.onplay = () => {
      controlsShow.value = false
    }

    stopVideoDomWatch?.()
  },
  // 判断为video添加视频帧回调
  judgeAddVideoFrameCb = () => {
    // 如果支持video帧回调api
    if (videoDom.value.requestVideoFrameCallback) {
      curRequestVideoFrameCallback =
        videoDom.value.requestVideoFrameCallback(
          videoFrameCallback
        )
    }
  },
  // 更新帧率和标记数据
  updateFramesParams = () => {
    //  有标记数据 且
    // 有视频加载时长数据 条件值
    const canCalcFrames =
      framesData.length && videoDom.value.duration > 0

    // 若 有帧率数据
    if (props.extraData.frameRate) {
      // 若 有标记数据 且
      // 有视频加载时长数据
      if (canCalcFrames) {
        /* 按 frameRate 补 framesData */
        const length = Math.round(
            frameRate * videoDom.value.duration
          ),
          { height, width } = framesData[0],
          obj = {}

        framesData.forEach((e, i) => {
          obj[i] = e
        })

        framesData = []
        for (let i = 0; i < length; i++) {
          framesData[i] = obj[i] || {
            frame: i,
            height,
            width,
            objects: []
          }
        }
      }
    } else {
      // 若 有标记数据 且
      // 有视频加载时长数据
      if (canCalcFrames) {
        frameRate = Number(
          (
            framesData.length / videoDom.value.duration
          ).toFixed(2)
        )
      }
    }

    // 若 指定封面标记帧和地址 存在 且 视频未在播放
    if (
      canCalcFrames &&
      props.extraData.frameCount != undefined &&
      props.poster &&
      videoDom.value.paused
    ) {
      /* 绘制指定帧标记 */
      // console.log(
      //   '绘制指定帧标记',
      //   props.extraData.frameCount
      // )
      // nextTick(() => {
      //   drawArrowsBydata({
      //     height: 1080,
      //     width: 1920,
      //     objects: [
      //       {
      //         regions: [
      //           { x: 833, y: 855 },
      //           { x: 921, y: 1029 }
      //         ]
      //       }
      //     ]
      //   })
      // })
      // drawArrowsBydata(framesData[props.extraData.frameCount])
    }
  }

// 监听标框数据有地址则请求
props.type === 'video' &&
  watchEffect(() => {
    props.framesUrl && getFramesData()
  })

// video鼠标移动事件(模拟原生控件面板显隐)
const videoMouseMoveHandler = () => {
    controlsShow.value = true
    judgeToggleControlsShow()
  },
  // video鼠标离开事件
  videoMouseLeaveHandler = () => {
    setTimeout(() => {
      if (
        !videoDom.value.paused &&
        !isMouseOnControl.value
      ) {
        controlsShow.value = false
      }
    })
  }

/* 控制层相关 */
const controlsShow = ref(true), // 自定义控制层控件显隐
  isMouseOnControl = ref(false), // 鼠标悬在自定义控件层与否
  isPlayerFullScreen = ref(false), // 当前播放器全屏与否
  // 自定义控件尺寸控制
  ctrls = reactive({
    btnSize: '48px',
    iconSize: '20px'
  }),
  // 判断是否隐藏自定义控件层
  judgeToggleControlsShow = debounce(e => {
    if (
      videoDom.value &&
      !videoDom.value.paused &&
      !isMouseOnControl.value
    ) {
      controlsShow.value = false
    }
  }, 2500),
  // 打开截图弹窗
  showSnapshot = () => {
    videoDom.value?.pause()

    snapshotShow.value = true
  },
  // 播放器全屏切换
  togglePlayerFullScreen = () => {
    if (
      document.getFullscreenElement() === containerDom.value
    ) {
      document.exitFullscreen().then(() => {
        isPlayerFullScreen.value = false
        ctrls.btnSize = '48px'
        ctrls.iconSize = '20px'

        if (
          videoDom.value &&
          !videoDom.value.paused &&
          !isMouseOnControl.value
        ) {
          controlsShow.value = false
        }
      })
    } else {
      document
        .requestFullscreen(containerDom.value)
        .then(() => {
          isPlayerFullScreen.value = true
          ctrls.btnSize = '64px'
          ctrls.iconSize = '32px'
        })
    }
  },
  // 浏览器全屏切换处理（用户使用浏览器自带退出全屏按钮）
  fullscreenChangeHandler = () => {
    if (!document.getFullscreenElement()) {
      isPlayerFullScreen.value = false
      ctrls.btnSize = '48px'
      ctrls.iconSize = '20px'

      if (
        videoDom.value &&
        !videoDom.value.paused &&
        !isMouseOnControl.value
      ) {
        controlsShow.value = false
      }
    }
  }

/* 截图处理相关*/
const snapshotShow = ref(false), // 截图弹窗显隐
  // 关闭截图弹窗
  closeSnapshot = () => {
    snapshotShow.value = false

    videoDom.value?.play()
  }

/* 展示图片媒体相关 */
// 图片双击事件
const imgDblClickHandler = ({ target }) => {
  document.getFullscreenElement()
    ? document.exitFullscreen()
    : document.requestFullscreen(target)
}

onMounted(() => {
  // 监听video dom渲染成功后添加事件（ant modal组件里可能会延时渲染dom）
  props.type === 'video' &&
    watch(
      () => videoDom.value,
      nV => {
        // 为video集中绑定相关事件
        nV && setEventsOnVideo()
      },
      {
        immediate: true
      }
    )

  // 添加document全屏切换事件
  document.addEventListener(
    'fullscreenchange',
    fullscreenChangeHandler
  )
})

onBeforeUnmount(() => {
  // 移除document全屏切换事件
  document.removeEventListener(
    'fullscreenchange',
    fullscreenChangeHandler
  )
})

defineExpose({ videoDom })
</script>

<style lang="less" scoped>
canvas {
  display: block;
}
.container {
  background-color: #333;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  min-width: 240px;
  .loading {
    background-color: #fffe;
  }
  .tip {
    color: #fff;
  }

  ::v-deep(video) {
    height: 100%;
    // pointer-events: none;
    // // 控件层
    // &::-webkit-media-controls {
    //   pointer-events: auto;
    // }
    // // 播暂按钮
    // &::-webkit-media-controls-play-button {
    //   opacity: 0;
    //   visibility: visible;
    // }
    // &.show-controls::-webkit-media-controls-play-button {
    //   opacity: 1;
    // }
    // // 已播时间
    // &::-webkit-media-controls-current-time-display {
    //   opacity: 0;
    //   visibility: visible;
    // }
    // &.show-controls::-webkit-media-controls-current-time-display {
    //   opacity: 1;
    // }
    // // 已播时间
    // &::-webkit-media-controls-time-remaining-display {
    //   opacity: 0;
    //   visibility: visible;
    // }
    // &.show-controls::-webkit-media-controls-time-remaining-display {
    //   opacity: 1;
    // }
    // 全屏按钮
    &::-webkit-media-controls-fullscreen-button {
      opacity: 0 !important;
      visibility: hidden !important;
    }
    // 音量按钮
    &::-webkit-media-controls-mute-button {
      opacity: 0 !important;
      visibility: hidden !important;
    }
    // // 控件面板
    // &::-webkit-media-controls-panel {
    //   align-self: flex-end;
    //   background: left bottom / auto 92px repeat-x;
    //   background-image: -webkit-image-set(
    //     url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAJwCAYAAABI9AvEAAACkklEQVRIS1XHdxQIZBiFcTtCkmRHqSh7U1mpJMlK9t7Jpm2WUFnZK7PsbGWWUfYohOy9NZFVznNP5/vOff/4vfdJkOD/S8iPJCJFYicJKZIGkrEi95AiuZOCFPc6KUmRyklNivsCaViR+0mR1nmAFOmcB0mR3nmIFBmcjKTIFMjMimQhRVYnGykedrKTIofzCCkeDeRkRR4jxePOE6TI5eQmxZPOU6TIE8jLiuQjRX6nACkKOoVIUdgpQoqigWKsSHFSlHBKkqKU8zQpnnGeJUXpQBlWpCwpyjnlSfGcU4EUzzsvkOJFpyIpXgpUYkVeJkVl5xVSVHFeJUVVpxopqgdqsCI1SfGaU4sUrzu1SVHHqUuKeoH6rEgDUjR0GpGisdOEFE2dZqRoHmjBirQkRSunNSnaOG1J8YbTjhRvOu1J0SHQkRXpRIrOThdSdHW6kaK78xYp3g68w4q8S4r3nPdJ8YHTgxQ9nV6k6B3ow4r0JcWHzkek6Od8TIr+zgBSDAx8wop8SorPnEGkGOwMIcVQZxgpPg8MZ0VGkGKkM4oUo50xpBjrjCPFeGcCKSYGvmBFJpFisjOFFFOdaaSY7nxJiq8CM1iRmaSY5cwmxRxnLinmOV+TYn5gASuykBSLnMWkWOIsJcUy5xtSfBtYzoqsIMVKZxUpVjtrSPGd8z0p1jrrSLE+sIEV+YEUPzobSbHJ2UyKLc5WUmwLbGdFdpBip7OLFD85P5Nit7OHFHsDv7Ai+0ix3zlAil+dg6Q45BwmxZHAUVbkGCmOOydIcdI5RYrTzhlSnA2cY0XOk+KCc5EUl5zLpLji/EaK350/SPFn4C9W5G9SXHWukeK68w8pbjg3SXErcJsVuUOKf53/7gIPXjbYDO78kgAAAABJRU5ErkJggg==)
    //       1x
    //   );
    //   display: flex !important;
    //   opacity: 1;
    //   overflow: hidden;
    //   visibility: hidden;
    // }
    // // 时间线
    // &::-webkit-media-controls-timeline {
    //   opacity: 0;
    //   visibility: visible;
    // }
    // &.show-controls::-webkit-media-controls-timeline {
    //   opacity: 1;
    // }
    & + canvas {
      height: 100%;
      left: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }

  // 标框数据存在标记
  .mark-exist-tip {
    background-color: #0007;
    border-radius: 8px;
    color: #fff;
    display: flex;
    font-size: 12px;
    height: 24px;
    left: 4px;
    line-height: 22px;
    padding: 1px 5px 1px 1px;
    pointer-events: none;
    position: absolute;
    top: 4px;

    div {
      background-color: #21a2ff;
      border-radius: 7px;
      margin-right: 2px;
      text-align: center;
      width: 22px;

      i {
        font-size: 14px;
      }
    }
  }

  /* 控制层controls */
  .controls {
    @mideaControlBtnSize: v-bind('ctrls.btnSize');
    @mideaControlIconSize: v-bind('ctrls.iconSize');

    bottom: 0;
    height: 100%;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0s;
    visibility: hidden;
    width: 100%;
    &.show {
      opacity: 1;
      transition: opacity 0.25s
        cubic-bezier(0.25, 0.1, 0.25, 1) 0s;
      visibility: visible;
    }
    // 全屏模式下
    &.fullscreen {
      .btn {
        // 全屏按钮
        &.fullscreen-btn {
          right: calc(@mideaControlBtnSize + 16px);
          &::after {
            background-image: -webkit-image-set(
              url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJXaW5kb3ciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgogICAgPHBhdGggZD0iTTUgMTZoM3YzaDJ2LTVINXYyem0zLThINXYyaDVWNUg4djN6bTYgMTFoMnYtM2gzdi0yaC01djV6bTItMTFWNWgtMnY1aDVWOGgtM3oiLz4KPC9zdmc+Cg==)
                1x
            );
          }
        }
      }
    }

    .btn {
      bottom: 24px;
      height: @mideaControlBtnSize;
      pointer-events: auto;
      position: absolute;
      width: @mideaControlBtnSize;
      z-index: 2;
      &::after,
      &::before {
        content: '';
        display: block;
        height: @mideaControlIconSize;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: @mideaControlIconSize;
      }
      &::before {
        background-color: #202124b5;
        border-radius: 50%;
        height: 36px;
        opacity: 0;
        transition: 0.25s;
        visibility: hidden;
        width: 36px;
      }
      &:hover::before {
        opacity: 1;
        visibility: visible;
      }
      // // 播暂按钮
      // &.play-btn {
      //   &::after {
      //     background: center / 20px no-repeat;
      //     background-image: -webkit-image-set(
      //       url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJXaW5kb3ciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTYgMTloNFY1SDZ2MTR6bTgtMTR2MTRoNFY1aC00eiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K)
      //         1x
      //     );
      //   }
      //   &.paused::after {
      //     background-image: -webkit-image-set(
      //       url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJXaW5kb3ciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTggNXYxNGwxMS03eiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K)
      //         1x
      //     );
      //   }
      // }
      // 截图按钮
      &.snapshot-btn {
        right: calc(@mideaControlBtnSize * 3);
        i {
          color: #fff;
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      // 全屏按钮
      &.fullscreen-btn {
        right: @mideaControlBtnSize;
        &::after {
          background: center / @mideaControlIconSize
            no-repeat;
          background-image: -webkit-image-set(
            url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJXaW5kb3ciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgogICAgPHBhdGggZD0iTTcgMTRINXY1aDV2LTJIN3YtM3ptLTItNGgyVjdoM1Y1SDV2NXptMTIgN2gtM3YyaDV2LTVoLTJ2M3pNMTQgNXYyaDN2M2gyVjVoLTV6Ii8+Cjwvc3ZnPgo=)
              1x
          );
        }
      }
    }

    .white-panel {
      animation: opacity-hide 1s 1 forwards;
      background-color: #fff;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 9;
    }
  }

  img {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }
}
</style>
