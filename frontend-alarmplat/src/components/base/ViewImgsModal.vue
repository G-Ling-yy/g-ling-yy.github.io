<template>
  <ma-modal
    centered
    :maskClosable="false"
    :footer="null"
    :title="title"
    :visible="visible"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)"
    width="calc(70vh + 10vw + 80px)"
  >
    <div class="modal-container">
      <!-- loading -->
      <div v-if="loading" class="loading flex-center">
        <ma-spin size="large" />
      </div>

      <!-- 有数据正常渲染 -->
      <div
        v-show="!loading && imgs?.length"
        class="view-imgs-wrap"
      >
        <main>
          <div
            :class="['view-imgs-container', stagesClass[0]]"
          >
            <!-- 左侧图像显示 -->
            <section class="left flex-center">
              <!-- img背景图 -->
              <img
                :height="canvasHeight"
                :src="imgStages[0]?.imageUrl"
                :width="canvasWidth"
              />

              <!-- 图像显示canvas -->
              <canvas
                :height="canvasHeight"
                ref="canvasDom0"
                :width="canvasWidth"
              ></canvas>
            </section>

            <!-- 右侧标注信息 -->
            <section class="right">
              <div class="line">
                <!-- 标注时间点 -->
                <div class="text">
                  标注点：{{
                    Math.floor(imgStages[0]?.timestamp) ||
                    0
                  }}秒
                </div>
              </div>

              <!-- 标注列表 -->
              <div class="mark-list">
                <div class="list-head">
                  <div class="col index">序</div>
                  <div class="col text">标定对象</div>
                </div>
                <!-- 标记对象容器 -->
                <ul
                  v-show="
                    imgStages[0]?.positionInfo?.length
                  "
                  class="list-body"
                >
                  <li
                    v-for="(mark, i) of imgStages[0]
                      ?.positionInfo"
                    :key="i"
                    :style="{
                      backgroundColor:
                        i === markHighlightIndex
                          ? '#1890ff1a'
                          : ''
                    }"
                    @click="highlightSptMark(i)"
                  >
                    <span class="index">{{ i + 1 }}</span>
                    <span class="text ellipsis">{{
                      mark.objectTypeName
                    }}</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <!-- 另一个截图查看 -->
          <div
            :class="['view-imgs-container', stagesClass[1]]"
          >
            <!-- 左侧图像显示 -->
            <section class="left flex-center">
              <!-- img背景图 -->
              <img
                :height="canvasHeight"
                :src="imgStages[1]?.imageUrl"
                :width="canvasWidth"
              />

              <!-- 图像显示canvas -->
              <canvas
                :height="canvasHeight"
                ref="canvasDom1"
                :width="canvasWidth"
              ></canvas>
            </section>

            <!-- 右侧标注信息 -->
            <section class="right">
              <div class="line">
                <!-- 标注时间点 -->
                <div class="text">
                  标注点：{{
                    Math.floor(imgStages[1]?.timestamp) ||
                    0
                  }}秒
                </div>
              </div>

              <!-- 标注列表 -->
              <div class="mark-list">
                <div class="list-head">
                  <div class="col index">序</div>
                  <div class="col text">标注对象</div>
                </div>
                <!-- 标记对象容器 -->
                <ul
                  v-show="
                    imgStages[1]?.positionInfo?.length
                  "
                  class="list-body"
                >
                  <li
                    v-for="(mark, i) of imgStages[1]
                      ?.positionInfo"
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
            </section>
          </div>
        </main>

        <footer class="flex-center">
          <!-- 中间按钮 -->
          <div v-if="imgs.length > 1" class="btns center">
            <!-- 下标 -->
            <div class="index">
              <span>{{ curImgIndex + 1 }}</span> /
              {{ imgs.length }}
            </div>

            <!-- 上一个按钮 -->
            <ma-button @click="tabStage(curImgIndex - 1)"
              >上一个样本</ma-button
            >

            <!-- 下一个按钮 -->
            <ma-button
              type="primary"
              @click="tabStage(curImgIndex + 1)"
              >下一个样本</ma-button
            >
          </div>
          <div class="btns right">
            <!-- 删除按钮 -->
            <ma-button
              danger
              @click="delImgConfirmShow = true"
              >删除样本</ma-button
            >
          </div>
        </footer>
      </div>

      <!-- 数据为空 null -->
      <h2 v-show="!loading && !imgs?.length">
        查询数据为空
      </h2>
    </div>
  </ma-modal>

  <!-- 截图删除确认弹窗 -->
  <ma-modal
    v-if="delImgConfirmShow"
    v-model:visible="delImgConfirmShow"
    centered
    class="picturemark-small-modal"
    :confirm-loading="delImgLoading"
    :maskClosable="false"
    title="删除"
    width="400"
    @ok="delImg"
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
import { drawRectBy2p } from '@scripts/canvas-self-methods'
import { message } from 'ant-design-vue'
import apis from '@/api'
const {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted
} = require('vue')

const props = defineProps({
    index: {
      type: [Number, String],
      default: 0
    },

    imgs: {
      type: [Array, Object],
      default: () => []
    },

    loading: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: '弹窗'
    },

    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible', 'delImg'])

// 当前截图样本下标
const curImgIndex = ref(props.index || 0),
  // 截图样本查看数据存储
  imgStages = reactive([{}, {}]),
  // 查看类
  stagesClass = reactive(['', '']),
  // 当前截图样本查看数据存储下标
  curStageIndex = ref(0),
  // 一个canvas dom
  canvasDom0 = ref(),
  // 另一个canvas dom
  canvasDom1 = ref(),
  markHighlightIndex = ref(null), // 高亮标记的下标
  // 初始化canvas和对应上下文对象
  initCCtx = () => {
    const mediaHeight = props.imgs[props.index].height,
      mediaWidth = props.imgs[props.index].width,
      hwRatio = mediaHeight / mediaWidth,
      maxHeight = globalThis.innerHeight * 0.4,
      maxWidth = maxHeight / 0.5625,
      height0 = Math.min(mediaWidth, maxWidth) * hwRatio

    if (height0 > maxHeight) {
      canvasHeight.value = maxHeight
      canvasWidth.value = maxHeight / hwRatio
    } else {
      canvasHeight.value = height0
      canvasWidth.value = Math.min(mediaWidth, maxWidth)
    }

    // 初始化 各 canvas 对应上下文对象
    ctx0 = canvasDom0.value?.getContext('2d')
    ctx1 = canvasDom1.value?.getContext('2d')

    nextTick(() => {
      ctx0.lineWidth = 3
      ctx0.strokeStyle = '#f00'
      ctx0.lineJoin = 'round'

      ctx1.lineWidth = 3
      ctx1.strokeStyle = '#f00'
      ctx1.lineJoin = 'round'
    })
  },
  // 高亮指定标记
  highlightSptMark = index => {
    if (index === markHighlightIndex.value) {
      // 重定高亮下标以实现再击取消高亮
      return highlightSptMark(999)
    }

    markHighlightIndex.value = index

    const ctx = curStageIndex.value ? ctx1 : ctx0,
      data = imgStages[curStageIndex.value]

    // 清空画布
    ctx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )

    // 遍历已绘标记重绘
    data.positionInfo.forEach((mark, i) => {
      // 绘制标框
      ctx.strokeStyle = i === index ? '#fff' : '#f00'
      drawRectBy2p(
        ctx,
        ...mark.points
          .map(e => ({
            x: (e.x / data.width) * canvasWidth.value,
            y: (e.y / data.height) * canvasHeight.value
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
    const ctx = curStageIndex.value ? ctx1 : ctx0,
      data = imgStages[curStageIndex.value]
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
    data.positionInfo?.forEach(mark => {
      // 绘制标框
      drawRectBy2p(
        ctx,
        ...mark.points
          .map(e => ({
            x: (e.x / data.width) * canvasWidth.value,
            y: (e.y / data.height) * canvasHeight.value
          }))
          .reduce((acc, e) => {
            const { x, y } = e
            return (acc = acc.concat(x, y))
          }, [])
      )
    })
  },
  // 切换截图样本
  tabStage = index => {
    // 若 总个数 0/1个 且 在当前
    // if (props.imgs.length < 2 && curImgIndex.value < 1)
    //   return

    /* 动效控制 */
    const anotherStageIndex = curStageIndex.value ? 0 : 1
    // 若 上n个 向下翻动
    if (index < curImgIndex.value) {
      stagesClass[curStageIndex.value] = 'leave-to-bottom'
      stagesClass[anotherStageIndex] = 'enter-from-top'
    } else {
      stagesClass[curStageIndex.value] = 'leave-to-top'
      stagesClass[anotherStageIndex] = 'enter-from-bottom'
    }

    // 下标范围处理
    index = index >= props.imgs.length ? 0 : index
    curImgIndex.value =
      index < 0 ? props.imgs.length - 1 : index

    // 更新当前查看
    curStageIndex.value = anotherStageIndex

    // 更新数据并绘制标记
    imgStages[curStageIndex.value] =
      props.imgs[curImgIndex.value] || {}
    drawMarks()
  }

/* 删除确认弹窗相关 */
// 删除确认弹窗显隐
const delImgConfirmShow = ref(false),
  // 删除loading
  delImgLoading = ref(false),
  // 删除截图样本
  delImg = () => {
    const msg = message.info('截图删除中···', 999),
      screenshotId =
        imgStages[curStageIndex.value].screenShotId
    delImgLoading.value = true
    apis.events
      .delSnapshotByScreenshotId({
        screenshotId
      })
      .then(res => {
        console.log('截图删除成功 res', res)

        msg?.()
        message.success('截图删除成功')

        // 关闭确认删除弹窗
        delImgConfirmShow.value = false

        // 父组件传递删除截图样本信息
        emits('delImg', screenshotId)
      })
      .catch(err => {
        console.log('截图删除失败 err', err)
        msg?.()
      })
      .finally(() => {
        delImgLoading.value = false
      })
  }

// 图像宽高
let canvasHeight = ref(0),
  canvasWidth = ref(0),
  ctx0, // 一个canvas的上下文对象
  ctx1 // 另一个canvas的上下文对象

// 监听图像样本数量变更（如删除更新）
watch(
  () => props.imgs.length,
  (nV, oV) => {
    // 若 空数据
    if (!nV) {
      // 删除操作导致空数据则自动关闭弹窗
      oV && emits('update:visible', false)
      return
    }

    // 若 刚获取数据
    if (nV && !oV) {
      initCCtx()

      nextTick(() => {
        // 当前数据赋值并绘制标记
        imgStages[curStageIndex.value] =
          props.imgs[props.index]
        drawMarks()
      })

      return
    }

    let index = curImgIndex.value

    if (nV - 1 < curImgIndex.value) {
      index = nV - 1
    }

    // 切换截图样本
    tabStage(index)
  }
)

onMounted(() => {
  if (props.imgs.length) {
    initCCtx()

    nextTick(() => {
      // 当前数据赋值并绘制标记
      imgStages[curStageIndex.value] =
        props.imgs[props.index]
      drawMarks()
    })
  }
})
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.modal-container {
  .view-imgs-wrap {
    main {
      height: 40vh;
      margin-bottom: 15px;
      overflow: hidden;
      position: relative;
      .view-imgs-container {
        display: flex;
        left: 0;
        position: absolute;
        top: 0;
        & + .view-imgs-container {
          transform: translateY(100%);
        }
        &.enter-from-top {
          animation: enter-from-top linear 0.3s 1 forwards;
        }
        &.leave-to-top {
          animation: leave-to-top linear 0.3s 1 forwards;
        }
        &.enter-from-bottom {
          animation: enter-from-bottom linear 0.3s 1
            forwards;
        }
        &.leave-to-bottom {
          animation: leave-to-bottom linear 0.3s 1 forwards;
        }

        section {
          &.left {
            background: conic-gradient(
                #eee 25%,
                white 0deg 50%,
                #eee 0deg 75%,
                white 0deg
              )
              0 0 / 50px 50px;
            height: 40vh;
            margin-right: 15px;
            overflow: hidden;
            position: relative;
            width: calc(40vh / 0.5625);

            canvas {
              left: 50%;
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
          &.right {
            height: 40vh;
            width: 10vw;
            min-width: 170px; /* no */

            .line {
              align-items: center;
              display: flex;
              height: 20px; /* no */
              justify-content: space-between;
            }

            .mark-list {
              font-size: 0.8rem;
              height: calc(100% - 20px); /* no */

              .list-head {
                background-color: #f0f0f0;
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
                max-height: calc(100% - 2rem);
                margin-bottom: 0;
                overflow-x: hidden;
                overflow-y: hidden;
                padding-inline-start: unset;
                &:hover {
                  overflow-y: overlay;
                }

                li {
                  border-bottom: 1px solid #d7d7d7; /* no */
                  display: flex;
                  height: 2rem;
                  justify-content: space-between;
                  line-height: 2rem;
                  padding: 0 10px; /* no */
                  transition: 0.1s;
                  &:hover,
                  &.checked {
                    background-color: #1890ff1a;
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
        }
      }
    }

    footer {
      border-top: 1px solid #e3e3e3;
      height: 4rem;
      margin: 0 -24px -24px;
      position: relative;

      .btns {
        &.center {
          align-items: center;
          display: flex;
          position: relative;

          .index {
            left: -15px;
            position: absolute;
            transform: translateX(-100%);
            white-space: nowrap;

            span {
              color: @layout-color;
            }
          }

          .ant-btn + .ant-btn {
            margin-left: 15px;
          }
        }
        &.right {
          position: absolute;
          right: 15px;
        }
        .ant-btn {
          padding: 0 10px;
        }
      }
    }
  }

  /* 查询数据为空 */
  h2 {
    color: #aaa;
    height: 30vh;
    line-height: 30vh;
    text-align: center;
  }

  /* loading */
  .loading {
    min-height: 30vh;
  }
}
</style>

<style lang="less">
/* 图像标注小弹窗 */
.ant-modal.picturemark-small-modal {
  .ant-modal-content {
    .ant-modal-header {
      border-bottom: none;

      .ant-modal-title {
        font-weight: bold;
      }
    }

    .ant-modal-body {
      .pic-modal-wrapper {
        display: flex;
        justify-content: center;

        .ant-radio-group {
          margin-left: 1rem;

          .ant-radio-wrapper {
            margin-bottom: 1rem;
          }
        }
      }

      .tips {
        .tip + .tip {
          color: #999;
        }
      }
    }

    .ant-modal-footer {
      border-top: none;
      text-align: center;
    }
  }
}
</style>
