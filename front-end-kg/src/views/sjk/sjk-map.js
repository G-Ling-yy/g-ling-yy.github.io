/**
 * 饼图加载函数
 * @param pieChartData
 */
/*const rightPieChart = (pieChartData, pieChartDataTotal) => {
    // 基于准备好的dom，初始化echarts实例
    let obj = document.getElementById('abnormal-chart');
    if(!obj){
        return false;
    }
    //console.log("pieChartData=>",pieChartData);
    let myChart = window.echarts.init(obj);
    //var that = this;
    // 绘制图表
    myChart.setOption({
        tooltip: {
            show: false,
            trigger: 'item',
            //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        /!*graphic: {
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
        },*!/
        legend: {
            orient: 'vertical',
            right: 20,
            top: 'center',
            align: 'left',
            data: pieChartData.name,
            padding: [0, 20],
            selectedMode: true,
            itemWidth: 20,
            itemHeight: 10,
            icon: 'circle',
            inactiveColor: '#dedede',
            itemGap: 20,
            textStyle: {
                fontSize: 12,
                color: '#ffffff',
                width: 80
            },
            tooltip: {
                show: false
            },

        },
        title: {
            text: pieChartDataTotal,
            //subtext: datasubtext[0],
            left: '29%',
            y: 'center',
            textAlign:'center',
            textStyle: {
                fontSize:18,
                fontWeight:'normal',
                color: ['#ffffff']
            }
        },
        series: [
            {
                name: '摄像机统计',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                //hoverAnimation: false,
                //legendHoverLink: false,
                silent: false,
                label: {
                    normal: {
                        show: false
                    }
                    /!*normal: {
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
                    }*!/
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    emphasis: {
                        /!*text: pieChartDataTotal + 10000000,*!/
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    color: function (params) {
                        var colorList = ['rgb(0, 234, 255)', 'rgb(255, 54, 7)', 'rgb(83, 104, 146)'];
                        return colorList[params.dataIndex];
                    }
                },
                data: pieChartData,
            }
        ]
    });

    window.addEventListener("resize", () => {
        myChart.resize();
    });


    myChart.on('legendselectchanged', function(params) {
        let option = this.getOption();
        let select_key = Object.keys(params.selected);
        let select_value = Object.values(params.selected);
        let n = 0;
        select_value.map(res => {
            if(!res){
                n++;
            }
        });
        console.log('n',params,n)
        /!*if( n ==select_value.length){
            option.legend[0].selected[params.name] = true;
        }
        this.setOption(option)*!/
    });

    /!*myChart.on("click", pieConsole);
    function pieConsole(param) {
        //     获取data长度
        alert(option.series[0].data.length);
        //      获取地N个data的值
        // 　　alert(option.series[0].data[i]);
        //     获取series中param.dataIndex事件对应的值
        alert(param.value);
        alert(param.name);
        alert(option.series[param.seriesIndex].data[param.dataIndex].value);
        alert(option.series[param.seriesIndex].data[param.dataIndex].name);
        // 　　clickFunc(param.dataIndex);//执行点击效果,触发相应js函数
        //param具体包含的方法见 https://blog.csdn.net/allenjay11/article/details/76033232

        //刷新页面
        // location.reload();
        // window.location.reload();
    }*!/

};*/
/*import echarts from 'echarts'
import '@/style/theme/index.css'*/

import { mapState, mapActions, mapMutations } from "vuex";
//import api from '../api/index.js';
import loading from "../../components/common/Loading";
import trafficAmap from "../../components/sjk/TrafficAmap.vue";
//import emap from '@/components/EchartsMap';

export default {
  name: "mapPage",
  components: {
    loading,
    trafficAmap,
    //emap
  },
  beforeCreate() {
    if (!this.$_btnPermissionCheck(109310)) {
      this.$router.push("/dashboard");
    }
  },
  data() {
    return {
      hasFullScreen: false, // 是否全屏
      myPieChart: null,
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
      this.checkListData(pathInfo.value, pathInfo.name, pathInfo.code);
    },
  },
  beforeMount() {
    this.loadDefaultMapEvent();
  },
  mounted() {
    //this.boxOnTop = 'box-on-top';
    //接口登录不显示头部导航，地图配合显示全屏
    if (this.userInfo.source && this.userInfo.source === "2") {
      this.boxOnTop = "box-on-top";
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

          this.logout();

          //this.$router.push("/login");
          // this.$router.go(0);
          // var info=JSON.parse(localStorage.getItem("managementSystem") );
          // var obj={};
          // obj.username=info.username;
          // obj.password=info.password;
          // localStorage.setItem("managementSystem",JSON.stringify(obj));
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
     * 计算饼图数据
     * @param list
     */
    checkPieData(list) {
      let total = 0,
        offline = 0,
        online = 0,
        errorC = 0;
      list.forEach((vo, idx) => {
        total += vo.total;
        offline += vo.offline;
        online += vo.online;
        errorC += vo.inerror;
      });

      this.pieChartData = [
        { value: online, name: "正常 ( " + online + " )" },
        { value: offline, name: "故障 ( " + offline + " )" },
        { value: errorC, name: "离线 ( " + errorC + " )" },
      ];
      this.pieChartDataTotal = total;
      this.$nextTick(() => {
        this.rightPieChart(this.pieChartData, this.pieChartDataTotal);
      });
    },

    /**
     * 摄像机状态筛选切换
     * @param type
     */
    cameraStatusSelectClick(type) {
      /*let _this = this;
            _this.cameraStatusSelect = type;*/
      //

      /*if(this.cameraStatusCollapsed){
              this.cameraStatusCollapsed = !this.cameraStatusCollapsed;
              return false;
            }*/

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
    refreshAmapMarks(currRegionCode) {
      //console.info('currRegionCode',currRegionCode);
      this.eventRegionCode = currRegionCode;

      let _this = this,
        mymap = _this.$refs.amapIns.mapInstance,
        bounds = mymap.getBounds(),
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

      let data = {
        params: {
          zoomlevel: zoom, //13,
          NorthEast: bounds.northeast.toString(),
          SouthWest: bounds.southwest.toString(),
        },
        data: postBody,
      };
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
     * 模拟刷新- 无用
     * @param list
     * @param fun
     */
    setPercent(code, fun) {
      clearInterval(this.freshCameraStatusInt);
      if (!code || code === "camera") {
        return false;
      }
      let list = [],
        listName = "",
        that = this;
      switch (code) {
        case "province":
          listName = "provinceList";
          break;
        case "city":
          listName = "cityList";
          break;
        case "company":
          listName = "companyList";
          break;
        case "road":
          listName = "roadList";
          break;
      }
      //console.info('listName',code,listName,that['provinceList'],that[listName]);
      list = JSON.parse(JSON.stringify(that[listName]));
      if (!list.length) {
        return false;
      }

      let checkData = function(list) {
        list.forEach((vo, idx) => {
          vo.percent = parseInt(Math.random() * 100);
        });

        that[listName] = list;

        if (typeof fun === "function") fun(list);
      };
      checkData(list);
      this.freshCameraStatusInt = setInterval(() => {
        checkData(list);
        //console.info('setPercent');
        clearInterval(this.freshCameraStatusInt);
      }, 5000);
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
      //console.info('svsdvsdv');
      this.rightSideCollapsed = false;

      //显示左侧区块
      this.leftSideCollapsed = false;
      //return false;
      let _this = this,
        uInfo = _this.userInfo;
      //console.info('_this.userInfo ',_this.userInfo);
      _this.regionCode = uInfo.regionCode;
      _this.regionName = uInfo.regionName;
      _this.currentMapRegionCode = uInfo.regionCode;
      /*_this.organizationId      =  uInfo.organizationId;
            _this.organizationType    =  uInfo.organizationType;*/

      let queryRoadData = {};

      _this.$nextTick(() => {
        let pathInfo =
          _this.cameraCategoryRouteList[_this.cameraCategoryRoute][0];
        //初始化路径位置， 省份用户直接进省份
        if (uInfo.regionCode !== 100000) {
          queryRoadData.regionCode = uInfo.regionCode;
          //console.info('pathInfo   ',pathInfo);
          //转为road打头
          //_this.currCategoryPathIndex = 1;
          //按照路线查询，设定为指定省份的管辖范围
          _this.cameraCategoryRouteList.forEach((volist, idx) => {
            if (volist.length) {
              volist.forEach((vo, vidx) => {
                //省份开头的路径设置为用户省
                if (vo.code === "province") {
                  _this.cameraCategoryRouteList[idx][vidx].name =
                    uInfo.regionName;
                  _this.cameraCategoryRouteList[idx][vidx].value =
                    uInfo.regionCode;
                }
              });
            }
          });
          //组织类型判断，路公司
          if (["10", "20"].indexOf(uInfo.organizationType) >= 0) {
            //_this.currCategoryCode = 'road';
            //按照路线查询，设定为指定路公司的管辖范围
            //queryRoadData.organizationId = _this.organizationId;
            //路公司直接进单位
            //_this.currCategoryPathIndex = 2;
            _this.cameraCategoryRouteList[1][1] = {
              code: "company",
              name: uInfo.organizationName,
              value: uInfo.organizationId,
            };
            //查询单位数据
            //_this.checkListData(uInfo.organizationId,uInfo.organizationName,'road');
          } else {
            //_this.currCategoryCode = 'company';
            //查询单位数据
            _this.checkListData(uInfo.regionCode, uInfo.regionName, "company");
          }
        }

        //console.info('pathInfo  12312313 ',pathInfo);
        this.checkListData(pathInfo.value, pathInfo.name, pathInfo.code);
        //初始化省份数据
        _this.queryStaticDataList(
          { dimensionType: "province", data: { orderRate: true } },
          (res) => {
            _this.cameraLoading = false;
            //左侧列表初始数据，全国用户展示省份数据
            //if(uInfo.regionCode === 100000) _this.setCameraStatisticsListByProvince(res.data);
            //右侧省份统计数据
            _this.setCameraStatisticsByRegionAll(res.data);

            //
            //饼图数据
            //setTimeout(() => {
            _this.checkPieData(res.data);
            //}, 2000)
          }
        );

        //初始化右侧路线统计数据
        //带上组织查路线
        queryRoadData.orderRate = true;
        _this.queryStaticDataList(
          { dimensionType: "road", data: queryRoadData },
          (res) => {
            _this.setCameraStatisticsByRoadAll(res.data);
          }
        );
      });
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
      if ("district" === currFeature[2]) {
        //直辖市
        let citytype = ["11", "31", "50", "12"],
          str = (currFeature[0] + "").substr(0, 2);
        //console.info(citytype,str,str.indexOf(citytype));
        if (str.indexOf(citytype) >= 0) currFeature[2] = "city";
      }

      let that = this;

      //console.info('amapClickCallback 11 ',currFeature,that.currentMapRegionCode);
      if (
        parseInt((currFeature[0] + "").substr(0, 4)) ===
        parseInt((that.currentMapRegionCode + "").substr(0, 4))
      ) {
        return false;
      }
      if (that.userInfo.regionCode === 100000) {
        //中国以外地方点击，还原到省份
        //that.currCategoryCode = 'province';
        //初始化步骤
        //that.currCategoryPathIndex = 0;
        that.currentMapRegionCode = currFeature[0];
      } else {
        let provinceCode = parseInt((currFeature[0] + "").substr(0, 2)) * 10000,
          upCode =
            parseInt((that.userInfo.regionCode + "").substr(0, 2)) * 10000,
          cityCode = parseInt((currFeature[0] + "").substr(2, 4));
        //let cityCode = parseInt((that.currentMapRegionCode + '').substr(2,4));

        //非全国用户，不能切区域, 本省以内的城市切换
        that.currentMapRegionCode =
          cityCode > 0 && provinceCode === upCode
            ? currFeature[0]
            : that.userInfo.regionCode;
      }
      //路径中记录所选地图区域
      that.cameraCategoryRouteList.forEach((volist, idx) => {
        if (volist.length) {
          volist.forEach((vo, vidx) => {
            //更新所有路径中省份城市数值
            if (vo.code === currFeature[2]) {
              that.cameraCategoryRouteList[idx][
                vidx
              ].name = currFeature[1].replace("省", "");
              that.cameraCategoryRouteList[idx][vidx].value = currFeature[0];
              //if(that.cameraCategoryRouteList[idx][0].code !== 'road') that.currCategoryPathIndex = vidx + 1;
              if (
                idx === that.cameraCategoryRoute &&
                vidx + 1 < volist.length
              ) {
                that.currCategoryPathIndex = vidx + 1;
                that.currCategoryCode = volist[vidx + 1].code;
              }
              /*if(that.currCategoryPathIndex === vidx){

                            }*/
            }
            //全国，清理省份城市
            if (
              currFeature[0] === 100000 &&
              (vo.code === "city" || vo.code === "province")
            ) {
              that.cameraCategoryRouteList[idx][vidx].name = "";
              that.cameraCategoryRouteList[idx][vidx].value = "";
              //if(that.cameraCategoryRouteList[idx][0].code !== 'road') that.currCategoryPathIndex = vidx + 1;
              that.currCategoryPathIndex = 0;
              that.currCategoryCode = volist[0].code;
            }
            //省份，清理城市
            //if((currFeature[2] === 'province' || that.currentMapRegionCode !== 100000) && vo.code === 'city'){
            if (currFeature[2] === "province" && vo.code === "city") {
              that.cameraCategoryRouteList[idx][vidx].name = "";
              that.cameraCategoryRouteList[idx][vidx].value = "";
              //that.currCategoryPathIndex = vidx-1;
            }
          });
        }
      });
      //
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

      //选择的路径类型
      that.cameraCategoryRoute = curr;
      //当前路径
      let currRoute = that.cameraCategoryRouteList[curr],
        pathInfo = currRoute[0],
        roadPath = null;
      that.currCategoryCode = pathInfo.code;
      that.currCategoryPathIndex = 0;
      /*if(currRoute && currRoute.length){
                currRoute.forEach((vo,idx)=>{
                    if(vo.value && vo.name){
                        that.currCategoryPathIndex = idx + 1;
                    }
                });
            }*/
      //
      //非全国区域，地图显示、用户权限
      if (that.currentMapRegionCode && that.currentMapRegionCode !== 100000) {
        let provinceCode =
            parseInt((that.currentMapRegionCode + "").substr(0, 2)) * 10000,
          cityCode = parseInt((that.currentMapRegionCode + "").substr(2, 4)),
          newPathIdx = 0,
          areaCode = cityCode || provinceCode;
        currRoute.forEach((vo, idx) => {
          //省份开头的路径，需要根据地图展示对应地区
          if (currRoute[0].code === "province") {
            if (vo.code === "province") {
              newPathIdx = idx + 1;
            }
            /*if(vo.code === 'city' && cityCode){
                            newPathIdx = idx + 1;
                        }*/
            if (vo.code === "city" && vo.value) {
              newPathIdx = idx + 1;
            }
          } else {
            if (vo.value && vo.name) {
              if (idx === 0 || newPathIdx > 0) newPathIdx = idx + 1;
            }
          }

          if (vo.code === "province" || vo.code === "city") {
            areaCode = vo.value || provinceCode;
          }
        });

        //切换路径后，根据路径内容设置地图亮块
        that.currCategoryPathIndex = newPathIdx;
        //that.currCategoryCode      = pathInfo.code;
        that.currentMapRegionCode = areaCode;
        //更新地图显示
        setTimeout(() => {
          that.$refs.amapIns.switch2AreaNode(areaCode);
        }, 0);
      }
      //列表位置
      pathInfo = currRoute[that.currCategoryPathIndex];

      //路线已选择，切换到路线以下全国
      if (
        currRoute[0].code === "road" &&
        currRoute[0].value &&
        that.currCategoryPathIndex === 0
      ) {
        that.currCategoryPathIndex = 1;
        pathInfo = currRoute[that.currCategoryPathIndex];
      }

      that.currCategoryCode = pathInfo.code;
      //console.info('checkCameraRouterBtnClick ',curr, cate, nextcate,that.cameraCategoryRouteList);
      //that.changeCameraCategoryPath(pathInfo.value,pathInfo.name,pathInfo.code);
      that.checkListData(pathInfo.value, pathInfo.name, pathInfo.code);

      //更新地图显示的点
      that.refreshAmapMarks(that.currentMapRegionCode);

      //console.info('checkCameraRouterBtnClick',currRoute,pathInfo,that.currentMapRegionCode,that.currCategoryPathIndex,that.currCategoryCode);

      console.info(
        "checkCameraRouterBtnClick",
        that.cameraCategoryRouteList,
        that.cameraCategoryRoute,
        that.currCategoryPathIndex,
        that.currentMapRegionCode,
        pathInfo
      );
    },

    /**
     * 查询摄像头路径跳转，列表点击，面包屑点击
     *
     * @param cid      显示名称
     * @param cname    对应value
     * @param newCate  当前显示路径地址
     * @returns {boolean}
     */
    changeCameraCategoryPath(cid, cname, newCate) {
      let that = this,
        curIndex = that.currCategoryPathIndex,
        routerList = JSON.parse(
          JSON.stringify(that.cameraCategoryRouteList[that.cameraCategoryRoute])
        ),
        pathInfo = {};

      if (cname && cid) {
        pathInfo = routerList[curIndex];
        //更新当前地址内容
        pathInfo.name = cname;
        pathInfo.value = cid;
        //更新面包屑导航信息
        that.cameraCategoryRouteList[that.cameraCategoryRoute] = routerList;
      }

      //展示下一级内容
      if (curIndex + 1 < routerList.length) {
        that.currCategoryPathIndex = curIndex + 1;
        that.currCategoryCode = routerList[curIndex + 1].code;
      }

      //更新所有路径对应省市
      if (["province", "city"].indexOf(newCate) >= 0) {
        that.cameraCategoryRouteList.forEach((volist, idx) => {
          if (volist.length) {
            volist.forEach((vo, vidx) => {
              if (vo.code === newCate) {
                that.cameraCategoryRouteList[idx][vidx].name = cname;
                that.cameraCategoryRouteList[idx][vidx].value = cid;
              }
            });
          }
        });
      }

      //更新地图
      let params = that.getPreParamsAr(),
        areaCode = params.provinceCode || that.currentMapRegionCode;
      if (params.cityCode) {
        areaCode = params.cityCode;
      }
      that.currentMapRegionCode = areaCode;
      //更新地图显示
      setTimeout(() => {
        that.$refs.amapIns.switch2AreaNode(areaCode);
      }, 0);

      let pi = routerList[curIndex + 1];
      if (pi.value && pi.name && curIndex + 2 < routerList.length) {
        pi = routerList[curIndex + 2];
        that.currCategoryPathIndex = curIndex + 2;
        that.currCategoryCode = pi.code;
      }

      that.checkListData("", "", pi.code);
      //更新地图显示的点
      that.refreshAmapMarks(that.currentMapRegionCode);
      console.info(
        "changeCameraCategoryPath",
        that.cameraCategoryRouteList,
        that.cameraCategoryRoute,
        that.currCategoryPathIndex,
        that.currentMapRegionCode
      );
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
    rightPieChart(pieChartData, pieChartDataTotal) {
      // 基于准备好的dom，初始化echarts实例
      let that = this,
        obj = document.getElementById("abnormal-chart");
      if (!obj) {
        return false;
      }
      //console.log("pieChartData=>",pieChartData);
      let myChart = window.echarts.init(obj);
      //var that = this;

      let func = () => {
        alert("asdfasdf");
      };

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
          selectedMode: false,
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
          triggerEvent: true,
          //link: func,
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
                  "rgb(0, 234, 255)",
                  "rgb(255, 54, 7)",
                  "rgb(83, 104, 146)",
                ];
                return colorList[params.dataIndex];
              },
            },
            data: pieChartData,
          },
        ],
      });

      window.addEventListener("resize", () => {
        myChart.resize();
      });

      /*myChart.on('legendselectchanged', function(params) {
                let s = ['离线','正常','故障'];
                console.log('n',params, params.name.split(' ')[0],s.indexOf(params.name.split(' ')[0]))
                that.cameraStatusSelectClick(s.indexOf(params.name.split(' ')[0]) + '');
            });*/
      //myChart.on("click", pieConsole);
      myChart.on("click", (params) => {
        //let sersName = params.name;
        console.info("click", params);
        let type = params.componentType;
        if (type === "title") {
          //中间title单击，还原显示所有图标

          this.cameraStatusChange = ["0", "1", "2"];
          this.refreshAmapMarks(this.eventRegionCode);
          return true;
        }

        if (type === "series") {
          // 饼图扇形片单击，隐藏/显示对应状态摄像机图标
          let s = ["离线", "正常", "故障"];
          console.log(
            "n",
            params,
            params.name.split(" ")[0],
            s.indexOf(params.name.split(" ")[0])
          );
          that.cameraStatusSelectClick(
            s.indexOf(params.name.split(" ")[0]) + ""
          ); /**/
        }
      });

      that.myPieChart = myChart;
    },
  },
};
