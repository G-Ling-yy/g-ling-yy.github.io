<template>
  <div class="map-container">
    <div :id="id" class="map"></div>
    <slot></slot>
    <div v-if="mMap && top && top.length" class="p-top">
      <mv-icon v-for="(item, index) in top" :ref="`mapIcon-${item.id}`" :class="item.class || `button${index}`" :icon-config="item.buttonType" :key="item.id ? item.id : `top` + index" @hanlder="hanlder(item)" :iconItem="item" :mapConfig="mapConfig" />
    </div>
    <!-- 切换按钮 -->
    <div v-if="mMap" class="menu-icon" @click="changeShowBtn">
      <img :src="changeBtn" />
    </div>
    <div v-if="mMap && left && left.length" class="p-left" v-show="isShowBtn" :style="`height:${left.length * 6.3}vh`">
      <mv-icon v-for="(item, index) in left" :ref="`mapIcon-${item.id}`" :class="item.class || `button${index}`" :icon-config="item.buttonType" :key="item.id ? item.id : `left` + index" @hanlder="hanlder(item)" :iconItem="item" :mapConfig="mapConfig" />
    </div>
    <div v-if="mMap && bottom && bottom.length" class="p-bottom" v-show="isShowBtn">
      <mv-icon v-for="(item, index) in bottom" :ref="`mapIcon-${item.id}`" :class="item.class || `button${index}`" :icon-config="item.buttonType" :key="item.id ? item.id : `bottom` + index" @hanlder="hanlder(item)" :iconItem="item" :mapConfig="mapConfig" />
    </div>
  </div>
</template>

<script>
let loadPromise = null
import { defineComponent, getCurrentInstance, ref, onMounted } from 'vue'
// 引入四张图片切换
import img1 from '../static/images/map-layer/dark/img-open.png'
import img2 from '../static/images/map-layer/dark/img-close.png'
import img3 from '../static/images/map-layer/normal/img-open.png'
import img4 from '../static/images/map-layer/normal/img-close.png'
// 获取当前组件实例
import { createMapFunction } from '../config/map-sdk'
import { createBusinessSdk } from '../config/business-sdk'
import { lazyAMapApiLoaderInstance } from '../lib/init-map'
import MvIcon from './MvIcon'
export default {
  /**
   * @description     地图组件
   * @author          刘晖(liuh@microvideo.cn)
   * @time            2021/11/9 18:14
   * @updata          by smigoo:制作vue3.0版本地图组件
   */
  name: 'MMap',
  components: { MvIcon },
  setup() {
    const instance = getCurrentInstance()
    const root = ref(null)
    const { proxy, type } = getCurrentInstance()
    onMounted(() => {
      // DOM 元素将在初始渲染后分配给 ref
    })
    return {
      type,
      root
    }
  },
  props: {
    id: {
      default: () => 'map',
      type: String
    },
    eventType: {
      default: () => [],
      type: Array
    },
    top: {
      default: () => [],
      type: Array
    },
    left: {
      default: () => [],
      type: Array
    },
    bottom: {
      default: () => [],
      type: Array
    },
    mapConfig: Object
  },
  data() {
    return {
      isShowBtn: true,
      changeBtn: img1,
      theme: 'dark',
      showType: 'open',
      mMap: null,
      mMapUI: {},
      Vue: null,
      markers: null, // 地图遮罩实例：打点
      // 地图热力图实例
      heatMap: {
        data: null,
        markers: null
      },
      controls: null, // 控件实例
      contextMenu: null, //右键菜单
      imageLayer: null, // 图层实例
      pointSimplifierIns: null, // 海量点实例
      polyline: null // 折现实例
    }
  },
  methods: {
    changeShowBtn() {
      this.isShowBtn = !this.isShowBtn
    },
    /*
     * mapMark-打点切换
     */
    switchMapMark(item, param) {
      let markers = []
      if (item.isChecked) {
        markers = this.$mapFunction[item.eventType](param, (e, data) => {
          if (e.type === 'click' && item.onClick) {
            item.onClick(e, data)
          }
          if (e.type === 'mouseover' && item.mouseOver) {
            item.mouseOver(e, data)
          }
          if (e.type === 'mouseout' && item.mouseOut) {
            item.mouseOut(e, data)
          }
        })
        this.markers = this.markers && this.markers.length ? [...this.markers, ...markers] : markers
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        item.cancelEvent()
      } else {
        //  默认删除全部点
        this.$mapFunction.removeMark(this.markers)
      }
      return markers
    },
    /*
     * heatMap-热力图
     */
    switchHeatMap(item, param) {
      if (item.isChecked) {
        this.heatMap.data ? this.heatMap.data.show() : (this.heatMap.data = this.$mapFunction[item.eventType](param))
        // 为热力图添加点击事件
        if (param.points.length) {
          param.points.map((point, index) => {
            point.offset = new AMap.Pixel(0, 0)
            point.size = [30, 30]
            point.index = 200
            point.iconUrl = require(`../static/images/none.png`)
          })
        }
        const markers = this.$mapFunction.mapMark(param.points, (e, data) => {
          if (e.type === 'click' && item.onClick) {
            item.onClick(e, data)
          }
          if (e.type === 'mouseover' && item.mouseOver) {
            item.mouseOver(e, data)
          }
          if (e.type === 'mouseout' && item.mouseOut) {
            item.mouseOut(e, data)
          }
        })
        this.heatMap.markers = this.heatMap.markers && this.heatMap.markers.length ? [...this.heatMap.markers, ...markers] : markers
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        item.cancelEvent()
      } else {
        this.heatMap.data ? this.heatMap.data.hide() : (this.heatMap.data = null)
        this.$mapFunction.removeMark(this.heatMap.markers)
      }
      return this.heatMap
    },
    /*
     * mapControl-地图控件
     */
    async switchControl(item, param) {
      if (item.isChecked) {
        this.controls = await this.$mapFunction[item.eventType](param)
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        this.$mapFunction.hideControl(this.controls)
      }
      return this.controls
    },
    /*
     * mapRightClick-右键菜单
     */
    async switchRightClick(item, param) {
      if (item.isChecked) {
        this.contextMenu = this.$mapFunction.mapRightClick(param)
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        this.contextMenu = this.$mapFunction.mapRightClick(null)
      }
    },
    /*
     * markerCluster-聚合点
     */
    switchCluster(item, param) {
      if (item.isChecked) {
        this.cluster = []
        if (param && param.length) {
          param.forEach(item => {
            this.cluster.push(this.$mapFunction.markerCluster({ data: item.arr, color: item.color }))
          })
        }
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        // 待优化
        this.mMap.clearMap()
      }
    },
    /*
     * addLayer-创建图层
     */
    switchLayer(item, param) {
      if (item.isChecked) {
        this.imageLayer = this.$mapFunction.addLayer(param)
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        this.imageLayer.setMap(null)
      }
    },
    /*
     * massPointUI-海量点
     */
    async switchmassPointUI(item, param) {
      if (item.isChecked) {
        this.pointSimplifierIns = await this.$mapFunction.massPointUI(param, (e, data) => {
          if (e.type === 'pointClick' && item.onClick) {
            item.onClick(e, data)
          }
          if (e.type === 'pointMouseover' && item.mouseOver) {
            item.mouseOver(e, data)
          }
          if (e.type === 'pointMouseout' && item.mouseOut) {
            item.mouseOut(e, data)
          }
        })
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        this.$mapFunction.hideMassPoint(this.pointSimplifierIns)
        // console.log(this.mMap, this.mMap.getLayers(), 'this.mMap')
        // this.mMap.remove(this.mMap.getLayers()[this.mMap.getLayers().length - 1])
      }
      return this.pointSimplifierIns
    },
    /*
     * LimitBounds-设置范围
     */
    switchLimitBounds(item, param) {
      if (item.isChecked) {
        this.$mapFunction.limitBounds(param)
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        this.$mapFunction.clearLimitBounds()
      }
    },
    /*
     * MapStyle-设置地图样式
     */
    switchMapStyle(item, param) {
      this.$mapFunction.mapStyle(param, this.Vue.config.globalProperties)
    },
    /*
     * MapStyle-画线
     */
    switchLine(item, param) {
      if (item.isChecked) {
        this.polyline = this.$mapFunction.createLine(param, (e, data) => {
          if (e.type === 'click' && item.onClick) {
            item.onClick(e, data)
          }
          if (e.type === 'mouseover' && item.mouseOver) {
            item.mouseOver(e, data)
          }
          if (e.type === 'mouseout' && item.mouseOut) {
            item.mouseOut(e, data)
          }
        })
      } else if (item.cancelEvent && typeof item.cancelEvent === 'function') {
        console.log('当有自定义取消事件时执行自定义取消事件')
        item.cancelEvent()
      } else {
        this.$mapFunction.hideLine(this.polyline)
      }
      return this.polyline
    },
    async hanlder(item) {
      item.isChecked = !item.isChecked
      if (item.before) {
        await item.before(this.mMap)
      }
      // 方法所需参数
      let param = item.loadData ? item.loadData() : null
      // 为after准备的对象实例
      let instance = null
      // 判断是否为自定义事件
      if (typeof item.eventType === 'function') {
        await item.eventType()
      } else if (typeof item.eventType === 'string') {
        if (item.eventType === 'mapMark') {
          instance = await this.switchMapMark(item, param)
        } else if (item.eventType === 'heatMap') {
          instance = await this.switchHeatMap(item, param)
        } else if (item.eventType === 'mapControl') {
          instance = await this.switchControl(item, param)
        } else if (item.eventType === 'mapRightClick') {
          instance = await this.switchRightClick(item, param)
        } else if (item.eventType === 'markerCluster') {
          instance = await this.switchCluster(item, param)
        } else if (item.eventType === 'addLayer') {
          instance = await this.switchLayer(item, param)
        } else if (item.eventType === 'massPointUI') {
          instance = await this.switchmassPointUI(item, param)
        } else if (item.eventType === 'limitBounds') {
          instance = await this.switchLimitBounds(item, param)
        } else if (item.eventType === 'mapStyle') {
          instance = await this.switchMapStyle(item, param)
        } else if (item.eventType === 'createLine') {
          instance = await this.switchLine(item, param)
        } else if (item.eventType === 'removeMark') {
          this.$mapFunction[item.eventType](this.markers)
        } else {
          // 其他情况下
          instance = this.$mapFunction[item.eventType](param)
        }
      }
      if (item.after) {
        item.after(this.mMap, instance)
      }
    },

    /**
     * 创建地图
     */
    createMap() {
      this.loadPromise.then(() => {
        this.mMap = new AMap.Map(this.id, Object.assign(this.$defaultMapConfig, this.mapConfig))
        this.Vue.config.globalProperties.$mapFunction = createMapFunction(this.mMap, this.$defaultMapUIConfig, this.$mapIconConfig)
        this.Vue.config.globalProperties.$mapBusinessFunction = createBusinessSdk(this.mMap, this.$defaultMapUIConfig, this.$mapIconConfig)
        this.$emit('map-load', this.mMap)
      })
    }
  },
  watch: {
    'Vue.config.globalProperties.$businessIconConfig.theme': {
      handler(val) {
        if (val === 'normal' && this.isShowBtn) {
          this.changeBtn = img3
        } else if (val === 'normal' && !this.isShowBtn) {
          this.changeBtn = img4
        } else if ((!val || val === 'dark') && !this.isShowBtn) {
          this.changeBtn = img2
        } else {
          this.changeBtn = img1
        }
      },
      deep: true
    },
    isShowBtn(val) {
      let theme = this.Vue.config.globalProperties.$businessIconConfig.theme === 'normal' ? 'normal' : 'dark'
      if (val) {
        if (theme === 'normal') {
          this.changeBtn = img3
        } else {
          this.changeBtn = img1
        }
      } else {
        if (theme === 'normal') {
          this.changeBtn = img4
        } else {
          this.changeBtn = img2
        }
      }
    }
  },
  mounted() {
    this.Vue = this.type.Vue
    this.$nextTick(() => {
      this.createMap()
    })
  },
  beforeCreate() {
    /**
     * 初始化地图
     */
    this.loadPromise = lazyAMapApiLoaderInstance.lazyMapLoad()
  },
  created() {}
}
</script>

<style lang="less">
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  .menu-icon {
    position: absolute;
    left: 0.6vw;
    bottom: 3vh;
    height: 6.4vh;
    width: 6.4vh;
    cursor: pointer;
    img {
      width: 6.4vh;
      height: 6.4vh;
      object-fit: cover;
    }
  }

  .map {
    width: 100%;
    height: 100%;
    position: absolute;
    /deep/ .amap-logo {
      display: none !important;
      visibility: hidden !important;
    }
    /deep/ .amap-copyright {
      display: none !important;
      visibility: hidden !important;
    }
  }
  .map-icon {
    position: relative;
    cursor: pointer;
    img {
      cursor: pointer;
      object-fit: cover;
      position: relative;
    }
    div {
      width: auto;
      height: 3.2vh;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: absolute;
      background: url('../static/images/map-layer/dark/tooltip.png');
      background-size: 100% 3.2vh;
      border-radius: 0;
      text-align: center;
      padding: 0.07rem 0.66rem;
      font-size: 1.2vh;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      font-style: italic;
      color: #00edff;
      line-height: 2.2vh;
      background-repeat: no-repeat;
      top: -2.6vh;
      z-index: 999;
    }
  }
  .p-top {
    position: absolute;
    z-index: 999;
    left: 0.6vw;
    top: 3vh;
    height: 6.4vh;
    display: flex;
    .map-icon {
      margin: 0px 1vh;
      height: 6.4vh;
      min-width: 6.4vh;
      &.map-icon-bg {
        background-size: 6vh 6vh;
        display: inline-block;
        background-repeat: no-repeat;
      }
      img {
        height: 100%;
        width: auto;
      }
    }
  }
  .p-left {
    position: absolute;
    z-index: 999;
    left: 0.6vw;
    bottom: 9.4vh;
    width: 6.4vh;
    // display: flex;
    .map-icon {
      height: auto;
      width: 6.4vh;
      margin-bottom: 1vh;
      &.map-icon-bg {
        background-size: 6.4vh;
        display: inline-block;
        background-repeat: no-repeat;
      }
      img {
        height: auto;
        width: 6.4vh;
      }
    }
  }
  .p-bottom {
    position: absolute;
    z-index: 999;
    left: 8vh;
    bottom: 3vh;
    height: 6vh;
    display: flex;
    .map-icon {
      margin: 0px 1vh;
      height: 6.4vh;
      min-width: 6.4vh;
      &.map-icon-bg {
        background-size: 6.4vh 6.4vh;
        display: inline-block;
        background-repeat: no-repeat;
      }
      img {
        height: 100%;
        min-width: 6.4vh;
      }
    }
  }
}
</style>
