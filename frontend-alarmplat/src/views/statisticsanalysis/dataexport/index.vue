<template>
  <!-- 表单 -->
  <self-form @handleSearch="searchHandler" />

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
    />
  </div>
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
import selfForm from './modules/SelfForm'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
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
    api: 'getStories',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60,
        minWidth: 60
      },
      {
        title: '事件发生时间',
        dataIndex: 'begTime',
        width: 170
      },
      {
        title: '事件位置',
        dataIndex: 'location',
        width: 160
      },
      {
        title: '摄像机位置',
        dataIndex: 'cameraLocation',
        width: 160
      },
      {
        title: '事件类型',
        dataIndex: 'eventTypeName',
        // reRender: (data, row) => `${data} - ${row.objectTypeName}`,
        width: 150
      },
      {
        title: '是否检出',
        dataIndex: 'isCheck',
        width: 80
      },
      {
        title: '是否准确',
        dataIndex: 'isCorrect',
        width: 80
      },
      {
        title: '是否主动发现',
        dataIndex: 'isEarlier',
        width: 100
      },
      {
        title: '最近摄像机距离',
        dataIndex: 'nearest',
        reRender: data => data + '米',
        width: 120
      }
      // {
      //   title: '备注',
      //   dataIndex: 'remarks',
      //   width: 60
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
  tableMaxHeight = ref(`${innerHeight - 300}px`)

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
