<template>
  <div class="content-wrapper camera-manage-wrapper" ref="viewbox">
    <!--头部导航-->
    <div  class="camera-manage-con">
      <div v-if="!isCloudGateway">
    </div>
    <!--搜索框-->
    <div v-if="!isCloudGateway" class="camera-search-display camera-manage-search">
      <!-- <div> -->
      <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
        <el-form :inline="true">
          <el-form-item>
            <el-cascader
              v-model="jurisdictionValue"
              :class="jurisdictionList.length ? 'input-selected' : ''"
              placeholder="请选择管辖单位"
              clearable
              :show-all-levels="false"
              :options="orgTreeList"
              :props="orgCodeProps"
              style="width: 150px"
              @change="orgChange"
              @clear="orgChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="filters.strRoadNames"
              :class="filters.strRoadNames ? 'input-selected' : ''"
              placeholder="路线"
              clearable
              style="width:120px"
              @change="roadChange"
              >
              <el-option label="全部路线" value></el-option>
              <el-option
                v-for="(item) in roadList"
                :key="item.strRoadNames + item.roadName"
                :label="item.roadName"
                :value="item.roadCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="cameraStateValue"
              filterable
              placeholder="上云网关状态"
              style="width:120px"
              @change="changeCamera"
              clearable
            >
              <el-option
                v-for="item in state"
                :key="item.state"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input 
              v-model="filters.transcodingName"
              style="width:200px" 
              placeholder="请输入网关名称"
              clearable
              ></el-input>
            </el-form-item>
          
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="queryList">查询</el-button>
          <el-button type="primary" class="reset" @click="resetSerach">重置</el-button>
        </div>
        <!-- <el-form>
        <el-form-item style="float:right">
                <el-button type="primary" plain class="query" @click="exportCameraList(gatewayQuery.transcodingId)">数据导出</el-button>
            </el-form-item>
            </el-form> -->
      </div>
    </div>
    <!--表格区域-->
    <!--  :class="isAllHeight % 2 == 0 ? 'camera-device-table-h' : 'table-wrapper-all camera-device-all'" -->
    <div class="table-control cloud-gateway-wrapper" v-if="isCloudGateway">
      <div class="cloud-gateway-header">
        <div class="title">
          <el-button
            type="primary"
            plain
            class="query"
            style="padding: 3px 0;width: 20PX;height: 20px;font-size: .6rem;margin: -2px 0 0 0px;"
            @click="goback()"
          >
            <i class="el-icon-top-left"></i>
          </el-button>
          <span style="padding-left:20px;">{{ gatewayInfo.transcodingName }}</span>
        </div>
        <div class="set-time">{{ gatewayInfo.createDate }}</div>
      </div>

    </div>
    <div
      v-if="tableVisible"
      class="table-content-body camera-table-h"
      >
      <!-- :style="isCloudGateway ? { height: 'calc(100% - 420px)' } : {}" -->
      <el-table
        class="custom-cloud-table"
        :data="tableList"
        v-loading="cameraTableLoading"
        style="width:100%"
        max-height="100%"
        @selection-change="handleSelectionChange"
        border
        ref="tableDataRef"
        >
        <el-table-column type="selection" align="center" width="50" fixed="left"></el-table-column>
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[0].istrue"
          :prop="cameraColData[0].key"
          :label="cameraColData[0].title"
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[1].istrue"
          :prop="cameraColData[1].key"
          :label="cameraColData[1].title"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[2].istrue"
          :prop="cameraColData[2].key"
          :label="cameraColData[2].title"
          min-width="300"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            v-if="cameraColData[3].istrue"
            :prop="cameraColData[3].key"
            :label="cameraColData[3].title"
            width="100"
          >
            <template slot-scope="scope">
              <div>
                <span :style="getStyles(scope.row.onlineStatus)"></span>
                <span style="vertical-align: middle">
                  {{
                  getStatuss(scope.row.onlineStatus)
                  }}
                </span>
              </div>
            </template>
          </el-table-column>
        <el-table-column 
          v-if="cameraColData[4].istrue" 
          :prop="cameraColData[4].key"
          :label="cameraColData[4].title"
          width="100"></el-table-column>
        
            
        <el-table-column 
          v-if="cameraColData[5].istrue" 
          :prop="cameraColData[5].key"
          :label="cameraColData[5].title"
          width="80"></el-table-column>
        <el-table-column 
          v-if="cameraColData[6].istrue" 
          :prop="cameraColData[6].key"
          :label="cameraColData[6].title"
          width="80"></el-table-column>
        <el-table-column
            v-if="cameraColData[7].istrue"
            :prop="cameraColData[7].key"
          :label="cameraColData[7].title"
            width="100"
          ></el-table-column>
        <el-table-column
            v-if="cameraColData[8].istrue"
            :prop="cameraColData[8].key"
            :label="cameraColData[8].title"
            min-width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[9].istrue"
            :prop="cameraColData[9].key"
            :label="cameraColData[9].title"
            min-width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[10].istrue"
            :prop="cameraColData[10].key"
            :label="cameraColData[10].title"
            min-width="200"
            show-overflow-tooltip
          ></el-table-column>
        
      </el-table>
    </div>
    <!--分页控件-->
    <div class="table-pagination">
                <p class="total-pagination">共{{total}}条</p>
      <el-pagination
        background
        layout=" prev, pager, next, sizes, jumper "
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="filters.currPage"
        :total="total"
      ></el-pagination>
    </div>
    </div>
    

    <!--添加到摄像机组弹窗-->
    <el-dialog
      title="添加到摄像机组"
      :visible.sync="appendDeiveGroupDialogVisible"
      width="400px"
      custom-class="gd-dialog device-group-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <el-form :model="addDeiveGroupFrom">
        <el-form-item label>
          <div style="color: #000000">
            已选择视频数：
            <span style="font-size: 18px;color: #1274EE">
              {{
              this.multipleSelection.length
              }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label class="clearfix">
          <el-select
            v-model="addDeiveGroupFrom.groupId"
            placeholder="请选择摄像机组"
            style="width: 82%;float: left;"
            clearable
          >
            <el-option
              v-for="(item, index) in deviceGroupList"
              :key="index"
              :label="item.groupName"
              :value="item.groupId"
            ></el-option>
          </el-select>
          <div
            style="float: right;margin: 0;width: 30px;height: 30px;"
            class="icon-img"
            @click="addDeiveGroupDialogVisible = true"
          ></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appendDeiveGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendDeiveGroup()">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增摄像机组弹窗-->
    <el-dialog
      title="新增摄像机组"
      :visible.sync="addDeiveGroupDialogVisible"
      custom-class="gd-dialog device-group-dialog"
      width="400px"
      height="auto"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <el-form :model="addDeiveGroupFrom">
        <el-form-item label>
          <div style="height:17px"></div>
        </el-form-item>
        <el-form-item label>
          <el-input v-model="addDeiveGroupFrom.groupName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label>
          <div style="height:18px"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDeiveGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDeiveGroup()">确 定</el-button>
      </div>
    </el-dialog>

    <!--摄像机播放弹窗-->
    <camera-play-dialog
      v-if="playerDialogVisible"
      :visible.sync="playerDialogVisible"
      :cameraInfo="playerCamera"
      :cameraId="cameraId"
      ref="cameraVideo"
    ></camera-play-dialog>
    <el-dialog
      title="播放视频"
      :visible="playerDialogDetailVisible"
      width="885px"
      @close="cameraPlayDialogClose"
      custom-class="gd-dialog camera-player-dialog gd-custom-dialog"
      v-dialogDrag="{ fullScreen: false }"
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <div ref="videos"></div>
    </el-dialog>
    <!--摄像机详情弹窗-->
    <el-dialog
      title="查看详情"
      :visible.sync="cameraDialogVisible"
      width="879px"
      custom-class="gd-dialog camera-details-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="clearCameraList"
      >
      <camera-detail
        v-if="cameraDialogVisible"
        ref="cameraDetail"
        :cameraDetailedInfo="cameraDetailedInfo"
      ></camera-detail>
    </el-dialog>
    <el-dialog
      :title="lonAndlatOperation.cameraName"
      :visible.sync="lonAndlatOperation.visible"
      custom-class="gd-dialog"
      width="80%"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <div style="height:100%;">
        <TrafficAmap ref="lonAndlatMap" :cameraNumber="lonAndlatOperation.cameraNum"></TrafficAmap>
      </div>
    </el-dialog>
    <el-dialog
      title="自定义列"
      :visible.sync="customColVisible"
      width="40%"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      >
      <div style="height: 100%">
        <el-checkbox-group
          v-model="showCols" 
          class="gd-dialog-check"
          @change="handleCheckedCitiesChange">
          <el-checkbox v-for="col in cameraColData" :label="col.key" :key="col.key" :checked="col.istrue">{{col.title}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customColVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmCustomCols()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TrafficAmap from "../../cameraMap.vue";
//import {Loading} from "element-ui";
import { mapState, mapActions } from "vuex";
import CameraPlayDialog from "../CameraManage/CameraPlayDialog";
import cameraDetail from "../equipment/cameraDetail";
import qs from 'qs';
export default {
  components: {
    CameraPlayDialog,
    cameraDetail,
    TrafficAmap
  },

  data() {
    return {
      showCols: [],
      // 自定义列
      cameraColData: [
        { title: "上云网关名称", istrue: true, key: "transcodingName" },
        { title: "管辖单位", istrue: true, key: "organizationName" },
        { title: "所属路线", istrue: true, key: "strRoadNames" },
        { title: "开放状态", istrue: true, key: "onlineStatus" },
        { title: "最大接入量", istrue: true, key: "channelNum" },
        { title: "已接入量", istrue: true, key: "alreadyChannelNum" },
        { title: "在线数", istrue: true, key: "onlineChannelNum" },
        { title: "离线数", istrue: true, key: "offlineChannelNum" },
        { title: "设备厂商", istrue: true, key: "organizationName" },
        { title: "联系人", istrue: true, key: "contactPerson" },
        { title: "联系人电话", istrue: true, key: "contactPhone" },
      ],
      customColVisible: false,
      colOptions: [],
      colSelect: [],
      cameraId: "",
      lonAndlatOperation: {
        visible: false,
        cameraName: "",
        cameraNum: "",
        transcodingName:""
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
        children: "childList",
        checkStrictly: true
        //lazyLoad:this.propsLazyload
      },
      directionList: [], //摄像机方向
      startMileage: "",
      endMileage: "",
      filters: {
        onlineStatus:"",
        transcodingName:"",
        offlineChannelNum:"",
        onlineChannelNum:"",
        channelNum:"",
        alreadyChannelNum:"",
        contactPhone:"",
        contactPerson:"",
        provinceCode: "",
        organizationName: "",
        vendorDesc:"",
        strRoadNames: "",
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
      state: [
        {
          code: "0",
          name: "离线"
        },
        {
          code: "1",
          name: "正常"
        },
        {
          code: "3",
          name: "故障"
        }
      ],
      cameraStateValue: "",
      cameraName:"",
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
        { name: "故障", color: "#878787" },
        { name: "正常", color: "#26B55F" },
        { name: "离线", color: "#F9552F" }
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
      onlineStatus: [
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
  created() {},
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
    ...mapState(["deviceStatistics"]),
    usePlayerType() {
      // return 'ali';
      return this.$root.playerType;
    }
  },
  methods: {
    ...mapActions(["getCameraPlayUrl", "getPositionLat"]),
    handleCheckedCitiesChange(value){

      
    },
    getStyles(status){
        let background = ''
        if(!status){
          background = this.stateList[2].color;
        }else {
          if(status === '0'){
            background = this.stateList[0].color;
          }else if(status === '2'){
            background = this.stateList[2].color;
          }else {
            background = this.stateList[1].color;
          }
        }
      
        return {
          width:'5px',
          height:'5px',
          display:'inline-block',
          'vertical-align': 'middle',
          'margin-right': '5px',
          background:background
        }
    },
    getStatuss(status){
      let text = ''
      if(!status){
        text = this.stateList[2].name;
      }else {
        // if(status === '4'){
        //   text = this.stateList[0].name;
        // }else if(status === '3'){
        //   text = this.stateList[2].name;
        // }else {
        //   text = this.stateList[1].name;
        // }
        if(status === '0'){
          text = this.stateList[0].name;
        }else if(status === '2'){
          text = this.stateList[2].name;
        }else {
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
      return row.displayStatus == value;
    },
    filterOpenStatus(value, row) {
      return row.openStatus === value;
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
    confirmCustomCols(){
      _.each(this.cameraColData, it => {
        let col = _.find(this.showCols, v => {
          return v === it.key;
        });
        if(!col){
          it.istrue = false;
        }else {
          it.istrue = true;
        }
      })
      this.tableVisible = false;
      this.$nextTick(() => {
        this.tableVisible = true;
      })
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
      this.filters.strRoadNames = "";
      // this.roadList = [];
      this.filters.organizationName = "";
      if (val.length) {
        let orgNm = val[val.length - 1];
        this.filters.organizationName = orgNm;
        this.queryRoadList(orgNm);
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
      this.filters.strRoadNames = val;
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
    loadCameraType(){
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "CAMERA_TYPE"
        })
        .then(data => {
          if (data.code == "200") {
            _this.cameraTypeList = data.data;
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

    queryRoadList(orgNm) {
      let _this = this;
      this.$api
        .getRoadsByOrgId({ regionCode: orgNm + "" })
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
        organizationCode: this.filters.organizationName
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
          let nlist = data.data[0].childList;
          _.each(nlist, it => {
            it.disabled = true;
          });
          _this.orgTreeList = nlist;
        })
        .catch(error => {
          this.$message({
            message:
              "获取组织架构树失败! [" + error.code + "]: " + error.message,
            type: "error"
          });
        });
    },

    queryList() {
      this.filters.currPage = 1;
      this.query();
    },
    /**
     * 查询表格数据
     */
    
    query() {
      let _this = this;
      //let load=Loading.service(this.loadOption);
      let params = {
        currPage: this.filters.currPage,
        pageSize: this.filters.pageSize,
        strRoadNames: this.filters.strRoadNames, //
        onlineStatus:this.cameraStateValue,
        transcodingName:this.filters.transcodingName,
        organizationId: this.jurisdictionValue[this.jurisdictionValue.length - 1]
      };
      console.log(params,"dsdada")
      this.cameraTableLoading = true;
      this.$api
        .getTranscodingList(params)
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
              codeValue: it.cameraType
            });
            let derectionCode = _.find(this.directionList, {
              codeValue: it.derectionCode
            });
            return {
              ...it,
              classifyCode: classify ? classify.codeName : '',
              derectionCode: derectionCode ? derectionCode.codeName: '',
              cameraType: cameraType ? cameraType.codeName : ''
            }
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
      this.filters.strRoadNames = "";
      this.cameraStateValue = "";
      this.filters.startMileage = "";
      this.filters.endMileage = "";
      this.filters.direction = "";
      this.filters.classify = "";
      this.filters.upCloud = "";
      this.filters.cameraState = "";
      this.filters.organizationName = "";
      this.filters.cameraType = "";
      this.filters.cameraNum = "";
      this.filters.cameraName = "";
      this.filters.provinceCode = "";

      this.filters.vendorDesc=""
      this.queryList();
    },
    /**
     * 摄像机导出
     */
    exportCameraList(transcodingId) {
      // let mutilData = this.multipleSelection;
      // if (mutilData.length === 0) {
      //   this.$message.warning("请选择要导出的摄像机！");
      //   return false;
      // }
      // let transcodingId = _.map(mutilData, it => it.cameraNum).join(",");
      this.$http
        .get("/base/cameras/download/camera-info?transcodingId=" + transcodingId, {
          responseType: "blob"
        })
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data.data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "网关管理列表.xlsx"; // 下载后文件名
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

      // 判断是否为绑定到摄像机组 和 删除按钮触发
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
              this.toggleStream(ar[1],msg,);
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
    toggleStream(msg, status, row) {
      let cameraIds = null;
      if(row){
        cameraIds = [row.cameraNum]
      }else {
        cameraIds = _.map(
          this.multipleSelection,
          it => it.cameraNum
        )

      }
      this.updateStreamStatus({
        checkMsg: msg,
        data: {
          openStatus: parseInt(status) === 1 ? '10' : '0',
          cameraIds: cameraIds,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description:
              "批量"+ msg + cameraIds.length + '路摄像机',
          }
        }
      }).then(msg => {
        // this.$forceUpdate();
        this.query();
        // this.$message({
        //   message: "添加成功",
        //   type: "success"
        // });
      });
    },
    toggleOpenStatus(status, msg, row) {
      let ids = null;
      if(row){
        ids = [row.cameraNum]
      }else {
        ids = _.map(
          this.multipleSelection,
          it => it.cameraNum
        )

      }
      this.$api.batchUpdateOpen({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description:
              "批量 "+msg + ids.length + '路，摄像机',
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.query();
          }
        });
    },
    toggleDisplayStatus(status, msg, row) {
      let ids = null;
      if(row){
        ids = [row.cameraNum]
      }else {
        ids = _.map(
          this.multipleSelection,
          it => it.cameraNum
        )

      }
      this.$api
        .batchUpdateDisplay({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description:
              "批量 "+msg + ids.length + '路，摄像机',
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
              description:
                  "批量删除"+ cams.length + "路摄像机"
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
          if(!_.isEmpty(res.data.failed)){
            let HTMLText = '';
            _.each(res.data.failed, (v, k) => {
              HTMLText = HTMLText + "<p><span>"+k+":</span><span>" +v+ "</span></p>"
            })
            this.$alert(HTMLText, '警告', {
              dangerouslyUseHTMLString: true,
              type: 'error'
            })
          }
          if(!_.isEmpty(res.data.success)){
            this.$message({
              message: msg + "摄像机" + res.data.success, //msg+'播放摄像机成功',
              type: "success"
            });
            let cameraList = this.tableList,
              olen = cameraList.length,
              nlen = itemList.length;
            for (let i = 0; i < nlen; i++) {
              for (let j = 0; j < olen; j++) {
                if (parseInt(cameraList[j].cameraId) === parseInt(itemList[i])) {
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

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      this.filters.pageSize = index;
      this.filters.currPage = 1;

      if (this.isCloudGateway) {
        //
        return this.getGatewayCameraList();
      }

      this.query();
    },
    /**
     * 获取摄像机组列表
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
     * 摄像机添加到摄像机组
     */
    appendDeiveGroup() {
      var devs = [];
      if (!this.addDeiveGroupFrom.groupId) {
        return this.$message.warning("请选择添加到的摄像机组");
      }
      let name = _.find(this.deviceGroupList, {
        groupId: this.addDeiveGroupFrom.groupId
      }).groupName
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
            feature: "批量处理—添加到摄像机组",
            description:
                "批量添加"+ devs.length + "路摄像机到摄像机组: " + name
          }
        })
        .then((res) => {
          if(res.code !== 200){
            this.$message({
              type: 'error',
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
     * 添加摄像机组
     */
    addDeiveGroup() {
      if (!this.addDeiveGroupFrom.groupName) {
        return this.$message.warning("请输入摄像机组名称");
      }

      this.$api
        .addDeviceList({
          groupName: this.addDeiveGroupFrom.groupName,
          status: "1",

        })
        .then((res) => {
          if(res.code !== 200){
            this.$message({
              type: 'error',
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
      let latObj = [{
        lon: obj.longAndLati.split('/')[0],
        lat: obj.longAndLati.split('/')[1],
        cameraName: obj.cameraName,
        cameraNum: obj.cameraNum
      }];
      this.$api.getPositionLatNew(latObj).then(res => {
        if (res.code == 200) {
          let data = res.data;
          let list = _.map(data, it => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat,
              cameraNum: it.cameraNum,
              cameraName: it.cameraName
            }
          });
          this.$nextTick(() => {
            this.$refs.lonAndlatMap.cameraViewPoint(list, obj.cameraName);
          });
        }else if(res.code !== 200){
          this.$message({
            message: res.message,
            type: "error"
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
        console.log(this.gatewayInfo)
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
        organizationName: this.gatewayQuery.organizationName, //
        strRoadNames: this.gatewayQuery.strRoadNames, //
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
        let vm = this;
        this.tableList = _.map(res.data, it => {
          let classify = _.find(vm.classifyList, {
            codeValue: it.classifyCode
          });
          let cameraType = _.find(vm.cameraTypeList, {
            codeValue: it.cameraType
          });
          let derectionCode = _.find(vm.directionList, {
            codeValue: it.derectionCode
          });
          return {
            ...it,
            classifyCode: classify ? classify.codeName : '',
            derectionCode: derectionCode ? derectionCode.codeName: '',
            cameraType: cameraType ? cameraType.codeName : ''
          }
        });
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
    },
    cameraPlayDialogClose() {
      this.playerDialogDetailVisible = false;
      let box = this.$refs.videos;
      box.textContent = "";
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.isCloudGateway = true;
      this.gatewayQuery.transcodingId = this.$route.params.transcodingId;
      this.loadCameraType();
      this.getGatewayCameraList();
      // this.getGatewayInfo(this.$route.params.id);
      this.getGatewayInfo(this.gatewayQuery.transcodingId);
    } else {
      this.queryOrgList();
      this.loadArea();
      this.loadDirection();
      this.loadClassify();
      this.loadCameraType();
      this.queryRoadList("");
      this.queryUpCloud();
      setTimeout(() => {
        this.queryList();
      }, 1000)
    }
  }
};
</script>

<style lang="less" src="../../css/CameraManager.less"></style>
<style lang="less">
.gd-dialog-check {
  height: calc(~'100% - 40px');
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
