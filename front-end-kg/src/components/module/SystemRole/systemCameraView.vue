<template>
  <div class="The-cloud content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="el-icon-coin"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>摄像机审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cameraheader" style="height: 60px">
      <div class="tab-wrapper">
        <div @click="$router.push({ path: '/deviceCameraManage' })">
          摄像机管理
        </div>
        <div @click="$router.push({ path: '/deviceGroupList' })" v-if="uinfo.regionCode == 530000 ? true : false">
            播放列表
          </div>
        <div @click="$router.push({ path: '/deviceGroupManage' })">
          摄像机组管理
        </div>
        <div class="active">摄像机审核</div>
        <div v-if="false" @click="$router.push({ path: '/cameraBorrow' })">
         摄像机借阅
        </div>
        
        <!-- <div
          @click="$router.push({ path: '/cameraAccess' })"
          v-if="uinfo.regionCode == 500000 ? false : true"
        >
          摄像机接入
        </div> -->
        <!-- <div @click="$router.push({ path: '/borrow' })">借阅审核</div> -->
      </div>
    </div>
    <div class="camera-search-display camera-manage-search">
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            label="所属省份："
            v-if="uinfo.regionCode == 100000 ? true : false"
          >
            <el-select
              filterable
              placeholder="全国"
              v-model="regionName"
              style="width: 120px"
              @change="selProviceVal"
            >
              <el-option
                v-for="item in provinces"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上云网关：">
            <el-input
              placeholder="请输入内容"
              style="width: 150px"
              v-model="couldGateWay"
            ></el-input>
          </el-form-item>
          <el-form-item label="管辖单位：">
            <!-- <el-input
              type="text"
              style="width: 150px;"
              placeholder="请输入管辖单位"
              v-model="jurisdiction"
            /> -->
            <el-cascader
              v-model="jurisdictionValue"
              filterable
              clearable
              :show-all-levels="false"
              :options="orgTreeList"
              :props="orgCodeProps"
              style="width: 100px"
              @change="orgChange"
              @clear="orgChange"
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item>
          <el-button type="primary" class="query" @click="selquery">搜索</el-button>
          <el-button type="primary" class="reset" @click="removeQuery">重置</el-button>
          </el-form-item>-->
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="selquery"
            >搜索</el-button
          >
          <el-button type="primary" class="reset" @click="removeQuery"
            >重置</el-button
          >
        </div>
      </div>
    </div>
    <!-- <div v-if="!temporaryList.length" class="noData">暂无数据</div>
    <div v-loading="cameraLoading" v-else> -->
    <div v-loading="cameraLoading">
      <div class="content" v-for="(item, index) in temporaryList" :key="index">
        <div class="content-header flex-header" style="border-bottom: none">
          <div>
            <!-- <i v-else class="onlineStatusNo"></i> -->
            <i class="onlineStatusOk"></i>
            <span>{{ item.transcodingName }}</span>
            <el-tag
              size="small"
              :type="item.reportSource === 1 ? '' : 'success'"
              effect="dark"
              >{{ item.reportSource === 1 ? '网关' : '平台' }}</el-tag
            >
          </div>

          <div>
            <span class="header-f">待审核&nbsp; {{ item.cameraCount }}</span>
            <span class="header-s">{新增</span>
            <span class="header-f">{{ item.confirmAddOpCameraNum }}</span>
            <span class="header-s">/更新</span>
            <span class="header-f">{{ item.confirmUpOpCameraNum }}</span>
            <span class="header-s">/删除</span>
            <span class="header-f">{{ item.confirmRmOpCameraNum }}}</span>
          </div>
        </div>
        <el-row class="content-body" :gutter="24">
          <el-col
            :span="3"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            省份:
            <span style="color: #000000; margin-left: 6px">
              {{ item.regionName }}
            </span>
          </el-col>
          <el-col
            :span="4"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            管辖单位:
            <span style="color: #000000; margin-left: 6px">
              {{ item.organizationName }}
            </span>
          </el-col>
          <el-col
            :span="4"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            最大接入量:
            <span style="color: #000000; margin-left: 6px">
              {{ item.maxChannelNum }}
            </span>
          </el-col>
          <el-col
            :span="4"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            已接入量:
            <span style="color: #000000; margin-left: 6px">
              {{ item.curChannelNum }}
              <!-- (在线：
              <span>
                {{
                item.onlineChannelNum
                }}
              </span>
              离线：
              <span>{{ item.offlineChannelNum }}</span>)-->
            </span>
          </el-col>
          <el-col
            :span="4"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            所属流媒体:
            <span style="color: #000000; margin-left: 6px">
              {{ item.streamMediaName }}
            </span>
          </el-col>
          <el-col
            :span="3"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            设备厂商:
            <span style="color: #000000; margin-left: 6px">
              {{ item.vendorName }}
            </span>
          </el-col>
          <el-col
            :span="6"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            联系人信息:
            <span style="color: #000000; margin-left: 6px">
              {{ item.contactPerson }}
            </span>
            <span style="color: #000000; margin-left: 6px">{{
              item.contactPhone
            }}</span>
          </el-col>
        </el-row>
        <!-- <div class="lineA"></div> -->
        <div class="con-footer">
          <el-collapse
            v-model="firstTranscodingId"
            accordion
            @change="handleChange(item.platformCode)"
          >
            <el-collapse-item title :name="item.platformCode">
              <template slot="title">
                <p style="margin-left: 34px; color: #000000">摄像机信息</p>
              </template>
              <div
                style="border: 1px dashed rgba(212, 212, 212, 1); width: 100%"
              ></div>
              <div class="table-wrapper-cameras">
                <div class="table-control">
                  <div class="tab-wrapper">
                    <div
                      :class="verifyType === 1 ? 'active' : ''"
                      @click="newCameraViewData"
                    >
                      新增{{ item.confirmAddOpCameraNum }}
                    </div>
                    <div
                      :class="verifyType === 2 ? 'active' : ''"
                      @click="updateCameraData"
                    >
                      更新{{ item.confirmUpOpCameraNum }}
                    </div>
                    <div
                      :class="verifyType === 3 ? 'active' : ''"
                      @click="deleteCameraData"
                    >
                      删除{{ item.confirmRmOpCameraNum }}
                    </div>
                  </div>
                  <div class="cameraStatus-btn">
                    <el-button
                      type="primary"
                      plain
                      class="query btn-c"
                      @click="exportCameraList()"
                      >数据导出</el-button
                    >
                    <el-button
                      type="primary"
                      plain
                      class="query btn-c"
                      @click="mapCameraList()"
                      >地图查看</el-button
                    >
                    <el-button
                      type="primary"
                      plain
                      class="query btn-c"
                      @click="reviewCameraList(item, 1)"
                      >全部同意</el-button
                    >
                    <el-button
                      plain
                      class="btn-c btn-r"
                      style="
                        background: rgba(255, 73, 73, 1);
                        border-radius: 2px;
                      "
                      @click="reviewCameraList(item, 0)"
                      >全部拒绝</el-button
                    >
                    <!-- @click="reviewCameraList(item, 2)" -->
                  </div>
                </div>
              </div>
              <div class="footer-table">
                <el-table
                  ref="singleTable"
                  :data="newData.newCameraList"
                  highlight-current-row
                  style="width: 100%"
                  border
                  v-loading="newCameraload"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    align="center"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                  ></el-table-column>
                  <el-table-column label="地区" width="200">
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.regionId2 &&
                              scope.row.regionId2 !== scope.row.regionId
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.regionId }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.regionId2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.regionName }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="departmentName"
                    label="路公司"
                    width="120"
                  ></el-table-column>
                  <el-table-column
                    property="organizationId"
                    label="管辖单位"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.organizationId2 &&
                              scope.row.organizationId2 !==
                                scope.row.organizationId
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.organizationId }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.organizationId2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.organizationName }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="roadCode"
                    label="所属路线"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.roadCode2 &&
                              scope.row.roadCode2 !== scope.row.roadCode
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.roadCode }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.roadCode2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.roadCode }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="cameraName"
                    label="摄像机名称"
                    width="300"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.oldCameraName &&
                              scope.row.oldCameraName !== scope.row.cameraName
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.oldCameraName }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.cameraName }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.cameraName }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column property="kmPile" label="桩号" width="120">
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.kmPile2 &&
                              scope.row.kmPile2 !== scope.row.kmPile
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.kmPile }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.kmPile2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.kmPile }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="longAndLati"
                    label="经纬度"
                    width="280"
                  >
                    <!-- 判断点击了哪个按钮，返回的数据不同 -->
                    <template slot-scope="scope">
                      <div @click="showMap(scope.row)">
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.longAndLati2 &&
                              scope.row.longAndLati2 !== scope.row.longAndLati
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.longAndLati }}
                          </div>
                          <div
                            style="
                              text-decoration: underline;
                              color: #94e61a;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.longAndLati2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: underline;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.longAndLati }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="classifyCodeDesc"
                    label="所属类别"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.classifyCodeDesc2 &&
                              scope.row.classifyCodeDesc2 !==
                                scope.row.classifyCodeDesc
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.classifyCodeDesc }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.classifyCodeDesc2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.classifyDesc }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="derectionCodeDesc"
                    label="方向"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.derectionCodeDesc2 &&
                              scope.row.derectionCodeDesc2 !==
                                scope.row.derectionCodeDesc
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.derectionCodeDesc }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.derectionCodeDesc2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.derectionDesc }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="cameraType"
                    label="摄像机类型"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div
                          v-if="
                            verifyType === 2 &&
                              scope.row.cameraType2 &&
                              scope.row.cameraType2 !== scope.row.cameraType
                          "
                        >
                          <div
                            style="
                              text-decoration: line-through;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.cameraType }}
                          </div>
                          <div style="color: #94e61a; cursor: pointer">
                            {{ scope.row.cameraType2 }}
                          </div>
                        </div>
                        <div v-else>
                          <div
                            style="
                              text-decoration: none;
                              color: #808080;
                              cursor: pointer;
                            "
                          >
                            {{ scope.row.cameraTypeDesc }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="reportTime"
                    label="提交时间"
                    width="170"
                  >
                  </el-table-column>
                </el-table>
                <!--分页控件-->
                <div class="table-pagination" v-if="newData.newtotal > 9">
                  <!-- <p class="total-pagination">共{{ total }}条</p> -->
                  <el-pagination
                    background
                    layout=" prev, pager, next, sizes, jumper,total "
                    :current-page="getTabPage().currPage"
                    :page-size="getTabPage().pageSize"
                    @current-change="handleNewPageChange"
                    @size-change="handleNewSizeChange"
                    :total="newData.newtotal"
                  ></el-pagination>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
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
    <!-- <div class="collapse_p" v-if="temporaryList && temporaryList.length > 9"> -->
    <div class="table-pagination">
      <p class="total-pagination">共{{ cameratotal }}条</p>
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
import { mapState, mapActions, mapMutations } from 'vuex';
import api from '@/api';
import TrafficAmap from '../../cameraMap.vue';
export default {
  name: 'cameraView',

  data() {
    return {
      uinfo: {
        regionCode: JSON.parse(localStorage.getItem('cloudplatform'))
          .regionCode,
      },
      ids: [],
      verifyType: 1,
      isAllHeight: 0,
      markList: [],
      temporaryList: [],
      // activeInfo: "",
      isState: '',
      state: [],
      jurisdictionValue: null,
      orgTreeList: [],
      downvendor: '',
      options2: [],
      listData: {},
      cameraListInfo:{},
      errorList: [],
      successList: [],
      regionName: '',
      orgCodeProps: {
        //lazy: true,
        expandTrigger: 'hover',
        value: 'organizationId',
        label: 'organizationName',
        children: 'childList',
        checkStrictly: true,
        //lazyLoad:this.propsLazyload
      },
      isUpdate: false,
      couldGateWay: '',
      jurisdiction: '',
      provinceCode: '',
      pageSize: 10,
      currPage: 1,
      cameratotal: 0,
      newCameraload: false,
      cameraLoading: false,
      updateLoading: false,
      newData: {
        newCameraList: [],
        transcodingId: '',
        verifyType: '',
        pageSize: 10,
        currPage: 1,
        newtotal: 0,
        longitude: 0,
        latitude: 0,
      },
      tab_page: {},
      upDateTitle: '',
      newTitle: '',
      firstTranscodingId: 0,
      mapVisable: false,
      regionCode: null,
      currentMapRegionCode: null,
      updateData: {
        total: 0,
        list: [],
      },
      delData: {
        total: 0,
        list: [],
      },
      cameraTypeList: [
        { name: '监控型机枪', code: '1' },
        { name: '监控型球机', code: '2' },
        { name: '全景型', code: '3' },
        { name: '抓拍机', code: '4' },
      ],
    };
  },
  components: {
    TrafficAmap,
  },
  computed: {
    ...mapState(['provinces']),
  },
  mounted() {
    this.queryCameraList();
    this.queryOrgList();
  },
  methods: {
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
      // switch (this.targetScreen) {
      //   case "right_screen":
      //     this.targetScreen = "left_screen";
      //     break;
      //   case "left_screen":
      //     this.targetScreen = "right_screen";
      //     break;
      //   default:
      //     this.targetScreen = "left_screen";
      //     break;
      // }
      // let data = {
      //   msgType: "action",
      //   idname: "touch_screen",
      //   target: this.targetScreen,
      //   url: cameraId
      // };
      // if (this.webSocketClient) this.webSocketClient.send(JSON.stringify(data));
    },

    amapMarkerClick(cameraInfo) {
      console.info('amapMarkerClick ', cameraInfo);
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
      this.mapCameraList();
    },
    // refreshAmapMarks() {
    //   setTimeout(() => {
    //     this.$refs.cameraMap.cameraViewPoint(this.markList);
    //   }, 200);
    // },
    // amapMarkerClick() {},
    // 查询列表
    queryCameraList() {
      this.cameraLoading = true;
      var p = this.getTabPage();
      let params = {
        organizationId: this.jurisdictionValue
          ? this.jurisdictionValue[this.jurisdictionValue.length - 1]
          : null,
        regionId: this.provinceCode,
        transcodingName: this.couldGateWay,
        pageSize: p.pageSize,
        currPage: p.currPage,
      };
      api.getTemporaryList(params).then((res) => {
        this.cameraLoading = false;
        this.temporaryList = res.data;
        this.cameratotal = res.total;
        this.firstTranscodingId = res.data.length
          ? res.data[0].platformCode
          : '';
        this.handleChange(this.firstTranscodingId);
      });
    },
    // 获取省份id
    selProviceVal(val) {
      this.provinceCode = val;
    },
    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api.getOrgTree(params).then((data) => {
        if (data.code !== 200) {
          return Promise.reject();
        }
        let nlist = data.data[0].childList;
        _.each(nlist, (it) => {
          it.disabled = true;
        });
        _this.orgTreeList = nlist;
      });
      // .catch((error) => {
      //   this.$message({
      //     message:
      //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
      //     type: "error",
      //   });
      // });
    },
    /**
     * 单位列表change事件
     * @param val
     */
    orgChange(val) {
      console.log(val);
      // this.filters.roadCode = "";
      // // this.roadList = [];
      // this.filters.organizationId = "";
      // if (val.length) {
      //   let orgId = val[val.length - 1];
      //   this.filters.organizationId = orgId;
      //   // this.queryRoadList(orgId);
      //   // this.queryUpCloud();
      // }
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
      this.regionName = '';
      this.provinceCode = '';
      this.couldGateWay = '';
      // this.jurisdiction = "";
      this.jurisdictionValue = null;
      this.queryCameraList();
    },
    handleChange(id) {
      this.verifyType = 1;
      this.newData.platformCode = id;
      this.getCameraDetailList(1);
      // this.getUpdataCamera();
    },
    getTabPage() {
      var p = this.tab_page[
        this.newData.platformCode + '_' + this.newData.verifyType
      ];
      if (p == undefined) {
        p = { pageSize: this.pageSize, currPage: this.currPage };
        this.setTabPage(p);
      }
      return p;
    },
    setTabPage(p) {
      this.tab_page[
        this.newData.platformCode + '_' + this.newData.verifyType
      ] = p;
    },
    //获取网关列表
    getCameraDetailList(type) {
      this.newData.verifyType = type;
      var page = this.getTabPage();
      // console.log(this.newData.platformCode, type, page);
      this.newCameraload = true;
      var data = {
        platformCode: this.newData.platformCode,
        // onMap: true,
        verifyType: type,
        pageSize: page.pageSize,
        currPage: page.currPage,
      };
      return api.getTemporaryConfirm(data).then((res) => {
        this.newCameraload = false;
        this.newData.newCameraList = _.map(res.data, (it) => {
          let camera = _.find(this.cameraTypeList, {
            code: it.cameraType,
          });
          let camera2 = _.find(this.cameraTypeList, {
            code: it.cameraType2,
          });
          return {
            ...it,
            cameraType: camera ? camera.name : it.cameraType,
            cameraType2: camera2 ? camera2.name : null,
          };
        });
        this.newData.newtotal = res.total;
      });
    },
    //导出
    exportCameraList() {
      // if (this.newData.newtotal == 0) {
      //   this.$message({
      //     type: "info",
      //     message: "没有数据可导出！！！"
      //   });
      //   return;
      // }
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        verifyType: this.verifyType,
        platformCode: this.newData.platformCode,
      };
      api
        .getExportTemporary(params)
        .then((res) => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel' }); // type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '待审摄像机列表.xlsx'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          v.$message({
            message: '表格导出失败! ',
            type: 'error',
          });
        });
    },
    //地图摄像机点
    mapCameraList() {
      this.mapVisable = true;

      // let data = _.map(this.newData.newCameraList, it => {
      //   let latitude = it.longAndLati.split("/")[0];
      //   let longitude = it.longAndLati.split("/")[1];
      //   return {
      //     ...it,
      //     latitude: parseInt(latitude),
      //     longitude: parseInt(longitude)
      //   };
      // });
      // setTimeout(() => {
      //   this.$refs.cameraMap.cameraViewPoint(data);
      // }, 1000);
      if (!this.newData.newCameraList.length) {
        return;
      }
      let list = _.map(this.newData.newCameraList, (it) => {
        let latitude = it.longAndLati.split('/')[1];
        let longitude = it.longAndLati.split('/')[0];
        return {
          lon: longitude,
          lat: latitude,
          cameraNum: it.cameraNum,
          cameraName: it.cameraName,
        };
      });
      api
        .getPositionLatNew(list)
        .then((data) => {
          if (data.code !== 200) {
            this.$message({
              message:
                '获取摄像机地图点位失败! [' + data.code + ']: ' + data.message,
              type: 'error',
            });
            return Promise.reject();
          }
          let list = _.map(data.data, (it) => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat,
              cameraName: it.cameraName,
              cameraNum: it.cameraNum,
            };
          });
          setTimeout(() => {
            this.$refs.cameraMap.cameraViewPoint(list);
          }, 1000);
        })
        .catch((res) => {
          this.$refs.cameraMap.cameraViewPoint([]);
        });

      // if (!this.isUpdate) {
      //   var data = {
      //     transcodingId: this.newData.transcodingId,
      //     newData: true, //新增是true,更新是false
      //     onMap: true
      //   };

      //   api
      //     .getTemporaryConfirm({ pageSize: 0, currPage: 0 }, data)
      //     .then(res => {
      //       list = res.data;
      //       this.markList = list;
      //       this.newTitle = res.data[0].provinceName;
      //       this.regionCode = res.data[0].regionCode;
      //     });
      // } else {
      //   var data = {
      //     transcodingId: this.newData.transcodingId,
      //     newData: false,
      //     onMap: true
      //   };
      //   api
      //     .getTemporaryConfirm({ pageSize: 0, currPage: 0 }, data)
      //     .then(res => {
      //       list = res.data;
      //       this.markList = list;
      //       this.upDateTitle = res.data[0].provinceName;
      //     });
      // }
      // setTimeout(() => {

      // }, 1000);
    },
    //地图
    showMap(row) {
      if (this.mapVisable) {
        this.mapVisable = false;
      }
      this.$nextTick(() => {
        this.mapVisable = true;
      });
      let longAndLati =
        row.longAndLati2 && row.longAndLati !== row.longAndLati2
          ? row.longAndLati2
          : row.longAndLati;
      let list = [
        {
          lon: longAndLati.split('/')[0],
          lat: longAndLati.split('/')[1],
          cameraNum: row.cameraNum,
          cameraName: row.cameraName,
        },
      ];
      api
        .getPositionLatNew(list)
        .then((data) => {
          if (data.code !== 200) {
            this.$message({
              message:
                '获取摄像机地图点位失败! [' + data.code + ']: ' + data.message,
              type: 'error',
            });
            return Promise.reject();
          }
          let list = _.map(data.data, (it) => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat,
              cameraName: it.cameraName,
              cameraNum: it.cameraNum,
            };
          });
          setTimeout(() => {
            this.$refs.cameraMap.cameraViewPoint(list);
          }, 1000);
        })
        .catch((res) => {
          this.$refs.cameraMap.cameraViewPoint([]);
          // let cameraNums = _.map(this.newData.newCameraList, it => it.cameraNum);
        });
    },

    reviewCameraList(item, type) {
      let message = type === 1 ? '全部同意' : '全部拒绝';
      let ids = this.ids;
      let verifyType = {
        1: '新增',
        2: '更新',
        3: '删除',
      };
      this.$confirm('提示', {
        title: '提示',
        message: '确认要' + message + '所有新增摄像机吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params = {
          cameraTmpIds: ids,
          reportSource: item.reportSource,
          // verifyRlt: type,
          agree: type,
          verifyType: this.verifyType,
          platformCode: this.newData.platformCode,
          instructions: {
            module: '资源管理',
            page: '摄像机审核',
            feature: type === 1 ? '全部同意' : '全部拒绝',
            description:
              message +
              item.transcodingName +
              verifyType[this.verifyType] +
              '的' +
              ids.length +
              '路摄像机',
          },
        };
        // console.log(params, "验证数据");
        api.getCameraStatus(params).then((res) => {
          if (res.code != 200) {
            this.$message({
              message: res.message,
              type: 'error',
            });
          } else {
            this.listData = res.data;
            this.errorList = res.data.errorList;
            this.successList = res.data.successList;
            // 弹窗
              if (!_.isEmpty(res.data)) {
                let errMsgs=''
                if(this.errorList ==""){
                  errMsgs == `<div><span>数据成功上传！</div>`
                }else{
                   _.each(this.errorList, (l,i) => {
                  errMsgs +=`<p><span>${i+1}</span>:<span>摄像机名称:${l.cameraName}</span></p>`;
                });
                }
                let successMsgs=''
                _.each(this.successList, (l,i) => {
                  successMsgs +=`<p><span>${i+1}</span>:<span>${l.msg}:${l.cameraName}</span></p>`;
                });
                if(successMsgs==""){
                  // successMsgs== `<div><span>成功：</span>${successMsgs}</div>`
                }
                if(this.successList ==""){
                  let HTMLText = `<div><span>错误：</span>${errMsgs}</div><div></div> `;
                  this.$alert(HTMLText, "信息列表", {
                    dangerouslyUseHTMLString: true,
                    customClass:'cameraListInfo'
                    // type: "success"
                  });
                }
               
            }
            this.$message({
              message: message + '成功',
              type: 'success',
            });
            this.queryCameraList();
            if (type == 1) {
              api.getCamerafresh({ transcodingId: item.transcodingId })
                .then((res) => {
                  
                });
            }
          }
        });
      });
    },
    // 切换更新页面
    updateCameraData() {
      this.verifyType = 2;
      this.getCameraDetailList(2);
      this.newData.currPage = 1;
    },
    // 主页分页 选择当前页
    handlePageChange(val) {
      var p = this.getTabPage();
      p.currPage = val;
      this.setTabPage(p);
      this.queryCameraList();
    },
    // 选择页尺寸
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryCameraList();
    },
    // 新增分页
    handleNewPageChange(val) {
      var p = this.getTabPage();
      p.currPage = val;
      this.setTabPage(p);
      this.getCameraDetailList(this.verifyType);
    },
    //页面尺寸
    handleNewSizeChange(val) {
      var p = this.getTabPage();
      p.currPage = 1;
      p.pageSize = val;
      this.setTabPage(p);
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
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => {
        return item.id;
      });
    },
  },
};
</script>
<style lang="less" src="../../css/DeviceTranscoding.less"></style>

