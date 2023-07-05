import axios from 'axios'
import {
  baseURL,
  outBaseURLAfterBuild,
  contentType,
  debounce,
  requestTimeout,
  successCode,
  tokenName
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'
import { message } from 'ant-design-vue'

let outBaseURL
if (
  process.env.NODE_ENV === 'production' &&
  outBaseURLAfterBuild
) {
  /* 如果打包启用外部配置接口地址 */
  outBaseURL = globalThis.outBaseURL
  delete globalThis.outBaseURL
}

const msgErr = message.error

let loadingInstance

/**
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case 401:
      msgErr(msg || '登录失效')
      store.dispatch('user/resetAll').catch(() => {})
      break
    case 403:
      router.push({ path: '/401' }).catch(() => {})
      break
    default:
      msgErr(msg || `后端接口${code}异常`)
      break
  }
}

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL: outBaseURL || baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType
  }
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  config => {
    console.log('instance.interceptors.request', config)

    if (store.getters['user/accessToken']) {
      config.headers[tokenName] =
        store.getters['user/accessToken']
    }
    if (
      config.data &&
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded;charset=UTF-8'
    ) {
      config.data = qs.stringify(config.data)
    }
    if (debounce.some(item => config.url.includes(item))) {
      // 这里写加载动画
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  response => {
    console.log('instance.interceptors.response', response)

    if (loadingInstance) {
      loadingInstance.close()
    }
    const { data, config } = response
    const { code, msg, location } = data

    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]]
    // 是否操作正常
    if (codeVerificationArray.includes(code)) {
      return data?.data
    } else {
      // cas验证跳转扫码
      if (data.code === 202) {
        return (window.location.href = location)
      }

      // 对指定接口特殊处理不显示报错message
      const needntMesErr = config.url.includes(
        'open/getCameraPlayURL'
      )
      !needntMesErr && handleCode(code, msg)
      return Promise.reject(
        'vue-admin请求异常拦截:' +
          JSON.stringify({ url: config.url, code, msg }) ||
          'Error'
      )
    }
  },
  error => {
    console.log('instance.interceptors.error', error)

    if (loadingInstance) loadingInstance.close()
    const { response, message } = error
    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.msg || message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message?.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (
        message?.includes('Request failed with status code')
      ) {
        const code = message?.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }

      // 手/自动取消请求
      if (!message) return Promise.reject(error)

      msgErr(message || `后端接口未知异常`)
      return Promise.reject(error)
    }
  }
)

export default instance
