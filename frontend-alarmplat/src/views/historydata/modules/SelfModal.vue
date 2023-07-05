<template>
  <ma-modal
    centered
    :maskClosable="false"
    :footer="null"
    :title="title"
    visible="visible"
    ok-text="确定"
    cancel-text="取消"
    @cancel="
      emits('update:visible', false),
        isFetchSignSuccess && emits('updateTable')
    "
    width="calc(100vw - 110px)"
  >
    <div class="media-wrap">
      <div class="left">
        <!-- 简易操作栏 -->
        <div class="simple-bar">
          <div class="info">
            {{ data.date || '' }} {{ data.location || '' }}
          </div>
        </div>

        <!-- 表格 -->
        <div class="table-wrap">
          <Table
            tableClass="self-table"
            :customRow="customRow"
            :tableData="tableData"
            :row-key="'id'"
            :columns="columns"
            height="calc(59px * 10)"
            :loading="loading"
            :isSelect="false"
            :operationWidth="110"
            :show-view-btn="false"
            :showEditBtn="false"
            :showDelBtn="false"
            @change="tableChangeHandler"
          >
            <!-- 报警次数 -->
            <template #column-alarmCount="{ record }">
              <span style="margin-right: 1em">{{
                record.alarmCount
              }}</span>
              <ma-button
                @click.stop="viewDetails(record)"
                size="small"
                v-if="record.deviceType === 'camera'"
              >
                <template #icon
                  ><icon icon="eye-line"
                /></template>
                查看详情
              </ma-button>
            </template>

            <!-- 操作 -->
            <template #op-btn="{ record }">
              <template
                v-if="
                  record.deviceType !== 'kg_fksc_business'
                "
              >
                <ma-button
                  @click.stop="signBodyStatus(1, record)"
                  size="small"
                >
                  确认</ma-button
                >

                <ma-button
                  @click.stop="signBodyStatus(0, record)"
                  size="small"
                >
                  误报</ma-button
                >
              </template>
            </template>
          </Table>
        </div>
      </div>

      <div class="right">
        <div class="media-show">
          <h1>
            首次告警：<span>{{
              mediaLoading
                ? '加载中···'
                : mediaData.begTime || ''
            }}</span>
          </h1>
          <div class="media">
            <!-- 占位图 -->
            <img
              v-if="mediaData.nodata && !mediaLoading"
              src="@/assets/images/placeholder_img.png"
            />

            <div
              v-else-if="mediaLoading"
              class="loading flex-center"
            >
              <ma-spin size="large" />
            </div>
            <VideoVue
              v-else-if="mediaData.begUrl"
              autoplay
              :framesUrl="mediaData.begMarkPath"
              :src="mediaData.begUrl"
              :type="
                mediaData.begImageUrl ? 'image' : 'video'
              "
            ></VideoVue>
            <div v-else class="tip flex-center">
              暂无媒体证据
            </div>
          </div>
        </div>
        <div class="media-show">
          <h1>
            最新告警：<span>{{
              mediaLoading
                ? '加载中···'
                : mediaData.lastTime || ''
            }}</span>
          </h1>
          <div class="media">
            <!-- 占位图 -->
            <img
              v-if="mediaData.nodata && !mediaLoading"
              src="@/assets/images/placeholder_img.png"
            />

            <div
              v-else-if="mediaLoading"
              class="loading flex-center"
            >
              <ma-spin size="large" />
            </div>
            <VideoVue
              v-else-if="mediaData.endUrl"
              autoplay
              :framesUrl="mediaData.endMarkPath"
              :src="mediaData.endUrl"
              :type="
                mediaData.endImageUrl ? 'image' : 'video'
              "
            ></VideoVue>
            <div v-else class="tip flex-center">
              暂无媒体证据
            </div>
          </div>
        </div>
      </div>

      <!-- 大loading遮罩 -->
      <div class="loading flex-center" v-show="allLoading">
        <ma-spin size="large" />
      </div>
    </div>
  </ma-modal>

  <!-- 表格弹窗 -->
  <SelfModalLv2
    v-if="selfModallv2Show"
    title="详情"
    v-model:visible="selfModallv2Show"
    :data="theData"
  />
</template>

<script setup>
import apis from '@/api'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import SelfModalLv2 from './SelfModal_lv2'
import { message } from 'ant-design-vue'
import { getFirstMatchParentEl } from '@/utils/myTools'
import { useStore } from 'vuex'
import selfStore from './self-store'
import VideoVue from '@/components/base/Video.vue'

const { ref, reactive, onMounted } = require('vue')

const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    },

    title: {
      type: String,
      default: 'modal'
    },

    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible', 'updateTable']),
  store = useStore()

// 用户部分信息
const userInfo = reactive({
  userId: store.getters['user/userId']
})

const allLoading = ref(false), // 组件loading遮罩
  isFetchSignSuccess = ref(false) // 是否成功发送标定请求
let checkdRowDom // 选中行dom

/* 简易操作栏 */
const evtValue = ref(props.data.eventTypeName), // 事件多选框值
  evtSelectLoading = ref(false), // 事件多选框loading
  evtOptions = ref([]), // 事件多选框选项
  getEventValue = () => {
    /* 获取事件多选框数据 */
    evtSelectLoading.value = true
    // apis.events // 不调接口了 前端写死
    //   .getConstantByType({ type: 2 })
    //   .then(res => {
    //     evtOptions.value = res
    //     evtValue.value = props.data.eventType
    //   })
    //   .finally(() => {
    //     evtSelectLoading.value = false
    //   })
    ;(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { key: 'vehi_accident', value: '事故' },
            { key: 'vehi_rescue', value: '救援' },
            { key: 'construction_area', value: '施工区域' },
            { key: 'vehi_stop', value: '停驶' },
            {
              key: 'into_forbidden_area',
              value: '禁行闯入'
            },
            { key: 'abandon', value: '抛洒物' },
            { key: 'vehi_converse', value: '逆行' },
            { key: 'vehi_reverse', value: '倒车' },
            {
              key: 'vehi_slow_pass',
              value: '单车慢速经过'
            },
            {
              key: 'vehi_day_congestion',
              value: '车辆拥堵'
            }
          ])
        }, 300)
      }))()
      .then(res => {
        evtOptions.value = res
        evtValue.value = props.data.eventType
      })
      .finally(() => {
        evtSelectLoading.value = false
      })
  },
  storySignStatus = ref(0) // story已标定与否

/* 表格 */
const {
    tableData,
    loading,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getBodiesByStoryId',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 50
      },
      {
        title: '报警类型',
        dataIndex: 'eventTypeName',
        reRender: (data, row) =>
          `${
            row.objectNum > 0
              ? `${row.objectNum} ${
                  row.objectTypeName?.includes('车')
                    ? '辆'
                    : '个'
                }`
              : ''
          }${row.objectTypeName} - ${data}`,
        width: 70
      },
      {
        title: '数据源',
        dataIndex: 'deviceTypeName',
        width: 40
      },
      {
        title: '首次报警厂商',
        dataIndex: 'corpName',
        width: 60
      },
      {
        title: '首次报警时间',
        dataIndex: 'begTime',
        reRender: data =>
          data.split?.(' ')?.[1].split?.('.')?.[0],
        width: 60
      },
      {
        title: '标定状态',
        dataIndex: 'markStatus',
        reRender: data =>
          ({
            0: '未标定',
            1: ' 已标定正确',
            2: ' 已标定错误',
            3: '已标定视频异常'
          }[data] || '-'),
        width: 60
      },
      {
        title: '报警次数',
        dataIndex: 'alarmCount',
        renderBySlot: true,
        width: 130
      }
    ],
    extData: {
      storyId: props.data.id
    },
    pagination: false,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum = i + 1
      })
    }
  }),
  customRow = record => ({
    onClick: evt => {
      /* 获取对应body的媒体数据 */
      console.log('record', record)
      // 选中当前行高亮
      const trDom = getFirstMatchParentEl(
        evt.target,
        'tr.ant-table-row'
      )
      checkdRowDom?.classList?.remove('checked')
      trDom.classList.add('checked')
      checkdRowDom = trDom

      // 非业务body获取媒体数据
      if (record.deviceType === '业务') return

      mediaLoading.value = true
      apis.events
        .getMediaByBodyId({
          storyBodyId: record.storyBodyId
        })
        .then(res => {
          mediaData.value = {
            ...res,
            begUrl: res.begImageUrl || res.begPath,
            endUrl: res.endImageUrl || res.lastPath,
            begTime: res.begTime?.split?.(' ')?.[1],
            lastTime: res.lastTime?.split?.(' ')?.[1]
          }
        })
        .finally(() => {
          mediaLoading.value = false
        })
    }
  })

// 媒体查询
const mediaLoading = ref(false),
  mediaData = ref({ nodata: true })

// 详情弹窗
const selfModallv2Show = ref(false), // 详情弹窗显隐
  theData = ref({}),
  viewDetails = row => {
    theData.value = {
      // date: row.begTime?.split?.(' ')?.[0] || '',
      id: row.storyBodyId
    }
    selfModallv2Show.value = true
  }

// 确认误报
const signBodyStatus = (status, record) => {
    /* body标定 */
    signStatus('setBodyCalibrateStatus', record, status)
  },
  signStatus = (api, idr, signStatus) => {
    const alaEventId = idr.storyBodyId,
      alaType = idr.eventType

    allLoading.value = true
    apis.events[api]({
      alaEventId,
      alaType,
      userId: userInfo.userId,
      isCorrect: signStatus,
      orgId: selfStore.formData.orgId
    })
      .then(() => {
        message.success(`标定成功`)

        getTableData()
      })
      .finally(() => {
        allLoading.value = false
      })
  }

onMounted(() => {
  if (props.data.signStatus > 2) {
    /* 已标定则不获取事件多选框数据 */
    evtOptions.value.push({
      key: props.data.eventType,
      value: props.data.eventTypeName
    })
    evtValue.value = props.data.eventType
  } else {
    getEventValue()
  }

  // 获取表格数据
  getTableData()
  console.log('tableData22222222222222:', tableData)
  console.log('getTableData2222222222222:', getTableData())
  // 标定与否初始值
  storySignStatus.value = props.data.signStatus
})
</script>

<style lang="less" scoped>
.media-wrap {
  align-items: flex-start;
  display: flex;
  max-height: 80vh;
  margin: 0 auto;
  position: relative;
  & > .loading {
    background-color: #0003;
    cursor: not-allowed;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 99;
  }

  .left {
    flex: 1;
    height: 100%;

    /* 简易操作栏 */
    .simple-bar {
      align-items: center;
      display: flex;
      height: 40px;
      justify-content: space-between;
      margin-bottom: 15px;

      .info {
        font-size: 18px;
      }

      .act-bar {
        & > * {
          margin-right: 10px;
        }

        .sign-status {
          display: inline-block;
        }
      }
    }
  }

  .right {
    @rightWidth: 22vw;

    height: 100%;
    overflow-x: hidden;
    overflow-y: overlay;
    width: @rightWidth;
    min-width: @rightWidth;

    .media-show {
      margin-bottom: 6vh;
      padding: 0 15px;
      &:last-child {
        margin-bottom: 0;
      }

      h1 {
        color: #1890ff;
        font-size: 18px;

        span {
          color: #000000d9;
          font-size: 15px;
        }
      }

      .media {
        min-height: calc((@rightWidth - 30px) / 16 * 9);
        position: relative;

        img {
          display: block;
          margin: 0 auto;
          max-height: calc((@rightWidth - 30px) / 16 * 9);
        }

        .loading,
        video,
        .tip {
          height: calc((@rightWidth - 30px) / 16 * 9);
        }

        video {
          display: block;
        }

        .tip {
          text-align: center;
        }
      }
    }
  }
}
</style>
