<template>
  <div class="content-wrapper sptsystem-user-organize" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <div class="camera-search-display camera-manage-search">
        <div
          :class="
                isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'
              "
          style="width:100%;height:auto;"
        >
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item >
              <el-input v-model="titleh.orgName" placeholder="请输入组织名称" style="width: 120px;"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                  <el-select
                    v-model="titleh.organizationTypeDesc"
                    filterable
                    placeholder="请选择"
                    style="width:120px"
                    @change="changeState"
                    clearable
                  >
                 
                    <el-option key="5" label="业主单位" value="5"></el-option>
                    <el-option key="10" label="路公司" value="10"></el-option>
                    <el-option key="20" label="路段单位" value="20"></el-option>
                    <el-option key="30" label="收费站" value="30"></el-option>
                    <el-option key="40" label="服务区" value="40"></el-option>
                    <el-option key="90" label="其它" value="90"></el-option>
                  </el-select>
                </el-form-item>
            <el-form-item>
              <el-button type="primary" class="query" @click="query">搜索</el-button>
              <el-button type="primary" class="reset" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="organize-content">
      <el-card class="box-card centent-l">
        <div slot="header" class="clearfix">
          <span>组织结构</span>
        </div>
        <div class="text item content-tree">
          <el-tree
            :data="UserOrgTree1"
            node-key="organizationId"
            :props="{
              children: 'childList',
              label: 'organizationName',
            }"
            :default-expanded-keys="idArr"
            @node-click="handleTreenode"
          >
          
            <span class="custom-tree-node organize-box" slot-scope="{ node, data }">
                <span class="space-l">{{ node.label }}</span>
                <span class="space-l">{{ node.data.organizationTypeDesc }}</span>
                <span class="space-l">{{ node.data.responsiblePerson }}</span>
                <span class="space-l">{{ node.data.phone }}</span>
                
              <!-- <span v-if="titleh.organizationId == node.key" class="space-padding"> -->
              <span class="space-padding">
                <span class="button-padding">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click.stop="() => UpdateOrg(node, data)"
                  ></el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click.stop="() => appendOrg(data)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click.stop="() => removeOrg(node, data)"
                  ></el-button>
                </span>
              </span>
            </span>
          </el-tree>
        </div>
      </el-card>
      <el-dialog
        :title="addDialog.newTitle"
        :visible.sync="addDialog.addProviceVisable"
        width="364px"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        @close="updateClose"
      >
        <el-form :model="org" label-width="100px" ref="org">
          <!-- <el-form-item
            label="所属省"
            prop="regionCode"
            :rules="[{ required: true, message: '所属省不能为空' }]"
          >
            <el-select
              v-model="org.regionCode"
              placeholder="请选择"
              multiple
              :disabled="
                disabledRegionCode(org)"
            >
              <el-option
                v-for="item in provinces"
                :value-key="item.regionCode"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode + ''"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="上级单位" prop="parentOrgName">
            <el-select filterable v-model="org.parentOrgName" :disabled="
                disabledRegionCode(org)">
              <option value :key label></option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="组织名称"
            prop="orgName"
            :rules="[{ required: true, message: '组织名称不能为空' }]"
          >
            <el-input v-model="org.orgName" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item
            label="组织类型"
            prop="orgType"
            :rules="[{ required: true, message: '组织类型不能为空' }]"
          >
            <el-select v-model="org.orgType" :disabled="addDialog.newTitle != '新增' ? true : false">
              <el-option
                v-for="item in options"
                :value-key="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="responsiblePerson">
            <el-input v-model="org.responsiblePerson" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="org.phone" placeholder="请填写"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateClose">取 消</el-button>
          <el-button type="primary" @click="UpdataOrg()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="addUserOrg"
        :visible.sync="addUserOrgVisable"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        width="28%"
        @close="addColseDialog"
      >
        <el-form v-if="addUserOrgVisable" :model="newDialog" label-width="100px">
          <el-form-item
            label="用户名:"
            prop="loginName"
            :rules="[{ required: true, message: '用户名不能为空' }]"
          >
            <el-input
              v-model="newDialog.loginName"
              maxlength="20"
              placeholder="请填写20字以内的用户名"
              v-if="addUserOrg == '新增'"
            ></el-input>
            <el-input
              v-model="newDialog.loginName"
              maxlength="20"
              placeholder="请填写20字以内的用户名"
              v-if="addUserOrg == '修改'"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="姓名:"
            prop="userName"
            :rules="[{ required: true, message: '姓名不能为空' }]"
          >
            <el-input v-model="newDialog.userName" maxlength="20" placeholder="请输入20字以内的姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phoneNum" :rules="phoneNumber">
            <el-input v-model="newDialog.phoneNum" type="phone" maxlength="11" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organizationId">
            <el-cascader
              :options="UserOrgTreeChild"
              v-model="newDialog.organizationId"
              :props="cascaderProps"
              :disabled="disableOrganizationId"
              clearable
              :show-all-levels="false"
              @change="parentsCateChanged"
              @visible-change="closeHandleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否启用" prop="userStatus">
            <el-radio-group v-model="newDialog.userStatus">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联角色:" prop="roleCode">
            <el-select v-model="newDialog.roleCode" placeholder="请选择" class="roleSelect" multiple>
              <el-option
                v-for="item in roleList.roleBaseList"
                :value-key="item.roleCode"
                :key="item.roleCode"
                :label="item.roleName"
                :value="item.roleCode + ''"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addColseDialog">取 消</el-button>
          <el-button type="primary" @click="addDeiveGroup()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
import checkCamera from "../SystemRole/checkCamera";
export default {
  name: "sptOrganizationManagement",
  components: { checkCamera },
  data() {
    //合法手机号验证
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const reg = /^1[3456789]\d{9}$/;
      !reg.test(value) ? callback(new Error("请输入正确手机号")) : callback();
    };
    return {
      showPagination: false,
      isAllHeight: 0,
      phoneNumber: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: checkMobile, trigger: "blur" }
      ],
      titleh: {
        organizationId: "",
        organizationTypeDesc:"",
        UName: "",
        uStatus: "",
        loginUser: "",
        orgName: "",
        flag: true,
        selectManyProvince: true,
        parentId: 0
      },
      cascaderProps: {
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true,
        multiple: false
      },
      options: [
        {
          value: 5,
          label: "业主单位",
        },

        {
          value: 10,
          label: "路公司",
        },
        {
          value: 20,
          label: "路段单位",
        },
        {
          value: 30,
          label: "收费站",
        },
        {
          value: 40,
          label: "服务区",
        },
        {
          value: 90,
          label: "其它",
        },
      ],
      addDialog: {
        newTitle: "",
        addProviceVisable: false,
        addProviceList: [],
        proviceName: [],
        firstUtil: [],
        orgainName: "",
        orgainType: []
      },
      addUserOrgVisable: false,
      addUserOrg: "",
      newDialog: {
        organizationName: [],
        loginName: "",
        userName: "",
        phoneNum: "",
        regionName: "",
        userStatus: "",
        roleName: [],
        roleCode: [],
        organizationId: "",
        // newOrganizationId:'',
        userId: "",
        roleIds: "",
        source: "1"
      },
      userList: [],
      userTableData: [],
      sysUserCurrentPage: 1,
      setSysUserPages: 10,
      UserOrgTree1:[],
      org: {
        orgPid: 0,
        orgName: "",
        orgType: "",
        regionCodes: [],
        addProviceList: [],
        proviceName: [],
        firstUtil: [],
        regionName: [],
        parentId: 0,
        parentOrgName: "",
        organizationId: "",
        regionCode: [],
        phone: "",
        responsiblePerson: ""
      },
      userIdArr: [],
      orgProviceList: [],
      userSelList: [],
      orgUserList: [],
      idArr: [],
      organizationId: "",
      areadyChoosedCameras: false
    };
  },
  computed: {
    ...mapState([
      "UserOrgTree",
      "sysUser",
      "setSysUserList",
      "roleList",
      "orgTreeData",
      "provinces",
      "UserOrgTreeChild"
    ]),
    disableOrganizationId() {
      return this.addUserOrg === "修改" || this.areadyChoosedCameras;
    }
  },
  created() {
    // this.getUserOrganization();
    this.provinceTree();
  },
  mounted() {
    this.getUserListData();
    this.getRoleList();
    window.localStorage.setItem("orgId", this.idArr);
    window.addEventListener("scroll", this.handleScroll, true);
    // this.$nextTick(() => {
    //   let width = document.querySelector(".centent-r").getBoundingClientRect()
    //     .width;
    // });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    ...mapActions(["getSysUserList", "getRoleList"]),
    provinceTree() {
      this.$api.provinceTree().then((data) => {
        if (data.code != 200) {
          v.$message({
            message: "获取行政区域失败! [" + data.code + "]: " + data.message,
            type: "error",
          });
          return Promise.reject();
        }
        this.UserOrgTree1 = data.data;
      });
    },
    // provinceTree() {
    //   this.$api.provinceTree().then(res => {
    //     if (res.code == 200) {
    //       this.UserOrgTree1 = res.data;
    //       console.log("2222", this.UserOrgTree1);
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    afterChoosed(flag) {
      this.areadyChoosedCameras = flag;
    },
    /***
     *
     * 组织结构
     */
    // 选择省c
    // selProvinces(val) {
    //   this.org.regionCodes = val.filter(item => {
    //     return !isNaN(item);
    //   }); //过滤出新添加的code
    // },
    // removeProvinces(val) {
    //   let regionCodes = this.orgProviceList.filter(item => {
    //     return item.regionCodes;
    //   });
    // },
    disabledRegionCode(data) {
      let a =
        this.titleh.selectManyProvince == true &&
        this.addDialog.newTitle != "新增"
          ? false
          : data.parentId == 0
          ? false
          : true;
      let b = this.org.orgType !== 5;
      return a || b;
    },
    // 监听滚动事件
    handleScroll() {
      let scrollTop = this.$refs.viewbox.getBoundingClientRect().top;
      if (scrollTop) {
        this.showPagination = true;
        return;
      }
      this.showPagination = false;
    },
    // 获取用户列表
    getUserListData() {
      this.getSysUserList({
        pageSize: this.setSysUserPages,
        currPage: this.sysUserCurrentPage,
        loginName: this.titleh.loginUser,
        organizationId: this.titleh.organizationId,
        userName: this.titleh.UName,
        organizationTypeDesc:this.titleh.organizationTypeDesc,
        
      });
      console.log(this.getSysUserList);
    },
    // 新增用户
    addUserOrgInfo() {
      this.addUserOrgVisable = true;
      this.addUserOrg = "新增";
      this.$nextTick(() => {
        this.newDialog.userStatus = "1";
      });
    },

    // 所属单位
    parentsCateChanged(val) {
      if (val) {
        this.organizationId = val[val.length - 1];
        // this.newDialog.organizationId = this.organizationId;
        console.log(this.organizationId);
      }
    },
    closeHandleChange(visible) {
      if (!visible) {
        this.newDialog.organizationId = this.organizationId;
        console.log("close=====" + this.newDialog.organizationId);
      }
    },
    // 导出用户列表
    exportUserList() {
      console.log(this.titleh);
      let parmas = {
        userIds: this.titleh.userIds,
        loginName: this.titleh.loginUser,
        organizationId: this.titleh.organizationId,
        userName: this.titleh.UName,
        userStatus: this.titleh.uStatus,
        userIds: this.userSelList
      };
      // console.log('---------------参数'+parmas);
      this.$api
        .exportOrgUser(parmas)
        .then(res => {
          // console.log(res, "sddsdsd");
          var blob = new Blob([res], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "组织用户信息.xls"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          v.$message({
            message: "表格导出失败! ",
            type: "error"
          });
        });
    },
    // 批量处理
    getuserSelect(val) {
      this.userSelList = val.map(item => {
        return item.userId;
      });
    },
    handleSelectionChange(val) {
      this.userSelList = val.map(item => {
        return item.userId;
      });
    },
    // 启用
    cameraStart() {
      if (!this.userSelList.length) {
        this.$message.info({
          message: "请选择要启用的项！！",
          type: "info"
        });
        return false;
      } else {
        let parmas = {
          status: 1,
          userIds: this.userSelList,
          instructions: {
            module: "系统管理",
            page: "组织与用户",
            feature: "启用",
            description: "批量启用" + this.userSelList.length + "个用户"
          }
        };
        this.$confirm("提示", {
          title: "提示",
          message: "确认启用吗？",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(res => {
          api.updateMoreModifyStatus(parmas).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: "状态修改成功",
                type: "success"
              });
              this.query();
            }
          });
        });
      }
    },
    // 停用
    cameraStop() {
      if (!this.userSelList.length) {
        this.$message.info({
          message: "请选择要停用的项！！",
          type: "info"
        });
        return false;
      } else {
        this.$confirm("提示", {
          title: "提示",
          message: "确认停用吗？",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(res => {
          let parmas = {
            status: 0,
            userIds: this.userSelList,
            instructions: {
              module: "系统管理",
              page: "组织与用户",
              feature: "停用",
              description: "批量停用" + this.userSelList.length + "个用户"
            }
          };
          api.updateMoreModifyStatus(parmas).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: "状态修改成功",
                type: "success"
              });
              // this.query();
            }
          });
        });
      }
    },
    // 删除
    delCamera() {
      if (!this.userSelList.length) {
        this.$message.info({
          message: "请选择要删除的项",
          type: "info"
        });
        return false;
      }
      this.$confirm("提示", {
        title: "提示",
        message: "确认删除吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(res => {
        api.delMoreUser({ userIds: this.userSelList }).then(res => {
          if (res.code == 200) {
            this.$message.success({
              message: "已删除",
              type: "success"
            });
            // this.query();
          }
        });
      });
    },
    // 用户分页处理
    handleSizeChange(sizeVal) {
      this.setSysUserPages = sizeVal;
      this.getUserListData();
    },
    handleCurrentChange(curPage) {
      this.sysUserCurrentPage = curPage;
      this.getUserListData();
    },
    // 查询列表数据
    handleTreenode(val, node, isSelf) {
      // this.titleh.organizationId = val.organizationId;
      // this.titleh.orgName = val.organizationName;
      // this.titleh.flag = val.updateAndDel;
      // this.titleh.selectManyProvince = val.selectManyProvince;
      // this.titleh.parentId = val.parentOrganizationId;
      this.newDialog.organizationId = val.organizationId;
      this.$nextTick(() => {
        this.newDialog.organizationName = [val.organizationName];
      });
      console.log(this.titleh.parentId, this.titleh.organizationId);
    },
    // 重置
    handleReset() {
      this.titleh.uStatus = "";
      this.titleh.UName = "";
      this.titleh.organizationId = "";
      this.titleh.orgName = "";
      this.provinceTree();
    },
    // 选择状态
    changeState(val) {},

    addDeiveGroup() {
      let chooseData = this.$refs.checkcamera.getChoosedData();
      if (this.addUserOrg == "修改") {
        let params = {
          loginName: this.newDialog.loginName,
          organizationId: this.newDialog.organizationId,
          phoneNumber: this.newDialog.phoneNum,
          roleCodes: this.newDialog.roleCode, //关联用户id
          // status: this.newDialog.userStatus,
          status: parseInt(this.newDialog.userStatus),
          userName: this.newDialog.userName,
          userId: this.newDialog.userId,
          all: chooseData.all ? 1 : 0,
          addCameras: chooseData.choosedData
        };
        api.updateUserInfo(params).then(res => {
          if (res.code == 200) {
            this.$message.success({
              message: "修改成功",
              type: "success"
            });
            this.query();
            this.newDialog = {
              loginName: "",
              userName: "",
              phoneNum: "",
              regionName: "",
              userStatus: "",
              roleName: []
            };
          } else {
            this.$message.error({
              message: res.message,
              type: "error"
            });
          }
        });
        this.addUserOrgVisable = false;
      } else {
        let params = {
          loginName: this.newDialog.loginName,
          organizationId: this.newDialog.organizationId,
          phoneNumber: this.newDialog.phoneNum,
          roleCodes: this.newDialog.roleCode, //关联用户id
          status: this.newDialog.userStatus,
          userName: this.newDialog.userName,
          all: chooseData.all ? 1 : 0,
          addCameras: chooseData.choosedData,
          source: "1"
        };
        api.addOrgUser(params).then(res => {
          if (res.code == 200) {
            this.$message.success({
              message: "新增成功",
              type: "success"
            });
            this.query();
            this.addUserOrgVisable = false;
            this.newDialog = {
              loginName: "",
              userName: "",
              phoneNum: "",
              regionName: "",
              userStatus: "",
              roleName: []
            };
          } else {
            this.$message.error({
              message: res.message,
              type: "error"
            });
          }
        });
      }
    },
    addColseDialog() {
      this.addUserOrgVisable = false;
      if (this.addUserOrg == "修改") {
        this.newDialog.loginName = "";
        this.newDialog.userName = "";
        this.newDialog.phoneNum = "";
        this.newDialog.regionName = "";
        this.newDialog.userStatus = "";
        this.newDialog.roleName = [];
        this.newDialog.roleCode = "";
        this.newDialog.organizationId = "";
        console.log(this.newDialog);
      }
    },
    // 修改用户信息
    handleEdit(editFormData) {
      //
      this.addUserOrg = "修改";
      this.$nextTick(() => {
        // 记住旧的登录名，用于查重
        // this.oldUserAccount = editFormData.loginName;
        //this.$refs.addUserFormRef.resetFields();
        this.newDialog = JSON.parse(JSON.stringify(editFormData));
        let str = editFormData.roleName,
          code = editFormData.roleCode;
        this.newDialog.roleName = str ? str.split(",") : [];
        this.newDialog.roleCode = code ? code.split(",") : [];
        this.newDialog.organizationName = [editFormData.organizationName];
        this.addUserOrgVisable = true;
      });
    },
    // 查看组织用户详情
    handleDetail(row) {
      console.log(row, "用户详情数据");
      this.userDetailInfo = row;
      this.$router.push({ path: "/systemOrgainUserDetail", query: row });
    },
    // 新增组织
    appendOrg(data) {
      // ;
      console.log(data, "新增组织");
      this.addDialog.newTitle = "新增";
      this.addDialog.addProviceVisable = true;
      this.org = {
        regionName: [data.regionName], //所属区域
        regionCodes: [data.regionCode],
        parentId: data.parentOrganizationId,
        organizationId: data.organizationId,
        organizationName: data.organizationName,
        parentOrgName:
          this.titleh.parentId == 9901 ? "交通运输部" : data.organizationName,
        regionCode: data.regionCode ? [data.regionCode.toString()] : []
      };
    },
    // 修改组织
    UpdateOrg(node, data) {
      console.log(data, "修改组织");
      this.addDialog.newTitle = "修改";
      this.addDialog.addProviceVisable = true;
      this.org = {
        orgPid: data.organizationId,
        orgName: data.organizationName,
        orgType: data.organizationType,
        regionName: [data.regionName], //所属区域
        regionCodes: [data.regionCode],
        parentId: data.parentOrganizationId,
        parentOrgName: data.parentOrganizationName,
        organizationId: data.organizationId,
        organizationName: data.organizationName,
        phone: data.phone,
        responsiblePerson: data.responsiblePerson,
        regionCode: [data.regionCode.toString()]
      };
      console.log(this.org.regionCode);
      this.orgProviceList = [
        {
          regionName: data.regionName,
          regionCodes: data.regionCode
        }
      ];
      console.log(this.org.parentId);
    },
    // 取消
    updateClose() {
      this.addDialog.addProviceVisable = false;
      this.org.orgName = "";
      this.org.orgType = "";
    },
    UpdataOrg() {
      if (this.addDialog.newTitle == "修改") {
        let parmas = {
          organizationName: this.org.orgName,
          phone: this.org.phone,
          responsiblePerson: this.org.responsiblePerson,
          regionCodes: this.org.regionCode
        };
        this.$refs.org.validate(valid => {
          if (valid) {
            api.updateUserOrganization(this.org.orgPid, parmas).then(res => {
              if (res.code == 200) {
                this.$message.success({
                  message: "修改成功",
                  type: "success"
                });
                this.org.orgName = "";
                this.org.orgType = "";
                this.provinceTree();
              } else {
                this.$message.success({
                  message: res.message,
                  type: "error"
                });
              }
              this.addDialog.addProviceVisable = false;
            });
          }
        });
      } else {
        let parmas = {
          organizationName: this.org.orgName,
          organizationType: this.org.orgType,
          parentOrganizationId:
            this.org.parentId == 9901 ? 9901 : this.org.organizationId,
          // parentId: this.org.parentId,
          phone: this.org.phone,
          responsiblePerson: this.org.responsiblePerson,
          regionCodes: this.org.regionCode
        };
        this.$refs.org.validate(valid => {
          if (valid) {
            api.AddOrganizationList(parmas).then(res => {
              if (res.code == 200) {
                this.$message.success({
                  message: "新增成功",
                  type: "success"
                });
                this.org.orgName = "";
                this.org.orgType = "";
                // if(parmas.parentId)
                this.provinceTree();
              } else {
                this.$message.success({
                  message: res.message,
                  type: "error"
                });
              }
              this.addDialog.addProviceVisable = false;
            });
          }
        });
      }
    },
    // 删除组织
    removeOrg(node, data) {
      this.$confirm("提示", {
        title: "提示",
        message: "确认删除吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(res => {
        let params = {
          regionCode: data.regionCode,
          isConfirm: false
        };
        api.delUserOrganization(data.organizationId, params).then(res => {
          if (res.code == 200) {
            this.$message.success({
              message: "已删除",
              type: "success"
            });
            this.provinceTree();
          } else if (res.code == 4007) {
            this.$confirm("提示", {
              title: "提示",
              message: `${res.message}`,
              showCancelButton: true,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }).then(res => {
              let params = {
                regionCode: data.regionCode,
                isConfirm: true
              };
              api.delUserOrganization(data.organizationId, params).then(res => {
                this.$message.success({
                  message: res.message,
                  type: "info"
                });
                // this.getUserOrganization();
              });
            });
          } else {
            this.$message.success({
              message: res.message,
              type: "info"
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="less" src="../../css/userOrganize.less" scoped></style>
<style lang="less">
.sptsystem-user-organize {
  .space-l{
    width:200px;
  }
  .organize-content .centent-l {
    width: 100%;
  }
}

</style>
