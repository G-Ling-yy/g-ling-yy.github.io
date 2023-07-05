<template>
  <div class="content-wrapper operation-log" ref="viewbox">
    <!-- operationLog -->
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频流日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 头部搜索框 -->
    <div class="camera-search-display camera-manage-search">
      <!-- <div> -->
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <!-- <div class="search-wrapper" style="padding-right: 10px !important;"> -->
        <el-form
          :inline="true"
          :model="operationLogForm"
          ref="operationLogFormRef"
          class="demo-form-inline"
        >
          <el-form-item prop="actionName">
            <el-select
              v-model="operationLogForm.event"
              placeholder="类型"
              clearable
              style="width: 100px;"
            >
              <el-option
                v-for="item in event"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item  prop="endTime">
            <el-input
              placeholder="断流次数"
              v-model="operationLogForm.endTime"
              style="width: 100px;"
            ></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-date-picker
              v-model="operationLogForm.operationDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 360px;"
            ></el-date-picker>
          </el-form-item>
          
          <!-- <el-form-item>
            <el-cascader
              v-model="jurisdictionValue"
              placeholder="所属机构"
              style="width: 110px;"
              clearable
              filterable
              change-on-select
              :show-all-levels="false"
              :options="orgTreeList"
              :props="orgCodeProps"
              @change="orgChange"
              @clear="orgChange"
            ></el-cascader>
          </el-form-item> -->
          
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-group">
          <el-button type="primary" class="query" @click="searchLogMeaasge">查询</el-button>
          <el-button type="primary" class="reset" @click="resetSerachLogMeaasge">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格展示模块 -->
    <div :class="isAllHeight % 2 == 0 ? 'table-wrapper' : 'table-wrapper-all'">
      <!-- <div class="table-control" style="padding-right: 20px!important">
        
      </div> -->
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          :data="tableOperationList"
          v-loading="listTableLoading"
          border
          height="100%"
          
        >
          <!-- <el-table-column type="index" label="序号" align="center" width="60">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column> -->
          <el-table-column
            prop="event"
            label="类型"
            width
          >
            <template slot-scope="scope">
                <div>{{ scope.row.event == 1 ? "正常" : scope.row.event == 0 ?"断流":""}}</div>
            </template>
          </el-table-column>
          <el-table-column 
            prop="regionName" 
            label="地区"             
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属机构"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="cameraName"
            label="摄像机名称"
            width
            show-overflow-tooltip

          ></el-table-column>
          <el-table-column
            prop="roadName"
            label="所属路线"
            show-overflow-tooltip
            width
          ></el-table-column>
          <el-table-column
            prop="pileNum"
            label="桩号"
            show-overflow-tooltip
            width
          ></el-table-column>
          <el-table-column
            prop="pushStreamBegtime"
            label="开始传输时间"
            show-overflow-tooltip
            width
          ></el-table-column>
          <el-table-column
            prop="pushStreamEndtime"
            label="传输结束时间"
            show-overflow-tooltip
            width
          >
          <template slot-scope="scope">
                  <div>
                    {{ scope.row.pushStreamEndtime ?  scope.row.pushStreamEndtime : '--' }}
                  </div>
                </template>
          </el-table-column>
          <el-table-column
            prop="pushStreamHowlong"
            label="传输时长"
            show-overflow-tooltip
            width
          >
          <template slot-scope="scope">
            <!-- <div>{{scope.row.pushStreamHowlong}}</div> -->
            <div>{{parseLen(parseInt(scope.row.pushStreamHowlong/60/60))}}:{{parseLen(parseInt(scope.row.pushStreamHowlong/60%60))}}:{{parseLen(parseInt(scope.row.pushStreamHowlong%60))}}</div>
          </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="断流次数"
            show-overflow-tooltip
            width
          >
          </el-table-column>
          <el-table-column
            prop="operateUserPhone"
            label="视频流编码格式"
            show-overflow-tooltip
            width
          >H.264</el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="changePageSize"
          @current-change="changeCurrentPage"
          :current-page="operationLogForm.currPage"
          :page-size="operationLogForm.pageSize"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import util from '../../../filters/utils.js'
export default {
  data() {
    return {
      isAllHeight: 0,
      event: [
        { label: "断流", value: "0" },
        { label: "正常", value: "1" },
      ],
      
      // 查询操作日志表单
      operationLogForm: {
        currPage: 1,
        pageSize: 10,
        event:"",
        roadId:"",
        operationDate: "", // 操作时间
        pushStreamBegtime: "",
        pushStreamEndtime: "",
        endTime:"",
        operateUserName: "", //操作人
        organization: "", //操作人所属机构
      },
      jurisdictionValue:"",
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
        //lazyLoad:this.propsLazyload
      },
      orgTreeList: [], //管辖单位数据
      tableOperationList: [], //表格展示数据
      timeEvent:"",
      organizationId: "",
      total: 0,
      pages: 0,
      listTableLoading: false,
    };
  },
  components: {},
  mounted() {
    console.log(util.date("yy-m-d",new Date()),'utils')
    this.queryOrgList(); //获取组织架构树
    this.searchLogMeaasge();
  },
  computed: {
    ...mapState([]),
  },
  methods: {
    ...mapActions([]),
    changePageSize(page) {
      this.operationLogForm.currPage = 1;
      this.operationLogForm.pageSize = page;
      this.searchLogMeaasge();
    },
    changeCurrentPage(currPage) {
      this.operationLogForm.currPage = currPage;
      // console.log(currPage);
      this.searchLogMeaasge();
    },
    //时间格式转换补0
    parseLen(v){
      return v>9 ?v:"0"+v;
    },
    // 查看更多
    seachMore() {
      this.isAllHeight++;
    },
    // 根据条件搜索行为审计日志信息
    searchLogMeaasge() {
      let myDate = new Date(); // 获取今天日期
      myDate.setDate(myDate.getDate() - 1);
      let dateTemp;
      let endDay;
      myDate.setDate(myDate.getDate());
      let MM = myDate.getMonth();
      let day = myDate.getDate();
      let hh = myDate.getHours();
      let mm = myDate.getMinutes();
      let ss = myDate.getSeconds();
        if (MM < 10) {
          MM = "0" + MM;
        }
        if (day < 10) {
          day = "0" + day;
        }
        if (hh < 10) {
          hh = "0" + hh;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
        if (ss < 10) {
          ss = "0" + ss;
        }
      dateTemp = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + hh + ":" + mm + ":" + ss;
      endDay = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + (myDate.getDate() +1) + " " + hh + ":" + mm + ":" + ss;
      var data = {
        // event:1, 
        event:this.operationLogForm.event,
        currPage: this.operationLogForm.currPage,
        pageSize: this.operationLogForm.pageSize,
        organizationId: this.jurisdictionValue[this.jurisdictionValue.length - 1],
        pushStreamEndtime: this.operationLogForm.operationDate[1],
        pushStreamBegtime: this.operationLogForm.operationDate[0],
        endTime: this.operationLogForm.endTime,
        // pushStreamEndtime: endDay,
        // pushStreamBegtime: dateTemp,

      };
      this.listTableLoading = true;
      this.$api
        .getStreamLog(data)
        .then((res) => {
          if (res.code != 200) {
            return Promise.reject();
          }
          let timeEvents = res.data
          this.tableOperationList = res.data;
          this.total = res.total;
          this.pages = res.pages;
          this.listTableLoading = false;
          console.log(this.tableOperationList,"行为审计")

          if(timeEvents.length){
            let timeEvent=[];
            //把传输时长添加到数组里
            timeEvents.forEach((vo) => {
              timeEvent.push(vo.pushStreamHowlong)
            });
          }
          let h = (timeEvent.getHours() < 10 ? '0' + timeEvent.getHours() : timeEvent.getHours()) + ':';
          let m = (timeEvent.getMinutes() < 10 ? '0' + timeEvent.getMinutes() : timeEvent.getMinutes()) + ':';
          let s = (timeEvent.getSeconds() < 10 ? '0' + timeEvent.getSeconds() : timeEvent.getSeconds());
        })
        .catch((error) => {
          this.listTableLoading = false;
        });
    },
    // 导出
    exportActionLog() {
      var obj = {};
      this.$api
        .exportActionLog(obj)
        .then((data) => {
          var blob = new Blob([data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "行为审计列表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          this.$message({
            message: "摄像机导出失败! ",
            type: "error",
          });
        });
    },
    // 重置
    resetSerachLogMeaasge() {
      this.operationLogForm.event="",
      this.operationLogForm.actionName="",
      this.operationLogForm.operationDate = "",
      this.operationLogForm.operateUserName="",
      this.jurisdictionValue="",
      this.operationLogForm.currPage = 1;
      this.operationLogForm.pageSize = 10;
      this.$refs.operationLogFormRef.resetFields();
      this.searchLogMeaasge();
    },
    backups(){
      this.$message({
          message: '备份成功！',
          type: 'success'
        });
    },
    recovery(){
      this.$message({
        message:'恢复成功!',
        type:'success'
      })
    },
    uploadSuccess(res){
      if(res.code === 200){
           this.$message.success('上传成功！');
           type: 'success'
      }else {
           this.$message({
               type: 'error',
               message: res.msg || '上传失败'
           })
       }
    },
    orgChange(val) {
      console.log(val);
      this.operationLogForm.organization = "";
      if (val.length) {
        let orgId = val[val.length - 1];
        this.operationLogForm.organization = orgId;
      }
      console.log(this.operationLogForm.organization);
    },
    // 获取组织架构树
    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree(params)
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data[0].childList;
          _.each(nlist, it => {
            it.disabled = true;
          });
          _this.orgTreeList = nlist;
        })
        // .catch((error) => {
        //   v.$message({
        //     message:
        //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
        //     type: "error",
        //   });
        // });
    },
  },
};
</script>

<style lang="less" scoped>
.operation-log {
  .content-wrapper .search-btn-right {
    width: 30%;
  }
  .table-wrapper .table-content-body {
    max-height: calc(100% - 78px) !important;
  }
}
.btn-group{
  padding-top: 20px;
  display: flex;
}
</style>
