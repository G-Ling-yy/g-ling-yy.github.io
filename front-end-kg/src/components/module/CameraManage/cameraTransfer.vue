<template>
    <div class="camera-content">
    <el-table
      :data="tableData"
      max-height="600"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号" 
        align="center"
        width="60">
    </el-table-column>
      <el-table-column
        prop="pushStreamBegtime"
        label="开始传输时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="pushStreamEndtime"
        label="传输结束时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="pushStreamHowlong"
        label="传输时长"
         min-width="150">
          <template slot-scope="scope">
            <span>{{scope.row.pushStreamHowlong ? scope.row.pushStreamHowlong : '--'}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="pushStreamCoding"
        label="视频流编码格式"
        widt="180"
        >
      </el-table-column>
    </el-table>
     <!--分页控件-->
      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="currPage"
          :total="total"
        ></el-pagination>
      </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
          total: 0,
          currPage:1,
          pageSize: 10,
          tableData: [] // 视频流状态列表
        }
    },
    props: {
    cameraTransferInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created () {
    this.getvideoStreamStatusList()
  },
  methods: {
    // 获取视频流状态监测
     getvideoStreamStatusList () {
       let obj = {
         currPage: this.currPage,
         pageSize: this.pageSize,
         cameraId: this.cameraTransferInfo.cameraId //当前行cameraId
       }
       this.$api
        .getvideoStreamStatus(obj)
        .then(res => {
          if(res.data.length) {
            res.data.forEach(item => {
              item.pushStreamCoding = 'H.264'
              if(item.pushStreamHowlong) {
                item.pushStreamHowlong = this.formatSeconds(item.pushStreamHowlong)
              }
            })
          }
          this.tableData = res.data
          this.total = res.total
        })
     },
    //  将秒数转换为时分秒格式
    formatSeconds (val) {
      let theTime = parseInt(val)// 秒
      let middle= 0// 分
      let hour= 0// 小时

      if(theTime > 60) {
          middle= parseInt(theTime/60)
          theTime = parseInt(theTime%60)
          if(middle> 60) {
              hour= parseInt(middle/60)
              middle= parseInt(middle%60)
          }
      }
      theTime = this.convert(parseInt(theTime))
      middle  = this.convert(parseInt(middle))
      hour  = this.convert(parseInt(hour))
      let result = `00 ：00 ：${theTime}`
      if(middle > 0) {
          result = `00 ：${middle} ：${theTime}`
      }
      if(hour> 0) {
          result = `${hour} ：${middle} ：${theTime}`
      }
      return result
    },
    // 小于10的数字前面补“0”
    convert (val) {
      return /^\d$/.test(val) ? '0' + val : val
    },
        /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
        console.log('分页导航',val)
        this.currPage = val
        this.getvideoStreamStatusList()
    },

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      console.log('分页导航 改变每页展示数量',index)
        this.pageSize = index
        this.currPage = 1
        this.getvideoStreamStatusList()
    },
  },
}
</script>
<style lang="less" scope>
   
</style>