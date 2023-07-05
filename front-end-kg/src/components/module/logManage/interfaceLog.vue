<template>
  <div class="content-wrapper" ref="viewbox">
    <!-- interfaceLog   -->
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
        <el-breadcrumb-item>接口日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="interfacelog-content">
      <el-tabs
        v-model="activeName"
        class="gd-custom-tabs tab-height-log"
        type="card"
        tab-position="top"
        @tab-click="handleClick"
      >
        <el-tab-pane label="开放日志" name="openCenterLog">
          <div class="camera-search-display camera-manage-search">
            <div
              :class="
                isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'
              "
            >
              <el-form
                :inline="true"
                :model="openCenterLogForm"
                ref="openCenterLogFormRef"
                class="demo-form-inline"
              >
                <el-form-item label="接口状态" prop="opiStatus">
                  <el-select
                    v-model="openCenterLogForm.opiStatus"
                    placeholder="接口状态"
                    style="width: 120px;"
                  >
                    <el-option label="成功" value="1"></el-option>
                    <el-option label="失败" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="接口描述:" prop="interfaceName">
                  <el-input
                    placeholder="请输入接口描述"
                    v-model="openCenterLogForm.interfaceName"
                    style="width: 150px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="应用名:" prop="appName">
                  <el-input
                    placeholder="请输入应用名"
                    v-model="openCenterLogForm.appName"
                    style="width: 150px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="操作时间:" prop="operationDate">
                  <el-date-picker
                    v-model="openCenterLogForm.operationDate"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    style="width: 350px;"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="search-btn-right opertion-log">
              <div class="btn-padding">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchOpenCenterLogQuery"
                  >查询</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="resetOpenCenterSerachMeaasge"
                  >重置</el-button
                >
              </div>
              <span
                @click="seachMore"
                v-if="isAllHeight % 2 == 0"
                class="have-more-info"
                >
                <i class="el-icon-arrow-down"  style="font-size: 18px;"></i>
                </span>
              <span
                @click="seachMore"
                v-if="isAllHeight % 2 != 0"
                class="have-more-info"
                >
                  <i class="el-icon-arrow-up"  style="font-size: 18px;"></i>
                </span>
            </div>
          </div>
          <!-- 开放中心日志表格模块 -->
          <!-- <div style="height:calc(100% - 100px);"> -->
          <div
            :class="
              isAllHeight % 2 == 0
                ? 'table-content-body-log'
                : 'table-content-body-log-all'
            "
          >
            <el-table
              :data="tableOpenCenterList"
              border
              v-loading="listTableLoading"
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              >
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="uri"
                label="接口路径"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="operation"
                label="接口描述"
                width
              ></el-table-column>
              <el-table-column prop="requestParam" label="传参" width>
                <template slot-scope="scope">
                  <div
                    class="hidden_space"
                    @click="openReferenceDrawer(scope.row.requestParam)"
                  >
                    {{ scope.row.requestParam }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="responseBody" label="回参" width>
                <template slot-scope="scope">
                  <div
                    class="hidden_space"
                    @click="openReferenceDrawer(scope.row.responseBody)"
                  >
                    {{ scope.row.responseBody ?  scope.row.responseBody : '--' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="接口状态" width="100">
                <template slot-scope="scope">
                    <div>{{ scope.row.opiStatus == 1 ? "成功" : scope.row.opiStatus == 0 ?"失败":""}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="调用时间"
                width="160"
              ></el-table-column>
              <el-table-column
                prop="appId"
                label="APPID"
                width
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                    <div>{{ scope.row.appId ?  scope.row.appId : '--'}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="appName"
                label="应用名称"
                width
              >
                <template slot-scope="scope">
                    <div>{{ scope.row.appName ?  scope.row.appName : '--'}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="appKey"
                label="KEY"
                width
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                    <div>{{ scope.row.appKey ?  scope.row.appKey : '--'}}</div>
                </template>
              </el-table-column>
              <el-table-column prop label="应用类型" width="100">
                <template slot-scope="scope">
                    <div>{{ scope.row.keyType == 0 ? "WEB服务" : 
                      scope.row.keyType == 1 ?"WEB端": 
                      scope.row.keyType == 2 ?"微信小程序": 
                      scope.row.keyType == 3 ?"智能分析":""}}</div>

                  <!-- <span v-if="scope.row.keyType === '0'">WEB服务</span>
                  <span v-if="scope.row.keyType === '1'">WEB端</span>
                  <span v-if="scope.row.keyType === '2'">微信小程序</span>
                  <span v-if="scope.row.keyType === '3'">智能分析</span> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-pagination">
                <p class="total-pagination">共{{openCenterLogForm.total}}条</p>
            <el-pagination
              background
              layout=" prev, pager, next, sizes, jumper "
              @size-change="changeOpenCenterPageSize"
              @current-change="changeOpenCenterCurrentPage"
              :current-page="openCenterLogForm.currPage"
              :page-size="openCenterLogForm.pageSize"
              :total="openCenterLogForm.total"
            ></el-pagination>
          </div>
          <!-- </div> -->
        </el-tab-pane>
        <!-- ================对接日志模块============= -->
        <el-tab-pane label="对接日志" name="dockingLog">
          <div class="camera-search-display camera-manage-search">
            <div
              :class="
                isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'
              "
            >
              <el-form
                :inline="true"
                :model="interfaceLogForm"
                ref="interfaceLogFormFormRef"
                class="demo-form-inline"
              >
                <el-form-item label="接口状态" prop="opiStatus">
                  <el-select
                    v-model="interfaceLogForm.opiStatus"
                    placeholder="接口状态"
                    style="width: 120px;"
                  >
                    <el-option label="成功" value="1"></el-option>
                    <el-option label="失败" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="接口描述:" prop="interfaceName">
                  <el-input
                    placeholder="请输入接口描述"
                    v-model="interfaceLogForm.interfaceName"
                    style="width: 150px;"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="平台编号:" prop="platformCode">
                  <el-input
                    placeholder="请输入平台编号"
                    v-model="interfaceLogForm.platformCode"
                    style="width: 150px;"
                  ></el-input>
                </el-form-item> -->
                <el-form-item label="用户:" prop="user">
                  <el-input
                    placeholder="请输入用户编码"
                    v-model="interfaceLogForm.user"
                    style="width: 150px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="操作时间:" prop="operationDate">
                  <el-date-picker
                    v-model="interfaceLogForm.operationDate"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    style="width: 350px;"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="search-btn-right opertion-log">
              <div class="btn-padding">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchInterfaceLogQuery"
                  >查询</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="resetInterfaceLogSerachMeaasge"
                  >重置</el-button
                >
              </div>
              <span
                @click="seachMore"
                v-if="isAllHeight % 2 == 0"
                class="have-more-info"
                >
                <i class="el-icon-arrow-down"  style="font-size: 18px;"></i>
                </span>
              <span
                @click="seachMore"
                v-if="isAllHeight % 2 != 0"
                class="have-more-info"
                >
                <i class="el-icon-arrow-up"  style="font-size: 18px;"></i>
                </span>
            </div>
          </div>
          <!-- 对接日志表格模块 -->
          <!-- <div style="height:calc(100% - 100px);"> -->
          <div
            :class="
              isAllHeight % 2 == 0
                ? 'table-content-body-log'
                : 'table-content-body-log-all'
            "
          >
            <el-table
              border
              :data="interfaceLogList"
              v-loading="listTableLoading"
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              >
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="uri"
                label="接口路径"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="operation"
                label="接口描述"
                width
              ></el-table-column>
              <el-table-column prop="requestParam" label="传参" width>
                <template slot-scope="scope">
                  <div
                    class="hidden_space"
                    @click="openReferenceDrawer(scope.row.requestParam)"
                  >
                    {{ scope.row.requestParam }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="responseBody" label="回参" width>
                <template slot-scope="scope">
                  <div
                    class="hidden_space"
                    @click="openReferenceDrawer(scope.row.responseBody)"
                  >
                    {{ scope.row.responseBody }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="接口状态" width="100">
                <template slot-scope="scope">
                    <div>{{ scope.row.opiStatus == 1 ? "成功" : scope.row.opiStatus == 0 ?"失败":""}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="调用时间"
                width="160"
              ></el-table-column>
              <!-- <el-table-column
                prop="platformCode"
                label="平台编号"
                width
                show-overflow-tooltip
              ></el-table-column> -->
              <el-table-column prop="user" label="User" width></el-table-column>
              <!-- <el-table-column
                prop="token"
                label="Token"
                width
                show-overflow-tooltip
              ></el-table-column> -->
            </el-table>
          </div>
          <div class="table-pagination">
                <p class="total-pagination">共{{interfaceLogForm.total}}条</p>
            <el-pagination
              background
              layout=" prev, pager, next, sizes, jumper "
              @size-change="changeInterfacePageSize"
              @current-change="changeInterfaceCurrentPage"
              :current-page="interfaceLogForm.currPage"
              :page-size="interfaceLogForm.pageSize"
              :total="interfaceLogForm.total"
            ></el-pagination>
          </div>
          <!-- </div> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 使用抽屉显示回参 -->
    <el-drawer
      title="我是标题"
      :visible.sync="referenceDrawer"
      :with-header="false"
      :modal="false"
      wrapperClosable
    >
      <pre>{{ backReference }}</pre>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      isAllHeight: 0,
      activeName: "openCenterLog",
      // 回参抽屉
      referenceDrawer: false,
      backReference: {},
      //开放中心日志表单
      openCenterLogForm: {
        currPage: 1,
        pageSize: 10,
        type: "1",
        operationDate: "", // 操作时间
        startDate: "",
        endDate: "",
        opiStatus: "", //接口状态
        interfaceName: "", //接口描述
        appName: "", //应用名
        total:0
      },
      //接口日志表单
      interfaceLogForm: {
        currPage: 1,
        pageSize: 10,
        type: "2",
        operationDate: "", // 操作时间
        startDate: "",
        endDate: "",
        opiStatus: "", //接口状态
        interfaceName: "", //接口描述
        platformCode: "", //平台编号
        user:"",
        total:0
      },
      listTableLoading: false,
      tableOpenCenterList: [], //开放中心数据
      interfaceLogList: [], //对接日志
      pages: 0,
    };
  },
  components: {},
  created() {
    this.searchOpenCenterLogQuery();
  },
  computed: {
    ...mapState([]),
  },
  methods: {
    ...mapActions([]),
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(tab.label);
      if (tab.label == "开放中心日志") {
        this.searchOpenCenterLogMeaasge();
      } else {
        this.searchInterfaceLogMeaasge();
      }
    },
    // 查看更多
    seachMore() {
      this.isAllHeight++;
    },
    handleDrawerClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 改变开放中心日志表格page大小------开放中心日志
    changeOpenCenterPageSize(page) {
      console.log(page,"sdsad")
      this.openCenterLogForm.currPage = 1;
      this.openCenterLogForm.pageSize = page;
      this.searchOpenCenterLogMeaasge();
    },
    // 改变开放中心表格当前页------开放中心日志
    changeOpenCenterCurrentPage(page) {
      this.openCenterLogForm.currPage = page;
      this.searchOpenCenterLogMeaasge();
    },
    // 改变接口日志表格page大小------对接日志
    changeInterfacePageSize(page) {
      this.interfaceLogForm.currPage = 1;
      this.interfaceLogForm.pageSize = page;
      this.searchInterfaceLogMeaasge();
    },
    // 改变接口日志表格当前页------对接日志
    changeInterfaceCurrentPage(page) {
      this.interfaceLogForm.currPage = page;
      this.searchInterfaceLogMeaasge();
    },
    searchOpenCenterLogQuery() {
      this.openCenterLogForm.currPage = 1;
      this.openCenterLogForm.pageSize = 10;
      this.searchOpenCenterLogMeaasge();
    },
    searchInterfaceLogQuery() {
      this.interfaceLogForm.currPage = 1;
      this.interfaceLogForm.pageSize = 10;
      this.searchInterfaceLogMeaasge();
    },
    //按条件查询开放中心日志------开放中心日志
    searchOpenCenterLogMeaasge() {
      console.log(this.openCenterLogForm.operationDate);
      if (
        this.openCenterLogForm.operationDate == null ||
        this.openCenterLogForm.operationDate == ""
      ) {
        this.openCenterLogForm.startDate = "";
        this.openCenterLogForm.endDate = "";
      } else {
        this.openCenterLogForm.startDate = this.timeFormat(
          this.openCenterLogForm.operationDate[0]
        );
        this.openCenterLogForm.endDate = this.timeFormat(
          this.openCenterLogForm.operationDate[1]
        );
      }
      console.log(this.openCenterLogForm);
      this.listTableLoading = true;
      this.$api
        .getInterfaceLogList(this.openCenterLogForm)
        .then((res) => {
          this.tableOpenCenterList = res.data;
          this.openCenterLogForm.total = res.total;
          this.pages = res.pages;
          this.listTableLoading = false;
        })
        .catch((error) => {
          this.listTableLoading = false;
        });
    },
    //重置开放中心数据查询表单------开放中心日志
    resetOpenCenterSerachMeaasge() {
      this.openCenterLogForm.currPage = 1;
      this.$refs.openCenterLogFormRef.resetFields();
      this.searchOpenCenterLogMeaasge();
    },
    //按条件查询接口日志------对接日志
    searchInterfaceLogMeaasge() {
      if (
        this.interfaceLogForm.operationDate == null ||
        this.interfaceLogForm.operationDate == ""
      ) {
        this.interfaceLogForm.startDate = "";
        this.interfaceLogForm.endDate = "";
      } else {
        this.interfaceLogForm.startDate = this.timeFormat(
          this.interfaceLogForm.operationDate[0]
        );
        this.interfaceLogForm.endDate = this.timeFormat(
          this.interfaceLogForm.operationDate[1]
        );
      }
      console.log(this.interfaceLogForm);
      var data = {
        startDate:this.interfaceLogForm.operationDate[0],
        endDate:this.interfaceLogForm.operationDate[1],
        opiStatus:this.openCenterLogForm.opiStatus,
        user:this.interfaceLogForm.user
      }
      this.$api
        .getInterfaceLogList(this.interfaceLogForm,data)
        .then((res) => {
          // console.log(res);
          this.interfaceLogList = res.data;
          console.log(this.interfaceLogList);
          this.interfaceLogForm.total = res.total;
          this.pages = res.pages;
          this.listTableLoading = false;
        })
        .catch((error) => {
          this.listTableLoading = false;
          // this.$message.error(error.message);
        });
    },
    //重置接口数据查询表单------对接日志
    resetInterfaceLogSerachMeaasge() {
      this.interfaceLogForm.currPage = 1;
      this.$refs.interfaceLogFormFormRef.resetFields();
      this.searchInterfaceLogMeaasge();
    },

    openReferenceDrawer(reference) {
      this.referenceDrawer = true;
      console.log(this.backReference,"sssssss");
      this.backReference = JSON.parse(reference);
    },
    // 格式化时间
    timeFormat(time) {
      var date = new Date(time);
      var clock =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        this.checkTime(date.getHours()) +
        ":" +
        this.checkTime(date.getMinutes()) +
        ":" +
        this.checkTime(date.getSeconds());
      //最后显示yyyy-MM-dd hh:mm:ss
      return clock;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
  },
};
</script>

<style lang="less" scoped>
.table-content-body-log {
  overflow: scroll;
  max-height: calc(100% - 56px);
}
.table-content-body-log-all {
  overflow: scroll;
  max-height: calc(100% - 100px);
}
.tab-height-log {
  height: 100%;
}
.interfacelog-content {
  height: calc(100% - 34px);
  background: #fff;
  /deep/ .el-tabs__content {
    height: calc(100% - 48px);
  }
  /deep/ .el-tab-pane {
    height: 100%;
  }
}
.opertion-log {
  top: 200px;
}
.hidden_space {
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hidden_space:hover {
  text-decoration: underline;
}
</style>
