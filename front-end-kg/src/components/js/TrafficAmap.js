/* eslint-disable no-undef */
import { mapState, mapActions, mapMutations } from 'vuex'
/*import aliPlayer from '@/components/AliPlayer'*/
import amapPlayer from '../AmapPlayerDialog'

import axios from 'axios'
import api from '../../api'
import { _ } from 'core-js'
//import axios from 'axios';

const AMap = window.AMap
let AMapMarksDom, // 用于控制marks点标记的事件触发与否
  isInitial = true // 初始化判断

export default {
  name: 'traffic-amap',
  components: {
    //aliPlayer,
    amapPlayer
  },
  props: {
    baseTopAdcodes: {
      type: Number,
      default: 100000
    },
    baseTopAdcodesName: {
      type: String,
      default: '中国'
    },

    cameraRenderer: {
      // 摄像机海量点与否切换控制(null, mass, normal)
      type: Object | String,
      default: () => null
    },

    mapStatus: {
      type: Object,
      default: () => ({
        isSatelliteMode: false, // 卫星模式
        zoom: 5.0 // 地图层级
      })
    }
  },
  data() {
    // let googleLayer = new AMap.TileLayer.Satellite({//初始化卫星图配置
    //   //zooms:[15,24],    //可见级别
    //   getTileUrl:
    //     "http://mt2.google.cn/vt/lyrs=s@817&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
    //   zIndex: 18,
    //   //tileUrl : 'http://www.google.cn/maps/vt?lyrs=s@817&gl=cn&x=[x]&y=[y]&z=[z]',
    //   opacity: 1
    // });
    let satellite = new AMap.TileLayer.Satellite()
    let roadNet = new AMap.TileLayer.RoadNet()

    //实时路况
    let trafficLayer = new AMap.TileLayer.Traffic({
      zIndex: 40
    })
    return {
      lists: [
        {
          latitude: 109.948982,
          longitude: 18.434704
        },
        {
          latitude: 110.948982,
          longitude: 19.434704
        }
      ],
      // googleLayer,
      satellite,
      roadNet,
      mileIsShow: false,
      trafficLayer,
      mapInstance: null,
      districtExplorer: null,
      currentAreaNode: null,
      upOrganizationid: null,
      pointSimplifierIns: null,
      currentMapZoom: 3,
      //'1','2','3','7','5','6'
      //摄像机选中图标
      cameraGifUrl: {
        '1': require('@/assets/map/icon/actCam.gif'),
      },
      //摄像机选中图标
      cameraHighGif: {
        '1': require('@/assets/map/icon/cameraHighActive.gif'),
      },
      //摄像机正常图标
      cameraImgUrl: {
        '1': require('@/assets/map/icon/newcamera1.png'),
      },
      //高清摄像机图标
      cameraHighImg: {
        '1': require('@/assets/map/icon/cameraHigh.png'),
      },
      //摄像机正常图标
      serviceImgUrl: {
        '1': require('@/assets/map/icon/service_area_online.png')
      },
      serviceBwImgUrl: {
        '1': require('@/assets/map/icon/service_area_offline.png')
      },
      //桩号图标
      mileImg: {
        '0': require('@/assets/map/mile/0.png'),
        '1': require('@/assets/map/mile/1.png'),
        '2': require('@/assets/map/mile/2.png'),
        '3': require('@/assets/map/mile/3.png'),
        '4': require('@/assets/map/mile/4.png'),
        '5': require('@/assets/map/mile/5.png'),
        '6': require('@/assets/map/mile/6.png'),
        '7': require('@/assets/map/mile/7.png'),
        '8': require('@/assets/map/mile/8.png'),
        '9': require('@/assets/map/mile/9.png')
      },
      //摄像机离线图标
      cameraOfflineImgUrl: {
        '1': require('@/assets/map/icon/newcamera2.png'),
      },
      //摄像机故障图标
      cameraErrorImgUrl: {
        '1': require('@/assets/map/icon/newcamera3.png'),
      },
      cameraIconWidth: 14, //35,
      cameraIconHeight: 14, //40*88/76
      cameraVideoInfo: {},
      videoUrl: '',
      currentPlayCamera: {},
      cameraInfoWindow: null,
      cameraMarkVisable: false, // amapPlayer组件显隐
      cameraImagesVisable: false,
      cameraInfoVisable: false,
      cameraInfoEditVisable: false,
      videoDialogElement: null,
      //baseTopAdcodes                   : 100000,
      resolutionValue: '20', //视频清晰度
      currentMarkers: null, // 摄像机普通点群实例
      editCameraInfoSign: false, //用户修改摄像机权限
      mapLayerTypes: {
        trafficLayer: false, // 路况图层
        satellite: false // 卫星图层
      },
      mapZIndexConfig: {
        baseLayer: 120, // 基础图层
        googleLayer: 120, // 卫星地图
        labelzIndex: 140, // 标注图层
        markerzIndex: 310, // 摄像头图标
        wmfLayer: 125, // 首都放射线
        featureZIndex: 121,
        resetMarkerZindex: 333 //复位失败摄像头图标层级
      },
      districtExplorer: null,
      curFeatureCode: 320000, // 当前选中的feature
      curFeatureEvent: null, // 当前选中的feature的event
      lastFeatureCode: null, // 上一次选中的feature
      cameraMap: null,
      // region_codes: [],
      checkMark: null, // 选中的覆盖标记摄像机mark点

      milestoneSimplifier: {
        // 千百米桩simplifier实例存储
        kilometer: null,
        all: null
      },

      jsBounds: null, // 保存江苏的getBounds()值

      curActMarker: null, // 当前操作摄像机标记
      currentMarkerZoom: 0, // 当前操作摄像机真实层级

      lastDragMarker: null, // 最后一次拖拽的摄像机marker
      dragIcon: null, // 拖拽使用图标
      clickFwqIcon: null, // 服务区点击使用图标
      clickIcon: null, // 点击摄像机使用图标
      imgs: {
        /* 图标所需 */
        serviceAreaOnline: require('@/assets/map/icon/service_area_online.png'), // 服务区在线接入
        serviceAreaOffline: require('@/assets/map/icon/service_area_offline.png'), // 服务区离线未接入
        tollStationOnline: require('@/assets/map/icon/toll_station_online.png'), // 收费站在线接入
        tollStationOffline: require('@/assets/map/icon/toll_station_offline.png') // 收费站离线未接入
      },
      areaTypeInfoMarker: null, // 区域类型点hover信息展示标记marker
      serviceAreaMassMarkers: {}, // 服务区点群对象(按regionCode划分 {320000: {...}, 300000: {...}})
      tollStationMassMarkers: {}, // 收费站点群对象(按regionCode划分 {320000: {...}, 300000: {...}})
      cameraMassMarks: null, // 摄像机海量点实例,
      cameraHighSign : null //高清摄像机标记
    }
  },
  computed: {
    // 所有桩数据
    polesAllData: vm => vm.$store.state.poles.data.all,

    // 千米桩数据
    polesKilometerData: vm =>
      vm.$store.state.poles.data.kilometer,

    milePointFier() {
      // 当前使用的千百米桩simplifier实例
      return this.currentMapZoom < 14
        ? this.milestoneSimplifier.kilometer
        : this.milestoneSimplifier.all
    },
    milePointFierRest() {
      // 当前未使用的千百米桩simplifier实例
      return this.currentMapZoom >= 14
        ? this.milestoneSimplifier.kilometer
        : this.milestoneSimplifier.all
    },

    // 区域类型对应的图标
    areaImgs: vm => ({
      serviceArea: {
        online: vm.imgs.serviceAreaOnline,
        offline: vm.imgs.serviceAreaOffline
      },

      tollStation: {
        online: vm.imgs.tollStationOnline,
        offline: vm.imgs.tollStationOffline
      }
    }),

    // 服务区点数据
    serviceAreaData: vm =>
      vm.$store.state.areaTypes.serviceArea,

    // 收费站点数据
    tollStationData: vm =>
      vm.$store.state.areaTypes.tollStation
  },
  watch: {
    currentMapZoom(nV, oV) {
      if ((nV >= 14 && oV < 14) || (nV < 14 && oV >= 14)) {
        if (
          this.milestoneSimplifier.all &&
          this.mileIsShow
        ) {
          // 如果有缓存就用缓存数据
          this.milePointFierRest.hide()
          this.milePointFier.show()
        }
      }

      if (nV >= 18 && oV < 18) {
        /* 层级由小缩放至不小于18跳转至百度地图并打开卫星模式 */
        this.$emit('tabMap', 'baidu')
      }
    },

    jsBounds(nV, oV) {
      if (nV && !oV) {
        this.mapInstance.setBounds(this.jsBounds)

        setTimeout(() => {
          // 没有桩数据就去加载
          if (!this.milestoneSimplifier.all) {
            if (this.polesAllData) {
              // 如果有缓存就直接使用缓存数据
              this.loadMileMarker(this.polesAllData)
            } else {
              // 如果没有缓存就调接口请求数据
              this.loadMapMile()
            }
          }
        }, 5000)
      }
    }
  },

  created() {
    console.time('首页地图加载')
    process.env.NODE_ENV === 'development' &&
      (window.gaode = this)
    this.$root.$on('clickVideoDialog', item => {
      this.cameraMarkVisable = true
      this.$refs.amapPlayer.onPlayerDialog()
      //获取播放地址
      this.$refs.amapPlayer.getVideoUrlToPlay(item)
      console.log(item, item, '打开摄像机播放弹窗')
    })
    this.$root.$on('clickTheTreeNode', item => {
      console.log(item, 'clickTheTreeNode')
      this.selectArea(Number(item.id))
    })
    isInitial = true
  },
  beforeMount() {
    this.loadDefaultAmapEvent()
  },
  mounted() {
    this.$nextTick(() => {
      if (AMap) {
        this.initMapContainer()
      } else {
        this.$message.error('地图加载失败请刷新重试')
      }
    })
  },

  activated() {
    // 向父组件传递当前组件图层状态（暂注，当前需求要从父组件拿状态数据来改变当前子组件）
    // for (let key in this.mapLayerTypes) {
    //   this.$emit('mapLayerTypeUpdate', key, this.mapLayerTypes[key])
    // }

    /* 从父组件拿状态数据来改变当前子组件 */
    console.log(
      '高德地图mapStatus',
      this.mapStatus,
      this.mapStatus.zoom
    )

    if (this.mapInstance) {
      // 高德卫星状态自己做主
      // if (this.mapStatus.isSatelliteMode !== this.mapLayerTypes.satellite) {
      //   this.checkGoogleMapType('satellite', this.mapStatus.isSatelliteMode)
      // }
      this.mapInstance.setZoomAndCenter(
        this.mapStatus.zoom,
        this.mapStatus.center
      )
    }

    for (const areaTypeSwitch in this.$parent
      .areaTypeSwitches) {
      const areaType = areaTypeSwitch.replace('Switch', '')
      if (this.$parent.areaTypeSwitches[areaTypeSwitch]) {
        this.showAreaTypeMarkers(areaType)
      } else {
        this.hideAreaTypeMarkers(areaType)
      }
    }

    this.$emit(
      'mapLayerTypeUpdate',
      'satellite',
      this.mapLayerTypes.satellite
    )
  },

  deactivated() {
    if (
      this.cameraMarkVisable ||
      this.$refs.amapPlayer.cameraInfoAlongEditVisable
    ) {
      this.cameraMarkVisable = this.$refs.amapPlayer.cameraInfoAlongEditVisable = false
      this.checkMark?.hide()
      // 调其关闭按钮方法
      this.$refs.amapPlayer.dialogClose()
    }
  },

  methods: {
    ...mapActions(['getCameraPlayUrl', 'getMileageList']),
    ...mapMutations([
      'setSelectCameraIndex',
      'setMileageList'
    ]),

    initMapContainer() {
      var that = this
      var baseLayer = new AMap.TileLayer({
        zooms: [0, 17], //可见级别
        visible: true, //是否可见
        opacity: 1 //透明度
      })

      //初始化地图
      this.mapInstance = new AMap.Map('mapcontainer', {
        // debug:true,
        cursor: 'default',
        resizeEnable: true, //是否监控地图容器尺寸变化
        animateEnable: true,
        disableSocket: true,
        autoSetFitView: false,
        keyboardEnable: false, //地图是否可以通过键盘来控制
        doubleClickZoom: false, //双击事件放大地图
        // scrollWheel:false,    //鼠标滑轮事件
        //viewMode: '3D',
        // showLabel: false,//不显示地图文字标记
        labelzIndex: this.mapZIndexConfig.labelzIndex,
        topAdcodes: [that.baseTopAdcodes],
        pitch: 0,
        zoom: 6,
        zooms: [4, 18],
        center: [105.397428, 37.90923],
        // mapStyle: "amap://styles/b7f705be4f2be54091ca786949404f82", //自定义地图背景
        mapStyle:
          'amap://styles/bc8203de08218f861201e0323d54af02', //王桐桐自定义地图背景
        layers: [baseLayer] //图层
      })
      //当前聚焦的区域
      this.currentAreaNode = null
      //加载地图 鼠标事件
      // 地图图块加载完成后触发
      that.mapInstance.on('complete', function() {
        console.log(
          '%c%s',
          'color: #0f0',
          '地图图块加载完成'
        )
        AMapMarksDom = document.querySelector(
          '#mapcontainer .amap-markers'
        )
        that.$emit('amapComplete')
        that.currentMapZoom = that.mapInstance.getZoom()
        //地图内容
        that.initMapContent()
        //加载地图插件
        // that.loadMapPlugin();
        that.initMapActions()

        // 加载地图图层
        setTimeout(() => {
          that.trafficLayer.hide()
          that.satellite.hide()
          that.mapInstance.add(that.trafficLayer)
          that.mapInstance.add(that.satellite)

          that.dragIcon = that.setVideoIcon(
            require('@/assets/map/icon/selectedCamera.png')
          ) // 拖拽使用图标
          that.clickFwqIcon = that.setVideoIcon(
            require('@/assets/map/icon/select_service.gif')
          ) // 服务区点击使用图标
          that.clickIcon = that.setVideoIcon(
            require('@/assets/map/icon/actCam.gif')
          ) // 服务区点击使用图标

          // 区域类型点hover信息展示标记marker创建
          that.areaTypeInfoMarker = new AMap.Marker({
            content: '.',
            // icon: '',
            map: that.mapInstance,
            visible: false
          })
        })

        console.timeEnd('首页地图加载')
      })
      //判断用户修改摄像机信息权限
      this.editCameraInfoSign = this.$_btnPermissionCheck(
        10931010
      )
      this.checkGoogleMapType('trafficLayer')
    },

    initMapActions() {
      const that = this

      //地图缩放完成
      this.mapInstance.on('zoomend', function(e) {
        that.currentMapZoom = that.mapInstance.getZoom()

        that.$emit('zoomUpdate', that.currentMapZoom)

        if (that.mapInstance.getZoom() <= 4) {
          /* 如果层级不大于4则不可拖拽 返回中国区域 */
          console.log(
            that.mapInstance.getZoom(),
            '地图层级'
          )
          that.mapInstance.panTo([105.397428, 37.90923])
          that.mapInstance.setStatus({
            dragEnable: false
          })
        } else {
          that.mapInstance.setStatus({
            dragEnable: true
          })
        }

        that.mapChanged(e)

        // 关闭可能的右键弹窗
        that.$refs.amapPlayer.cameraInfoAlongEditVisable = false
      })

      //地图拖拽中
      this.mapInstance.on(
        'dragging',
        _.throttle(
          e => {
            if (window.setMapTimeout) {
              clearTimeout(window.setMapTimeout)
            }
          },
          300,
          {
            trailing: false
          }
        )
      )

      // //地图拖拽完成
      // this.mapInstance.on('dragend', function(e) {

      // })

      // 地图移动完成
      this.mapInstance.on('moveend', e => {
        // zoom <= 6时不更数据
        if (that.mapInstance.getZoom() <= 6) {
          if (window.setMapTimeout) {
            that.mapChanged(e)
          }
          return
        }

        that.mapChanged(e)
      })

      //地图形变
      this.mapInstance.on('resize', function(e) {
        that.mapChanged(e)
      })

      // 地图双击
      this.mapInstance.on('dblclick', () => {
        console.log('map-dblclick')

        // 判断区域选择切换
        if (
          this.curFeatureCode &&
          this.curFeatureCode != this.lastFeatureCode &&
          this.curFeatureEvent
        ) {
          // 替代DistrictExplorer()实例的双击 (其本身没有双击事件)
          this.selectArea(
            this.curFeatureCode,
            this.curFeatureEvent
          )
        }

        if (
          this.$refs.amapPlayer.cameraInfoVisable === false
        ) {
          this.checkMark?.hide()
        }
      })
    },

    /**
     * 切换卫星图层
     */
    // checkGoogleMapType(type, isShow) {
    //   isShow ? this[type].show() : this[type].hide()
    //   this.mapLayerTypes[type] = isShow
    //   this.$emit(
    //     'mapLayerTypeUpdate',
    //     this.cameraRenderertype,
    //     isShow
    //   )
    //   // this.renderAreaPolygons(this.currentAreaNode);
    // },
    checkGoogleMapType(type, isShow) {
      console.log(type, isShow, '切换模式')
      isShow ? this[type].show() : this[type].hide()
      this.mapLayerTypes[type] = isShow
      this.$emit('mapLayerTypeUpdate', type, isShow)
    },

    /**
     * 路线图层
     * @returns {boolean}
     */
    showLineLayer() {
      let wms = new AMap.TileLayer.WMS({
        // url: "http://testqxsj.txffp.com/geoserver/sf/wms",
        blend: false,
        tileSize: 512,
        zIndex: this.mapZIndexConfig.wmfLayer,
        params: {
          STYLES: '',
          LAYERS: 'sf%3Ahighway_71118',
          FORMAT: 'image%2Fpng',
          SERVICE: 'WMS',
          VERSION: '1.1.1',
          REQUEST: 'GetMap',
          SRS: 'EPSG%3A3857',
          CQL_FILTER: 'lx%20%3D%207',
          BBOX:
            '12653649.606408,2625087.7436574,12697806.169576,2656394.0569978',
          WIDTH: 512,
          HEIGHT: 363
        }
      })
      wms.setMap(this.mapInstance)
    },

    /**
     * 地图大小、层级等变化方法调用
     */
    mapChanged(e) {
      console.log('mapChanged(e) e', e)
      if (AMapMarksDom) {
        AMapMarksDom.classList.add('event-none')
      } else {
        AMapMarksDom = document.querySelector(
          '#mapcontainer .amap-markers'
        )
        AMapMarksDom?.classList.add('event-none')
      }

      const that = this,
        time = this.cameraRenderer === 'normal' ? 900 : 0
      //防抖
      clearTimeout(window.setMapTimeout)
      window.setMapTimeout = setTimeout(function() {
        // console.info('更新摄像头数据');
        window.setMapTimeout = null
        that.$emit('amap-changed', {
          currRegionCode: that.currentAreaNode?.adcode,
          upOrganizationId: that.upOrganizationid
        })
      }, time)
    },

    /**
     * 创建地图显示内容
     */
    initMapContent() {
      let that = this

      AMapUI.load(['ui/geo/DistrictExplorer'], function(
        DistrictExplorer
      ) {
        //创建一个实例
        let distExp = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: that.mapInstance,
          preload: [100000, 320000],
          zIndex: that.mapZIndexConfig.featureZIndex
        })
        that.districtExplorer = distExp

        //当前聚焦的区域
        that.currentAreaNode = null

        //feature被点击
        distExp.on('featureClick', function(e, feature) {
          // console.info('单击 featureClick e', e, 'feature', feature);

          that.curFeatureCode = feature.properties.adcode
          that.curFeatureEvent = e
        })

        //外部区域被点击
        distExp.on('outsideClick', function(e) {
          that.curFeatureCode = undefined
          that.curFeatureEvent = undefined
        })

        //全国
        // that.switch2AreaNode(that.baseTopAdcodes)
        that.switch2AreaNode(
          that.baseTopAdcodes,
          '9901',
          (err, areaNode) => {
            if (err) {
              console.log('switch2AreaNode err', err)
              return
            }
            if (isInitial) {
              isInitial = false
              // 首次加载自动定位到江苏
              console.log('首次加载自动定位到江苏')
              that.selectArea(320000)
            }
          }
        )
      })
    },
    /**
     * 创建路径轨迹
     */

    /**
     * 动态获取摄像机点位图标，类型、状态
     */
    getMarkerIcon(positionStatus, onlineStatus, classify,hdStatus) {
      console.log(hdStatus,positionStatus, onlineStatus,classify,"positionStatus, onlineStatus")
      let that = this,
        iconBase = {}
      if (onlineStatus === '0') {
        iconBase = that.cameraOfflineImgUrl
      } else if (positionStatus === 1) {
        iconBase = that.cameraErrorImgUrl
      } else if (onlineStatus === '1') {
        iconBase = that.cameraImgUrl
      } else if (
        onlineStatus === '' &&
        onlineStatus === null
      ) {
        iconBase = that.cameraGifUrl
      }
      // 判断是否播放高清视频
      if(hdStatus == 1){
        iconBase = that.cameraHighImg
      }
      return new AMap.Icon({
        image: iconBase['2'] || iconBase['1'],
        size: new AMap.Size(
          that.cameraIconWidth,
          that.cameraIconHeight
        ), // 图标尺寸
        imageSize: new AMap.Size(
          that.cameraIconWidth,
          that.cameraIconHeight
        ) // 根据所设置的大小拉伸或压缩图片
        // imageOffset: new AMap.Pixel(-that.cameraIconWidth / 2, -that.cameraIconHeight / 2),  //纠正摄像机锚点位置
        // anchor:'bottom-center', // 设置锚点方位
      })
    },
    /**
     * 批量加载点数据,创建摄像机marker
     * @param list
     */
    pointsSetIn(list) {
      console.log(list, '摄像机点==>', this.cameraRenderer)
      const that = this

      if (list.length) {
        console.time('更新markers的js耗时')
        if (this.cameraRenderer === 'normal') {
          // 清空可能的海量点数据
          this.cameraMassMarks?.clear()

          // 加载普通点群数据
          renderMarkers(list)
        } else {
          // 清空可能的普通点数据
          this.currentMarkers?.clearOverlays()

          // 延时加载海量点数据(创造闪一下效果以忽略部分摄像机打点错位造成的视觉影响)
          setTimeout(() => {
            renderMassMarks(list)
          }, 50)
        }

        console.timeEnd('更新markers的js耗时')
      } else {
        if (this.cameraRenderer === 'normal') {
          this.currentMarkers?.clearOverlays() // 清空数据摄像机（用于之前缓慢请求带来的错误数据处理）
        } else {
          // 清空海量点数据
          this.cameraMassMarks?.clear()
        }
      }

      this.checkMark?.hide()
      AMapMarksDom?.classList?.remove?.('event-none')

      // 加载普通点群数据
      function renderMarkers(list) {
        const markerList = []

        for (let i = 0; i < list.length; i++) {
          //封装marker属性
          var data = list[i]
          data.onlineStatus =
            list[i].onlineStatus === null
              ? 0
              : list[i].onlineStatus
          // data.positionStatus = list[i].positionStatus === null ? 0 : list[i].positionStatus;
          data.classify =
            list[i].classify === null ? 0 : list[i].classify
          data.roadId = list[i].roadId || list[i].road
          data.position = [
            list[i].longitude,
            list[i].latitude
          ]
          const icon = that.getMarkerIcon(
            list[i].classify,
            list[i].onlineStatus
          )
          let marker = new AMap.Marker({
            position: data.position, //new AMap.LngLat(list[i].longitude,list[i].latitude),
            zIndex: that.mapZIndexConfig.markerzIndex,
            offset: new AMap.Pixel(
              -that.cameraIconWidth / 2,
              -that.cameraIconHeight / 2
            ),
            clickable: true,
            // draggable: true,
            icon: that.getMarkerIcon(
              list[i].positionStatus,
              list[i].onlineStatus,
              list[i].classify,
              list[i].hdStatus,
            ), //  groupStyleMap[list[i].onlineStatus === null ? '0' : list[i].onlineStatus],
            extData: data
          })
          // console.log(marker, "marker")
          marker._sjkCameraType = data.classify

          that.dragUpdata(marker)
          markerList.push(marker)
        }

        // 覆盖物群组直接修改数据替代map实例对覆盖物群组的增删操作
        if (!that.currentMarkers) {
          that.currentMarkers = new AMap.OverlayGroup(
            markerList
          )
          that.mapInstance.add(that.currentMarkers)
        } else {
          that.currentMarkers.clearOverlays()
          that.currentMarkers.addOverlays(markerList)
        }
      }
      // 加载海量点数据
      function renderMassMarks(list) {
        const camerasData = list.map(e => ({
          adsds: e,
          cameraNum: e.cameraNum,
          cameraType: e.cameraType,
          id: e.cameraId,
          lnglat: [e.longitude, e.latitude],
          style:
            // e.positionStatus == 1
            // ? 2
            // : e.onlineStatus == 1
            // ? 1
            // : 0
            e.hdStatus == 1 ? 3: e.positionStatus == 1 ? 2 : e.onlineStatus == 1 ? 1 : 0
        }))
        if (that.cameraMassMarks) {
          that.cameraMassMarks.setData(camerasData)
          that.cameraMassMarks.show()
        } else {
          const options = {
            style: [
              {
                /* 下标 0 为离线样式 */ anchor: new AMap.Pixel(
                  7,
                  7
                ),
                cursor: 'pointer',
                opacity: 1,
                size: new AMap.Size(14, 14),
                url: that.cameraOfflineImgUrl['1']
              },
              {
                /* 下标 1 为在线样式 */ anchor: new AMap.Pixel(
                  7,
                  7
                ),
                cursor: 'pointer',
                opacity: 1,
                size: new AMap.Size(14, 14),
                url: that.cameraImgUrl['1']
              },
              {
                /* 下标 2 为复位失败样式 */ anchor: new AMap.Pixel(
                  7,
                  7
                ),
                cursor: 'pointer',
                opacity: 1,
                size: new AMap.Size(14, 14),
                url: that.cameraErrorImgUrl['1']
              } ,
              {
                /* 下标 1 为在线样式 */ anchor: new AMap.Pixel(
                  7,
                  7
                ),
                cursor: 'pointer',
                opacity: 1,
                size: new AMap.Size(14, 14),
                url: that.cameraHighImg['1']
              }
            ],
            zIndex: 222
          }
          that.cameraMassMarks = new AMap.MassMarks(
            camerasData,
            options
          )
          that.cameraMassMarks.setMap(that.mapInstance)
          // 左击marker点
          that.cameraMassMarks.on('click', e => {
            that.cameraInfoWindowShow(e)
            !that.checkMark && that.createCheckMark()
            that.checkMark.setPosition(e.data.lnglat)
            that.checkMark.show()
          })
        }
      }
    },
   // 清空摄像机点
   emptyCameraDot(){
    if (this.cameraRenderer === 'normal') {
      this.currentMarkers?.clearOverlays() // 清空数据摄像机（用于之前缓慢请求带来的错误数据处理）
    } else {
      // 清空海量点数据
      this.cameraMassMarks?.clear()
    }
  },
    //获取本地桩号
    loadMapMile() {
      //查询桩号数据，并加载
      let _this = this
      axios
        .get('./js/mile.json')
        .then(res => {
          this.$store.commit('poles/setAllData', res.data)
          this.loadMileMarker(res.data)
        })
        .catch(() => {
          var mymap = _this.mapInstance
          var bounds = mymap.getBounds()
          //调用查询桩号api
          _this
            .getMileageList({
              mapLevel: this.currentMapZoom,
              northEast: bounds.northeast.toString(),
              southWest: bounds.southwest.toString(),
              province: 32
            })
            .then(res => {
              window.setTimeout(function() {
                //加载桩号集合
                _this.loadMileMarker(res.data)
              }, 10)
            })
        })
    },

    //加载桩号marker
    loadMileMarker(mileageList) {
      console.log(
        mileageList[1],
        mileageList.length,
        '桩号==>'
      )
      var that = this
      console.time('桩号js耗时')
      AMapUI.load(
        ['ui/misc/PointSimplifier', 'lib/$'],
        function(PointSimplifier) {
          if (!PointSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！')
            return
          }
          const kilometer = [],
            hectometer = []
          for (let i = 0; i < mileageList.length; i++) {
            const m = mileageList[i]
            if (
              m.roadStr &&
              m.roadStr.indexOf('+000') > 0
            ) {
              kilometer.push(m)
            } else {
              hectometer.push(m)
            }
          }
          that.$store.commit(
            'poles/setHectometerData',
            hectometer
          )
          that.$store.commit(
            'poles/setKilometerData',
            kilometer
          )

          function onIconLoad() {
            that.milePointFier.renderLater()
          }

          function onIconError(e) {
            console.log('load img err', e)
          }
          var mimg = {}
          for (var k in that.mileImg) {
            mimg[
              k
            ] = PointSimplifier.Render.Canvas.getImageContent(
              that.mileImg[k],
              onIconLoad,
              onIconError
            )
          }

          const createSimper = () =>
            new PointSimplifier({
              map: that.mapInstance, //所属的地图实例
              autoSetFitView: false,
              getPosition: function(item) {
                if (!item) {
                  return null
                }
                //返回经纬度
                return [item.longitude, item.latitude]
              },
              getHoverTitle: function(it) {
                return `${it.roadStr}`
              },

              //使用GroupStyleRender
              renderConstructor:
                PointSimplifier.Render.Canvas
                  .GroupStyleRender,
              renderOptions: {
                //鼠标hover时的title信息
                hoverTitleStyle: {
                  position: 'top'
                },
                getGroupId: function(item) {
                  var rm =
                    item.roadStr.indexOf('+') < 0
                      ? 0
                      : parseInt(
                          item.roadStr.substr(
                            item.roadStr.indexOf('+')
                          )
                        ) / 100
                  return rm + ''
                },
                groupStyleOptions: function(gId) {
                  return {
                    pointStyle: {
                      //绘制点占据的矩形区域
                      content: mimg[gId],
                      //宽度
                      width: gId == 0 ? 24 : 14,
                      fillStyle: null,
                      //高度
                      height: 14,
                      //定位点为中心
                      offset: ['-50%', '-50%']
                    },
                    // hover时候框样式
                    pointHoverStyle: {
                      content: gId == 0 ? 'rect' : 'circle',
                      strokeStyle: '#ffa500',
                      height: 16,
                      width: gId == 0 ? 26 : 16
                    }
                  }
                }
              }
            })

          // 千米桩
          that.milestoneSimplifier.kilometer = createSimper()
          that.milestoneSimplifier.kilometer.setData(
            kilometer
          )
          that.milestoneSimplifier.kilometer.hide()

          // 所有桩
          that.milestoneSimplifier.all = createSimper()
          that.milestoneSimplifier.all.setData(mileageList)
          that.milestoneSimplifier.all.hide()

          if (that.mileIsShow) {
            that.milePointFier.show()
          } else {
            that.milePointFier.hide()
          }
        }
      )
      console.timeEnd('桩号js耗时')
    },

    //桩号显示事件
    mileShow(mileIsShow) {
      // 公里桩加载或渲染失败给予提示
      if (!this.milePointFier) {
        this.$message.error(
          '公里桩相关文件加载失败请刷新页面后重试此功能'
        )
        return
      }

      console.log(mileIsShow, 'mileIsShow')
      this.mileIsShow = mileIsShow
      if (mileIsShow) {
        this.milePointFier?.show()
      } else {
        this.milePointFier?.hide()
      }
      // console.log(this.mileIsShow,'mile is show')
    },

    /**
     * 根据区块Hover状态设置相关样式
     */
    toggleHoverFeature(feature, isHover, position) {
      // console.log('toggleHoverFeature',feature,position)
      if (!feature) {
        return
      }
      var props = feature.properties

      //更新相关多边形的样式
      var polys = this.districtExplorer.findFeaturePolygonsByAdcode(
        props.adcode
      )
      for (var i = 0, len = polys.length; i < len; i++) {
        polys[i].setOptions({
          // 选中区域边框颜色
          strokeColor: isHover ? '#0e397c' : '#0e397c',
          fillColor: isHover ? '#0e397c' : '#0d4692',
          //fillOpacity: isHover ? 0.5 : 1
          zIndex: isHover
            ? this.mapZIndexConfig.featureZIndex + 1
            : this.mapZIndexConfig.featureZIndex
        })
      }
    },

    /**
     * 切换显示区域
     */
    switch2AreaNode(adcode, upOrganizationid, callback) {
      console.log('切换显示区域 switch2AreaNode()', adcode)
      if (
        this.currentAreaNode &&
        '' + this.currentAreaNode.getAdcode() ===
          '' + adcode
      ) {
        return
      }
      let that = this
      this.loadAreaNode(adcode, function(error, areaNode) {
        if (error) {
          if (callback) {
            callback(error)
          }
          return
        }
        console.log('switcharea areaNode', areaNode)
        that.currentAreaNode = areaNode //this.currentAreaNodeBack =
        that.upOrganizationid = upOrganizationid

        //设置当前使用的定位用节点
        that.districtExplorer.setAreaNodesForLocating([
          that.currentAreaNode
        ])

        that.refreshAreaNode(areaNode)
        if (callback) {
          callback(null, areaNode)
        }
      })
    },

    /**
     * 加载区域
     */
    loadAreaNode(adcode, callback) {
      let _this = this
      this.districtExplorer.loadAreaNode(adcode, function(
        error,
        areaNode
      ) {
        if (error) {
          if (callback) {
            callback(error)
          }
        } else if (callback) {
          callback(null, areaNode)
        }
      })
    },

    /**
     * 切换区域后刷新显示内容
     */
    refreshAreaNode(areaNode) {
      console.log(areaNode, '切换区域的code')
      this.districtExplorer.setHoverFeature(null)
      //更新地图视野
      this.mapInstance.setBounds(areaNode.getBounds())
    },

    /**
     * 鼠标hover，显示对应区块
     *
     * @param adcode
     */
    districtHover(adcode) {
      this.districtExplorer.setHoverFeature(
        this.currentAreaNode.getSubFeatureByAdcode(adcode)
      )
    },

    /**
     * 关闭播放器
     */
    cameraInfoWindowClose() {
      this.cameraMarkVisable = false
      this.currentPlayCamera = {}
    },

    /**
     * 打开播放器
     * @param record
     */
    cameraInfoWindowShow(record) {
      if (record && record.data) {
        this.cameraMarkVisable = true

        this.$refs.amapPlayer.onPlayerDialog()
        //获取播放地址
        this.$refs.amapPlayer.getVideoUrlToPlay(record.data)
      }
    },
    /**
     * marker标记点击效果
     * @param data
     * @param flag      true    播放状态添加
     *                  false   右击修改状态添加
     */
    addEventMarker(obj, flag = false) {
      // console.log("addEventMarker!!!!!!!!!!!!!!!!!!!!!!!!", obj)
      const that = this,
        data = obj.target.getExtData()
      console.log(data, data.classify, 'mark data')
      if (!data) {
        return false
      }

      const position = obj.target.getPosition()

      this.checkMark.setPosition(position)
      this.checkMark.show()

      if (!flag) {
        //调用AmapPlayerDialog子组件方法，展示修改弹窗
        this.$refs.amapPlayer.cameraInfoAlongEditVisable = true
        this.$refs.amapPlayer.setCameraInfoAlongForm({
          data,
          orgin: obj.originEvent
        })
      }
    },

    // 单个摄像机层级更改触发
    reloadMapDataContent(markZoom) {
      console.log(markZoom, 'markZoom摄像机图层')
      // this.$emit("amap-changed", val);

      if (markZoom > this.currentMapZoom) {
        // 如果marker层级更高则不显示
        this.curActMarker?.hide()
        this.checkMark?.hide()
      } else {
        this.curActMarker?.show()
        this.checkMark?.show()
      }
      this.curActMarker.setExtData({
        ...this.curActMarker.getExtData(),
        zoomLevel: markZoom
      })
    },

    cameraClassify(param) {
      //执行traffic-map cameraTypeSelectClick 方法
      this.call_parent('cameraTypeSelectClick', param)
    },
    call(obj) {
      // console.log(`call back event: ${obj.event} param: ${obj.param}`)
      if (obj.event) {
        this[obj.event](obj.param)
      }
    },
    /**调用上级方法 */
    call_parent(method, param) {
      // console.log('invoke trffic-map method: ',method)
      this.$emit('invokeEvent', {
        method: method,
        param: param
      })
    },
    setVideoIcon(img) {
      let that = this
      return new AMap.Icon({
        // 状态图片
        image: img,
        size: new AMap.Size(
          that.cameraIconWidth,
          that.cameraIconHeight
        ), // 图标尺寸
        imageSize: new AMap.Size(
          that.cameraIconWidth,
          that.cameraIconHeight
        ) // 根据所设置的大小拉伸或压缩图片
      })
    },

    // 拖拽更新摄像机经纬度
    dragUpdata(marker) {
      const that = this,
        flag = true,
        markData = marker.getExtData(),
        selfIcon = marker.getIcon()
      marker.sjk_selfIcon = selfIcon
      let timeout
      const dragstartHandler = e => {
        if (
          that.lastDragMarker &&
          that.lastDragMarker !== marker
        ) {
          // 如果最后操作marker有值且与当前操作marker不等
          that.lastDragMarker.setIcon(
            that.lastDragMarker.sjk_selfIcon
          )
        }
        that.lastDragMarker = marker

        // 临时移除点击事件
        marker.off('click', clickHandler)

        // 关闭可能的右键弹窗
        that.$refs.amapPlayer.cameraInfoAlongEditVisable = false
      }
      const dragendHandler = e => {
        // 拖拽完成事件
        console.log('拖拽完成了')
        // marker.setDraggable(false)

        /* 更新摄像机位置 */
        const lnglat = marker.getPosition()
        that.$refs.amapPlayer.updateCameraLnglatForm({
          position: {
            lon: lnglat.lng,
            lat: lnglat.lat
          },
          flag
        })
        let params = {
          cameraId: markData.cameraId,
          longitude: lnglat.lng,
          latitude: lnglat.lat
        }
        markData.longitude = params.longitude
        markData.latitude = params.latitude
        markData.position = e.lnglat
        api.updateLonAndLat(params).then(res => {
          if (res.code == 200) {
            that.$message.success('摄像机经纬度更新成功')
          } else {
            that.$message.error({
              message: res.message,
              type: 'error'
            })
          }
        })

        setTimeout(() => {
          marker.on('click', clickHandler)
        }, 0)
      }
      const clickHandler = e => {
        console.log('marker.click单击触发')

        clearTimeout(timeout)

        // 还原拖拽导致可能改变了的图标
        marker.setIcon(selfIcon)

        // 禁止直接拖拽
        marker.setDraggable(false)

        if (!that.checkMark) {
          //创建标记操作的摄像机点
          that.createCheckMark()
        }

        //子组件右击编辑窗口开启状态下，点击播放视频失效
        if (
          that.$refs.amapPlayer.cameraInfoAlongEditVisable
        ) {
          that.$message({
            message: '请关闭修改窗口',
            type: 'warning'
          })
          return
        }
        that.setSelectCameraIndex(0)
        let cameraInfo = e.target.getExtData()
        that.checkMark.setPosition(marker.getPosition())
        that.checkMark.show()
        
        that.cameraInfoWindowShow({
          data: cameraInfo
        })

        that.curActMarker = marker
      }

      // 按下事件
      marker.on('mousedown', e => {
        if (
          e.originEvent.button === 0 &&
          !that.$refs.amapPlayer.visible &&
          !marker.getDraggable()
        ) {
          // 如果左键按下 (左键 0 右键 2)
          marker.setIcon(selfIcon)
          // 延时500ms后启动拖拽效果
          timeout = setTimeout(() => {
            console.log('鼠标按下1000ms了 可拖拽')
            marker === that.curActMarker &&
              that.checkMark?.hide()
            marker.setDraggable(true)
            marker.setIcon(that.dragIcon)
            marker.on('dragstart', dragstartHandler)
            marker.on('dragend', dragendHandler)

            if (
              that.lastDragMarker &&
              that.lastDragMarker !== marker
            ) {
              /* 如果最后操作marker有值且与当前操作marker不等 */
              that.lastDragMarker.setDraggable(false)
              that.lastDragMarker.setIcon(
                that.lastDragMarker.sjk_selfIcon
              )
            }
          }, 1000)
        }
      })

      // 单击事件
      marker.on('click', clickHandler)

      // 摄像机图标右击事件
      marker.on('rightclick', function(a) {
        console.log('marker 右击 a', a)

        //子组件单机视频窗口开启状态下，右键弹窗失效
        if (that.$refs.amapPlayer.visible) {
          that.$message({
            message: '请先关闭视频弹窗',
            type: 'warning'
          })
          return
        }

        clearTimeout(timeout)
        // 还原拖拽导致可能改变了的图标
        marker.setIcon(selfIcon)
        marker.setDraggable(false)

        if (!that.checkMark) {
          //创建标记操作的摄像机点
          that.createCheckMark()
        }

        that.addEventMarker(a)

        // that.removeMarker(that.delMark)
        // 右击赋值当前摄像机为当前操作摄像机
        that.curActMarker = marker
        that.currentMarkerZoom = marker.getExtData().zoomLevel
      })
    },

    resetCameraPosition(obj) {
      // console.log('reset cam pos', obj)
      this.$emit('amap-changed')
    },
    /**
     * 移除marker标记
     * @param flag  marker数据
     */
    removeMarker(flag) {
      if (!flag) return

      this.mapInstance.remove(flag)
    },
    removeOffMarker() {
      console.log('父')
      this.mapInstance.remove(this.delMark)
    },
    loadDefaultAmapEvent() {},
    //选择区域
    selectArea(adcode, e = null) {
      console.log(e, '选择区域', adcode)
      e && this.$root.$emit('clickAreaMap', adcode)
      clearTimeout(window.setMapTimeout)
      window.setMapTimeout = null

      var _this = this
      this.districtExplorer.loadAreaNode(
        adcode,
        (error, areaNode) => {
          // 更新this.currentAreaNode
          if (error) return

          this.currentAreaNode = areaNode
          if (
            !this.jsBounds &&
            areaNode.adcode === 320000
          ) {
            this.jsBounds = areaNode.getBounds()
          }
          this.currentAreaNode.adcode = adcode

          // 清空并重绘区域
          this.districtExplorer?.clearFeaturePolygons() // 清除已有的绘制内容（之前选择的省区域）
          this.districtExplorer.renderParentFeature(
            areaNode,
            {
              cursor: 'default',
              bubble: true, // 事件冒泡
              strokeColor: '#00c0ff', //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 3, //线宽
              fillColor: '#00c0ff', //填充色
              fillOpacity: 0.2, //填充透明度
              zIndex: _this.mapZIndexConfig.featureZIndex
            }
          )

          // 更新地图视野以适合区划面
          this.mapInstance.setFitView(
            this.districtExplorer.getAllFeaturePolygons()
          )
        }
      )
      this.currentMarkers?.clearOverlays() // 清空数据摄像机
      this.cameraMassMarks?.clear() // 清空可能的海量点摄像机

      this.lastFeatureCode = this.curFeatureCode = adcode

      this.$emit('amap-changed', adcode)
      this.$emit('tabArea', adcode)

      /* 隐藏可能的类型区域点标记 */
      for (const key in this.serviceAreaMassMarkers) {
        // 服务区隐藏
        this.serviceAreaMassMarkers[key].hide?.()
      }
      for (const key in this.tollStationMassMarkers) {
        // 收费站隐藏
        this.tollStationMassMarkers[key].hide?.()
      }

      /* 隐藏可能的桩 */
      this.milestoneSimplifier.kilometer?.hide?.()
      this.milestoneSimplifier.all?.hide?.()

      // 隐藏播放器
      this.cameraMarkVisable = false
    },

    /* 清除选区(首页按钮) */
    clearSelectAreaMap() {
      clearTimeout(window.setMapTimeout)
      window.setMapTimeout = null

      this.districtExplorer?.clearFeaturePolygons() // 清除已有的绘制内容（之前选择的省区域）
      this.currentAreaNode &&
        (this.currentAreaNode.adcode = 100000)
      this.checkMark?.hide() // 清除可能的选择标记

      // 地图返回中心位置和指定层级
      // this.mapInstance.setZoomAndCenter(4, [105.397428, 37.90923])
      this.mapInstance.panTo([105.397428, 37.90923])
      this.mapInstance.setZoom(4)
      this.lastFeature = {
        properties: {
          adcode: 100000
        }
      }
      this.mapChanged({})

      /* 隐藏可能的类型区域点标记 */
      for (const key in this.serviceAreaMassMarkers) {
        // 服务区隐藏
        this.serviceAreaMassMarkers[key].hide?.()
      }
      for (const key in this.tollStationMassMarkers) {
        // 收费站隐藏
        this.tollStationMassMarkers[key].hide?.()
      }

      /* 隐藏可能的桩 */
      this.milestoneSimplifier.kilometer?.hide?.()
      this.milestoneSimplifier.all?.hide?.()
    },

    //创建标记操作的摄像机点
    createCheckMark() {
      this.checkMark = new AMap.Marker({
        map: this.mapInstance,
        draggable: false, // 是否可以拖拽
        zIndex: this.mapZIndexConfig.markerzIndex + 1,
        icon: new AMap.Icon({
          // 状态图片
          image: this.cameraGifUrl[1],
          size: new AMap.Size(
            this.cameraIconWidth,
            this.cameraIconHeight
          ), // 图标尺寸
          imageSize: new AMap.Size(
            this.cameraIconWidth,
            this.cameraIconHeight
          ) // 根据所设置的大小拉伸或压缩图片
        }),
        offset: new AMap.Pixel(
          -this.cameraIconWidth / 2,
          -this.cameraIconHeight / 2
        )
      })
      if (AMapMarksDom) {
        // 监听给这个特殊marker的dom设置css
        const config = {
          childList: true
        }
        const _this = this
        const callback = (mutationsList, observer) => {
          for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const dom = _this.checkMark.getContentDom()
              console.log(
                'A child node has been added or removed.',
                dom
              )
              console.log('observer', observer)
              if (dom) {
                dom.classList?.add?.('event-none')
              } else {
                setTimeout(() => {
                  _this.checkMark
                    .getContentDom()
                    .classList?.add?.('event-none')
                }, 500)
              }
              observer.disconnect()
            }
          }
        }
        const observer = new MutationObserver(callback)
        observer.observe(AMapMarksDom, config)
      }
    },

    // 显示区域类型点markers
    showAreaTypeMarkers(areaType) {
      const regionCode =
        this.currentAreaNode?.adcode || 320000
      if (this[`${areaType}MassMarkers`][regionCode]) {
        // 直接操作显示
        this[`${areaType}MassMarkers`][regionCode].show()
      } else {
        this.drawAreaTypeMarkers(areaType)
      }

      this.checkMark?.hide()
      // 可能的摄像机隐藏
      this.toggleShowCurCameras(false)
    },

    // 隐藏区域类型点markers
    hideAreaTypeMarkers(areaType) {
      const regionCode =
        this.currentAreaNode?.adcode || 320000
      this[`${areaType}MassMarkers`][regionCode]?.hide()

      this.checkMark?.hide()
    },

    // 绘制区域类型点markers
    drawAreaTypeMarkers(areaType) {
      const regionCode =
        this.currentAreaNode?.adcode || 320000
      if (!this[`${areaType}Data`][regionCode]) {
        return
      }

      // 对应区域点群对象和100000对象(全国所有)判断创建
      const atmmStr = `${areaType}MassMarkers`
      this[atmmStr][regionCode] = new AMap.MassMarks(
        this[`${areaType}Data`][regionCode],
        {
          style: [
            {
              /* 下标 0 为离线样式 */
              anchor: new AMap.Pixel(10, 10),
              cursor: 'pointer',
              opacity: 1,
              size: new AMap.Size(20, 20),
              url: this.areaImgs[areaType].offline
            },
            {
              /* 下标 1 为在线样式 */
              anchor: new AMap.Pixel(10, 10),
              cursor: 'pointer',
              opacity: 1,
              size: new AMap.Size(20, 20),
              url: this.areaImgs[areaType].online
            }
          ],
          zIndex: 111
        }
      )

      // 海量点添加事件
      this[atmmStr][regionCode].on(
        'mouseover',
        ({ data }) => {
          this.areaTypeInfoMarker.setPosition(data.lnglat)
          this.areaTypeInfoMarker.setLabel({
            content: data.name
          })
          this.areaTypeInfoMarker.show()
        }
      )
      this[atmmStr][regionCode].on('mouseout', () => {
        this.areaTypeInfoMarker.hide()
      })
      this[atmmStr][regionCode].on(
        'dblclick',
        ({ data }) => {
          if (data.abuttingStatus) {
            this.areaTypeInfoMarker.hide()
            const { lng, lat } = data.lnglat
            this.mapInstance.setZoomAndCenter(
              18,
              new AMap.LngLat(lng, lat)
            )
          }
        }
      )
      this[atmmStr][regionCode].setMap(this.mapInstance)
    },

    // 显隐当前摄像机
    toggleShowCurCameras(isShow = true) {
      if (isShow) {
        this.cameraRenderer === 'normal'
          ? this.currentMarkers?.show()
          : this.cameraMassMarks?.show()
      } else {
        this.cameraRenderer === 'normal'
          ? this.currentMarkers?.hide()
          : this.cameraMassMarks?.hide()
      }
    }
  }
}
