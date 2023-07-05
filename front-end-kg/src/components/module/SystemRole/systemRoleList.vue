<template>
  <div class="content-wrapper" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-search-display camera-manage-search">
      <!-- <div> -->
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="角色名称:">
            <el-input
              placeholder="角色名称"
              v-model="searchInfo.rolename"
              style="width: 120px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchInfo.dateVal"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
            <!-- :picker-options="pickerOptions" -->
          </el-form-item>
          <el-form-item label="状态" style="margin-left: 25px;">
            <el-select v-model="searchInfo.status" placeholder="请选择">
              <el-option
                v-for="item in optionsStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
      <div class="search-btn-right">
        <div class="table-control">
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
        <!-- <div class="btn-padding">
          <el-button type="primary" class="query" @click="handleSearch">查询</el-button>
          <el-button type="primary" class="reset" @click="resetSearch">重置</el-button>
        </div> -->
        <!-- <span @click="seachMore" v-if="isAllHeight%2==0" class="have-more-info">更多</span>
        <span @click="seachMore" v-if="isAllHeight%2!=0" class="have-more-info">收起</span>-->
      </div>
    </div>
    <div class="table-wrapper">
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          height="100%"
          ref="multipleTable"
          :data="roleList.roleList"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            type="index"
            width="60"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="createDate" label="创建时间"></el-table-column>
          <el-table-column prop="createUser" label="创建人"></el-table-column>
          <el-table-column prop="count" label="关联用户"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '1'">启用</span>
              <span v-else-if="scope.row.status == '0'">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <!--<el-tooltip effect="dark" content="启用" placement="top">
                <el-switch
                  v-model="scope.row.status"
                  class="gd-custom-status-switch"
                  style="margin-right: 10px;"
                  @change="statusChanged($event, scope.row, scope.$index)"
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
              <!-- <el-tooltip effect="dark" content="关联组" placement="top">
                <el-button
                  class="table-control-btn"
                  type="danger"
                  icon="iconfont iconxiugai"
                  size="mini"
                  @click="handleGroup(scope.row)"
                ></el-button>
              </el-tooltip> -->
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-document"
                  size="mini"
                  @click="handleDetail(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
	      <p class="total-pagination">共{{roleTotal}}条</p>
        <!-- 分页 -->
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="roleTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增弹框 -->
    <el-dialog
      :title="modalDialogTitle"
      :visible.sync="roleInfoDialog"
      width="38%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addRolesFormRef"
        :model="roleForm"
        label-width="80px"
        :rules="roleInfoFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            type="text"
            v-model="roleForm.roleName"
            placeholder="请填写"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            type="textarea"
            v-model="roleForm.roleDesc"
            placeholder="请输入描述内容"
            maxlength="200"
            resize="none"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联权限">
          <el-tree
            :data="roleList.rolePowerTreeList"
            :props="treeProps"
            show-checkbox
            node-key="functionCode"
            ref="treeRef"
            :default-checked-keys="roleList.rolePowerCheckTree"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveDialog">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 关联设备组 -->
    <association-group-dialog
      v-if="groupDialogVisible"
      :visible.sync="groupDialogVisible"
      ref="cameraReport"
      :roleCode="roleCode"
    ></association-group-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import associationGroupDialog from "./systemRoleDialog/associationGroupDialog";
//import { Loading } from "element-ui";
//import systemRoleListDetail from "@/views/SystemManage/systemRoleListDetail";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: { associationGroupDialog},
  data() {
    let checkRoleName = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{6,20}$/; //[a-zA-Z_\u4e00-\u9fa5]
      //const reg = /^[a-zA-Z0-9_]{5,20}$/;//[a-zA-Z_\u4e00-\u9fa5]
      if (value === "") {
        return callback(new Error("角色名称不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("角色名称名由6-20位汉字、字母、数字、下划线组成"));
      } else {
        // 编辑状态，验证是否修改，未修改不做接口验证
        if (this.roleForm.roleCode && this.oldRoleName === value) {
          return callback();
        }
        this.$api
          .checkRoleName(value)
          .then((data) => {
            if (data.code !== 200) {
              return callback(new Error("角色名称已被使用"));
            }
            callback();
          })
          .catch(() => {
            callback(new Error("角色名称重复查询失败"));
          });
      }
    };

    return {
      groupDialogVisible:false,
      showPagination: false,
      isAllHeight: 0,
      searchInfo: {
        roleName: "",
        dateVal: "",
        status: "",
      },
      currentPage: 1,
      pageSize: 10,
      roleTotal:0,
      modalDialogTitle: "新增",
      roleInfoDialog: false,
      selectData: [],
      tableData: [],
      treeProps: {
        label: "functionDesc", //"showText",
        children: "childNode",
        isLeaf: "leaf",
      },
      oldRoleName: "",
      roleForm: {
        roleCode: "",
        roleName: "",
        status: 1,
        roleDesc:""
      },
      roleInfoFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { validator: checkRoleName, trigger: "blur" },
        ],
        /*loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkuserName, trigger: "blur" }
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]*/
      },

      pickerOptions: {
        disabledDate: this.disabledDate,
      },
      optionsStatus: [
        { label: "停用", value: 0 },
        { label: "启用", value: 1 },
      ],
    };
  },
  /*created() {
    Vue.prototype.$rolelist = this;
    this.getRoleListData();
  },*/
  computed: {
    ...mapState(["roleList"]),
  },
  mounted() {
    //console.info(this.roleList);
    this.getRoleListData(1);
    // 权限列表tree
    this.getPowerList();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    ...mapActions([
      "getRoleList",
      "getPowerList",
      "addOrEditRole",
      "getChoseList",
      "queryRoleList",
      "roleAddPower",
      "deleteRoleAction",
      "changeRoleStateMore",
    ]),
    ...mapMutations([
      "setRolePowerCheckTree",
      "setRolePageSize",
      "setRoleCurrentPage",
    ]),
    // 监听滚动事件
    handleScroll() {
      let scrollTop = this.$refs.viewbox.getBoundingClientRect().top;
      // console.log(scrollTop, "dd");
      if (scrollTop < -20) {
        this.showPagination = true;
        return;
      }
      this.showPagination = false;
    },
    // 页码处理
    handleSizeChange(val) {
      //console.log(sizeVal);
      this.pageSize = val;
      this.setRolePageSize(val);
      // this.setRoleCurrentPage(1);
      this.getRoleListData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(this.val,"this.currentPage")
      // this.setRoleCurrentPage(val);
      this.getRoleListData();

      /*let start = (curPage - 1) * this.pageSize;
      console.info(start , this.pageSize);
      let newList = JSON.parse(JSON.stringify(this.roleList.roleList));
      this.tableData = newList.slice(start , this.pageSize);

      console.info(this.tableData, this.roleList.roleList);*/
    },
    // 搜索
    handleSearch() {
      this.getRoleListData(1);
    },
    // 搜索重置
    resetSearch() {
      this.currentPage = 1
      this.searchInfo.rolename = "";
      this.searchInfo.status = "";
      this.searchInfo.dateVal = "";
      this.getRoleListData(1);
    },

    // 复选框是否勾选
    handleSelectChange(sele) {
      //console.log(sele);
      this.selectData = sele;
    },
    /**
     * 查询角色列表数据
     */
    getRoleListData(curPage) {
      let obj = {};
      if (this.searchInfo.dateVal == null || this.searchInfo.dateVal == "") {
        obj = {
          roleName: this.searchInfo.rolename,
          status: this.searchInfo.status,
          currPage: curPage || this.currentPage,
          pageSize: this.pageSize,
          startDate: "",
          endDate: "",
        };
      } else {
        obj = {
          roleName: this.searchInfo.rolename,
          status: this.searchInfo.status,
          currPage: curPage || this.currentPage,
          pageSize: this.pageSize,
          startDate: this.searchInfo.dateVal[0]
            ? this.searchInfo.dateVal[0]
            : "",
          endDate: this.searchInfo.dateVal[1] ? this.searchInfo.dateVal[1] : "",
        };
      }
      console.log(obj, "搜索列表");
      this.getRoleList(obj).then((res) => {
          this.roleTotal= res[1].total
          // console.log(this.roleTotal,res,"this.roleTotal")
        if (res.code === 200) {
          
          /*console.info((curPage - 1) * this.pageSize , this.pageSize, this.roleList.roleList);
          let newList = JSON.parse(JSON.stringify(this.roleList.roleList));
          this.tableData = newList.slice((curPage - 1) * this.pageSize , this.pageSize);*/
          //this.tableData = JSON.parse(JSON.stringify(this.roleList.roleList));
        }

      });
    },
    /**
     * 批量操作响应
     * @param command
     */
    handleCommand(command) {
      let statusRs = { Go: "启用", Del: "删除", Stop: "停用" };
      if (this.selectData.length === 0) {
        this.$message({
          type: "info",
          message: "请选择要" + statusRs[command] + "的角色!",
        });
        return false;
      }

      this.$confirm(
        "批量操作角色信息，确认要" + statusRs[command] + "吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).then(() => {
        let dataList = [];
        let delRoleName = [];
        if (command === "Del") {
          //this.handleDelRow();
          this.selectData.forEach((item) => {
            dataList.push(item.roleCode);
            delRoleName.push(item.roleName);
          });
          // 批量删除
          var params = {
            instructionsDel: {
              module: "系统管理",
              page: "角色管理",
              feature: "批量删除",
              description: "删除角色 " + delRoleName.toString(),
            },
            roleCodes: dataList,
          };
          this.deleteRoleAction(params).then((res) => {
            if (res.code === 200) {
              this.getRoleListData();
            }
          });
          return true;
        }
        let checkStatus = command === "Go" ? 1 : 0;
        this.selectData.forEach((item) => {
          dataList.push(item.roleCode);
        });
        let vo = {
          roleCodes: dataList,
          status: checkStatus,
        };
        // 批量更新状态
        this.changeRoleStateMore(vo).then((res) => {
          if (res.code === 200) {
            this.getRoleListData();
          }
        });
      });
    },
    // 新增
    handleAddRoles() {
      this.defKeys = [];
      this.oldRoleName = "";
      this.roleForm = {
        roleCode: "",
        roleName: "",
        status: 1,
      };
      this.modalDialogTitle = "新增";
      this.roleInfoDialog = true;
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys([], false);
      });
    },
    handleEdit(item) {
      console.log(item, "修改");
      this.roleForm = {
        roleCode: item.roleCode,
        roleName: item.roleName,
        status: item.status,
        roleDesc:item.roleDesc
      };
      this.roleInfoDialog = true;
      this.modalDialogTitle = "修改";
      //this.setRolePowerCheckTree([]);
      this.$nextTick(() => {
        this.oldRoleName = item.roleName;
        this.$refs.treeRef.setCheckedKeys([], false);
        // 查询已绑定的权限
        this.getChoseList({ roleCode: item.roleCode }).then(() => {
          //console.info(this.roleList.rolePowerCheckTree);
        });
      });
    },
    // 是否删除
    handleDelete(item) {
      this.$confirm(
        "删除该角色后，与之绑定的账号将会失去操作权限，确认要删除吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).then(() => {
        console.log(item);
        var params = {
          instructionsDel: {
            module: "系统管理",
            page: "角色管理",
            feature: "删除",
            description: "删除角色 " + item.roleName,
          },
          roleCodes: [item.roleCode],
        };
        this.deleteRoleAction(params).then((res) => {
          if (res.code === 200) {
            this.getRoleListData(1);
            this.$message.success("删除成功");
          }
        });
      });
    },
    //关联设备组
    handleGroup(item){
      console.log(item,"item")
      this.roleCode = item.roleCode
      this.groupDialogVisible = true
    },
    // 详情
    handleDetail(item) {
      //await this.rightsData(item.roleCode); // 获取关联权限
      this.$router.push({
        path: "/systemRoleListDetail",
        query: item,
      });
    },

    disabledDate(time) {
      return time.getTime() > new Date().getTime();
    },
    // 新增/编辑取消
    cancelDialog() {
      this.oldRoleName = "";
      this.roleInfoDialog = false;
    },
    // 新增/编辑保存
    saveDialog() {
      this.$refs.addRolesFormRef.validate((valid) => {
        if (!valid) return;
        console.log(this.roleForm);
        let instructionsAdd = {
          module: "系统管理",
          page: "角色管理",
          feature: "新增",
          description: "新增角色 " + this.roleForm.roleName,
        };
        if (this.modalDialogTitle == "修改") {
          instructionsAdd.feature = "修改";
          instructionsAdd.description = "修改角色 " + this.roleForm.roleName;
        }
        let keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          //...this.$refs.treeRef.getHalfCheckedKeys()
        ];
        let halfKeys = [...this.$refs.treeRef.getHalfCheckedKeys()];
        let postData = {
          roleName: this.roleForm.roleName,
          status: this.roleForm.status,
          functionCodes: keys,
          halfFunctionCodes: halfKeys,
          title: this.modalDialogTitle,
          // roleDesc: "444",
          roleDesc:this.roleForm.roleDesc,
          // 模块操作描述
          instructions: instructionsAdd,
        };
        //eyJtb2R1bGUiOiLns7vnu5/nrqHnkIYiLCJwYWdlIjoi6KeS6Imy566h55CGIiwiZmVhdHVyZSI6IuS/ruaUuSIsImRlc2NyaXB0aW9uIjoi5L+u5pS56KeS6ImyIn0=
        //eyJtb2R1bGUiOiLns7vnu5/nrqHnkIYiLCJwYWdlIjoi6KeS6Imy566h55CGIiwiZmVhdHVyZSI6IuaWsOWiniIsImRlc2NyaXB0aW9uIjoi5paw5aKe6KeS6ImyIn0=
        if (this.roleForm.roleCode) postData.roleCode = this.roleForm.roleCode;
        this.addOrEditRole(postData).then((res) => {
          if (res.code === 200) {
            this.getRoleListData(1);
            this.roleInfoDialog = false;
            this.$message.success(this.modalDialogTitle + "成功");
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
/*@import "css/systemmana";*/
.table-wrapper {
  min-height: calc(100% - 125px);
}
.table-control {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
