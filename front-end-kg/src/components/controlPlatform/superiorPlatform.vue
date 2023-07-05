<template>
  <div class="superior-platform" v-if="visible">
    <div class="superior-platform-con">
      <div class="superior-platform-btn" v-if="!hasPlatform">
        <el-button type="primary" @click="addNewPlatform">新增部平台</el-button>
      </div>
      <div v-else>
        <div class="superior-platform-title">
          <span>{{ manageForm.model.platformName }}</span>
          <i v-if="hasPlatform" class="el-icon-edit" @click="editNewPlatform"></i>
          <i v-if="hasPlatform" style="margin-left: 10px;  cursor: pointer;" class="el-icon-document" @click="dockingLog"></i>
        </div>
        <c-form ref="form" class="superior-platform-form" :options="manageForm"></c-form>
        <div class="superior-platform-table">
          <div class="superior-platform-search">
            <div>
              已上报摄像机数：{{ manageForm.model.alreadyChannelNum }}(在线：
              {{ manageForm.model.onlineChannelNum }}, 离线:
              {{ manageForm.model.offlineChannelNum }})
            </div>
            <div class="search-wrapper">
              <el-form :inline="true">
                <!-- <el-form-item label="" prop="regionCode" v-if="uinfo.regionCode == 100000 ? true : false">
                  <el-select v-model="filters.provinceCode" filterable placeholder="全国" style="width:80px" clearable>
                    <el-option v-for="item in areaList" :key="item.regionCode" :label="item.alias"
                      :value="item.regionCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" v-if="uinfo.regionCode == 100000 ? true : false">
                  <el-cascader v-model="filters.organizationId" clearable :show-all-levels="false"
                    :options="orgTreeList" :props="orgCodeProps" style="width: 100px"></el-cascader>
                </el-form-item> -->
                <el-form-item label="路线">
                  <el-select v-model="filters.roadCode" :class="filters.roadCode ? 'input-selected' : ''"
                    placeholder="路线" clearable style="width:120px">
                    <el-option label="全部路线" value></el-option>
                    <el-option v-for="item in roadList" :key="item.roadCode + item.roadName" :label="item.roadName"
                      :value="item.roadCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="filters.onlineStatus" filterable placeholder="状态" style="width:100px" clearable>
                    <el-option v-for="item in onlineStatusList" :key="item.state" :label="item.cameraState"
                      :value="item.state"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属类别">
                  <el-select v-model="filters.classify" filterable placeholder="所属类别" style="width:120px" clearable>
                    <el-option v-for="item in classifyList" :key="item.codeValue" :label="item.codeName"
                      :value="item.codeValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="摄像机名称">
                  <el-input style="width:150px" v-model="filters.cameraName" placeholder="请输入摄像机名称"></el-input>
                </el-form-item>
              </el-form>
              <div class="search-btn-right">
                <div class="btn-padding" style="display: flex;">
                  <el-button type="primary" class="query" @click="queryList">查询</el-button>
                  <el-button type="primary" class="reset" @click="resetSerach">重置</el-button>
                  <el-button class="query" @click="cancelReport" type="primary">取消上报</el-button>
                </div>
              </div>
            </div>
            <c-table ref="table" :options="tableOptions" @on-selection-change="handleSelectionChange" @on-change-page="changeCurrentPage"
              @on-page-size-change="changePageSize"></c-table>

          </div>
        </div>
      </div>
    </div>
    <div>
        <!-- 对接日志 -->
    <journal-abutment
        ref="journalAbutment" 
        :dialogTableVisible="dialogTableVisible" 
        @dialog-close="(flag)=>{this.dialogTableVisible = flag}">
    </journal-abutment>

        <!-- <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="tableOptions.currPage"
          :total="total"
        ></el-pagination> -->
      </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" custom-class="superior-platform-dialog"
      :append-to-body="true" :close-on-click-modal="false">
      <c-form v-if="dialogVisible" ref="form" :options="manageEditForm"></c-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePlatform">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import cForm from "../form/indexForm";
import uploadPri from "./uploadPri";
import Vue from "vue";
import cTable from "../table/table";
import copyData from './copyData';
import exportData from './exportData';
import journalAbutment from '../controlPlatform/journalAbutment.vue';
import { mapState } from 'vuex';
Vue.component("uploadPri", uploadPri);
Vue.component("copyData", copyData);
Vue.component('exportData', exportData);
Vue.component('journalAbutment', journalAbutment);
export default {
  components: { cForm, cTable },
  data () {
    let height =
      document.documentElement.clientHeight - 50 - 54 - 49 - 40 - 15 - 42 - 20;
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      dialogTableVisible:false, // 对接日志对话框
      visible: false,
      hasPlatform: false,
      transcodingId: '',
      manageForm: {
        cols: 4,
        model: {},
        isViewMode: true,
        formItemList: [
          {
            label: "所属组织:",
            name: "organizationName",
            type: "input",
            groupName: "基本信息",
          },
          {
            label: "联系人:",
            name: "contactPerson",
            type: "input",
            groupName: "基本信息",
          },
          {
            label: "联系电话:",
            name: "contactPhone",
            type: "input",
            groupName: "基本信息",
            span: 2,
          },
          {
            label: "User:",
            name: "platformCode",/* platformUser */
            type: "input",
            groupName: "我方鉴权信息",
          },
          {
            label: "devicecode:",
            name: "platformUser",/* platformCode */
            type: "input",
            groupName: "我方鉴权信息",
          },
          {
            label: "Token:",
            name: "platformToken",
            type: "input",
            groupName: "我方鉴权信息",
          },
          {
            label: "私钥:",
            name: "hasPrivateKey",
            type: "custom",
            component: "exportData",
            groupName: "我方鉴权信息",
            transcodingId: '',
            hasPrivateKey: 0
          },
          {
            label: "User:",
            name: "deviceUser",
            type: "input",
            groupName: "对方鉴权信息",
          },
          {
            label: "devicecode:",
            name: "deviceCode",
            type: "input",
            groupName: "对方鉴权信息",
          },
          {
            label: "Token:",
            name: "deviceToken",
            type: "custom",
            component: 'copyData',
            groupName: "对方鉴权信息",
          },
          {
            label: "私钥:",
            name: "hasPrivateKey",
            type: "custom",
            component: "uploadPri",
            groupName: "对方鉴权信息",
            transcodingId: ''
          },
        ],
      },
      manageEditForm: {
        cols: 1,
        model: {},
        isViewMode: false,
        size: "mini",
        formItemList: [
          {
            label: "平台名称",
            name: "platformName",
            type: "input",
            groupName: "基本信息",
          },
          {
            label: "平台地址",
            name: "gw1Address",
            type: "input",
            groupName: "基本信息",
          },
          {
            label: "平台编号",
            name: "deviceCode",
            type: "input",
            groupName: "接入信息",
          },
          {
            label: "平台User",
            name: "deviceUser",
            type: "input",
            groupName: "接入信息",
          },
          {
            label: "平台Token",
            name: "deviceToken",
            type: "input",
            groupName: "接入信息",
          },
          {
            label: "私钥",
            name: "hasPrivateKey",
            type: "custom",
            component: "uploadPri",
            groupName: "接入信息",
            transcodingId: '',
            hasPrivateKey: 0
          },
          {
            label: "联系人",
            name: "responsiblePerson",
            type: "input",
            groupName: "联系人信息",
          },
          {
            label: "联系电话",
            name: "phone",
            type: "input",
            groupName: "联系人信息",
          },
        ],
      },
      dialogTitle: "新增上级平台",
      dialogVisible: false,
      cameraNumber: {
        total: 200,
        online: 195,
        offline: 5,
      },
      tableOptions: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        selection: true,
        localData: [],
        border: true,
        uniqueId: "cameraId",
        selectionCache: true,
        maxHeight: height,
        columns: [
          { key: "sort", title: "序号" },
          { title: "地区", key: "regionName" },
          { title: "管辖单位", key: "organizationId" },
          { title: "摄像机名称", key: "cameraName" },
          { title: "所属路线", key: "roadCode" },
          { title: "桩号", key: "kmPile" },
          { title: "经纬度", key: "longAndLati" },
          { title: "摄像机状态", key: "onlineStatus" },
          { title: "所属上云网关", key: "transcodingName" },
          { title: "推流状态", key: "streamControlStatus" },
          { title: "开放状态", key: "openStatus" },
          { title: "所属类别", key: "classifyCode" },
          { title: "方向", key: "derectionCode" },
          { title: "摄像机类型", key: "cameraType" },
        ],
      },
      filters: {
        cameraName:"",
        provinceCode: "",
        organizationId: "",
        roadCode: "",
        direction: "",
        classify: "",
        upCloud: "",
        onlineStatus: "",
        cameraType: "",
        cameraNumber: "",
        pageSize: 10,
        currPage: 1
      },
      areaList: [],
      orgTreeList: [],
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true,
        //lazyLoad:this.propsLazyload
      },
      roadList: [],
      onlineStatus: [
        { name: "离线", code: "0" },
        { name: "在线", code: "1" },
        { name: "故障", code: "2" }
      ],
      onlineStatusList: [
        {
          state: "0",
          cameraState: "离线",
        },
        {
          state: "1",
          cameraState: "在线",
        },
        {
          state: "2",
          cameraState: "故障",
        },
      ],
      classifyList: [], //所属类别
      transcodingId: '',
      multipleSelection: [] //table选择的数据列表
    };
  },
  computed: {
    ...mapState([
      'uploadFile'
    ])
  },
  created () {
    this.querySuppPlatform();
    Promise.all([this.loadCameraType(), this.loadClassify(), this.queryRoadList(), this.queryOrgList(), this.loadDirection(), this.loadArea()]).finally(res => {
      this.query();
    })
  },
  methods: {
    querySuppPlatform () {
      console.log(43)
      //  this.visible = true;
      this.$api.querySuppPlatform({ type: 2 }).then((res) => {
        if (res.code === 404) {
          this.hasPlatform = false;
          this.visible = true;
          return;
        }
        console.log('获取')
        this.manageForm.model = res.data;
        this.hasPlatform = true;
        this.visible = true;
        _.each(this.manageEditForm.formItemList, it => {
          if (it.name === 'hasPrivateKey') {
            it.transcodingId = res.data.transcodingId;
            it.hasPrivateKey = res.data.hasPrivateKey;
          }
        })

        _.each(this.manageForm.formItemList, it => {
          if (it.name === 'hasPrivateKey') {
            it.transcodingId = res.data.transcodingId;
            it.hasPrivateKey = res.data.hasPrivateKey;
          }
        })
        this.transcodingId = res.data.transcodingId;
      });
    },
    addNewPlatform () {
      this.dialogVisible = true;
    },
    editNewPlatform () {
      this.dialogVisible = true;
      this.dialogTitle = "编辑上级平台";
      this.manageEditForm.model = {
        ...this.manageForm.model,
        /*   deviceCode: this.manageForm.model.deviceCode,
          deviceUser: this.manageForm.model.deviceToken,
          deviceToken: this.manageForm.model.deviceUser, */
        /*         deviceCode: '',
                deviceUser: '',
                deviceToken: '', */
        deviceCode: this.manageForm.model.deviceCode,
        deviceUser: this.manageForm.model.deviceUser,
        deviceToken: this.manageForm.model.deviceToken,
        responsiblePerson: this.manageForm.model.contactPerson,
        phone: this.manageForm.model.contactPhone,
        gw1Address: this.manageForm.model.urlAddress,
      };
    },
    savePlatform () {
      let cloudplatform = JSON.parse(localStorage.getItem("cloudplatform"))
      // let params = this.manageEditForm.model;
      //  console.log('jakjsjdkah',cloudplatform, params)
      if (this.dialogTitle == '新增上级平台') {
        let data = {
          platformName: this.manageEditForm.model.platformName, // 平台名称
          regionCode: cloudplatform.regionCode, // 市编码
          organizationId: "9901", // 组织编码
          platformCodePeer: this.manageEditForm.model.deviceUser, // 平台User
          deviceCodePeer: this.manageEditForm.model.deviceCode, // 设备编号
          authTokenPeer: this.manageEditForm.model.deviceToken, // token
          gw1Address: this.manageEditForm.model.gw1Address, // 访问地址 
          responsiblePerson: this.manageEditForm.model.responsiblePerson, // 联系人
          phone: this.manageEditForm.model.phone, // 手机号
          userId: cloudplatform.userId, // userId
        }
        console.log(data,"data")
        this.$api.saveSuppPlatform(data).then((res) => {
          if (res.code === 200) {
            this.dialogVisible = false;
            let instance = this.$refs.form.getFormItemInstance('hasPrivateKey');
            instance.confirmUpload();
            this.querySuppPlatform();
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        let params = {
          id: this.transcodingId,
          params: {
            gw1Address: this.manageEditForm.model.gw1Address,//访问地址
            platformCodePeer: this.manageEditForm.model.deviceUser, //user
            platformName: this.manageEditForm.model.platformName, //平台名称
            authTokenPeer: this.manageEditForm.model.deviceToken, //token
            deviceCodePeer: this.manageEditForm.model.deviceCode, //设备编号
            organizationId: cloudplatform.organizationId, //业主单位
            regionCode: cloudplatform.regionCode,
            responsiblePerson: this.manageEditForm.model.responsiblePerson,
            phone: this.manageEditForm.model.phone,
            // file: this.uploadFile.file ,
            // formData: this.uploadFile.file? {file: this.uploadFile.file}: null
          },
        };
        console.log(params,"params")
        this.$api
          .updateDevicePlatform(params)
          .then(res => {
            if (res.code === 200) {
              this.$api
                .reportBatchCamera({
                  'is1stReport': 1
                }).then((res1) => {
                  this.dialogVisible = false;
                  let instance = this.$refs.form.getFormItemInstance('hasPrivateKey');
                  instance.confirmUpload();
                  this.querySuppPlatform();
                })

            } else {
              this.$message.error(res.message);
            }
          })
      }

      //刷新列表
      this.query();
      /* -----------start---------- */




      /* -----------end---------- */
      // console.log('jakjsjdkah',cloudplatform, params)
      /* this.$api.saveSuppPlatform(params).then((res) => {
        if (res.code === 200) {
          this.dialogVisible = false;
          let instance = this.$refs.form.getFormItemInstance('hasPrivateKey');
          instance.confirmUpload();
          this.querySuppPlatform();
        } else {
          this.$message.error(res.message);
        }
      }); */
    },


     // 对接日志
      dockingLog(){
        this.dialogTableVisible = true;
        let transcodingId = {}
        transcodingId.transcodingId = this.transcodingId
        this.$refs.journalAbutment.dockingLog(transcodingId, 3)
      },

    loadCameraType () {
      var _this = this;
      return this.$api
        .getCodemaster({
          codeType: "CAMERA_TYPE",
        })
        .then((data) => {
          if (data.code == "200") {
            _this.cameraTypeList = data.data;
          }
        });
    },

    /**
     * 获取省份列表
     */
    loadArea () {
      return this.$api
        .getProvince({
          regionLevel: 1
        })
        .then(res => {
          if (res.code != "200") {
            return Promise.reject;
          }

          this.areaList = res.data;
          this.areaList.unshift({
            regionCode: "",
            regionName: "全国",
            alias: "全国",
            parentRegionCode: "0"
          });
        })
        .catch(() => { });
    },

    //获取所有类别
    loadClassify () {
      var _this = this;
      return this.$api
        .getCodemaster({
          codeType: "CLASSIFY",
        })
        .then((data) => {
          if (data.code == "200") {
            _this.classifyList = data.data;
          }
        });
    },
    loadDirection () {
      var _this = this;
      return this.$api
        .getCodemaster({
          codeType: "DERECTION"
        })
        .then(data => {
          if (data.code == "200") {
            _this.directionList = data.data;
          }
        });
    },

    queryRoadList (orgId) {
      let _this = this;
      return this.$api
        .getRoadsByOrgId({ regionCode: orgId + "" })
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.roadList = data.data;
        })
        .catch(() => { });
    },
    queryOrgList (regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      return this.$api
        .getOrgTree(params)
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data[0].childList;
          _.each(nlist, (it) => {
            it.disabled = true;
          });
          _this.orgTreeList = nlist;
        })
        // .catch((error) => {
        //   this.$message({
        //     message:
        //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
        //     type: "error",
        //   });
        // });
    },

    getUserInfo () {
      let userInfo = localStorage.getItem('cloudplatform')
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
      }
      return userInfo || {}
    },

    /**
     * 查询表格数据
     */
    query () {
      let _this = this;
      const userInfo = this.getUserInfo()
      const organizationId = this.filters.organizationId && this.filters.organizationId[this.filters.organizationId.length - 1]
      let params = {
        currPage: this.tableOptions.pageNumber,
        pageSize: this.tableOptions.pageSize,
        cameraName: this.filters.cameraName,
        regionId: this.filters.provinceCode, //
        organizationId: organizationId || userInfo.organizationId, //
        roadCode: this.filters.roadCode, //
        cameraType: this.filters.cameraType,
        onlineStatus: this.filters.onlineStatus,
        classifyCode: this.filters.classify, //
        userId: userInfo.userId,
        isReport: 1
      };

      this.$api
        .getCameraList(params)
        .then((res) => {
          if (res.code != 200) {
            return Promise.reject();
          }
          this.tableList = [];
          this.tableOptions.total = res.total
          this.tableOptions.localData = _.map(res.data, (it,index) => {
            let classify = _.find(this.classifyList, {
              codeValue: it.classifyCode,
            });
            let cameraType = _.find(this.cameraTypeList, {
              codeValue: it.cameraType,
            });
            let derectionCode = _.find(this.directionList, {
              codeValue: it.derectionCode,
            });
            // 摄像机状态
            let onlineStatus = ''
            if (it.onlineStatus === '1') {
              onlineStatus = '在线'
            } else if(it.onlineStatus === '0') {
              onlineStatus = '离线'
            } else if(it.onlineStatus === '2'){
              onlineStatus = '异常'
            }
            // 推流状态
            let  streamControlStatus = ''
                if (it.streamControlStatus === '0') {
              streamControlStatus = '开流中'
            } else if(it.streamControlStatus === '1') {
              streamControlStatus = '关流中'
            }
              // 开放状态
            let  openStatus = ''
                if (it.openStatus === '0') {
              openStatus = '不开放'
            } else if(it.openStatus === '1') {
              openStatus = '已开放'
            }if(it.openStatus === '2'){
              openStatus = '未开放'
            }
            return {
              ...it,
              sort:index+1,
              onlineStatus: onlineStatus,
              streamControlStatus: streamControlStatus,
              openStatus: openStatus,
              classifyCode: classify ? classify.codeName : "",
              derectionCode: derectionCode ? derectionCode.codeName : "",
              cameraType: cameraType ? cameraType.codeName : "",
            };
          });
        })
        .catch((error) => {
          //load.close();
          this.$message.error(error.message);
        });
    },
    resetSerach () {
      this.filters.cameraName = '';
      this.filters.provinceCode = ''; //
      this.filters.organizationId = '';//
      this.filters.roadCode = '';//
      this.filters.cameraType = '';
      this.filters.onlineStatus = '';
      this.filters.classify = ''; //
      // this.tableOptions.pageNumber = 1;
      // this.tableOptions.pageSize = 10;
      this.queryList();
    },
    queryList () {
      this.tableOptions.pageNumber = 1;
      this.query();
    },
    cancelReport () {
       if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }
         
        let cams = [];
        this.multipleSelection.forEach(item => {
          cams.push(item.cameraNum)
        });
         this.$confirm("提示", {
          title: "提示",
          message: "确定取消上报"+ cams.length+ "条摄像机? ",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          this.$api
            .cancelReportBatchCamera({
              cameraNums: cams,
              instructions: {
                module: "资源管理",
                page: "摄像机管理",
                feature: "批量处理—取消上报",
                description:
                  "批量取消上报" + cams.length + "路摄像机"
              }
            }).then((res) => {
              if(res.code === 200) {
                this.$message.success("取消上报完成");
              }
              this.query()
              this.querySuppPlatform()
            })
        })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeCurrentPage (pageNumber) {
      this.tableOptions.pageNumber = pageNumber;
      this.query();
    },
    changePageSize (pageSize) {
      this.tableOptions.pageNumber = 1;
      this.tableOptions.pageSize = pageSize;
      this.query();
    },
  },
};
</script>
<style lang="less">
.superior-platform {
  background: #fff;
  height: calc(~"100vh - 228px");
  padding: 20px 0px;
  overflow-y: auto;
  overflow-x: hidden;
  .superior-platform-title {
    width: 100%;
    height: 14px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    margin-right: 8px;
    padding-left: 16px;
    .el-icon-edit {
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .superior-platform-form {
    padding-left: 12px;
    margin-top: 16px;
  }
  .el-form-item__label {
    color: #000;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .group-name::before {
    content: "";
    width: 3px;
    border: 3px;
    height: 12px;
    background: rgba(18, 116, 238, 1);
    border-radius: 2px;
    display: inline-block;
    margin-right: 4px;
    vertical-align: baseline;
  }
  .el-form {
    margin-left: 0px !important;
  }
  .superior-platform-search {
    padding-left: 12px;
    .search-wrapper {
      display: flex;
      margin-top: 8px;
    }
  }
  .search-btn-right {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 951px);
  }
}
.el-form-item__content{
      // display: flex;
      .copy-data{
        display: contents;
      }
    }

.superior-platform-dialog {
  .el-form-item__label {
    color: #a9a9a9;
    width: 100%;
    text-align: left;
  }
  .el-form-item {
    margin-bottom: 16px;
    
  }
  .group-name::before {
    content: "";
    width: 3px;
    border: 3px;
    height: 12px;
    background: rgba(18, 116, 238, 1);
    border-radius: 2px;
    display: inline-block;
    margin-right: 4px;
    vertical-align: baseline;
  }
  .el-form {
    margin-left: 0px !important;
  }
}
</style>
