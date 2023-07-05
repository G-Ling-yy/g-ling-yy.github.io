<template>
  <Table
    class="test-table"
    tableName="test-table"
    :tableData="dataList"
    :row-key="'id'"
    :loading="false"
    :columns="columns"
    :operation="true"
    :pagination="pagination"
    :operationWidth="160"
    :show-view-btn="false"
    :isSelect="true"
    :rowSelection="{
      onChange: onSelectChange
    }"
    height="calc(100vh - 380px)"
    @change="handleTableChange"
    @toEdit="toEdit"
    @toDel="toDel"
  />
</template>

<script>
import Table from '@/components/base/Table.vue'

export default {
  name: 'TestTable',
  data() {
    return {
      columns: [
        {
          title: '任务ID',
          dataIndex: 'id',
          width: 260
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          width: 180
        },
        {
          title: '任务环节操作人',
          dataIndex: 'nodeOptUser',
          width: 120
        },
        {
          title: '更新时间',
          dataIndex: 'dataUpdateTime',
          width: 200
        }
      ]
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: { Table },
  methods: {
    changeSelectArr(selectArr) {
      this.$emit('update:selectArr', selectArr)
    },
    onSelectChange(ids) {
      this.changeSelectArr(ids)
    },
    handleTableChange(pagination) {
      this.$emit('handleTableChange', pagination)
    },
    toEdit() {
      this.$emit('toEdit')
    },
    toDel() {
      this.$emit('toDel')
    }
  },
  created() {}
}
</script>
<style lang="less">
.test-table {
  .ant-table-body {
    margin-top: 20px;
  }
}
</style>
