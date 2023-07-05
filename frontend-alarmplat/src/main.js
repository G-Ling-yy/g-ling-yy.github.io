import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import './permissions'
import Icon from '@/components/base/Icon'

// import dayjs from 'dayjs'
// import * as mcharts from 'echarts'
// import webIm from '@/components/base/microvideo-im/index'
// import MvVue3Map from '@/components/base/microvideo-vue3-map'

// mv-map 引入
import MvMap from 'microvideo-map'
// mv-map 相关配置
const mvMapConfig = {
    // mapIconConfig 地图打点图标配置
    mapIconConfig: [1, 2, 3]
      .map(e => ({
        name: `icon-alarm-${e}`,
        url: require(`@images/mv-map/alarm_icon_${e}.png`)
      }))
      .concat(
        [1, 2, 3].map(e => ({
          name: `icon-alarm-0${e}`,
          url: require(`@images/mv-map/alarm_icon_0${e}.png`)
        }))
      )
      .concat([
        {
          name: 'icon-poc', // 地图poc标记
          url: require('@images/mv-map/poc_icon.png') // 图标地址
        }
      ])
  },
  { mapIconConfig } = mvMapConfig

/**
 * @description 测试环境默认使用mock，如果不需要请注释
 */
// const { mockXHR } = require('@/utils/static')
// mockXHR()

// 统一全屏、退出接口和获取、判断全屏dom
document.requestFullscreen = (
  dom = document.documentElement
) =>
  (
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullScreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen
  ).call(dom)
document.exitFullscreen =
  document.exitFullscreen ||
  document.webkitExitFullscreen ||
  document.mozCancelFullScreen ||
  document.msExitFullscreen
document.getFullscreenElement = () =>
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullScreenElement ||
  document.webkitFullscreenElement ||
  null

const app = createApp(App)
// 全局挂载组件/库
app.component('Icon', Icon)

// vue3 给原型上挂载属性
// app.config.globalProperties.$mcharts = mcharts
// app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$gcoord = gcoord
delete window.gcoord

// app
// .use(webIm, {
//   // 环信应用appkey 腾讯应用appid 环信测试key  1139211024231272#lxs
//   key: '1139211024231272#lxs',
//   // easemob-web 环信Web
//   // easemob-xcx 环信小程序
//   // tencent-web 腾讯Web
//   // tencent-xcx 腾讯小程序
//   type: 'easemob-web',
//   baseUrl: 'http://192.168.10.104:9001/gdim'
// })
// .use(MvVue3Map, {
//   fetchConfig: {
//     baseUrl: 'http://127.0.0.1:4523/mock/468726'
//   },
//   // 已集成深色'dark'和浅色'normal'主题，如果不选择默认显示'normal'。如果有themeConfig属性，优先themeConfig属性的主题配置。
//   themeType: 'dark'
// })

// console.log(app.config.globalProperties, 'app 入口mian')
app
  .use(store)
  .use(router)
  .use(Antd)
  .use(MvMap, {
    /*
    initMapConfig 地图初始化配置参数

    initMapConfig:{
      key               地图 AppKey
      v                 地图版本号    可选：1.4.15（默认），2.0
      uiVersion         地图版本对应的UI组件版本号  默认 - 1.1
      securityJsCode    地图安全密钥(自定义地图样式使用)
      plugin            地图所需插件
    }
    */
    /*
    mapUIConfig 地图AMapUI配置

    mapUIConfig: {
      MvMapPointSimplifier: 'ui/misc/PointSimplifier', //海量点
      MvMapPathSimplifier: 'ui/misc/PathSimplifier', //路线
      MvMapSimpleMarker: 'ui/overlay/SimpleMarker', //单个标记点
      MvMapSimpleMarkers: 'ui/misc/MarkerList', //多个标记点
      MvMapSimpleInfoWindow: 'ui/overlay/SimpleInfoWindow' //弹框
    }

    */

    // mapIconConfig 地图打点图标配置
    mapIconConfig
  })
  .mount('#app')
