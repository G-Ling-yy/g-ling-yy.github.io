<template>
  <div v-show="show" class="snapshot-wrapper flex-center">
    <div class="snapshot-container">
      <header>
        <h1>样本标注</h1>

        <!-- 关闭弹窗按钮 -->
        <icon
          class="btn"
          icon="close-fill"
          title="关闭"
          @click="cancelSnapShot"
        />
      </header>

      <main>
        <!-- 左侧显示 -->
        <section class="left">
          <div class="tip">
            将要标注：<span>{{ snapshotData.name }}</span>
          </div>

          <!-- 对象选择 -->
          <div class="tabs-wrapper">
            <div class="tabs-head">更改对象为：</div>
            <div class="tabs-body">
              <template
                v-for="(
                  { className, classType, options }, i
                ) of typeOptions"
                :key="i"
              >
                <div class="body-block">
                  <div class="block-name">
                    {{ className }} —
                  </div>
                  <div class="block-content">
                    <div
                      v-for="opt of options"
                      :class="[
                        'opt btn',
                        opt.value === snapshotData.type &&
                          'active'
                      ]"
                      :key="opt.key"
                      @click="
                        tabTypeOption(
                          opt,
                          className,
                          classType
                        )
                      "
                    >
                      {{ opt.key }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </section>
        <aside class="seat" />

        <!-- 中间显示 -->
        <section class="middle">
          <div class="snapshot-area flex-center">
            <!-- 截图背景canvas -->
            <canvas
              :height="canvasHeight"
              ref="bgCanvasDom"
              :width="canvasWidth"
            ></canvas>

            <div class="snap-canvas-wrap">
              <!-- 截图效果canvas -->
              <canvas
                :height="canvasHeight"
                :width="canvasWidth"
                ref="canvasDom"
                @mouseenter="snapshotMouseEnterHandler"
                @mousedown="snapshotMouseDownHandler"
                @mouseup="snapshotMouseUpHandler"
                @mouseleave="snapshotMouseLeaveHandler"
                @mousemove="snapshotMouseMoveHandler"
                @contextmenu.prevent
              ></canvas>

              <!-- 辅助线及提示 -->
              <div
                v-show="assistLineTipShow"
                class="assist"
              >
                <!-- 小块 -->
                <div class="little-block"></div>

                <!-- 提示 -->
                <div class="tip">
                  左击进行绘制，右击取消绘制状态
                </div>
              </div>
            </div>

            <!-- 截图保存canvas -->
            <canvas
              :height="imageHeight"
              hidden
              ref="hiddenCanvasDom"
              style="
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
              "
              :width="imageWidth"
            ></canvas>
          </div>
        </section>

        <!-- 右侧显示 -->
        <section class="right">
          <div class="line">
            <!-- 标注时间点 -->
            <div class="text">
              标注点：{{
                Math.floor(media?.currentTime) || 0
              }}秒
            </div>
            <!-- 一键清空标注 -->
            <icon
              class="btn"
              icon="brush-3-line"
              title="清空"
              @click="clearSnapShot"
            />
          </div>

          <!-- 标注列表 -->
          <div class="mark-list">
            <div class="list-head">
              <div class="col index">序</div>
              <div class="col text">标注对象</div>
              <div class="col opt">操作</div>
            </div>
            <!-- 标记对象容器 -->
            <ul v-show="marksData.length" class="list-body">
              <li
                v-for="(mark, i) of marksData"
                :class="{
                  checked: i === markHighlightIndex
                }"
                :key="i"
                @click="highlightSptMark(i)"
              >
                <span class="index">{{ i + 1 }}</span>
                <span class="text ellipsis">{{
                  mark.name
                }}</span>
                <span class="opt"
                  ><icon
                    class="btn"
                    icon="close-fill"
                    title="删除"
                    @click.stop="delSnapshotMark(i)"
                /></span>
              </li>
            </ul>
          </div>
        </section>
        <aside class="seat" />
      </main>

      <footer class="flex-center">
        <!-- 操作按钮 -->
        <div class="btns">
          <!-- 取消按钮 -->
          <ma-button @click="cancelSnapShot">
            取消
          </ma-button>

          <!-- 保存按钮 -->
          <ma-button
            :loading="snapPostLoading"
            type="primary"
            @click="saveSnapShot"
          >
            保存
          </ma-button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  nextTick
} from 'vue'
import { useStore } from 'vuex'
import apis from '@/api'
import { drawRectBy2p } from '@scripts/canvas-self-methods'
import { message } from 'ant-design-vue'

const props = defineProps({
    media: {
      type: Object,
      default: () => null
    },

    // 额外数据
    extraData: {
      type: Object,
      default: () => ({})
    },

    show: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['close', 'saved']),
  store = useStore()

// 用户部分信息
const userInfo = reactive({
  userId: store.getters['user/userId']
})

let ctx, // 截图canvas上下文对象
  bgCtx, // 截图背景canvas上下文对象
  hdCtx, // 隐藏截图canvas上下文对象
  startPoint = [], // 标记起点
  endPoint = [] // 标记终点

const bgCanvasDom = ref(), // 背景canvas元素dom
  canvasDom = ref(), // 截图canvas元素dom
  hiddenCanvasDom = ref(), // 隐藏canvas元素dom 用于实际保存图片
  canvasHeight = ref(0), // canvas元素高度
  canvasWidth = ref(0), // canvas元素宽度
  imageHeight = ref(0), // 隐藏canvas元素高度
  imageWidth = ref(0), // 隐藏canvas元素宽度
  snapPostLoading = ref(false), // 截图上传loading
  isEditStart = ref(false), // 编辑开始与否
  isWaitToDeling = ref(false), // 待删与否
  marksData = ref([]), // 已绘标记数据
  markHighlightIndex = ref(null), // 高亮标记的下标
  // 截图信息数据
  snapshotData = reactive({
    name: '行人',
    type: 'person',
    className: '人',
    classType: 'class_type_person'
  }),
  // 类型选项
  typeOptions = computed(() => {
    const ren =
        store.state.dataDictionary['class_type_person'],
      che =
        store.state.dataDictionary['class_type_vehicle'],
      wu = store.state.dataDictionary['class_type_object'],
      result = []

    result[0] = {
      className: '人',
      classType: 'class_type_person',
      options: ren
    }

    result[1] = {
      className: '车',
      classType: 'class_type_vehicle',
      options: che
    }

    result[2] = {
      className: '物',
      classType: 'class_type_object',
      options: wu
    }

    return result
  }),
  // 类型颜色map
  typeColorMap = {
    construction: '#B41EE0', // 施工区域
    person: '#3A9BEF', // 行人
    n_vehicles: '#36EADE', // 非机动车
    vehicles: '#F9D322', // 一般机动车
    builder: '#AE37A4', // 施工人员
    sedan: '#37BF49', // 小客车
    trucks: '#EE9E5E', // 货车
    coach: '#E65EEE', // 中大客车
    other: '#4AD985', // 其他
    traffic_police: '#4355CE', // 交警
    maintenance_personnel: '#EA367E', // 养护人员
    obstacle_removal_personnel: '#0D8802', // 排障人员
    maintenance_construction_vehicle: '#97921B', // 养护施工车
    anti_collision_vehicle: '#6C4646', // 防撞车
    police_car: '#FF120C', // 警车
    stationary_object: '#3489EE', // 静止物
    falling_objects: '#FFF621', // 坠落物
    road_vehicle: '#85E140', // 道路车辆
    camera: '#808080', // 摄像机
    motor_vehicle: '#2E8EC3', // 机动车
    bus: '#97581B', // 公交车
    motorcycle: '#B26161', // 摩托车
    bike: '#01DFBB', // 自行车
    van: '#6C99CE', // 面包车
    tricycle: '#FF6A6A', // 三轮车
    small_truck: '#FF64D5', // 小货车
    medium_truck: '#B0A246', // 中货车
    big_truck: '#A28E7A', // 大货车
    dangerous_goods_vehicle: '#FFAC6A', // 危险品车
    tripod: '#B354D2', // 三脚架
    cone_barrel: '#C6194D', // 锥桶
    water_horse: '#A0C42E', // 水马
    tyre: '#1890ff', // 轮胎
    spillage: '#11C320', // 抛洒物
    section_flow: '#64FFE6', // 断面流量
    section_velocity: '#443D03' // 断面速度
  },
  // 切换类型选项
  tabTypeOption = (opt, className, classType) => {
    snapshotData.type = opt.value
    snapshotData.name = opt.key
    snapshotData.className = className
    snapshotData.classType = classType
  },
  // 初始化截图canvas尺寸和ctx
  initCCtx = () => {
    // 设置canvas宽高及上下文对象
    // 需求定死框尺寸，canvas图在框里contain显示
    const hwRatio =
        props.media.videoHeight / props.media.videoWidth,
      maxHeight = globalThis.innerWidth * 0.3375,
      maxWidth = globalThis.innerWidth * 0.6,
      // 最小高度 562.5px
      height0 = Math.max(
        Math.min(props.media.videoWidth, maxWidth) *
          hwRatio,
        562.5
      )

    if (height0 > maxHeight) {
      canvasHeight.value = maxHeight
      canvasWidth.value = maxHeight / hwRatio
    } else {
      canvasHeight.value = height0
      canvasWidth.value = height0 / hwRatio
    }

    // 更新隐藏canvas尺寸
    imageHeight.value = props.media.videoHeight
    imageWidth.value = props.media.videoWidth

    !bgCtx && (bgCtx = bgCanvasDom.value.getContext('2d'))
    !ctx && (ctx = canvasDom.value.getContext('2d'))
    !hdCtx &&
      (hdCtx = hiddenCanvasDom.value.getContext('2d'))

    nextTick(() => {
      // 背景canvas画背景
      bgCtx.drawImage(
        props.media,
        0,
        0,
        canvasWidth.value,
        canvasHeight.value
      )

      // 隐藏的canvas画原始图
      hdCtx.drawImage(props.media, 0, 0)

      ctx.lineWidth = 3
      ctx.strokeStyle = '#1890ff'
      ctx.lineJoin = 'round'
    })

    /* 标注对象字典检查 */
    judgeMarkTypeOpts()
  },
  // 保存截图
  saveSnapShot = () => {
    // 若 无标记
    if (!marksData.value?.length) {
      message.warning(
        '请确认截图保存前应至少有一个标注对象'
      )
      return
    }

    snapPostLoading.value = true
    const msg = message.info('截图保存上传中···', 999)

    const url = hiddenCanvasDom.value.toDataURL(),
      blob = dataURLToBlob(url),
      position = marksData.value.map(e => ({
        className: e.className,
        classType: e.classType,
        objectType: e.type,
        objectTypeName: e.name,
        positionStr: `[{x: ${e.realPoints[0]}, y: ${e.realPoints[1]}}, {x: ${e.realPoints[2]}, y: ${e.realPoints[3]}}]`
      })),
      data = JSON.stringify({
        alarmId: props.extraData.alarmId,
        userId: userInfo.userId,
        timestamp: props.media.currentTime,
        frameIndex: props.extraData.frameIndex,
        height: props.media.videoHeight,
        width: props.media.videoWidth,
        position
      }),
      formData = new FormData()

    formData.append(
      'file',
      blob,
      `${userInfo.userId}_${Date.now()}.jpg`
    )
    formData.append('data', data)

    apis.events
      .uploadSnapshot(formData)
      .then(res => {
        console.log('截图保存上传成功 res', res)
        msg?.()
        message.success('截图保存上传成功')

        emits('saved')
        cancelSnapShot()
      })
      .catch(err => {
        console.log('截图保存上传失败 err', err)
        msg?.()
      })
      .finally(() => {
        snapPostLoading.value = false
      })
  },
  // dataURL 转 blob
  dataURLToBlob = dataURL => {
    // base64转buffer
    const byteString = window.atob(dataURL.split(',')[1]),
      mimeString = dataURL.split(',')[0].match(/:(.*?);/)[1]

    //处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(byteString.length),
      u8a = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      u8a[i] = byteString.charCodeAt(i)
    }

    return new Blob([ab], { type: mimeString })
  },
  // 截图鼠标按下
  snapshotMouseDownHandler = ({
    button,
    offsetX,
    offsetY
  }) => {
    // 若 主键触发（默认左键）
    if (button === 0) {
      // 编辑开始
      isEditStart.value = true

      // 标记起点赋值
      startPoint = [offsetX, offsetY]
    }
    // 若 非主键触发（默认右键）
    else if (button === 2) {
      // 标记待删
      isWaitToDeling.value = true
    }
  },
  // 截图鼠标移动
  snapshotMouseMoveHandler = ({ offsetX, offsetY }) => {
    // 更新当前鼠标点位
    mousePostion.x = `${offsetX}px`
    mousePostion.y = `${offsetY}px`

    if (isEditStart.value) {
      // 标记终点赋值
      endPoint = [offsetX, offsetY]

      // 清除绘制
      ctx.clearRect(
        0,
        0,
        canvasWidth.value,
        canvasHeight.value
      )

      // 遍历已绘标记重绘
      marksData.value.forEach((mark, i) => {
        // 绘制标框
        ctx.strokeStyle =
          i === markHighlightIndex.value
            ? '#fff'
            : mark.color
        drawRectBy2p(ctx, ...mark.points)
        // 绘制填充色
        ctx.fillStyle = `${mark.color}33`
        drawRectBy2p(ctx, ...mark.points, true)
      })

      // 绘制标框
      ctx.strokeStyle = typeColorMap[snapshotData.type]
      drawRectBy2p(
        ctx,
        startPoint[0],
        startPoint[1],
        offsetX,
        offsetY
      )
      // 绘制填充色
      ctx.fillStyle = `${typeColorMap[snapshotData.type]}33`
      drawRectBy2p(
        ctx,
        startPoint[0],
        startPoint[1],
        offsetX,
        offsetY,
        true
      )
    }
  },
  // 截图鼠标抬起
  snapshotMouseUpHandler = ({ offsetX, offsetY }) => {
    // 若 右键待删
    if (isWaitToDeling.value) {
      // 若 在编辑状态
      if (isEditStart.value) {
        // 清除绘制
        ctx.clearRect(
          0,
          0,
          canvasWidth.value,
          canvasHeight.value
        )

        // 遍历已绘标记重绘
        marksData.value.forEach((mark, i) => {
          // 绘制标框
          ctx.strokeStyle =
            i === markHighlightIndex.value
              ? '#fff'
              : mark.color
          drawRectBy2p(ctx, ...mark.points)
          // 绘制填充色
          ctx.fillStyle = `${mark.color}33`
          drawRectBy2p(ctx, ...mark.points, true)
        })

        // 待删标记取消
        isWaitToDeling.value = false
        // 当前编辑结束
        isEditStart.value = false
      } else {
        // 倒序删除标记
        delSnapshotMark()
      }
    }

    // 若 未在编辑状态
    if (!isEditStart.value) return

    // 标记终点赋值
    endPoint = [offsetX, offsetY]
    // 当前编辑结束
    isEditStart.value = false

    if (
      startPoint[0] === endPoint[0] &&
      startPoint[1] === endPoint[1]
    )
      return

    // 保存标记数据
    const ratio =
        props.media.videoHeight / canvasHeight.value,
      points = [
        startPoint[0],
        startPoint[1],
        endPoint[0],
        endPoint[1]
      ]
    marksData.value.push({
      color: typeColorMap[snapshotData.type],
      type: snapshotData.type,
      name: snapshotData.name,
      className: snapshotData.className,
      classType: snapshotData.classType,
      points,
      realPoints: points.map(e => Math.round(e * ratio))
    })
  },
  // 截图鼠标移入
  snapshotMouseEnterHandler = () => {
    // 隐藏辅助线和提示
    assistLineTipShow.value = true
  },
  // 截图鼠标移出
  snapshotMouseLeaveHandler = e => {
    // 隐藏辅助线和提示
    assistLineTipShow.value = false

    // 待删标记取消
    isWaitToDeling.value = false

    isEditStart.value && snapshotMouseUpHandler(e)
  },
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
    marksData.value.forEach((mark, i) => {
      // 绘制标框
      ctx.strokeStyle = i === index ? '#fff' : mark.color
      drawRectBy2p(ctx, ...mark.points)
      // 绘制填充色
      ctx.fillStyle = `${mark.color}33`
      drawRectBy2p(ctx, ...mark.points, true)
    })
  },
  // 删除指定标记（默认删最后一个）
  delSnapshotMark = (index = -1) => {
    marksData.value.splice(index, 1)
    // 清空画布
    ctx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )

    // 清除高亮
    markHighlightIndex.value = null

    // 遍历已绘标记重绘
    marksData.value.forEach(mark => {
      // 绘制标框
      ctx.strokeStyle = mark.color
      drawRectBy2p(ctx, ...mark.points)
      // 绘制填充色
      ctx.fillStyle = `${mark.color}33`
      drawRectBy2p(ctx, ...mark.points, true)
    })

    // 待删标记取消
    isWaitToDeling.value = false
  },
  // 清空已绘内容
  clearSnapShot = () => {
    ctx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )

    // 清空已绘箭头数据
    marksData.value = []

    // 清除高亮
    markHighlightIndex.value = null
  },
  // 取消截图
  cancelSnapShot = () => {
    clearSnapShot()

    bgCtx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )

    hdCtx.clearRect(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )

    emits('close')
  },
  // 判断标注对象数据
  judgeMarkTypeOpts = () => {
    /* 标注对象字典检查 */
    // 人 对象
    store.dispatch(
      'dataDictionary/checkDicByKey',
      'class_type_person'
    )

    // 车 对象
    store.dispatch(
      'dataDictionary/checkDicByKey',
      'class_type_vehicle'
    )

    // 物 对象
    store.dispatch(
      'dataDictionary/checkDicByKey',
      'class_type_object'
    )
  }

/* 辅助线和提示 */
const mousePostion = reactive({
    x: '',
    y: ''
  }),
  assistLineTipShow = ref(false)

onMounted(() => {
  watch(
    () => props.show,
    nV => {
      nV && initCCtx()
    }
  )

  /* 标注对象字典检查 */
  judgeMarkTypeOpts()
})
</script>

<style lang="less" scoped>
.snapshot-wrapper {
  animation: opacity-hide 0.6s 1 reverse forwards;
  background-color: #0006;
  height: 100vh;
  left: 0 !important;
  position: fixed !important;
  top: 0 !important;
  width: 100vw;
  z-index: 99;
  //修改弹窗位置
  ::v-deep(.snapshot-container){
    background-color: #fff;
    position: relative;
    max-width: 100%;
    header {
      height: 3rem;
      line-height: 3rem;
      position: relative;

      h1 {
        font-size: 1.1rem;
        font-weight: bold;
        padding-left: 20px;
      }

      i {
        color: #4c4c4c;
        font-size: 2rem;
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    main {
      display: flex;
      position: relative;

      section {
        &.left {
          height: 100%;
          left: 0;
          margin-left: 20px;
          position: absolute;
          width: 13vw;
          min-width: 240px; /* no */
          & + aside.seat {
            margin-left: 20px;
            width: 13vw;
            min-width: 240px; /* no */
          }

          .tip {
            color: @layout-color;
            font-size: 1rem;
            font-weight: bold;
            height: 3rem;
          }

          .tabs-wrapper {
            height: calc(100% - 3rem);

            .tabs-head {
              display: flex;
              height: 1.5rem;
              margin-bottom: 1rem;

              span {
                border-bottom: 2px solid transparent; /* no */
                cursor: pointer;
                flex: 1;
                text-align: center;
                transition: 0.3s;
                &.active {
                  border-bottom-color: @layout-color; /* no */
                }
              }
            }

            .tabs-body {
              height: calc(100% - 2rem);
              overflow-x: hidden;
              overflow-y: hidden;
              &:hover {
                overflow-y: overlay;
              }

              .body-block {
                display: flex;

                .block-name {
                  font-size: 1rem;
                  font-weight: bold;
                  margin-right: 0.5em;
                }

                .block-content {
                  display: flex;
                  flex: 1;
                  flex-wrap: wrap;

                  .opt {
                    border: 1px solid #e3e3e3; /* no */
                    border-radius: 1.5rem;
                    color: #235c84;
                    font-size: 0.7rem;
                    height: 1.5rem;
                    line-height: calc(
                      1.5rem - 2px
                    ); /* no */
                    margin: 0 0.4rem 1rem 0;
                    padding: 0 0.6rem;
                    &.active {
                      background-color: #b5cbdb7f;
                    }
                  }
                }
              }

              .body-content {
                display: flex;
                flex-wrap: wrap;
                max-height: 100%;
                overflow-x: hidden;
                overflow-y: hidden;
                &:hover {
                  overflow-y: overlay;
                }

                .opt {
                  border: 1px solid #e3e3e3; /* no */
                  border-radius: 1.5rem;
                  color: #235c84;
                  font-size: 0.7rem;
                  height: 1.5rem;
                  line-height: calc(1.5rem - 2px); /* no */
                  margin: 0 0.3rem 0.6rem 0;
                  padding: 0 0.6rem;
                  &.active {
                    background-color: #b5cbdb7f;
                  }
                }
              }
            }
          }
        }

        &.middle {
          margin: 0 0.5rem;
          .snapshot-area {
            background: conic-gradient(
                #eee 25%,
                white 0deg 50%,
                #eee 0deg 75%,
                white 0deg
              )
              0 0 / 50px 50px;
            height: 33.75vw;
            min-height: 33.75vw; /* no */
            position: relative;
            width: 60vw;
            min-width: 60vw; /* no */

            canvas {
              cursor: none;
              display: block;
            }

            .snap-canvas-wrap {
              bottom: 0;
              cursor: crosshair;
              height: fit-content;
              left: 0;
              margin: auto;
              position: absolute;
              right: 0;
              top: 0;
              width: fit-content;

              .assist {
                height: 100%;
                left: 0;
                pointer-events: none;
                position: absolute;
                top: 0;
                width: 100%;
                &::after,
                &::before {
                  background-color: #ff3939fe;
                  content: '';
                  display: block;
                  position: absolute;
                }
                &::after {
                  height: 100%;
                  left: v-bind('mousePostion.x');
                  width: 1px;
                }
                &::before {
                  height: 1px;
                  top: v-bind('mousePostion.y');
                  width: 100%;
                }

                .little-block {
                  background-color: #ff3939fe;
                  height: 6px;
                  left: v-bind('mousePostion.x');
                  position: absolute;
                  top: v-bind('mousePostion.y');
                  transform: translate(-3px, -3px);
                  width: 6px;
                }

                .tip {
                  background-color: #0009;
                  border-radius: 4px;
                  color: #fff;
                  left: v-bind('mousePostion.x');
                  padding: 0 8px;
                  position: absolute;
                  top: v-bind('mousePostion.y');
                  transform: translate(100px, 100px);
                  white-space: nowrap;
                  z-index: 1;
                }
              }
            }
          }
        }

        &.right {
          height: 100%;
          position: absolute;
          margin-right: 10px;
          right: 0;
          width: 10vw;
          min-width: 170px; /* no */
          & + aside.seat {
            margin-right: 10px;
            width: 10vw;
            min-width: 170px; /* no */
          }

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

                &.opt {
                  text-align: right;
                  width: 3rem;
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

                .opt {
                  overflow: hidden;
                  padding-right: 4px; /* no */
                  text-align: right;
                  width: 3rem;

                  i {
                    color: #f8441a;
                    font-size: 1.2rem;
                  }
                }
              }
            }
          }
        }
      }
    }

    footer {
      height: 3.5rem;
      .btns {
        display: flex;
        button {
          margin-right: 1rem;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
