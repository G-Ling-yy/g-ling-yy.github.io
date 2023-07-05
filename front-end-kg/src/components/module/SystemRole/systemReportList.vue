<template>
  <div class="content-wrapper" ref="viewbox">
    <!-- 面包屑 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>运维报告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表单模块 -->
    <div class="table-wrapper">
      <div class="reportContent">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="日报" name="day">
            <dayReport :reporyType="activeName" v-if="uinfo.regionCode == 500000 ? false : true"></dayReport>
            <dayReportCq :reporyType="activeName" v-if="uinfo.regionCode == 500000 ? true : false"></dayReportCq>
          </el-tab-pane>
          <el-tab-pane label="周报" name="week">
            <dayReport :reporyType="activeName" v-if="uinfo.regionCode == 500000 ? false : true"></dayReport>
            <dayReportCq :reporyType="activeName" v-if="uinfo.regionCode == 500000 ? true : false"></dayReportCq>
          </el-tab-pane>
          <el-tab-pane label="月报" name="month">
            <dayReport :reporyType="activeName" v-if="uinfo.regionCode == 500000 ? false : true"></dayReport>
            <dayReportCq :reporyType="activeName" v-if="uinfo.regionCode == 500000 ? true : false"></dayReportCq>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Axios from "axios";
import moment from "moment";
// import dayReport from './reportListData/dayReport';
import dayReport from './reportListData/dayReport_back';
import dayReportCq from './reportListData/cq_dayReport_back';

export default {
  components: {dayReport,dayReportCq},
  data() {
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      activeName: "day",
      searchInfo: {
        selectDate: ""
      },
      dailyList: {
        // 日报的当前页
        dailyCurrentPage: 1,
        dailyPageSize: 10,
        dailyTotal: 80,
        // 运行数据列表
        dayList: []
      },
        dialogTableVisible:false,
    };
  },
  created() {},
  mounted() {
    // this.getListDayReport();
  },
  destroyed() {},
  watch: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSearch() {},
    resetSearch() {
      this.searchInfo.selectDate = "";
      this.postData.startDate = "";
      this.postData.endDate = "";
      this.getReportData();
    },
    handleDetail(){
      this.dialogTableVisible=true;
    }
  }
};
</script>
<style lang="less">
.reportContent {
  .el-tabs--card > .el-tabs__header {
    padding-left: 4%;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    width: 100px;
    text-align: center;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    width: 100px;
    text-align: center;
  }
  .demo-form-inline {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .el-form-item__content {
    display: flex;
  }
  
}

</style>
