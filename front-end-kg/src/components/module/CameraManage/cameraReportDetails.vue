<template>
    <div class="camera-content">
    <el-table
      :data="tableData"
      max-height="500"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号" 
        align="center"
        width="60">
    </el-table-column>
      <el-table-column
        prop="cameraNum"
        label="摄像机名称"
        min-width="320">
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        min-width="100">
        <template slot-scope="scope">
                <div>
                   <img
                    v-if="scope.row.status === 0"
                    src="../../../assets/images/icon/success.png"
                    style="width: 20px;height: 20px"
                  />
                  <img 
                    v-else
                    src="../../../assets/images/icon/stop.png"
                    style="width: 20px;height: 20px"
                  />
                </div>
            </template>
      </el-table-column>
      <el-table-column
        prop="info"
        label="失败原因"
         min-width="190">
          <template slot-scope="scope">
                <div>
                  <span  v-if="scope.row.status === 0"></span>
                  <span  v-if="scope.row.status === 1">{{scope.row.info}}</span>
                </div>
            </template>
      </el-table-column>
    </el-table>
    <!--分页控件-->
      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20,30, 40,50,60,70,80,90,100,]" 
          :page-size="limit"
          :total="total"
        ></el-pagination>
      </div>
    </div>
</template>
<script>
export default {
    data() {
    return {
        data: [],
        limit: 10,
        page: 1,
        total: null,
        tableData: this.cameraReportDetailsList,

        }
    },
    props: {
    cameraTransferInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    cameraReportDetailsList: {
      type: Array,
      default() {
        return [];
      }
    },
     succeedList: {
      type: Array,
      default() {
        return [];
      }
    },
     errorList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created () {
      this.pageList()
      this.$emit('reportTotal', this.total)
  },
  methods: {

    // 复选框change事件
    radioChange (val) {
      this.tableData = []
      // 1:全选 2：成功 3：失败
      console.log(val)
      switch (val) {
          case 1:
          this.tableData = this.cameraReportDetailsList
          this.pageList()
          this.$emit('reportTotal', this.total)
          break;
           case 2:
          this.tableData = this.succeedList
          this.pageList()
          this.$emit('reportTotal', this.total)
          break;
           case 3:
          this.tableData = this.errorList
          this.pageList()
          this.$emit('reportTotal', this.total)
          break;
        default:
          this.tableData = this.cameraReportDetailsList
          this.pageList()
          this.$emit('reportTotal', this.total)
          break;
      }
    },

            pageList() {
                // 发请求拿到数据并暂存全部数据,方便之后操作
                this.data = this.tableData
                this.getList()
            },
            // 处理数据
            getList() {
                // es6过滤得到满足搜索条件的展示数据list
                // let list = this.data.filter((item, index) =>
                //     item.name.includes(this.searchData)
                // )
                this.tableData = this.data.filter((item, index) =>
                    index < this.page * this.limit && index >= this.limit * (this.page - 1)
                )
                this.total = this.data.length
            },
            // 当每页数量改变
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.limit = val
                this.getList()
            },
            // 当当前页改变
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.page = val
                this.getList()
            },



  //     /**
  //    * 分页导航
  //    * @param val
  //    */
  //   handlePageChange(val) {
  //       console.log('分页导航',val)
  //   },

  //   /**
  //    * 分页导航 改变每页展示数量
  //    * @param index
  //    */
  //   handleSizeChange(index) {
  //     console.log('分页导航 改变每页展示数量',index)
  //   },
  },
}
</script>
<style lang="less" scope>
    // 分页
    .pagination {
        margin-top: 15px;
    }
</style>