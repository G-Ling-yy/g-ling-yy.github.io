<template>
  <ma-modal
    centered
    :footer="null"
    :maskClosable="false"
    :title="title"
    visible="visible"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)"
    width="80vw"
  >
    <div class="media-wrap">
      <div class="left">
        <!-- 简易表单 -->
        <div class="simple-bar">
          <div class="left">
            <!-- 标定状态 -->
            <ma-select
              v-model:value="extData.isCorrect"
              allowClear
              placeholder="标定状态"
              style="width: 100px"
              @change="getTableData(1)"
            >
              <ma-select-option
                v-for="opt of calibrateOpts"
                :key="opt.key"
                :value="opt.value"
                >{{ opt.key }}</ma-select-option
              >
            </ma-select>
          </div>

          <div class="right">
            <ma-button>合并</ma-button>
          </div>
        </div>

        <!-- 表格 -->
        <div class="table-wrap">
          <Table
            :customRow="customRow"
            tableClass="self-table"
            :tableData="tableData"
            :row-key="'id'"
            :columns="columns"
            :height="tableMaxHeight"
            :loading="loading"
            :isSelect="false"
            :operationWidth="110"
            :pagination="pagination"
            :rowSelection="rowSelection"
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
              >
                <template #icon
                  ><icon icon="eye-line"
                /></template>
                查看详情
              </ma-button>
            </template>

            <!-- 操作 -->
            <template #op-btn="{ record }">
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
  <BarModalLv2
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
import { getFirstMatchParentEl } from '@/utils/myTools'
import selfStore from './self-store'
import { message } from 'ant-design-vue'
import BarModalLv2 from './BarModal_lv2'
import { useStore } from 'vuex'
import VideoVue from '@/components/base/Video.vue'

const {
  ref,
  reactive,
  computed,
  onMounted
} = require('vue')

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
  emits = defineEmits(['update:visible']),
  store = useStore()

// 用户部分信息
const userInfo = reactive({
  userId: store.getters['user/userId']
})

let checkdRowDom // 表格选择行dom

// 外层表单数据
const formData = computed(() => selfStore.formData),
  // 标定状态选项
  calibrateOpts = [
    {
      key: '正确',
      value: 1
    },
    {
      key: '误报',
      value: 0
    },
    {
      key: '未标定',
      value: 2
    }
  ]

/* 表格 */
// 请求所需参数
const extData = reactive({
  corp: props.data.corp,
  eventTypes: [formData.value.eventType],
  isCorrect: props.data.isCorrect, // 标定状态
  isPoc: formData.value.isPoc,
  startDate: formData.value.rangePickerValue[0],
  endDate: formData.value.rangePickerValue[1]
})

const {
    tableData,
    loading,
    columns,
    pagination,
    rowSelection,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getBodiesByConditions',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 40,
        maxWidth: 40
      },

      {
        title: '报警位置',
        dataIndex: 'location',
        width: 100
      },

      // {
      //   title: '报警类型',
      //   dataIndex: 'displayName',
      //   width: 80
      // },
      // {
      //   title: '报警厂商',
      //   dataIndex: 'corpName',
      //   width: 70
      // },

      {
        title: '首次报警时间',
        dataIndex: 'begTime',
        // reRender: data => data?.split?.(' ')?.[1].split?.('.')?.[0] || '-',
        reRender: data => data || '-',
        width: 120
      },

      {
        title: '最新报警时间',
        dataIndex: 'endTime',
        // reRender: data => data?.split?.(' ')?.[1].split?.('.')?.[0] || '-',
        reRender: data => data || '-',
        width: 120
      },

      {
        title: '标定状态',
        dataIndex: 'signStatus',
        reRender: data =>
          `${
            {
              0: '标定错误',
              1: '标定正确',
              2: '暂未标定'
            }[data]
          }` || '-',
        width: 70
      },

      {
        title: '报警次数',
        dataIndex: 'alarmCount',
        renderBySlot: true,
        width: 130
      }
    ],
    rowSelection: {
      columnWidth: 20
    },
    extData,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })

      // 清 表格选中行效果 及 右侧视频内容
      checkdRowDom?.classList?.remove('checked')
      mediaData.value = { nodata: true }
    }
  }),
  tableMaxHeight = computed(() => {
    return `${Math.min(570, innerHeight - 360)}px`
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

      mediaLoading.value = true
      apis.events
        .getMediaByBodyId({ storyBodyId: record.id })
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
  }),
  mediaLoading = ref(false), // 媒体loading
  mediaData = ref({ nodata: true }), // 所查媒体数据
  allLoading = ref(false), // 组件loading
  // 标定body状态
  signBodyStatus = (status, row) => {
    allLoading.value = true
    apis.events
      .setBodyCalibrateStatus({
        alaEventId: row.id,
        alaType: formData.value.eventType,
        userId: userInfo.userId,
        isCorrect: status,
        orgId: 'ff80818159af9032015a1258ae5f001a'
      })
      .then(() => {
        message.success(`标定成功`)

        // 获取表格数据
        getTableData()
      })
      .finally(() => {
        allLoading.value = false
      })
  }

// 详情弹窗
const selfModallv2Show = ref(false), // 详情弹窗显隐
  theData = ref({}),
  viewDetails = row => {
    theData.value = {
      date: row.begTime?.split?.(' ')?.[0] || '',
      id: row.id
    }
    selfModallv2Show.value = true
  }

onMounted(() => {
  // 获取表格数据
  getTableData()
})
</script>

<style lang="less" scoped>
.media-wrap {
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

  & > .left {
    flex: 1;
    height: 100%;

    /* 简易操作栏 */
    .simple-bar {
      align-items: center;
      display: flex;
      height: 40px;
      justify-content: space-between;
      margin-bottom: 15px;
    }
  }

  & > .right {
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
