<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input
            placeholder="角色名称"
            v-model="qInfo.rolename"
            style="width: 120px;"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间">
          <el-date-picker
            v-model="qInfo.dateVal"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="qInfo.state" placeholder="请选择">
            <el-option
              v-for="item in optionsState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" class="query" @click="handleSearch"
            >查询</el-button
          >
          <el-button type="primary" class="reset" @click="resetSearch"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <div class="table-control">
        <!--<el-button type="primary" @click="handleAddRoles">新增</el-button>
        <el-button type="primary">数据导出</el-button>
        <el-select v-model="deal" placeholder="批量处理"  @change="seleOption">
          <el-option
            v-for="item in optionsDeal"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="deal"
          >
            <i class="dots"></i>
            <span>{{item.label}}</span>
          </el-option>
        </el-select>-->

        <el-button type="primary" plain class="query" @click="handleAddRoles"
          >新增</el-button
        >
        <el-dropdown split-button type="primary" @command="handleCommand">
          批量操作
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="Go">启用</el-dropdown-item>
            <el-dropdown-item command="Stop">停用</el-dropdown-item>
            <el-dropdown-item command="Del">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          height="100%"
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column
            type="index"
            width="60"
            label="序号"
          ></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="createDate" label="创建时间"></el-table-column>
          <el-table-column prop="createUser" label="创建人"></el-table-column>
          <el-table-column prop="count" label="关联用户"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '1'">启用</span>
              <span v-else-if="scope.row.status == '0'">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--<el-tooltip effect="dark" content="启用" placement="top">
                <el-switch
                  v-model="scope.row.status"
                  class="gd-custom-status-switch"
                  style="margin-right: 10px;"
                  @change="stateChanged($event, scope.row, scope.$index)"
                  active-icon-class="el-icon-check"
                  inactive-icon-class="el-icon-close"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </el-tooltip>-->
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleEdit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  class="table-control-btn"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-document"
                  size="mini"
                  @click="handleDetail(scope.row)"
                ></el-button>
              </el-tooltip>

              <!--<el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                active-color="#1274EE"
                @change="stateChanged(scope.row, scope.$index)"
              ></el-switch>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)"></el-button>
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
              <el-button type="primary" icon="el-icon-document" size="mini" @click="handleDetail(scope.row)"></el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
      	<p class="total-pagination">共{{total}}条</p>
        <!-- 分页 -->
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pagenum"
          :page-size="pageInfo.pagesize"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增弹框 -->
    <el-dialog
      :title="modaldialog.title"
      :visible.sync="addRoleDialog"
      width="38%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @closed="addDialogClosed"
      @open="addDialogOpen"
    >
      <!--<div class="addRoleContent">
        <div class="aprop">
          <span>角色名称：</span>
          <el-input type="text" v-model="addForm.username" placeholder="请填写"></el-input>
        </div>
        <div class="aprop">
          <span>是否启用：</span>
          <el-radio-group v-model="addForm.state">
            <el-radio label="启用"></el-radio>
            <el-radio label="停用"></el-radio>
          </el-radio-group>
        </div>
        <div class="aprop">
          <span style="display:inline-block;margin-bottom:10px;">关联权限：</span>
          <el-tree
            :data="rightslist"
            :props="treeProps"
            show-checkbox
            node-key="functionCode"
            ref="treeRef"
            :default-checked-keys="defKeys"
          ></el-tree>
        </div>
      </div>-->
      <el-form ref="form" :model="addForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input
            type="text"
            v-model="addForm.username"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addForm.state">
            <el-radio label="启用" value="1"></el-radio>
            <el-radio label="停用" value="0"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联权限">
          <el-tree
            :data="rightslist"
            :props="treeProps"
            show-checkbox
            node-key="functionCode"
            ref="treeRef"
            :default-checked-keys="defKeys"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
//import { Loading } from "element-ui";
//import systemRoleListDetail from "@/views/SystemManage/systemRoleListDetail";
export default {
  data() {
    return {
      qInfo: {
        rolename: "",
        dateVal: "",
        state: "",
      },
      modaldialog: {
        title: "新增",
      },
      pickerOptions: {
        disabledDate: this.disabledDate,
      },
      roleCode: "",
      scope: { row: { status: "" } },
      selectData: [],
      optionsState: [
        {
          value: 1,
          label: "禁用",
        },
        {
          value: 2,
          label: "启用",
        },
        {
          value: 3,
          label: "全部",
        },
      ],
      deal: "",
      optionsDeal: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 2,
          label: "停用",
        },
        {
          value: 3,
          label: "删除",
        },
      ],
      tableData: [],
      tableDataSum: [],
      total: 0,
      pageInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      addRoleDialog: false,
      addForm: {
        username: "",
        state: "启用",
      },
      rightslist: [],
      treeProps: {
        label: "functionDesc", //"showText",
        children: "childNode",
        isLeaf: "leaf",
      },
      defKeys: [],
      addAndmodify: "add", //判断是修改还是新增
    };
  },
  created() {
    Vue.prototype.$rolelist = this;
    this.getRoleListData();
  },
  components: {
    // systemRoleListDetail
  },
  mounted: {},
  methods: {
    // 批量操作
    // 启动
    handleCommand(command) {
      if (this.selectData.length == 0) {
        if (command === "Go") {
          this.$message({
            type: "info",
            message: "请选择要启用的角色!",
          });
        } else if (command === "Del") {
          this.$message({
            type: "info",
            message: "请选择要删除的角色!",
          });
        } else if (command === "Stop") {
          this.$message({
            type: "info",
            message: "请选择要停用的角色!",
          });
        }
      } else {
        if (command === "Go") {
          let status = [];
          this.selectData.forEach((item) => {
            let astatus = {
              roleCode: item.roleCode,
              status: 1,
            };
            status.push(astatus);
          });
          this.handleChangeStatus(status);
        } else if (command === "Del") {
          this.handleDelRow();
        } else if (command === "Stop") {
          let status = [];
          this.selectData.forEach((item) => {
            let astatus = {
              roleCode: item.roleCode,
              status: 0,
            };
            status.push(astatus);
          });
          this.handleChangeStatus(status);
        }
      }
    },
    // 启停用
    handleChangeStatus(status) {
      this.$http.post("/role/v2/status", status).then((res) => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.getRoleListData();
        } else {
          this.$message({
            type: "error",
            message: "状态修改失败!",
          });
        }
      });
    },
    // 删除
    handleDelRow() {
      if (this.selectData.length > 0) {
        var status = [];
        var ainfos = [];
        this.selectData.forEach((item) => {
          var astatus = {
            roleCode: item.roleCode,
            status: item.status,
          };
          status.push(astatus);
          ainfos.push(item.roleCode);
        });
      }
      this.$http.post("/role/v2/delete", ainfos).then((res) => {
        if (res.status == 200) {
          this.getRoleListData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getRoleListData();
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },

    disabledDate(time) {
      return time.getTime() > new Date().getTime();
    },
    // 页码处理
    handleSizeChange(sizeVal) {
      console.log(sizeVal);
      this.pageInfo.pagesize = sizeVal;
      this.getRoleListData();
    },
    handleCurrentChange(curPage) {
      if (curPage == "1") {
        this.tableData = this.tableDataSum.slice(0, 10);
      } else if (curPage == "2") {
        this.tableData = this.tableDataSum.slice(10, 20);
      } else if (curPage == "3") {
        this.tableData = this.tableDataSum.slice(20, 30);
      } else if (curPage == "4") {
        this.tableData = this.tableDataSum.slice(30, 40);
      } else {
        this.tableData = this.tableDataSum.slice(40, 50);
      }
    },
    async getRoleListData() {
      try {
        this.tableData = [];
        let roleName = this.qInfo.rolename;
        let { data: res } = await this.$http.get(
          "/role/roleList?name=" + roleName
        );
        console.log("---角色列表---");
        console.log(res);
        if (res.code == "2000") {
          if (res.data.length > 0) {
            this.tableDataSum = res.data;
            this.tableData = res.data.slice(0, 10);
            this.total = res.data.length;
          } else {
            this.$message.info("暂无数据！");
          }
        } else {
          this.$message.error(res.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 搜索
    handleSearch() {
      this.getRoleListData();
    },
    // 搜索重置
    resetSearch() {
      this.qInfo.rolename = "";
      this.getRoleListData();
    },
    // 表格操作处理---开始
    // 复选框是否勾选
    handleSelectChange(sele) {
      console.log(sele);
      this.selectData = sele;
    },
    async seleOption(i) {
      if (this.selectData.length > 0) {
        let status = [];
        let ainfos = [];
        this.selectData.forEach((item) => {
          let astatus = {
            roleCode: item.roleCode,
            status: item.status,
          };
          status.push(astatus);
          ainfos.push(item.roleCode);
        });

        if (i === "1" || i === "2") {
          let { data: res } = await this.$http.post("/role/v2/status", status);
          if (res.code == "2000") {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getRoleListData();
          } else {
            this.$message.error(res.message);
          }
        } else if (i === "3") {
          let { data: res } = await this.$http.post("/role/v2/delete", ainfos);
          if (res.code == "2000") {
            this.getRoleListData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        }
      } else {
        this.$message.info("请先勾选要处理的数据！");
      }
    },
    // 开关按钮
    stateChanged(e, item, i) {
      let ainfo = Object.assign({}, item);
      this.$confirm("确认启用/停用该角色吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let status = [
            {
              roleCode: item.roleCode,
              status: ainfo.status,
            },
          ];
          let { data: res } = await this.$http.post("/role/v2/status", status);
          if (res.code == "2000") {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          } else {
            ainfo.status = ainfo.status == 1 ? "0" : "1";
            this.tableData[i] = ainfo;
            this.$message({
              type: "error",
              message: "状态修改失败!",
            });
          }
        })
        .catch(() => {
          i == 1 ? (this.scope.row.status = 0) : (this.scope.row.status = 1);
          this.getRoleListData();
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // // 编辑
    async rightsData(roleCode) {
      let { data: res } = await this.$http.get(
        "/role/choseList?roleCode=" + roleCode
      );
      if (res.code === 200) {
        this.defKeys = res.data[roleCode];
        console.info("this.defKeys ", this.defKeys);
      }
    },
    handleEdit(item) {
      this.addAndmodify = "edit";
      this.addForm.username = item.roleName;
      this.addForm.state = item.status == "1" ? "启用" : "停用";
      this.roleCode = item.roleCode;
      this.addRoleDialog = true;
      this.modaldialog.title = "修改";
      this.rightsData(item.roleCode); // 获取关联权限
    },

    // 是否删除
    handleDelete(item) {
      this.$confirm(
        "删除该角色后，与之绑定的账号将会失去操作权限，确认要删除吗？",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
        }
      )
        .then(async () => {
          let ainfo = [item.roleCode];
          let { data: res } = await this.$http.post("/role/v2/delete", ainfo);
          if (res.code == "2000") {
            this.getRoleListData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 详情
    async handleDetail(item) {
      await this.rightsData(item.roleCode); // 获取关联权限
      this.$router.push({
        path: "/systemRoleListDetail",
        query: item,
      });
    },
    // 表格操作处理---结束

    // 打开对话框
    async addDialogOpen() {
      this.rightslist = await this.getTreeData();
    },

    // 新增
    async handleAddRoles() {
      this.defKeys = [];
      this.addAndmodify = "add";
      this.addRoleDialog = true;
      this.modaldialog.title = "新增";
    },
    // 新增保存
    async addRoles() {
      console.log("---保存新增---");
      console.log(this.addForm);
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      let halfKeys = [...this.$refs.treeRef.getHalfCheckedKeys()];
      let addData = {
        roleName: this.addForm.username,
        status: 1,
        functionCodes: keys,
        halfFunctionCodes: halfKeys,
       
      };
      let updateData = {
        roleName: this.addForm.username,
        status: 1,
        functionCodes: keys,
        halfFunctionCodes: halfKeys,
        roleCode: this.roleCode,
      };
      if (this.addForm.state == "停用") {
        addData.status = "0";
      }
      console.log(addData);

      if (this.addForm.username == "") {
        return this.$message.error("请先填写角色名称");
      }
      let { data: res } = await this.$api.userAddRole(
        this.modaldialog.title == "新增" ? addData : updateData
      );
      if (res.code == "2000") {
        this.$message.success("保存成功");
        this.getRoleListData();
        this.addRoleDialog = false;
      } else {
        this.$message.error("保存失败");
      }
    },
    // 编辑弹窗
    editRoles() {},
    // 取消保存
    cancelAdd() {
      this.addRoleDialog = false;
      this.addDialogClosed();
    },
    addDialogClosed() {
      this.addForm = {
        username: "",
        state: "启用",
      };
      this.$refs.treeRef.setCheckedKeys([]);
    },
    // 获取关联权限数据
    async getTreeData() {
      try {
        console.log("--获取关联权限--");
        let { data: res } = await this.$http.get("/function/functionTree");
        console.log(res);
        if (res.code == "2000") {
          return res.data;
        } else {
          return this.$message.error(res.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    save() {
      if (this.addAndmodify == "add") {
        this.addRoles();
      } else {
        this.addRoles();
      }
    },
  },
};
</script>

<style lang="less">
/*@import "css/systemmana";*/
</style>
