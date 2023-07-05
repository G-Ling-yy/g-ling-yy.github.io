<template>
  <div class="traffic-map-box">
    <div class="loading" v-if="loading">地图载入中···</div>
    <div id="baidu-container"></div>
    <div class="ctrls-wrapper">
      <div class="zoom">{{ zoom || 12 }}</div>
    </div>

    <amap-player-dialog
      ref="playerDialog"
      :visible.sync="isPlayerDialogShow"
    />
  </div>
</template>

<style lang="less" scoped>
.traffic-map-box {
  .loading {
    color: #fff;
    font-size: 3rem;
    height: 0;
    line-height: 15rem;
    text-align: center;
  }

  #baidu-container {
    background-color: rgba(243, 241, 236, 0.7) !important;
    height: 100%;
    overflow: hidden;
    width: 100%;
  }

  .ctrls-wrapper {
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 11;

    .zoom {
      background: linear-gradient(
        #0989b2,
        #0b345f,
        #084d96
      );
      border-radius: 4px;
      bottom: 40px;
      color: #fff;
      font-size: 16px;
      height: 28px;
      line-height: 28px;
      padding: 0 5px;
      position: absolute;
      right: 20px;
      text-align: center;
      min-width: 28px;
    }
  }
}
</style>

<script>
import polesMixin from './mixin/poles' // 桩
import camerasMixin from './mixin/cameras' // 摄像机
import areaTypesMixin from './mixin/area-types' // 区域类型
import AmapPlayerDialog from '../AmapPlayerDialog' // 视频播放和菜单组件

// const styleId = '87aac4863d1aa7a99564adfbd79593d2'
export default {
  name: 'BMap',

  components: {
    AmapPlayerDialog
  },

  props: {
    mapStatus: {
      type: Object,
      default: () => ({
        isSatelliteMode: false, // 卫星模式
        zoom: 5.0 // 地图层级
      })
    }
  },

  mixins: [polesMixin, camerasMixin, areaTypesMixin],

  data() {
    return {
      loading: true, // 加载中提示显隐
      map: null, // 地图实例
      mapLayerTypes: {
        // 当前地图各图层状态
        trafficLayer: false, // 路况图层
        satellite: false // 卫星图层
      },
      trafficLayer: null, // 路况图层
      zoom: 12, // 当前层级
      markersDom: null, // 百度地图存放marker的div容器
      regionCode: 320000, // 所选区域code (初始默认江苏320000)
      icons: {
        /* 各类型icons */
        /* 摄像机图标 */
        online: null, // 在线
        offline: null, // 离线
        resetFailed: null, // 复位失败（优先级： offline > resetFailed > online）
        active: null, // 活动
        dragged: null, // 最后一个拖拽提示

        /* 区域类型图标 */
        serviceAreaOnline: null, // P服务区在线
        serviceAreaOffline: null, // P服务区离线
        tollStationOnline: null, // 收费站在线
        tollStationOffline: null, // 收费站离线
        highImg: null,//高清
      },
      // 更新markers数据
      updateMarkers: _.debounce(() => {
        if (this.zoom > 11) {
          /* 触发父组件更新摄像机 */
          this.$emit(
            'updateCameras',
            this.regionCode || 320000
          )
        }

        if (this.zoom > 17) {
          /* 更新类型区域点 */
          for (const areaTypeSwitch in this.$parent
            .areaTypeSwitches) {
            const areaType = areaTypeSwitch.replace(
              'Switch',
              ''
            )
            if (
              this.$parent.areaTypeSwitches[areaTypeSwitch]
            ) {
              this.showAreaTypeMarkers(areaType)
            } else {
              this.hideAreaTypeMarkers(areaType)
            }
          }
        }
      }, 900)
    }
  },

  watch: {
    zoom(nV, oV) {
      if (nV <= 11) {
        /* 如果层级不大于11则清空摄像机覆盖物 */
        // 清空地图覆盖物
        this.map?.clearOverlays()
      }

      if (nV < 17.5 && oV >= 17.5) {
        /* 层级由大缩放至不大于17.5跳转至高德地图 */
        this.$emit('tabMap', 'gaode')
      }
    }
  },

  mounted() {
    if (!window.BMapGL) {
      this.$message.warning('地图脚本下载失败请刷新重试')
      return
    }
    console.log('百度地图mounted()!!!!!')
    // 初始化地图
    this.map = new BMapGL.Map('baidu-container', {
      defaultCursor: 'default', // 初始鼠标样式
      minZoom: 12 // 最小层级
    })
    process.env.NODE_ENV === 'development' &&
      (window.baidu = this) // dev 调试用 随时删除

    // 设置中心点位和层级(BMapGL zoom7层及以上可右键拖改角度)
    this.map.centerAndZoom(
      new BMapGL.Point(105.397428, 37.90923),
      5
    )

    // 启用滚轮缩放（默认false）
    this.map.enableScrollWheelZoom()

    // 禁用双击放大
    this.map.disableDoubleClickZoom()

    // 设置地图样式
    // this.map.setMapStyleV2({
    //   styleId
    // })

    // 保存marker存放div容器
    this.markersDom = this.map.getPanes().markerMouseTarget

    // 地图完成   只要当地图层级图块完成加载时则触发此事件
    this.map.addEventListener(
      'tilesloaded',
      ({ type, target }) => {
        if (this.loading) {
          this.loading = false

          // 首次完成触发zoom赋值和获取摄像机数据 (this.map.dispatchEvent('zoomend')没用)
          this.zoom = Number(this.map.getZoom().toFixed(2))
        }
      }
    )

    // 地图缩放完成
    this.map.addEventListener(
      'zoomend',
      ({ type, target }) => {
        console.info('百度地图缩放完成')
        setTimeout(() => {
          // 因为在zoomend事件里即时拿到的zoom并不准
          this.zoom = Number(this.map.getZoom().toFixed(2))

          // 更新请求时取消marker的事件响应
          this.markersDom.style.pointerEvents = 'none'

          this.updateMarkers()
        }, 50)
      }
    )

    // 地图拖拽开始
    this.map.addEventListener(
      'dragstart',
      ({ type, target }) => {
        this.updateMarkers.cancel()
      }
    )

    // 地图拖拽完成
    this.map.addEventListener(
      'dragend',
      ({ type, target }) => {
        // 更新请求时取消marker的事件响应
        this.markersDom.style.pointerEvents = 'none'

        this.updateMarkers()
      }
    )

    // zoom初始赋值
    this.zoom = Number(this.map.getZoom().toFixed(2))

    // icons初始化
    this.initIcons()
  },

  activated() {
    // 向父组件传递当前组件图层状态（暂注，当前需求要从父组件拿状态数据来改变当前子组件）
    // for (let key in this.mapLayerTypes) {
    //   this.$emit('mapLayerTypeUpdate', key, this.mapLayerTypes[key])
    // }

    /* 从父组件拿状态数据来改变当前子组件 */
    console.log(
      'mapStatus',
      this.mapStatus,
      this.mapStatus.zoom
    )

    // 更新regionCode
    this.regionCode = this.mapStatus.regionCode

    // 地图中心点
    const centerPoint = new BMapGL.Point(
      ...this.$gcoord.transform(
        this.mapStatus.center,
        'GCJ02',
        'BD09'
      )
    )
    // 地图中心点偏移
    const shiftCenterPoint = new BMapGL.Point(
      ...this.$gcoord.transform(
        [
          this.mapStatus.center[0] + 0.0000001,
          this.mapStatus.center[1] + 0.0000001
        ],
        'GCJ02',
        'BD09'
      )
    )

    // 延时时间（首次加载延时1500ms）
    const duration = this.loading ? 1500 : 100

    // 取消一开始可能触发的请求
    this.updateMarkers.cancel()

    setTimeout(() => {
      // 先移动到指定点附近以确定触发地图的move (有时候首次加载直接到指定点而不触发move)
      this.map.centerAndZoom(
        shiftCenterPoint,
        this.mapStatus.zoom
      )
      this.zoom = this.mapStatus.zoom
      this.updateMarkers.cancel()

      // 可能的改变卫星模式(只要进入百度就是默认开启卫星)
      this.map.addEventListener(
        'moveend',
        this.tabMapTypeAfterMoveend
      )

      setTimeout(() => {
        // 改变子组件地图中心和层级
        this.map.centerAndZoom(
          centerPoint,
          this.mapStatus.zoom
        )
      }, duration)
    }, duration)
  },

  deactivated() {
    if (this.isPlayerDialogShow) {
      this.isPlayerDialogShow = false

      // 调其关闭按钮方法
      this.$refs.playerDialog.dialogClose()
    }
  },

  methods: {
    // icons初始化
    initIcons() {
      const size = new BMapGL.Size(16, 16)
      const areaTypeSize = new BMapGL.Size(20, 20)
      const areaTypeStrAry = [
        'serviceAreaOnline',
        'serviceAreaOffline'
      ]

      for (let key in this.icons) {
        const url = {
          online: require('@/assets/map/icon/newcamera1.png'),
          offline: require('@/assets/map/icon/newcamera2.png'),
          resetFailed: require('@/assets/map/icon/newcamera3.png'),
          active: require('@/assets/map/icon/actCam.gif'),
          dragged: require('@/assets/map/icon/selectedCamera.png'),
          serviceAreaOnline: require('@/assets/map/icon/service_area_online.png'),
          serviceAreaOffline: require('@/assets/map/icon/service_area_offline.png'),
          tollStationOnline: require('@/assets/map/icon/toll_station_online.png'),
          tollStationOffline: require('@/assets/map/icon/toll_station_offline.png'),
          highImg: require('@/assets/map/icon/cameraHigh.png'),
        }[key]

        this.icons[key] = new BMapGL.Icon(
          url,
          areaTypeStrAry.includes(key)
            ? areaTypeSize
            : size,
          {}
        )
      }
    },

    // 切换地图图层类型
    tabMapLayerType(type, isShow) {
      if (type === 'satellite') {
        // 切换卫星图与否
        isShow
          ? this.map.setMapType(BMAP_EARTH_MAP)
          : this.map.setMapType(BMAPGL_NORMAL_MAP)
      } else if (type === 'trafficLayer') {
        // 切换路况与否
        // this.trafficLayer === null &&
        //   (this.trafficLayer = new BMap.TrafficLayer())
        // isShow
        //   ? this.map.addTileLayer(this.trafficLayer)
        //   : this.map.removeTileLayer(this.trafficLayer)

        isShow
          ? this.map.setTrafficOn()
          : this.map.setTrafficOff()
      }

      this.mapLayerTypes[type] = isShow
      this.$emit('mapLayerTypeUpdate', type, isShow)
    },

    // 地图移动完成后执行切换地图类型
    tabMapTypeAfterMoveend() {
      console.warn(
        '这是切换地图的时候可能触发的一次性的函数，如果出现多次就bug了！！！'
      )
      if (!this.mapLayerTypes.satellite) {
        setTimeout(() => {
          this.tabMapLayerType('satellite', true)
        }, 100)
      }
      this.map.removeEventListener(
        'moveend',
        this.tabMapTypeAfterMoveend
      )
    }
  }
}
</script>
