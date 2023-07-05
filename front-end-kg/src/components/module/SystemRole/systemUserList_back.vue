<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/dashboard' }"><i class="iconfont icondashboard" ></i></el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form
          :model="filters"
          :inline="true"
          class="demo-form-inline"
          ref="filtersFromRef"
      >
        <el-form-item label="用户名称" prop="userName">
          <el-input
              type="text"
              v-model="filters.userName"
              placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="startDate">
          <div class="block">
            <el-date-picker
                v-model="filters.startDate"
                type="date"
                placeholder="起始时间"
                class="dateStyle"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="至" prop="endDate" style="margin-left: -15px;">
          <div class="block">
            <el-date-picker
                v-model="filters.endDate"
                type="date"
                placeholder="结束时间"
                class="dateStyle"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select
              v-model="filters.state"
              placeholder="请选择"
              class="dateStyle"
          >
            <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位" prop="organizationId">
          <el-select v-model="filters.organizationId" placeholder="请选择">
            <el-option
                v-for="item in orgTreeData"
                :key="item.organizationId"
                :label="item.organizationName"
                :value="item.organizationId"
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

    <div class="table-wrapper">
      <div class="table-control">
        <el-button type="primary" plain class="query" @click="handleAddUser"
        >新增</el-button
        >
        <!--<el-button type="primary" plain class="query">数据导出</el-button>
        <el-button type="primary" plain class="query">数据导入</el-button>
        <el-dropdown split-button type="primary" >
          批量操作
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <div class="table-content-body">
        <el-table
            class="custom-cloud-table"
            height="100%"
            ref="multipleTable"
            :data="sysUser.sysUserList"
            border
            tooltip-effect="dark"
        >
          <el-table-column
              type="selection"
              width="50"
              align="center"
          ></el-table-column>
          <el-table-column
              type="index"
              width="60"
              label="序号"
              align="center"
          ></el-table-column>
          <!--<el-table-column prop="userName" label="用户名"></el-table-column>-->
          <el-table-column
              prop="userName"
              label="姓名"
              width="200"
          ></el-table-column>
          <el-table-column
              prop="phoneNum"
              label="电话"
              width="160"
          ></el-table-column>
          <el-table-column
              prop="organizationName"
              label="所属单位"
          ></el-table-column>
          <!--<el-table-column prop="count" label="关联角色"></el-table-column>
          <el-table-column prop="count" label="关联摄像机组"></el-table-column>-->
          <el-table-column
              prop="createDate"
              label="创建时间"
              width="260"
          ></el-table-column>
          <!--<el-table-column prop="count" label="创建人"></el-table-column>-->
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <!--<span v-if="scope.row.userStatus ==='0'">停用</span>
              <span
                v-else
              >启用</span>-->
              <i
                  class="el-icon-error text-danger"
                  style="font-size: 1.6rem;"
                  v-if="scope.row.userStatus === '0'"
              ></i>
              <i
                  class="el-icon-success text-success"
                  style="font-size: 1.6rem;"
                  v-else
              ></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!--<el-tooltip effect="dark" content="状态" placement="top">
                <el-switch
                  v-model="scope.row.status"
                  class="gd-custom-status-switch"
                  style="margin-right: 10px;"
                  active-icon-class="el-icon-check"
                  inactive-icon-class="el-icon-close"
                  @change="stateChanged()"
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
                    @click="handleDetail()"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
	      <p class="total-pagination">共{{sysUser.sysUserTotal}}条</p>
        <!-- 分页 -->
        <el-pagination
            background
            layout=" prev, pager, next, sizes, jumper "
            :total="sysUser.sysUserTotal"
            :page-size="sysUserPageSize"
            :current-page.sync="sysUserCurrentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增弹框 -->
    <el-dialog
        title="新增用户"
        :visible.sync="addRoleDialog"
        width="28%"
        :before-close="handleClose"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        @close="addDialogClose"
    >
      <div>
        <el-form
            :model="addForm"
            label-width="100px"
            ref="addUserFormRef"
            :rules="addFormRules"
        >
          <el-form-item label="用户名：" prop="loginName">
            <el-input
                type="text"
                v-model="addForm.loginName"
                placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="userName">
            <el-input
                type="text"
                v-model="addForm.userName"
                placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phoneNum">
            <el-input
                type="text"
                v-model="addForm.phoneNum"
                placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属单位：" prop="organizationId">
            <el-cascader
                :options="subordinateUnitsOptions"
                :props="cascaderProps"
                v-model="addForm.organizationId"
                @change="parentsCateChanged"
                clearable
                change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="启用：" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联角色：" prop="roleId">
            <el-select
                v-model="addForm.roleId"
                filterable
                default-first-option
                placeholder="请选择"
                class="roleSelect"
            >
              <template v-for="item in roleList.roleList">
                <el-option
                    v-if="item.roleName"
                    :key="item.roleCode"
                    :label="item.roleName"
                    :value="item.roleCode"
                    class="roleOpti"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
        title="修改用户"
        :visible.sync="editUserDialog"
        width="28%"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        @close="editDialogClose"
    >
      <div>
        <el-form
            :model="editForm"
            label-width="100px"
            ref="editUserFormRef"
            :rules="addFormRules"
        >
          <el-form-item label="用户名：" prop="loginName">
            <el-input
                type="text"
                v-model="editForm.loginName"
                placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="userName">
            <el-input
                type="text"
                v-model="editForm.userName"
                placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phoneNum">
            <el-input v-model="editForm.phoneNum"></el-input>
          </el-form-item>
          <el-form-item label="所属单位：" prop="organizationId">
            <el-cascader
                ref="cascaderEditr"
                :options="subordinateUnitsOptions"
                :props="cascaderProps"
                v-model="editForm.organizationId"
                @bulr="parentsCateChanged"
                clearable
                change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="editForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联角色：" prop="roleId">
            <el-select
                v-model="editForm.roleId"
                filterable
                default-first-option
                placeholder="请选择"
                class="roleSelect"
            >
              <template v-for="item in roleList.roleList">
                <el-option
                    v-if="item.roleName"
                    :key="item.roleCode"
                    :label="item.roleName + '-' + item.roleDesc"
                    :value="item.roleCode"
                    class="roleOpti"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from "vuex";
  export default {
    data() {
      //合法手机号验证
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

        if (regMobile.test(value)) {
          return cb();
        }

        cb(new Error("请输入合法的手机号"));
      };
      var checkName = (rule, value, cb) => {
        const regName = /^[\u0391-\uFFE5]{1,20}$/;
        if (regName.test(value)) {
          return cb();
        }
        cb(new Error("姓名只能是汉字，并且长度在1-20之间"));
      };
      var checkuserName = (rule, value, cb) => {
        if (value.length >= 1 && value.length <= 20) {
          console.log(value.length);
          return cb();
        }
        cb(new Error("用户名长度只能在1-20之间"));
      };
      return {
        subordinateUnitsOptions: [],
        stateOptions: [
          {
            value: "",
            label: "全部"
          },
          {
            value: "1",
            label: "启用"
          },
          {
            value: "0",
            label: "禁用"
          }
        ],
        selectKeys: [],
        cascaderProps: {
          value: "organizationId",
          label: "organizationName",
          children: "childNode",
          checkStrictly: true
        },
        sysUserCurrentPage: 0,
        sysUserPageSize: 10,
        filters: {
          // 承接模糊搜索用户数据
          organizationId: "",
          organizationName: "", // 管辖单位
          userName: "", // 用户名
          userStatus: "", // 用户状态
          phoneNum: "", // 手机号
          startDate: "",
          endDate: ""
        },
        pickerOptions: {
          disabledDate: this.disabledDate
        },
        addRoleDialog: false,
        editUserDialog: false,
        userInfoForm: {
          userId:"",
          organizationId:"",
          loginName:"",
          loginPwd: "000000",// this.Utils.randomString(0, 6),
          phoneNumber:"",
          status:"",
          userName:"",
          gender:"",
          roleId:"",
          source:1,
          /*loginName: "",
          loginPwd: this.Utils.randomString(0, 6),
          organizationId: "", //组织ID
          phoneNum: "",
          status: "1",
          userName: "", //姓名
          gender: "1",
          roleId: "",
          source: 1*/
        },
        addForm: {
          loginName: "",
          loginPwd: this.Utils.randomString(0, 6),
          organizationId: "", //组织ID
          phoneNum: "",
          status: "1",
          userName: "", //姓名
          gender: "1",
          roleId: "",
          source: 1
        },
        editForm: {},

        addFormRules: {
          userName: [{ validator: checkName, trigger: "blur" }],
          loginName: [{ validator: checkuserName, trigger: "blur" }],
          phoneNum: [
            // { required: true, message: "请输入手机号", trigger: "blur" },
            { validator: checkMobile, trigger: "blur" }
          ]
        }
      };
    },
    computed: {
      ...mapState(["sysUser", "roleList", "orgList", "orgTreeData", "UserOrgTreeChild"])
    },
    mounted() {
      this.getSysUserList({
        page: {
          pageSize: this.sysUserPageSize,
          currentPage: 1
        },
        info: this.filters
      });

      this.getRoleList();
      this.getOrgTree();
    },
    methods: {
      ...mapActions([
        "getRoleList",
        "getSysUserList",
        "editUserRoles",
        "getOrgTree"
      ]),

      ...mapMutations([]),
      // 查询列表数据
      getUserListData() {},
      // 搜索
      handleSearch() {
        console.log(this.filters);
        this.getSysUserList({
          page: {
            pageSize: this.sysUserPageSize,
            currentPage: this.sysUserCurrentPage
          },
          info: this.filters
        });
      },
      // 重置
      resetSearch() {
        this.$refs.filtersFromRef.resetFields();
        this.sysUserPageSize = 10;
        this.getSysUserList({
          page: {
            pageSize: 10,
            currentPage: 1
          },
          info: this.filters
        });
      },
      // 列表操作---开始
      // 状态改变
      stateChanged() {
        this.$confirm("确认启用/停用吗？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        })
          .then(() => {
            // let status = {
            //   status: this.s
            // }
            // let {data: res} = await this.$http.post("/role/add")
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      },
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 编辑用户信息
      handleEdit(editFormData) {
        this.subordinateUnitsOptions = this.UserOrgTreeChild;
        console.log(editFormData);
        this.editUserDialog = true;
        this.editForm = editFormData;
      },
      // 删除
      handleDelete(delDetial) {
        console.log(delDetial);
        userId = delDetial.userId;
        this.$confirm("确认删除该用户吗？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      },
      // 详情
      handleDetail() {
        this.$router.push("/systemUserListDetail");
      },
      parentsCateChanged() {
        console.log(this.$refs.cascaderEditr);
        // console.log(this.$refs.cascaderEditr.currentLabels);
      },
      // 列表操作---结束

      // 分页处理---开始
      handleSizeChange(sizeVal) {
        console.log(sizeVal);
        /*this.pageInfo.pagesize = sizeVal;
        this.getUserListData();*/
        this.getSysUserList({
          page: {
            pageSize: sizeVal,
            currentPage: this.sysUserCurrentPage
          },
          info: this.filters
        });
      },
      handleCurrentChange(curPage) {
        //this.pageInfo.pagenum = curPage;
        this.getSysUserList({
          page: {
            pageSize: this.sysUserPageSize,
            currentPage: this.sysUserCurrentPage
          },
          info: this.filters
        });
      },
      // 分页处理---结束
      // 新增
      handleAddUser() {
        this.addRoleDialog = true;

        this.subordinateUnitsOptions = this.UserOrgTreeChild;
        console.log("this.subordinateUnitsOptions" + this.UserOrgTreeChild);
      },
      // 新增保存
      addUser() {
        console.log(this.roleList);
        this.$refs.addUserFormRef.validate(valid => {
          if (!valid) return;
          console.log(this.addForm.phoneNum);
          this.addForm.phoneNumber = this.addForm.phoneNum;
          this.addForm.loginPwd = "000000";
          this.addForm.organizationId = this.selectKeys[
          this.selectKeys.length - 1
            ];
          this.$api.userAddRole(this.addForm).then(msg => {
            console.log(msg);
            if (msg.code !== 200) this.$message.error("创建用户失败");
            this.$message.success("创建用户成功");
            this.addRoleDialog = false;
            this.getSysUserList({
              page: {
                pageSize: this.sysUserPageSize,
                currentPage: 1
              },
              info: this.filters
            });
          });
        });
      },
      //编辑用户
      editUser() {
        console.log(this.editForm.userId);
        this.$refs.editUserFormRef.validate(valid => {
          if (!valid) return;
          console.log(this.editForm.phoneNum);
          let params = {
            userId: this.editForm.userId,
            organizationId: this.editForm.organizationId,
            phoneNumber: this.editForm.phoneNum,
            status: this.editForm.status,
            userName: this.editForm.userName,
            gender: 1
            // roleId: this.editForm,
          };
          console.log("----" + JSON.stringify(params));
          this.$api.editUserById(params).then(msg => {
            console.log(msg.message);
            if (msg.code !== 200) {
              this.$message.error("修改用户失败");
              return;
            }
            this.$message.success("修改用户成功");
            this.editUserDialog = false;
            this.getSysUserList({
              page: {
                pageSize: this.sysUserPageSize,
                currentPage: 1
              },
              info: this.filters
            });
          });
        });
      },
      //重置对话框
      addDialogClose() {
        this.$refs.addUserFormRef.resetFields();
      },
      editDialogClose() {
        this.$refs.editUserFormRef.resetFields();
      }
    }
  };
</script>

<style lang="less" scoped>
  /*@import "css/systemmana";*/
</style>
