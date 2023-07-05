/*import echarts from 'echarts'
import '@/style/theme/index.css'*/

import { mapState, mapActions, mapMutations } from 'vuex'
//import api from '../api/index.js';
import loading from '../../components/common/Loading'
import unitTree from '../sjk/unitTree.vue'

// 高德地图
import trafficAmap from '../../components/TrafficAmap'

// 百度地图
import BaiduMap from '@/components/BaiduMap'

// 视频列表
import VideoList from '@/components/VideoList'

// 监控模式组件
import MonitoringPattern from '@/components/MonitoringPattern'

import pictureEchartsDialog from '../dialog/pictureEchartsDialog'
import changPwdDialog from '../../components/module/changPwd/changPwd'

import api from '@/api'
import BASE_APP_CONFIG from '@/config'
// import indexSearch from  '../../components/indexSearch';

// 千方地图
// import QFMap from "../../components/QFMap.vue";
// import InspectionDialog from "../../components/InspectionDialog";

export default {
  name: 'mapPage',
  components: {
    loading,
    trafficAmap, // 高德地图
    BaiduMap, // 百度地图
    unitTree,
    // QFMap,
    changPwdDialog,
    pictureEchartsDialog,
    VideoList,
    MonitoringPattern
    // indexSearch
  },
  // beforeCreate() {
  //   if (!this.$_btnPermissionCheck(109310)) {
  //     this.$router.push("/dashboard");
  //   }
  // },
  data() {
    return {
      componentKey: 0,
      cameraDataList: [],
      checkedCities: {
        onLine: true,
        offLine: true
      },
      searchIcon: true,
      searchIsShow: false,
      mileIsShow: false,
      valueMap: true,
      showHideEye: true,
      showHide: true,
      searchBlock: '',
      threeMoulde: true,
      organizationData: null,
      companyList: {},
      dialogTableVisibles: false,
      hasFullScreen: false, // 是否全屏
      currentDateTime: '',
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

      cameraIconWidth: 30, //35,
      cameraIconHeight: 35, //40*88/76
      mapZIndexConfig: {
        baseLayer: 120, // 基础图层
        googleLayer: 120, // 卫星地图
        labelzIndex: 140, // 标注图层
        markerzIndex: 310, // 摄像头图标
        wmfLayer: 125, // 首都放射线
        featureZIndex: 121
      },
      // 摄像头类型select
      cameraCateSelect: '99',
      // 摄像头状态切换
      cameraStatusSelect: 99,
      //地图摄像头状态
      cameraStatusChange: {
        4: true,
        1: true,
        3: true
      }, //['ero','ol','fl']
      //地图摄像头类型
      cameraTypeSelect: [],
      cameraTypeList: [
        { title: '道路沿线', bg: 'dlyx-btn', type: '1' },
        { title: '桥梁', bg: 'mj-btn', type: '2' },
        { title: '隧道', bg: 'qd-btn', type: '3' },
        { title: 'ETC门架', bg: 'etc-btn', type: '7' },
        { title: '收费站', bg: 'sfz-btn', type: '5' },
        { title: '服务区', bg: 'fwq-btn', type: '6' },
        { title: '移动视频源', bg: 'move-btn', type: '8' },
        { title: '加油站', bg: 'online-btn', type: '9' },
        { title: '默认', bg: 'qt-btn', type: '0' }
      ],
      // cameraTypeSelect: ["0", "1", "2", "3", "4", "7", "5", "6", "8", "9"], //['dlyx','mj','qd','etc','sfz','fwq']
      cameraStatusCollapsed: true,
      cameraTypeAll: true,
      options: [
        {
          value: 'base',
          label: '路网图层'
        },
        {
          value: 'satellite',
          label: '卫星图层'
        },
        {
          value: 'trafficLayer',
          label: '实时交通图层'
        }
      ],
      value: 'trafficLayer',
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
          { code: 'province', name: '', value: '' },
          { code: 'company', name: '', value: '' },
          { code: 'road', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          /*{code:'province',name:'',value:''},
          {code:'city',name:'',value:''},*/
          { code: 'road', name: '', value: '' },
          { code: 'province', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: 'province', name: '', value: '' },
          { code: 'city', name: '', value: '' },
          { code: 'road', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ]
      ],
      oldCameraCategoryRouteList: [
        [], //忽略0下标
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: 'province', name: '', value: '' },
          { code: 'company', name: '', value: '' },
          { code: 'road', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          /*{code:'province',name:'',value:''},
                    {code:'city',name:'',value:''},*/
          { code: 'road', name: '', value: '' },
          { code: 'province', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: 'province', name: '', value: '' },
          { code: 'city', name: '', value: '' },
          { code: 'road', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ]
      ],
      // regionCode为41000
      oldCameraCategoryRouteHnList: [
        [], //忽略0下标
        [
          //{code:'country',name:'全国',value:'100000'},
          // { code: "province", name: "", value: "" },
          { code: 'company', name: '', value: '' },
          { code: 'road', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          /*{code:'province',name:'',value:''},
                    {code:'city',name:'',value:''},*/
          { code: 'road', name: '', value: '' },
          // { code: "province", name: "", value: "" },
          { code: 'camera', name: '', value: '' }
        ],
        [
          //{code:'country',name:'全国',value:'100000'},
          { code: 'province', name: '', value: '' },
          { code: 'city', name: '', value: '' },
          { code: 'road', name: '', value: '' },
          { code: 'camera', name: '', value: '' }
        ]
      ],
      cameraCategoryType: '',
      // 查找摄像头所选路径
      cameraCategoryRoute: 6, // 默认是路线
      // 当前路径所显示位置
      currCategoryPathIndex: 0,
      // 当前列表数据显示等级
      currCategoryCode: 'road', //province city road company camera
      //列表数据加载状态
      cameraLoading: true,
      //地市数据
      provinceList: [],
      cityList: [],
      companyList: [],
      roadList: [{ roadName: '' }],
      cameraList: [
        { cameraName: '', lng: '', lat: '', status: 1 }
      ],

      freshCameraStatusInt: 0,

      //右侧统计数据tab切换
      rightProgressChose: 'province', // 'road'
      mapLayerTypes: {
        // 当前地图各图层状态
        trafficLayer: false, // 路况图层
        satellite: false // 卫星图层
      },
      currentMapRegionCode: 0,
      //筛选数据，用户进页面时候判断
      regionCode: 320000,
      regionName: '',
      organizationId: '',
      organizationType: '',
      eventRegionCode: '', //当前地图选中的regionCode
      deviceStatisticsList: [], // 路线
      cloudplatform:
        JSON.parse(localStorage.getItem('cloudplatform')) ||
        {},
      mapQuery: {
        data: {},
        limit: ['road', 'currRegionCode']
      },
      curMap: 'gaode', // 当前地图组件(默认baidu)
      mapStatus: {
        // 地图状态数据（收集用于地图组件状态同步）
        zoom: 5 // 当前地图层级
      },
      baiduMinZoom: 12, // 百度地图最小层级
      imgs: {
        /* 图标所需 */
        serviceAreaOnline: require('@/assets/map/icon/service_area_online.png'), // 服务区在线接入
        serviceAreaOffline: require('@/assets/map/icon/service_area_offline.png'), // 服务区离线未接入
        tollStationOnline: require('@/assets/map/icon/toll_station_online.png'), // 收费站在线接入
        tollStationOffline: require('@/assets/map/icon/toll_station_offline.png') // 收费站离线未接入
      },
      areaTypeSwitches: {
        /* 各区域类型开关 */
        serviceAreaSwitch: false, // 服务区开关
        tollStationSwitch: false, // 收费站开关
        // moveSwitch :false
      },

      picEchartMark: '', // 截图弹窗自定义标记
      cameraRenderer: null, // 摄像机海量点与否切换控制(null, mass, normal)
      nationwidePattern: false, // 全国模式

      // 侧边栏显隐
      asideShow: {
        left: false,
        right: true
      },
      // 侧边栏收缩按钮显隐
      asideBtnShow: true,

      // 悬浮弹窗显隐
      layerShow: {
        bottom: false,
        right: false
      },

      monitorActive: false, // 监控模式活动与否
      initQueryAmapMarksCallback: _.throttle(
        e => {
          // this.$refs.amapIns?.clearSelectAreaMap()
          this.$refs.amapIns?.selectArea(320000)
          this.refreshAmapMarks(320000)
        },
        300,
        {
          trailing: false
        }
      )
    }
  },
  computed: {
    ...mapState([
      'login',
      //"provinces",
      //"orgList",
      'classIfyList', // 摄像机类别
      'userInfo',
      'camera',
      'deviceStatistics',
      'selectCameraIndex'
    ]),
    currRouterIndex() {
      //当前所选路径
      let that = this,
        path =
          that.cameraCategoryRouteList[
            that.cameraCategoryRoute
          ],
        curIndex = 0
      path.forEach(function(pt, index, array) {
        // && (mapClick && route.code !== currCate)
        if (pt.code === that.currCategoryCode) {
          curIndex = index
        }
      })
      return curIndex
    },
    // gteDeviceStatisticsList(){
    //   return this.roadData.sort(function(x,y){
    //   return x["roadInfo.name"].localeCompare(y["roadInfo.name"])
    //   //index是companyList你需要索引的字段名称
    //   })
    // },
    /**
     * 上一层路径
     */
    prevCategoryCode() {
      let prevIdx = 0,
        prevCode = 'province',
        prevInfo = {}

      //prevIdx = this.currCategoryPathIndex - 1 < 0 ? 0 : this.currCategoryPathIndex - 1;
      prevIdx =
        this.currCategoryPathIndex - 2 < 0
          ? -1
          : this.currCategoryPathIndex - 2
      if (prevIdx < 0) {
        return [
          prevIdx,
          'coutrt',
          { code: 'country', name: '全国', value: '100000' }
        ]
      }
      //console.info('prevCategoryCode', prevIdx);
      prevInfo = this.cameraCategoryRouteList[
        this.cameraCategoryRoute
      ][prevIdx]
      prevCode = prevInfo.code

      return [prevIdx, prevCode, prevInfo]
    },

    // 当前地图类型名（高德、百度）
    mapName() {
      return {
        gaode: '高德',
        baidu: '百度',
        tengxun: '腾讯'
      }[this.curMap]
    }
  },
  watch: {
    /**
     * 摄像头类型切换
     */
    cameraCateSelect() {
      let rout = this.cameraCategoryRouteList[
          this.cameraCategoryRoute
        ],
        pathInfo = rout[this.currCategoryPathIndex],
        lastPath =
          this.currCategoryPathIndex > 0
            ? rout[this.currCategoryPathIndex - 1]
            : rout[0]
      //送上一级往下查
      //if(pathInfo.code === 'camera') this.currCategoryPathIndex--;
      //this.changeCameraCategoryPath(pathInfo.value, pathInfo.name, pathInfo.code);
      //console.info(rout);
      //
      this.checkListData(
        pathInfo.value,
        pathInfo.name,
        pathInfo.code
      )
    }
  },

  created() {
    process.env.NODE_ENV === 'development' &&
      (window.vm = this)

    this.checkCameraRouterBtnClick(1)
  },

  methods: {
    ...mapActions([
      //"getProvince",
      'checkMenus',
      // "logout",
      // 'getCodemaster',
      // "getDeviceStatistics",
      'getCameraListForStatis',
      'getCameraListForPot',
      'getMileageList'
    ]),

    ...mapMutations([
      'setCameraStatisticsList',
      'setCameraStatisticsListByProvince',
      'setCameraStatisticsListByCity',
      'setCameraStatisticsListByRoad',
      'setCameraStatisticsListByOrg',
      'setCameraStatisticsByRoadAll',
      'setCameraStatisticsByRegionAll',
      'setSelectCameraIndex',
      'setMileageList'
    ]),

    /**
     * 弹窗关闭事件
     * @param done
     */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done((this.dialogVisible = true))
        })
        .catch(_ => {})
    },
    getOrgCompany() {
      let data = {}
      this.$api.getOrgCompany(data).then(res => {
        if (res.code == 200) {
          this.companyList = res.data
          // console.log(this.companyList,"this.companyList")
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取高速路段数据
    gteDeviceStatisticsList() {
      setTimeout(() => {
        let road = this.deviceStatistics
          .deviceStatisticsListByRoad
        let roadData = []
        for (const key in road) {
          road[key].map(item => {
            roadData.push(item)
          })
        }
        // console.log('所以路线参数',roadData )
        let roadPrice = this.compare(roadData, 0)
        // let roadPrice =  this.compare(this.compare(this.compare(roadData, 0), 1), 2)
        this.deviceStatisticsList = roadPrice
      }, 1000)
    },
    compare(property, num) {
      for (let i = 0; i < property.length; i++) {
        //内层循环，找到第i大的元素，并将其和第i个元素交换
        for (let j = i; j < property.length; j++) {
          let numOne =
            parseInt(
              property[i].id
                .substring(num, num + 1)
                .charCodeAt()
            ) || 0
          let numTwo =
            parseInt(
              property[j].id
                .substring(num, num + 1)
                .charCodeAt()
            ) || 0
          if (numOne > numTwo) {
            //交换两个元素的位置
            let temp = property[i]
            property[i] = property[j]
            property[j] = temp
          }
        }
      }
      return property
    },

    /**
     * 切换地图显示类型
     * @param isShow
     */
    checkMapType(index, isShow) {
      const type = {
        0: 'satellite',
        1: 'trafficLayer'
      }[index]

      if (this.curMap === 'baidu') {
        // 百度地图
        this.$refs.BMap.tabMapLayerType(type, isShow)
      } else if (this.curMap === 'gaode') {
        // 高德地图
        this.$refs.amapIns.checkGoogleMapType(type, isShow)
      }
    },

    /**
     * 切换地图海量点的显示模式
     * @param value
     */
    checkPatternType(value) {
      console.log(value, 'value')
      this.cameraRenderer = value
      console.log('codes', this.currentMapRegionCode)
      this.refreshAmapMarks(this.eventRegionCode)
    },
     /**
     * 切换地图为全国模式val
     * @param val
     */
    checkNationwidePattern(val){
      this.$refs.amapIns?.emptyCameraDot()
      if(val){    
        BASE_APP_CONFIG.API_BASE_URL = '/v2'
        this.$refs.videoList.$refs.unitTree?.getCountUserOrganization()
        this.$refs.amapIns && (this.$refs.amapIns.cameraMarkVisable = false)
        this.tabMap('gaode')
      this.mapQuery.data = {}
      this.searchBlock = ''
      this.cameraTypeSelect = []
      // 全国默认海量点渲染
      this.cameraRenderer = null
      /* 关闭所有区域类型开关 */
      this.closeSwitch()
      // initQueryAmapMarks回调
      // this.$refs.amapIns
      //   ? this.initQueryAmapMarksCallback()
      //   : setTimeout(() => {
      //       this.initQueryAmapMarksCallback()
      //     })
          this.$refs.amapIns?.clearSelectAreaMap()
          this.refreshAmapMarks(320000)
          //  视频列表接口与地图联动故延迟1秒
           setTimeout(() => { 
            this.$root.$emit('homeLeftTreeData')
           }, 1000);
          // this.$refs.amapIns?.selectArea(100000)
      
      }else {
        BASE_APP_CONFIG.API_BASE_URL = '/v1'
        this.tabMap('gaode')
        this.$refs.videoList.$refs.unitTree?.getCountUserOrganization()
         //  等待地图切换高德地图后切换
         setTimeout(() => { 
          this.$refs.amapIns?.selectArea(320000)
         }, 0);
       
      }
    },

    /**
     * 全屏事件
     */
    handleFullScreen() {
      let element = document.documentElement
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.hasFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        //console.log('已还原！');
      } else {
        // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
        //console.log('已全屏！');
      }
      // 改变当前全屏状态
      this.hasFullScreen = !this.hasFullScreen
    },

    /**
     * 用户退出系统
     */
    userExit() {
      const h = this.$createElement
      const newDatas = [h('p', null, '确定退出系统？')]
      this.$confirm('提示', {
        title: '提示',
        message: h('div', null, newDatas),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            message: '退出成功',
            type: 'success'
          })

          //localStorage.setItem('cloudplatform',null);

          // this.logout();

          //this.$router.push("/login");
          // this.$router.go(0);
          // var info=JSON.parse(localStorage.getItem("managementSystem") );
          // var obj={};
          // obj.username=info.username;
          // obj.password=info.password;
          // localStorage.setItem("managementSystem",JSON.stringify(obj));
        })
        .catch(() => {})
    },
    /**
     * 点击三个模块显隐
     */
    threeMouldeClick() {
      this.showHide = !this.showHide
      if (this.threeMoulde == true) {
        this.threeMoulde = false
      } else {
        this.threeMoulde = true
      }
    },

    /**
     * 截图管理
     */
    changImg() {
      this.dialogTableVisibles = true
    },

    /**
     * 右侧边栏收放点击
     */
    rightSideCollapsedClick() {
      let that = this
      that.rightSideCollapsed = !that.rightSideCollapsed
      that.$nextTick(() => {
        //console.info('that.rightSideCollapsed',that.rightSideCollapsed);
        setTimeout(() => {
          if (!that.rightSideCollapsed) {
            // type === 1 &&
            that.rightPieChart(
              that.pieChartData,
              that.pieChartDataTotal
            )
          }
        }, 200)
      })
    },

    /**
     * 饼图加载函数
     * @param pieChartData
     */
    rightPieChart(pieChartData, pieChartDataTotal) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById('abnormal-chart')
      if (!obj) {
        return false
      }
      let legend = _.map(pieChartData, it => it.name)
      //console.log("pieChartData=>",pieChartData);
      let myChart = window.echarts.init(obj)
      var that = this
      // 绘制图表
      myChart.setOption({
        tooltip: {
          show: false,
          trigger: 'item',
          //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
          formatter: '{a} <br/>{b}: {c} ({d}%)'
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
          }
        },
        title: {
          text: pieChartDataTotal,
          //subtext: datasubtext[0],
          left: '29%',
          y: 'center',
          textAlign: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'normal',
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
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                /*text: pieChartDataTotal + 10000000,*/
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              color: function(params) {
                var colorList = [
                  '#2472F0', //正常
                  '#757575' //离线
                  // "rgb(255, 54, 7)",//故障
                ]
                return colorList[params.dataIndex]
              }
            },
            data: pieChartData
          }
        ]
      })
      myChart.on('click', params => {
        //let sersName = params.name;
        console.info('click', params)
        let type = params.componentType
        // if (type === "title") {
        //   //中间title单击，还原显示所有图标

        //   this.cameraStatusChange = [];
        //   this.refreshAmapMarks(this.eventRegionCode);
        //   return true;
        // }

        if (type === 'series') {
          // 饼图扇形片单击，隐藏/显示对应状态摄像机图标
          // let s = ["离线", "正常", "故障"];
          let s = ['离线', '正常']
          // console.log(
          //   "n",
          //   params,
          //   params.name.split(" ")[0],
          //   s.indexOf(params.name.split(" ")[0])
          // );
          let statusArr = [4, 1, 3]
          let key =
            statusArr[s.indexOf(params.name.split(' ')[0])]
          _.each(that.cameraStatusChange, (v, k) => {
            that.cameraStatusChange[parseInt(k)] =
              parseInt(k) === key
          })
          that.refreshAmapMarks(that.eventRegionCode)
        }
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    /**
     * 计算饼图数据
     * @param list
     */
    checkPieData(list) {
      let total = 0,
        offline = 0,
        online = 0,
        errorC = 0
      list.forEach((vo, idx) => {
        total += vo.total
        offline += vo.offline
        online += vo.online
        errorC += vo.inerror
      })

      this.pieChartData = [
        { value: online, name: '正常 ( ' + online + ' )' },
        { value: offline, name: '离线 ( ' + offline + ' )' }
        // { value: errorC, name: "故障 ( " + errorC + " )" },
      ]
      this.pieChartDataTotal = offline + online + errorC
      this.$nextTick(() => {
        this.rightPieChart(
          this.pieChartData,
          this.pieChartDataTotal
        )
      })
    },
    // 摄像机状态筛选
    cameraDisplayState() {
      // 高德地图摄像机渲染
      if (this.$refs.amapIns) {
        let objArr = this.cameraStateStatistics(
          this.cameraDataList
        )
        this.$refs.amapIns.pointsSetIn(objArr)
      }
    },
    // 摄像机状态筛选函数
    cameraStateStatistics(data) {
      // console.log('初始值',this.checkedCities,data)
      if (!data) return []
      let onLine = []
      let offLine = []
      // 在线摄像机
      if (this.checkedCities.onLine) {
        data.map(it => {
          if (it.onlineStatus === '1') {
            onLine.push(it)
          }
        })
      }
      // 离线摄像机
      if (this.checkedCities.offLine) {
        data.map(it => {
          if (it.onlineStatus === '0') {
            offLine.push(it)
          }
        })
      }
      return onLine.concat(offLine)
    },
    /**
     * 摄像机状态筛选切换
     * @param type
     */
    cameraStatusSelectClick(type) {
      /*let _this = this;
      _this.cameraStatusSelect = type;*/

      if (this.cameraStatusCollapsed) {
        this.cameraStatusCollapsed = !this
          .cameraStatusCollapsed
        return false
      }
      this.cameraStatusChange[type] = !this
        .cameraStatusChange[type]

      this.refreshAmapMarks(this.eventRegionCode)
    },

    cameraStatusCollapseClick() {
      this.cameraStatusCollapsed = !this
        .cameraStatusCollapsed
    },

    /**
     * 摄像机类型筛选切换
     * @param type
     */
    cameraTypeSelectClick(type) {
      console.log('map cameraTypeSelectClick type', type)
      // if(type == 1){
      //   this.cameraTypeSelect = []
      //   this.cameraTypeSelect.push(type);
      // }
      if (type == 5) {
        /* 5收费站单独处理用以展示收费站区域(不展示摄像机) */
        this.tabAreaTypeSwitch('tollStationSwitch')
        return
      } else if (type == 6) {
        /* 6服务区单独处理用以展示收费站区域(不展示摄像机) */
        this.tabAreaTypeSwitch('serviceAreaSwitch')
        return
      } 
      // else if (type == 8) {
      //   /* 6服务区单独处理用以展示收费站区域(不展示摄像机) */
      //   this.tabAreaTypeSwitch('moveSwitch')
      //   return
      // } 
      else {
        for (const areaType in this.areaTypeSwitches) {
          if (this.areaTypeSwitches[areaType]) {
            this.tabAreaTypeSwitch(areaType)
          }
        }
      }
      if (this.cameraTypeSelect.length >= 5) {
        this.cameraTypeSelect = []
      }
      let iddx = this.cameraTypeSelect.indexOf(type)
      console.log(iddx, 'iddxiddxiddx',this.cameraTypeSelect)
      if (iddx >= 0) {
        this.cameraTypeSelect.splice(iddx, 1)
        // this.cameraTypeSelect=[]
      } else {
        this.cameraTypeSelect.push(type)
      }

      this.refreshAmapMarks(this.eventRegionCode)
    },
    cameraTypeClass(bg, type) {
      if (type == 5) {
        /* 5收费站单独处理用以展示收费站区域(不展示摄像机) */
        return this.areaTypeSwitches.tollStationSwitch
          ? `${bg} active`
          : bg
      } else if (type == 6) {
        /* 6服务区单独处理用以展示收费站区域(不展示摄像机) */
        return this.areaTypeSwitches.serviceAreaSwitch
          ? `${bg} active`
          : bg
      }
      else if (type == 8) {
        /* 8移动视频源(不展示摄像机) */
        return this.areaTypeSwitches.serviceAreaSwitch
          ? `${bg} active`
          : bg
      }
      return this.cameraTypeSelect.length != 0 &&
        this.cameraTypeSelect.indexOf(type) < 0
        ? bg
        : bg + ' active'
    },
    initQueryAmapMarks(p) {
      console.log(p, 'p值')
      this.tabMap('gaode')
      this.mapQuery.data = {}
      this.searchBlock = ''
      this.cameraTypeSelect = []
      // this.$refs.videoList.treeNode();
      //自定义点击首页树返回全国数据
      this.$root.$emit('homeLeftTreeData')

      // 全国默认海量点渲染
      this.cameraRenderer = null

      /* 关闭所有区域类型开关 */
      this.closeSwitch()

      // initQueryAmapMarks回调
      this.$refs.amapIns
        ? this.initQueryAmapMarksCallback()
        : setTimeout(() => {
            this.initQueryAmapMarksCallback()
          })
    },
    /**
     * 地图层级变化时，刷新地图显示点数据
     *
     * @param currRegionCode
     * @returns {boolean}
     */
    refreshAmapMarks(currRegionCode) {
      /* 如果16层级以下选择了区域类型显示就不显示摄像机 */
      let isAreaTypeSwitch = false
      for (const areaTypeSwitch in this.areaTypeSwitches) {
        isAreaTypeSwitch =
          isAreaTypeSwitch ||
          this.areaTypeSwitches[areaTypeSwitch]
      }
      if (isAreaTypeSwitch && this.curMap === 'gaode')
        return

      /* 正常流程请求 */
      var param = {}
      var _that = this

      if (typeof currRegionCode == 'object') {
        param = currRegionCode
        currRegionCode = param.currRegionCode
        if (currRegionCode == undefined) {
          currRegionCode =
            _that.mapQuery.data.currRegionCode
        }
      } else {
        param = { currRegionCode }
      }
      // console.log(param,'dsds')
      //把查询条件带入获取摄像机列

      for (var i in _that.mapQuery.limit) {
        var k = _that.mapQuery.limit[i]
        if (typeof k == 'function') {
          continue
        }
        var v = _that.mapQuery.data[k]
        var pv = param[k]
        if (pv != undefined && pv != '') {
          _that.mapQuery.data[k] = pv
        } else {
          param[k] = v
        }
      }

      if (currRegionCode) {
        this.eventRegionCode =
          _that.mapQuery.data.currRegionCode
      }
      if (currRegionCode === '100000') {
        currRegionCode = ''
      }

      let _this = this,
        mymap = null,
        bounds = null,
        northEast,
        southWest,
        zoom = null,
        postBody = param,
        rout =
          _this.cameraCategoryRouteList[
            _this.cameraCategoryRoute
          ]
      const cnNorthEast = '135.09567,53.563624',
        cnSouthWest = '73.502355,3.823583'

      // 依据地图获取zoom和bounds
      if (this.curMap === 'gaode') {
        // 高德
        mymap = _this.$refs.amapIns.mapInstance
        bounds = mymap.getBounds()
        zoom = mymap.getZoom()
        northEast = bounds.northeast.toString()
        southWest = bounds.southwest.toString()
      } else if (this.curMap === 'baidu') {
        // 百度
        mymap = this.$refs.BMap
        bounds = mymap.map.getBounds()
        zoom = mymap.zoom
        // 百度的zoom层级可能在过程种会出现NaN的问题
        if (!zoom) return
        const bd09_northeast = this.$gcoord.transform(
          [bounds.ne.lng, bounds.ne.lat],
          'BD09',
          'GCJ02'
        )
        const bd09_southwest = this.$gcoord.transform(
          [bounds.sw.lng, bounds.sw.lat],
          'BD09',
          'GCJ02'
        )
        northEast = `${bd09_northeast[0]},${bd09_northeast[1]}`
        southWest = `${bd09_southwest[0]},${bd09_southwest[1]}`
      }

      // 搜索条件下需要查询所有摄像机
      if (this.searchBlock) {
        zoom = 18
      }

      //获取路径所选的所有参数
      let ndata = _this.getPreParamsAr()
      if (ndata.cityCode) postBody.cityCode = ndata.cityCode
      if (ndata.road) postBody.road = ndata.road
      if (this.organizationData) {
        postBody.organizationId = this.organizationData
      }

      // provinceCode是有效字段
      postBody.provinceCode =
        postBody.currRegionCode == 100000
          ? ''
          : postBody.currRegionCode
      postBody.currRegionCode = undefined

      let data = {
        params: {
          zoomLevel: zoom, //13,
          northEast: zoom <= 6 ? cnNorthEast : northEast, // 6层及以下默认全国范围
          southWest: zoom <= 6 ? cnSouthWest : southWest,
          searchBlock: this.searchBlock
        },
        data: postBody
      }
      // console.log(data,"data222")
      // console.log(_this.cameraTypeSelect,"c_type")
      _this.getCameraListForPot(data).then(res => {
        console.log( _this.cameraTypeSelect,' _this.cameraTypeSelect.length _this.cameraTypeSelect.length')
        //根据选中的状态、类型筛选数据
        let newArr = res.data.filter(vo => {
          if (vo.classify === '8' && _this.cameraTypeSelect.length == 0 ) {
            
            return false
          }
          if ((vo.classify === '5' || vo.classify === '6') && _this.cameraTypeSelect.length == 0 ) {
            
            return false
          }else if (
            _this.cameraTypeSelect == undefined ||
            _this.cameraTypeSelect.length == 0
          ) {
            return true
          }
          let hasType = _this.cameraTypeSelect.indexOf(
              vo.classify
            ),
            // hasStatus = _this.cameraStatusChange[parseInt(vo.onlineStatus)];
            hasStatus = true
          if (hasType > -1) {
            return true
          }
          //收费广场、收费站连体
          if (vo.classify === '4' || vo.classify === '8') {
            hasType = _this.cameraTypeSelect.indexOf('5')
          }
          if (vo.classify === '9' || vo.classify === '0') {
            hasType = _this.cameraTypeSelect.indexOf('1')
          }
          
          // console.info(vo.classify,vo.onlineStatus,hasType,hasStatus);
          return hasType >= 0 && hasStatus
        })
        

        // console.info(res);
        // 保存当前显示的摄像机
        this.cameraDataList = newArr
        let objArr = this.cameraStateStatistics(
          this.cameraDataList
        )

        if (this.curMap === 'gaode') {
          // 高德地图
          this.asideBtnShow = true
          this.$refs.amapIns.pointsSetIn(objArr)
        } else if (this.curMap === 'baidu') {
          // 百度地图
          this.asideShow.left = false
          this.asideBtnShow = false
          this.$refs.BMap.handleCamerasData(objArr)
        }
      })
    },

    /**
     * 查询摄像机统计数据
     * @param data
     * @param callback
     * @returns {boolean}
     */
    queryStaticDataList(data, callback) {
      // let _this = this;
      // if (!data.dimensionType) {
      //   return false;
      // }
      // if (!data.data) data.data = {
      //   ..._this.getPreParamsAr()
      // };
      // //{dimensionType:'province'}
      // _this.getDeviceStatistics(data).then((res) => {
      //   //console.info('queryStaticDataList', res);
      //   if (res && res.code === 200) {
      //     //_this.setCameraStatisticsByRegion(res.data);
      //     if (typeof callback === "function") {
      //       callback(res);
      //     }
      //   }
      // });
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
            pageSize: 2000 // 暂未使用分页功能
          },
          data: {}
        }

      //获取路径所选的所有参数
      args.data = _this.getPreParamsAr()

      //查询数据
      _this.getCameraListForStatis(args).then(res => {
        //console.info('getCameraListForStatis', res);
        _this.cameraLoading = false
        //that.setCameraStatisticsList(res.data);

        //TODO: 设置地图点 pointsSetIn   数据中摄像头信息，路线字段是roadId
        //_this.$refs.amapIns.pointsSetIn(res.data);

        /*if(res.code === 200){
            _this.setCameraStatisticsList(res.data);

        }*/
      })
    },
    /**
     * 查询里程桩号详细信息列表
     * @returns {boolean}
     */

    /**
     * 模拟刷新- 无用
     * @param list
     * @param fun
     */
    setPercent(code, fun) {
      clearInterval(this.freshCameraStatusInt)
      if (!code || code === 'camera') {
        return false
      }
      let list = [],
        listName = '',
        that = this
      switch (code) {
        case 'province':
          listName = 'provinceList'
          break
        case 'city':
          listName = 'cityList'
          break
        case 'company':
          listName = 'companyList'
          break
        case 'road':
          listName = 'roadList'
          break
      }
      //console.info('listName',code,listName,that['provinceList'],that[listName]);
      list = JSON.parse(JSON.stringify(that[listName]))
      if (!list.length) {
        return false
      }

      let checkData = function(list) {
        list.forEach((vo, idx) => {
          vo.percent = parseInt(Math.random() * 100)
        })

        that[listName] = list

        if (typeof fun === 'function') fun(list)
      }
      checkData(list)
      this.freshCameraStatusInt = setInterval(() => {
        checkData(list)
        //console.info('setPercent');
        clearInterval(this.freshCameraStatusInt)
      }, 5000)
    },

    /**
     * 地图加载完成回调
     */
    amapCompleteCallback() {
      this.rightSideCollapsed = false
      //let _this = this;
      //显示左侧区块
      this.leftSideCollapsed = false
      let _this = this,
        uInfo = _this.userInfo
      // console.info("_this.userInfo ", _this.userInfo);
      _this.regionCode = uInfo.regionCode
      _this.regionName = uInfo.regionName
      _this.currentMapRegionCode = uInfo.regionCode

      let queryRoadData = {}

      _this.$nextTick(() => {
        let pathInfo =
          _this.cameraCategoryRouteList[
            _this.cameraCategoryRoute
          ][0]
        //初始化路径位置， 省份用户直接进省份
        if (uInfo.regionCode !== 100000) {
          queryRoadData.regionCode = uInfo.regionCode
          //console.info('pathInfo   ',pathInfo);
          //转为road打头
          //_this.currCategoryPathIndex = 1;
          //按照路线查询，设定为指定省份的管辖范围
          _this.cameraCategoryRouteList.forEach(
            (volist, idx) => {
              if (volist.length) {
                volist.forEach((vo, vidx) => {
                  //省份开头的路径设置为用户省
                  if (vo.code === 'province') {
                    _this.cameraCategoryRouteList[idx][
                      vidx
                    ].name = uInfo.regionName
                    _this.cameraCategoryRouteList[idx][
                      vidx
                    ].value = uInfo.regionCode
                  }
                })
              }
            }
          )
          //组织类型判断，路公司
          if (
            ['10', '20'].indexOf(uInfo.organizationType) >=
            0
          ) {
            //_this.currCategoryCode = 'road';
            //按照路线查询，设定为指定路公司的管辖范围
            //queryRoadData.organizationId = _this.organizationId;
            //路公司直接进单位
            //_this.currCategoryPathIndex = 2;
            _this.cameraCategoryRouteList[1][1] = {
              code: 'company',
              name: uInfo.organizationName,
              value: uInfo.organizationId
            }
            //查询单位数据
            //_this.checkListData(uInfo.organizationId,uInfo.organizationName,'road');
          } else {
            //_this.currCategoryCode = 'company';
            //查询单位数据
            _this.checkListData(
              uInfo.regionCode,
              uInfo.regionName,
              'company'
            )
          }
        }
        this.checkListData(
          pathInfo.value,
          pathInfo.name,
          pathInfo.code
        )
      })
    },

    /**
     * 地图点击回调
     *
     * 点击后设置为按城市查找
     */
    amapClickCallback(currFeature) {
      //[320000, "江苏省", "province"]   [320100, "南京市", "city"]
      // console.info('amapClickCallback 11 ',currFeature)
      //this.regionCode          =  currFeature[0];
      if ('district' === currFeature[2]) {
        //直辖市
        let citytype = ['11', '31', '50', '15'],
          str = (currFeature[0] + '').substr(0, 2)
        //console.info(citytype,str,str.indexOf(citytype));
        if (str.indexOf(citytype) >= 0)
          currFeature[2] = 'city'
      }
      let that = this
      // console.info('amapClickCallback 11 ',currFeature,that.currentMapRegionCode);
      if (
        parseInt((currFeature[0] + '').substr(0, 4)) ===
        parseInt(
          (that.currentMapRegionCode + '').substr(0, 4)
        )
      ) {
        return false
      }
      if (that.userInfo.regionCode === 100000) {
        //中国以外地方点击，还原到省份
        //that.currCategoryCode = 'province';
        //初始化步骤
        //that.currCategoryPathIndex = 0;
        that.currentMapRegionCode = currFeature[0]
      } else {
        let provinceCode =
            parseInt((currFeature[0] + '').substr(0, 2)) *
            10000,
          upCode =
            parseInt(
              (that.userInfo.regionCode + '').substr(0, 2)
            ) * 10000,
          cityCode = parseInt(
            (currFeature[0] + '').substr(2, 4)
          )
        //let cityCode = parseInt((that.currentMapRegionCode + '').substr(2,4));

        //非全国用户，不能切区域, 本省以内的城市切换
        that.currentMapRegionCode =
          cityCode > 0 && provinceCode === upCode
            ? currFeature[0]
            : that.userInfo.regionCode
      }
      //路径中记录所选地图区域
      that.cameraCategoryRouteList.forEach(
        (volist, idx) => {
          if (volist.length) {
            volist.forEach((vo, vidx) => {
              //更新所有路径中省份城市数值
              if (vo.code === currFeature[2]) {
                that.cameraCategoryRouteList[idx][
                  vidx
                ].name = currFeature[1].replace('省', '')
                that.cameraCategoryRouteList[idx][
                  vidx
                ].value = currFeature[0]
                //if(that.cameraCategoryRouteList[idx][0].code !== 'road') that.currCategoryPathIndex = vidx + 1;
                if (
                  idx === that.cameraCategoryRoute &&
                  vidx + 1 < volist.length
                ) {
                  that.currCategoryPathIndex = vidx + 1
                  that.currCategoryCode =
                    volist[vidx + 1].code
                }
                /*if(that.currCategoryPathIndex === vidx){

              }*/
              }
              //全国，清理省份城市
              if (
                currFeature[0] === 100000 &&
                (vo.code === 'city' ||
                  vo.code === 'province')
              ) {
                that.cameraCategoryRouteList[idx][
                  vidx
                ].name = ''
                that.cameraCategoryRouteList[idx][
                  vidx
                ].value = ''
                //if(that.cameraCategoryRouteList[idx][0].code !== 'road') that.currCategoryPathIndex = vidx + 1;
                that.currCategoryPathIndex = 0
                that.currCategoryCode = volist[0].code
              }
              //省份，清理城市
              //if((currFeature[2] === 'province' || that.currentMapRegionCode !== 100000) && vo.code === 'city'){
              if (
                currFeature[2] === 'province' &&
                vo.code === 'city'
              ) {
                that.cameraCategoryRouteList[idx][
                  vidx
                ].name = ''
                that.cameraCategoryRouteList[idx][
                  vidx
                ].value = ''
                //that.currCategoryPathIndex = vidx-1;
              }
            })
          }
        }
      )
      //刷新当前列表数据
      //that.changeCameraCategoryPath(currFeature[0], currFeature[1], currFeature[2], true);
      let currRoute =
          that.cameraCategoryRouteList[
            that.cameraCategoryRoute
          ],
        pathInfo = {} //that.cameraCategoryRouteList[that.cameraCategoryRoute][that.currCategoryPathIndex];
      //路线已选择，切换到路线以下全国
      if (currRoute[0].code === 'road') {
        if (currRoute[0].value) {
          that.currCategoryPathIndex++
        } else {
          that.currCategoryPathIndex = 0
        }
      }
      if (that.currCategoryPathIndex + 1 > currRoute.length)
        that.currCategoryPathIndex = currRoute.length - 1
      pathInfo = currRoute[that.currCategoryPathIndex]

      //切换区域后，清理区域以后的路径数据
      if (currRoute[0].code !== 'road')
        that.clearCameraCategoryPath(
          that.cameraCategoryRoute,
          that.currCategoryPathIndex
        )

      that.currCategoryCode = pathInfo.code
      //that.checkListData(currFeature[0], currFeature[1], currFeature[2]);
      that.checkListData(
        pathInfo.value,
        pathInfo.name.replace('省', ''),
        pathInfo.code
      )

      // console.info(
      //   "amapClickCallback",
      //   that.cameraCategoryRouteList,
      //   that.cameraCategoryRoute,
      //   pathInfo,
      //   that.currCategoryPathIndex,
      //   that.currentMapRegionCode,
      //   that.currCategoryCode
      // );
    },

    /**
     * 摄像头查询路径选择
     *
     * @param curr
     */
    checkCameraRouterBtnClick(curr) {
      let that = this
      that.cameraLoading = false
      // console.log(1123,that.cameraCategoryRoute, curr)
      if (that.cameraCategoryRoute === curr) {
        return false
      }
      if (curr === 1) {
        that.cameraCategoryRoute = curr
        that.currCategoryPathIndex = -1
        that.cameraCategoryType = 'unit'
        // that.$refs.tree.getCountUserOrganization();
        // this.getOrgCompany()
        return false
      }
      if (curr === 2) {
        this.gteDeviceStatisticsList()
      }
      that.cameraCategoryType = ''
      let regionCode = JSON.parse(
        localStorage.getItem('cloudplatform')
      ).regionCode
      if (regionCode === 410000) {
        that.cameraCategoryRouteList = _.cloneDeep(
          that.oldCameraCategoryRouteHnList
        )
      } else {
        that.cameraCategoryRouteList = _.cloneDeep(
          that.oldCameraCategoryRouteList
        )
      }

      //选择的路径类型
      that.cameraCategoryRoute = curr
      //当前路径
      let currRoute = that.cameraCategoryRouteList[curr],
        pathInfo = currRoute[0],
        roadPath = null
      that.currCategoryCode = pathInfo.code
      that.currCategoryPathIndex = 0

      //列表位置
      pathInfo = currRoute[that.currCategoryPathIndex]

      //路线已选择，切换到路线以下全国
      // if (
      //   currRoute[0].code === "road" &&
      //   currRoute[0].value &&
      //   that.currCategoryPathIndex === 0
      // ) {
      //   that.currCategoryPathIndex = 1;
      //   pathInfo = currRoute[that.currCategoryPathIndex];
      // }

      that.currCategoryCode = pathInfo.code
      //console.info('checkCameraRouterBtnClick ',curr, cate, nextcate,that.cameraCategoryRouteList);
      //that.changeCameraCategoryPath(pathInfo.value,pathInfo.name,pathInfo.code);
      that.checkListData(
        pathInfo.value,
        pathInfo.name,
        pathInfo.code
      )
      that.currentMapRegionCode = that.userInfo.regionCode
      setTimeout(() => {
        if (that.$refs.amapIns) {
          // that.$refs.amapIns.switch2AreaNode(that.userInfo.regionCode);
        }
      }, 0)

      //更新地图显示的点
      that.refreshAmapMarks(that.currentMapRegionCode)

      //console.info('checkCameraRouterBtnClick',currRoute,pathInfo,that.currentMapRegionCode,that.currCategoryPathIndex,that.currCategoryCode);

      // console.info(
      //   "checkCameraRouterBtnClick",
      //   that.cameraCategoryRouteList,
      //   that.cameraCategoryRoute,
      //   that.currCategoryPathIndex,
      //   that.currentMapRegionCode,
      //   pathInfo
      // );
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
        routerList = _.cloneDeep(
          that.cameraCategoryRouteList[
            that.cameraCategoryRoute
          ]
        ),
        pathInfo = {}
      if (cname && cid) {
        pathInfo = routerList[curIndex]
        //更新当前地址内容
        pathInfo.name = cname
        pathInfo.value = cid
        //更新面包屑导航信息
        that.cameraCategoryRouteList[
          that.cameraCategoryRoute
        ] = routerList
      }

      //展示下一级内容
      if (curIndex + 1 < routerList.length) {
        that.currCategoryPathIndex = curIndex + 1
        that.currCategoryCode =
          routerList[curIndex + 1].code
      }

      //更新所有路径对应省市
      // if (["province", "city"].indexOf(newCate) >= 0) {
      //   that.cameraCategoryRouteList.forEach((volist, idx) => {
      //     if (volist.length) {
      //       volist.forEach((vo, vidx) => {
      //         if (vo.code === newCate) {
      //           that.cameraCategoryRouteList[idx][vidx].name = cname;
      //           that.cameraCategoryRouteList[idx][vidx].value = cid;
      //         }
      //       });
      //     }
      //   });
      // }

      //更新地图
      let params = that.getPreParamsAr(),
        areaCode =
          params.provinceCode || that.currentMapRegionCode
      if (params.cityCode) {
        areaCode = params.cityCode
      }
      that.currentMapRegionCode = areaCode
      // console.log(that.currentMapRegionCode,"that.currentMapRegionCode")
      //更新地图显示
      setTimeout(() => {
        if (that.$refs.amapIns) {
          // that.$refs.amapIns.switch2AreaNode(areaCode);
        }
      }, 0)

      let pi = routerList[curIndex + 1]
      if (
        pi.value &&
        pi.name &&
        curIndex + 2 < routerList.length
      ) {
        pi = routerList[curIndex + 2]
        that.currCategoryPathIndex = curIndex + 2
        that.currCategoryCode = pi.code
      }

      that.checkListData('', '', pi.code)
      //更新地图显示的点
      that.refreshAmapMarks(that.currentMapRegionCode)
      // console.info(
      //   "changeCameraCategoryPath",
      //   that.cameraCategoryRouteList,
      //   that.cameraCategoryRoute,
      //   that.currCategoryPathIndex,
      //   that.currentMapRegionCode
      // );
    },
    //里程桩号显隐
    mileShow() {
      this.regionCode =
        this.$refs.amapIns?.currentAreaNode?.adcode ||
        320000
      if (this.regionCode == 100000) {
        /* 如果未选择省区域则return */
        this.$message.warning('请先选择一个省区域')
        return
      }

      /* 处理桩显隐 */
      this.mileIsShow = !this.mileIsShow

      if (this.curMap === 'gaode') {
        this.$refs.amapIns.mileShow(this.mileIsShow)
      } else if (this.curMap === 'baidu') {
        //
      }
    },
    searchShow() {
      this.searchIcon = !this.searchIcon
      this.searchIsShow = !this.searchIsShow
    },
    searchBack() {
      this.searchBlock = ''
      this.searchShow()
    },
    /**
     * 面包屑导航单击
     */
    breadcrumbClick(e, pathInfo, ridx) {
      let that = this,
        //oldCate = this.currCategoryCode,
        routerList =
          that.cameraCategoryRouteList[
            that.cameraCategoryRoute
          ],
        curIndex = 0
      that.currCategoryPathIndex = ridx || 0
      //if(!pathInfo && that.regionCode !== 100000) return false;

      //全国
      if (!pathInfo) {
        //设置所在位置
        that.currCategoryPathIndex = 0
        that.currentMapRegionCode = that.regionCode
        //that.setPercent();
        that.currCategoryCode = routerList[0].code //当前所在位置code

        if (that.$refs.amapIns) {
          // that.$refs.amapIns.switch2AreaNode(that.regionCode); //更新地图到初始图层
        }

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
        // that.cameraCategoryRouteList.forEach((volist, idx) => {
        //   if (volist.length) {
        //     volist.forEach((vo, vidx) => {
        //       //
        //       //全国用户才能清理省份信息
        //       if (
        //         that.regionCode !== 100000 &&
        //         ["province", "city"].indexOf(vo.code) >= 0
        //       ) {
        //         return false;
        //       }
        //       that.cameraCategoryRouteList[idx][vidx].name = "";
        //       that.cameraCategoryRouteList[idx][vidx].value = "";
        //     });
        //   }
        // });

        that.checkListData('', '', that.currCategoryCode)
        //return true;
      } else {
        //
        that.clearCameraCategoryPath(
          that.cameraCategoryRoute,
          that.currCategoryPathIndex
        )
        that.changeCameraCategoryPath(
          pathInfo.value,
          pathInfo.name,
          pathInfo.code
        )

        //还原到省份或城市
        if (
          pathInfo.code === 'province' ||
          pathInfo.code === 'city'
        ) {
          that.currentMapRegionCode = pathInfo.value
        } else {
          let nrcode = 0
          routerList.forEach((vo, idx) => {
            if (
              vo.code === 'province' ||
              vo.code === 'city'
            ) {
              nrcode = vo.value
            }
          })
          that.currentMapRegionCode = nrcode || 100000
        }
        //更新地图显示
        setTimeout(() => {
          if (that.$refs.amapIns) {
            // that.$refs.amapIns.switch2AreaNode(that.currentMapRegionCode);
          }
        }, 0)

        that.checkListData('', '', pathInfo.code)
      }

      //更新地图显示的点
      that.refreshAmapMarks(that.currentMapRegionCode)
      // console.info(
      //   "breadcrumbClick",
      //   that.cameraCategoryRouteList,
      //   that.cameraCategoryRoute,
      //   that.currCategoryPathIndex,
      //   that.currentMapRegionCode
      // );
    },

    /**
     * 整理本路径已选择的数据项，用到下一级查询中
     */
    getPreParamsAr() {
      let that = this,
        rout =
          that.cameraCategoryRouteList[
            that.cameraCategoryRoute
          ],
        params = {}

      /*{code: 'province', name: '', value: ''},
      {code: 'company', name: '', value: ''},
      {code: 'city', name: '', value: ''},
      {code: 'road', name: '', value: ''},
      {code: 'camera', name: '', value: ''},*/

      //let lastCode = '';
      rout.forEach(vo => {
        let code = vo.code
        switch (code) {
          case 'province':
            // 优先选择的省份，其次选择用户所属省份，全国不填
            if (vo.value && parseInt(vo.value) !== 100000) {
              params.regionCode = parseInt(vo.value)
                ? parseInt(vo.value)
                : ''
              params.provinceCode = parseInt(vo.value)
                ? parseInt(vo.value)
                : ''
            } else if (
              that.userInfo.regionCode !== 100000
            ) {
              params.regionCode = that.userInfo.regionCode
              params.provinceCode = that.userInfo.regionCode
            }
            break
          case 'city':
            if (vo.value)
              params.regionCode = parseInt(vo.value)
                ? parseInt(vo.value)
                : ''
            params.cityCode = parseInt(vo.value)
              ? parseInt(vo.value)
              : ''
            //params.regionCode = vo.value;
            break
          case 'company':
            params.organizationId = vo.value
            break
          case 'road':
            params.road = vo.value
            break
        }
        //lastCode = vo.code;
      })

      if (
        that.cameraCateSelect &&
        that.cameraCateSelect !== '99'
      ) {
        params.classify = that.cameraCateSelect
      }

      if (
        that.currentMapRegionCode &&
        that.currentMapRegionCode !== 100000
      ) {
        let provinceCode =
          parseInt(
            (that.currentMapRegionCode + '').substr(0, 2)
          ) * 10000
        params.regionCode = provinceCode
        params.provinceCode = provinceCode
        if (
          parseInt(
            (that.currentMapRegionCode + '').substr(2, 4)
          ) > 0
        ) {
          params.cityCode = that.currentMapRegionCode
          params.regionCode = that.currentMapRegionCode
        }
      }

      // console.info(
      //   "getPreParamsAr",
      //   that.cameraCategoryRouteList,
      //   that.cameraCategoryRoute,
      //   rout,
      //   params
      // );

      return params
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
        dataComplete = true
      //是否还有下一级，更新当前列表
      //TODO: 刷新当前列表显示数据
      that.cameraLoading = true

      let data = {
        dimensionType: 'province',
        data: {
          //classify:that.cameraCateSelect,
          //regionCode: cid,
        }
      }
      //获取路径所选的所有参数
      data.data = that.getPreParamsAr()
      // console.info("checkListData", cid, cname, dataCate, data);
      //if(that.userInfo.regionCode !== '100000') data.data.regionCode = that.userInfo.regionCode;
      switch (dataCate) {
        //country
        default:
        case 'province':
          //查询省份列表
          /*this.searchDistrict('country','中国',(result)=>{
              //console.info(result);
              that.provinceList = result;
              that.cameraLoading = false;
              that.setPercent('province');//that.currCategoryCode
          });*/
          that.queryStaticDataList(data, res => {
            that.cameraLoading = false
            that.setCameraStatisticsListByProvince(res.data)
          })
          break
        case 'city':
          //查询城市列表
          data.dimensionType = 'city'
          that.queryStaticDataList(data, res => {
            that.cameraLoading = false
            that.setCameraStatisticsListByCity(res.data)
          })
          break
        case 'company':
          //
          //单位
          data.dimensionType = 'organization'
          // modify zhang yufeng by 20191203
          data.data.organizationType = '20' // '10';
          that.queryStaticDataList(data, res => {
            that.cameraLoading = false
            that.setCameraStatisticsListByOrg(res.data)
          })
          break
        case 'road':
          //路线
          data.dimensionType = 'road'
          //data.data.organizationId = ''+cid;
          that.queryStaticDataList(data, res => {
            that.cameraLoading = false
            that.setCameraStatisticsListByRoad(res.data)
          })
          break
        case 'camera':
          //摄像头列表

          //data.dimensionType = 'road';
          that.queryCameraStaticDataList()
          // that.cameraLoading = false;
          break
      }

      return dataComplete
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
        let path = this.cameraCategoryRouteList[idx]
        path.forEach(function(route, vidx) {
          // && ['province','city'].indexOf(route.code) < 0
          if (vidx > pidx) {
            path[vidx].name = ''
            path[vidx].value = ''
          }
        })
        this.cameraCategoryRouteList[idx] = path
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
        prevPath =
          that.cameraCategoryRouteList[
            that.cameraCategoryRoute
          ][iidx]

      //console.info('gobackRoute ',prevPath,that.currCategoryPathIndex,iidx);

      //当前列表显示数据类型
      that.currCategoryCode = prevPath.code
      //清理当前之后的路径缓存
      that.clearCameraCategoryPath(
        that.cameraCategoryRoute,
        iidx - 1 < 0 ? 0 : iidx - 1
      )
      //console.info(that.currCategoryCode);
      //that.setPercent(that.currCategoryCode);

      //console.info('gobackRoute  ',that.currCategoryCode,that.cameraCategoryRouteList[that.cameraCategoryRoute],prevPath);

      if (that.currCategoryCode === 'province') {
        //当前是省，返回全国
        // that.$refs.amapIns.switch2AreaNode(that.regionCode);
      }
      if (that.currCategoryCode === 'city') {
        //当前是市，返回省
        let aa = iidx - 1 >= 0 ? iidx - 1 : 0,
          prevPath =
            that.cameraCategoryRouteList[
              that.cameraCategoryRoute
            ][aa]

        //console.info('gobackRoute 222 ',aa,prevPath);

        // that.$refs.amapIns.switch2AreaNode(prevPath.value);
      }

      /*if(['city','province'].indexOf(that.currCategoryCode) >=0){
          //更新地图显示
          setTimeout(()=>{
              that.$refs.amapIns.switch2AreaNode(that.currCategoryCode === 'city' ? prevPath.value : 100000);
          },0)
      }*/

      that.currCategoryPathIndex = iidx
    },

    /**
     * 鼠标移动联动地图区块
     *
     * @param adcode
     */
    districtMouseover(adcode) {
      //districtExplorer.setHoverFeature(currentAreaNode.getSubFeatureByAdcode(adcode));
      if (window.hoverTimeout) {
        clearTimeout(window.hoverTimeout)
      }
      window.hoverTimeout = setTimeout(() => {
        if (this.$refs.amapIns) {
          this.$refs.amapIns.districtHover(adcode)
        }
      }, 300)
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

      let subdistrict = 1
      if (
        level === 'province' &&
        keyword.indexOf('市') >= 0
      ) {
        level = 'district'
        keyword = keyword.replace('市', '城区')
        subdistrict = 1
      }

      //console.info(level,keyword,keyword.indexOf('市'));

      AMap.plugin('AMap.DistrictSearch', function() {
        let districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: level, //'country',
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: subdistrict
        })

        // 搜索所有省/直辖市信息
        districtSearch.search(keyword, function(
          status,
          result
        ) {
          // 查询成功时，result即为对应的行政区信息
          // console.log('searchDistrict222222222222222',status, result,keyword);

          if (result.info !== 'OK') {
            return false
          }

          let list = result.districtList[0].districtList
          //console.info(result.districtList[0].districtList);
          if (typeof callback === 'function') {
            callback(list)
          }
        })
      })
    },

    loadCamera(val) {
      // console.info("loadCamera", val);
    },

    /**
     * 默认事件
     */
    loadDefaultMapEvent() {
      this.$root.$off('reloadCameraList')

      //控制摄像机信息修改弹窗
      this.$root.$on('reloadCameraList', nv => {
        this.refreshAmapMarks(this.eventRegionCode)
      })
    },

    /**
     * 右侧统计数据切换
     */
    changeRightProgress(val) {
      this.rightProgressChose = val
    },
    /**执行映射 traffic-map method */
    invokeMethod(obj) {
      // console.log('invoke map parent compnent method',obj)
      if (obj.method) {
        this[obj.method](obj.param)
      }
    },

    // 切换地图
    tabMap(map) {
      if (map === this.curMap) return
      /* 整理地图状态数据 */
      // 地图层级
      const zoom =
        this.curMap === 'gaode'
          ? this.$refs.amapIns.currentMapZoom
          : this.curMap === 'baidu'
          ? this.$refs.BMap.zoom
          : 5.0

      // 地图中心
      let center
      if (this.curMap === 'gaode') {
        const ac = this.$refs.amapIns.mapInstance.getCenter()
        center = [ac.R, ac.Q]
      } else if (this.curMap === 'baidu') {
        const bc = this.$refs.BMap.map.getCenter()
        center = this.$gcoord.transform(
          [bc.lng, bc.lat],
          'BD09',
          'GCJ02'
        )
      } else if (this.curMap === 'tengxun') {
        center = [105.397428, 37.90923]
      }

      // 所选区域编码
      const regionCode =
        this.$refs.amapIns?.currentAreaNode?.adcode ||
        320000

      // 卫星模式
      let isSatelliteMode = this.mapLayerTypes.satellite
      if (map === 'baidu') {
        // 百度默认开
        isSatelliteMode = this.mapLayerTypes.satellite = true
        // 顺带隐藏运维模式开关
        this.cameraRenderer = null
      }

      // 数据整理
      this.mapStatus = {
        isSatelliteMode,
        center,
        zoom,
        regionCode
      }

      // 切换
      this.curMap = map
    },

    // (之前用于)根据当前地图层级判断地图切换与否
    judgeTabMapSwitch(zoom) {
      this.mapStatus.zoom = zoom

      // 缩放更新摄像机默认海量点(非全国)(有选区且大于7才可选操，小于8则海量点)
      this.eventRegionCode != 100000 &&
        zoom > 7 &&
        this.cameraRenderer === null &&
        (this.cameraRenderer = 'mass')
      zoom < 8 && (this.cameraRenderer = null)
    },

    // 切换区域类型显示开关
    async tabAreaTypeSwitch(areaTypeswitch) {
      this.regionCode =
        this.$refs.amapIns?.currentAreaNode?.adcode ||
        320000
      if (this.regionCode == 100000) {
        /* 如果未选择省区域则return */
        this.$message.warning('请先选择一个省区域')
        return
      }

      /* 处理区域类型切换 */
      this.areaTypeSwitches[areaTypeswitch] = !this
        .areaTypeSwitches[areaTypeswitch]

      this.regionCode =
        this.$refs.amapIns?.currentAreaNode?.adcode ||
        320000
      const areaType = areaTypeswitch.replace('Switch', '')
      if (this.areaTypeSwitches[areaTypeswitch]) {
        /* 如果对应开关为开 */
        if (
          !this.$store.state.areaTypes[areaType][
            this.regionCode
          ]
        ) {
          /* 如果没值就发请求去 */
          const data = await this.getAreaDataByType(
            areaType
          )
          // 存储在vuex
          const str = areaType[0]
            .toLocaleUpperCase()
            .concat(areaType.substr(1))
          this.$store.commit(`areaTypes/set${str}`, data)
        }

        // 根据地图组件来选中绘制
        if (this.curMap === 'gaode') {
          this.$refs.amapIns.showAreaTypeMarkers(areaType)
        } else if (this.curMap === 'baidu') {
          this.$refs.BMap.showAreaTypeMarkers(areaType)
        }
      } else {
        // 根据地图组件来选中绘制
        if (this.curMap === 'gaode') {
          this.$refs.amapIns.hideAreaTypeMarkers(areaType)
        } else if (this.curMap === 'baidu') {
          this.$refs.BMap.hideAreaTypeMarkers(areaType)
        }
      }

      this.cameraTypeSelect = []
      for (const areaTypeSwitch in this.areaTypeSwitches) {
        this.areaTypeSwitches[areaTypeSwitch] &&
          this.cameraTypeSelect.push(
            {
              tollStationSwitch: '5',
              serviceAreaSwitch: '6',
              // moveSwitch: '8',
            }[areaTypeSwitch]
          )
      }
      if (this.cameraTypeSelect.length === 0) {
        // 根据地图组件来操作摄像机
        if (this.curMap === 'gaode') {
          this.$refs.amapIns.toggleShowCurCameras() // 显示当前摄像机
        } else if (this.curMap === 'baidu') {
          // this.$refs.BMap
        }

        this.refreshAmapMarks(this.regionCode)
      }
    },

    // 获取对应类型区域点数据
    getAreaDataByType(areaType) {
      const apiKey = {
        serviceArea: 'getServiceAreaPots',
        tollStation: 'getTollStationPots'
      }[areaType]
      this.regionCode =
        this.$refs.amapIns?.currentAreaNode?.adcode ||
        320000
      const transform = this.$gcoord.transform

      return api[apiKey]({
        regionCode: this.regionCode
      }).then(res => {
        const data = res.data
        return {
          regionCode: data.provinceCode,
          data: data.data.map(e => {
            const lnglat = [e.fvcLon, e.fvcLat]
            const [bd09Longitude, bd09Latitude] = transform(
              [e.fvcLon, e.fvcLat],
              'GCJ02',
              'BD09'
            )
            return {
              lnglat,
              style: e.abuttingStatus == 1 ? 1 : 0, // "1"接入 "0"未接入
              bd09Longitude,
              bd09Latitude,
              name: e.fvcServicename,
              abuttingStatus: e.abuttingStatus == 1 // "1"接入 "0"未接入
            }
          })
        }
      })
    },

    // 关闭指定开关
    closeSwitch() {
      /* 关闭所有区域类型开关 */
      for (let areaType in this.areaTypeSwitches) {
        this.areaTypeSwitches[areaType] = false
      }
    },

    //============================还原首页组织树饼形图等模块、苏交控暂时不需要

    /**
     * 地图上显示指定摄像头位置
     */
    showCamera2AMap(cameraInfo, idx, organizationId, Node) {
      console.info(
        cameraInfo,
        idx,
        'tree click 播放摄像机信息'
      )
      //this.$message.success(JSON.stringify(cameraInfo));
      if (this.$refs.amapIns) {
        // setTimeout(() => {
        //   this.$refs.amapIns.refreshAmapMarks(cameraInfo.regionCode, organizationId ? organizationId : '');
        // }, 0);

        if (cameraInfo.cameraNum) {
          var mark = this.$refs.amapIns.creadCameraMark(
            cameraInfo
          )
          mark.emit('click', { target: mark })
        } else {
          // setTimeout(() => {
          this.organizationData = organizationId
            ? organizationId
            : ''
          // this.refreshAmapMarks(cameraInfo.regionCode, organizationId ? organizationId : '',18);
          this.refreshAmapMarks(
            cameraInfo.regionCode,
            organizationId ? organizationId : '',
            null,
            null,
            cameraInfo.roadCode ? cameraInfo.roadCode : '',
            Node
          )
          // }, 0);
        }
      }
      this.setSelectCameraIndex(idx)
    },

    /**
     * 点击三个模块显隐
     */
    threeMouldeClick() {
      this.showHide = !this.showHide
      var _this = this
      if (this.threeMoulde == true) {
        this.threeMoulde = false
      } else {
        this.threeMoulde = true
        // echar图重置大小自适应延时
        window.setTimeout(function() {
          _this.chart.resize()
        }, 10)
      }
    },

    // 收缩侧边栏
    toggle(side = 'left') {
      this.asideShow[side] = !this.asideShow[side]
      let asideState = this.asideShow[side]
      console.log(asideState, 'aaass')
      this.$root.$emit('asideLeftShow', asideState)
    },

    // 视频列表树节点事件
    handleTreeNode(orgid) {
      console.log('click orgid', orgid)
    },

    // 监控模式开关控制
    switchMonitorActive() {
      if (
        this.monitorActive &&
        this.$refs.monitoringPattern
      ) {
        this.$refs.monitoringPattern.monitoringRecover()
      }
      this.monitorActive = !this.monitorActive

      // 左边栏显示及按钮隐藏
      this.asideShow.left = true
      this.asideBtnShow = !this.monitorActive

      // 右侧弹窗显示
      this.layerShow.right = this.monitorActive
      // 关闭播放的视频
      if (this.monitorActive) {
        this.$refs.amapIns.$refs.amapPlayer.dialogClose()
      }
    },
    // 视频列表树节点事件
    monitorTreeNode(item) {
      if (!item) return
      this.$refs.monitoringPattern.$refs.splitScreen.addVideo(
        item
      )
    }
  },

  mounted() {
    // this.getOrgCompany()
    let locals = localStorage.getItem('PM_CK_MU')
    this.checkMenus(locals).then(mlist => {})
    //this.toggleSetting = 'box-on-top';
    //接口登录不显示头部导航，地图配合显示全屏
    // if (
    //   this.userInfo.source &&
    //   this.userInfo.source === '2'
    // ) {
    //   this.toggleSetting = true
    // } else {
    //   this.toggleSetting = false
    // }
    let pm = JSON.parse(localStorage.getItem("PM_CK_BN")).data
    let pmArr = pm.split(','),
    indexCode = '109310'
    if(pmArr.length === 1 && pmArr[0] == indexCode){
      this.toggleSetting = true
    }else {
      this.toggleSetting = false
    }
    window.echarts = this.$echarts
    //let _this = this,uInfo = _this.userInfo;
    // this.getCodemaster({ codeType: 'CLASSIFY' })
  }
}
