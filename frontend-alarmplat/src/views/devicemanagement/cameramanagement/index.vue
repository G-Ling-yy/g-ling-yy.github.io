<template>
  <div class="page camera-management-page">
    <!-- 查询条件 -->
    <div class="form-wrap">
      <SelfFormVue @search="search" />
    </div>

    <main>
      <!-- 操作条 -->
      <div class="act-bar">
        <div class="act-bar-left">
          <!-- 导出数据按钮 -->
          <ma-button @click="exportData">
            导出数据
          </ma-button>
        </div>

        <div class="act-bar-right">
          <div class="follow-txt">
            最近一次同步设备：<span>{{
              camerasSyncTime || '--'
            }}</span>
          </div>

          <!-- 同步摄像机确认 -->
          <ma-popconfirm
            ok-text="确认"
            v-model:visible="syncCamerasConfirmShow"
            @confirm="syncCamerasConfirm"
          >
            <!-- title slot -->
            <template #title>
              <div></div>
              <ma-input
                allowClear
                placeholder="请输入授权码："
                size="small"
                v-model:value="syncCamerasPwd"
                @keyup.enter="syncCamerasConfirm"
              >
              </ma-input>
            </template>
            <!-- 取消按钮slot -->
            <template #cancelButton></template>

            <!-- 同步摄像机按钮 -->
            <ma-button
              :loading="syncCamerasLoading"
              type="primary"
            >
              同步设备
            </ma-button>
          </ma-popconfirm>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-wrap">
        <Table
          tableClass="self-table"
          :tableData="tableData"
          :row-key="'id'"
          :columns="columns"
          :height="tableMaxHeight"
          :loading="loading"
          :isSelect="false"
          :pagination="pagination"
          operationTitle="操作"
          :operationWidth="80"
          :show-view-btn="false"
          :showEditBtn="false"
          :showDelBtn="false"
          @change="tableChangeHandler"
        >
          <!-- 摄像机名称 -->
          <template #column-cameraName="{ record }">
            <ma-tooltip
              placement="topLeft"
              :title="record.cameraName"
            >
              <div class="ellipsis">
                {{ record.cameraName }}
              </div>
            </ma-tooltip>
          </template>

          <!-- 设备状态 -->
          <template #column-cameraStatus="{ record }">
            <div
              :class="[
                'cameraStatus',
                `status-${record.cameraStatus}`
              ]"
            >
              {{
                {
                  0: '离线',
                  1: '在线',
                  2: '故障',
                  3: '未知'
                }[record.cameraStatus] || '待接入'
              }}
            </div>
          </template>

          <!-- 是否监测 -->
          <template #column-isMonitoring="{}">
            <ma-switch :disabled="true" />
          </template>

          <!-- 操作 -->
          <template #op-btn="{ record }">
            <ma-button
              @click="viewLiveVideo(record)"
              size="small"
            >
              <template #icon
                ><icon icon="eye-line"
              /></template>
              查看
            </ma-button>
          </template>
        </Table>
      </div>
    </main>
  </div>

  <!-- 表格直播视频弹窗 -->
  <LivePlayerModal
    v-if="LivePlayerModalShow"
    v-model:visible="LivePlayerModalShow"
    :data="theData"
  />
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import SelfFormVue from './modules/SelfForm.vue'
import selfStore from './modules/self-store'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import { debounce } from '@/utils/lodash'
import apis from '@/api'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

// 直播视频弹窗
import LivePlayerModal from '@/components/base/LivePlayerModal.vue'

const store = useStore()

// 用户部分信息
const userInfo = reactive({
  userId: store.getters['user/userId']
})

/* 表单数据 */
const formData = computed(() =>
  selfStore.formData
),
  search = () => {
    pagination.current = 1
    getTableData()

    // 获取同步摄像机时间
    getSyncTime()
  }

/* 导出数据 */
const exportData = () => {
  apis.cameras
    .exportCamerasFile(formData.value)
    .then(res => {
      window.open(res, '_blank')
    })
}

/* 同步摄像机 */
const syncCamerasLoading = ref(false),
  syncCameras = () => {
    syncCamerasLoading.value = true
    apis.cameras
      .syncCameras({
        qsId: formData.value.qsId,
        userId: userInfo.userId
      })
      .then(res => {
        message.success(`同步 ${res} 路摄像机成功`)

        // 更新同步摄像机时间
        getSyncTime()

        // 更新表格
        search()
      })
      .finally(() => {
        syncCamerasLoading.value = false
      })
  },
  // 同步摄像机密钥
  syncCamerasPwd = ref(''),
  // 确认同步摄像机显隐
  syncCamerasConfirmShow = ref(false),
  // 确认同步摄像机
  syncCamerasConfirm = () => {
    // 若 有输入
    if (syncCamerasPwd.value) {
      // 若 输入正确
      if (syncCamerasPwd.value === 'tjxfd') {
        syncCamerasConfirmShow.value = false

        // 同步摄像机
        syncCameras()
      } else {
        message.warning('输入授权码不正确')
      }
    }

    syncCamerasPwd.value = ''
  },
  // 同步摄像机时间
  camerasSyncTime = ref(''),
  // 获取同步摄像机时间
  getSyncTime = () =>
    apis.cameras
      .getSyncTime({
        orgId: formData.value.qsId
      })
      .then(res => {
        camerasSyncTime.value = res?.timeDifference
      })

/* 表格 */
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'cameras/getCamerasByCondition',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60
      },
      {
        title: '检测范围',
        dataIndex: 'fuse',
        // renderBySlot: true,
        width: 130
      },
      {
        title: '国标ID',
        dataIndex: 'gbId',
        // renderBySlot: true,
        width: 190
      },
      {
        title: '设备名称',
        dataIndex: 'cameraName',
        renderBySlot: true,
        width: 170
      },
      {
        title: '归属路线',
        dataIndex: 'roadAttr',
        width: 120
      },
      {
        title: '监控方向',
        dataIndex: 'endRegionCodeName',
        reRender: (data, row) =>
          `${data}方向 ${
            {
              0: '↑',
              1: '↓',
              2: '↑↓'
            }[row.direction]
          }`,
        width: 120
      },
      {
        title: '桩号',
        dataIndex: 'kmPile',
        reRender: data => data || '无',
        width: 100
      },
      {
        align: 'center',
        title: '功能类型',
        dataIndex: 'functionType',
        reRender: data =>
          ({
            1: '球机',
            2: '半球',
            3: '固定枪机',
            4: '遥控枪机',
            5: '全景式',
            6: '抓拍型'
          }[data] || '其他'),
        width: 100
      },
      // {
      //   title: '监测策略',
      //   dataIndex: 'monitoringStrategy	',
      //   width: 120
      // },
      // {
      //   title: '报备内容',
      //   dataIndex: 'filingContent',
      //   reRender: data => data || '无',
      //   width: 120
      // },
      {
        title: '监测状态',
        dataIndex: 'monStatus',
        width: 80
      },
      // {
      //   align: 'center',
      //   title: '是否POC',
      //   dataIndex: 'isPoc',
      //   reRender: data =>
      //     ({
      //       0: '否',
      //       1: '是'
      //     }[data] || ''),
      //   width: 80
      // },
      {
        align: 'center',
        title: '设备状态',
        dataIndex: 'cameraStatus',
        renderBySlot: true,
        width: 80
      }
    ],
    extData: () => formData.value,
    afterGetData: res => {
      res.data.forEach((e, i) => {
      // console.log('formData.value222222222222222:', formData.value)
      // console.log('res222222????????????:', res)
       console.log('e222222222:', e)
        console.log('iiiiiiiiiiiiiiii2222222222:', i)
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })
    }
  }),
  tableMaxHeight = ref(`${innerHeight - 365}px`)

const theData = ref({}), // 当前选中行弹窗所需数据
  viewLiveVideo = rowData => {
    console.log('rowData11111111111111111111:', rowData)
    theData.value = {
      linkId: rowData.link,
      name: rowData.cameraName
    }
    LivePlayerModalShow.value = true
  },
  LivePlayerModalShow = ref(false) // 直播视频弹窗显隐

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    tableMaxHeight.value = `${innerHeight - 365}px`
  }, 200)
)

onMounted(() => {
  // 监听导致表格高度变化的dom
  tableHeightObserver.observe(document.body)
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize()

  /* 关销 监听 实例 */
  tableHeightObserver.unobserve(document.body)
  tableHeightObserver = null
})
</script>

<style lang="less" scoped>
*:not([class|='ant']) {
  margin: 0;
  padding: 0;
}

.page {
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  height: calc(100% + 40px);
  margin: -20px;
  overflow: hidden;
  position: relative;
  width: calc(100% + 40px);

  .form-wrap {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 1rem 1rem 0;
  }

  main {
    background-color: #fff;
    flex: 1;
    padding: 1rem;

    .act-bar {
      display: flex;
      height: 32px;
      justify-content: space-between;
      margin-bottom: 1rem;

      .act-bar-left,
      .act-bar-right {
        align-items: center;
        display: flex;

        .follow-txt {
          margin-right: 1rem;
        }
      }
    }

    .table-wrap {
      .ant-table-wrapper {
        .ant-table-body {
          .ant-table-cell {
            .cameraStatus {
              background-color: #e5e5e5;
              border-radius: 2px;
              color: #fff;
              display: inline-block;
              padding: 0 6px;
              white-space: nowrap;
              width: fit-content;
              &.status-1 {
                background-color: #66ecca;
              }
              &.status-2 {
                background-color: #f9873b;
              }
            }
          }
        }
      }
    }
  }
}
</style>
