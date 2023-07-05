<template>
    <div class="page">
        <!-- 时间查询 -->
        <div class="search-wrap">
            <selfSearch @search="search"></selfSearch>
        </div>

        <!-- 查询下方,页面主体部分 -->
        <main>
            <div class="act-bar">
                <ma-button>导出数据</ma-button>
            </div>
            <div class="table-wrap">
            <Table
                tableClass="self-table"
                :scroll="{ x: 1600, y: 600 }"
                :height="tableMaxHeight"
                :rowSelection="rowSelection"
                :row-key="'id'"
                :columns="columns"
                :tableData="tableData"
                :loading="loading"
                :isSelect="false"
                :pagination="pagination"
                :operation="false"
                :show-view-btn="false"
                :showEditBtn="false"
                :showDelBtn="false"
                @change="tableChangeHandler"
                >
               <!-- 操作 -->
               <template #column-operation="{record}">
                 <a @click.prevent="viewEvidence(record)">详情</a>
               </template>
            </Table>
            </div>
        </main>
    </div>
       <!-- 表格弹窗 -->
    <selfModal
     :data="theData"
     v-if="selfModalShow"
     v-model:visible="selfModalShow">
     </selfModal>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  onBeforeUnmount
} from 'vue'

// 详情表格
import selfModal from './modules/selfModal.vue'
import selfSearch from './modules/selfSearch.vue'
import selfStore from './modules/self-store'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import { onMounted } from 'vue'
import apis from '@/api'
import { debounce } from '@/utils/lodash'

/* 表单数据 */
const formData = computed(() => selfStore.formData),
  search = () => {
    pagination.current = 1
    getTableData()
}

const {
    tableData,
    loading,
    pagination,
    columns,
    getTableData,
    tableChangeHandler
  } = createTableVariables({
    api: 'queryOwnerRecord',
    columns: [
    {
        title: '序号',
        dataIndex: 'indexNum',
        width: 30
    },
    {
        title: '报表名称',
        dataIndex: 'reportName',
        width: 240
    },
    {
        title: '检测摄像机数',
        dataIndex: 'cameraNum',
        width: 80
    },
    {
        title: '报表统计时间',
        dataIndex: 'reportTime',
        width: 140
    },
    {
        title: '接收时间',
        dataIndex: 'createDate',
        width: 100
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width:80,
        renderBySlot: true
    }
],
    extData: () => formData.value,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })
    }
}),
 tableMaxHeight = ref(`${innerHeight - 365}px`)

const selectedRowKeys = ref([])
const rowSelection = {
    type: 'checkBox',
    onChange: (selectedRowKeys, selectedRows) => {
        // console.log('选择了几行?:', selectedRows.length)
        // console.log('这是第几行?:', selectedRows[0].xh)
        console.log('selectedRows[0]:', selectedRows[0])
        selectedRowKeys.value = selectedRowKeys
        console.log('selectedRowKeys:', selectedRowKeys.value)
      },
    onSelect: (record, selected, selectedRows) => {
        console.log('record1111111111111111:', record)
        // console.log('selected:', selected)
        if (selected) {
        selectedRows.unshift(record)
        console.log('selectedRows.unshift(record):', selectedRows.unshift(record))
        console.log('selectedRows:', selectedRows)
      }
    }
}

// 当前选中行弹窗所需数据
const theData = ref({}),
   viewEvidence = rowData => {
     console.log('rowData?????????????????:', rowData)
    theData.value = {
     recordId: rowData.id
    }
    selfModalShow.value = true
    console.log('theData???????????:', theData)
  },
  selfModalShow = ref(false) // 弹窗显隐

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    tableMaxHeight.value = `${innerHeight - 365}px`
  }, 200)
)

onMounted(() => {
  getTableData()
  console.log('tableData00000000000:', tableData)
  console.log('getTableData00000000000:', getTableData())
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

.page{
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  height: calc(100% + 40px);
  margin: -20px;
  overflow: hidden;
  position: relative;
  width: calc(100% + 40px);

    .search-wrap {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 1rem 1rem 0;
  }
}

main{
    background-color: #fff;
    flex: 1;
    padding: 1rem;
    .act-bar{
        padding: 1rem 1rem 0;
    }

.table-wrap{
     padding: 1rem 1rem 0;
 }
}
</style>