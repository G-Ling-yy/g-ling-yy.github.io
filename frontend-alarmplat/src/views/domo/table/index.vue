<template>
  <Table
    tableName="test-table"
    :tableData="data"
    :loading="false"
    :row-key="`uuid`"
    :columns="columns"
    height="100%"
    :operation="false"
    :pagination="pagination"
    @change="handleTableChange"
  ></Table>
</template>
<script>
  import Table from '@/components/base/Table.vue'
  import { getList } from '@/api/table'
  const columns = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '注释',
      dataIndex: 'description'
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: 'datetime',
      dataIndex: 'datetime'
    }
  ]

  export default {
    data() {
      return {
        data: [],
        pagination: {
          showLessItems: true,
          showQuickJumper: true,
          showSizeChanger: true
        },
        query: {},
        loading: false,
        columns
      }
    },
    components: { Table },
    mounted() {
      this.fetch()
    },
    methods: {
      handleTableChange(pagination) {
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.fetch()
      },
      fetch() {
        this.loading = true
        getList({
          pageSize: this.pagination.pageSize,
          current: this.pagination.current
        }).then(({ data, total }) => {
          const pagination = { ...this.pagination }
          pagination.total = total
          this.loading = false
          this.data = data
          this.pagination = pagination
        })
      }
    }
  }
</script>
