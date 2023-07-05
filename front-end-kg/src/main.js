import Vue from 'vue'
import App from './App.vue'
// import AMap from 'vue-amap';
// import { lazyAMapApiLoaderInstance } from 'vue-amap';
// Vue.use(AMap);
import BASE_APP_CONFIG from './config'
import _ from 'lodash'
Vue.prototype.BASECONFIG = BASE_APP_CONFIG

/* 

挂载标记项目

默认 苏交控
nbtd 南部通道

 */
const isNbtd = process.env.VUE_APP_TARGET === 'nbtd' // 南部通道(开发兼生产环境)

Vue.prototype.BASETargetIsNbtd = isNbtd

import router from './router'
import api from './api'
import store from './store'
import directives from './directives'
//import $ from 'jquery'
import echarts from 'echarts'
//import './style/theme/index.css'
import ElementUI from 'element-ui'
// import MicroVideoUI from '@microVideo/cause-ui/lib/fe-component.umd.min';
import 'element-ui/lib/theme-chalk/index.css'
import gcoord from 'gcoord'
import './assets/css/animate.min.css'
import axios from 'axios'

/*import './assets/plugins/pace-1.0.2/pace.min.js'
import './assets/plugins/pace-1.0.2/themes/blue/pace-theme-flash.css'*/
//import './assets/plugins/pace-1.0.2/themes/blue/pace-theme-flat-top.css'

//工具类   例：this.Utils.browser.version
import Utils from './filters/utils'
import moment from 'moment'
window.moment = moment
Vue.prototype.Utils = Utils

//请求服务器函数封装，统一出入口， 例：this.$http.get(url);
import AxiosFilter from './filters/http'
Vue.prototype.$http = AxiosFilter
//滚动条插件
import vuescroll from 'vuescroll/dist/vuescroll'
Vue.use(vuescroll)

import AliIcon from './assets/iconfont/iconfont.css'

Vue.use(AliIcon)
import md5 from 'js-md5'
Vue.prototype.$md5 = md5
// import versionTood from '@/libs/versionUpdate'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.prototype.$gcoord = gcoord
window._ = _
Vue.use(ElementUI)
// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆

var limit_param_key = ['token', 'sessionId', 'JSESSIONID']
// this.$cookie.get('token')
// console.log(this.$cookie.get('token'),"token")
//部署时解开
//var cookie_domain='jchc.cn'
var cookie_domain = ''

const isProdution =
  process.env.NODE_ENV === 'production' &&
  !process.env.VUE_APP_IS_SJKT // 是否生产环境
const getIsLogin = () => sessionStorage.isLogined === 'true'
console.log(isProdution,'isProdution')
router.beforeEach((to, from, next) => {
  //判断当前代码版本是否与服务器中代码版本一致，如不一致则刷新页面获取最新
  // versionTood.isNewVersion()
  let userParam = Utils.getQueryObject()
  console.log(userParam, 'url')
  var d = new Date()
  d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toGMTString()
  var is_cas_url = false
  for (var k in userParam) {
    if (limit_param_key.indexOf(k) > -1) {
      is_cas_url = true
      document.cookie =
        (k == 'sessionId' ? 'JSESSIONID' : k) +
        '=' +
        userParam[k].replace(to.path, '').replace('/', '') +
        '; ' +
        expires +
        '; domain=' +
        cookie_domain
      console.log(document.cookie, 'document.cookie')
    }
  }

  // 节日统计
  // console.log(to,"路径")
  if (to.path == '/tongji') {
    next()
    return
  }

  //节日统计

  if (is_cas_url) {
    console.log('cas url')
    var url = window.location.href
    window.location.href =
      url.substr(0, url.indexOf('?')) + '#/index'
    return
  }

  //console.log('isLogin  ',store,to);
  // store.dispatch('getLoginStatus')
  if (isNbtd) {
    //南部通道跳转登录
    if (
      isProdution &&
      !getIsLogin() &&
      to.path !== '/login'
    ) {
      next('/login')
    } else {
      next()
    }
  } else {
    //苏交控登录加载页面
    if (
      isProdution &&
      !getIsLogin() &&
      to.path !== '/auto-login'
    ) {
      next('/auto-login')
    } else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  directives,
  render: h => h(App),
  data() {
    return {
      playerType: BASE_APP_CONFIG.VIDEO_PLAYER_TYPE,
      mediatype: BASE_APP_CONFIG.VIDEO_MEDIA_TYPE,
      uploadHeaders: {
        Authorization: store.state.userInfo
          ? store.state.userInfo.Authorization
          : ''
      },
      scrollOps: {
        vuescroll: {
          mode: 'native' //Utils.browser.version.mobile ? 'slide' : 'native'
        },
        rail: {},
        scrollPanel: {
          //scrollingX:false,
          easing: 'easeInQuad'
        },
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: false,
          keepShow: false,
          background: 'rgb(111, 118, 130)',
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: '6px',
          disable: false
        }
      }
    }
  },
  computed: {
    scrollOpsX() {
      return Object.assign({}, this.scrollOps, {
        scrollPanel: {
          scrollingY: false
        }
      })
    },
    scrollOpsY() {
      return Object.assign({}, this.scrollOps, {
        scrollPanel: {
          scrollingX: false
        }
      })
    },
    scrollOpsSlider() {
      return Object.assign({}, this.scrollOps, {
        vuescroll: {
          mode: 'slide'
        }
      })
    }
  }
}).$mount('#app')

// 禁用页面
// InspectionDialog 视频监控页面
// tongji 统计页面
// screenshotStatistics 截图统计页面
// szhIndex 省账号页面
// singleIndex  cameraPlayer  cameraPlayerRight 宁沪三块屏页面
// tableDemo 表格页面
// borrow 借阅审核页面
// videoManagement 录像管理
// sptCameraManage sptCameraManage
// sptCameraBox 省平台摄像机审核
// sptGatewayManage 网关管理
// sptMonitorManage 监控画面
// sptLoanApplication  借阅申请
// sptFailureReport 故障填报
// sptOrganizationManagement 组织机构管理
