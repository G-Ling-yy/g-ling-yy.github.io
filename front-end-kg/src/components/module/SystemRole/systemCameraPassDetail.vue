<template>
  <div class="The-cloud content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>摄像机审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="background: #fff;">
      <div class="system-camera-notpass-title">
        <i 
          class="el-icon-back"
          @click="$router.push('/systemCameraBox')"
          ></i>
        <span>{{$router.history.current.query.title}}</span>
      </div>
      <div v-loading="cameraLoading">
        <div class="content">
          <div class="con-footer">
            <div
              v-model="firstTranscodingId"
              accordion
            >
                <div class="table-wrapper-cameras">
                  <div class="table-control">
                    <div class="tab-wrapper">
                      <div
                        :class="verifyType === 1 ? 'active' : ''"
                        @click="newCameraViewData"
                      >新增{{ CameraPassDetail.newAdd}}</div>
                      <div
                        :class="verifyType === 2 ? 'active' : ''"
                        @click="updateCameraData"
                      >更新{{ CameraPassDetail.update }}</div>
                      <div
                        :class="verifyType === 3 ? 'active' : ''"
                        @click="deleteCameraData"
                      >删除{{ CameraPassDetail.delete }}</div>
                    </div>
                    <div class="cameraStatus-btn">
                      <el-button
                        type="primary"
                        plain
                        class="query btn-c"
                        @click="exportCameraList()"
                      >数据导出</el-button>
                    </div>
                  </div>
                </div>
                <div v-if="!temporaryList.length" class="noData">暂无数据</div>
                <div class="footer-table" v-else>
                  <el-table
                    ref="singleTable"
                    @selection-change="handleSelectionChange"
                    :data="temporaryList"
                    highlight-current-row
                    style="width: 100%"
                    border
                    v-loading="newCameraload"
                  >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index" label="序号" width="70"></el-table-column>
                    <el-table-column label="地区" width="200">
                      <template slot-scope="scope">
                        <span>{{ scope.row.regionName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column property="roadSection" label="管辖单位" width="120"></el-table-column>
                    <el-table-column property="poiName" label="所属路线" width="120"></el-table-column>
                    <el-table-column property="cameraName" label="摄像机名称" width="300"></el-table-column>
                    <el-table-column property="kmHmPile" label="桩号" width="120"></el-table-column>
                    <el-table-column property="longitude" label="经纬度" width="280">
                      <!-- 判断点击了哪个按钮，返回的数据不同 -->
                      <template slot-scope="scope">
                        <div v-if="verifyType===2">
                          <div
                            style="text-decoration: line-through; color:#808080; cursor:pointer"
                          >{{ scope.row.longAndLati }}
                          </div>
                          <div
                            style="color:#94E61A; cursor:pointer"
                          >{{ scope.row.longAndLati }}
                        </div>
                        </div>
                        <div v-else>
                            <div
                              style="text-decoration: underline; color:#808080; cursor:pointer"
                            >{{ scope.row.longitude }}/{{scope.row.latitude}}
                            </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column property="classifyCode" label="所属类别" width="100"></el-table-column>
                    <el-table-column property="derectionCode" label="方向" width="80"></el-table-column>
                    <el-table-column property="cameraType" label="摄像机类型" width="120"></el-table-column>
                    <el-table-column property="reportTime" label="提交时间" width="170"></el-table-column>
                    <!-- <el-table-column label="审核">
                        <el-link type="primary">审核</el-link>
                    </el-table-column> -->
                  </el-table>
                  <!--分页控件-->
                  <div v-if="newData.newtotal > 9">
                    <!-- <el-pagination
                      background
                      layout=" prev, pager, next, sizes, jumper "
                      :current-page="newData.currPage"
                      @current-change="handleNewPageChange"
                      @size-change="handleNewSizeChange"
                      :total="newData.newtotal"
                    ></el-pagination> -->
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <el-dialog
      :title="!this.isUpdate ? newTitle : upDateTitle"
      :visible.sync="mapVisable"
      custom-class="gd-dialog camera-player-dialog gd-custom-dialog"
      width="80%"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <TrafficAmap ref="cameraMap"></TrafficAmap>
    </el-dialog>
<!-- v-if="temporaryList && temporaryList.length > 9" 分页展示条件 -->
    <div class="table-pagination" v-if="temporaryList.length > 0">
      <p class="total-pagination">共{{newData.newtotal}}条</p>
      <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="this.newData.currPage"
          :page-size="newData.pageSize"
          :total="newData.newtotal"
        ></el-pagination>
      <!-- <el-pagination
        background
        layout=" prev, pager, next, sizes, jumper "
        :current-page="newData.currPage"
        :page-size="newData.pageSize"
        @current-change="handleNewPageChange"
        @size-change="handleNewSizeChange"
        :total="newData.newtotal"
      ></el-pagination> -->
      <!-- <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        >
      </el-pagination> -->
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
import TrafficAmap from "../../cameraMap.vue";
export default {
  name: "cameraView",

  data() {
    return {
      selected:'',
      verifyType: 1,
      type:'',
      passDetail:'',
      isAllHeight: 0,
      markList: [],
      temporaryList: [],
      CameraPassDetail:[],
      // activeInfo: "",
      isState: "",
      state: [],
      // jurisdictionValue: "",
      downvendor: "",
      options2: [],
      listData: [],
      regionName: "",
      transcodingName:"",
      reportSource:"",
      options1: [],
      orgCodeProps: "",
      isUpdate: false,
      couldGateWay: "",
      jurisdiction: "",
      provinceCode: "",
      cameratotal: 0,
      newCameraload: false,
      cameraLoading: false,
      updateLoading: false,
      newData: {
        newCameraList: [],
        transcodingId: "",
        pageSize: 10,
        currPage: 1,
        newtotal: 0,
        longitude: 0,
        latitude: 0
      },
      upDateTitle: "",
      newTitle: "",
      firstTranscodingId: 0,
      mapVisable: false,
      regionCode: null,
      currentMapRegionCode: null,
      updateData: {
        total: 0,
        list: []
      },
      delData: {
        total: 0,
        list: []
      },
      cameraTypeList: [
        { name: "监控型机枪", code: "1" },
        { name: "监控型球机", code: "2" },
        { name: "全景型", code: "3" },
        { name: "抓拍机", code: "4" }
      ]
    };
  },
  components: {
    TrafficAmap
  },
  computed: {
    ...mapState(["provinces"])
  },
  created() {
    let params = {
        gatewayNum: this.$router.history.current.query.deviceCode
      };
      api.getTemporaryPassCount(params).then(res => {
        this.CameraPassDetail = res.data;
        console.log('参数为'+JSON.stringify(this.CameraPassDetail))
      });
  },
  mounted() {
    this.queryCameraList();
  },
  methods: {
    PassCount(){
      
    },
    tamp(){
      //获取所有的参数（通过对象的形式返回）
          this.passDetail = this.$router.history.current.query;
    },
    deleteCameraData() {
      // this.verifyType = 3;
      this.queryCameraList(3);
      // this.getCameraDetailList(3);
    },
    amapCompleteCallback() {
      let _this = this;
      //console.info('_this.userInfo ',_this.userInfo);
      _this.regionCode = this.regionCode; //uInfo.regionCode;
      _this.regionName = this.newTitle; // uInfo.regionName;
      _this.currentMapRegionCode = this.regionCode; //uInfo.regionCode;
    },
    sendCameraSocketInfo(cameraId) {

    },

    amapMarkerClick(cameraInfo) {
      console.info("amapMarkerClick ", cameraInfo);
      this.sendCameraSocketInfo(cameraInfo.cameraId);
    },
    refreshAmapMarks(currRegionCode) {
      // this.eventRegionCode = currRegionCode;

      let _this = this,
        mymap = _this.$refs.cameraMap.cameraMap,
        bounds = mymap.getBounds(),
        zoom = mymap.getZoom(),
        postBody = {};

      //获取路径所选的所有参数
      // let ndata = _this.getPreParamsAr();
      // if (
      //   currRegionCode &&
      //   parseInt(("" + currRegionCode).substr(2, 4)) === 0 &&
      //   currRegionCode !== 100000
      // )
      //   postBody.provinceCode = currRegionCode;
      // if (ndata.provinceCode && ndata.provinceCode !== 100000)
      //   postBody.provinceCode = ndata.provinceCode;
      // if (ndata.cityCode) postBody.cityCode = ndata.cityCode;
      // if (ndata.organizationId) postBody.organizationId = ndata.organizationId;
      // if (ndata.road) postBody.road = ndata.road;

      //追踪到市范围显示内容
      // if (currRegionCode && parseInt(("" + currRegionCode).substr(2, 4)) > 0) {
      //   postBody.cityCode = currRegionCode;
      // }

      // postBody.organizationId = "9901001006"; // 宁沪高速
      // postBody.organizationCode = "9901001006"; // 宁沪高速

      // let data = {
      //   params: {
      //     zoomlevel: zoom, //13,
      //     NorthEast: bounds.northeast.toString(),
      //     SouthWest: bounds.southwest.toString()
      //   },
      //   data: postBody
      // };
      // _this.getCameraListForPot(data).then(res => {
      //   //根据选中的状态、类型筛选数据
      //   let newArr = res.data.filter(vo => {
      //     let hasType = _this.cameraTypeSelect.indexOf(vo.classify),
      //       hasStatus = _this.cameraStatusChange.indexOf(
      //         vo.onlineStatus || "1"
      //       );

      //     //收费广场、收费站连体
      //     if (vo.classify === "4") {
      //       hasType = _this.cameraTypeSelect.indexOf("5");
      //     }
      //     if (vo.classify === "9" || vo.classify === "0") {
      //       hasType = _this.cameraTypeSelect.indexOf("1");
      //     }

      //     //console.info(vo.classify,vo.onlineStatus,hasType,hasStatus);
      //     return hasType >= 0 && hasStatus >= 0;
      //   });
      //console.info(res);
      //TODO: 层级变化查询接口，返回摄像头路线字段为 road
      //   _this.$refs.cameraMap.cameraViewPoint(newArr);
      //   console.info(
      //     "refreshAmapMarks",
      //     "层级: " + zoom,
      //     "数量: " + res.data.length,
      //     "显示数量： " + newArr.length
      //   );
      // });
    },
    // refreshAmapMarks() {
    //   setTimeout(() => {
    //     this.$refs.cameraMap.cameraViewPoint(this.markList);
    //   }, 200);
    // },
    // amapMarkerClick() {},
    // 查询列表
    createdList() {
      let params = {
        deviceCode:this.$router.history.current.query.deviceCode,
      };
      api.getTemporaryList(params).then(res => {
        this.cameraLoading = false;
        this.temporaryList = res.data;
        this.reportSource = res.data[0].reportSource;
        this.cameratotal = res.total;
        this.firstTranscodingId = res.data.length ? res.data[0].deviceCode : "";
        this.handleChange(this.firstTranscodingId);
        // console.log('数据为————————'+this.transcodingName)
      });
    },
    queryCameraList(verifyType) {
      this.cameraLoading = true;
      let params = {
        gatewayNum: this.$router.history.current.query.deviceCode,
        pageSize: this.newData.pageSize,
        currPage: this.newData.currPage,
        type: verifyType
      };
      api.getTemporaryPass(params).then(res => {
        this.cameraLoading = false;
        this.temporaryList = res.data;
        // this.transcodingName = res.data[0].transcodingName;
        this.reportSource = res.data[0].type;
        this.newData.newtotal = res.total;
        this.cameratotal = res.total;
        this.firstTranscodingId = res.data.length ? res.data[0].deviceCode : "";
        this.handleChange(this.firstTranscodingId);
      });
    },
    // 获取省份id
    selProviceVal(val) {
      this.provinceCode = val;
    },
    // 新增页面
    newCameraViewData() {
      // this.verifyType = 1;
      // this.getCameraDetailList(1);
      this.queryCameraList(1)
    },
    // 头部模糊搜索
    selquery() {
      this.queryCameraList();
    },
    removeQuery() {
      this.regionName = "";
      this.provinceCode = "";
      this.couldGateWay = "";
      this.jurisdiction = "";
      this.queryCameraList();
    },
    handleChange(id) {
      this.newData.deviceCode = id;
      // this.getCameraDetailList(1);
      // this.getUpdataCamera();
    },
    // getCameraDetailList(type) {
    //   this.newCameraload = true;
    //   var data = {
    //     gatewayNum: this.newData.deviceCode,
    //     type: type,
    //     pageSize: this.newData.pageSize,
    //     currPage: this.newData.currPage
    //   };
    //   return api.getTemporaryPass(data).then(res => {
    //     this.newCameraload = false;
    //     this.newData.newCameraList = _.map(res.data, it => {
    //       let camera = _.find(this.cameraTypeList, {
    //         code: it.cameraType
    //       });
    //       return {
    //         ...it,
    //         cameraType: camera ? camera.name : it.cameraType
    //       };
    //     });
    //     this.newData.newtotal = res.total;
    //   });
    // },
    exportCameraList() {
      //导出
      if (this.newData.newtotal == 0) {
        this.$message({
          type: "info",
          message: "没有数据可导出！！！"
        });
        return;
      }
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        type: this.verifyType,
        gatewayNum: this.$router.history.current.query.deviceCode
      };
      console.log('参数为：'+JSON.stringify(params))
      api
        .getExportTemporaryPass(params)
        .then(res => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(res); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.isUpdate
            ? "摄像机审核更新信息表.xlsx"
            : "摄像机审核新增信息表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载

          this.$message.success("导出成功");
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href);
        })
        .catch(error => {
          this.$message({
            message: "摄像机导出失败! ",
            type: "error"
          });
        });
    },
    // 切换更新页面
    updateCameraData() {
      // this.verifyType = 2;
      // this.getCameraDetailList(2);
      this.queryCameraList(2);
    },
    // 主页分页 选择当前页
    handlePageChange(val) {
      this.newData.currPage = val;
      this.queryCameraList();
    },
        /**
     * 多选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 选择页尺寸
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.queryCameraList();
    // },
    handleSizeChange(val) {
        this.newData.pageSize = val;
        this.queryCameraList();
    },
    handleCurrentChange(val) {
        this.newData.currPage = val;
        this.queryCameraList();
    },
    // 新增分页
    handleNewPageChange(val) {
      this.newData.currPage = val;
      this.queryCameraList();
      // this.getCameraDetailList(this.type);
    },
    //页面尺寸
    handleNewSizeChange(val) {
      this.newData.pageSize = val;
      this.newData.currPage = 1;
      // this.getCameraDetailList(this.type);
    },
    // 更新分页
    handleUpdatePageChange(val) {
      this.updateData.currPage = val;
      this.updateCameraData();
    },
    handleUpdateSizeChange(val) {
      this.updateData.pageSize = val;
      this.updateCameraData();
    }
  }
};
</script>
<style lang="less" src="../../css/DeviceTranscoding.less"></style>
<style lang="less">
.system-camera-notpass-title {
  padding: 12px 0px 12px 20px;
  font-size: 14px;
  cursor: pointer;
  .el-icon-back {
    padding-right: 8px;
  }
}
</style>
