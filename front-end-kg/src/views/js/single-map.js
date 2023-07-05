/*import echarts from 'echarts'
import '@/style/theme/index.css'*/

import { mapState, mapActions, mapMutations } from "vuex";
//import api from '../api/index.js';
import loading from "../../components/common/Loading";
import ScreenAmap from "../../components/screen/ScreenAmap.vue";
// import {initFirst,connection,disconnect} from '../../filters/websocket.js';

export default {
  name: "mapPage",
  components: {
    loading,
    "screen-amap": ScreenAmap,
  },
  beforeCreate() {
    /*if(!this.$_btnPermissionCheck(109310)){
      this.$router.push('/dashboard');
    }*/
  },
  data() {
    return {
      webSocketClient: "",
      targetScreen: "",
      hasFullScreen: false, // 是否全屏
      //rightPieChart,
      currentDateTime: "",
      progressRoadCollapseIndex: 0,
      boxOnTop: "",
      map: null,
      pieChartData: [],
      pieChartDataTotal: 0,
      //左侧浮层显示控制
      leftSideCollapsed: true,
      //右侧侧浮层显示控制
      rightSideCollapsed: true,

      rightChartBoxCollapsed: true,
      rightProvinceStatCollapsed: true,
      rightRoadStatCollapsed: true,

      // 摄像头类型select
      cameraCateSelect: "99",
      // 摄像头状态切换
      cameraStatusSelect: 99,
      //地图摄像头状态
      cameraStatusChange: ["0", "1", "2"], //['ero','ol','fl']
      //地图摄像头类型
      cameraTypeSelect: ["0", "1", "2", "3", "4", "7", "5", "6", "8", "9"], //['dlyx','mj','qd','etc','sfz','fwq']
      cameraStatusCollapsed: true,
      /**
       * 查找摄像头路线分类，归类处理，方便扩展
       * 省份-城市-摄像头、省份-单位-摄像头、线路-摄像头
       * province 省份, city 城市, company 单位, road 路线, camera 摄像头
       * code 当前列表显示数据级别
       * name 选择项名称
       * value 选择项标识(id)
       */
      cameraCategoryRouteList: [
        [], //忽略0下标
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: "province", name: "", value: "" },
          { code: "company", name: "", value: "" },
          { code: "road", name: "", value: "" },
          { code: "camera", name: "", value: "" },
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          /*{code:'province',name:'',value:''},
          {code:'city',name:'',value:''},*/
          { code: "road", name: "", value: "" },
          { code: "province", name: "", value: "" },
          { code: "camera", name: "", value: "" },
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: "province", name: "", value: "" },
          { code: "city", name: "", value: "" },
          { code: "road", name: "", value: "" },
          { code: "camera", name: "", value: "" },
        ],
      ],
      // 查找摄像头所选路径
      cameraCategoryRoute: 2, // 默认是路线
      // 当前路径所显示位置
      currCategoryPathIndex: 0,
      // 当前列表数据显示等级
      currCategoryCode: "road", //province city road company camera
      //列表数据加载状态
      cameraLoading: true,
      //地市数据
      provinceList: [],
      cityList: [],
      companyList: [],
      roadList: [{ roadName: "" }],
      cameraList: [{ cameraName: "", lng: "", lat: "", status: 1 }],

      freshCameraStatusInt: 0,

      //右侧统计数据tab切换
      rightProgressChose: "province", // 'road'
      mapLayerType: "base", // 'google'

      currentMapRegionCode: 0,
      //筛选数据，用户进页面时候判断
      regionCode: 0,
      regionName: "",
      organizationId: "",
      organizationType: "",
      eventRegionCode: "", //当前地图选中的regionCode
    };
  },
  // amap://styles/218d2a567692dd432b4cafd07316d9cc
  computed: {
    ...mapState([
      "login",
      "classIfyList", // 摄像机类别
      "userInfo",
      "camera",
      "deviceStatistics",
      "selectCameraIndex",
    ]),
  },
  mounted() {
    //this.boxOnTop = 'box-on-top';

    window.echarts = this.$echarts;
    //let _this = this,uInfo = _this.userInfo;
    this.getCodemaster({codeType: "CLASSIFY"});

    //2020年03月05日 08:29
    setInterval(() => {
      this.currentDateTime = this.Utils.date("Y年m月d日 H:i:s");
    }, 1000);

    /////////////////////////////////////////
    /////               websocket链接
    /////////////////////////////////////////
    this.connectWebsocket();
    // this.refreshAmapMarks();
  },
  beforeDestroy() {
    if (this.webSocketClient) {
      this.webSocketClient.close();
    }
  },
  methods: {
    ...mapActions([
      //"getProvince",
      "logout",
      "getCodemaster",
      "getDeviceStatistics",
      "getCameraListForStatis",
      "getCameraListForPot",
    ]),
    ...mapMutations([
      "setCameraStatisticsList",
      "setCameraStatisticsListByProvince",
      "setCameraStatisticsListByCity",
      "setCameraStatisticsListByRoad",
      "setCameraStatisticsListByOrg",
      "setCameraStatisticsByRoadAll",
      "setCameraStatisticsByRegionAll",
      "setSelectCameraIndex",
    ]),

    connectWebsocket() {
      let that = this;
      if ("WebSocket" in window) {
        let url = that.BASECONFIG.WEBSOCKET_SERVER_URL;
        that.webSocketClient = new WebSocket(url); //打开WebSocket
      } else {
        alert("你的浏览器不支持WebSocket");
        return false;
      }

      that.webSocketClient.onopen = function() {
        //处理连接开启事件
        console.log("Opening");
        // js定时发送心跳消息
        setInterval(() => {
          that.webSocketClient.send("heart");
        }, 1000);
      };

      that.webSocketClient.onmessage = function(e) {
        //处理信息
        e = e || event; //获取事件，这样写是为了兼容IE浏览器
        // console.log(e, e.data, that.webSocketClient);
        if (e.data.indexOf("successful") > 0) {
          let data = { msgType: "login", idname: "touch_screen" };
          if (that.webSocketClient)
            that.webSocketClient.send(JSON.stringify(data));
        }
      };

      that.webSocketClient.onclose = function() {
        //处理连接关闭事件
        console.log("Closing");
      };

      that.webSocketClient.onerror = function(error) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log(error);
      };
    },

    sendCameraSocketInfo(cameraId) {
      switch (this.targetScreen) {
        case "right_screen":
          this.targetScreen = "left_screen";
          break;
        case "left_screen":
          this.targetScreen = "right_screen";
          break;
        default:
          this.targetScreen = "left_screen";
          break;
      }
      let data = {
        msgType: "action",
        idname: "touch_screen",
        target: this.targetScreen,
        url: cameraId,
      };

      if (this.webSocketClient) this.webSocketClient.send(JSON.stringify(data));
    },

    amapMarkerClick(cameraInfo) {
      console.info("amapMarkerClick ", cameraInfo);
      this.sendCameraSocketInfo(cameraInfo.cameraId);
    },

    checkMapType(val) {
      this.mapLayerType = val;
      this.$refs.amapIns.checkGoogleMapType(val);
      //checkGoogleMapType
    },

    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.hasFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        //console.log('已还原！');
      } else {
        // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        //console.log('已全屏！');
      }
      // 改变当前全屏状态
      this.hasFullScreen = !this.hasFullScreen;
    },

    /**
     * 摄像机状态筛选切换
     * @param type
     */
    cameraStatusSelectClick(type) {
      /*let _this = this;
      _this.cameraStatusSelect = type;*/

      if (this.cameraStatusCollapsed) {
        this.cameraStatusCollapsed = !this.cameraStatusCollapsed;
        return false;
      }

      let iddx = this.cameraStatusChange.indexOf(type);
      if (iddx >= 0) {
        this.cameraStatusChange.splice(iddx, 1);
      } else {
        this.cameraStatusChange.push(type);
      }

      this.refreshAmapMarks(this.eventRegionCode);
    },

    cameraStatusCollapseClick() {
      this.cameraStatusCollapsed = !this.cameraStatusCollapsed;
    },

    /**
     * 摄像机类型筛选切换
     * @param type
     */
    cameraTypeSelectClick(type) {
      let iddx = this.cameraTypeSelect.indexOf(type);
      if (iddx >= 0) {
        this.cameraTypeSelect.splice(iddx, 1);
      } else {
        this.cameraTypeSelect.push(type);
      }

      this.refreshAmapMarks(this.eventRegionCode);
    },

    /**
     * 地图层级变化时，刷新地图显示点数据
     *
     * @param currRegionCode
     * @returns {boolean}
     */
    refreshAmapMarks(currRegionCode) {
      //console.info('currRegionCode',currRegionCode);
      this.eventRegionCode = currRegionCode;

      let _this = this,
        mymap = _this.$refs.amapIns.mapInstance,
        bounds = mymap.getBounds(), //获取地图显示返回
        zoom = mymap.getZoom(),
        postBody = {
          /*cityCode:'',
          classify:'',
          orgnizationId:'',
          provinceCode:'',
          road:''*/
        },
        rout = _this.cameraCategoryRouteList[_this.cameraCategoryRoute];

      //console.info('refreshAmapMarks',data,rout,rout[_this.currCategoryPathIndex]);
      //if(rout[_this.currCategoryPathIndex].code === 'camera') return false;

      //地图刷新不跟随列表摄像机数据
      /*if (_this.cameraCateSelect && _this.cameraCateSelect !== '99') {
          postBody.classify = _this.cameraCateSelect;
      }*/

      //获取路径所选的所有参数
      let ndata = _this.getPreParamsAr();
      if (
        currRegionCode &&
        parseInt(("" + currRegionCode).substr(2, 4)) === 0 &&
        currRegionCode !== 100000
      )
        postBody.provinceCode = currRegionCode;
      if (ndata.provinceCode && ndata.provinceCode !== 100000)
        postBody.provinceCode = ndata.provinceCode;
      if (ndata.cityCode) postBody.cityCode = ndata.cityCode;
      if (ndata.organizationId) postBody.organizationId = ndata.organizationId;
      if (ndata.road) postBody.road = ndata.road;

      //追踪到市范围显示内容
      if (currRegionCode && parseInt(("" + currRegionCode).substr(2, 4)) > 0) {
        postBody.cityCode = currRegionCode;
      }

      postBody.organizationId = "9901001006"; // 宁沪高速
      postBody.organizationCode = "9901001006"; // 宁沪高速
      let data = {
        params: {
          zoomlevel: zoom, //13,
          NorthEast: bounds.northeast.toString(),
          SouthWest: bounds.southwest.toString(),
        },
        data: postBody,
      };
      console.log(bounds.northeast.toString(), bounds.southwest.toString());
      _this.getCameraListForPot(data).then((res) => {
        //根据选中的状态、类型筛选数据
        let newArr = res.data.filter((vo) => {
          let hasType = _this.cameraTypeSelect.indexOf(vo.classify),
            hasStatus = _this.cameraStatusChange.indexOf(
              vo.onlineStatus || "1"
            );

          //收费广场、收费站连体
          if (vo.classify === "4") {
            hasType = _this.cameraTypeSelect.indexOf("5");
          }
          if (vo.classify === "9" || vo.classify === "0") {
            hasType = _this.cameraTypeSelect.indexOf("1");
          }

          //console.info(vo.classify,vo.onlineStatus,hasType,hasStatus);
          return hasType >= 0 && hasStatus >= 0;
        });
        //console.info(res);
        //TODO: 层级变化查询接口，返回摄像头路线字段为 road
        _this.$refs.amapIns.pointsSetIn(newArr);
        console.info(
          "refreshAmapMarks",
          "层级: " + zoom,
          "数量: " + res.data.length,
          "显示数量： " + newArr.length
        );
      });
    },

    /**
     * 查询摄像机统计数据
     * @param data
     * @param callback
     * @returns {boolean}
     */
    queryStaticDataList(data, callback) {
      let _this = this;

      if (!data.dimensionType) {
        return false;
      }

      if (!data.data) data.data = {};
      //{dimensionType:'province'}

      _this.getDeviceStatistics(data).then((res) => {
        //console.info('queryStaticDataList', res);

        if (res && res.code === 200) {
          //_this.setCameraStatisticsByRegion(res.data);
          if (typeof callback === "function") {
            callback(res);
          }
        }
      });
    },

    /**
     * 查询摄像机详细信息列表
     * @returns {boolean}
     */
    queryCameraStaticDataList() {
      //getCameraListForStatis
      let _this = this,
        args = {
          params: {
            currPage: 1,
            pageSize: 2000, // 暂未使用分页功能
          },
          data: {},
        };

      //获取路径所选的所有参数
      args.data = _this.getPreParamsAr();

      //查询数据
      _this.getCameraListForStatis(args).then((res) => {
        //console.info('getCameraListForStatis', res);
        _this.cameraLoading = false;
        //that.setCameraStatisticsList(res.data);

        //TODO: 设置地图点 pointsSetIn   数据中摄像头信息，路线字段是roadId
        //_this.$refs.amapIns.pointsSetIn(res.data);

        /*if(res.code === 200){
            _this.setCameraStatisticsList(res.data);

        }*/
      });
    },

    /**
     * 地图加载完成回调
     */
    amapCompleteCallback() {
      //console.info('svsdvsdv');
      //this.rightSideCollapsed = false;

      //显示左侧区块
      //this.leftSideCollapsed = false;
      //return false;
      let _this = this,
        uInfo = _this.userInfo;
      //console.info('_this.userInfo ',_this.userInfo);
      // _this.regionCode = 100000; //uInfo.regionCode;
      // _this.regionName = "全国"; // uInfo.regionName;
      // _this.currentMapRegionCode = 100000; //uInfo.regionCode;
      _this.regionCode = uInfo.regionCode;
      _this.regionName = uInfo.regionName;
      _this.currentMapRegionCode = uInfo.regionCode;
      /*_this.organizationId      =  uInfo.organizationId;
      _this.organizationType    =  uInfo.organizationType;*/
    },

    /**
     * 面包屑导航单击
     */
    breadcrumbClick(e, pathInfo, ridx) {
      let that = this,
        //oldCate = this.currCategoryCode,
        routerList = that.cameraCategoryRouteList[that.cameraCategoryRoute],
        curIndex = 0;

      that.currCategoryPathIndex = ridx || 0;
      //if(!pathInfo && that.regionCode !== 100000) return false;

      //全国
      if (!pathInfo) {
        //设置所在位置
        that.currCategoryPathIndex = 0;
        that.currentMapRegionCode = that.regionCode;
        //that.setPercent();
        that.currCategoryCode = routerList[0].code; //当前所在位置code
        that.$refs.amapIns.switch2AreaNode(that.regionCode); //更新地图到初始图层

        //清理当前之后的路径缓存
        //that.clearCameraCategoryPath(that.cameraCategoryRoute, 0);
        /*let path = that.cameraCategoryRouteList[that.cameraCategoryRoute];
        path.forEach(function (route, vidx) {
            path[vidx].name = '';
            path[vidx].value = '';
        });
        that.cameraCategoryRouteList[that.cameraCategoryRoute] = path;*/
        //if(that.regionCode === 100000){

        //}
        that.cameraCategoryRouteList.forEach((volist, idx) => {
          if (volist.length) {
            volist.forEach((vo, vidx) => {
              //
              //全国用户才能清理省份信息
              if (
                that.regionCode !== 100000 &&
                ["province", "city"].indexOf(vo.code) >= 0
              ) {
                return false;
              }
              that.cameraCategoryRouteList[idx][vidx].name = "";
              that.cameraCategoryRouteList[idx][vidx].value = "";
            });
          }
        });

        that.checkListData("", "", that.currCategoryCode);
        //return true;
      } else {
        that.clearCameraCategoryPath(
          that.cameraCategoryRoute,
          that.currCategoryPathIndex
        );
        //that.changeCameraCategoryPath(pathInfo.value, pathInfo.name, pathInfo.code);

        //还原到省份或城市
        if (pathInfo.code === "province" || pathInfo.code === "city") {
          that.currentMapRegionCode = pathInfo.value;
        } else {
          let nrcode = 0;
          routerList.forEach((vo, idx) => {
            if (vo.code === "province" || vo.code === "city") {
              nrcode = vo.value;
            }
          });
          that.currentMapRegionCode = nrcode || 100000;
        }
        //更新地图显示
        setTimeout(() => {
          that.$refs.amapIns.switch2AreaNode(that.currentMapRegionCode);
        }, 0);

        that.checkListData("", "", pathInfo.code);
      }

      //更新地图显示的点
      that.refreshAmapMarks(that.currentMapRegionCode);
      console.info(
        "breadcrumbClick",
        that.cameraCategoryRouteList,
        that.cameraCategoryRoute,
        that.currCategoryPathIndex,
        that.currentMapRegionCode
      );
    },

    /**
     * 整理本路径已选择的数据项，用到下一级查询中
     */
    getPreParamsAr() {
      let that = this,
        rout = that.cameraCategoryRouteList[that.cameraCategoryRoute],
        params = {};

      /*{code: 'province', name: '', value: ''},
      {code: 'company', name: '', value: ''},
      {code: 'city', name: '', value: ''},
      {code: 'road', name: '', value: ''},
      {code: 'camera', name: '', value: ''},*/

      //let lastCode = '';
      rout.forEach((vo) => {
        let code = vo.code;
        switch (code) {
          case "province":
            // 优先选择的省份，其次选择用户所属省份，全国不填
            if (vo.value && parseInt(vo.value) !== 100000) {
              params.regionCode = parseInt(vo.value);
              params.provinceCode = parseInt(vo.value);
            } else if (that.userInfo.regionCode !== 100000) {
              params.regionCode = that.userInfo.regionCode;
              params.provinceCode = that.userInfo.regionCode;
            }
            break;
          case "city":
            if (vo.value) params.regionCode = parseInt(vo.value);
            params.cityCode = parseInt(vo.value);
            //params.regionCode = vo.value;
            break;
          case "company":
            params.organizationId = vo.value;
            break;
          case "road":
            params.road = vo.value;
            break;
        }
        //lastCode = vo.code;
      });

      if (that.cameraCateSelect && that.cameraCateSelect !== "99") {
        params.classify = that.cameraCateSelect;
      }

      if (that.currentMapRegionCode && that.currentMapRegionCode !== 100000) {
        let provinceCode =
          parseInt((that.currentMapRegionCode + "").substr(0, 2)) * 10000;
        params.regionCode = provinceCode;
        params.provinceCode = provinceCode;
        if (parseInt((that.currentMapRegionCode + "").substr(2, 4)) > 0) {
          params.cityCode = that.currentMapRegionCode;
          params.regionCode = that.currentMapRegionCode;
        }
      }

      console.info(
        "getPreParamsAr",
        that.cameraCategoryRouteList,
        that.cameraCategoryRoute,
        rout,
        params
      );

      return params;
    },

    /**
     * 查询列表要显示的数据
     *
     * @returns {boolean} 数据加载是否成功
     */
    checkListData(cid, cname, dataCate) {
      //
      //console.info('checkListData',cid,cname,dataCate);

      let that = this,
        dataComplete = true;
      //是否还有下一级，更新当前列表
      //TODO: 刷新当前列表显示数据
      that.cameraLoading = true;

      let data = {
        dimensionType: "province",
        data: {
          //classify:that.cameraCateSelect,
          //regionCode: cid,
        },
      };
      //获取路径所选的所有参数
      data.data = that.getPreParamsAr();
      console.info("checkListData", cid, cname, dataCate, data);
      //if(that.userInfo.regionCode !== '100000') data.data.regionCode = that.userInfo.regionCode;

      switch (dataCate) {
        //country
        default:
        case "province":
          //查询省份列表
          /*this.searchDistrict('country','中国',(result)=>{
              //console.info(result);
              that.provinceList = result;
              that.cameraLoading = false;
              that.setPercent('province');//that.currCategoryCode
          });*/
          that.queryStaticDataList(data, (res) => {
            that.cameraLoading = false;
            that.setCameraStatisticsListByProvince(res.data);
          });
          break;
        case "city":
          //查询城市列表
          data.dimensionType = "city";
          that.queryStaticDataList(data, (res) => {
            that.cameraLoading = false;
            that.setCameraStatisticsListByCity(res.data);
          });
          break;
        case "company":
          //
          //单位
          data.dimensionType = "organization";
          // modify zhang yufeng by 20191203
          data.data.organizationType = "20"; // '10';
          that.queryStaticDataList(data, (res) => {
            that.cameraLoading = false;
            that.setCameraStatisticsListByOrg(res.data);
          });
          break;
        case "road":
          //路线
          data.dimensionType = "road";
          //data.data.organizationId = ''+cid;
          that.queryStaticDataList(data, (res) => {
            that.cameraLoading = false;
            that.setCameraStatisticsListByRoad(res.data);
          });
          break;
        case "camera":
          //摄像头列表

          //data.dimensionType = 'road';
          that.queryCameraStaticDataList();

          break;
      }

      return dataComplete;
    },

    /**
     * 清理查询路径，清除指定位置之后的所有数据
     *
     * @param idx   指定路径
     * @param pidx  路径位置
     */
    clearCameraCategoryPath(idx, pidx) {
      //console.info('clearCameraCategoryPath ',idx,pidx);
      if (idx) {
        let path = this.cameraCategoryRouteList[idx];
        path.forEach(function(route, vidx) {
          // && ['province','city'].indexOf(route.code) < 0
          if (vidx > pidx) {
            path[vidx].name = "";
            path[vidx].value = "";
          }
        });
        this.cameraCategoryRouteList[idx] = path;
      }
    },

    /**
     * 返回按钮单击
     */
    gobackRoute() {
      let that = this,
        iidx =
          that.currCategoryPathIndex - 1 >= 0
            ? that.currCategoryPathIndex - 1
            : 0,
        prevPath = that.cameraCategoryRouteList[that.cameraCategoryRoute][iidx];

      //console.info('gobackRoute ',prevPath,that.currCategoryPathIndex,iidx);

      //当前列表显示数据类型
      that.currCategoryCode = prevPath.code;
      //清理当前之后的路径缓存
      that.clearCameraCategoryPath(
        that.cameraCategoryRoute,
        iidx - 1 < 0 ? 0 : iidx - 1
      );
      //console.info(that.currCategoryCode);
      //that.setPercent(that.currCategoryCode);

      //console.info('gobackRoute  ',that.currCategoryCode,that.cameraCategoryRouteList[that.cameraCategoryRoute],prevPath);

      if (that.currCategoryCode === "province") {
        //当前是省，返回全国
        that.$refs.amapIns.switch2AreaNode(that.regionCode);
      }
      if (that.currCategoryCode === "city") {
        //当前是市，返回省
        let aa = iidx - 1 >= 0 ? iidx - 1 : 0,
          prevPath = that.cameraCategoryRouteList[that.cameraCategoryRoute][aa];

        //console.info('gobackRoute 222 ',aa,prevPath);

        that.$refs.amapIns.switch2AreaNode(prevPath.value);
      }

      /*if(['city','province'].indexOf(that.currCategoryCode) >=0){
          //更新地图显示
          setTimeout(()=>{
              that.$refs.amapIns.switch2AreaNode(that.currCategoryCode === 'city' ? prevPath.value : 100000);
          },0)
      }*/

      that.currCategoryPathIndex = iidx;
    },

    loadCamera(val) {
      console.info("loadCamera", val);
    },

    /**
     * 默认事件
     */
    loadDefaultMapEvent() {
      this.$root.$off("reloadCameraList");

      //控制摄像机信息修改弹窗
      this.$root.$on("reloadCameraList", (nv) => {
        this.refreshAmapMarks(this.eventRegionCode);
      });
    },

    /**
     * 右侧统计数据切换
     */
    changeRightProgress(val) {
      this.rightProgressChose = val;
    },
  },
};
