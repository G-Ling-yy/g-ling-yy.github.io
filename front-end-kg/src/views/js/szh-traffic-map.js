

/*import echarts from 'echarts'
import '@/style/theme/index.css'*/

import { mapState, mapActions, mapMutations } from "vuex";
//import api from '../api/index.js';
import loading from "../../components/common/Loading";
import trafficAmap from "../../components/TrafficAmap";

export default {
  name: "mapPage",
  components: {
    loading,
    trafficAmap,
  },
  // beforeCreate() {
  //   if (!this.$_btnPermissionCheck(109310)) {
  //     this.$router.push("/dashboard");
  //   }
  // },
  data() {
    return {
      hasFullScreen: false, // 是否全屏
      currentDateTime: "",
      progressRoadCollapseIndex: 0,
      toggleSetting: false,
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
      cameraStatusChange: {
        4: true,
        1: true,
        3: true
      }, //['ero','ol','fl']
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
          {code: 'road', name: "", value: ""},
          { code: "camera", name: "", value: "" },
        ],
        [
          {code: 'company', name: "", value: ""},
          { code: "camera", name: "", value: "" },
        ],
      ],
      oldCameraCategoryRouteList: [
        [], //忽略0下标
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: "camera", name: "", value: "" },
        ],
        [
          { code: "camera", name: "", value: "" },
        ],
      ],
      // 查找摄像头所选路径
      cameraCategoryRoute: 1, // 默认是路线
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
      leftTree: {
        roadData: [],
        orgData: [],
        cameraList: [],
        borrowRoad: [],
        borrowOrg: [],
        borrowCamera: []
      },
      rightRoadData: [],
      rightReginData: [],
      borrowCameraLoading: false,
      currBorrowCategoryCode: 'road',
      queryPointParams: {}
    };
  },
  computed: {
    ...mapState([
      "login",
      //"provinces",
      //"orgList",
      "classIfyList", // 摄像机类别
      "userInfo",
      "camera",
      "deviceStatistics",
      "selectCameraIndex",
    ]),

    currRouterIndex() {
      //当前所选路径
      let that = this,
        path = that.cameraCategoryRouteList[that.cameraCategoryRoute],
        curIndex = 0;
      path.forEach(function(pt, index, array) {
        // && (mapClick && route.code !== currCate)
        if (pt.code === that.currCategoryCode) {
          curIndex = index;
        }
      });
      return curIndex;
    },
    /**
     * 上一层路径
     */
    prevCategoryCode() {
      let prevIdx = 0,
        prevCode = "province",
        prevInfo = {};

      //prevIdx = this.currCategoryPathIndex - 1 < 0 ? 0 : this.currCategoryPathIndex - 1;
      prevIdx =
        this.currCategoryPathIndex - 2 < 0
          ? -1
          : this.currCategoryPathIndex - 2;
      if (prevIdx < 0) {
        return [
          prevIdx,
          "coutrt",
          { code: "country", name: "全国", value: "100000" },
        ];
      }
      //console.info('prevCategoryCode', prevIdx);
      prevInfo = this.cameraCategoryRouteList[this.cameraCategoryRoute][
        prevIdx
      ];
      prevCode = prevInfo.code;

      return [prevIdx, prevCode, prevInfo];
    },
  },
  watch: {
    /**
     * 摄像头类型切换
     */
    cameraCateSelect() {
      let rout = this.cameraCategoryRouteList[this.cameraCategoryRoute],
        pathInfo = rout[this.currCategoryPathIndex],
        lastPath =
          this.currCategoryPathIndex > 0
            ? rout[this.currCategoryPathIndex - 1]
            : rout[0];
      //送上一级往下查
      //if(pathInfo.code === 'camera') this.currCategoryPathIndex--;
      //this.changeCameraCategoryPath(pathInfo.value, pathInfo.name, pathInfo.code);
      //console.info(rout);
      //
      // this.checkListData(pathInfo.value, pathInfo.name, pathInfo.code);
    },
  },
  beforeMount() {
    //this.loadDefaultMapEvent();
  },
  mounted() {
    //this.toggleSetting = 'box-on-top';
    //接口登录不显示头部导航，地图配合显示全屏
    if ((this.userInfo.source && this.userInfo.source === "2") && this.userInfo.userType !== '4') {
      this.toggleSetting = true;
    }else {
      this.toggleSetting = false;
    }

    window.echarts = this.$echarts;
    //let _this = this,uInfo = _this.userInfo;
    this.getCodemaster({codeType: "CLASSIFY"});

    //2020年03月05日 08:29

    setInterval(() => {
      this.currentDateTime = this.Utils.date("Y年m月d日 H:i:s");
    }, 1000);
  },
  methods: {
    ...mapActions([
      //"getProvince",
      // "logout",
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
    userExit() {
      const h = this.$createElement;
      const newDatas = [h("p", null, "确定退出系统？")];
      this.$confirm("提示", {
        title: "提示",
        message: h("div", null, newDatas),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$message({
            message: "退出成功",
            type: "success",
          });

          //localStorage.setItem('cloudplatform',null);

          // this.logout();

        })
        .catch(() => {});
    },

    /**
     * 右侧边栏收放点击
     */
    rightSideCollapsedClick() {
      //this.rightsidecollapsed = !this.rightsidecollapsed;

      /*type  if(type === 1) this.rightChartBoxCollapsed = !this.rightChartBoxCollapsed;
      if(type === 2) this.rightProvinceStatCollapsed = !this.rightProvinceStatCollapsed;
      if(type === 3) this.rightRoadStatCollapsed = !this.rightRoadStatCollapsed;*/
      let that = this;
      that.rightSideCollapsed = !that.rightSideCollapsed;
      that.$nextTick(() => {
        //console.info('that.rightSideCollapsed',that.rightSideCollapsed);
        setTimeout(() => {
          if (!that.rightSideCollapsed) {
            // type === 1 &&
            that.rightPieChart(that.pieChartData, that.pieChartDataTotal);
          }
        }, 200);
      });
    },

    /**
 * 饼图加载函数
 * @param pieChartData
 */
rightPieChart(pieChartData, pieChartDataTotal){
  // 基于准备好的dom，初始化echarts实例
  let obj = document.getElementById("abnormal-chart");
  if (!obj) {
    return false;
  }
  let legend = _.map(pieChartData, it => it.name);
  //console.log("pieChartData=>",pieChartData);
  let myChart = window.echarts.init(obj);
  var that = this;
  // 绘制图表
  myChart.setOption({
    tooltip: {
      show: false,
      trigger: "item",
      //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    /*graphic: {
        type: 'text',
        left: "center",
        top: 'center',
        //z: 2,
        zlevel: 100,// 显示层级
        style: {
            text: pieChartDataTotal,
            textAlign: 'center',
            //position: 'center',
            fill: '#ffffff',
            font: '18px Microsoft YaHei'
        }
    },*/
    legend: {
      orient: "vertical",
      right: 20,
      top: "center",
      align: "left",
      data: pieChartData.name,
      padding: [0, 20],
      selectedMode: true,
      itemWidth: 20,
      itemHeight: 10,
      icon: "circle",
      inactiveColor: "#dedede",
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        color: "#ffffff",
        width: 80,
      },
      tooltip: {
        show: false,
      },
    },
    title: {
      text: pieChartDataTotal,
      //subtext: datasubtext[0],
      left: "29%",
      y: "center",
      textAlign: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "normal",
        color: ["#ffffff"],
      },
    },
    series: [
      {
        name: "摄像机统计",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["30%", "50%"],
        avoidLabelOverlap: false,
        //hoverAnimation: false,
        //legendHoverLink: false,
        silent: false,
        label: {
          normal: {
            show: false,
          },
          /*normal: {
              show: false,
              position: 'center'
          },
          emphasis: {
              show: true,
              textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold',
                  color: '#fff'
              }
          }*/
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          emphasis: {
            /*text: pieChartDataTotal + 10000000,*/
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          color: function(params) {
            var colorList = [
              "rgb(0, 234, 255)",//正常
              "rgb(83, 104, 146)",//离线
              "rgb(255, 54, 7)",//故障
            ];
            return colorList[params.dataIndex];
          },
        },
        data: pieChartData,
      },
    ],
  });
  myChart.on("click", (params) => {
    //let sersName = params.name;
    console.info("click", params);
    let type = params.componentType;
    // if (type === "title") {
    //   //中间title单击，还原显示所有图标

    //   this.cameraStatusChange = [];
    //   this.refreshAmapMarks(this.eventRegionCode);
    //   return true;
    // }

    if (type === "series") {
      // 饼图扇形片单击，隐藏/显示对应状态摄像机图标
      let s = ["离线", "正常", "故障"];
      console.log(
        "n",
        params,
        params.name.split(" ")[0],
        s.indexOf(params.name.split(" ")[0])
      );
      let statusArr = [4, 1, 3];
      let key = statusArr[s.indexOf(params.name.split(" ")[0])];
      _.each(that.cameraStatusChange, (v, k) => {
        that.cameraStatusChange[parseInt(k)] = parseInt(k) === key
      });
      that.refreshAmapMarks(that.eventRegionCode);
      
    }
  });
  window.addEventListener("resize", () => {
    myChart.resize();
  });
},

    /**
     * 计算饼图数据
     * @param list
     */
    checkPieData(list) {
      this.queryPieData();
      this.queryHomeRightRoad();
      this.queryHomeRightRegin();
    },

    queryPieData(){
      this.$api.queryHomePieData().then(res => {
        let data = res.data;
        this.pieChartData = [
          { value: data.online_count, name: "正常 ( " + data.online_count + " )" },
          { value: data.offline_count, name: "离线 ( " + data.offline_count + " )" },
          { value: data.fault_count, name: "故障 ( " + data.fault_count + " )" },
        ];
        this.pieChartDataTotal = data.total_count;
        this.$nextTick(() => {
          this.rightPieChart(this.pieChartData, this.pieChartDataTotal);
        });
      })
    },

    queryHomeRightRoad(){
      this.$api.queryHomeRightRoad().then(res => {
        this.rightRoadData = res.data;
      })
    },

    queryHomeRightRegin(){
      this.$api.queryHomeRightCompany().then(res => {
        this.rightReginData = res.data;
      });
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
      this.cameraStatusChange[type] = !this.cameraStatusChange[type]

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
      //
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
    refreshAmapMarks(currRegionCode, isBorrow) {
      // console.info("currRegionCode", currRegionCode);
      this.eventRegionCode = currRegionCode;

      let that = this,
        mymap = that.$refs.amapIns.mapInstance,
        bounds = mymap.getBounds(),
        zoom = mymap.getZoom(),
        postBody = {
          /*cityCode:'',
          classify:'',
          orgnizationId:'',
          provinceCode:'',
          road:''*/
        };
        let borrowValue = null;
        if(!_.isUndefined(isBorrow)){
          borrowValue = isBorrow ? 2: 1;
        }
      let data = {
        zoomLevel: zoom, //13,
        northEast: bounds.northeast.toString(),
        southWest: bounds.southwest.toString(),
        isBorrow:  borrowValue,
        ...this.queryPointParams
      };
      // if(this.currCategoryCode === 'road'){
      //   data.roadId = dataCate;
      // }else {
      //   data.orgId = dataCate;
      // }
      this.$api.queryReginHomeCamera(data).then((res) => {
        //
        //根据选中的状态、类型筛选数据
        let newArr = res.data.filter((vo) => {
          let hasType = that.cameraTypeSelect.indexOf(vo.classify),
            hasStatus = that.cameraStatusChange[parseInt(vo.onlineStatus)];
          let isDis = vo.displayStatus === '0';

          //收费广场、收费站连体

          if (vo.classify === "4" || vo.classify === "8") {
            hasType = that.cameraTypeSelect.indexOf("5");
          }
          if (vo.classify === "9" || vo.classify === "0") {
            hasType = that.cameraTypeSelect.indexOf("1");
          }

          //console.info(vo.classify,vo.onlineStatus,hasType,hasStatus);
          return hasType >= 0 && hasStatus && !isDis;
        });
        //console.info(res);
        //TODO: 层级变化查询接口，返回摄像头路线字段为 road
        that.$refs.amapIns.pointsSetIn(newArr);

        console.info(
          "refreshAmapMarks",
          "层级: " + zoom,
          "数量: " + res.data.length,
          "实际数量： " + newArr.length,
          "  " + data
        );
      });
    },

    /**
     * 查询摄像机统计数据
     * @param data
     * @param callback
     * @returns {boolean}
     */
    queryStaticDataList(data) {
      let _this = this;
      this.$api.queryHomeLeftList({
        type: data.type
      }).then(res => {
        if(data.type === 1){
          this.currCategoryCode = 'road';
          this.currBorrowCategoryCode = 'road';
          this.leftTree.roadData = res.data.list;
          this.leftTree.borrowRoad = res.data.borrowList;
        }else {
          this.currCategoryCode = 'company';
          this.currBorrowCategoryCode = 'company';
          this.leftTree.orgData = res.data.list;
          this.leftTree.borrowOrg = res.data.borrowList;
        }
        this.refreshAmapMarks(this.userInfo.regionCode);
        this.cameraLoading = false;
      })
      
    },

    /**
     * 地图上显示指定摄像头位置
     */
    showCamera2AMap(cameraInfo, idx) {
      //console.info(cameraInfo);

      //this.$message.success(JSON.stringify(cameraInfo));

      this.$refs.amapIns.cameraInfoWindowShow({
        data: {
          position: [cameraInfo.longitude, cameraInfo.latitude],
          onlineStatus: cameraInfo.onlineStatus,
          cameraName: cameraInfo.cameraName,
          cameraId: cameraInfo.cameraId,
          cameraNum: cameraInfo.cameraNum,
          organizationId: cameraInfo.organizationId,
          regionCode: cameraInfo.regionCode,
          roadId: cameraInfo.roadId,
          kmPile: cameraInfo.kmPile,
          hmPile: cameraInfo.hmPile,
          classify: cameraInfo.classify,
          cameraType: cameraInfo.cameraType,
        },
      });

      this.setSelectCameraIndex(idx);
    },

    /**
     * 地图加载完成回调
     */
    amapCompleteCallback() {
      console.info("amapCompleteCallback");
      this.rightSideCollapsed = false;
      //let _this = this;
      //显示左侧区块
      this.leftSideCollapsed = false;
      let _this = this;
      //带上组织查路线
      _this.queryStaticDataList({
        type: 1
      });
      this.checkPieData();
    },

    /**
     * 地图点击回调
     *
     * 点击后设置为按城市查找
     */
    amapClickCallback(currFeature) {
      //[320000, "江苏省", "province"]   [320100, "南京市", "city"]
      //console.info('amapClickCallback 11 ',currFeature,that.currentMapRegionCode);

      //this.regionCode          =  currFeature[0];
      //刷新当前列表数据
      //that.changeCameraCategoryPath(currFeature[0], currFeature[1], currFeature[2], true);
      let currRoute = that.cameraCategoryRouteList[that.cameraCategoryRoute],
        pathInfo = {}; //that.cameraCategoryRouteList[that.cameraCategoryRoute][that.currCategoryPathIndex];
      //路线已选择，切换到路线以下全国
      if (currRoute[0].code === "road") {
        if (currRoute[0].value) {
          that.currCategoryPathIndex++;
        } else {
          that.currCategoryPathIndex = 0;
        }
      }
      if (that.currCategoryPathIndex + 1 > currRoute.length)
        that.currCategoryPathIndex = currRoute.length - 1;
      pathInfo = currRoute[that.currCategoryPathIndex];

      //切换区域后，清理区域以后的路径数据
      if (currRoute[0].code !== "road")
        that.clearCameraCategoryPath(
          that.cameraCategoryRoute,
          that.currCategoryPathIndex
        );

      that.currCategoryCode = pathInfo.code;
      //that.checkListData(currFeature[0], currFeature[1], currFeature[2]);
      that.checkListData(
        pathInfo.value,
        pathInfo.name.replace("省", ""),
        pathInfo.code
      );

      console.info(
        "amapClickCallback",
        that.cameraCategoryRouteList,
        that.cameraCategoryRoute,
        pathInfo,
        that.currCategoryPathIndex,
        that.currentMapRegionCode,
        that.currCategoryCode
      );
    },

    /**
     * 摄像头查询路径选择
     *
     * @param curr
     */
    checkCameraRouterBtnClick(curr) {
      let that = this;
      that.cameraLoading = false;
      if (that.cameraCategoryRoute === curr) {
        return false;
      }
      that.cameraCategoryRouteList = _.cloneDeep(that.oldCameraCategoryRouteList);
      //选择的路径类型
      that.cameraCategoryRoute = curr;
      that.queryStaticDataList({
        type: curr
      });
      
      setTimeout(() => {
        that.$refs.amapIns.switch2AreaNode(that.userInfo.regionCode);
      }, 0);
    },

    /**
     * 查询摄像头路径跳转，列表点击，面包屑点击
     *
     * @param cid      显示名称
     * @param cname    对应value
     * @param newCate  当前显示路径地址
     * @returns {boolean}
     */
    changeCameraCategoryPath(cid, cname, newCate, isBorrow) {
      let that = this;
      //更新地图显示
      setTimeout(() => {
        that.$refs.amapIns.switch2AreaNode(this.userInfo.regionCode);
      }, 0);

      that.checkListData("", "", cid, isBorrow);
      //更新地图显示的点
      that.refreshAmapMarks(this.userInfo.regionCode, isBorrow);
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
        //
        that.clearCameraCategoryPath(
          that.cameraCategoryRoute,
          that.currCategoryPathIndex
        );
        that.changeCameraCategoryPath(
          pathInfo.value,
          pathInfo.name,
          pathInfo.code
        );

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
     * 查询列表要显示的数据
     *
     * @returns {boolean} 数据加载是否成功
     */
    checkListData(cid, cname, dataCate, isBorrow) {
      //
      //console.info('checkListData',cid,cname,dataCate);
      let that = this;
      //是否还有下一级，更新当前列表
      //TODO: 刷新当前列表显示数据
      if(isBorrow){
        that.borrowCameraLoading = true;
      }else {
        that.cameraLoading = true;
      }
      let data = {};
      if(this.currCategoryCode === 'road' || this.currBorrowCategoryCode === 'road'){
        data.roadId = dataCate;
      }else {
        data.orgId = dataCate;
      }
      this.queryPointParams = data;
      data.isBorrow = isBorrow ? 2 : 1;
      this.$api.queryReginHomeCamera(data).then((res) => {
        if(isBorrow){
          that.currBorrowCategoryCode = 'borrowCamera';
          this.leftTree.borrowCamera = res.data;
          that.borrowCameraLoading = false;
        }else {
          that.currCategoryCode = 'camera';
          this.leftTree.cameraList = res.data;
          that.cameraLoading = false;
        }
        
      })
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

    /**
     * 鼠标移动联动地图区块
     *
     * @param adcode
     */
    districtMouseover(adcode) {
      //districtExplorer.setHoverFeature(currentAreaNode.getSubFeatureByAdcode(adcode));
      if (window.hoverTimeout) {
        clearTimeout(window.hoverTimeout);
      }
      window.hoverTimeout = setTimeout(() => {
        this.$refs.amapIns.districtHover(adcode);
      }, 300);
    },

    /**
     * 查询省市列表-无用
     *
     * @param level
     * @param keyword
     * @param callback
     */
    searchDistrict(level, keyword, callback) {
      //level    = level ? level : 'country'
      //keyword  = keyword ? keyword : '中国'

      let subdistrict = 1;
      if (level === "province" && keyword.indexOf("市") >= 0) {
        level = "district";
        keyword = keyword.replace("市", "城区");
        subdistrict = 1;
      }

      //console.info(level,keyword,keyword.indexOf('市'));

      AMap.plugin("AMap.DistrictSearch", function() {
        let districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: level, //'country',
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: subdistrict,
        });

        // 搜索所有省/直辖市信息
        districtSearch.search(keyword, function(status, result) {
          // 查询成功时，result即为对应的行政区信息
          //console.info('searchDistrict',status, result);

          if (result.info !== "OK") {
            return false;
          }

          let list = result.districtList[0].districtList;
          //console.info(result.districtList[0].districtList);

          if (typeof callback === "function") {
            callback(list);
          }
        });
      });
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
