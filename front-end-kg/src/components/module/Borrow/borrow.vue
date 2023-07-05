<template>
  <div class="content-wrapper camera-manage-wrapper" ref="viewbox">
    <!--头部导航-->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>摄像机管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isCloudGateway">上云网关详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-manage-con" style="{height: calc(100% - 14px - 20px)}">
      <div class="cameraheader" v-if="!isCloudGateway" style="padding:30px;">
        <div class="tab-wrapper">
          <div @click="$router.push({ path: '/deviceCameraManage' })">摄像机管理</div>
          <div @click="$router.push({ path: '/deviceGroupManage' })">设备组管理</div>
          <div @click="$router.push({ path: '/systemCameraBox' })">摄像机审核</div>
          <div class="active">借阅审核</div>
        </div>
        <!-- <el-button type="primary" plain class="query" @click="exportCameraList()">数据导出</el-button> -->
        <!-- <el-popover placement="bottom" style="margin: 0 10px;" trigger="hover">
        <el-checkbox-group style="width: 100px;" v-model="colOptions">
          <el-checkbox v-for="item in colSelect" :label="item" :key="item"></el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" plain class="query" slot="reference">设置</el-button>
        </el-popover>-->
      </div>

      <!--搜索框-->
      <div v-if="!isCloudGateway" class="camera-search-display camera-manage-search">
        <!-- <div> -->
        <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
          <el-form :inline="true">
            <el-form-item prop="regionCode" v-if="uinfo.regionCode == 100000 ? true : false">
              <el-select
                v-model="filters.provinceCode"
                filterable
                placeholder="全国"
                style="width:100px"
                @change="regionChange"
                clearable
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.regionCode"
                  :label="item.alias"
                  :value="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="oValue" style="width:120px" placeholder="审核状态">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="oEffective" style="width:120px" placeholder="是否有效">
                <el-option
                  v-for="item in effectiveList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-date-picker
                v-model="searchInfo.selectDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>

            <!-- <el-form-item label="摄像机名称：">
              <el-input style="width:150px" v-model="filters.cameraName" placeholder="请输入摄像机名称"></el-input>
            </el-form-item>
            <el-form-item label="摄像机编号：">
              <el-input style="width:150px" v-model="filters.cameraNum" placeholder="请输入摄像机编号"></el-input>
            </el-form-item>-->
          </el-form>
        </div>
        <div class="search-btn-right">
          <div class="btn-padding">
            <el-button type="primary" class="query" @click="queryList">查询</el-button>
            <el-button type="primary" class="reset" @click="resetSerach">重置</el-button>
          </div>
          <!-- <span @click="seachMore" v-if="isAllHeight % 2 == 0" class="have-more-info">更多</span> -->
          <!-- <span @click="seachMore" v-if="isAllHeight % 2 != 0" class="have-more-info">收起</span> -->
        </div>
      </div>
      <!--卡片区域-->
      <div class="borrowCard">
        <el-row :gutter="20">
          <div
            class="borrowCardItem"
            v-for="(item , index) in listData"
            
            :key="index"
            style="{height: calc(100% + 14px + 20px)}"
          >
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
                :class="item.status? 'auditStatusCss' : 'auditStatusLess'"
              >
                <div
                  style="float:left;padding-left:5%;width: 100%;text-align: left;"
                  :class="getClass(item.auditStatus)"
                >
                  <span style="font-size:24px;padding-right:10px">{{item.auditStatusDesc}}</span>
                  <span style="font-size:16px">({{item.applyRegionName}})</span>
                  <button
                    @click="showReviewDialog(item.borrowId)"
                    class="btn"
                    style="color:#fff !important;width:65px;height:32px;background:#FDAD3D;border-radius:16px;float: right;margin: 20px 27px 19px 0;"
                    v-if="item.auditStatus==1"
                  >审核</button>
                </div>
              </div>
              <!-- <el-row :gutter="24">
                <el-col :span="8">
                  <span>省份</span>
                </el-col>
                <el-col :span="16">
                  <span>{{item.applyRegionName}}</span>
                </el-col>
              </el-row>-->
              <el-row :gutter="24">
                <el-col :span="8">
                  <span>申请时间</span>
                </el-col>
                <el-col :span="16">
                  <span>{{item.applyTime}}</span>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <span>调阅有效期</span>
                </el-col>
                <el-col :span="16">
                  <span>{{item.borrowStartTime}}~{{item.borrowStartTime}}</span>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <span>视频清晰度</span>
                </el-col>
                <el-col :span="16">
                  <span>{{item.videoTypeDesc}}</span>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <span>申请原因</span>
                </el-col>
                <el-col :span="16">
                  <el-tooltip
                    :content="item.applyReason"
                    style="display: inline-block;width: calc(100% - 50px);vertical-align: bottom;"
                  >
                    <div class="content">
                      <div
                        style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                      >{{item.applyReason}}</div>
                    </div>
                  </el-tooltip>
                  <span></span>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <span>附件</span>
                </el-col>
                <el-col :span="16">
                 <div 
                    @click="downLoad(item)"
                    >
                    <i 
                    style="cursor: pointer;"
                    class="el-icon-paperclip"
                    ></i>
                </div>
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="item.auditStatus==2">
                <el-col :span="8">
                  <span>审批时间</span>
                </el-col>
                <el-col :span="16">
                  <!-- <span>{{item.attachmentOssUrl}}</span> -->
                  <span>{{item.auditTime}}</span>
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="item.auditStatus==3">
                <el-col :span="8">
                  <span>驳回原因</span>
                </el-col>
                <el-col :span="16">
                  <!-- <span>{{item.attachmentOssUrl}}</span> -->
                  <span>{{item.auditRejectReason}}</span>
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="item.auditStatus==2">
                <el-col :span="8">
                  <span>审批摄像机</span>
                </el-col>
                <el-col :span="16">
                  <span type="text" @click="handledig(item.borrowId)">{{item.cameraCount}}路</span>
                  <el-dialog
                    title="摄像机信息"
                    :visible.sync="dialogTableVisible"
                    :modal-append-to-body="false"
                    width="65%"
                  >
                    <el-table :data="gridData">
                      <el-table-column property="title" type="index" label="序号" width="50"></el-table-column>
                      <el-table-column property="regionName" label="省份" width="150"></el-table-column>
                      <el-table-column property="organizationName" label="管辖单位" width="350"></el-table-column>
                      <el-table-column property="roadName" label="路线" width="150"></el-table-column>
                      <el-table-column property="pile" label="桩号" width="100"></el-table-column>
                      <el-table-column property="classify" label="类别" width="100"></el-table-column>
                    </el-table>
                  </el-dialog>
                </el-col>
              </el-row>

              <div style="text-align: center;padding-top: 30px;">
                <el-dialog
                  title="审核"
                  :visible.sync="dialogVisible"
                  width="30%"
                  :before-close="handleClose"
                  v-dialogDrag
                  :append-to-body="true"
                >
                  <span>
                    <el-tabs type="border-card" v-model="activeName">
                      <el-tab-pane name="1">
                        <span slot="label">
                          <i class="el-icon-success"></i> 同意
                        </span>
                        <div style="line-height: 30px;">
                          审批摄像机：
                          <el-button type="primary" mini @click="choice(item.borrowId)">+选择</el-button>
                        </div>
                        
                      </el-tab-pane>
                      <el-tab-pane name="2">
                        <span slot="label">
                          <i class="el-icon-success"></i> 驳回
                        </span>
                        <el-input
                          type="textarea"
                          placeholder="请输入驳回理由"
                          v-model="borrowAuditRejectReq"
                          maxlength="30"
                          show-word-limit
                        ></el-input>
                        
                      </el-tab-pane>
                    </el-tabs>
                  </span>
                  <span  class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitRview">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
            </el-card>
          </div>
        </el-row>
      </div>

      <!--  :class="isAllHeight % 2 == 0 ? 'camera-device-table-h' : 'table-wrapper-all camera-device-all'" -->

      <!--分页控件-->
      <!-- <div>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="filters.currPage"
          :total="total"
        ></el-pagination>
      </div>-->
    </div>
    <el-dialog
      title="选择摄像机"
      :visible.sync="dialogTableVisibles"
      width="90%"
      :before-close="handleClose"
      v-dialogDrag
      :append-to-body="true"
      
    >
      <borrow-dialog
      v-if="dialogTableVisibles"
      :listData="listData"
      :borrow-id="borrowId"
      ></borrow-dialog>
      <!-- :borrowId: borrowId,
      :applyUserId: applyUserId, -->
    </el-dialog>
    
  </div>
</template>

<script>
import TrafficAmap from "../../cameraMap.vue";
//import {Loading} from "element-ui";
import { mapState, mapActions } from "vuex";
import cameraDetail from "../equipment/cameraDetail";
import BorrowDialog from "./BorrowDialog";
import qs from "qs";
import uploadFile from '../spt/uploadFile';
export default {
  components: {
    // CameraPlayDialog,
    cameraDetail,
    TrafficAmap,
    BorrowDialog,
    uploadFile
  },

  data() {
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      searchInfo: {
        selectDate: ""
      },
      options: [
        {
          value: "1",
          label: "待审核"
        },
        {
          value: "2",
          label: "同意"
        },
        {
          value: "3",
          label: "驳回"
        }
      ],
      oValue: "",
      oEffective: "",
      effectiveList: [
        {
          value: "1",
          label: "有效"
        },
        {
          value: "2",
          label: "无效"
        }
      ],
      listData: {},
      showCols: [],
      dialogVisible: false,
      text: "",
      borrowAuditRejectReq: "",
      customColVisible: false,
      colOptions: [],
      colSelect: [],
      dialogTableVisible: false,
      dialogTableVisibles: false,
      //假数据
      gridData: [
        // {
        //   title: "1",
        //   province: "黑龙江",
        //   unit: "浙江省交通投资集团有限公司杭金衢分公司",
        //   route: "G3京台高速",
        //   stakeNo: "K1518+750",
        //   category: "道路沿线"
        // },
        // {
        //   title: "2",
        //   province: "黑龙江",
        //   unit: "浙江省交通投资集团有限公司杭金衢分公司",
        //   route: "G3京台高速",
        //   stakeNo: "K1518+750",
        //   category: "道路沿线"
        // }
      ],

      cameraId: "",
      userInfo: "",
      lonAndlatOperation: {
        visible: false,
        cameraName: "",
        cameraNum: ""
      },
      isAllHeight: 0,
      video: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      isThreePlayer: false,
      tableData: [],
      areaList: [],
      areaValue: "",
      jurisdictionList: [],
      cameraType: "",
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList"
        //lazyLoad:this.propsLazyload
      },
      directionList: [], //摄像机方向
      startMileage: "",
      endMileage: "",
      filters: {
        provinceCode: "",
        organizationId: "",
        roadCode: "",
        startMileage: this.startMileage,
        endMileage: this.endMileage,
        direction: "",
        classify: "",
        upCloud: "",
        cameraState: "",
        cameraType: "",
        cameraNumber: "",
        pageSize: 10,
        currPage: 1
      },
      orgTreeList: [],
      roadList: [],
      classifyList: [], //所属类别
      transCodeValue: "", //上云网关
      transCodeList: [], //上云网关
      cameraStateList: [
        {
          state: "0",
          cameraState: "离线"
        },
        {
          state: "1",
          cameraState: "正常"
        },
        {
          state: "2",
          cameraState: "故障"
        }
      ],
      cameraStateValue: "",
      cameraTableLoading: false,
      // pageSize: 10,
      // currentPage: 1,
      total: 0,
      pages: 0,
      loadOption: {
        fullscreen: true,
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      },
      selectHandle: [],
      checkAll: false,
      stateList: [
        { name: "离线", color: "#878787" },
        { name: "正常", color: "#26B55F" },
        { name: "故障", color: "#F9552F" }
      ],
      multipleSelection: [],
      appendDeiveGroupDialogVisible: false,
      addDeiveGroupDialogVisible: false,
      addDeiveGroupFrom: {
        groupName: "",
        groupId: ""
      },
      deviceGroupList: [],
      playerDialogVisible: false,
      playerDialogDetailVisible: false,
      stepSize: 0,
      playerCamera: {},
      cameraDialogVisible: false,
      cameraDetailedInfo: {},
      datePicker: "",
      startTime: "",
      endTime: "",
      cloudVideoData: [
        {
          date: "2020-05-22 17:34",
          name: "lmy",
          address: "32s"
        }
      ],
      activeNames: ["1", "3"],
      isCloudGateway: false,
      gatewayQuery: {
        kmPileMax: "",
        kmPileMin: "",
        transcodingId: "",
        classifyCode: "",
        cameraType: "",
        synOnlineStatus: "" //摄像机状态
      },
      gatewayInfo: {},
      // 上云网关上回退当前页标记
      gatewayCurrentPage: 1,
      cloudVideoDetail: [], //云视频详情
      recordFilePath: "",
      downloadPath: "", //下载地址
      tableVisible: true,
      borrowId: '',
      activeName: '1'
    };
  },
  created() {
    this.userInfo = this.$router.history.current.query;
    this.getBorrowListData();
    
  },
  watch: {
    colOptions(valArr) {
      var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0); // 未选中
      this.cameraColData.filter(i => {
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        }
      });
    }
  },
  computed: {
    ...mapState([
      "deviceStatistics",
       "UserOrgTree",
      "sysUser",
      "setSysUserList",
      "roleList",
      "orgTreeData",
      "provinces",
      "UserOrgTreeChild"
    ]),
    usePlayerType() {
      // return 'ali';
      return this.$root.playerType;
    }
  },
  methods: {
    ...mapActions(["getCameraPlayUrl", "getPositionLat"]),
    handleCheckedCitiesChange(value) {},
    getClass(i) {
      switch (i) {
        case 1:
          return "reviewed";
        case 2:
          return "agree";
        case 3:
          return "pink";
      }
    },

    downLoad(borrow){
        this.$api.downOssFile({
            borrowId: borrow.borrowId,
            ossId: 2
        }).then(res => {
            if(res.code !== 200){
                this.$message.error(res.message);
                return;
            }
            window.open(res.data);
        })
    },

    //审核弹窗
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done(
          this.dialogVisible=true
          );
        })
        .catch(_ => {
        });
    },
    handleCloseTwo(done){

    },
    getStatuss(status) {
      let text = "";
      if (!status) {
        text = this.stateList[2].name;
      } else {
        if (status === "0") {
          text = this.stateList[0].name;
        } else if (status === "2") {
          text = this.stateList[2].name;
        } else {
          text = this.stateList[1].name;
        }
      }
      return text;
    },
    regionChange(val) {},
    // 推流删选
    filterStreamStatus(value, row) {
      return row.streamControlStatus == value;
    },
    filterplayStatus(value, row) {
      return row.playStatus == value;
    },
    filterOpenStatus(value, row) {
      return row.openStatus == value;
    },
    filterVirtual(value, row) {
      return row.reportSource == value;
    },
    //自定义操作列标题内容
    renderHeader(h, { c, d }) {
      let vm = this;
      return (
        <div>
          <span>操作</span>
          <span
            onClick={() => {
              this.customColVisible = true;
            }}
            class="select-question"
          ></span>
        </div>
      );
    },
    showReviewDialog(id){
      this.borrowId = id;
      this.dialogVisible = true
    },
    confirmCustomCols() {
      _.each(this.cameraColData, it => {
        let col = _.find(this.showCols, v => {
          return v === it.key;
        });
        if (!col) {
          it.istrue = false;
        } else {
          it.istrue = true;
        }
      });
      this.tableVisible = false;
      this.$nextTick(() => {
        this.tableVisible = true;
      });
      this.customColVisible = false;
    },
    handleCurrentChange(current) {
      this.video.current = current;
      this.cloudList();
    },

    handleVideoSizeChange(size) {
      this.video.pageSize = size;
      this.cloudList();
    },
    // 查看更多
    seachMore() {
      this.isAllHeight++;
    },
    /**
     * 获取省份列表
     */
    loadArea() {
      this.$api
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
        .catch(() => {});
    },

    /**
     * 单位列表change事件
     * @param val
     */
    orgChange(val) {
      this.filters.roadCode = "";
      // this.roadList = [];
      this.filters.organizationId = "";
      if (val.length) {
        let orgId = val[val.length - 1];
        this.filters.organizationId = orgId;
        this.queryRoadList(orgId);
        this.queryUpCloud();
      }
    },

    changeDirection(val) {
      this.filters.direction = val;
    },
    changCameraType(val) {
      this.filters.cameraType = val;
    },
    changeTransCode(val) {
      this.filters.upCloud = val;
    },

    changeCamera(val) {
      this.filters.cameraState = val;
    },

    roadChange(val) {
      this.filters.roadCode = val;
    },

    loadDirection() {
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "DERECTION"
        })
        .then(data => {
          if (data.code == "200") {
            _this.directionList = data.data;
          }
        });
    },

    //获取所有类别
    loadClassify() {
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "CLASSIFY"
        })
        .then(data => {
          if (data.code == "200") {
            _this.classifyList = data.data;
          }
        });
    },

    queryRoadList(orgId) {
      let _this = this;
      this.$api
        .getRoadsByOrgId({ regionCode: orgId + "" })
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.roadList = data.data;
        })
        .catch(() => {});
    },

    queryUpCloud() {
      let _this = this,
        params = {};
      params = {
        currPage: 0,
        pageSize: 0,
        provinceCode: this.filters.provinceCode,
        organizationCode: this.filters.organizationId
      };
      this.$api.getTranscodingList(params).then(msg => {
        _this.transCodeList = msg.data;
      });
    },

    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree(params)
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data;
          _this.orgTreeList = nlist;
        })
        // .catch(error => {
        //   this.$message({
        //     message:
        //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
        //     type: "error"
        //   });
        // });
    },
    handledig(id){
      this.digid = id;
      this.dialogTableVisible = true
      let params = {
        borrowId: id,
        currPage: this.currentPage,
        pageSize: this.pagesize,
      };
      this.$api.getBorrowCamerasList(params).then(msg => {
        this.gridData = msg.data;
      });
    },

    //点击选择获取列表
    choice(id) {
      this.borrowId = id;
      this.$nextTick(() => {
         this.dialogTableVisibles = true;
      })
     
    },
    queryList() {
      this.filters.currPage = 1;
      this.getBorrowListData();
    },
    getBorrowListData() {
      let obj = {};
      if (
        this.searchInfo.selectDate == null ||
        this.searchInfo.selectDate == ""
      ) {
        obj = {
          applyStartTime: "",
          applyEndTime: "",
          regionCode: this.filters.provinceCode,
          auditStatus: this.oValue,
          status: this.oEffective
        };
      } else {
        obj = {
          currPage: curPage || this.currentPage,
          regionCode: this.filters.provinceCode,
          auditStatus: this.oValue,
          status: this.oEffective,
          applyStartTime: this.searchInfo.selectDate[0]
            ? this.searchInfo.selectDate[0]
            : "",
          applyEndTime: this.searchInfo.selectDate[1]
            ? this.searchInfo.selectDate[1]
            : ""
        };
      }
      console.log(obj, "regionCode");
      this.$api.getBorrowList(obj).then(res => {
        if (res.code == 200) {
          this.listData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    resetSerach() {
      (this.searchInfo.selectDate = ""), (this.filters = "");
      (this.oEffective = ""), (this.oValue = ""), this.getBorrowListData();
    },
    /**
     * 多选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
      this.filters.currPage = val;

      if (this.isCloudGateway) {
        return this.getGatewayCameraList();
      }

      this.query();
    },

    // 重置
    // resetCloud() {
    //   (this.gatewayQuery = {
    //     kmPileMax: "",
    //     kmPileMin: "",
    //     transcodingId: "",
    //     classifyCode: "",
    //     cameraType: "",
    //     synOnlineStatus: "" //摄像机状态
    //   }),
    //     this.getGatewayCameraList();
    // },
    /**
     * 后退
     */
    goback() {
      var that = this;
      if (this.$route.params.id) {
        this.$router.push({
          name: "流媒体详情",
          params: {
            id: that.$route.params.id
          }
        });
      } else {
        this.isCloudGateway = false;
        this.multipleSelection = [];
        this.filters.currPage = this.gatewayCurrentPage;
        this.query();
      }
    },
    submitRview(){
      let api = null;
      if(this.activeName === '1'){
        api = this.$api
        .auditAgree({
          borrowId: this.borrowId
        })
      }else {
        api =  this.$api
        .submitReject({
          borrowId: this.borrowId,
          borrowAuditRejectReq: this.borrowAuditRejectReq
        })
      }
      api.then(data => {
          if (data.code !== 200) {
            this.$message({
              type: 'error',
              message: data.message
            })
            return
          }
          this.dialogVisible = false;
          this.getBorrowListData();
        })
    },
    roadBtn(){
      this.dialogTableVisible =true;
    },
  },
  mounted() {
    this.getBorrowListData();
    if (this.$route.params.id) {
      this.isCloudGateway = true;
      this.gatewayQuery.transcodingId = this.$route.params.transcodingId;
      this.getGatewayCameraList();
    } else {
      this.queryList();
      this.queryOrgList();
      this.loadArea();
      this.loadDirection();
      this.loadClassify();
      this.queryRoadList("");
      this.queryUpCloud();
    }
  }
};
</script>

<style lang="less" src="../../css/CameraManager.less"></style>
<style lang="less">
.gd-dialog-check {
  height: calc(~"100% - 40px");
}
.dialog-footer {
  text-align: right;
}
.device-group-dialog.gd-dialog {
  height: auto;
}
.camera-manage-con {
  height: calc(100% - 14px - 20px);
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.borrowCardItem .el-row {
  line-height: 40px;
  border-bottom: 2px solid rgba(208, 215, 222, 1);
  margin: 0 !important;
}
.borrowCard .box-card {
  margin-bottom: 12px;
  height: 100%;
}

.reviewed {
  background-image: linear-gradient(to right, #fcedd7, #f9d29a);
  opacity: 0.5;
  color: #e78f14;
  font-size: 20px;
  width: 405px;
  height: 71px;
  line-height: 71px;
}
.pink {
  background-image: linear-gradient(to right, #ffc5b8, #f9b0a0);
  opacity: 0.5;
  color: #ff634e;
  font-size: 20px;
  width: 405px;
  height: 71px;
  line-height: 71px;
}
.agree {
  background-image: linear-gradient(to right, #afebd4, #75e7b3);
  opacity: 0.5;
  color: #2cb58d;
  font-size: 20px;
  width: 405px;
  height: 71px;
  line-height: 71px;
}
.borrowCard .el-card__header {
  padding: 0 !important;
}
.auditStatusLess {
  opacity: 1;
}
.borrowCardItem {
  width: 405px;
  height: 420px;
  float: left;
  margin: 0 20px 20px 0;
}
.borrowCardItem .el-card__body {
  padding: 0 20px !important;
}
.borrowCardItem .box-card .el-col-8 span {
  color: #939598;
}
.btn {
  border: 0;
}
</style>
