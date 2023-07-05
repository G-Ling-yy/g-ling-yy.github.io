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

        <div class="act-bar-right"></div>
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
          :operation="false"
          operationTitle="操作"
          :operationWidth="80"
          :show-view-btn="false"
          :showEditBtn="false"
          :showDelBtn="false"
          @change="tableChangeHandler"
        >
          <!-- 操作概要 -->
          <template #column-operateContent="{ record }">
            <ma-tooltip
              placement="topLeft"
              :title="record.operateContentTxt"
            >
              <div class="ellipsis">
                <span>
                  {{
                    record.operateContent.operator
                      ? `【${record.operateContent.operator}】`
                      : ''
                  }}
                </span>
                <span
                  v-for="(item, index) in record
                    .operateContent.detail"
                  :class="[
                    item.isColor == 1 && 'high-light'
                  ]"
                  :key="index"
                >
                  {{ item.note }}&nbsp;
                </span>
              </div>
            </ma-tooltip>
          </template>
        </Table>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  ref,
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

/* 表单数据 */
const formData = computed(() => selfStore.formData),
  search = () => {
    pagination.current = 1
    getTableData()
  }

/* 导出数据 */
const exportData = () => {
  apis.logs
    .exportOperationsLogFile(formData.value)
    .then(res => {
      window.open(res, '_blank')
    })
}

/* 表格 */
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'logs/getOperationsLog',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60
      },
      {
        title: '操作时间',
        dataIndex: 'operateTime',
        width: 160
      },
      {
        title: '操作人',
        dataIndex: 'userName',
        width: 110
      },
      {
        title: '登录IP',
        dataIndex: 'loginIp',
        width: 120
      },
      {
        title: '功能模块',
        dataIndex: 'funcModule',
        reRender: data =>
          ({
            1: '实时标定',
            2: '图像标注',
            3: '摄像机管理'
          }[data] || '--'),
        width: 100
      },
      {
        title: '操作项',
        dataIndex: 'operateType',
        reRender: data =>
          ({
            1: '新增',
            2: '修改'
          }[data] || '--'),
        width: 70
      },
      {
        title: '操作概要',
        dataIndex: 'operateContent',
        renderBySlot: true,
        width: 400
      },
      {
        title: '操作状态',
        dataIndex: 'operateStatus',
        reRender: data =>
          ({
            0: '失败',
            1: '成功'
          }[data] || '--'),
        width: 80
      }
    ],
    extData: () => formData.value,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1

        // 操作概述处理
        e.operateContent =
          JSON.parse(e.operateContent) || {}
        e.operateContentTxt = `${
          e.operateContent.operator
            ? `【${e.operateContent.operator}】`
            : ''
        } ${e.operateContent.detail.reduce(
          (acc, e) => (acc += e.note + ' '),
          ''
        )}`
      })
    }
  }),
  tableMaxHeight = ref(`${innerHeight - 375}px`)

const theData = ref({}), // 当前选中行弹窗所需数据
  viewEvidence = rowData => {
    theData.value = {
      id: rowData.id
    }
    selfModalShow.value = true
  },
  selfModalShow = ref(false) // 弹窗显隐

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    tableMaxHeight.value = `${innerHeight - 375}px`
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
            span {
              &.high-light {
                color: @layout-color;
              }
            }
          }
        }
      }
    }
  }
}
</style>
