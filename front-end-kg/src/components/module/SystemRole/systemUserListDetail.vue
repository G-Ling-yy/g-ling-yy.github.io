<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"
          ><i class="iconfont icondashboard"></i
        ></el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ userItem.userName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="userList-detail" class="wrapper">
      <div class="title">
        <el-button type="primary" @click="handleBack">返回</el-button>
        <span style="line-height: 32px; padding-left:20px;">{{
          userItem.userName
        }}</span>
        <div class="anote">
          <span>{{ userItem.createDate }}</span>
          <!-- 接口缺少字段 -->
          <span>由 超级管理员 创建</span>
        </div>
      </div>
      <div class="content">
        <div class="basicInfo">
          <dd class="tit"><i class="line"></i> 基础信息</dd>
          <div class="info">
            <p><span>账号：</span>{{ userItem.loginName }}</p>
            <p><span>电话：</span>{{ userItem.phoneNum }}</p>
            <p><span>单位：</span>{{ userItem.organizationName }}</p>
          </div>
        </div>
        <dd class="tit"><i class="line"></i> 关联摄像机组</dd>
        <dd>关联用户数：5</dd>
        <div class="tableBox">
          <el-table
            ref="multipleTable"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="60"
              align="center"
              label="序号"
            ></el-table-column>
            <el-table-column prop="roleName" label="用户名"></el-table-column>
            <el-table-column
              prop="createDate"
              label="所属机构"
            ></el-table-column>
            <el-table-column prop="createUser" label="姓名"></el-table-column>
            <el-table-column prop="glyh" label="电话"></el-table-column>
          </el-table>
        </div>
        <dd class="tit"><i class="line"></i> 关联权限</dd>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userItem: "",
      tableData: [],
    };
  },
  created() {
    this.userItem = this.$router.history.current.query;
  },
  methods: {
    handleBack() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="less">
@import "../../css/systemmana";
</style>
