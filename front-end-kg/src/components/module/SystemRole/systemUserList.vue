<template>
  <div class="content-wrapper" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-search-display camera-manage-search">
      <!-- <div> -->
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form
          :model="filters"
          :inline="true"
          class="demo-form-inline"
          ref="filtersFromRef"
        >
          <el-form-item label="状态:" prop="userStatus">
            <el-select
              style="width: 120px;"
              v-model="filters.userStatus"
              placeholder="请选择"
              class="dateStyle"
            >
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名:" prop="userName">
            <el-input
              style="width: 120px;"
              type="text"
              v-model="filters.userName"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organizationId">
            <el-cascader
              :show-all-levels="false"
              :options="UserOrgTreeChild"
              :props="cascaderProps"
              v-model="filters.organizationId"
              @change="parentsCateChanged($event, 'search')"
              @visible-change="closeHandleChange"
              style="width: 150px;"
              clearable
              change-on-select
            ></el-cascader>

            <!--<el-select v-model="filters.organizationId" placeholder="请选择">
            <el-option
              v-for="item in UserOrgTreeChild"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId"
            ></el-option>
          </el-select>-->
          </el-form-item>
          <el-form-item label="创建时间:" prop="datePicker">
            <el-date-picker
              v-model="filters.datePicker"
              type="daterange"
              unlink-panels
              class="gd-custom-date-picker"
              @change="datePickerChange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <!--<el-form-item label="创建时间" prop="startDate">
          <el-date-picker
              style="width: 160px;"
              v-model="filters.startDate"
              type="date"
              @change="datePickerChange"
              placeholder="起始时间"
              class="dateStyle"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="endDate">
          <div class="block">
            <el-date-picker
                style="width: 160px;"
                v-model="filters.endDate"
                type="date"
                @change="datePickerChange"
                placeholder="结束时间"
                class="dateStyle"
            >
            </el-date-picker>
          </div>
        </el-form-item>-->

          <!-- <el-form-item>
          <el-button type="primary" class="query" @click="handleSearch">查询</el-button>
          <el-button type="primary" class="reset" @click="resetSearch">重置</el-button>
        </el-form-item> -->
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="handleSearch"
            >查询</el-button
          >
          <el-button type="primary" class="reset" @click="resetSearch"
            >重置</el-button
          >
        </div>
        <!-- <span @click="seachMore" v-if="isAllHeight%2==0" class="have-more-info">更多</span>
        <span @click="seachMore" v-if="isAllHeight%2!=0" class="have-more-info">收起</span>-->
      </div>
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
          <!--<el-table-column
              type="selection"
              width="50"
              align="center"
          ></el-table-column>-->
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="loginName"
            label="用户名"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="phoneNum"
            label="电话"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="关联角色"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="regionName"
            label="省份"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属单位"
          ></el-table-column>
          <!--<el-table-column prop="count" label="关联摄像机组"></el-table-column>-->
          <el-table-column
            prop="createDate"
            label="创建时间"
            width="160"
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
          <el-table-column label="操作" width="120">
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
              <!--<el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  class="table-control-btn"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>-->
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
	<p class="total-pagination">共{{sysUser.sysUserTotal}}条</p>
        <!-- 分页 -->
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          :total="sysUser.sysUserTotal"
          :page-size="sysUserPageSize"
          :current-page="sysUserCurrentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="userInfoDialogVisible"
      width="28%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div>
        <el-form
          :model="userInfoForm"
          label-width="100px"
          ref="addUserFormRef"
          :rules="userInfoFormRules"
        >
          <el-form-item label="用户名：" prop="loginName">
            <el-input
              :disabled="userInfoForm.userId !== ''"
              type="text"
              v-model="userInfoForm.loginName"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="userName">
            <el-input
              type="text"
              v-model="userInfoForm.userName"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phoneNum">
            <el-input
              type="text"
              v-model="userInfoForm.phoneNum"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属单位：" prop="organizationId">
            <el-cascader
              :options="UserOrgTreeChild"
              :show-all-levels="false"
              :props="dialogProps"
              v-model="userInfoForm.organizationId"
              @change="CateChanged($event, 'search')"
              @visible-change="closeChange"
              change-on-select
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="启用：" prop="userStatus">
            <el-radio-group v-model="userInfoForm.userStatus">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联角色：" prop="roleCode">
            <el-select
              v-model="userInfoForm.roleCode"
              filterable
              default-first-option
              placeholder="请选择"
              class="roleSelect"
            >
              <template v-for="item in roleList.roleList">
                <el-option
                  v-if="item.status === '1'"
                  :key="item.roleCode"
                  :label="item.roleName"
                  :value="item.roleCode + ''"
                  class="roleOpti"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Base64 from "../../../tools/base64";
export default {
  data() {
    //合法手机号验证
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const reg = /^1[3456789]\d{9}$/;
      !reg.test(value) ? callback(new Error("请输入正确手机号")) : callback();
    };
    var checkName = (rule, value, callback) => {
      const reg = /^[A-Za-z-_\u4e00-\u9fa5]{1,20}$/;
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else if (!reg.test(value)) {
        callback(new Error("姓名由1-20位中文、英文组成"));
      } else {
        callback();
      }
    };
    var checkuserName = (rule, value, callback) => {
      //const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{6,20}$/;//[a-zA-Z_\u4e00-\u9fa5]
      const reg = /^[a-zA-Z0-9_]{5,20}$/; //[a-zA-Z_\u4e00-\u9fa5]
      if (value === "") {
        return callback(new Error("账号不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("账号名由6-20位字母、数字、下划线组成"));
      } else {
        // 编辑状态，验证是否修改，未修改不做接口验证
        if (this.userInfoForm.userId && this.oldUserAccount === value) {
          return callback();
        }
        this.$api
          .userAccountCheck(value)
          .then((data) => {
            if (data.code !== 2000) {
              return callback(new Error("用户名已被使用"));
            }
            callback();
          })
          .catch(() => {
            callback(new Error("用户名重复查询失败"));
          });
      }
    };
    return {
      showPagination: false,
      isAllHeight: 0,
      dialogTitle: "新增",
      userInfoDialogVisible: false,
      oldUserAccount: "",
      userInfoForm: {
        userId: "",
        organizationId: "",
        loginName: "",
        loginPwd: "000000", // this.Utils.randomString(0, 6),
        phoneNum: "",
        userStatus: "1",
        userName: "",
        gender: 1,
        roleCode: "",
        source: 1,
      },

      subordinateUnitsOptions: [],
      stateOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "启用",
        },
        {
          value: "0",
          label: "禁用",
        },
      ],
      selectKeys: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childNode",
        checkStrictly: true
      },
      dialogProps: {
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childNode",
        checkStrictly: true
      },
      sysUserCurrentPage: 1,
      sysUserPageSize: 10,
      filters: {
        // 承接模糊搜索用户数据
        organizationId: "",
        organizationName: "", // 管辖单位
        userName: "", // 用户名
        userStatus: "", // 用户状态
        phoneNumber: "", // 手机号
        datePicker: "",
        startDate: "",
        endDate: "",
      },
      editUserDialog: false,
      editForm: {},
      organizationId: "",
      userInfoFormRules: {
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: checkName, trigger: "blur" },
        ],
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkuserName, trigger: "blur" },
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      cateId: null,
    };
  },
  computed: {
    ...mapState(["sysUser", "roleList", "UserOrgTreeChild"]),
  },
  mounted() {
    this.getUserListData(1);
    this.getRoleList();
    this.getOrgTree();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    ...mapActions([
      "getRoleList",
      "getSysUserList",
      //"editUserRoles",
      "getOrgTree",
      "addUserAction",
      "editUserAction",
      "userAccountCheckAction",
    ]),
    ...mapMutations([]),
    // 监听滚动事件
    handleScroll() {
      let scrollTop = this.$refs.viewbox.getBoundingClientRect().top;
      // console.log(scrollTop, "d");
      if (scrollTop < -20) {
        this.showPagination = true;
        return;
      }
      this.showPagination = false;
    },
    datePickerChange(dtar) {
      // console.info('datePickerChange', dtar,this.Utils.date( 'Y-m-d h:i:s', dtar[0] ));
      if (dtar && dtar.length === 2) {
        this.filters.startDate = this.Utils.date("Y-m-d 00:00:00", dtar[0]);
        this.filters.endDate = this.Utils.date("Y-m-d 23:59:59", dtar[1]);
      }
    },
    // 分页处理---开始
    handleSizeChange(sizeVal) {
      this.sysUserPageSize = sizeVal;
      this.getUserListData();
    },
    handleCurrentChange(curPage) {
      //this.pageInfo.pagenum = curPage;
      /*this.getSysUserList({
          page: {
            pageSize: this.sysUserPageSize,
            currentPage: this.sysUserCurrentPage
          },
          info: this.filters
        });*/
      this.sysUserCurrentPage = curPage;
      this.getUserListData(curPage);
    },
    // 查询列表数据
    getUserListData(page) {
      let pages = page || this.sysUserCurrentPage;
      this.getSysUserList({
        page: {
          pageSize: this.sysUserPageSize,
          currentPage: pages,
        },
        info: this.filters,
      });
    },
    // 搜索
    handleSearch() {
      console.log(this.filters);
      this.sysUserCurrentPage = 1;
      this.getUserListData();
    },
    // 重置
    resetSearch() {
      this.$refs.filtersFromRef.resetFields();
      this.filters.startDate = "";
      this.filters.endDate = "";
      this.sysUserPageSize = 10;
      this.sysUserCurrentPage = 1;
      this.getUserListData();
    },
    // 详情
    handleDetail(item) {
      this.$router.push({
        path: "/systemUserListDetail",
        query: item,
      });
    },
    parentsCateChanged(val, type) {
      if (val) {
        this.organizationId = val[val.length - 1];
      }
    },
    closeHandleChange(visible) {
      if (!visible) {
        this.filters.organizationId = this.organizationId;
      }
    },
    CateChanged(val, type) {
      if (val) {
        this.cateId = val[val.length - 1];
      }
    },
    closeChange(visible) {
      if (!visible) {
        this.userInfoForm.organizationId = this.cateId;
      }
    },
    // 新增
    handleAddUser() {
      this.userInfoDialogVisible = true;
      this.dialogTitle = "新增";
      // let postData = {
      //   organizationId: "",
      //   loginName: "",
      //   loginPwd: "",
      //   phoneNumber: "",
      //   status: "",
      //   userName: "",
      //   gender: 1,
      //   roleId: "",
      //   source: "",
      //   instructions: {
      //     module: "设备管理",
      //     page: "摄像机管理",
      //     feature: "批量处理-开流",
      //     description: "摄像机",
      //   },
      // };

      //this.subordinateUnitsOptions = this.UserOrgTreeChild;
      //console.log("this.subordinateUnitsOptions" + this.UserOrgTreeChild);
    },
    // 编辑用户信息
    handleEdit(editFormData) {
      this.userInfoDialogVisible = true;
      this.dialogTitle = "修改";
      //this.setRolePowerCheckTree([]);
      this.$nextTick(() => {
        // 记住旧的登录名，用于查重
        this.oldUserAccount = editFormData.loginName;
        //this.$refs.addUserFormRef.resetFields();
        this.userInfoForm = JSON.parse(JSON.stringify(editFormData));
        // this.userInfoForm.userStatus=editFormData.userStatus
        //this.userInfoForm.roleCode =  this.userInfoForm.roleCode + "";
        console.info("this.userInfoForm ", this.userInfoForm);
        //this.userInfoForm.phoneNumber = parseInt(this.userInfoForm.phoneNum);
      });
    },

    // 新增/编辑保存
    saveDialog() {
      this.$refs.addUserFormRef.validate((valid) => {
        if (!valid) return;
        let postData = {
          //userId:this.userInfoForm.userId,
          organizationId: this.userInfoForm.organizationId,
          loginName: this.userInfoForm.loginName,
          loginPwd: this.userInfoForm.loginPwd,
          phoneNumber: this.userInfoForm.phoneNum,
          //userStatus:this.userInfoForm.userStatus,
          status: this.userInfoForm.userStatus,
          userName: this.userInfoForm.userName,
          gender: 1,
          roleId: this.userInfoForm.roleCode,
          source: this.userInfoForm.source,
        };

        if (this.userInfoForm.userId) {
          postData.userId = this.userInfoForm.userId;
          this.editUserAction(postData).then((res) => {
            this.userInfoDialogVisible = false;
            if (res.code === 200) {
              // this.getUserListData(1);
              this.resetSearch();
              this.$message.success(this.dialogTitle + "成功");
            }
          });
          return true;
        }
        this.addUserAction(postData).then((res) => {
          this.userInfoDialogVisible = false;
          if (res.code === 200) {
            // this.getUserListData(1);
            this.resetSearch();
            this.$message.success(this.dialogTitle + "成功");
          }
        });
      });
    },
    //重置对话框
    handleClose() {
      this.userInfoForm = {
        userId: "",
        organizationId: "",
        loginName: "",
        loginPwd: "000000", // this.Utils.randomString(0, 6),
        phoneNumber: "",
        status: "",
        userStatus: "1",
        userName: "",
        gender: "",
        roleCode: "",
        source: 1,
      };
      this.$refs.addUserFormRef.clearValidate();
    },
  },
};
</script>

<style lang="less" scoped>
/*@import "css/systemmana";*/
</style>
