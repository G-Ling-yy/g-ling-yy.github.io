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
      :operationWidth="0"
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
    api: 'getVocationalAlarmSource',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 100
      },
      {
        title: '报警时间',
        dataIndex: 'begTime'
      },
      {
        title: '推送调度时间',
        dataIndex: 'reportTime'
      },
      {
        title: '报警类型',
        dataIndex: 'eventTypeName'
      },
      {
        title: '推送业务类型',
        dataIndex: 'reportType'
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
      id: rowData.bodyId
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
