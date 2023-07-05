<template>
  <!-- 入职测试页面 -->
  <div class="test-container">
    <TestForm
      v-model:search="formSearch"
      @resetSearch="resetSearch"
      @addTask="addTask"
      @toDelByIds="toDelByIds"
      @handleSearch="handleSearch"
    />
    <div style="width: 100%">
      <TestTable
        :data-list="dataList"
        v-model:pagination="pagination"
        v-model:selectArr="selectArr"
        @handleTableChange="handleTableChange"
        @toEdit="toEdit"
        @toDel="toDel"
      />
    </div>

    <!-- 新增、编辑弹窗 -->
    <TestModal
      v-if="modalVisible"
      v-model:visible="modalVisible"
      :modal-type="modalType"
      :modal-data="modalData"
      @submitModal="submitModal"
      @cancelModal="cancelModal"
    />
  </div>
</template>

<script>
import {
  getTaskPageList,
  addTask,
  editTask,
  delTaskById,
  delTaskByIds
} from '@/api/test'
import TestForm from './components/TestForm.vue'
import TestTable from './components/TestTable.vue'
import TestModal from './components/TestModal.vue'
const conditions = [1, 2]
if (
  process.env.NODE_ENV === 'development' &&
  conditions[0] < ~conditions[1]
) {
  import('@/components/upto/dataanlisy/index.vue').then(
    res => {
      console.log('res', res)
    }
  )
}

export default {
  name: 'Test',
  data() {
    return {
      modalType: '',
      modalData: {},
      modalVisible: false,
      dataList: [],
      pagination: {
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: true,
        currentPage: 1,
        pageSize: 10
      },
      formSearch: {
        id: '',
        name: ''
      },
      selectArr: []
    }
  },
  components: { TestForm, TestTable, TestModal },
  methods: {
    toDel(row) {
      delTaskById(row.id).then(res => {
        if (res.code === '200') {
          this.$message.success('删除成功')
          this.resetSearch()
        } else {
          this.$message.error('删除失败！' + res.msg)
        }
      })
    },
    toDelByIds() {
      console.log(
        this.selectArr,
        'this.selectArrthis.selectArrthis.selectArrthis.selectArr'
      )
      if (this.selectArr.length) {
        const str = this.selectArr.join(',')
        delTaskByIds(str).then(res => {
          if (res.code === '200') {
            this.$message.success('删除成功')
            this.resetSearch()
          } else {
            this.$message.error('删除失败！' + res.msg)
          }
        })
      } else {
        this.$message.error('删除失败！未选择任务。')
      }
    },
    toEdit(row) {
      this.modalType = '编辑'
      this.modalData = row
      this.modalVisible = true
    },
    addTask() {
      this.modalType = '新增'
      this.modalVisible = true
    },
    submitModal(data) {
      console.log(this.modalType, data)
      if (this.modalType === '新增') {
        addTask(data).then(res => {
          if (res.code === '200') {
            this.$message.success('新增成功')
            this.resetSearch()
          } else {
            this.$message.error('新增失败！' + res.msg)
          }
          this.modalType = null
          this.modalData = {}
          this.modalVisible = false
        })
      } else {
        editTask(data).then(res => {
          if (res.code === '200') {
            this.$message.success('编辑成功')
            this.resetSearch()
          } else {
            this.$message.error('编辑失败！' + res.msg)
          }
          this.modalType = null
          this.modalData = {}
          this.modalVisible = false
        })
      }
    },
    cancelModal() {
      this.modalData = {}
      this.modalType = ''
      this.modalVisible = false
    },
    resetSearch() {
      this.pagination = { currentPage: 1, pageSize: 10 }
      this.formSearch = { id: '', name: '' }
      this.queryList()
    },
    handleSearch() {
      this.pagination = { currentPage: 1, pageSize: 10 }
      this.queryList()
    },
    queryList() {
      getTaskPageList({
        ...this.formSearch,
        page: this.pagination
      }).then(res => {
        if (res.data) {
          this.dataList = res.data.list
          this.pagination = {
            ...this.pagination,
            // currentPage: res.data.page.currentPage,
            total: res.data.page.totalNum, // 数据总数
            pageSize: res.data.page.pageSize
          }
          console.log(
            this.pagination,
            'paginationpaginationpagination'
          )
        }
      })
    },
    handleTableChange(pagination) {
      this.pagination = {
        ...pagination,
        currentPage: pagination.current
      }
      console.log(this.pagination, ' this.pagination')
      this.queryList()
    }
  },
  created() {
    this.queryList()
  }
}
</script>
