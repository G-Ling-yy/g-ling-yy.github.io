<template>
  <div
    class="content-wrapper system-user-organize"
    ref="viewbox"
  >
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>组织与用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="organize-content">
      <el-card class="box-card centent-l">
        <div slot="header" class="clearfix">
          <span>组织结构</span>
        </div>
        <div class="text item content-tree">
          <el-tree
            :data="UserOrgTree"
            node-key="organizationId"
            :props="{
              children: 'childList',
              label: 'organizationName'
            }"
            :default-expanded-keys="idArr"
            @node-click="handleTreenode"
          >
            <div
              class="custom-tree-node organize-box"
              slot-scope="{ node, data }"
            >
              <div
                class="space-l"
                :class="{
                  isActive:
                    titleh.organizationId == node.key
                }"
              >
                {{ node.label }}
              </div>
              <div
                v-if="titleh.organizationId == node.key"
                class="space-padding"
              >
                <span class="button-padding">
                  <el-button
                    v-if="
                      titleh.parentId != 0 &&
                        titleh.flag == false
                    "
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click.stop="
                      () => UpdateOrg(node, data)
                    "
                  ></el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click.stop="() => appendOrg(data)"
                  ></el-button>
                  <el-button
                    v-if="
                      titleh.parentId != 0 &&
                        titleh.flag == false
                    "
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click.stop="
                      () => removeOrg(node, data)
                    "
                  ></el-button>
                </span>
              </div>
            </div>
          </el-tree>
        </div>
      </el-card>
      <el-card class="box-card centent-r">
        <el-tabs v-model="activeName" type="card">
          <!-- 组织用户 -->
          <el-tab-pane label="组织用户" name="organization">
            <div style="margin-left: 20px">
              <span v-if="!titleh.orgName">全国</span>
              <span v-if="titleh.orgName">{{
                titleh.orgName
              }}</span>
            </div>
            <div class="text item content-rbody">
              <div
                class="camera-search-display camera-manage-search"
              >
                <div
                  :class="
                    isAllHeight % 2 != 0
                      ? 'common-search-all-h'
                      : 'search-wrapper'
                  "
                  style="width: 100%; height: auto"
                >
                  <!-- <div class="search-wrapper change-padding"> -->
                  <el-form
                    :inline="true"
                    class="demo-form-inline"
                  >
                    <el-form-item label="用户名:">
                      <el-input
                        v-model="titleh.loginUser"
                        placeholder="请填写用户名"
                        style="width: 120px"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名:">
                      <el-input
                        v-model="titleh.UName"
                        placeholder="请填写姓名"
                        style="width: 120px"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="状态:">
                      <el-select
                        v-model="titleh.uStatus"
                        filterable
                        placeholder="请选择"
                        style="width: 120px"
                        @change="changeState"
                        clearable
                      >
                        <el-option
                          key="1"
                          label="启用"
                          value="1"
                        ></el-option>
                        <el-option
                          key="0"
                          label="禁用"
                          value="0"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        class="query"
                        @click="query"
                        >搜索</el-button
                      >
                      <el-button
                        type="primary"
                        class="reset"
                        @click="handleReset"
                        >重置</el-button
                      >
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        plain
                        class="query"
                        @click="addUserOrgInfo"
                        >新增</el-button
                      >
                      <el-button
                        type="primary"
                        plain
                        class="query"
                        @click="exportUserList"
                        >数据导出</el-button
                      >
                      <el-dropdown
                        split-button
                        type="primary"
                      >
                        批量处理
                        <el-dropdown-menu
                          slot="dropdown"
                          class="orgUser-manage-dropdown"
                        >
                          <el-dropdown-item>
                            <div @click="cameraStart">
                              <span
                                class="kl-icon-u"
                              ></span>
                              <span>启用</span>
                            </div>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <div @click="cameraStop">
                              <span
                                class="gl-icon-u"
                              ></span>
                              <span>停用</span>
                            </div>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <div @click="delCamera">
                              <span
                                class="delete-icon-u"
                              ></span>
                              <span>删除</span>
                            </div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="r-table">
                <el-table
                  ref="singleTable"
                  :data="sysUser.sysUserList"
                  highlight-current-row
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange"
                  @select="getuserSelect"
                  @select-all="getuserSelect"
                >
                  <el-table-column
                    type="selection"
                    align="center"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="60"
                  ></el-table-column>
                  <el-table-column
                    prop="loginName"
                    label="用户名"
                  ></el-table-column>
                  <el-table-column
                    prop="userName"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    prop="phoneNum"
                    label="电话"
                  ></el-table-column>
                  <el-table-column
                    prop="roleName"
                    label="关联角色"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <!-- <el-table-column prop="regionName" label="省份" width="140"></el-table-column> -->
                  <el-table-column
                    prop="organizationName"
                    label="所属单位"
                  ></el-table-column>
                  <!--<el-table-column prop="count" label="关联摄像机组"></el-table-column>-->
                  <!-- <el-table-column prop="createDate" label="创建时间" ></el-table-column> -->
                  <!--<el-table-column prop="count" label="创建人"></el-table-column>-->
                  <el-table-column
                    label="状态"
                    align="center"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <!--<span v-if="scope.row.userStatus ==='0'">停用</span>
                    <span
                      v-else
                        >启用</span>-->
                      <i
                        class="el-icon-error text-danger"
                        style="font-size: 1.6rem"
                        v-if="scope.row.userStatus === '0'"
                      ></i>
                      <i
                        class="el-icon-success text-success"
                        style="font-size: 1.6rem"
                        v-else
                      ></i>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        effect="dark"
                        content="修改"
                        placement="top"
                      >
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
                      <el-tooltip
                        effect="dark"
                        content="查看详情"
                        placement="top"
                      >
                        <el-button
                          class="table-control-btn"
                          type="primary"
                          icon="el-icon-document"
                          size="mini"
                          @click="handleDetail(scope.row)"
                        >
                        </el-button>
                      </el-tooltip>
                      <el-tooltip
                        effect="dark"
                        content="修改密码"
                        placement="top"
                      >
                        <el-button
                          class="table-control-btn"
                          type="danger"
                          icon="el-icon-user"
                          size="mini"
                          @click="handlePwd(scope.row)"
                        ></el-button>
                      </el-tooltip>
                      <!-- <el-tooltip effect="dark" content="设置权限" placement="top">
                          <div style="display: inline-block;margin-left: 10px;">
                            <check-camera
                              ref="checkcamera"   ""
                              :editUser="scope.row"
                              :UserOrgTree="UserOrgTree"
                              @close-choose-cameras="afterChoosed"
                              >
                            </check-camera>
                          </div>
                        </el-tooltip> -->
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="table-pagination userInfo-t">
                <p class="total-pagination">
                  共{{ sysUser.sysUserTotal }}条
                </p>
                <!-- 分页 -->
                <el-pagination
                  background
                  layout=" prev, pager, next, sizes, jumper "
                  :total="sysUser.sysUserTotal"
                  :page-size="setSysUserPages"
                  :current-page="sysUserCurrentPage"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- 外部用户 -->
          <el-tab-pane
            label="外部用户"
            name="exterior"
            v-if="uinfo.regionCode == 410000 ? true : false"
          >
            <exterior-user></exterior-user>
          </el-tab-pane>
        </el-tabs>
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
          <el-form-item
            label="所属省"
            prop="regionCode"
            :rules="[
              { required: true, message: '所属省不能为空' }
            ]"
            v-if="uinfo.regionCode == 100000"
          >
            <el-select
              v-model="org.regionCode"
              placeholder="请选择"
              multiple
              :disabled="disabledRegionCode(org)"
            >
              <el-option
                v-for="item in provinces"
                :value-key="item.regionCode"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode + ''"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="上级单位"
            prop="parentOrgName"
          >
            <el-select
              filterable
              v-model="org.parentOrgName"
              disabled
            >
              <option value :key label></option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="组织名称"
            prop="orgName"
            :rules="[
              {
                required: true,
                message: '组织名称不能为空'
              }
            ]"
          >
            <el-input
              v-model="org.orgName"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="组织类型"
            prop="orgType"
            :rules="[
              {
                required: true,
                message: '组织类型不能为空'
              }
            ]"
          >
            <el-select
              v-model="org.orgType"
              :disabled="
                addDialog.newTitle != '新增' ? true : false
              "
            >
              <el-option
                v-for="item in options"
                :value-key="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="组织等级"
            prop="orgLevelType"
            :rules="[
              {
                required: true,
                message: '组织等级不能为空'
              }
            ]"
          >
            <el-select v-model="org.orgLevelType">
              <el-option
                v-for="item in levels"
                :value-key="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="联系人"
            prop="responsiblePerson"
          >
            <el-input
              v-model="org.responsiblePerson"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="org.phone"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateClose">取 消</el-button>
          <el-button type="primary" @click="UpdataOrg()"
            >确 定</el-button
          >
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
        <el-form
          v-if="addUserOrgVisable"
          :model="newDialog"
          label-width="100px"
          ref="addForm"
        >
          <el-form-item
            label="用户名:"
            prop="loginName"
            :rules="phoneName"
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
            :rules="[
              { required: true, message: '姓名不能为空' }
            ]"
          >
            <el-input
              v-model="newDialog.userName"
              maxlength="20"
              placeholder="请输入20字以内的姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机号:"
            prop="phoneNum"
            :rules="phoneNumber"
          >
            <el-input
              v-model="newDialog.phoneNum"
              type="phone"
              maxlength="11"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所属单位:"
            prop="organizationId"
            :rules="[
              {
                required: true,
                message: '所属单位不能为空'
              }
            ]"
          >
            <el-cascader
              :options="UserOrgTreeChild"
              v-model="newDialog.organizationId"
              :props="cascaderProps"
              :disabled="disableOrganizationId"
              clearable
              :show-all-levels="true"
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
            <el-select
              v-model="newDialog.roleCode"
              placeholder="请选择"
              class="roleSelect"
              multiple
            >
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
          <el-button @click="addColseDialog"
            >取 消</el-button
          >
          <el-button type="primary" @click="addDeiveGroup()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>

    <changPwd-dialog
      :visible.sync="dialogTableVisibles"
      v-if="dialogTableVisibles"
      :userId="userId"
      ref="cameraChangPwd"
    ></changPwd-dialog>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import api from '@/api'
import checkCamera from './checkCamera'
import exteriorUser from './exteriorUser/exteriorUser.vue'
import changPwdDialog from './systemRoleDialog/changPwd'

export default {
  name: 'systemUserOrganize',
  components: { checkCamera, exteriorUser, changPwdDialog },
  data() {
    //合法手机号验证
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const reg = /^1[3456789]\d{9}$/
      !reg.test(value)
        ? callback(new Error('请输入正确手机号'))
        : callback()
    }
    var loginNames = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号名不能为空'))
      } else {
        const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('账号名格式错误'))
        }
      }
    }
    return {
      uinfo: JSON.parse(
        localStorage.getItem('cloudplatform')
      ),
      dialogTableVisibles: false,
      showPagination: false,
      isAllHeight: 0,
      phoneNumber: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        { validator: checkMobile, trigger: 'blur' }
      ],
      phoneName: [
        {
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        },
        {
          required: true,
          validator: loginNames,
          trigger: 'blur'
        }
      ],
      titleh: {
        organizationId: '',
        UName: '',
        uStatus: '',
        loginUser: '',
        orgName: '',
        flag: true,
        selectManyProvince: true,
        parentId: 0
      },
      cascaderProps: {
        value: 'organizationId',
        label: 'organizationName',
        children: 'childList',
        checkStrictly: true,
        multiple: false
      },
      levels: [
        {
          value: '1',
          label: '一级'
        },

        {
          value: '2',
          label: '二级'
        },
        {
          value: '3',
          label: '三级'
        },
        {
          value: '4',
          label: '四级'
        },
        {
          value: '5',
          label: '五级'
        }
      ],
      options: [
        {
          value: 5,
          label: '业主单位'
        },

        {
          value: 10,
          label: '路公司'
        },
        {
          value: 20,
          label: '路段单位'
        },
        {
          value: 30,
          label: '收费站'
        },
        {
          value: 40,
          label: '服务区'
        },
        {
          value: 90,
          label: '其它'
        }
      ],
      addDialog: {
        newTitle: '',
        addProviceVisable: false,
        addProviceList: [],
        proviceName: [],
        firstUtil: [],
        orgainName: '',
        orgainType: []
      },
      addUserOrgVisable: false,
      addUserOrg: '',
      newDialog: {
        organizationName: [],
        loginName: '',
        userName: '',
        phoneNum: '',
        regionName: '',
        userStatus: '',
        roleName: [],
        roleCode: [],
        organizationId: '',
        // newOrganizationId:'',
        userId: '',
        roleIds: '',
        source: '1'
      },
      userList: [],
      userTableData: [],
      sysUserCurrentPage: 1,
      setSysUserPages: 10,
      org: {
        orgPid: 0,
        orgName: '',
        orgType: '',
        orgLevelType: '',
        regionCodes: [],
        addProviceList: [],
        proviceName: [],
        firstUtil: [],
        regionName: [],
        parentId: 0,
        parentOrgName: '',
        organizationId: '',
        regionCode: [],
        phone: '',
        responsiblePerson: ''
      },
      userIdArr: [],
      orgProviceList: [],
      userSelList: [],
      orgUserList: [],
      idArr: [],
      organizationId: '',
      areadyChoosedCameras: false,
      activeName: 'organization' // 组织用户与外部用户tabs
    }
  },
  computed: {
    ...mapState([
      'UserOrgTree',
      'sysUser',
      'setSysUserList',
      'roleList',
      'orgTreeData',
      'provinces',
      'UserOrgTreeChild'
    ]),
    disableOrganizationId() {
      return (
        this.addUserOrg === '修改' ||
        this.areadyChoosedCameras
      )
    }
  },
  created() {
    this.getUserOrganization().then(() => {
      this.UserOrgTree.forEach(item => {
        this.idArr.push(item.organizationId)
      })
      window.localStorage.setItem('orgId', this.idArr)
    })
  },
  mounted() {
    this.getUserListData()
    // this.getRoleList();
    this.getRoleListData()
    console.log(this.getRoleList(), 'this.getRoleList()')
    window.addEventListener(
      'scroll',
      this.handleScroll,
      true
    )
    1 > 2 &&
      this.$nextTick(() => {
        let width = document
          .querySelector('.centent-r')
          .getBoundingClientRect().width
      })
  },
  destroyed() {
    window.removeEventListener(
      'scroll',
      this.handleScroll,
      true
    )
  },
  methods: {
    ...mapActions([
      'getSysUserList',
      'getUserOrganization',
      'getRoleList'
    ]),
    afterChoosed(flag) {
      this.areadyChoosedCameras = flag
    },

    getRoleListData() {
      const obj = {
        pageSize: 0
      }
      console.log(obj, '搜索列表2222')
      this.getRoleList(obj).then(res => {
        this.roleTotal = res[1].total
      })
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
        this.addDialog.newTitle != '新增'
          ? false
          : data.parentId == 0
          ? false
          : true
      let b = this.org.orgType !== 5
      return a || b
    },
    // 监听滚动事件
    handleScroll() {
      let scrollTop = this.$refs.viewbox.getBoundingClientRect()
        .top
      if (scrollTop) {
        this.showPagination = true
        return
      }
      this.showPagination = false
    },
    // 获取用户列表
    getUserListData() {
      this.getSysUserList({
        pageSize: this.setSysUserPages,
        currPage: this.sysUserCurrentPage,
        loginName: this.titleh.loginUser,
        organizationId: this.titleh.organizationId,
        userName: this.titleh.UName,
        userStatus: this.titleh.uStatus
      })
      console.log(this.getSysUserList, 'ssssss')
    },
    // 新增用户
    addUserOrgInfo() {
      this.addUserOrgVisable = true
      this.addUserOrg = '新增'
      this.$nextTick(() => {
        this.newDialog.userStatus = '1'
      })
    },

    // 所属单位
    parentsCateChanged(val) {
      if (val) {
        this.organizationId = val[val.length - 1]
        // this.newDialog.organizationId = this.organizationId;
        console.log(this.organizationId)
      }
    },
    closeHandleChange(visible) {
      if (!visible) {
        this.newDialog.organizationId = this.organizationId
        console.log(
          'close=====' + this.newDialog.organizationId
        )
      }
    },
    // 导出用户列表
    exportUserList() {
      console.log(this.titleh)
      let parmas = {
        userIds: this.titleh.userIds,
        loginName: this.titleh.loginUser,
        organizationId: this.titleh.organizationId,
        userName: this.titleh.UName,
        userStatus: this.titleh.uStatus,
        userIds: this.userSelList
      }
      // console.log('---------------参数'+parmas);
      this.$api
        .exportOrgUser(parmas)
        .then(res => {
          // console.log(res, "sddsdsd");
          var blob = new Blob([res], {
            type: 'application/vnd.ms-excel'
          }) // type这里表示xlsx类型
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = '组织用户信息.xls' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
        .catch(error => {
          v.$message({
            message: '表格导出失败! ',
            type: 'error'
          })
        })
    },
    // 批量处理
    getuserSelect(val) {
      this.userSelList = val.map(item => {
        return item.userId
      })
    },
    handleSelectionChange(val) {
      this.userSelList = val.map(item => {
        return item.userId
      })
    },
    // 启用
    cameraStart() {
      if (!this.userSelList.length) {
        this.$message.info({
          message: '请选择要启用的项！！',
          type: 'info'
        })
        return false
      } else {
        let parmas = {
          status: 1,
          userIds: this.userSelList,
          instructions: {
            module: '系统管理',
            page: '组织与用户',
            feature: '启用',
            description:
              '批量启用' +
              this.userSelList.length +
              '个用户'
          }
        }
        this.$confirm('提示', {
          title: '提示',
          message: '确认启用吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(res => {
          api.updateMoreModifyStatus(parmas).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: '状态修改成功',
                type: 'success'
              })
              this.query()
            }
          })
        })
      }
    },
    // 停用
    cameraStop() {
      if (!this.userSelList.length) {
        this.$message.info({
          message: '请选择要停用的项！！',
          type: 'info'
        })
        return false
      } else {
        this.$confirm('提示', {
          title: '提示',
          message: '确认停用吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(res => {
          let parmas = {
            status: 0,
            userIds: this.userSelList,
            instructions: {
              module: '系统管理',
              page: '组织与用户',
              feature: '停用',
              description:
                '批量停用' +
                this.userSelList.length +
                '个用户'
            }
          }
          api.updateMoreModifyStatus(parmas).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: '状态修改成功',
                type: 'success'
              })
              this.query()
            }
          })
        })
      }
    },
    // 删除
    delCamera() {
      if (!this.userSelList.length) {
        this.$message.info({
          message: '请选择要删除的项',
          type: 'info'
        })
        return false
      }
      this.$confirm('提示', {
        title: '提示',
        message: '确认删除吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => {
        api
          .delMoreUser({ userIds: this.userSelList })
          .then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: '已删除',
                type: 'success'
              })
              this.query()
            }
          })
      })
    },
    // 用户分页处理
    handleSizeChange(sizeVal) {
      this.setSysUserPages = sizeVal
      this.getUserListData()
    },
    handleCurrentChange(curPage) {
      this.sysUserCurrentPage = curPage
      this.getUserListData()
    },
    // 查询列表数据
    handleTreenode(val, node, isSelf) {
      this.titleh.organizationId = val.organizationId
      this.titleh.orgName = val.organizationName
      this.titleh.flag = val.updateAndDel
      this.titleh.selectManyProvince =
        val.selectManyProvince
      this.titleh.parentId = val.parentOrganizationId
      this.newDialog.organizationId = val.organizationId
      this.$nextTick(() => {
        this.newDialog.organizationName = [
          val.organizationName
        ]
      })
      console.log(
        this.titleh.parentId,
        this.titleh.organizationId
      )
      this.query()
    },
    // 搜索
    query() {
      this.getUserListData()
    },
    // 重置
    handleReset() {
      this.sysUserCurrentPage = 1
      this.titleh.uStatus = ''
      this.titleh.loginUser = ''
      this.titleh.UName = ''
      this.titleh.organizationId = ''
      this.titleh.orgName = ''
      this.query()
    },
    // 选择状态
    changeState(val) {},

    addDeiveGroup() {
      this.$refs.addForm.validate().then(res => {
        if (this.addUserOrg == '修改') {
          let params = {
            loginName: this.newDialog.loginName,
            organizationId: this.newDialog.organizationId,
            phoneNumber: this.newDialog.phoneNum,
            roleCodes: this.newDialog.roleCode, //关联用户id
            // status: this.newDialog.userStatus,
            status: parseInt(this.newDialog.userStatus),
            userName: this.newDialog.userName,
            userId: this.newDialog.userId
          }
          api.updateUserInfo(params).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: '修改成功',
                type: 'success'
              })
              this.query()
              this.newDialog = {
                loginName: '',
                userName: '',
                phoneNum: '',
                regionName: '',
                userStatus: '',
                roleName: []
              }
            } else {
              this.$message.error({
                message: res.message,
                type: 'error'
              })
            }
          })
          this.addUserOrgVisable = false
        } else {
          let params = {
            loginName: this.newDialog.loginName,
            organizationId: this.newDialog.organizationId,
            phoneNumber: this.newDialog.phoneNum,
            roleCodes: this.newDialog.roleCode, //关联用户id
            status: this.newDialog.userStatus,
            userName: this.newDialog.userName,
            regionCode: JSON.parse(
              localStorage.getItem('cloudplatform')
            ).regionCode
          }
          api.addOrgUser(params).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message:
                  '新增用户成功！密码：' +
                  res.data.password +
                  ' ，1分钟后弹窗关闭，请尽早修改密码！',
                type: 'success',
                duration: 10000
              })
              this.query()
              this.addUserOrgVisable = false
              this.newDialog = {
                loginName: '',
                userName: '',
                phoneNum: '',
                regionName: '',
                userStatus: '',
                roleName: []
              }
            } else {
              this.$message.error({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    addColseDialog() {
      this.addUserOrgVisable = false
      if (this.addUserOrg == '修改') {
        this.newDialog.loginName = ''
        this.newDialog.userName = ''
        this.newDialog.phoneNum = ''
        this.newDialog.regionName = ''
        this.newDialog.userStatus = ''
        this.newDialog.roleName = []
        this.newDialog.roleCode = ''
        this.newDialog.organizationId = ''
        console.log(this.newDialog)
      }
    },
    // 修改用户信息
    handleEdit(editFormData) {
      console.log(editFormData, 'saas')
      //
      this.addUserOrg = '修改'
      this.$nextTick(() => {
        // 记住旧的登录名，用于查重
        // this.oldUserAccount = editFormData.loginName;
        //this.$refs.addUserFormRef.resetFields();
        this.newDialog = JSON.parse(
          JSON.stringify(editFormData)
        )
        let str = editFormData.roleName,
          code = editFormData.roleCode
        this.newDialog.roleName = str ? str.split(',') : []
        this.newDialog.roleCode = code
          ? code.split(',')
          : []
        this.newDialog.organizationName = [
          editFormData.organizationName
        ]
        this.addUserOrgVisable = true
      })
    },
    // 查看组织用户详情
    handleDetail(row) {
      console.log(row, '用户详情数据')
      this.userDetailInfo = row
      this.$router.push({
        path: '/systemOrgainUserDetail',
        query: row
      })
    },
    handlePwd(row) {
      this.dialogTableVisibles = true
      this.userId = row.userId
    },
    // 新增组织
    appendOrg(data) {
      // ;
      console.log(data, '新增组织')
      this.addDialog.newTitle = '新增'
      this.addDialog.addProviceVisable = true
      this.org = {
        regionName: [data.regionName], //所属区域
        regionCode: [data.regionCode],
        parentId: data.parentOrganizationId,
        organizationId: data.organizationId,
        organizationName: data.organizationName,
        parentOrgName:
          this.titleh.parentId == 9901
            ? '交通运输部'
            : data.organizationName,
        regionCode: data.regionCode
          ? [data.regionCode.toString()]
          : []
      }
    },
    // 修改组织
    UpdateOrg(node, data) {
      console.log(data, '修改组织')
      this.addDialog.newTitle = '修改'
      this.addDialog.addProviceVisable = true
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
      }
      console.log(this.org.regionCode)
      this.orgProviceList = [
        {
          regionName: data.regionName,
          regionCodes: data.regionCode
        }
      ]
      console.log(this.org.parentId)
    },
    // 取消
    updateClose() {
      this.addDialog.addProviceVisable = false
      this.org.orgName = ''
      this.org.orgType = ''
    },
    UpdataOrg() {
      if (this.addDialog.newTitle == '修改') {
        let parmas = {
          organizationName: this.org.orgName,
          phone: this.org.phone,
          responsiblePerson: this.org.responsiblePerson,
          regionCodes: this.org.regionCode
        }
        this.$refs.org.validate(valid => {
          if (valid) {
            api
              .updateUserOrganization(
                this.org.orgPid,
                parmas
              )
              .then(res => {
                if (res.code == 200) {
                  this.$message.success({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.org.orgName = ''
                  this.org.orgType = ''
                  this.getUserOrganization().then(() => {
                    this.idArr = this.getExtendIds(
                      this.org.parentId,
                      this.orgTreeData
                    )
                    window.localStorage.setItem(
                      'orgId',
                      this.idArr
                    )
                  })
                } else {
                  this.$message.success({
                    message: res.message,
                    type: 'error'
                  })
                }
                this.addDialog.addProviceVisable = false
              })
          }
        })
      } else {
        let parmas = {
          organizationName: this.org.orgName,
          organizationType: this.org.orgType,
          parentOrganizationId:
            this.org.parentId == 9901
              ? 9901
              : this.org.organizationId,
          // parentId: this.org.parentId,
          phone: this.org.phone,
          responsiblePerson: this.org.responsiblePerson,
          regionCodes: this.org.regionCode,
          organizationLevel: this.org.orgLevelType
        }
        this.$refs.org.validate(valid => {
          if (valid) {
            api.AddOrganizationList(parmas).then(res => {
              if (res.code == 200) {
                this.$message.success({
                  message: '新增成功',
                  type: 'success'
                })
                this.org.orgName = ''
                this.org.orgType = ''
                // if(parmas.parentId)
                let vm = this
                this.getUserOrganization().then(() => {
                  vm.idArr = vm.getExtendIds(
                    vm.org.parentId,
                    vm.orgTreeData
                  )
                  window.localStorage.setItem(
                    'orgId',
                    vm.idArr
                  )
                })
              } else {
                this.$message.success({
                  message: res.message,
                  type: 'error'
                })
              }
              this.addDialog.addProviceVisable = false
            })
          }
        })
      }
    },
    // 删除组织
    removeOrg(node, data) {
      this.$confirm('提示', {
        title: '提示',
        message: '确认删除吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => {
        let params = {
          regionCode: data.regionCode,
          isConfirm: false
        }
        api
          .delUserOrganization(data.organizationId, params)
          .then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: '已删除',
                type: 'success'
              })
              this.getUserOrganization().then(() => {
                this.idArr = this.getExtendIds(
                  data.parentOrganizationId,
                  this.orgTreeData
                )
                window.localStorage.setItem(
                  'orgId',
                  this.idArr
                )
              })
            } else if (res.code == 4007) {
              this.$confirm('提示', {
                title: '提示',
                message: `${res.message}`,
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(res => {
                let params = {
                  regionCode: data.regionCode,
                  isConfirm: true
                }
                api
                  .delUserOrganization(
                    data.organizationId,
                    params
                  )
                  .then(res => {
                    this.$message.success({
                      message: res.message,
                      type: 'info'
                    })
                    this.getUserOrganization().then(() => {
                      this.idArr = this.getExtendIds(
                        data.parentOrganizationId,
                        this.orgTreeData
                      )
                      window.localStorage.setItem(
                        'orgId',
                        this.idArr
                      )
                    })
                  })
              })
            } else {
              this.$message.success({
                message: res.message,
                type: 'info'
              })
            }
          })
      })
    },
    getExtendIds(id, list) {
      let arr = []
      _.each(list, it => {
        if (it.organizationId === id) {
          arr = arr.concat([it.organizationId])
        } else {
          if (it.childList && it.childList.length) {
            arr = arr.concat(
              this.getExtendIds(id, it.childList)
            )
          }
        }
      })
      return arr
    }
  }
}
</script>
<style
  lang="less"
  src="../../css/userOrganize.less"
  scoped
></style>
