<template>
  <div class="wrapper">
    <aside class="left">
      <div class="head">
        <h1>报警视频</h1>
      </div>

      <div class="body">
        <!-- 条件 -->
        <div class="conditions">
          <!-- 标注与否 -->
          <ma-select
            allowClear
            placeholder="是否标注"
            size="small"
            style="margin-right: 0.5rem; width: 95px"
            v-model:value="cdsData.isAnnotated"
          >
            <ma-select-option :value="1"
              >已标注</ma-select-option
            >
            <ma-select-option :value="0"
              >未标注</ma-select-option
            >
          </ma-select>

          <!-- 事件类型 -->
          <ma-select
            allowClear
            :loading="evtLoading"
            placeholder="事件类型"
            size="small"
            style="
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              flex: 1;
            "
            v-model:value="cdsData.evtType"
          >
            <ma-select-option
              v-for="opt of evtOptions"
              :key="opt.key"
              :value="opt.value"
              >{{ opt.key }}</ma-select-option
            >
          </ma-select>

          <!-- 搜索按钮 -->
          <div class="search btn" @click="getBodies">
            <icon icon="search-line" />
          </div>
        </div>
        <!-- 条件 -->
        <div class="conditions">
          <!-- 全选 -->
          <ma-checkbox v-model:checked="isAllChecked"
            >全选</ma-checkbox
          >

          <!-- 批量 -->
          <div
            class="batch btn"
            @click="batchModalShow = true"
          >
            <icon icon="file-copy-line" /><span>批量</span>
          </div>

          <!-- 批量弹窗 -->
          <ma-modal
            v-model:visible="batchModalShow"
            :afterClose="() => (batchValue = 0)"
            centered
            class="picturemark-small-modal"
            :maskClosable="false"
            title="批量操作"
            @ok="batchModalOkHandler"
          >
            <div class="pic-modal-wrapper">
              <div>请选择批量：</div>

              <ma-radio-group v-model:value="batchValue">
                <ma-radio :value="0"
                  >批量标注完成——选中</ma-radio
                >

                <br />

                <ma-radio :value="1"
                  >批量标注完成——已标注（全部）</ma-radio
                >
              </ma-radio-group>
            </div>
          </ma-modal>

          <!-- 日期 -->
          <ma-date-picker
            :allowClear="false"
            :bordered="false"
            class="only-text"
            :defaultValue="dateDefaultValue"
            inputReadOnly
            placeholder="事件时间"
            size="small"
            suffix-icon=""
            valueFormat="YYYY-MM-DD"
            @change="
              date => {
                cdsData.date = date
                getBodies()
              }
            "
          >
          </ma-date-picker>
        </div>

        <!-- bodies列表 -->
        <ul v-if="bodies.length" class="bodies">
          <li
            v-for="(body, i) of bodies"
            :class="[
              'body',
              i === curBodyIndex && 'active',
              body.hide && 'hide'
            ]"
            :key="i"
            @animationend="
              ({ target }) =>
                target.matches('li.body') && getBodies()
            "
          >
            <div class="line">
              <span class="index">{{ i + 1 }}</span>

              <!-- 选择框 -->
              <ma-checkbox v-model:checked="body.checked" />
            </div>
            <div
              class="card"
              :style="{
                background: `url(${
                  body.coverImage
                }) 0 0 / cover  no-repeat, url(${getDefaultPoster(
                  body.eventType
                )}) center / 50% no-repeat #4f556e`
              }"
            >
              <div class="bottom">
                <div class="left">
                  <!-- 播放图标 -->
                  <icon
                    v-show="i !== curBodyIndex"
                    icon="play-circle-fill"
                  />
                  <icon
                    v-show="i === curBodyIndex"
                    icon="voiceprint-fill"
                  />

                  <!-- 类型和厂商 -->
                  <div class="text">
                    {{ body.eventTypeName }} | 厂商：{{
                      body.corpNum
                    }}
                  </div>
                </div>
                <div class="right">
                  <!-- 已标 -->
                  <div
                    v-if="body.annotationNum > 0"
                    class="text"
                  >
                    已标 {{ body.annotationNum }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 事件响应层 -->
            <div
              class="event-layer"
              @click="tabBody(body, i)"
            />
          </li>
        </ul>
        <!-- 空数据提示 -->
        <div v-else class="tip-wrap flex-center">
          <div class="tip-content">
            <div class="bg"></div>
            <div class="text">暂无报警数据</div>
          </div>
        </div>
        <!-- loading层 -->
        <div
          class="loading flex-center"
          v-show="bodiesLoading"
        >
          <ma-spin size="large" />
        </div>
      </div>
    </aside>

    <main class="flex-center">
      <div class="top">
        <!-- 对象类型 -->
        <div class="text type">
          {{
            HisData[curPlayerIndex]?.objectTypeName || '--'
          }}
          -
          {{ bodies[curBodyIndex]?.eventTypeName || '--' }}
        </div>

        <!-- 下标数据 -->
        <div class="text">
          原始报警视频
          <span class="index">{{ curHisIndex }}</span> /
          <span class="total">{{
            curHisTotal || '1'
          }}</span>
        </div>
      </div>

      <!-- 播放区域 -->
      <div class="players-wrapper">
        <div class="players-container">
          <!-- 播放器 -->
          <div
            class="player-wrapper"
            :class="playerWrapperClass[0]"
            mark="0"
          >
            <video
              autoplay
              controls
              controlsList="nodownload"
              crossorigin
              disablePictureInPicture
              disable
              loop
              muted
              ref="videoDom0"
              :src="HisData[0].mediaUrl"
              @canplay="videoCanplayHandler"
            ></video>
          </div>
          <div
            class="player-wrapper"
            :class="playerWrapperClass[1]"
            mark="1"
          >
            <video
              autoplay
              controls
              controlsList="nodownload"
              crossorigin
              disablePictureInPicture
              disable
              loop
              muted
              ref="videoDom1"
              :src="HisData[1].mediaUrl"
              @canplay="videoCanplayHandler"
            ></video>
          </div>
        </div>

        <!-- 上一个按钮 -->
        <div
          v-show="curHisTotal > 1"
          class="previous btn flex-center"
          @click="tabHis(curHisIndex - 1)"
        >
          <icon icon="arrow-left-s-line" />
        </div>
        <!-- 下一个按钮 -->
        <div
          v-show="curHisTotal > 1"
          class="next btn flex-center"
          @click="tabHis(curHisIndex + 1)"
        >
          <icon icon="arrow-right-s-line" />
        </div>
      </div>

      <div class="bottom">
        <!-- 提示 -->
        <div class="tip">
          注：单个视频标注图像最大为支持20张。
        </div>

        <div class="middle">
          <!-- 播放时间 -->
          <div class="play-time">
            播放时间：<span class="time">{{
              curPlayerTime
            }}</span
            >秒
          </div>

          <!-- 添加标注按钮 -->
          <div class="add-mark btn" @click="addMarks">
            + 添加标注
          </div>
        </div>

        <div class="right">
          <!-- 归档按钮 -->
          <div class="cancel btn" @click="fileBodies()">
            完成标注
          </div>
        </div>
      </div>

      <!-- 空数据提示 -->
      <div
        v-show="!bodies.length"
        class="tip-wrap flex-center"
      >
        <div class="bg"></div>
        <div class="tip-content">
          <div class="bg"></div>
          <div class="text">暂无视频</div>
        </div>
      </div>
    </main>

    <aside class="right">
      <div class="head">
        <h1>标注样本详情</h1>
        <div
          class="link btn"
          @click="router.push('/sample/aialgorithm')"
        >
          查看样本库
        </div>
      </div>

      <div class="body">
        <ul v-if="snapshots.length" class="snapshots">
          <li
            v-for="(snapshot, i) of snapshots"
            class="snapshot"
            :key="snapshot.screenShotId"
            :style="{
              backgroundImage: `url(${snapshot.imageUrl})`
            }"
            @click="showViewImgsModal(i)"
          >
            <!-- 删除按钮 -->
            <div
              class="del-btn flex-center"
              @click.stop="
                showDelSpsModal(snapshot.screenShotId)
              "
            >
              <icon icon="close-line" />
            </div>

            <div class="bottom">
              <div class="text">
                {{ Math.floor(snapshot.timestamp) || 0 }} 秒
              </div>
              <div class="text">
                标注对象：{{
                  snapshot.positionInfo?.length || 0
                }}
              </div>
            </div>
          </li>
        </ul>
        <!-- 空数据提示 -->
        <div
          v-else-if="!snapshots.length && !snapshotLoading"
          class="tip-wrap flex-center"
        >
          <div class="tip-content">
            <div class="bg"></div>
            <div class="text">暂无样本数据</div>
          </div>
        </div>

        <!-- loading层 -->
        <div
          class="loading flex-center"
          v-show="snapshotLoading"
        >
          <ma-spin size="large" />
        </div>
      </div>

      <!-- 截图删除确认弹窗 -->
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
    </aside>
  </div>

  <!-- 截图弹窗 -->
  <Snapshot
    :extraData="{
      alarmId: HisData[curPlayerIndex].id,
      frameIndex
    }"
    :media="videoDom"
    :show="snapshotShow"
    @close="closeSnapshot"
    @saved="getSnapshots"
  />

  <!-- 查看截图样本弹窗 -->
  <ViewImgsModal
    v-if="viewSpsModalShow"
    v-model:visible="viewSpsModalShow"
    :imgs="snapshots"
    :index="viewImgIndex"
    title="样本详情"
    @delImg="getSnapshots"
  />
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import apis from '@/api'
// 截图弹窗
import Snapshot from '@/components/base/Snapshot.vue'
// 查看截图弹窗
import ViewImgsModal from '@/components/base/ViewImgsModal.vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const store = useStore(),
  router = useRouter()

/* 左侧报警视频 */
/* 查询条件相关 */
// 查询条件字段
const cdsData = reactive({
    isAnnotated: undefined,
    evtType: undefined,
    date: dayjs().format('YYYY-MM-DD')
  }),
  // 事件类型选项
  evtOptions = computed(
    () =>
      store.state.dataDictionary['enable_event']?.filter(
        e =>
          !['vehi_accident', 'vehi_rescue'].includes(
            e.value
          )
      ) || []
  ),
  // 事件类型loading
  evtLoading = ref(false),
  // 全选
  isAllChecked = ref(false),
  // 日期默认值
  dateDefaultValue = dayjs(),
  // 批量弹窗显隐
  batchModalShow = ref(false),
  // 批量值
  batchValue = ref(0),
  // 批量弹窗确认
  batchModalOkHandler = () => {
    let bodyIds
    if (batchValue.value === 0) {
      const checkBodies = bodies.value.filter(
        e => e.checked
      )
      if (!checkBodies.length) {
        message.warning('请先选中部分选项后再继续操作')
        return false
      }
      bodyIds = checkBodies.map(e => e.bodyId)
    }

    fileBodies(bodyIds, batchValue.value)

    batchModalShow.value = false
  },
  // 批量归档bodies
  fileBodies = (bodyIds, option = 0) => {
    if (option === 0) {
      bodyIds?.length
        ? ''
        : (bodyIds = [
            bodies.value[curBodyIndex.value].bodyId
          ])
    }

    bodyIds = bodyIds || []

    apis.events
      .fileBodies({
        bodyIds,
        isFiled: 1 /* 1 归档, 0 取归 */,
        option
      })
      .then(res => {
        console.log('归档 res', res)

        message.success('标注成功')

        bodies.value.forEach(body => {
          bodyIds.includes(body.bodyId) &&
            (body.hide = true)
        })

        // 初始化当前his下标为1
        curHisIndex.value = 1
      })
  }

// 监听 全选 勾选
watch(isAllChecked, nV => {
  bodies.value.forEach(e => {
    e.checked = nV
  })
})
/* 左侧body */
// bodies数据
const bodies = ref([]),
  // 当前body下标
  curBodyIndex = ref(0),
  // bodies loading
  bodiesLoading = ref(false),
  // 切换body
  tabBody = (body, i) => {
    if (curBodyIndex.value === i) return

    curBodyIndex.value = i

    // 初始化当前his下标为1
    curHisIndex.value = 1

    // 清空当前截图数据
    snapshots.value = []

    // 获取当前对应的his视频数据
    getHis()

    console.log('body', body)
  },
  // 获取bodies数据
  getBodies = () => {
    // 删除待更新位置数据并补位
    HisData.value.splice(curPlayerIndex.value, 1, {})

    // 清空截图样本数据
    snapshots.value = []

    bodiesLoading.value = true
    return apis.events
      .getBodiesByConditions2({
        date: cdsData.date,
        eventType: cdsData.evtType,
        isAnnotated: cdsData.isAnnotated
      })
      .then(res => {
        console.log('bodies res', res)
        // 恢复全选状态
        isAllChecked.value = false

        bodies.value = res

        // 更新数据默认切换为0
        curBodyIndex.value = 0

        // 若 bodeis有数据
        if (res.length) {
          // 则自动获取his数据
          getHis()

          // 循环获取封面
          res.forEach(body => {
            apis.events
              .getBodyCoverImageByBodyId({
                bodyId: body.bodyId
              })
              .then(res => {
                body.coverImage = res

                // 触发数据响应
                bodies.value = bodies.value.concat()
              })
          })
        }
      })
      .finally(() => {
        bodiesLoading.value = false
      })
  },
  // 获取对应类型默认图
  getDefaultPoster = evtType => {
    let url = `${require('@images/vehi_converse.png')}`
    try {
      url = `${require('@images/' + evtType + '.png')}`
    } catch (err) {
      console.log('getDefaultPoster() err:', err)
    }

    return url
  }

/* 中间视频播放 */
// 当前播放器下标（0 / 1）
const curPlayerIndex = ref(0),
  // 对应另一个播放器下标
  anotherPlayerIndex = ref(1),
  // 播放器类class
  playerWrapperClass = ref(['', '']),
  // video dom
  videoDom0 = ref(),
  videoDom1 = ref(),
  videoDom = computed(() =>
    curPlayerIndex.value ? videoDom1.value : videoDom0.value
  ),
  // 当前播放器的时间
  curPlayerTime = ref(0),
  // 当前his下标
  curHisIndex = ref(1),
  // 当前his总数
  curHisTotal = ref(1),
  // his视频数据（对应两个播放器）
  HisData = ref([{}, {}]),
  // 切换his视频数据
  tabHis = index => {
    // 若 his总数不足2 或 下标未变
    if (
      curHisTotal.value < 2 ||
      index === curHisIndex.value
    )
      return

    // 暂停当前视频播放
    videoDom.value?.pause()

    /* his动效控制 */
    // 若 向后切换
    if (index > curHisIndex.value) {
      playerWrapperClass.value[curPlayerIndex.value] =
        'leave-to-left'
      playerWrapperClass.value[anotherPlayerIndex.value] =
        'enter-from-right'
    } else {
      playerWrapperClass.value[curPlayerIndex.value] =
        'leave-to-right'
      playerWrapperClass.value[anotherPlayerIndex.value] =
        'enter-from-left'
    }

    // 切换当前播放器下标
    curPlayerIndex.value = curPlayerIndex.value ? 0 : 1

    // 处理his下标在指定范围
    index = index < 1 ? curHisTotal.value : index
    curHisIndex.value =
      index > curHisTotal.value ? 1 : index

    // 清空当前截图数据
    snapshots.value = []

    // 获取当前对应的his视频数据
    getHis()
  },
  // 获取当前对应的his视频数据
  getHis = () => {
    // 删除待更新位置数据并补位
    HisData.value.splice(curPlayerIndex.value, 1, {})

    return apis.events
      .getHisMediaByBodyId({
        bodyId: bodies.value[curBodyIndex.value].bodyId,
        rank: curHisIndex.value
      })
      .then(res => {
        console.log('获取his res', res)

        if (res.rank === curHisIndex.value) {
          // 更新对应数据
          HisData.value.splice(curPlayerIndex.value, 1, res)

          // 更新his总数
          curHisTotal.value = res.hisNum

          // 初始化视频可播参数
          isVideoCanPlay = false

          // 获取样本截图数据
          getSnapshots()
        }
      })
  },
  // 当前视频当前帧下标
  frameIndex = computed(
    () =>
      curPlayerTime.value *
      Number(HisData.value[curPlayerIndex.value].frameRate)
  ),
  // 添加标注（打开截图弹窗）
  addMarks = () => {
    if (!videoDom.value.videoHeight || !isVideoCanPlay)
      return

    videoDom.value?.pause()
    snapshotShow.value = true
  },
  // 视频可播放执行
  videoCanplayHandler = () => {
    isVideoCanPlay = true
  }

// 当前视频可播与否
let isVideoCanPlay = false

watch(curPlayerIndex, (nV, oV) => {
  anotherPlayerIndex.value = oV
})

/* 截图处理相关*/
const snapshotShow = ref(false), // 截图弹窗显隐
  // 关闭截图弹窗
  closeSnapshot = () => {
    snapshotShow.value = false

    // 对应video继续播放
    videoDom.value?.play()
  }

/* 右侧标注样本详情 */
// 标注截图数据
const snapshots = ref([]),
  // 获取截图数据loading
  snapshotLoading = ref(false),
  // 查看截图样本弹窗显隐
  viewSpsModalShow = ref(false),
  // 查看截图样本下标
  viewImgIndex = ref(0),
  // 打开查看截图样本弹窗
  showViewImgsModal = index => {
    viewImgIndex.value = index

    viewSpsModalShow.value = true
  },
  // 删除截图loading
  delSpsLoading = ref(false),
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

        // 获取截图数据
        getSnapshots()
      })
      .catch(err => {
        console.log('截图删除失败 err', err)
        msg?.()
      })
      .finally(() => {
        delSpsLoading.value = false
      })
  },
  // 删除截图确认弹窗显隐
  delSpsModalShow = ref(false),
  // 待删除截图id
  delSnapshotId = ref(),
  // 显示删除截图确认弹窗
  showDelSpsModal = screenshotId => {
    delSnapshotId.value = screenshotId
    delSpsModalShow.value = true
  },
  // 获取截图数据
  getSnapshots = () => {
    snapshotLoading.value = true
    apis.events
      .getSnapshotsByAlarmId({
        alarmId: HisData.value[curPlayerIndex.value].id
      })
      .then(res => {
        console.log('获取截图数据 res', res)

        res.forEach(e => {
          e.positionInfo.forEach(e2 => {
            /* eslint-disable-next-line */
            e2.points = eval(e2.positionStr)
          })
        })

        snapshots.value = res
      })
      .catch(err => {
        console.log('获取截图数据 err', err)

        snapshots.value = []
      })
      .finally(() => {
        snapshotLoading.value = false
      })
  }

// 播放时间定时器
let playTimeInterval

onMounted(() => {
  // 若 无事件类型数据
  if (!store.state.dataDictionary['enable_event']?.length) {
    evtLoading.value = true
    store
      .dispatch(
        'dataDictionary/getDicByKey',
        'enable_event'
      )
      .finally(() => {
        evtLoading.value = false
      })
  }

  // 页面首次载入自动获取bodies数据
  getBodies()

  // 开启播放时间定时器
  playTimeInterval = setInterval(() => {
    if (videoDom.value && !videoDom.value.paused) {
      curPlayerTime.value =
        Math.floor(videoDom.value?.currentTime) || 0
    }
  }, 40)
})

onBeforeUnmount(() => {
  clearInterval(playTimeInterval)
})
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.wrapper {
  @leftAsideWidth: 16%;
  @leftAsideMinWidth: 240px;
  @rightAsideWidth: 16%;
  @rightAsideMinWidth: 240px;

  background-color: #f0f2f5;
  display: flex;
  height: calc(100% + 40px);
  margin: -20px;
  overflow: hidden;
  width: calc(100% + 40px);

  .tip-wrap .tip-content .bg {
    background: url(~@images/blank_tip.png) 0 0 / contain
      no-repeat;
    height: 179px;
    width: 212px;
    & + .text {
      color: #999;
      text-align: center;
    }
  }

  aside {
    @headHeight: 3rem;
    height: 100%;

    &.left {
      width: @leftAsideWidth;
      min-width: @leftAsideMinWidth;

      > .body {
        @conditionHeight: 2.2rem;

        position: relative;

        .conditions {
          align-items: center;
          display: flex;
          height: @conditionHeight;

          .search {
            background-color: @layout-color;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            height: 24px;
            padding: 0 0.5rem;
            transition: 0.1s;
            &:active {
              opacity: 0.8;
            }

            i {
              color: #fff;
            }
          }

          .ant-checkbox-wrapper {
            color: #555;
          }

          .batch {
            align-items: center;
            color: #555;
            display: flex;
            margin-right: auto;

            i {
              color: #ccc;
              font-size: 17px;
              margin-right: 0.3rem;
            }
          }

          :deep(.ant-picker) {
            padding: 0;

            .ant-picker-input {
              input {
                color: #2d83d4;
                text-align: right;
              }
            }
          }
        }

        ul.bodies {
          height: calc(100% - @conditionHeight * 2);
          margin: 0 -0.5rem;
          overflow-x: hidden;
          overflow-y: hidden;
          padding: 5px 0.5rem 0;
          &:hover {
            overflow-y: overlay;
          }
          &::-webkit-scrollbar {
            width: 3px;
            height: 3px;
          }

          li.body {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            list-style: none;
            margin-bottom: 0.8rem;
            padding: 0 0.5rem 0.5rem;
            position: relative;
            transition: 0.2s;
            &:hover,
            &.active {
              border-color: @layout-color;
            }
            &:active {
              border-color: @layout-color;
            }
            &.hide {
              animation: vertical-shrink 0.3s 1 forwards;
              overflow: hidden;
              margin-bottom: 0;
            }

            .line {
              align-items: center;
              display: flex;
              height: 2rem;
              justify-content: space-between;

              .index {
                color: #666;
                font-weight: bold;
                text-align: center;
              }
            }

            .card {
              background: #4f556e;
              border-radius: 4px;
              display: flex;
              margin: 0 auto;
              overflow: hidden;
              padding-top: 56.25%;
              position: relative;
              width: 100%;
              &::before {
                background-color: #0000004d;
                content: '';
                display: block;
                height: 100%;
                left: 0;
                position: absolute;
                top: 0;
                width: 100%;
              }
              > * {
                position: absolute;
              }

              .ant-checkbox-wrapper {
                font-size: 0;
                left: 10px;
                top: 10px;
              }

              .bottom {
                align-items: center;
                bottom: 0;
                color: #fff;
                display: flex;
                height: 1.5rem;
                justify-content: space-between;
                padding: 0 10px 6px 6px;
                width: 100%;

                .left {
                  align-items: center;
                  display: flex;

                  i {
                    font-size: 1.5rem;
                    margin-right: 6px;
                    opacity: 0.75;
                    &.ri-voiceprint-fill {
                      animation: voiceprint 1.2s infinite
                        alternate;
                    }
                  }
                }
              }
            }

            .event-layer {
              height: 100%;
              left: 0;
              position: absolute;
              top: 0;
              width: 100%;
            }
          }
        }

        .tip-wrap {
          height: calc(100% - @conditionHeight * 2);

          .tip-content {
            text-align: center;
          }
        }

        .loading {
          background-color: #fffc;
          bottom: 0;
          height: calc(100% - @conditionHeight * 2);
          left: 0;
          position: absolute;
          width: 100%;
        }
      }
    }
    &.right {
      width: @rightAsideWidth;
      min-width: @rightAsideMinWidth;

      .head {
        position: relative;

        .link {
          color: @layout-color;
          text-decoration: underline;
          position: absolute;
          right: 5px;
          top: 0;
          transition: 0.1s;
          &:active {
            text-shadow: 0 0px 1px @layout-color;
          }
        }
      }

      .body {
        position: relative;

        ul.snapshots {
          max-height: 100%;
          margin: 0 -0.5rem;
          overflow-x: hidden;
          overflow-y: hidden;
          padding: 0 0.5rem;
          &:hover {
            overflow-y: overlay;
          }
          &::-webkit-scrollbar {
            width: 0;
            height: 0;
          }

          li.snapshot {
            background: 0 0 / cover #f0f2f5 no-repeat;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            list-style: none;
            margin-bottom: 0.5rem;
            padding-top: 56.25%;
            position: relative;
            transition: 0.2s;
            &:hover,
            &.active {
              box-shadow: 0 0 5px #00000059;
            }
            &:active {
              box-shadow: 0 0 5px #0002;
            }
            &::before {
              background: linear-gradient(
                to top,
                #0008,
                transparent 2rem,
                transparent
              );
              content: '';
              display: block;
              height: 100%;
              left: 0;
              position: absolute;
              top: 0;
              width: 100%;
            }
            & > * {
              position: absolute;
            }

            .del-btn {
              background-color: #fff;
              border-radius: 50%;
              color: #333;
              font-size: 20px;
              height: 20px;
              right: 5px;
              text-align: center;
              top: 5px;
              transition: 0.2s;
              width: 20px;
              &:hover {
                box-shadow: 0 0 10px #fff;
                text-shadow: 0 0 2px #333;
              }
              &:active {
                box-shadow: 0 0 10px #fff;
                text-shadow: 0 0 0 #333;
              }
              &::after {
                border-radius: 50%;
                content: '';
                display: block;
                height: 30px;
                left: -5px;
                position: absolute;
                top: -5px;
                width: 30px;
              }

              i {
                line-height: 0;
              }
            }

            .bottom {
              bottom: 0;
              color: #fff;
              display: flex;
              height: 1.5rem;
              line-height: 1.5rem;
              justify-content: space-between;
              padding: 0 5px;
              width: 100%;
            }
          }
        }

        .tip-wrap {
          height: 100%;

          .tip-content {
            text-align: center;
          }
        }

        .loading {
          background-color: #fffc;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      }
    }

    .head {
      background-color: #fff;
      height: @headHeight;
      line-height: @headHeight;
      margin-bottom: 10px; /* no */

      h1 {
        font-size: 1.1rem;
        font-weight: bold;
        text-align: center;
      }
    }

    & > .body {
      background-color: #fff;
      height: calc(100% - @headHeight - 10px);
      padding: 0.5rem 0.5rem 0;
    }
  }

  main {
    @gap: 8px;
    @playAreaRate: 90%;

    flex: 1;
    flex-direction: column;
    position: relative;

    .top {
      align-items: flex-end;
      display: flex;
      height: 2rem;
      justify-content: space-between;
      width: @playAreaRate;

      .text {
        font-weight: bold;
        &.type {
          color: #f00;
          font-size: 1.3rem;
        }

        .index {
          color: @layout-color;
        }
      }
    }

    .players-wrapper {
      margin-bottom: 1rem;
      padding-top: calc(
        (@playAreaRate - @gap * 2) * 0.5625 + @gap * 2
      );
      position: relative;
      width: @playAreaRate;
      &::before,
      &::after {
        content: '';
        display: block;
        height: calc(100% - @gap * 2);
        position: absolute;
        width: calc(100% - @gap * 2);
      }
      &::before {
        background-color: #4f556e33;
        right: 0;
        top: 0;
      }
      &::after {
        background-color: #4f556e4d;
        right: @gap;
        top: @gap;
      }
      &:hover {
        .btn {
          opacity: 0.2;
          visibility: visible;
        }
      }

      .players-container {
        background-color: #f0f2f5;
        bottom: 0;
        height: calc(100% - @gap * 2);
        left: 0;
        overflow: hidden;
        position: absolute;
        width: calc(100% - @gap * 2);
        z-index: 1;

        .player-wrapper {
          font-size: 2rem;
          text-align: center;
          height: 100%;
          left: 0;
          position: absolute;
          width: 100%;
          & + .player-wrapper {
            transform: translateX(100%);
          }
          &.enter-from-left {
            animation: enter-from-left linear 0.3s 1
              forwards;
          }
          &.leave-to-left {
            animation: leave-to-left linear 0.3s 1 forwards;
          }
          &.enter-from-right {
            animation: enter-from-right linear 0.3s 1
              forwards;
          }
          &.leave-to-right {
            animation: leave-to-right linear 0.3s 1 forwards;
          }

          video {
            background-color: #000;
            height: 100%;
            width: 100%;
          }
        }
      }

      .btn {
        background-color: #000;
        border-radius: 50%;
        height: 5rem;
        opacity: 0;
        position: absolute;
        top: calc(50% - 2.5rem);
        transition: 0.1s;
        visibility: hidden;
        width: 5rem;
        z-index: 2;
        &.previous {
          left: -2.5rem;
        }
        &.next {
          right: -2.5rem;
        }

        i {
          color: #fff;
          font-size: 4rem;
        }
      }
    }

    .bottom {
      align-items: center;
      display: flex;
      height: 5rem;
      position: relative;
      width: @playAreaRate;

      .tip {
        font-size: 0.7rem;
        left: 0;
        position: absolute;
        top: 0;
      }

      .middle {
        align-items: center;
        display: flex;
        margin: 0 auto;

        .play-time {
          margin-right: 1rem;
          white-space: nowrap;

          .time {
            display: inline-block;
            padding-right: 0.3rem;
            text-align: right;
            width: 2rem;
          }
        }

        .add-mark {
          background-color: #00c34e;
          color: #fff;
          height: 2.2rem;
          line-height: 2.2rem;
          text-align: center;
          width: 7rem;
          &:active {
            background-color: #00c34eb3;
            transition: 0.2s;
          }
        }
      }

      .right {
        position: absolute;
        right: 0;

        .cancel {
          background-color: #ff3939;
          color: #fff;
          height: 2.2rem;
          line-height: 2.2rem;
          text-align: center;
          width: 7rem;
          &:active {
            background-color: #ff3939b3;
            transition: 0.2s;
          }
        }
      }
    }

    .tip-wrap {
      background-color: #f0f2f5;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;

      & > .bg {
        background-color: #4f556e33;
        padding-top: calc(
          (@playAreaRate - @gap * 2) * 0.5625
        );
        position: absolute;
        width: calc(@playAreaRate - @gap * 2);
        z-index: -1;
        &::before,
        &::after {
          content: '';
          display: block;
          height: 100%;
          position: absolute;
          width: 100%;
        }
        &::before {
          background-color: #4f556e4d;
          right: @gap;
          top: @gap;
        }
        &::after {
          background-color: #4f556e;
          right: @gap * 2;
          top: @gap * 2;
        }
      }

      .tip-content {
        left: calc(-@gap * 2);
        position: relative;
      }
    }
  }
}

@keyframes voiceprint {
  0% {
    filter: brightness(0.4);
  }

  75% {
    filter: brightness(1);
  }

  100% {
    filter: brightness(1);
  }
}

@keyframes vertical-shrink {
  0% {
    max-height: 10rem;
    transform: translateX(0);
  }

  100% {
    max-height: 0;
    transform: translateX(-100%);
  }
}
</style>
