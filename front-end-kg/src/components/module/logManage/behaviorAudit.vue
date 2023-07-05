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
        <el-breadcrumb-item>行为审计</el-breadcrumb-item>
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
          <!-- <el-form-item label="操作路径:" prop="operationModule">
            <el-select
              v-model="operationLogForm.operationModule"
              placeholder="操作模块"
              clearable
              style="width: 120px;"
            >
              <el-option
                v-for="item in moduleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          
          <!-- <el-form-item prop="operationPage">
            <el-select
              v-model="operationLogForm.operationPage"
              placeholder="操作页面"
              style="width: 120px;"
              clearable
            >
              <el-option
                v-for="item in pageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <span style="display: inline-block; margin: 6px 5px 0px -25px;"
            >-</span
          > -->
          <el-form-item prop="actionName">
            <el-select
              v-model="operationLogForm.actionName"
              placeholder="类型"
              clearable
              style="width: 100px;"
            >
              <el-option
                v-for="item in featureOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item  prop="operateUserName">
            <el-input
              placeholder="操作人姓名"
              v-model="operationLogForm.operateUserName"
              style="width: 100px;"
            ></el-input>
          </el-form-item>
          <el-form-item>
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
          </el-form-item>
          
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-group">
          <el-button type="primary" class="query" @click="searchLogMeaasge">查询</el-button>
          <el-button type="primary" class="reset" @click="resetSerachLogMeaasge">重置</el-button>
          <el-button type="primary" class="query" @click="backups">备份</el-button>
          <el-button type="primary" class="query" @click="recovery">恢复</el-button>
          <el-button 
            type="primary"
            @click="exportActionLog"
            plain
            class="query"
            style="margin-right:2px"
            >数据导出</el-button>

            <el-upload
            ref="upload"
            class="upload-demo"
            :action="`${BASECONFIG.API_BASE_URL}/device/platforms/`"
            multiple
            :limit="1"
            :show-file-list = "false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            >
             <el-button
            type="primary"
            plain
            class="query"
            >数据导入</el-button>
        </el-upload>
            
        </div>
        <!-- <span
          @click="seachMore"
          v-if="isAllHeight % 2 == 0"
          class="have-more-info"
          >更多</span
        >
        <span
          @click="seachMore"
          v-if="isAllHeight % 2 != 0"
          class="have-more-info"
          >收起</span
        > -->
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
          <el-table-column type="index" label="序号" align="center" width="60">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="actionName"
            label="类型"
            width
          ></el-table-column>
          <el-table-column prop="description" label="行为描述" width></el-table-column>
          <el-table-column
            prop="operateTime"
            label="时间"
            width
          ></el-table-column>
          <!-- <el-table-column
            prop="feature"
            label="操作功能"
            width
          ></el-table-column> -->
          <!-- <el-table-column
            prop="description"
            label="操作描述"
            width
          ></el-table-column> -->
          
          <el-table-column
            prop="gmtCreateName"
            label="操作用户名"
            width
          ></el-table-column>
          <el-table-column
            prop="operateUserName"
            label="操作人"
            width
          ></el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
            width
          ></el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属机构"
            width
          ></el-table-column>
          
          <el-table-column
            prop="operateUserPhone"
            label="联系方式"
            width
          ></el-table-column>
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
export default {
  data() {
    return {
      isAllHeight: 0,
      // 操作模块下拉框
      // moduleOptions: [
      //   {
      //     value: "资源管理",
      //     label: "资源管理",
      //   },
      //   {
      //     value: "基础数据",
      //     label: "基础数据",
      //   },
      //   {
      //     value: "数据统计",
      //     label: "数据统计",
      //   },
      //   {
      //     value: "图像管理",
      //     label: "图像管理",
      //   },
      //   {
      //     value: "日志管理",
      //     label: "日志管理",
      //   },
      //   {
      //     value: "系统管理",
      //     label: "系统管理",
      //   },
      // ],
      // pageOptions: [
      //   {
      //     value: "登录",
      //     label: "登录",
      //   },
      //   {
      //     value: "摄像机管理",
      //     label: "摄像机管理",
      //   },
      //   {
      //     value: "流媒体管理",
      //     label: "流媒体管理",
      //   },
      //   {
      //     value: "角色管理",
      //     label: "角色管理",
      //   },
      //   {
      //     value: "异常统计",
      //     label: "异常统计",
      //   },
      //   {
      //     value: "操作日志",
      //     label: "操作日志",
      //   },
      //   {
      //     value: "接口日志",
      //     label: "接口日志",
      //   },
      // ],
      featureOptions: [
        {
          value: "登录",
          label: "登录",
        },
        {
          value: "数据导出",
          label: "数据导出",
        },
        {
          value: "新增",
          label: "新增",
        },
        {
          value: "删除",
          label: "删除",
        },
        {
          value: "用户修改",
          label: "用户修改",
        },{
          value: "用户注册",
          label: "用户注册",
        },
      ],
      // 查询操作日志表单
      operationLogForm: {
        currPage: 1,
        pageSize: 10,
        operationModule: "", //操作模块
        operationPage: "", // 操作页面
        operationFeature: "", // 操作功能
        operationDate: "", // 操作时间
        startTime: "",
        endTime: "",
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
      organizationId: "",
      total: 0,
      pages: 0,
      listTableLoading: false,
    };
  },
  components: {},
  mounted() {
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
      console.log(currPage);
      this.searchLogMeaasge();
    },
    // 查看更多
    seachMore() {
      this.isAllHeight++;
    },
    // 根据条件搜索行为审计日志信息
    searchLogMeaasge() {
      var data = {
        currPage: this.operationLogForm.currPage,
        pageSize: this.operationLogForm.pageSize,
        actionName: this.operationLogForm.actionName,
        organizationId: this.jurisdictionValue[this.jurisdictionValue.length - 1],
        endTime: this.operationLogForm.operationDate[1],
        startTime: this.operationLogForm.operationDate[0],
        operateUserName: this.operationLogForm.operateUserName,
      };
      this.listTableLoading = true;
      this.$api
        .getActionLog(data)
        .then((res) => {
          if (res.code != 200) {
            return Promise.reject();
          }
          this.tableOperationList = res.data;
          this.total = res.total;
          this.pages = res.pages;
          this.listTableLoading = false;
          console.log(this.tableOperationList,"行为审计")
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
     beforeUpload (file) {
      console.log('bef',file)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      let isImage = testmsg == 'xlsx' || testmsg == 'xls'
      if (!isImage) {
        this.$message.warning('上传文件只能是 xls、xlsx格式!');
        return false
      }
    },
    uploadSuccess(res,file){
      if(res.code === 200){
          this.$message.success('上传成功！');
          type: 'success'
      }else {
           this.$message({
               type: 'error',
               message: res.message || '上传失败'
           })
       }
      this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
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
