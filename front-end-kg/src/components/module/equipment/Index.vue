<!--  -->
<template>
  <div class="content-wrapper content-ownWrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>摄像机组管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cameraheader">
      <div class="tab-wrapper">
        <div @click="$router.push({ path: '/deviceCameraManage' })">摄像机管理</div>
        <div class="active">摄像机组管理</div>
        <div @click="$router.push({ path: '/cameraStatusDetection' })">摄像机审核</div>
        <!-- <div @click="$router.push({ path: '/cameraAccess' })"  v-if="uinfo.regionCode == 500000 ? false : true">摄像机接入</div> -->
        <!-- <div @click="$router.push({ path: '/borrow' })">借阅审核</div> -->
        
      </div>
      <div>
        <el-button type="primary" plain class="query" @click="addEquipmentClick">新增</el-button>
        <el-dropdown split-button type="primary">
          批量处理
          <el-dropdown-menu slot="dropdown" class="camera-manage-dropdown">
            <el-dropdown-item>
              <div @click="delAssociated">
                <span class="iconTips kl-icon"></span>
                <span>删除</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="getAllGroupList">
                <span class="iconTips gl-icon"></span>
                <span>关联用户</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="getRoleList">
                <span class="iconTips bf-icon"></span>
                <span>关联角色</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="camera-search-display camera-manage-search">
      <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
        <el-form
          :inline="true"
          class="demo-form-inline"
          :model="deviceGroupQuery"
          ref="deviceGroupForm"
        >
          <!-- 查询条件 -->
          <el-form-item label="摄像机组名称：" prop="groupName">
            <el-input v-model="deviceGroupQuery.groupName"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="userName">
            <el-input v-model="deviceGroupQuery.userName"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createDateTime">
            <el-date-picker
              v-model="deviceGroupQuery.createDateTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="searchDeviceGroup">查询</el-button>
          <el-button type="primary" class="reset" @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>
    <div class="camera-device-table-h table-wrapper-exthend" style="margin-bottom:0">
      <!--<EquipmentTable ref="mychild"></EquipmentTable>-->
      <!-- equipment-tabel-height -->

      <div class="table-content-body">
        <el-table
          ref="multipleTable"
          class="custom-cloud-table"
          :data="tableData.data"
          border
          @selection-change="handleSelectionChange"
          >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="groupName" label="摄像机组名称"></el-table-column>

          <el-table-column prop="deviceCount" label="设备数量"></el-table-column>
          <el-table-column prop="userCount" label="关联用户"></el-table-column>
          <el-table-column prop="createUser" label="创建人"></el-table-column>
          <el-table-column prop="createDate" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <img
                src="../../../assets/images/equipment/copy.png"
                v-if="scope.row.status == 1"
                @click="changeStatus(scope.row, 0)"
              />
              <img
                src="../../../assets/images/equipment/copy2.png"
                v-if="scope.row.status == 0 || scope.row.status == null"
                @click="changeStatus(scope.row, 1)"
              />
              <!-- <img
                src="../../../assets/images/equipment/gljs.png"
                @click="openAssociatedRole(scope.row.groupId)"
              />
              <img
                src="../../../assets/images/equipment/glyh.png"
                @click="openAssociatedUser(scope.row.groupId)"
              />-->
              <img
                src="../../../assets/images/equipment/bianji.png"
                @click="updateEquip(scope.row.groupId, scope.row)"
              />
              <img
                src="../../../assets/images/equipment/shanchu.png"
                @click="delEquip(scope.row)"
              />
              <img
                src="../../../assets/images/equipment/chakan.png"
                @click="lookMsg(scope.row.groupId, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <!-- 查看详情 -->
        <!-- <el-dialog
          title="查看详情"
          :visible.sync="lookmsg"
          width="85%"
          top="14vh"
          :modal-append-to-body="false"
          custom-class="gd-dialog h-dialog"
          v-dialogDrag
          :append-to-body="true"
          :close-on-click-modal="false"
        >
          <LookMsg ref="mychild"></LookMsg>
        </el-dialog>-->

        <!-- 选择设备 -->
        <!-- <el-dialog
          title="选择设备"
          :visible.sync="selectEquipment"
          width="75%"
          top="14vh"
          :modal-append-to-body="false"
          v-dialogDrag
          :append-to-body="true"
          :close-on-click-modal="false"
          custom-class="gd-dialog h-dialog"
        >
          <SelectEquipment ref="mychild1"></SelectEquipment>
        </el-dialog>-->
      </div>
      <div class="table-pagination">
        <p class="total-pagination">共{{tableData.total}}条</p>
        <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :total="tableData.total"
          :current-page="currpage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 关联角色 -->
    <el-dialog
      title="关联角色"
      :visible.sync="associatedRoleVisible"
      :modal-append-to-body="false"
      width="450px"
      custom-class="own-wrapper"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <el-form :inline="true" class="demo-form-inline" ref="relationRole">
        <el-form-item label="选择角色">
          <el-select
            v-model="myUserData"
            multiple
            placeholder="请选择"
            style="width:400px;"
            @change="changeUserVal"
            filterable
            >
            <!-- <input
              type="text"
              placeholder="请输入"
              class="el-input__inner"
              v-model="dropDownValue"
              @keyup="dropDownSearch"
            />-->
            <el-option
              v-for="item in userGroup.allRoleList"
              :value-key="item.roleCode"
              :key="item.roleCode"
              :label="item.roleName"
              :value="item.roleCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="associatedRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAddDeviceRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="lookmsg"
      width="85%"
      top="14vh"
      :modal-append-to-body="false"
      custom-class="gd-dialog h-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <LookMsg v-if="lookmsg" ref="mychild"></LookMsg>
    </el-dialog>

    <!-- 新增设备/修改设备 -->
    <el-dialog
      :title="this.myTitle"
      :visible.sync="addEquipment"
      width="25%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="equipmentChangeDialogClose"
      >
      <el-form
        ref="equipmentInfoForm"
        :model="equipmentInfo"
        label-width="130px"
        :rules="equipmentInfoFormRules"
        >
        <el-form-item label="摄像机组名称：" prop="equipmentName">
          <el-input type="text" v-model="equipmentInfo.equipmentName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="选择设备：">
          <img
            src="../../../assets/images/equipment/add.png"
            @click="selectEquip"
            style="cursor: pointer"
          />
          <div class="select-box2">
            <ul class="equipment-options" v-if="checkData.length > 0">
              <li v-for="(item, index) in checkData" :key="index">
                <el-tooltip
                    :content="item.cameraName"
                    style="display: inline-block;width: calc(100% - 50px);vertical-align: bottom;"
                  >
                <span
                  style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: left;"
                >{{ item.cameraName }}</span>
                </el-tooltip>
                <span @click="delOndCamera(index)" style="cursor: pointer">x</span>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label="选择角色：" prop="userId">
          <el-select
            v-model="equipmentInfo.roleId"
            multiple
            placeholder="请选择"
            style="width:100%"
            filterable
            >
            <el-option
              v-for="item in userGroup.allRoleList"
              :value-key="item.roleCode"
              :key="item.roleCode"
              :label="item.roleName"
              :value="item.roleCode+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择用户：" prop="userId">
          <el-select
            v-model="equipmentInfo.userId"
            multiple
            placeholder="请选择"
            style="width:100%"
            filterable
            >
            <el-option
              v-for="item in userGroup.allUserList"
              :value-key="item.userId"
              :key="item.userId"
              :label="item.loginName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!--<div class="add-equipment">
        <div class="equipment-name">
          <div class="equipment-name-left left">摄像机组名称：</div>
          <div class="equipment-name-right right">
            <el-input v-model="equipmentName" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="select-equipment">
          <div class="select-box1">
            <div class="select-equipment-left left">选择设备：</div>
            <div class="select-equipment-right right">
              <div>
                <img src="../../../assets/images/equipment/add.png" @click="selectEquip" />
              </div>
            </div>
          </div>

        </div>
        <div class="select-role">
          <div class="select-role-left left">选择人员：</div>
          <div class="equipment-name-right right">
            <el-select v-model="userId" multiple placeholder="请选择" style="width:100%">
              <el-option
                  v-for="(item, index) in allUserData"
                  :value-key="item.userId"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEquipment = false">取 消</el-button>
        <el-button type="primary" @click="btnAddEquipment">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择设备 -->
    <el-dialog
      title="选择设备"
      :visible.sync="selectEquipment"
      width="75%"
      top="14vh"
      :modal-append-to-body="false"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="gd-dialog h-dialog"
      >
      <SelectEquipment
        ref="selectEquipments"
        :equipmentInfo="equipmentInfo"
        :tableData="selectEquipData.table"
        :total="selectEquipData.total"
      ></SelectEquipment>
    </el-dialog>
    <!-- 关联用户 -->
    <el-dialog
      title="关联用户"
      ref="associatedUserRef"
      :visible.sync="associatedUserVisible"
      :modal-append-to-body="false"
      width="450px"
      custom-class="own-wrapper"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="选择用户:" prop="associatedUserArr">
          <el-select
            v-model="associatedUserArr"
            multiple
            placeholder="选择用户"
            style="width: 400px"
            @change="handleUser"
            filterable
          >
            <el-option
              v-for="item in userGroup.allUserList"
              :value-key="item.userId"
              :key="item.userId"
              :label="item.loginName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAssociatedUserVisible">取 消</el-button>
        <el-button type="primary" @click="associatedUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import EquipmentTable from "../../equipment/equipmentTable";
import $http from "../../../filters/http";
import api from "../../../api/index";
import LookMsg from "../../equipment/lookMsg";
import SelectEquipment from "../../equipment/selectEquipment";
export default {
  data() {
    let checkName = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\.]{1,50}$/; //[a-zA-Z_\u4e00-\u9fa5]
      //const reg = /^[a-zA-Z0-9_]{5,20}$/;//[a-zA-Z_\u4e00-\u9fa5]
      if (value === "") {
        return callback(new Error("摄像机组名称不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("摄像机组名称名由50位字母、中文、英文、符号组成"));
      } else {
        callback();
        // 编辑状态，验证是否修改，未修改不做接口验证
        // if (this.updateGroupId && this.oldEquipmentName === value) {
        //   return callback();
        // }
        // this.$api
        //   .checkDeviceGroup({ groupName: value })
        //   .then(data => {
        //     if (data.code !== 2000) {
        //       return callback(new Error("摄像机组名称重复查询失败"));
        //     }
        //     if (data.message === "1") {
        //       return callback(new Error("摄像机组名称已被使用"));
        //     }
        //     callback();
        //   })
        //   .catch(() => {
        //     callback(new Error("摄像机组名称重复查询失败"));
        //   });
      }
    };
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      isAllHeight: 0,
      activeName: "second",
      selectRole: "",
      userOptions: [],
      tableData: {},
      multipleSelection: [],
      userDataShow: [],
      valueMeta: [],
      dropDownValue: "",
      pagesize: 10,
      currpage: 1,
      associatedUserVisible: false,
      associatedRoleVisible: false,
      lookmsg: false,
      addEquipment: false, //是否是增加
      selectEquipment: false,
      userData: [],
      associatedUserArr: [],
      userIdArr: [],
      userIdAllArr: [],
      removeUserIdArr: [],
      myUserData: [],
      groupId: "",
      rows: [],
      equipmentName: "",
      oldEquipmentName: "",
      allUserData: [],
      checkData: [],
      userId: "",
      myUserArr: [],
      myTitle: "",
      //   isAdd: false, //是否是编辑
      isAll: false,
      updateGroupId: "",
      checkTableData: [],
      associatedUserGroupId: [],
      associatedRoleGroupId: [],
      //isCloudGateway:false
      deviceGroupQuery: {
        groupName: "",
        userName: "",
        createDateTime: ""
      },
      equipmentInfo: {
        equipmentName: "",
        userId: [],
        roleId: []
      },
      allGroupList: [],
      equipmentInfoFormRules: {
        equipmentName: [
          { required: true, message: "请输入摄像机组名称", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        userId: [{ required: true, message: "请选择人员", trigger: "blur" }]
        /*loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkuserName, trigger: "blur" }
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]*/
      },
      selectEquipData: {
        table: [],
        currpage: 1,
        pageSize: 10,
        total: 0
      },
      RoelArr: [] //选择关联用户列表
    };
  },
  components: {
    //用来注册子组件的节点
    EquipmentTable,
    LookMsg,
    SelectEquipment
  },

  computed: {
    ...mapState(["userGroup"])
  },
  methods: {
    ...mapActions([
      "delGroupUser",
      "getAllUserList",
      "getAllRoleList",
      "getUserOrganization"
    ]),

    handleCurrentChange(cpage) {
      this.currpage = cpage;
      this.getData();
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
      this.getData();
    },
    getData() {
      var params = {
        currPage: this.currpage,
        pageSize: this.pagesize,
        createUser: this.deviceGroupQuery.userName,
        groupName: this.deviceGroupQuery.groupName,
        endDate: this.deviceGroupQuery.createDateTime[1],
        startDate: this.deviceGroupQuery.createDateTime[0]
      };
      this.$api.getDeviceGroupList(params).then(res => {
        if (res.code === 200) {
          this.tableData = res;
        }
      });
    },
    handleUser(add) {
      this.userIdArr = add;
      // this.userIdAllArr.map(item => {
      //   //input原有的userId
      //   return item.userId;
      // });
      // let newAddList = add.filter(item => {
      //   if (item == null) {
      //     item = "isNum";
      //   }
      //   return !isNaN(item); //数组过滤到数字
      // });
      // this.userIdArr.push(...newAddList);
      // console.log(this.userIdArr);
    },
    // 移除关联用户
    removeUserName(remove) {
      // let removeUserID = [];
      let removeUser = this.userIdAllArr.filter(item => {
        // 从元素组中过滤移除的用户
        return item.userName == remove;
      });
      this.removeUserIdArr.push(...removeUser); //获取到所有移除的user
      let removeUserID = this.removeUserIdArr.map(remove => {
        //获取到所有移除的userId
        return remove.userId;
      });
      //从userIdArr 中移除已经删除的userId，剔除相同值
      let subUid = this.userIdArr
        .concat(removeUserID)
        .filter((item, index, arr) => {
          return arr.indexOf(item) === arr.lastIndexOf(item);
        });
      this.userIdArr = subUid;
      console.log(this.userIdArr);
    },
    //关联用户
    associatedUser() {
      var params = {
        groupIds: this.associatedUserGroupId,
        relationIds: this.userIdArr,
        status: 1, // endDate: "", // organizationId: "", // organizationName: "", // phoneNum: "", // regionName: "", // startDate: "", // userName: "", // userStatus: ""
        instructions: {
          module: "资源管理",
          page: "摄像机组管理",
          feature: "批量处理——关联人员",
          description:
              "批量选择"+ this.associatedUserGroupId.length + "路摄像机组关联人员" + this.userIdArr.join('、')
        }
      };
      api.upDateRelationUser(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "关联成功"
          });
          this.associatedUserGroupId = [];
        }
        this.associatedUserVisible = false;
        this.getData(); //刷新页面
      });
    },
    //关联角色
    btnAddDeviceRole() {
      var params = {
        groupIds: this.associatedRoleGroupId,
        relationIds: this.RoelArr,
        status: 2,
        instructions: {
          module: "资源管理",
          page: "摄像机组管理",
          feature: "批量处理——关联人员",
          description:
              "批量选择"+ this.associatedRoleGroupId.length + "路摄像机组关联人员" + this.RoelArr.join('、')
        }
      };
      api.upDateRelationUser(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "关联成功"
          });
          this.associatedRoleGroupId = [];
        }
        this.myUserData = [];
        // this.$refs.relationRole.resetFields();
        this.associatedRoleVisible = false;
        this.getData(); //刷新页面
      });
    },
    openAssociatedRole(groupId) {
      this.groupId = groupId;
      this.associatedRoleVisible = true;
      // associatedRole(groupId);
    },
    getAllGroupList() {
      //用户列表
      this.associatedUserArr = [];
      if (!this.associatedUserGroupId.length) {
        this.$message({
          type: "info",
          message: "请选择要关联的摄像机组！"
        });
      } else {
        this.associatedUserVisible = true;
        this.getAllUserList();
      }
    },
    getRoleList() {
      //角色列表
      if (!this.associatedRoleGroupId.length) {
        this.$message({
          type: "info",
          message: "请选择要关联的摄像机组！"
        });
      } else {
        this.associatedRoleVisible = true;
        this.getAllRoleList();
      }
    },
    // 关联用户
    openAssociatedUser(groupId) {
      this.updateGroupId = groupId;
      console.log(this.groupId);
      this.associatedUserGroupId.push(groupId);
      this.userOptions = [];
      this.userIdArr = [];
      this.removeUserIdArr = [];
      this.associatedUserVisible = true;
      let userApperList = [];
      let userIdAll = [];
      //获取设备关联用户 参数
      var userParams = {
        groupId: groupId
      };
      $http
        .post("/user/list/" + groupId) //获取可关联的用户
        .then(res => {
          this.userOptions = res.data.data;
        });
      //获取设备已关联人员
      this.$api.checkUser(userParams).then(res => {
        if (res.data.code == 2000) {
          res.data.data.content.map(item => {
            userIdAll.push({ userName: item.userName, userId: item.userId });
            // userApperList.push(item.userName);
            // this.associatedUserArr = userApperList; //获取到已关联人员
            userApperList.push(item.userId);
            this.associatedUserArr = userApperList;
            this.userIdAllArr = userIdAll;
            this.groupId = [];
            // this.associatedUserArr.push(item.userName);
          });
        }
        console.log(this.associatedUserArr);
      });
    },

    // 关联角色
    associatedRole(groupId) {
      this.isAll = false;
      this.groupId1 = groupId;
    },

    changeUserVal(val) {
      this.RoelArr = val;
    },
    //删除设备
    delAssociated() {
      if (this.associatedUserGroupId.length === 0) {
        this.$message.warning("请选择要处理的设备！");
        return false;
      }

      this.$confirm("确定删除设备?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm"
      }).then(() => {
        var params = {
          groupIds: this.associatedUserGroupId,
          instructions: {
            module: "资源管理",
            page: "摄像机组管理",
            feature: "批量处理—删除",
            description:
                "批量删除"+ this.associatedUserGroupId.length + "路摄像机"
          }
        };
        console.log(params);
        this.$api.deleteDeviceGroup(params).then(res => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getData();
          } else {
            this.$message(res.data.message);
          }
        });
      });
    },
    //搜索
    dropDownSearch() {
      this.userDataShow = this.userData
        .map(item => {
          return item.userName;
        })
        .filter(this.filterSearch);
    },
    filterSearch(item) {
      return item.includes(this.dropDownValue);
    },

    addAssociatedUser() {
      if (this.isAll) {
        var groupIds = this.checkTableData.map(item => {
          return item.groupId;
        });
      } else {
        var groupIds = [this.groupId1];
      }
      var data = [];
      for (let i = 0; i < this.myUserData.length; i++) {
        for (let j = 0; j < this.userData.length; j++) {
          if (this.myUserData[i] == this.userData[j].userName) {
            data.push(this.userData[j].userId);
          }
        }
      }
      var params = { groupIds: groupIds, users: data };
      console.info(params);
      $http.post("/device/group/v2/user", params).then(res => {
        console.info(res);
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "关联成功"
          });
        }
      });
      this.associatedPart = false;
      this.getData();
    },
    //查看摄像机组详情
    lookMsg(groupId, row) {
      this.lookmsg = true;
      this.groupId = groupId;
      this.rows = row;
      setTimeout(() => {
        this.$refs.mychild.groupId = groupId;
        this.$refs.mychild.getUserData(groupId);
        this.$refs.mychild.getData(groupId);
        this.$refs.mychild.getRoleData(groupId);
      }, 5);
    },

    //删除摄像机组
    delEquip(row) {
      this.$confirm("确定要删除该设备分组吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var arr = [];
          arr.push(row.groupId);
          var params = {
            groupIds: arr,
            instructions: {
              module: "资源管理",
              page: "摄像机组管理",
              feature: "删除",
              description:
                  "删除: "+ row.groupName
            }
          };
          this.$api.deleteDeviceGroup(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.getData();
            } else {
              this.$message(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //选择设备
    selectEquip() {
      this.selectEquipment = true;
      this.getUserOrganization();
      setTimeout(() => {
        this.$refs.selectEquipments.currpage=1;
        this.$refs.selectEquipments.pagesize=10;
        this.$refs.selectEquipments.getTableData();
      }, 5);
    },
  
    delOndCamera(idx) {
      this.checkData.splice(idx, 1);
    },

    equipmentChangeDialogClose() {
      this.equipmentInfo = {
        equipmentName: "",
        userId: [],
        groupId: ''
      };
      this.$refs.equipmentInfoForm.clearValidate();
    },

    //确定添加或者更新设备
    btnAddEquipment() {
      // equipmentInfoForm
      this.$refs.equipmentInfoForm.validate(valid => {
        if (!valid) return;

        if (this.myTitle == "新增设备") {
          var cameraIds = this.checkData.map(item => {
            return item.cameraId;

          });
          var params = {
            cameraIds: cameraIds,
            groupName: this.equipmentInfo.equipmentName,
            userIds: this.equipmentInfo.userId,
            roleCodes: this.equipmentInfo.roleId,
            instructions: {
              module: "资源管理",
              page: "摄像机组管理",
              feature: "新增",
              description:
                "新增摄像机组:" + this.equipmentInfo.equipmentName
            }
          };
          this.$api.addDeviceList(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              params = {};
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
            this.getData();
            this.checkData = [];
            this.addEquipment = false;
          });
        } else {
          var cameraIds = this.checkData.map(item => {
            return item.cameraId;
          });
          var params = {
            cameraIds: cameraIds,
            groupName: this.equipmentInfo.equipmentName,
            userIds: this.equipmentInfo.userId,
            roleCodes: this.equipmentInfo.roleId,
            groupId: this.updateGroupId,
            instructions: {
              module: "资源管理",
              page: "摄像机组管理",
              feature: "修改",
              description:
                "修改摄像机组:" + this.equipmentInfo.equipmentName
            }
          };
          this.$api.updateDeviceList(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
            }
            this.getData();
            this.checkData = [];
            this.addEquipment = false;
          });
        }
      });
    },
    // 查询设备
    searchDeviceGroup() {
      this.currpage = 1
      var params = {
        currPage: this.currpage,
        pageSize: "",
        createUser: this.deviceGroupQuery.userName,
        groupName: this.deviceGroupQuery.groupName,
        endDate: this.deviceGroupQuery.createDateTime ? this.deviceGroupQuery.createDateTime[1] : '',
        startDate: this.deviceGroupQuery.createDateTime ? this.deviceGroupQuery.createDateTime[0] : ''
      };
      this.$api.getDeviceGroupList(params).then(res => {
        if (res.code === 200) {
          this.tableData = res;
        }
      });
    },
    //编辑设备
    updateEquip(groupId, row) {
      this.updateGroupId = groupId;
      this.equipmentName = row.groupName;
      this.oldEquipmentName = row.groupName;
      // this.equipmentInfo.userId = [row.createUser];
      this.myTitle = "编辑设备";
      this.addEquipment = true;
      this.getAllUserList(); //获取用户列表
      this.getAllRoleList(); //获取角色列表
      let params = { groupId: groupId };
      this.$api.checkUser(params).then(res => {
        //获取以关联的角色
        if (res.code === 200) {
          let selectedRole = res.data;
          let roleIds = selectedRole.map(item => {
            return item.roleCode.toString();
          });
          this.equipmentInfo = {
            equipmentName: row.groupName,
            roleId: roleIds,
            userId: row.userIds,
            groupId: row.groupId
          };
        }
      });
      this.$api.getDeviceCamera({ groupId }).then(res => {
        //获取摄像机回显
        if (res.code == 200) {
          this.checkData = res.data;
        }
      });
    },
    handleSelectionChange(val) {
      let seleVal = val.map(item => {
        return item.groupId;
      });
      this.associatedUserGroupId = seleVal;
      this.associatedRoleGroupId = seleVal;
    },
    //改变摄像机组状态
    changeStatus(row, status) {
      let text = status === 1 ? '启用' : '停用';
      var params = {
        groupId: row.groupId,
        status: status,
        instructions: {
          module: "资源管理",
          page: "摄像机组管理",
          feature: status === 1 ? '启用' : '停用',
          description:
            text + ":" + row.groupName
        }
      };
      if (status == 1) {
        this.$confirm("确定启用摄像机?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          customClass: "gd-confirm"
        }).then(() => {
          this.$api.openOrStopDevice(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: '启用成功'
              });
              this.getData();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        });
      } else {
        this.$confirm("确定停用摄像机?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          customClass: "gd-confirm"
        }).then(() => {
          this.$api.openOrStopDevice(params).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: '停用成功'
              });
              this.getData();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        });
      }
    },
    addEquipmentClick() {
      this.addEquipment = true;
      this.myTitle = "新增设备";
      this.equipmentName = "";
      this.checkData = [];
      this.allUserData = [];
      this.userId = "";
      var params = {
        endDate: "",
        organizationId: "",
        organizationName: "",
        phoneNum: "",
        regionName: "",
        startDate: "",
        userName: "",
        userStatus: ""
      };
      this.getAllUserList();
      this.getAllRoleList();
    },
    linkUser() {},
    resetSearch() {
      this.$refs.deviceGroupForm.resetFields();
      this.currpage = 1;
      this.getData();
    },
    closeAssociatedUserVisible() {
      this.associatedUserArr = [];
      this.associatedUserVisible = false;
    }
  },
  //生命周期 - 创建完成（访问当前this实例）

  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getData();
  }
};
</script>
<style lang="less">
.dialog-footer {
  padding-top: 10px 20px 20px !important;
}
.equipment-tabel-height {
  height: calc(100% - 140px) !important;
}

.equipment-options {
  width: 100%;
  /* box-shadow: 2px 2px 2px 2px #ccc; */
  border: 1px solid #ccc;
  border-radius: 3px;

  li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    &:hover {
      background: rgba(232, 234, 239, 1);
    }
    span:last-child {
      color: #ff1414;
      cursor: pointer;
      margin-left: 5px;
    }
  }
}
.own-wrapper {
  border-radius: 4px;
}
</style>
