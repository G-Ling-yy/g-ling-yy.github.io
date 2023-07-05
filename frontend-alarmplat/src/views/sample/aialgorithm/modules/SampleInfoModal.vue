<template>
  <ma-modal
    centered
    :footer="null"
    :maskClosable="false"
    title="样本详情"
    :visible="visible"
    width="fit-content"
    @cancel="emits('close')"
  >
    <div class="wrapper">
      <section class="left">
        <!-- 操作栏 -->
        <div class="action-bar">
          <div class="tabs">
            <div
              v-for="tab of tabs"
              :class="[
                'tab',
                tab.key === activeTab && 'active'
              ]"
              :key="tab.key"
              @click="activeTab = tab.key"
            >
              <img
                :src="tab.iconSrc"
                alt=""
                class="prefix-icon"
              />
              <span>{{ tab.text }}</span>
            </div>
          </div>

          <div class="btns">
            <ma-button @click="showDelSpsModal"
              >删除</ma-button
            >
          </div>
        </div>

        <!-- 显示区域 -->
        <div class="view-wrap">
          <div :class="['view-container', activeTab]">
            <div
              v-for="tab of tabs"
              :class="[
                'view-content',
                'flex-center',
                tab.key
              ]"
              :key="tab.key"
            >
              <!-- 样本内容 -->
              <template v-if="tab.key === 'sample'">
                <!-- img背景图 -->
                <img
                  :height="canvasHeight"
                  :src="sample?.imageUrl"
                  :width="canvasWidth"
                />

                <!-- 图像显示canvas -->
                <canvas
                  :height="canvasHeight"
                  ref="canvasDom"
                  :width="canvasWidth"
                ></canvas>

                <!-- 标注列表 -->
                <div
                  v-show="sample?.positionInfo?.length"
                  class="mark-list"
                >
                  <div class="list-head">
                    <div class="col index">序</div>
                    <div class="col text">标定对象</div>
                  </div>
                  <!-- 标记对象容器 -->
                  <ul class="list-body">
                    <li
                      v-for="(
                        mark, i
                      ) of sample?.positionInfo"
                      :class="{
                        checked: i === markHighlightIndex
                      }"
                      :key="i"
                      @click="highlightSptMark(i)"
                    >
                      <span class="index">{{ i + 1 }}</span>
                      <span class="text ellipsis">{{
                        mark.objectTypeName
                      }}</span>
                    </li>
                  </ul>
                </div>
              </template>
              <!-- 视频来源内容 -->
              <template v-else>
                <video
                  controls
                  controlsList="nodownload"
                  crossorigin
                  disablePictureInPicture
                  disable
                  key="sample-video"
                  loop
                  ref="videoDom"
                  :src="videoSrc"
                ></video>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section class="right">
        <h1>基础信息</h1>

        <!-- 信息数据 -->
        <div class="maps">
          <div
            v-for="{ key, text } of infoMaps"
            class="map"
            :key="key"
          >
            <div class="text">{{ text }}：</div>
            <div class="key ellipsis">
              {{ data[key] }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </ma-modal>

  <!-- 样本删除确认弹窗 -->
  <ma-modal
    v-if="delSpsModalShow"
    v-model:visible="delSpsModalShow"
    centered
    class="picturemark-small-modal"
    :confirm-loading="delSpsLoading"
    :maskClosable="false"
    title="删除"
    width="400"
    @ok="delSnapshot(delSnapshotId)"
  >
    <div class="tips">
      <p class="tip">
        删除后，该标注样本将无法进行训练使用。确认删除吗？
      </p>
      <p class="tip">删除后无法恢复。</p>
    </div>
  </ma-modal>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import apis from '@/api'
import { message } from 'ant-design-vue'
import { drawRectBy2p } from '@scripts/canvas-self-methods'

const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    },

    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['close'])

/* 左侧 */
// tabs
const tabs = reactive([
    {
      iconSrc: require('@images/ai_algorithm/icon_pic.png'),
      key: 'sample',
      text: '样本'
    },
    {
      iconSrc: require('@images/ai_algorithm/icon_vid.png'),
      key: 'video',
      text: '来源视频'
    }
  ]),
  // 当前活动tab
  activeTab = ref('sample')

// 监听当前活动tab
watch(activeTab, nV => {
  nV === 'video'
    ? videoDom.value?.play?.()
    : videoDom.value?.pause?.()
})

/* 删除弹窗 */
const delSpsModalShow = ref(false), // 删除弹窗显隐
  delSpsLoading = ref(false), // 删除loading
  delSnapshotId = ref(null), // 待删除的id
  // 删除指定截图
  delSnapshot = async screenshotId => {
    const msg = message.info('截图删除中···', 999)
    delSpsLoading.value = true
    await apis.events
      .delSnapshotByScreenshotId({
        screenshotId
      })
      .then(res => {
        console.log('截图删除成功 res', res)

        msg?.()
        message.success('截图删除成功')

        // 关闭确认删除弹窗
        delSpsModalShow.value = false

        // 关闭当前弹窗
        emits('close', true)
      })
      .catch(err => {
        console.log('截图删除失败 err', err)
        msg?.()
      })
      .finally(() => {
        delSpsLoading.value = false
      })
  },
  // 显示删除截图确认弹窗
  showDelSpsModal = () => {
    delSnapshotId.value = props.data.screenshotId
    delSpsModalShow.value = true
  }

/* 样本 */
const sample = ref({}), // 样本数据
  canvasDom = ref(),
  getSample = () =>
    apis.events
      .getSnapshotById({
        screenShotId: props.data.screenshotId
      })
      .then(res => {
        res.positionInfo.forEach(e => {
          /* eslint-disable-next-line */
          e.points = eval(e.positionStr)
        })

        sample.value = res

        initCCtx()
      }),
  // 初始化canvas和对应上下文对象
  initCCtx = () => {
    const mediaHeight = sample.value.height,
      mediaWidth = sample.value.width,
      hwRatio = mediaHeight / mediaWidth,
      maxHeight = globalThis.innerHeight * 0.6,
      maxWidth = maxHeight / 0.5625,
      height0 = Math.min(mediaWidth, maxWidth) * hwRatio

    if (height0 > maxHeight) {
      canvasHeight.value = maxHeight
      canvasWidth.value = maxHeight / hwRatio
    } else {
      canvasHeight.value = height0
      canvasWidth.value = Math.min(mediaWidth, maxWidth)
    }

    // 初始化  canvas 对应上下文对象
    ctx = canvasDom.value?.getContext('2d')

    nextTick(() => {
      ctx.lineWidth = 3
      ctx.strokeStyle = '#f00'
      ctx.lineJoin = 'round'

      drawMarks()
    })
  },
  markHighlightIndex = ref(null), // 高亮标记的下标
  // 高亮指定标记
  highlightSptMark = index => {
    if (index === markHighlightIndex.value) {
      // 重定高亮下标以实现再击取消高亮
      return highlightSptMark(999)
    }

    markHighlightIndex.value = index
    // 清空画布
    ctx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )
    // 遍历已绘标记重绘
    sample.value.positionInfo.forEach((mark, i) => {
      // 设置标框颜色
      ctx.strokeStyle = i === index ? '#fff' : '#f00'
      // 绘制标框
      drawRectBy2p(
        ctx,
        ...mark.points
          .map(e => ({
            x:
              (e.x / sample.value.width) *
              canvasWidth.value,
            y:
              (e.y / sample.value.height) *
              canvasHeight.value
          }))
          .reduce((acc, e) => {
            const { x, y } = e
            return (acc = acc.concat(x, y))
          }, [])
      )
    })
  },
  // 绘制标记在当前对应canvas上
  drawMarks = () => {
    // 清空画布
    ctx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )

    // 设置标框颜色
    ctx.strokeStyle = '#f00'

    // 遍历已绘标记重绘
    sample.value.positionInfo?.forEach(mark => {
      // 绘制标框
      drawRectBy2p(
        ctx,
        ...mark.points
          .map(e => ({
            x:
              (e.x / sample.value.width) *
              canvasWidth.value,
            y:
              (e.y / sample.value.height) *
              canvasHeight.value
          }))
          .reduce((acc, e) => {
            const { x, y } = e
            return (acc = acc.concat(x, y))
          }, [])
      )
    })
  }

// 图像宽高
const canvasHeight = ref(0),
  canvasWidth = ref(0)
let ctx // canvas的上下文对象

/* 视频来源 */
const videoSrc = ref(''), // 视频地址
  videoDom = ref(), // 视频dom
  // 获取视频地址
  getVideoSrc = () =>
    apis.events
      .getMediaByAlarmId({
        alarmId: props.data.alarmId
      })
      .then(res => {
        videoSrc.value = res?.data?.mediaUrl
      })

/* 右侧 */
// 信息map
const infoMaps = [
  {
    text: '报警设备位置',
    key: 'alaLoc'
  },
  // {
  //   text: '所属路段',
  //   key: 'roadName'
  // },
  // {
  //   text: '位置类型',
  //   key: 'alaLocType'
  // },
  {
    text: '管辖单位',
    key: 'orgName'
  },
  {
    text: '报警来源',
    key: 'corpName'
  },
  {
    text: '标注时间',
    key: 'markTime'
  },
  {
    text: '标注人',
    key: 'userName'
  }
]

// 监听 弹窗显隐
watch(
  () => props.visible,
  visible => {
    if (visible) {
      // 获取样本数据
      getSample()

      // 获取视频地址
      getVideoSrc()
    } else {
      // 重置配置
      reset()

      // 暂停视频播放
      videoDom.value?.pause?.()
    }
  }
)

// 重置部分参数配置
const reset = () => {
  // 重置tab
  activeTab.value = 'sample'

  // 重置样本数据
  sample.value = {}

  // 重置高亮下标
  markHighlightIndex.value = null
}
</script>

<style lang="less" scoped>
@gap: 20px;
.wrapper {
  display: flex;
  margin: -4px;

  section {
    &.left {
      margin-right: @gap;

      .action-bar {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-bottom: @gap;

        .tabs {
          display: flex;

          .tab {
            align-items: flex-start;
            color: #9ba3b0;
            cursor: pointer;
            display: flex;
            font-size: 1rem;
            filter: grayscale(1);
            margin-right: @gap;
            padding: 0 @gap;
            position: relative;
            transition: 0.2s;
            &::after {
              background-color: transparent;
              border-radius: 2px;
              bottom: calc(-@gap / 2 + 2px);
              content: '';
              height: 2px;
              left: 0;
              position: absolute;
              transition: 0.2s;
              transform: scaleX(0);
              transform-origin: center;
              width: 100%;
            }

            &:last-child {
              margin-right: 0;
            }
            &.active {
              color: #3f68da;
              filter: none;
              &::after {
                background-color: #3f68da;
                transform: scaleX(1);
              }
            }

            img {
              height: 1rem;
              margin-right: 0.5em;
            }

            span {
              line-height: 1rem;
            }
          }
        }
      }

      .view-wrap {
        // background-color: #00f3;
        height: 60vh;
        overflow: hidden;
        width: 106.667vh;

        .view-container {
          display: flex;
          height: 100%;
          transition: 0.5s;

          width: 200%;
          &.sample {
            transform: translateX(0);

            .sample {
              opacity: 1;
            }
          }
          &.video {
            transform: translateX(-50%);

            .video {
              opacity: 1;
            }
          }

          .view-content {
            height: 100%;
            opacity: 0;
            transition: 0.5s;
            width: 100%;
            &.sample {
              background: conic-gradient(
                  #eee 25%,
                  white 0deg 50%,
                  #eee 0deg 75%,
                  white 0deg
                )
                0 0 / 50px 50px;
              overflow: hidden;
              position: relative;

              canvas {
                left: 50%;
                position: absolute;
                top: 50%;
                transform: translate(-50%, -50%);
              }

              .mark-list {
                color: #fff;
                font-size: 0.8rem;
                height: calc(100% - 20px); /* no */
                position: absolute;
                right: 0;
                top: 0;
                width: 190px;

                .list-head {
                  background-color: #000a;
                  border-top: 1px solid #d7d7d7; /* no */
                  border-bottom: 1px solid #d7d7d7; /* no */
                  display: flex;
                  height: 2rem;
                  justify-content: space-between;
                  line-height: 2rem;
                  padding: 0 10px; /* no */

                  .col {
                    &.index {
                      width: 2rem;
                    }

                    &.text {
                      flex: 1;
                      text-align: center;
                    }
                  }
                }

                .list-body {
                  max-height: 100%;
                  margin-bottom: 0;
                  overflow-x: hidden;
                  overflow-y: hidden;
                  padding-inline-start: unset;
                  &:hover {
                    overflow-y: overlay;
                  }

                  li {
                    background-color: #0009;
                    border-bottom: 1px solid #d7d7d7; /* no */
                    display: flex;
                    height: 2rem;
                    justify-content: space-between;
                    line-height: 2rem;
                    padding: 0 10px; /* no */
                    transition: 0.1s;
                    &:hover,
                    &.checked {
                      background-color: #fffe;
                      color: #333;
                    }

                    .index {
                      width: 2rem;
                    }

                    .text {
                      flex: 1;
                      text-align: center;
                    }
                  }
                }
              }
            }
            &.video {
              video {
                background-color: #000;
                height: 100%;
              }
            }
          }
        }
      }
    }
    &.right {
      border: 1px solid #e8e8e8;
      color: #333;
      width: 17vw;
      min-width: 260px;

      * {
        margin: 0;
        padding: 0;
      }

      h1 {
        border-bottom: 1px solid #e8e8e8;
        font-size: 1rem;
        height: calc(32px + @gap);
        line-height: calc(32px + @gap);
        padding: 0 @gap;
      }

      .maps {
        font-size: 0.8rem;
        padding: @gap;
        .map {
          display: flex;
          margin-bottom: @gap;
          &:last-child {
            margin-bottom: 0;
          }

          .text {
            color: #666;
            text-align: right;
            white-space: nowrap;
            width: 86px;
          }
        }
      }
    }
  }
}
</style>
