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
    <div  style="background: #fff;">
      <div class="system-camera-box-title">
        <i 
          class="el-icon-back"
          @click="$router.push('/systemCameraBox')"
          ></i>
        <span>{{$router.history.current.query.title}}</span>
      </div>
      <div v-if="!temporaryList.length" class="noData">暂无数据</div>
      <div v-loading="cameraLoading" v-else>
        <div class="content">
          <!-- <div class="lineA"></div> -->
          <div class="con-footer">
            <el-collapse
              v-model="firstTranscodingId"
              accordion
              @change="handleChange(item.deviceCode)"
              >
                <div class="table-wrapper-cameras">
                  <div class="table-control">
                    <div class="tab-wrapper">
                      <div
                        :class="verifyType === 1 ? 'active' : ''"
                        @click="newCameraViewData"
                      >新增{{ temporaryList.confirmAddOpCaremaNum}}</div>
                      <div
                        :class="verifyType === 2 ? 'active' : ''"
                        @click="updateCameraData"
                      >更新{{ temporaryList.confirmUpOpCaremaNum }}</div>
                      <div
                        :class="verifyType === 3 ? 'active' : ''"
                        @click="deleteCameraData"
                      >删除{{ temporaryList.confirmRmOpCaremaNum }}</div>
                    </div>
                    <div class="cameraStatus-btn">
                      <el-button
                        type="primary"
                        plain
                        class="query btn-c"
                        @click="exportCameraList()"
                      >数据导出</el-button>
                      <el-button
                        type="primary"
                        plain
                        class="query btn-c"
                        @click="mapCameraList()"
                      >地图查看</el-button>
                      <el-button
                        type="primary"
                        plain
                        class="query btn-c"
                        @click="reviewCameraList(temporaryList, 1)"
                      >全部同意</el-button>
                      <el-button
                        plain
                        class="btn-c btn-r"
                        style="background:rgba(255,73,73,1);border-radius:2px;"
                        @click="reviewCameraList(temporaryList, 2)"
                      >全部驳回</el-button>
                    </div>
                  </div>
                </div>
                <div class="footer-table">
                  <el-table
                    ref="singleTable"
                    @selection-change="handleSelectionChange"
                    :data="newData.newCameraList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    highlight-current-row
                    style="width: 100%"
                    border
                    v-loading="newCameraload"
                  >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index" label="序号" width="70"></el-table-column>
                    <el-table-column label="地区" width="200">
                      <template slot-scope="scope">
                        <span>{{ scope.row.regionId }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column property="organizationId" label="管辖单位" width="120"></el-table-column>
                    <el-table-column property="roadCode" label="所属路线" width="120"></el-table-column>
                    <el-table-column property="cameraName" label="摄像机名称" width="300"></el-table-column>
                    <el-table-column property="kmPile" label="桩号" width="120"></el-table-column>
                    <el-table-column property="longAndLati" label="经纬度" width="280">
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
                            >{{ scope.row.longAndLati }}
                            </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column property="classifyCodeDesc" label="所属类别" width="100"></el-table-column>
                    <el-table-column property="derectionCodeDesc" label="方向" width="80"></el-table-column>
                    <el-table-column property="cameraType" label="摄像机类型" width="120"></el-table-column>
                    <el-table-column property="reportTime" label="提交时间" width="170"></el-table-column>
                    <el-table-column label="审核">
                      <template class slot-scope="scope">
                        <el-link @click="handleClick(scope.row)" type="primary">审核</el-link>
                      </template>
                      <!-- 编辑弹出框 -->
                        <el-dialog title="审核" :visible.sync="dialogFormVisible" width="30%" :append-to-body="true">
                                <!-- <p >{{this.h1}}</p> -->
                                <el-radio-group @change="changeRadio" v-model="radio2">
                                <el-radio label="1" >同意</el-radio>
                                <el-radio label="2" >驳回</el-radio>
                                </el-radio-group>
                            <span slot="footer" class="dialog-footer" >
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="agger">确 定</el-button>
                            </span>
                        </el-dialog>
                    </el-table-column>
                  </el-table>
                  <!--分页控件-->
                    <!-- <el-pagination
                      background
                      layout=" prev, pager, next, sizes, jumper "
                      :current-page="newData.currPage"
                      @current-change="handleNewPageChange"
                      @size-change="handleNewSizeChange"
                      :total="newData.newtotal"
                    ></el-pagination> -->
                  <div class="table-pagination"  v-if="newData.newtotal > 9">
                    <p class="total-pagination">共{{newData.newtotal}}条</p>
                    <el-pagination
                      @size-change="handleSizeChange1"
                      @current-change="handleCurrentChange1"
                      :current-page="currentPage"
                      :page-sizes="[10, 20, 30]"
                      :page-size="pagesize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="newData.newtotal">
                    </el-pagination>
                  </div>
                </div>
            </el-collapse>
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

    <div class="table-pagination"  v-if="temporaryList && temporaryList.length > 9">
      <p class="total-pagination">共{{cameratotal}}条</p>
      <el-pagination
        background
        layout=" prev, pager, next, sizes, jumper "
        :current-page="currPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :total="cameratotal"
      ></el-pagination>
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
      h1:'',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      radio2: '1',
      isAllHeight: 0,
      markList: [],
      temporaryList: [],
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
      pageSize: 10,
      currPage: 1,
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
      regin:'',
      pagesize:10,
      currentPage:1,
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
      ],
      gatewayNum: '',
      gatewayId: ''
    };
  },
  components: {
    TrafficAmap
  },
  computed: {
    ...mapState(["provinces"])
  },
  created(){
    // this.passDetail = this.$router.history.current.query;
    let passDetail = this.$router.history.current.query;
    this.gatewayNum = this.$router.history.current.query.deviceCode;
    this.gatewayId = this.$router.history.current.query.id;
  },
  mounted() {
    this.queryCameraList();
  },
  methods: {
    changeRadio(value){
      this.radio2 = value
    },
    handleClick(row){
      this.dialogFormVisible = true
      // console.log('row'+row)
      this.h1 = row.cameraNum
      // temporaryList,type,row
    },
    agger(){
      let type = this.radio2
      let message = '';
      //判断传过来的参数值
      if(type == 1){
        message = '同意接入'
      }else if(type == 2){
        message = '拒绝接入'
      }
      let verifyType = {
        1: "新增",
        2: "更新",
        3: "删除"
      };
      this.$confirm("提示", {
        title: "提示",
        message: "确认要" + message + "该摄像机吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        var cams = [];
        cams.push(this.h1)
        let params = {
          cameraNums: cams,
          reportSource: this.reportSource,
          verifyRlt: this.radio2,
          verifyType: this.verifyType,
        };
        api.getCameraStatus(params).then(res => {
          if (res.code != 200) {
            this.$message({
              message: res.message,
              type: "error"
            });
          } else if(res.code === 200){
            this.$message({
              message: message + "成功",
              type: "success"
            });
            this.dialogFormVisible = false
            this.queryHasPlatform(cams);
          }
        });
      });
    },
    deleteCameraData() {
      this.verifyType = 3;
      this.getCameraDetailList(3);
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
    queryCameraList() {
      this.cameraLoading = true;
      let params = {
        organizationId: this.jurisdiction,
        regionId: this.provinceCode,
        transcodingId: this.couldGateWay,
        deviceCode: this.gatewayNum,
        pageSize: this.pageSize,
        currPage: this.currPage
      };
      api.getTemporaryList(params).then(res => {
        this.cameraLoading = false;
        this.temporaryList = res.data;
        this.transcodingName = res.data[0].transcodingName;
        this.reportSource = res.data[0].reportSource;
        this.cameratotal = res.total;
        this.firstTranscodingId = res.data.length ? res.data[0].deviceCode : "";
        this.handleChange(this.firstTranscodingId);
        // console.log('数据为————————'+this.transcodingName)
      });
    },
    // 获取省份id
    selProviceVal(val) {
      this.provinceCode = val;
    },
    // 新增页面
    newCameraViewData() {
      this.verifyType = 1;
      this.getCameraDetailList(1);
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
      this.getCameraDetailList(1);
      // this.getUpdataCamera();
    },
    getCameraDetailList(type) {
      this.newCameraload = true;
      var data = {
        gatewayNum: this.newData.deviceCode,
        onMap: true,
        verifyType: type,
        pageSize: this.newData.pageSize,
        currPage: this.newData.currPage
      };
      return api.getTemporaryConfirm(data).then(res => {
        this.newCameraload = false;
        this.newData.newCameraList = _.map(res.data, it => {
          let camera = _.find(this.cameraTypeList, {
            code: it.cameraType
          });
          return {
            ...it,
            cameraType: camera ? camera.name : it.cameraType
          };
        });
        this.newData.newtotal = res.total;
      });
    },
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
        verifyType: this.verifyType,
        gatewayNum: this.newData.deviceCode
      };
      api
        .getExportTemporary(params)
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

    mapCameraList() {
      this.mapVisable = true;
      let list = _.map(this.newData.newCameraList, it => {
         let longitude = it.longAndLati.split("/")[0];
        let latitude = it.longAndLati.split("/")[1];
        return {
          lon: longitude,
          lat: latitude,
          cameraNum: it.cameraNum,
          cameraName: it.cameraName
        }
      })
      api.getPositionLatNew(list).then((data) => {
          if (data.code !== 200) {
              this.$message({
                  message: '获取摄像机地图点位失败! [' + data.code + ']: ' + data.message,
                  type: 'error'
              });
              return Promise.reject();
          };
          let list = _.map(data.data, it => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat
            }
          });
          setTimeout(() => {
            this.$refs.cameraMap.cameraViewPoint(list);
          }, 1000);
      }).catch(res => {
        this.$refs.cameraMap.cameraViewPoint([]);
      });
    },
    reviewCameraList(temporaryList, type) {
      let message = type === 1 ? "同意" : "拒绝接入";
      let verifyType = {
        1: "新增",
        2: "更新",
        3: "删除"
      };
      this.$confirm("提示", {
        title: "提示",
        message: "确认要" + message + "所有新增摄像机吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        var cams = [];
        for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
          cams.push(this.multipleSelection[i].cameraNum);
        }
        let params = {
          cameraNums: cams,
          reportSource: this.reportSource,
          verifyRlt: type,
          verifyType: this.verifyType,
        };
        api.getCameraStatus(params).then(res => {
          if (res.code != 200) {
            this.$message({
              message: res.message,
              type: "error"
            });
          } else if(res.code === 200){
            this.$message({
              message: message + "成功",
              type: "success"
            });
            
            this.queryHasPlatform(cams);
          }
        });
      });
    },
    queryHasPlatform(cams){
      this.$api.querySuppPlatform().then((res) => {
        if (res.code === "404") {
          this.confirmRefresh();
          return;
        }
        this.$confirm("提示", {
          title: "提示",
          message: "是否上报给上级平台? ",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          this.$api
          .reportBatchCamera({
            cameraNums: cams,
            instructions: {
              module: "资源管理",
              page: "摄像机管理",
              feature: "批量处理—上报",
              description:
                  "批量上报" + cams.length + "路摄像机"
            }
          }).then((res1) => {
            this.confirmRefresh();
          })
          
        }).catch(() => {
          this.$api
          .cancelReportBatchCamera({
            cameraNums: cams,
            instructions: {
              module: "资源管理",
              page: "摄像机管理",
              feature: "批量处理—取消上报" ,
              description:
                  "批量取消上报" + cams.length + "路摄像机"
            }
          }).then(res1 => {
            this.confirmRefresh();
          })
        })
      });
    },
    confirmRefresh(){
      this.$confirm("提示", {
        title: "提示",
        message: "确定要对摄像机进行分层么？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(res => {
          api
          .getCamerafresh({ transcodingId: this.gatewayId })
          .then(res => {
            this.queryCameraList();
          });
      }).catch(() => {
        this.queryCameraList();
      })
    },
    // 切换更新页面
    updateCameraData() {
      this.verifyType = 2;
      this.getCameraDetailList(2);
    },
    // 主页分页 选择当前页
    handlePageChange(val) {
      this.currPage = val;
      this.queryCameraList();
    },
        /**
     * 多选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 选择页尺寸
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryCameraList();
    },
    handleSizeChange1(val) {
        this.pagesize = val;
    },
    handleCurrentChange1(val) {
        this.currentPage = val;
    },
    // 新增分页
    handleNewPageChange(val) {
      this.newData.currPage = val;
      this.getCameraDetailList(this.verifyType);
    },
    //页面尺寸
    handleNewSizeChange(val) {
      this.newData.pageSize = val;
      this.newData.currPage = 1;
      this.getCameraDetailList(this.verifyType);
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
  },
  watch: {
    radio2(newval,oldval){
      console.log('老数据'+oldval+'新数据'+newval)
      this.radio2 = newval
    }
  },
};
</script>
<style lang="less" src="../../css/DeviceTranscoding.less"></style>
<style lang="less">
.system-camera-box-title {
  padding: 12px 0px 12px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 0px !important;
  .el-icon-back {
    padding-right: 8px;
  }
}
</style>
