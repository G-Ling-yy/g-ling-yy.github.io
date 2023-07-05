/**
 * http请求配置全局配置
 */
 import v from 'vue'
 import store from '../store'
 import axios from 'axios'
 import BASE_APP_CONFIG from '../config'
 import router from '../router'
 import { MessageBox } from 'element-ui'
 
 let loginFlag = true
 
 /* 环境判断 */
 const isProdution =
     process.env.NODE_ENV === 'production' &&
     !process.env.VUE_APP_IS_SJKT, // 苏交控生产环境
   isNbtd = process.env.VUE_APP_TARGET === 'nbtd' // 南部通道(开发兼生产环境)
 
 //创建axios的一个实例
 var instance = axios.create({
   //接口请求时间20s
   timeout: 20000000
 })
 let isRefreshing = false //fixsxy
 
 instance.defaults.validateStatus = function(status) {
   console.log('http state', status)
   return (status >= 200 && status < 300) || status === 302
   // 此时设置成功状态码是302(系统重定向)，所以就算地址错误，报302，但依旧会显示请求成功
 }
 
 instance.defaults.withCredentials = true
 
 /* 如果苏交控打包线上才设置这两项 */
 if (isProdution && !isNbtd) {
   instance.defaults.headers.common['client_auth_type'] =
     'cas'
   // 请求头加上cookie
   instance.defaults.headers.common[
     'Authorization'
   ] = Cookies.get('token')
 }
 
 /* 
 本地使用固定token绕过登录（token值可能需更新）
  */
 
 // const token = `eyJhbGciOiJIUzI1NiJ9.eyJvcmdhbml6YXRpb25JZCI6Ijk5MDEiLCJsb2dpbk5hbWUiOiJhZG1pbiIsInVzZXJOYW1lIjoiYWRtaW4iLCJ1c2VySWQiOjEwMDAwMDAwMDUzLCJ1dWlkIjoiYzdkMDkzN2UtMzIyZi00ZDJjLWE1Y2YtZTZmYmQ2MjBhZGM0IiwiZXhwIjoxNjQzMzc4NDQwfQ.TjEFyZf3A98T5R7WTgzS7Ve133dy-98HO50bdpPR5mI`
 // instance.defaults.headers.common['Authorization'] = token
 
 /*
  */
 
 /* 
 南部通道配置选项
  */
 
 if (isNbtd) {
   instance.defaults.baseURL = 'http://139.198.155.14:8081/'
  //  instance.defaults.baseURL = 'https://hdsp.gandongyun.com'
  //  instance.defaults.baseURL = 'http://192.168.112.92:9521/'

   //登录页面登录验证
   instance.defaults.headers.common['Authorization'] = store
     .state.userInfo
     ? store.state.userInfo.Authorization
     : null
 }
 
 /*
  */
 
 instance.defaults.headers.post['Content-Type'] =
   'application/json;charset=UTF-8'
 instance.defaults.headers.common['X-Requested-With'] =
   'XMLHttpRequest'
 instance.defaults.headers.common['location-Mvp'] =
   window.location.href
 
 // http request 拦截器 请求拦截
 instance.interceptors.request.use(
   function(config) {
     // console.log('request config', config)
     var baseURL = ''
     if (config.url?.indexOf('http') === 0) {
       baseURL = ''
     } else {
       baseURL = BASE_APP_CONFIG.API_BASE_URL
     }
 
     if (
       config.url?.indexOf('/listMessage') === 0 ||
       config.url?.indexOf('/updateReadStatus') === 0 ||
       config.url?.indexOf('/saveMessage') === 0
     ) {
       baseURL = 'http://mvpapi.jchc.cn' //BASE_APP_CONFIG.Favorite_Statistics_API_URL;
     }
 
     config.headers['Cache-Control'] = 'no-cache'
 
     //上云网关接口header携带TAuth
     config.headers['TAuth'] = store.state.gateway
       .eventTAuthInfo.token
       ? store.state.gateway.eventTAuthInfo.token
       : null
     config.headers['AppVersion'] = 'v1.0'
 
     config.url = baseURL + config.url
 
     if (config.method === 'get') {
       //附带通用参数
       let params = config.params || {}
       //params.pmId = projectInfo.id;
       params._t = Date.parse(new Date()) / 1000
       config.params = params
     }
 
     return config
   },
   function(error) {
     console.log(error, 'http error')
     return Promise.reject(error.response)
   }
 )
 
 // 路由响应拦截
 // http response 拦截器
 instance.interceptors.response.use(
   function(response) {
     // console.log(response,'res')
     // console.log("response",{responseURL:response.request.responseURL, code:response.status,message:response.data});
     // if (response.status !== 200) {
 
     //   // console.log("[error]",{responseURL:response.request.responseURL, code:response.status,message:response.data});
     //   return response;
     // }
     //console.log(response,"dsasda")
     //console.log('response   ',response);
     if (response.data.code === 401) {
       // console.log(loginFlag,i++,'flag')
       //登录失效
       router.replace('/login')
       return {}
     }
     //苏交控重定向
     if (
       response.status === 202 &&
       response.data.status === 202
     ) {
      //  console.log('222222', response.data.message)
       window.location.href = response.data.message
       return {}
     }
     // else if (response.status != 202 &&
     //   response.data.status != 202 &&
     //   response.data.code !== 200
     // ) {
     //   window.location.href = "/#/login";
     // }
     if (
       response.data.code !== 200 &&
       response.data.code !== undefined
     ) {
       console.log()
 
       // console.log("[error]",{responseURL:response.request.responseURL, code:response.data.code,message:response.data.msg});
 
       // if (response.data.code === 999) {
       //   //登录失效跳转登录页
       //   window.location.href = "/#/login";
       //   return {};
       // }
 
       // // 调用视频上云网关接口 TAuth过期
       // if (response.data.code === 403) {
       //   //TAuth过期
       //   console.log("TAuth过期");
       //   num++;
       //   if (num >= 5) {
       //     v.$message({
       //       message: "TAuth已过期，请联系开发人员",
       //       type: "error"
       //     });
       //     num = 0;
       //   } else {
       //     console.log("getTokenInfo");
       //     // store.dispatch("getTokenInfo", "");
       //   }
       //   return;
       // }
     }
 
     return response
   },
   function(err) {
     console.log('http error', err)
 
     return Promise.reject(err.response) // 返回接口返回的错误信息
   }
 )
 export default instance
 