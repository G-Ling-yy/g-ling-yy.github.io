<template>
  <!-- 表单 -->
  <SelfForm @handleSearch="searchHandler" />

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
      operationTitle="报警证据"
      :operationWidth="80"
      :show-view-btn="false"
      :showEditBtn="false"
      :showDelBtn="false"
      @change="tableChangeHandler"
    >
      <template #op-btn="{ record }">
        <ma-button
          @click="viewEvidence(record)"
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
  <!-- 表格弹窗 -->
  <SelfModal
    v-if="selfModalShow"
    title="报警证据"
    v-model:visible="selfModalShow"
    :data="theData"
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
const formData = computed(() => selfStore.formData),
  searchHandler = () => {
    pagination.current = 1
    getTableData()
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
    api: 'getOriginAlarms',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60
      },
      {
        title: '报警位置',
        dataIndex: 'location',
        width: 160
      },
      {
        title: '报警时间',
        dataIndex: 'detectTime',
        width: 160
      },
      {
        title: '报警厂商',
        dataIndex: 'corpName',
        width: 120
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
        width: 120
      },
      {
        title: '标定状态',
        dataIndex: 'dataStatus',
        width: 100
      },
      {
        title: '环境',
        dataIndex: 'onlineStatusDesc',
        width: 50
      }
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
  tableMaxHeight = ref(`${innerHeight - 300}px`)

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
    tableMaxHeight.value = `${innerHeight - 300}px`
  }, 200)
)

onMounted(() => {
  getTableData()
  console.log('formData11111111111:', formData.value)
  // 监听导致表格高度变化的dom
  tableHeightObserver.observe(document.body)
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')

  /* 关销 监听 实例 */
  tableHeightObserver.unobserve(document.body)
  tableHeightObserver = null
})
</script>

<style lang="less" scoped>
/* 表格 */
.table-wrap {
  height: calc(100% - 300px);
}
</style>
