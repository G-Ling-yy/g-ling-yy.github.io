/* es-lint disable */
import { ref, reactive } from 'vue'
import apis from '@/api'

export default function (options = {}) {
  const tableData = ref([]), // 表格数据
    loading = ref(false), // 表格loading遮罩
    pagination = reactive({
      // 分页配置
      current: options.pagination?.current ?? 1, // 当前页码
      pageSize: options.pagination?.pageSize || 100, // 页量
      showQuickJumper:
        options.pagination?.showQuickJumper ?? true, // go跳转显示
      showSizeChanger:
        options.pagination?.showSizeChanger ?? true, // 页量切换显示
      showTotal: total =>
        options.pagination?.showTotal ||
        `共 ${total} 条数据`,
      total: 0
    }),
    columns = reactive(options.columns), // reactive为了表格响应columns变更
    rowSelection =
      options.rowSelection &&
      reactive(options.rowSelection), // reactive为了表格响应rowSelection变更
    tableChangeHandler = (
      newPagination,
      filters,
      sorter
    ) => {
      typeof options.sorterCallBack === 'function' &&
        options.sorterCallBack(sorter)

      // 表格变更操作触发
      pagination.current = newPagination.current
      pagination.pageSize = newPagination.pageSize

      getTableData()
    },
    // 获取表格数据（thePage: String | Number 请求第n页数据）
    getTableData = thePage => {
      // 获取表格数据前置回调
      typeof options.beforeGetData === 'function' &&
        options.beforeGetData()

      // 获取表格数据
      loading.value = true
      const params =
        (options?.extData &&
          typeof options?.extData === 'function' &&
          options?.extData()) ||
        options?.extData ||
        {}

      if (options.pagination !== false) {
        thePage && (pagination.current = thePage)
        params.page = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize
        }
      }

      return apis[
        options.api.includes('/')
          ? options.api.split('/')[0]
          : 'events'
      ]
        ?.[
          options.api.includes('/')
            ? options.api.split('/')[1]
            : options.api
        ](params)
        .then(res => {
          // 获取表格数据后置回调
          typeof options.afterGetData === 'function' &&
            res.data &&
            options.afterGetData(res)

          pagination.total = res.page?.total ?? 0
          tableData.value = res.data || options.afterGetData(res)
        })
        .catch(err => {
          console.log('table api err:', err)
          pagination.total = 0
          tableData.value = []

          return err
        })
        .then(e => {
          // 若 手动取消请求 （则不停止loading）
          if (
            e &&
            Reflect.has(e, 'message') &&
            e.message === undefined
          )
            return
          loading.value = false
        })
    }

  return {
    tableData,
    loading,
    pagination,
    columns,
    rowSelection,
    tableChangeHandler,
    getTableData
  }
}

/*

*
example:
*
import createTableVariables from '@/assets/scripts/create-table-variables'
*
const { tableData, loading, pagination, tableChangeHandler, getTableData } =
  createTableVariables({
    api: 'getOriginAlarms', // api接口名
    columns: [
      ...
    ],
    extData: formData.value, // 额外数据（比如表单数据，支持函数返回: extData: object | function() : void）
    afterGetData: res => res, // 获取数据后的预先数据处理
    sorterCallBack // 自定义排序事件
  })
*

*

*/
