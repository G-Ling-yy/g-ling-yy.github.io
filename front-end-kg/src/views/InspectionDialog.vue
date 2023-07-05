<template>
  <div class="content-wrapper spt-monitor-manage xcbg" ref="viewbox" >
    <div class="titleHeader" >
      <button class="btn-back" @click="handleBack"><img src="../assets/images/yuanImg/goback.png" />退出</button>
        <div class="titleRight">
          <el-radio-group v-model="screenRadio" @change="screenRadioChange">
            <el-radio :label="4"><img src="../assets/images/yuanImg/4fen.png" /></el-radio>
            <el-radio :label="6"><img src="../assets/images/yuanImg/6fen.png" /></el-radio>
            <el-radio :label="9"><img src="../assets/images/yuanImg/8fen.png" /></el-radio>
            <el-radio :label="12"><img src="../assets/images/yuanImg/12fen.png" /></el-radio>
            <!-- <el-radio :label="16"><img src="../assets/images/yuanImg/4fen.png" /></el-radio> -->
          </el-radio-group>
        <el-tooltip class="item" effect="dark" content="投屏" placement="top-start">
          <i class="el-icon-full-screen icon-full-screen" @click="clickProjection"></i>
        </el-tooltip>
          <el-button style="cursor: pointer;" type="primary" size="mini" @click="touchPreservationPlan">存为预案</el-button> 
        </div>
    </div>
    <div class="organize-content ">
      <el-card class="box-card centent-l ">
        <div slot="header" class="clearfix ">
          <!-- <szh-tree
            :drag="true"S
            @after-drop="afterDrop"
            @on-click="clickScreenshot"
          ></szh-tree> -->
          <!-- 左侧tabs区域 -->
          <inspection-tree @on-click="treenodePlay" ></inspection-tree>
        </div>

        <div class="planManagement" @click="drawer = true" type="primary">
          预案管理
        </div>
        <div class="planManagementBox">
          <el-drawer
            :wrapperClosable="true"
            :show-close="false"
            :modal="false"
            :visible.sync="drawer"
            :direction="direction"
            :size="'50%'"
          >
          <!-- 新增预案 -->
            <p class="AddPlanManagement" >
              <span @click="add">新增预案</span>
              <span @click="close"><i class="el-icon-document"></i></span>
            </p>
            <!-- <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="80px"
              class="demo-ruleForm"
              v-show="show"
            >
              <el-form-item label="预案名称" prop="name">
                <el-input
                  v-model="ruleForm.planName"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="选择设备">
                <img style="width:20px;height:20px; cursor: pointer"
                     src="../assets/images/xuncha/xunchaAdd.png"
                      @click="selectEquip('add')"
                      /> -->
              <!-- <div class="select-box2">
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
            </div> -->
          <!-- </el-form-item> -->
              <!-- <el-form-item label="选择组" prop="deviceList">
                <el-select
                  v-model="ruleForm.groupIds "
                  multiple
                  placeholder="请选择活动区域"
                >
                <el-option
                    v-for="item in deviceGroupList"
                    :key="item.groupId"
                    :label="item.groupName"
                    :value="item.groupId"
                ></el-option>
                </el-select>
                <span class="addGroup" @click="addGroup"><img style="width:20px;height:20px" src="../assets/images/xuncha/xunchaAdd.png" /></span>
              </el-form-item> -->
              <!-- <el-form-item label="轮巡间隔" prop="region">
                <el-select
                  v-model="ruleForm.timeInterval"
                  placeholder="请选择轮巡间隔"
                >
                  <el-option label="15s" value="15s"></el-option>
                  <el-option label="30s" value="30s"></el-option>
                  <el-option label="60s" value="60s"></el-option>
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item>
                <el-button
                  size="mini"
                  type="primary"
                  @click="submitForm('ruleForm')"
                  >保存</el-button
                >
                <el-button size="mini" @click="remove('ruleForm')" class="remove"
                  >取消</el-button
                >
              </el-form-item> -->
            <!-- </el-form> -->
            <!-- 预案列表 -->
            <el-collapse accordion >
              <el-collapse-item
                v-for="(item, index) in planList"
                :key="index"
                v-loading="planLoading[index]"
              >
                <template slot="title">
                  <div class="cameras-detail" @click="getCamerasDetailList(item, index)" >
                  <span style="width:50%">
                  <i class="el-icon-document"></i>{{item.planName}}
                  </span>
                  <span class="el-icon-sum">
                    <i></i>{{item.cameraCount}}
                    <i></i>{{item.groupCount}}
                    <i></i>{{item.timeInterval}}
                  </span>
                 <span class="operation" @click.stop="" >
                   <el-dropdown trigger="click" size="mini" :split-button='true' type="primary">
                     <!-- <i class="el-icon-s-tools"></i> -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item >
                          <span @click="execute(item)">执行</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <span  @click="editPlan(item)">编辑</span>
                        </el-dropdown-item>
                        <el-dropdown-item >
                         <span @click="delPlan(item)">删除</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                 </span>
                </div>
                </template>
                <!-- 摄像机列表 -->
                <div class="focusGroup"
                  v-for="(item, index) in camerasByPlan"
                  :key="index"
                >
                    {{item.cameraDisplayName}}
                    <span>
                      <i class="el-icon-close" @click="delPlanCamera(item)"></i>
                      <i class="el-icon-upload2" @click="modifyCameraOrder(item,index, 1)"></i>
                      <i class="el-icon-download" @click="modifyCameraOrder(item,index, 2)"></i>
                    </span>
                </div>
                <!-- 分组列表 -->
                <!-- <el-collapse accordion>
                 <el-collapse-item
                    v-for="(item, i) in groupsByPlan"
                    :key="i"
                    v-loading="groupsLoading[i]"
                >
                <template slot="title">
                  <span style="width:70%"
                    @click="getCamerasGroupDetailList(item, i)" 
                  >
                  <i class="el-icon-document"></i>{{item.groupName}} ({{item.cameraCount}})
                  </span>
                </template> -->
                  <!-- 组下的摄像机 -->
                    <!-- <div class="focusGroup"
                      v-for="(item, index) in camerasgroupByPlan"
                      :key="index"
                    >
                      {{item.cameraName}}
                    <span>
                    </span>
                </div>
                </el-collapse-item>
              </el-collapse> -->
              </el-collapse-item>


              
              <!-- <el-collapse-item title="反馈 Feedback">
                <template slot="title">
                  <i class="el-icon-document"></i>我所关注的
                </template>
                <div>1</div>
                <div>2</div>
              </el-collapse-item> -->
            </el-collapse>
          </el-drawer>
        </div>

      </el-card>
      <split-screen ref="splitScreen"  type='inspection' :size="screenRadio" style="padding-bottom:4%"></split-screen>
    </div>

    <el-dialog :visible.sync="groupDialog" width="30%">
      <el-form
        :model="addGroupForm"
        :rules="rules"
        ref="addGroupForm"
        label-width="80px"
        class="demo-addGroupForm"
      >
        <el-form-item label="组名称" prop="name">
          <el-input
            v-model="addGroupForm.name"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="摄像机">
          <img
            src="../assets/images/equipment/add.png"
            style="cursor: pointer"
          />
          已选{{4}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupDialog = false">保存</el-button>
        <el-button type="primary" @click="groupDialog = false">取消</el-button>
      </span>
    </el-dialog>
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
      <SelectEquipment
        ref="selectEquipments"
        :equipmentInfo="equipmentInfo"
        type="InspectionDialog"
      ></SelectEquipment>
    </el-dialog> -->
    <!-- 选择预案摄像机 -->
      <check-plan
          ref="checkplan"
          :dataList="ruleFormPlan"
          :UserOrgTree="orgTreeList"
      ></check-plan>
    <!--预案弹窗-->
    <el-dialog
      :title="title"
      :visible.sync="modifyPlan"
      custom-class=" device-group-dialog"
      width="400px"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="planClose"
    >         
              <div class="edit-plan">
                <span class="edit-plan-title">预案名称 </span>
                <el-input
                  v-model="ruleFormPlan.planName"
                  maxlength="20"
                  show-word-limit
                  ></el-input>
              </div>
                <!-- <div class="edit-plan">
                    <span class="edit-plan-title">选择设备 </span>
                    <span class="addGroup edit-plan-title">
                    <img 
                      style="width:20px;height:20px;cursor: pointer;"
                      src="../assets/images/xuncha/xunchaAdd.png"
                      @click="selectEquip('edit')" />
                    </span>
                </div>
                <div class="edit-plan">
                    <span class="edit-plan-title">选择组 </span>
                  <el-select
                    v-model="ruleFormPlan.groupIds "
                    multiple
                    placeholder="请选择活动区域"
                  >
                  <el-option
                    v-for="item in deviceGroupList"
                    :key="item.groupId"
                    :label="item.groupName"
                    :value="item.groupId"
                  ></el-option>
                  </el-select>
                  <span class="addGroup edit-plan-title edit-plan-img" @click="addGroup"><img style="width:20px;height:20px" src="../assets/images/xuncha/xunchaAdd.png" /></span>
                </div> -->
                <div class="edit-plan">
                  <span class="edit-plan-title">轮巡间隔</span>
                  <el-select
                  v-model="ruleFormPlan.timeInterval"
                  placeholder="请选择轮巡间隔"
                >
                  <el-option label="15s" value="15s"></el-option>
                  <el-option label="30s" value="30s"></el-option>
                  <el-option label="60s" value="60s"></el-option>
                </el-select>
                </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="planClose">取 消</el-button>
        <el-button type="primary" @click="savePlan()">{{saveBut}}</el-button>
      </div>
    </el-dialog>
    <!-- 预案存储 -->
    <el-dialog
      :visible.sync="preservationDialog"
      custom-class=" device-group-dialog"
      width="400px"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="preservationClose"
    >         
              <div class="edit-plan">
                <span class="edit-plan-title">预案名称 </span>
                <el-input
                  v-model="preservationPlan.planName"
                  maxlength="20"
                  show-word-limit
                  ></el-input>
              </div>
                <div class="edit-plan">
                  <span class="edit-plan-title">轮巡间隔</span>
                  <el-select
                  v-model="preservationPlan.timeInterval"
                  placeholder="请选择轮巡间隔"
                >
                  <el-option label="15s" value="15s"></el-option>
                  <el-option label="30s" value="30s"></el-option>
                  <el-option label="60s" value="60s"></el-option>
                </el-select>
                </div>

          <div slot="footer" class="dialog-footer">
            <el-button @click="preservationClose">取 消</el-button>
            <el-button type="primary" @click="clickPreservationPlan()">保 存</el-button>
          </div>
        </el-dialog>
    <!-- 选择设备 -->
    <el-dialog
      :title="selectTitle"
      :visible.sync="selectCameraId"
      width="300px"
      top="15vh"
      :modal-append-to-body="false"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="cameraId-dialog h-dialog"
      >
       <div class="edit-plan-camera">
            <!-- <span class="addGroup edit-plan-img"> -->
              <img 
              class="edit-plan-img"
                src="../assets/images/xuncha/xunchaAdd.png"
                @click="selectEquip()" />
                <p>已选：{{count}}</p>
            <!-- </span> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
import checkCamera from "../components/module/SystemRole/checkCamera";
import splitScreen from "../components/module/spt/splitScreen";
// import szhTree from "../components/module/spt/szhTree";
import inspectionTree from "./sjk/inspectionTree";
// import SelectEquipment from "../components/equipment/selectEquipment";
import checkPlan from "./checkPlan/index";
export default {
  name: "InspectionDialog",
  components: { checkCamera, inspectionTree, splitScreen, checkPlan },
  data() {
    return {
      equipmentInfo: {
        planId: ''
      },
      // selectEquipData: {
      //   table: [],
      //   currpage: 1,
      //   pageSize: 10,
      //   total: 0
      // },
      // checkData: [],// 已选择的数据
      screenRadio:4,
      addGroupForm: {},
      // ruleForm: {
      //   planName: "", // 预案名称
      //   groupIds : [], // 摄像机组id 
      //   timeInterval: '' // 轮询间隔
      // },
      // 预案弹窗
      type: 'add',
      title: '创建预案',
      saveBut: '创建',
      modifyPlan: false, // 预案编辑
      ruleFormPlan: {
        planName: "", // 预案名称
        // groupIds : [], // 摄像机组id 
        // cameraIds: [], // 摄像机id
        timeInterval: '', // 轮询间隔
        planId: '' // 预案id
      },
      preservationDialog: false, // 存储预案弹窗
       preservationPlan: {
        planName: "", // 预案名称
        // groupIds : [], // 摄像机组id 
        cameraIds: [], // 摄像机id
        timeInterval: '', // 轮询间隔
      },
      selectCameraId: false, // 选择的摄像机
      selectTitle: '选择摄像机',
      count: 0, // 统计已选
      orgTreeList: [],
      // deviceGroupList: [], // 摄像机组数据列表
      planList: [], // 预案列表
      camerasByPlan: [], //根据预案id查询摄像机
      camerasByPlanId: '',//预案摄像机id
      // groupsByPlan: [], //根据预案id查询分组PlanId
      // camerasgroupByPlan: [], // 预案摄像机组摄像机列表
      planLoading: [], 
      // groupsLoading: [],
      rules: {
        // name: [
        //   { required: true, message: '预案名称', trigger: 'blur' },
        //   { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
        // ],
        // region: [
        //   { required: true, message: '请选择活动区域', trigger: 'change' }
        // ],
      },
      // selectEquipment:false, // 选择设备弹窗
      groupDialog: false,
      // show: false,
      direction: "btt",
      drawer: false,
      loading: true,
      videoData: "",
      searchInfo: {
        selectDate: ""
      },
      tableData: [],
      videoss: "",
      activeName: "first",
      showPagination: false,
      titleh: {
        organizationId: "",
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
      sysVideoTotal: 0,
      sysUserCurrentPage: 1,
      sysUserCurrentPage: 10,
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
      postData: {
        currPage: 1,
        pageSize: 5,
        cameraNum: "",
        saveTime: "",
        confirmTime: "",
        saveUserName: ""
      },

      orgProviceList: [],
      userSelList: [],
      orgUserList: [],
      idArr: [],
      organizationId: "",
      choosedVideo: [],
      cameraNum: "",
      dropCamera: null,
      playCameraNum: [], // 轮询的摄像机
      timer: '', // 轮询定时器
      cameraNumArr: [],
    };
  },
  computed: {
    ...mapState([
      "UserOrgTreeChild",
      "UserOrgTree",
      "sysUser",
      "setSysUserList",
      "roleList",
      "orgTreeData",
      "provinces"
    ])
  },
  created() {
    this.getCameraList();
    this.getPlanList()
    this.queryOrgList ()
  },
  mounted() {
    this.getCameraList();
    this.getPlanList()
    this.queryOrgList ()
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
    clearInterval(this.timer)
  },
  methods: {
    ...mapActions([
        "getSysUserList", 
        "getRoleList",
        "getUserOrganization"
      ]),
    //查询摄像机录像列表
    getCameraList() {
      // this.$api.getCamera(this.postData).then(res => {
      //   if (res.code == 200) {
      //     this.sysVideoTotal = res.total;
      //     let devs = [];
      //     _.each(res.data, it => {
      //       devs.push(this.$api.videoPlayRecord(it.recordId));
      //     });
      //     Promise.all(devs).then(res1 => {
      //       this.tableData = _.map(res.data, (it, index) => {
      //         it.playUrl = res1[index].data;
      //         return it;
      //       });
      //     });
      //   } else {
      //     this.$message.error(res.message);
      //   }
      // });
    },
    //返回上一页
    handleBack() {
      this.$router.go(-1);
    },
    // 分屏change事件
    screenRadioChange () {
      clearInterval(this.timer)
      this.$refs.splitScreen.setCameraList([])
    },
    // 保存预案弹窗
    touchPreservationPlan () {
      let cameraIdSum = this.$refs.splitScreen.cameraList
      if (!cameraIdSum.length) {
        this.$message.warning('请先添加摄像机！')
        return false
      }
      this.preservationPlan.cameraIds = []
      this.preservationDialog = true
      cameraIdSum.map(item => {
        this.preservationPlan.cameraIds.push(item.cameraId)
      })
      console.log('打开预案',this.$refs.splitScreen.cameraList)
    },
    // 全屏
    clickProjection () {
      this.$refs.splitScreen.clickProjection()
    },
    //存储预案
    clickPreservationPlan () {
      console.log('保存预案', this.preservationPlan)
      let obj = this.preservationPlan
            obj.organizationId  =  JSON.parse(localStorage.getItem("cloudplatform")).organizationId
            obj.status = '1'
            obj.groupIds = []
       this.$api
        .addPlan (obj)
        .then(res => {
          console.log('存储预案参数',res.data)
          if(res.code === 200) {
            this.$message.success('存为预案完成')
            this.preservationClose()
            this.getPlanList()
          }
        })
    },
    //关闭保存预案对话框
    preservationClose () {
      this.preservationDialog = false
      this.preservationPlan.planName = ''
      this.preservationPlan.cameraIds = []
      this.preservationPlan.timeInterval = ''
    },
      /**
     * 获取摄像机组列表
     */
    // getDeviceList() {
    //   this.$api
    //     .getDeviceGroupList()
    //     .then(res => {
    //       console.log('参数',res.data)
    //       this.deviceGroupList = res.data;
    //     });
    // },
     // 获取组织架构树
    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree(params)
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data;
          // _.each(nlist, it => {
          //   it.disabled = true;
          // });
          _this.orgTreeList = nlist;
        })
        // .catch((error) => {
        //   v.$message({
        //     message:
        //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
        //     type: "error",
        //   });
        // });
    },

    clickScreenshot(item) {
      this.postData.cameraNum = item.cameraNum;
      this.getCameraList();
    },

    handleClick(tab, event) {
      // console.log(tab, event);
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

    // 导出用户列表
    exportVideoList() {
      _.each(this.choosedVideo, it => {
        this.downVideo(it);
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

    chooseData(checked, video) {
      if (checked) {
        this.choosedVideo.push(video);
      } else {
        this.choosedVideo = this.choosedVideo.filter(it => {
          return it.recordId !== video.recordId;
        });
      }
    },
    // 删除
    delCamera() {
      // if (!this.tableData.length) {
      //   console.log(this.tableData.length)
      //   this.$message.info({
      //     message: "请选择要删除的项",
      //     type: "info"
      //   });
      //   return false;
      // }
      this.$confirm("提示", {
        title: "提示",
        message: "确认删除吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(res => {
        let ids = _.map(this.choosedVideo, it => it.recordId);
        api.delCamera(ids).then(res => {
          if (res.code == 200) {
            this.$message.success({
              message: "已删除",
              type: "success"
            });
            this.getCameraList();
          }
        });
      });
    },
    // 用户分页处理
    handleSizeChange(sizeVal) {
      this.setSysVideoPages = sizeVal;
      this.getCameraList();
    },
    handleCurrentChange(curPage) {
      this.transcodingCurrentPage = 1;
      this.setSysVideoPages = curPage;
      this.getCameraList();
    },

    // 搜索
    query() {
      this.postData.saveTime = this.searchInfo.selectDate[0]; //开始时间
      this.postData.confirmTime = this.searchInfo.selectDate[1]; //结束时间
      console.log(
        "开始" + this.postData.saveTime + "结束" + this.postData.confirmTime
      );
      this.getCameraList();
    },
    // 重置
    handleReset() {
      this.postData.saveTime = "";
      this.postData.confirmTime = "";
      this.searchInfo.selectDate = "";
      this.postData.cameraNum = "";
      this.getCameraList();
    },
    // 查看更多

    downVideo(item) {
      this.$http
        .get(item.playUrl, {
          responseType: "blob"
        })
        .then(res => {
          var href = window.URL.createObjectURL(res.data); // 创建下载的链接
          var downloadElement = document.createElement("a");
          downloadElement.href = href;
          downloadElement.download = item.confirmTime; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href);
        });
    },
    afterDrop(node) {
      this.dropCamera = node;
    },
    //关闭
    close() {
      this.drawer = false;
    },
    // //取消保存
    // remove() {
    //   this.show = false;
    // },
    //新增预案
    add() {
      this.type = 'add'
      this.title = '创建预案'
      this.saveBut = '创 建'
      this.modifyPlan = true;
      // this.checkData = []
      // this.getDeviceList()
    },
    // 选择设备
    selectEquip(type) {
      this.$refs.checkplan.setDataPermission()
      this.selectCameraId = false
      // if (type === 'add') {
      //   this.equipmentInfo.planId = ''
      //   this.selectEquipment = true;
      //   this.getUserOrganization();
      //   setTimeout(() => {
      //     this.$refs.selectEquipments.currpage=1;
      //     this.$refs.selectEquipments.pagesize=10;
      //     this.$refs.selectEquipments.getTableData();
      //   }, 5);
      // }
      //  if (type === 'edit') {
      //   this.equipmentInfo.planId = this.ruleFormPlan.planId
      //   this.selectEquipment = true;
      //   this.getUserOrganization();
      //   setTimeout(() => {
      //     this.$refs.selectEquipments.currpage=1;
      //     this.$refs.selectEquipments.pagesize=10;
      //     this.$refs.selectEquipments.getTableData();
      //   }, 5);
      // } 
    },
    // 新增预案事件
    // submitForm () {
    //   console.log ('选择的摄像机新增', this.checkData)
    //   let cameraIds = this.checkData.map(item => {
    //         return item.cameraId;
    //       });
    //    let obj = this.ruleForm
    //    obj.organizationId  =  JSON.parse(localStorage.getItem("cloudplatform")).organizationId
    //    obj.status = '1'
    //    obj.cameraIds = cameraIds

    //    this.$api
    //     .addPlan (obj)
    //     .then(res => {
    //       console.log('新增接口参数',res.data)
    //       if (res.data) {
    //         this.show = false;
    //         this.$message.success(res.data)
    //         this.checkData = []
    //       }
          
    //     })
    // },
    // 预案列表
    getPlanList () {
      console.log('新增接口参数预案列表123')
       this.$api
        .getPlanList()
        .then(res => {
          console.log('新增接口参数预案列表',res.data)
          this.planList = res.data
        })
    },
    
     // 预案删除
      delPlan (val) {
        let params ={
          planId: val.planId
        }
         this.$confirm("提示", {
            title: "提示",
            message: "确定删除预案吗？",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
      }).then(() => {
        this.$api
            .delPlan (params)
            .then(res => {
              console.log('预案删除',res.data)
              if(res.data) {
                this.getPlanList()
                 clearInterval(this.timer)
                this.$refs.splitScreen.setCameraList([])
                this.$message.success(res.data)

              }
          })
      })   
      },

    // 预案列表触发事件
    getCamerasDetailList (val, index) {
      this.$set(this.planLoading, index, true)
      console.log('预案列表触发事件',val)
      let params = {
          planId: val.planId
      }
        this.queryCamerasByPlanId(params, index)
        // this.queryGroupsByPlanId(params, index)

    },
     // 根据预案id查询摄像机
    queryCamerasByPlanId  (params,index) {
       this.$api
        .queryCamerasByPlanId(params)
        .then(res => {
          if (res.code === 200 ) {
            console.log('根据预案id查询摄像机',res.data)
            this.camerasByPlan = res.data
            this.camerasByPlanId = params.planId
            this.$set(this.planLoading, index, false)
          }
        })
    },
     // 根据预案id查询分组
    // queryGroupsByPlanId (params,index) {
    //    this.$api
    //     .queryGroupsByPlanId(params)
    //     .then(res => {
    //       if (res.code === 200) {
    //           console.log('根据预案id查询分组',res.data)
    //           this.groupsByPlan = res.data
    //           this.$set(this.planLoading, index, false)
    //       }
    //     })
    // },
    // 预案摄像机组摄像机列表
      // getCamerasGroupDetailList (val, i) {
      //   this.$set(this.groupsLoading, i, true)
      //   let params ={
      //     id: val.groupId
      //   }
      //     this.$api
      //       .getDeviceCameraList(params)
      //       .then(res => {
      //         if (res.code === 200) {
      //           console.log('预案摄像机组摄像机列表',res.data)
      //           this.camerasgroupByPlan = res.data
      //           this.$set(this.groupsLoading, i, false)
      //         } 
      //     })
      // },
      // 摄像机删除
      delPlanCamera (val) {
        let params ={
          planId: val.planId,
          cameraId: val.cameraId 
        }
         this.$confirm("提示", {
        title: "提示",
        message: "确定删除这条摄像机吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api
            .delPlanCamera(params)
            .then(res => {
              console.log('摄像机删除',res.data)
              if(res.data) {
                let obj = {planId: this.camerasByPlanId}
                this.queryCamerasByPlanId(obj)
                this.$message.success(res.data)
              }
          })
      })   
      },
      // 触摸子节点摄像机播放视频
      treenodePlay (val) {
        clearInterval(this.timer)
        this.cameraNumArr = []
        this.cameraNumArr.push(val)
        this.$refs.splitScreen.addCameraList(this.cameraNumArr)
      },
      // 执行预案
      execute (val) {
        let time = 100
        time = parseInt(val.timeInterval.split('s')[0] + '000')
        clearInterval(this.timer)
        this.playCameraNum = []
        let pollCameras = []
        let screenCount = this.screenRadio
        let params = {
          planId: val.planId
      }
        this.$api
        .queryCamerasByPlanId(params)
        .then(res => {
          if (res.code === 200 ) {
            console.log('根据预案id查询摄像机',res.data)
              res.data.map(item =>{
              pollCameras.push(item) 
            })
            console.log('摄像机编号', pollCameras)
            this.pollCameraNum (pollCameras, screenCount)
            console.log('渲染摄像机', this.playCameraNum)
            // 轮询
            this.srtTimer(time)

          }
        })
        
      },
      // 摄像机轮询
      srtTimer (time) {
        console.log('数值', time)
        if(this.playCameraNum.length) {
          this.$refs.splitScreen.setCameraList(this.playCameraNum[0])
        } else {
          this.$refs.splitScreen.setCameraList(this.playCameraNum)
        }
        if (this.playCameraNum.length > 1) {
          let n = 1
          this.timer = setInterval(() => {
            console.log('我是索引', n)
          this.$refs.splitScreen.setCameraList(this.playCameraNum[n])
          if (n < this.playCameraNum.length - 1){
            n++
          } else {
            n = 0
          }
        }, time);
        }
      },
      // 摄像机轮询数据处理
       pollCameraNum (arr, num) {
         if(arr.length) {
            let arrOrg = []
            let arrTS = []
          arr.map((item, index) => {
            if(index < num) {
              arrOrg.push(item)
            } else {
              arrTS.push(item)
            }
          })
          // 判断视频播放数量传入不同参数获取不同域名播放地址
          arrOrg.map((it,extent)=>{
            if (extent < 4) {
                it.playDomain = 0
              } else if (extent > 3 && extent < 8){
                it.playDomain = 1
              }else if (extent > 7 && extent < 12){
                it.playDomain = 2
              }else if (extent > 11 && extent < 16){
                it.playDomain = 3
              }else {
                it.playDomain = null
              }
          })
          this.playCameraNum.push(arrOrg)
          this.pollCameraNum(arrTS, num)
         } else return
        },
      // 预案编辑
      editPlan (val) {
        // this.checkData.push({arr: '添加的参数'})
        console.log(123456,val)
        this.type = 'edit'
        this.title = '修改预案'
        this.saveBut = '下一步'
        this.modifyPlan = true
        this.ruleFormPlan.planName = val.planName
        this.ruleFormPlan.timeInterval = val.timeInterval
        this.ruleFormPlan.planId = val.planId

        // 查询摄像机组
        // let obj = {planId: val.planId}
        // this.$api
        //   .queryGroupsByPlanId(obj)
        //   .then(res => {
        //   console.log('234356',res.data)
        //   if (res.data) {
        //     res.data.forEach(item => {
        //       this.ruleFormPlan.groupIds.push(item.groupId)
        //     });
        //   }
        // })
        // this.modifyPlan = true
        // this.getDeviceList()
      },
      // 编辑弹出关闭
      planClose () {
        this.modifyPlan = false
        this.ruleFormPlan.planName = ''
        this.ruleFormPlan.timeInterval = ''
        this.ruleFormPlan.groupIds = []
        this.ruleFormPlan.cameraIds = []
      },
      // 预案保存
      savePlan () {
        if (this.type === 'add') {
           let obj = this.ruleFormPlan
            obj.organizationId  =  JSON.parse(localStorage.getItem("cloudplatform")).organizationId
            obj.status = '1'
            obj.groupIds = []
            obj.cameraIds = []
       this.$api
        .addPlan (obj)
        .then(res => {
          console.log('新增接口参数',res.data)
          if(res.code === 200) {
              this.modifyPlan = false;
              this.planClose()
              this.getPlanList()
              this.selectTitle = '选择摄像机'
              this.selectCameraId = true
              this.ruleFormPlan.planId = res.data
              this.$message.success('新增预案成功！')
              this.count = 0
          }
        })
      }else if (this.type === 'edit') {
        let obj = {}
            obj.data = {flag: "1"}
            obj.params = this.ruleFormPlan
            obj.params.organizationId  =  JSON.parse(localStorage.getItem("cloudplatform")).organizationId
            obj.params.status = '1'
            obj.params.groupIds = []
            obj.params.cameraIds = []
         
        this.$api
          .modifyPlan (obj)
          .then(res => {
            console.log('保存接口参数',res.data)
            if (res.code === 200 ) {
              this.getPlanList()
              this.selectTitle = '修改摄像机信息'
              if (res.data) {
                this.$message.success(res.data)
              }
              setTimeout(() => {
                let obj = {planId: this.ruleFormPlan.planId}
                 this.$api.querySelectedCamera (obj).then(req => {
                this.count = req.total
                this.planClose()
                this.modifyPlan = false;
                this.selectCameraId = true
              })
            }, 5);
            // this.getPlanList()
            // let params = {
            //   planId: this.ruleFormPlan.planId
            // }
            // this.queryCamerasByPlanId(params)
            // this.queryGroupsByPlanId(params)
            // this.checkData = []
          }
        })
      }
      //   console.log ('选择的摄像机', this.checkData)
      //   let cameraIds = this.checkData.map(item => {
      //       return item.cameraId;
      //     });
      //   let obj = this.ruleFormPlan
      //   obj.organizationId  =  JSON.parse(localStorage.getItem("cloudplatform")).organizationId
      //   obj.status = '1'
      //   obj.cameraIds = cameraIds
      //  this.$api
      //   .modifyPlan (obj)
      //   .then(res => {
      //     console.log('保存接口参数',res.data)
      //     if (res.code === 200 ) {
      //       this.planClose()
      //       if (res.data) {
      //         this.$message.success(res.data)
      //       }
      //       this.getPlanList()
      //       let params = {
      //         planId: this.ruleFormPlan.planId
      //       }
      //       this.queryCamerasByPlanId(params)
      //       // this.queryGroupsByPlanId(params)
      //       this.checkData = []
      //     }
          
      //   })
      },
      // 摄像机排序 1:向上 2向下
      modifyCameraOrder (val, i, type) {
         console.log('摄像机排序',val,this.camerasByPlan[i-1])
        let params = {}
        if(type === 1) {
          params = {
            planId: val.planId,
            cameraIdBefore: val.cameraId,
            cameraIdAfter: this.camerasByPlan[i-1].cameraId
          }
        } else {
           params = {
            planId: val.planId,
            cameraIdBefore: val.cameraId,
            cameraIdAfter: this.camerasByPlan[i+1].cameraId
          }
        }
         this.$api
            .modifyCameraOrder(params)
            .then(res => {
                console.log('摄像机排序',res.data)
                let obj = {planId: this.camerasByPlanId}
                this.queryCamerasByPlanId(obj)
          })
      },
    //新增组织
    addGroup() {
      this.groupDialog = true;
    }
  }
};
</script>
<style lang="less" src="../components/css/InspectionDialog.less"></style>
