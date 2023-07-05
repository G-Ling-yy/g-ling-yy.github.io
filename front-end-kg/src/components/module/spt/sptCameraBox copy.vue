<template>
  <div class="content-wrapper camera-manage-wrapper" ref="viewbox">
    
    <div class="camera-manage-con" style="{height: calc(100% - 14px - 20px)}">
      <!--搜索框-->
      <div v-if="!isCloudGateway" class="camera-search-display camera-manage-search">
        <!-- <div> -->
        <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
          <el-form :inline="true">
            <!-- <el-form-item label="所属省份：">
            <el-select
              filterable
              placeholder="全国"
              v-model="filters.provinceCode"
              style="width: 120px;"
              @change="selProviceVal"
            >
              <el-option
                v-for="item in provinces"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="管辖单位:">
            <el-cascader
              v-model="jurisdictionValue"
              :class="jurisdictionList.length ? 'input-selected' : ''"
              clearable
              filterable
              :show-all-levels="false"
              :options="orgTreeList"
              :props="orgCodeProps"
              style="width: 150px"
              @change="orgChange"
              @clear="orgChange"
            ></el-cascader>
          </el-form-item>
            <el-form-item label="接入方:">
            <el-select
              v-model="cameraStateValue"
              filterable
              placeholder="请选择"
              style="width:120px"
              @change="changeCamera"
              clearable
            >
              <el-option
                v-for="item in cameraStateList"
                :key="item.state"
                :label="item.cameraState"
                :value="item.state"
              ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="接入方名称:">
              <el-input v-model="filters.transcodingId" placeholder="请输入网关/平台名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="search-btn-right">
          <div class="btn-padding">
            <el-button type="primary" class="selectquery" @click="queryList">查询</el-button>
            <el-button type="primary" class="reset" @click="resetSerach">重置</el-button>
          </div>
        </div>
      </div>
      <!--卡片区域-->
      <div>
        <div class="CameraBoxCard" v-if="listData.length>0">
        <el-card class="box-card camerabox-cards" v-for="(item , index) in listData" :key="index">
        <div slot="header" class="clearfix card-province">
          <span>{{item.transcodingName}}</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          <el-tag type="success" v-if="item.reportSource===1" style="float: right; padding: 3px 10px;background-color:#1274EE;color:#fff"> 网关 </el-tag>
          <el-tag type="info" v-if="item.reportSource===2" style="float: right; padding: 3px 10px"> 平台 </el-tag>
        </div>
        <div v-if="item.reportSource===1" class="reportSourceOne">
          <li>省份：{{item.regionId}}</li>
          <li>管辖单位：{{item.organizationId}}</li>
          <li>最大接入量：{{item.maxChannelNum}}</li>
          <!-- （在线：<span>195</span>   离线：<span>0</span>） -->
          <li>已接入量：{{item.curChannelNum}}</li>
          <li>所属流媒体：{{item.streamMediaName}}  （剩余可接入量：{{item.streamRemainingAccessCount}}）</li>
          <li>联系人：{{item.contactPerson}}   {{item.contactPhone}}</li>
        </div>
        <div v-if="item.reportSource===2" class="reportSourceTwo">
          <li>省份：{{item.regionId}}</li>
          <li>所属组织: {{item.organizationId}}</li>
          <!-- （在线：<span>195</span>   离线：<span>0</span>） -->
          <li>已接入量：{{item.curChannelNum}}</li>
          <li v-if="item.reportSource===1">所属流媒体：{{item.streamMediaName}}  （剩余可接入量：{{item.streamRemainingAccessCount}}）</li>
          <li>联系人：{{item.contactPerson}}   {{item.contactPhone}}</li>
        </div>

        <div v-if="item.reportSource===1" class="ButtonGroup">
          <router-link :to="'/systemCameraBoxDetail?id='+item.deviceCode">
            <el-button class="Pending">待审核(<span>{{item.totalConfirmCameraNum}}</span>)</el-button>
          </router-link>
          <router-link :to="'/systemCameraPassDetail?id='+item.deviceCode">
          <el-button class="Pass">未通过<span style="color:#EF2707">({{item.rejectCameraNum}})</span></el-button>
          </router-link>
        </div>
        <div v-else class="ButtonGroupone">
            <router-link :to="'/systemCameraBoxDetail?id='+item.deviceCode">
              <el-button class="Pending">待审核(<span>{{item.totalConfirmCameraNum}}</span>)</el-button>
            </router-link>
            <router-link :to="'/systemCameraPassDetail?id='+item.deviceCode">
            <el-button class="Pass">未通过<span style="color:#EF2707">({{item.rejectCameraNum}})</span></el-button>
            </router-link>
        </div>
      </el-card>
      </div>
      <div v-else class="noData">
          <h1>暂无数据</h1>
      </div>
    </div>
      
    </div>
  </div>
</template>

<script>
import TrafficAmap from "../../cameraMap.vue";
import { mapState, mapActions } from "vuex";
import cameraDetail from "../equipment/cameraDetail";
import qs from "qs";
export default {
  components: {
    // CameraPlayDialog,
    cameraDetail,
    TrafficAmap
  },

  data() {
    return {
      select:'',
      selected:'',
      options:[],
      listData:{},
      showCols: [],
      dialogVisible: false,
      text: "",
      textarea: "",
      customColVisible: false,
      colOptions: [],
      colSelect: [],
      dialogTableVisible: false,
    //假数据
     gridData: [{
         title: '1',
         province:"黑龙江",
          unit: '浙江省交通投资集团有限公司杭金衢分公司',
          route: 'G3京台高速',
          stakeNo: 'K1518+750',
          category: '道路沿线'
        }, {
         title: '2',
         province:"黑龙江",
          unit: '浙江省交通投资集团有限公司杭金衢分公司',
          route: 'G3京台高速',
          stakeNo: 'K1518+750',
          category: '道路沿线'
        }],

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
      jurisdictionValue: "", //管辖
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
        transcodingId: "",
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
          state: "",
          cameraState: "全部"
        },
        {
          state: "1",
          cameraState: "网关"
        },
        {
          state: "2",
          cameraState: "平台"
        }
      ],
      cameraStateValue: "",
      cameraTableLoading: false,
      tableList: [],
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
      dimensionList: [
        { name: "道路", code: "0" },
        { name: "服务区", code: "1" },
        { name: "收费站", code: "2" },
        { name: "隧道", code: "3" },
        { name: "ETC门架", code: "4" },
        { name: "加油站", code: "5" }
      ],
      cameraStatus: [
        { name: "离线", code: "0" },
        { name: "在线", code: "1" },
        { name: "故障", code: "2" }
      ],
      cameraTypeList: [
        { name: "监控型机枪", code: "1" },
        { name: "监控型球机", code: "2" },
        { name: "全景型", code: "3" },
        { name: "抓拍机", code: "4" }
      ],
      gatewayInfo: {},
      // 上云网关上回退当前页标记
      gatewayCurrentPage: 1,
      cloudVideoDetail: [], //云视频详情
      recordFilePath: "",
      downloadPath: "", //下载地址
      tableVisible: true
    };
  },
  created() {
    this.userInfo = this.$router.history.current.query;
    this.queryCameraList();
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
    ...mapState(["deviceStatistics","provinces"]),
    usePlayerType() {
      // return 'ali';
      return this.$root.playerType;
    }
  },
  methods: {
    ...mapActions(["getCameraPlayUrl", "getPositionLat"]),
    handleCheckedCitiesChange(value) {},

      
    queryCameraList() {
      // this.cameraLoading = true;
      let params = {
        // organizationId: this.jurisdictionValue,
        organizationId: this.jurisdictionValue,
        transcodingId: this.filters.transcodingId,
        regionId:this.filters.provinceCode,
        pageSize: this.filters.pageSize,
        currPage: this.filters.currPage,
        reportSource:this.cameraStateValue
      };
      this.$api.getTemporaryList(params).then(res => {
        this.cameraLoading = false;
        this.listData = res.data;
        console.log('asdasdsadsad'+JSON.stringify(this.listData));
        this.cameratotal = res.total;
        this.firstTranscodingId = res.data.length ? res.data[0].deviceCode : "";
        // this.handleChange(this.firstTranscodingId);
      });

    },

    getStyles(status) {
      let background = "";
      if (!status) {
        background = this.stateList[2].color;
      } else {
        if (status === "0") {
          background = this.stateList[0].color;
        } else if (status === "2") {
          background = this.stateList[2].color;
        } else {
          background = this.stateList[1].color;
        }
      }

      return {
        width: "5px",
        height: "5px",
        display: "inline-block",
        "vertical-align": "middle",
        "margin-right": "5px",
        background: background
      };
    },
    //审核弹窗
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
        this.jurisdictionValue = val[val.length - 1]
        this.filters.organizationId = val ? this.orgTreeList.find(ele => ele.organizationId === val).organizationCode : ''
        // this.filters.organizationId = orgId;
        // this.queryRoadList(orgId);
        // this.queryUpCloud();
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
    handleDetail(row) {
      console.log(row, "审核详情数据");
      this.$router.push({ path: "/systemReportDetail", query:row});
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

    queryList() {
      // this.filters.currPage = 1;
      // this.selectquery();
      this.queryCameraList();
    },
    /**
     * 查询表格数据
     */
    selectquery() {
      let _this = this;
      //let load=Loading.service(this.loadOption);
      let params = {
        currPage: this.filters.currPage,
        pageSize: this.filters.pageSize,
        // playStatus: "",
        // openStatus: "",
        // userId: "",
        // provinceCode: this.filters.provinceCode,//备用
        // organizationName: "",
        transcodingName: this.filters.transcodingName,
        cameraName: this.filters.cameraName,
        kmPileMax: this.filters.endMileage, //
        kmPileMin: this.filters.startMileage, //
        // regionId: this.areaValue,
        regionId: this.filters.provinceCode, //
        organizationId: this.jurisdictionValue, //
        roadCode: this.filters.roadCode, //
        derectionCode: this.filters.direction, //
        classifyCode: this.filters.classify, //
        // transcodingName: this.filters.upCloud,
        cameraType: this.filters.cameraType,
        cameraStatus: this.filters.cameraState,
        cameraNum: this.filters.cameraNum,
        transcodingId:this.filters.upCloud,
      };
      console.log("名称为"+JSON.stringify(params.transcodingName))
      this.cameraTableLoading = true;
      this.$api
        .getCameraList(params)
        .then(res => {
          if (res.code != 200) {
            return Promise.reject();
          }
          this.tableList = [];
          this.tableList = _.map(res.data, it => {
            let classify = _.find(this.classifyList, {
              codeValue: it.classifyCode
            });
            let cameraType = _.find(this.cameraTypeList, {
              code: it.cameraType
            });
            let derectionCode = _.find(this.directionList, {
              codeValue: it.derectionCode
            });
            return {
              ...it,
              classifyCode: classify ? classify.codeName : "",
              derectionCode: derectionCode ? derectionCode.codeName : "",
              cameraType: cameraType ? cameraType.name : ""
            };
          });
          this.total = res.total;
          this.pages = res.pages;
          this.selectHandle = [];
          // if (res.data.total <= 10) {
          //   this.showPagination = false;
          // }
          for (var i = 0; i < this.tableList.length; i++) {
            this.tableList[i].checkModel = false;
          }

          this.cameraTableLoading = false;
          //load.close();
        })
        .catch(error => {
          //load.close();
          this.cameraTableLoading = false;
          this.$message.error(error.message);
        });
    },
    resetSerach() {
      this.areaValue = "";
      this.jurisdictionValue = "";
      this.classify = "";
      this.filters.roadCode = "";
      this.cameraStateValue = "";
      this.filters.startMileage = "";
      this.filters.endMileage = "";
      this.filters.direction = "";
      this.filters.classify = "";
      this.filters.upCloud = "";
      this.filters.cameraState = "";
      this.filters.organizationId = "";
      this.filters.cameraType = "";
      this.filters.cameraNum = "";
      this.filters.cameraName = "";
      this.filters.provinceCode = "";
      this.filters.transcodingId="";
      this.queryList();
    },
    //下拉框
    selProviceVal(val) {
      this.filters.provinceCode = val ? this.provinces.find(ele => ele.regionCode === val).regionName : ''
      //将下拉数据地区码转换为地区名
    },
    /**
     * 摄像机导出
     */
    exportCameraList(isDetail) {
      let mutilData = this.multipleSelection;
      let api = null;
      let caremanums = null;
      if (mutilData.length === 0) {
        let params = {
          cameraName: this.filters.cameraName,
          kmPileMax: this.filters.endMileage, //
          kmPileMin: this.filters.startMileage, //
          regionId: this.filters.provinceCode, //
          organizationId: this.filters.organizationId, //
          roadCode: this.filters.roadCode, //
          derectionCode: this.filters.direction, //
          classifyCode: this.filters.classify, //
          transcodingId: this.filters.upCloud,
          cameraType: this.filters.cameraType,
          cameraStatus: this.filters.cameraState,
          cameraNum: this.filters.cameraNum
        };
        api = this.$http.get(
          "/base/cameras/download/excel-detail/all?" + qs.stringify(params),
          {
            responseType: "blob"
          }
        );
      } else {
        caremanums = _.map(mutilData, it => it.cameraNum).join(",");
        api = this.$http.get(
          "/base/cameras/download/excel-detail/" + caremanums,
          {
            responseType: "blob"
          }
        );
      }
      api
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data.data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "摄像机信息表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "摄像机导出失败! ",
            type: "error"
          });
        });
    },
    /**
     * 多选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 用户批量操作触发
     * @param obj
     */
    mutilStatusAll(obj) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }

      // 判断是否为绑定到设备组 和 删除按钮触发
      if (obj == "addDeviceGroup") {
        this.getDeviceList();
        this.appendDeiveGroupDialogVisible = true;
        return;
      }

      let that = this,
        ar = obj.split("-"),
        dataList = [],
        idxAr = [];

      let msgAr = {
        stream: ["停流", "推流"],
        open: ["关闭", "开放"],
        display: ["隐藏", "显示"]
      };

      let msg = msgAr[ar[0]][ar[1]];

      // if (ar[0] === "stream" && that.multipleSelection.length > 20) {
      //   this.$message.warning("超出可一次控制数量，限制 20 个！");
      //   return false;
      // }

      this.$confirm("确定批量设定摄像机 " + msg + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm"
      })
        .then(() => {
          // 判断是否为推拉流
          switch (ar[0]) {
            case "stream":
              this.toggleStream(msg, ar[1]);
              break;
            case "open":
              this.toggleOpenStatus(ar[1], msg);
              break;
            case "display":
              this.toggleDisplayStatus(ar[1], msg);
              break;
          }

          // this.checkStatus({ checkMsg: msg, data: dataList });
        })
        .catch(() => {});
    },
    toggleStream(msg, status) {
      let cameraIds = _.map(this.multipleSelection, it => it.cameraNum);
      this.updateStreamStatus({
        checkMsg: msg,
        data: {
          openStatus: parseInt(status) === 1 ? "10" : "0",
          cameraIds: cameraIds,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量" + msg + cameraIds.length + "路摄像机"
          }
        }
      }).then(msg => {
        this.$forceUpdate();
        // this.$message({
        //   message: "添加成功",
        //   type: "success"
        // });
      });
    },
    toggleOpenStatus(status, msg) {
      let ids = _.map(this.multipleSelection, it => it.cameraNum);
      this.$api
        .batchUpdateOpen({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量 " + msg + ids.length + "路，摄像机"
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.query();
          }
        });
    },
    toggleDisplayStatus(status, msg) {
      let ids = _.map(this.multipleSelection, it => it.cameraNum);
      this.$api
        .batchUpdateDisplay({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量 " + msg + ids.length + "路，摄像机"
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.query();
          }
        });
    },

    /**
     * 摄像机删除
     */
    deleteCamera() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }
      this.$confirm("确定删除摄像机?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm"
      }).then(() => {
        var cams = [];
        for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
          cams.push(this.multipleSelection[i].cameraNum);
        }
        this.$api
          .deleteBatchCamera({
            cameraIds: cams,
            openStatus: "",
            instructions: {
              module: "资源管理",
              page: "摄像机管理",
              feature: "批量处理—删除",
              description: "批量删除" + cams.length + "路摄像机"
            }
          })
          .then(() => {
            this.query();
            // this.getGatewayCameraList();
          });
      });
    },

    /**
     * 触发推拉流方法
     * @param obj
     */
    updateStreamStatus(obj) {
      let msg = obj.checkMsg,
        itemList = obj.data.cameraIds;

      return this.$api
        .updateStreamStatus(obj.data)
        .then(res => {
          if (res.code !== 200) {
            return Promise.reject(res);
          }
          if (!_.isEmpty(res.data.failed)) {
            let HTMLText = "";
            _.each(res.data.failed, (v, k) => {
              HTMLText =
                HTMLText +
                "<p><span>" +
                k +
                ":</span><span>" +
                v +
                "</span></p>";
            });
            this.$alert(HTMLText, "警告", {
              dangerouslyUseHTMLString: true,
              type: "error"
            });
          }
          if (!_.isEmpty(res.data.success)) {
            this.$message({
              message: msg + "摄像机" + res.data.success, //msg+'播放摄像机成功',
              type: "success"
            });
            let cameraList = this.tableList,
              olen = cameraList.length,
              nlen = itemList.length;
            for (let i = 0; i < nlen; i++) {
              for (let j = 0; j < olen; j++) {
                if (
                  parseInt(cameraList[j].cameraId) === parseInt(itemList[i])
                ) {
                  cameraList[j].streamStatus = obj.data.status + "";
                  break;
                }
              }
            }
            this.getGatewayCameraList();
          }

          // this.query();
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: "error"
          });
        });
    },

    /**
     * 改变摄像机状态触发
     * @param obj
     */
    checkStatus(obj) {
      let msg = obj.checkMsg,
        itemList = obj.data;

      this.$api
        .updateOpStatus(obj.data)
        .then(data => {
          if (data.code !== 2000) {
            return Promise.reject(data);
          }
          this.$message({
            message: msg + "摄像机，" + data.message, //msg+'播放摄像机成功',
            type: "success"
          });
          let cameraList = this.tableList,
            olen = cameraList.length,
            nlen = itemList.length;
          for (let i = 0; i < nlen; i++) {
            for (let j = 0; j < olen; j++) {
              if (
                parseInt(cameraList[j].cameraId) ===
                parseInt(itemList[i].cameraId)
              ) {
                cameraList[j].openStatus = itemList[i].openStatus;
                cameraList[j].playStatus = itemList[i].playStatus;
                break;
              }
            }
          }
          this.getGatewayCameraList();
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: "error"
          });
        });
    },

    /**
     * 获取设备组列表
     */
    getDeviceList() {
      this.$api
        .getDeviceGroupList({
          currPage: 1,
          pageSize: 0
        })
        .then(res => {
          this.deviceGroupList = res.data;
        });
      return true;
    },
    /**
     * 摄像机添加到设备组
     */
    appendDeiveGroup() {
      var devs = [];
      if (!this.addDeiveGroupFrom.groupId) {
        return this.$message.warning("请选择添加到的设备组");
      }
      let name = _.find(this.deviceGroupList, {
        groupId: this.addDeiveGroupFrom.groupId
      }).groupName;
      for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
        devs.push(this.multipleSelection[i].cameraId);
      }
      this.$api
        .addDev({
          groupIds: [this.addDeiveGroupFrom.groupId],
          cameraIds: devs,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理—添加到设备组",
            description: "批量添加" + devs.length + "路摄像机到设备组: " + name
          }
        })
        .then(res => {
          if (res.code !== 200) {
            this.$message({
              type: "error",
              message: res.message
            });
            return;
          }
          this.appendDeiveGroupDialogVisible = false;
          this.addDeiveGroupFrom.groupId = "";
          this.$message.success("添加成功");
          this.getGatewayCameraList();
        });
    },

    /**
     * 添加设备组
     */
    addDeiveGroup() {
      if (!this.addDeiveGroupFrom.groupName) {
        return this.$message.warning("请输入设备组名称");
      }

      this.$api
        .addDeviceList({
          groupName: this.addDeiveGroupFrom.groupName,
          status: "1"
        })
        .then(res => {
          if (res.code !== 200) {
            this.$message({
              type: "error",
              message: res.message
            });
            return;
          }
          this.addDeiveGroupDialogVisible = false;
          this.addDeiveGroupFrom.groupName = "";
          this.getDeviceList();
          // new Promise(resolve => {
          //   resolve(this.getDeviceList());
          // }).then(res => {
          //   // console.log(res);
          //   // let val = this.deviceGroupList.filter(item => {
          //   //   return (item.groupName = this.addDeiveGroupFrom.groupName);
          //   // });
          //   // console.log(val);
          // });
        });
    },

    /**
     * 摄像机单个删除
     * @param obj
     */
    handleDelete(obj) {
      this.$confirm("确定删除摄像机?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm"
      }).then(() => {
        this.$api
          .deleteBatchCamera({
            cameraIds: [obj.cameraNum]
          })
          .then(res => {
            this.query();
            this.getGatewayCameraList();
          });
      });
    },

    /**
     * 视频播放
     * @param obj
     */
    handlePlay(obj) {
      this.playerCamera = obj;
      this.cameraId = obj.cameraId;
      this.playerDialogVisible = true;
      // obj.instructions = {
      //   module: "资源管理",
      //   page: "摄像机管理",
      //   feature: "播放视频",
      //   description:
      //     "播放："+ obj.cameraName,
      // }
      this.$nextTick(() => {
        this.$refs.cameraVideo.getVideoUrlToPlay(obj);
      });
    },
    /**
     * 查看摄像机详情
     * @param obj
     */
    handleWatch(obj) {
      let params = {
        id: obj.cameraNum
      };
      this.$api.getCameraDetails(params).then(res => {
        if (res.code == 200) {
          this.cameraDetailedInfo = res.data;
        }
        this.$refs.cameraDetail.cloudList();
      });
      // this.cameraDetailedInfo = obj;
      this.cameraDialogVisible = true;
    },
    clearCameraList() {
      this.$refs.cameraDetail.resetCurrent();
    },
    // 经纬度点击事件
    gatelonAndlat(obj) {
      this.lonAndlatOperation.visible = true;
      this.lonAndlatOperation.cameraName = obj.cameraName;
      this.lonAndlatOperation.cameraNum = obj.cameraNum;
      let latObj = {
        lon: obj.longAndLati.split("/")[0],
        lat: obj.longAndLati.split("/")[1]
      };
      this.getPositionLat(latObj).then(res => {
        if (res.code == 200) {
          let data = res.data;
          let list = _.map(data, it => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat
            };
          });
          this.$nextTick(() => {
            this.$refs.lonAndlatMap.cameraViewPoint(list, obj.cameraName);
          });
        }
      });
    },

    /**
     * 上云网关点击事件
     * @param obj
     */
    gatewayShow(obj) {
      this.gatewayCurrentPage = this.filters.currPage;
      this.filters.currPage = 1;
      this.gatewayQuery.transcodingId = obj.transcodingId;
      this.getGatewayInfo(obj.transcodingId);
      this.getGatewayCameraList();
      this.isCloudGateway = true;
      this.multipleSelection = [];
    },

    /**
     * 获取上云网关详情
     * @param id
     */
    getGatewayInfo(id) {
      let params = {
        id: id
      };
      this.$api.getGatewayInfo(params).then(res => {
        if (res.code != 200) {
          this.$message({
            message: res.code + res.message,
            type: "error"
          });
          return Promise.reject();
        }
        this.gatewayInfo = res.data;
        console.log(this.gatewayInfo);
        //做时间格式化处理
        this.gatewayInfo.createDate = this.timeFormat(
          this.gatewayInfo.gmtCreate
        );
      });
    },

    /**
     * 获取上云网关下的摄像机列表
     */
    getGatewayCameraList() {
      var obj = {
        currPage: this.filters.currPage,
        pageSize: this.filters.pageSize,
        cameraName: this.gatewayQuery.cameraName,
        kmPileMax: this.gatewayQuery.endMileage, //
        kmPileMin: this.gatewayQuery.startMileage, // // regionId: this.areaValue,
        //         regionId: this.gatewayQuery.provinceCode, //
        organizationId: this.gatewayQuery.organizationId, //
        roadCode: this.gatewayQuery.roadCode, //
        derectionCode: this.gatewayQuery.direction, //
        classifyCode: this.gatewayQuery.classify, //
        transcodingId: this.gatewayQuery.upCloud,
        cameraType: this.gatewayQuery.cameraType, // appName: "",
        onlineStatus: this.gatewayQuery.synOnlineStatus // connectionWay: "",
        //         cameraNum: this.gatewayQuery.cameraNumber
      };
      this.$api.getCameraList(obj).then(res => {
        if (res.code != 200) {
          return Promise.reject();
        }
        this.tableList = res.data;
        this.total = res.total;
        this.pages = res.pages;
      });
    },
    // 搜索
    cloudQuery() {
      this.getGatewayCameraList();
    },
    // 重置
    resetCloud() {
      (this.gatewayQuery = {
        kmPileMax: "",
        kmPileMin: "",
        transcodingId: "",
        classifyCode: "",
        cameraType: "",
        synOnlineStatus: "" //摄像机状态
      }),
        this.getGatewayCameraList();
    },
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
    timeFormat(time) {
      var d = new Date(time.substr(0, 19)); //加入substr(0, 19)处理兼容ios报错NAN
      var year = d.getFullYear(); //年
      var month = d.getMonth() + 1; //月
      var day = d.getDate(); //日

      var hh = d.getHours(); //时
      var mm = d.getMinutes(); //分
      var ss = d.getSeconds(); //秒

      var clock = year + "-";

      if (month < 10) clock += "0";

      clock += month + "-";

      if (day < 10) clock += "0";

      clock += day + " ";

      if (hh < 10) clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";

      if (ss < 10) clock += "0";
      clock += ss;
      return clock;
    }
    // cameraPlayDialogClose() {
    //   this.playerDialogDetailVisible = false;
    //   let box = this.$refs.videos;
    //   box.textContent = "";
    // }
  },
  mounted() {
    this.queryCameraList();
    if (this.$route.params.id) {
      this.isCloudGateway = true;
      this.gatewayQuery.transcodingId = this.$route.params.transcodingId;
      this.getGatewayCameraList();
      // this.getGatewayInfo(this.$route.params.id);
      this.getGatewayInfo(this.gatewayQuery.transcodingId);
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
.camerabox-cards,.platform-cards{
  border-radius: 15px;
  width: 366px;
  height: 400px;
  margin-bottom: 5px;
  float: left;
  margin-right: 5px;
}
// .ButtonGroupone {
// margin-top: 120px;
// }
.querytt{
    visibility: hidden; //将导出按钮隐藏
}
.card-province span:first-child{
  font-size:20px;
font-family:Microsoft YaHei;
font-weight:bold;
color:rgba(0,0,0,1);
line-height:40px;
}
.reportSourceTwo li{
  list-style: none;
  line-height: 28px;
  font-size: 14px;
}
.reportSourceOne li{
  list-style: none;
  line-height: 28px;
  font-size: 14px;
}
.platform-cards li{
  list-style: none;
  line-height: 59px;
  font-size: 14px;
}
.camerabox-cards li span:first-child{
  color: orange;
}
.camerabox-cards li span:last-child{
  color: red;
}
.Pending,.Pass{
  width: 150px !important;
  height: 40px !important;
  border-radius: 20px !important;
  margin-top: 20px !important;
  margin-right: 10px !important;
  margin-bottom: 20px !important;
  font-size: 16px;
}
.Pending{
  background: #F8ECDC
}
.Pass{
  background: #FCE3DC;
}
.Pending span{
  color: red;
}
.noData{
  width:100%;
  height:calc(100% - 185px);
  line-height: 120px;
  text-align: center;
  font-size: 28px;
  color:#606266;
}
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
</style>
