<template>
  <h1>统计分析</h1>
</template>

<script setup>
/* eslint no-unused-vars: off */
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import selfStore from './modules/self-store'
import selfForm from './modules/SelfForm'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import selfModal from './modules/SelfModal'
import apis from '@/api'

const xxx = ref()
apis.events
  .getxxx({
    cityCode: 101010100
  })
  .then(res => {
    console.log('forecast res', res, JSON.parse(res))
    xxx.value = res
  })

/* 表单 */
const formData = computed(() => selfStore.formData),
  searchHandler = () => {
    pagination.current = 1
    getTableData()
  }

/* 表格 */
const { tableData, loading, pagination, columns, tableChangeHandler, getTableData } =
  createTableVariables({
    api: 'getOriginAlarms',
    columns: [
      // 列配置
      {
        title: '报警位置',
        dataIndex: 'location',
        width: 260
      },
      {
        title: '报警时间',
        dataIndex: 'detectTime',
        width: 180
      },
      {
        title: '报警厂商',
        dataIndex: 'corpName',
        width: 120
      },
      {
        title: '报警类型',
        dataIndex: 'eventTypeName',
        width: 100
      }
    ],
    extData: formData.value
  })
const theData = ref({}), // 当前选中行弹窗所需数据
  viewEvidence = rowData => {
    theData.value = {
      id: rowData.id
    }
    selfModalShow.value = true
  },
  selfModalShow = ref(false) // 弹窗显隐

onMounted(() => {
  window.tableData = tableData
  getTableData()
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')
})
</script>

<style lang="less" scoped>
/* 表格 */
.table-wrap {
  height: calc(100% - 300px);
}
</style>
