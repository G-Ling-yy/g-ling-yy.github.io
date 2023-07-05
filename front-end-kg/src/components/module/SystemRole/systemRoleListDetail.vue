<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ roleItem.roleName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="roleList-detail" class="wrapper">
      <div class="title">
        <el-button type="primary" @click="handleBack">返回</el-button>
        <span style="line-height: 32px; padding-left:20px;">
          {{
          roleItem.roleName
          }}
        </span>
        <div class="anote">
          <span>{{ roleItem.createDate }}</span>
          <span>由 {{ roleItem.createUser }} 创建</span>
        </div>
      </div>
      <div class="content">
        <dd class="tit">
          <i class="line"></i> 关联用户
        </dd>
        <dd>关联用户数：{{ tableDataL }}</dd>
        <div class="tableBox">
          <el-table
            class="custom-cloud-table"
            ref="multipleTable"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="index" width="60" label="序号"></el-table-column>
            <el-table-column prop="loginName" label="用户名"></el-table-column>
            <el-table-column prop="organizationName" label="所属机构"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="phoneNum" label="电话"></el-table-column>
          </el-table>
        </div>
        <dd class="tit">
          <i class="line"></i> 关联权限
        </dd>
        <!--<el-tree
          :data="rightslist"
          :props="treeProps"
          show-checkbox
          node-key="functionCode"
          disabled
          @check-change="handleCheckChange"
          ref="treeRef"
          :default-checked-keys="defKeys"
        ></el-tree>-->
        <el-tree
          :data="roleList.rolePowerTreeList"
          :props="treeProps"
          show-checkbox
          node-key="functionCode"
          ref="treeRef"
          :default-checked-keys="roleList.rolePowerCheckTree"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
//import Vue from "vue";
// import systemRoleList from "@/views/SystemManage/systemRoleList";

import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      roleItem: "",
      tableData: [],
      tableDataL: 0,
      rightslist: [],
      treeProps: {
        label: "functionDesc",
        children: "childNode",
        isLeaf: "leaf"
      },
      defKeys: []
    };
  },
  computed: {
    ...mapState(["roleList"])
  },
  created() {
    //Vue.prototype.$rolelistDetail = this;
    //this.rightslist = await this.$rolelist.getTreeData();
    //this.defKeys = this.$rolelist.defKeys;
    this.roleItem = this.$router.history.current.query;

    // 查询已绑定的权限
    this.getChoseList({ roleCode: this.roleItem.roleCode });
  },
  mounted() {
    this.getrelatData();
    // 权限列表tree
    this.getPowerList();
  },
  methods: {
    ...mapActions(["getPowerList", "getChoseList", "queryRoleList"]),
    // 返回
    handleBack() {
      //this.$router.push("/systemRoleList");
      this.$router.back(-1);
    },
    // 获取关联用户数据

    async getrelatData() {
      // let { data: res } = await this.$http.get(
      //   `/role/${this.roleItem.roleCode}/user`
      // );
      let res = await this.$api.getRoleUser({
        roleCode: this.roleItem.roleCode
      });
      if (res.code == 200) {
        if (res.data.length > 0) {
          console.log(res.data, "角色下的用户");
          this.tableDataL = res.data.length;
          this.tableData = res.data;
        }
      } else {
        this.$message.error(res.message);
      }
    },
    handleCheckChange(a, b, c) {}
  }
};
</script>

<style lang="less">
@import "../../css/systemmana";
</style>
