<template>
  <!-- 表单 -->
  <SelfForm
    ref="selfFormDom"
    @handleSearch="searchHandler"
  />

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
      :show-view-btn="false"
      :showEditBtn="false"
      :showDelBtn="false"
      @change="tableChangeHandler"
    >
      <!-- 1班准时 -->
      <template #column-morningShiftOnTime="{ record }">
        <a @click.prevent="viewDetails(record, 1, 1)">
          {{ record.morningShiftOnTime }}
        </a>
      </template>

      <!-- 1班超时 -->
      <template #column-morningShiftOverTime="{ record }">
        <a @click.prevent="viewDetails(record, 2, 1)">
          {{ record.morningShiftOverTime }}
        </a>
      </template>

      <!-- 2班准时 -->
      <template #column-middleShiftOnTime="{ record }">
        <a @click.prevent="viewDetails(record, 1, 2)">
          {{ record.middleShiftOnTime }}
        </a>
      </template>

      <!-- 2班超时 -->
      <template #column-middleShiftOverTime="{ record }">
        <a @click.prevent="viewDetails(record, 2, 2)">
          {{ record.middleShiftOverTime }}
        </a>
      </template>

      <!-- 3班准时 -->
      <template #column-nightShiftOnTime="{ record }">
        <a @click.prevent="viewDetails(record, 1, 3)">
          {{ record.nightShiftOnTime }}
        </a>
      </template>

      <!-- 3班超时 -->
      <template #column-nightShiftOverTime="{ record }">
        <a @click.prevent="viewDetails(record, 2, 3)">
          {{ record.nightShiftOverTime }}
        </a>
      </template>
    </Table>
  </div>
  <!-- 表格弹窗 -->
  <SelfModal
    v-if="selfModalShow"
    :title="`${theData.checkDay} | ${theData.type}班${
      theData.isOnTime > 1 ? '超' : '准'
    }时`"
    v-model:visible="selfModalShow"
    :data="theData"
    @updateTable="getTableData"
  />
</template>

<script setup>
/* eslint no-unused-vars: off */
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import selfStore from './modules/self-store'
import SelfForm from './modules/SelfForm'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import SelfModal from './modules/SelfModal'
import { debounce } from '@/utils/lodash'

/* 表单 */
// 表单数据
const formData = computed(() => selfStore.formData),
  // 表单dom
  selfFormDom = ref(),
  // 表单搜索触发
  searchHandler = () => {
    pagination.current = 1
    getTableData()
  }

/* 表格 */
// 表头标题
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getCalibrateStatisticsByMonth',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        key: 'indexNum',
        width: 80
      },
      {
        title: '日期',
        dataIndex: 'checkDay',
        key: 'checkDay',
        width: 150
      },
      {
        title: '夜班准时',
        dataIndex: 'nightShiftOnTime',
        key: 'nightShiftOnTime',
        renderBySlot: true
      },
      {
        title: '夜班超时',
        dataIndex: 'nightShiftOverTime',
        key: 'nightShiftOverTime',
        renderBySlot: true
      },
      {
        title: '早班准时',
        dataIndex: 'morningShiftOnTime',
        key: 'morningShiftOnTime',
        renderBySlot: true
      },
      {
        title: '早班超时',
        dataIndex: 'morningShiftOverTime',
        key: 'morningShiftOverTime',
        renderBySlot: true
      },
      {
        title: '晚班准时',
        dataIndex: 'middleShiftOnTime',
        key: 'middleShiftOnTime',
        renderBySlot: true
      },
      {
        title: '晚班超时',
        dataIndex: 'middleShiftOverTime',
        key: 'middleShiftOverTime',
        renderBySlot: true
      }
      // {
      //   title: '夜班准时',
      //   dataIndex: 'nightShiftOnTime',
      //   key: 'nightShiftOnTime',
      //   renderBySlot: true
      // },
      // {
      //   title: '夜班超时',
      //   dataIndex: 'nightShiftOverTime',
      //   key: 'nightShiftOverTime',
      //   renderBySlot: true
      // }
    ],
    extData: formData.value,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })
    }
  }),
  tableMaxHeight = ref(`${innerHeight - 344}px`)

const theData = ref({}), // 当前选中行弹窗所需数据
  viewDetails = (rowData, isOnTime = 1, type) => {
    // isOnTime 1 准时, 2 超时
    theData.value = {
      checkDay: rowData.checkDay,
      isOnTime,
      type
    }
    selfModalShow.value = true
  },
  selfModalShow = ref(false) // 弹窗显隐

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    const formHeight =
      selfFormDom.value?.$el?.offsetHeight || 44

    tableMaxHeight.value = `${
      innerHeight - 250 - formHeight
    }px`
  }, 200)
)

onMounted(() => {
  getTableData()
  console.log('theData11111111111111:', theData)
  // 监听导致表格高度变化的dom
  tableHeightObserver.observe(selfFormDom.value?.$el)
  tableHeightObserver.observe(document.body)
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')

  /* 关销 监听 实例 */
  tableHeightObserver.unobserve(selfFormDom.value?.$el)
  tableHeightObserver.unobserve(document.body)
  tableHeightObserver = null
})
</script>

<style lang="less" scoped>
/* 表格 */
.table-wrap {
  .ant-table {
    td {
      a {
        text-decoration: underline;
      }
    }
  }
  .ant-pagination {
    margin-bottom: 0;
  }
}
</style>
