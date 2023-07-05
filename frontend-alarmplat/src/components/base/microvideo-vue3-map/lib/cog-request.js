import axios from 'axios'
import qs from 'qs'

/**
 * 使用方法

 * 1.初始配置
 * configDefaultConfig(config,servicesUrl)
 * config 初始配置，可设置baseUrl,timeout,header
 * servicesUrl 多个域名配置,可不传 不传时config.baseURL 为必传

 * 2.设置当个请求超时 时间
 * createRequest(null,timeout)

 * 3.使用parameters 传参
 * createRequest().setParameters({}).get('url')

 * 4.使用add方法添加参数
 * createRequest().add('key','value').get('url')

 * 5.配置域名
 * createRequest('SERVER_NAME').setParameters({}).get('url')

 * 6.POST请求 默认 application/json
 * createRequest().setParameters({}).post("url")

 * 7.POST请求 请求格式为 multipart/form-data   传参一定要是个对象，不能是formData类型
 * createRequest().setParameters({},'formdata').post("url")

 * 8.POST请求 请求格式为 application/x-www-form-urlencoded
 * createRequest().setParameters({},'urlencoded').post("url")
 */

/**
 * axios请求框架封装
 *
 * @author 朱琦
 * @time 2021/11/18
 ** */
const servicesBaseUrl = {}
let baseurl = ''
let servicesConfig = {
  timeout: 30000
}

/**
 * servicesBaseUrl 配置
 * @param {Object} config      初始配置
 * @param {Object} servicesUrl 多个域名配置
 * */
function configDefaultConfig (config = {}, servicesUrl = []) {
  // 多域名配置
  if (servicesUrl && servicesUrl.length > 0) {
    for (const service of servicesUrl) {
      servicesBaseUrl[service.servicesName] = service
    }
    baseurl = servicesUrl[0].servicesUrl
  }

  // 单个域名配置
  if (!baseurl) {
    baseurl = config.baseURL
  }

  servicesConfig = config
}

class Request {
  constructor (servicesName = null, timeout) {
    // create axios
    this.instance = axios.create({
      baseURL: servicesName ? servicesBaseUrl[servicesName].servicesUrl : baseurl,
      timeout: timeout ? servicesConfig.timeout : timeout,
      headers: servicesConfig.headers ? servicesConfig.headers : {}
    })

    this.config = {}

    this.type = 'json' // json formdata urlencoded

    // 参数
    this.paramData = {}
  }

  /**
   * 设置请求参数对象
   *
   * @param {Array} obj  传参对象
   * @param {String} type 传参类型  json formdata urlencoded
   * */
  setParameters (paramData, type = 'json') {
    this.paramData = paramData
    this.type = type
    return this
  }

  /**
   * 添加参数
   * @param {String} key
   * @param {String} value
   * */
  add (key, value) {
    this.paramData[key] = value
  }

  /**
   * 请求方法
   *
   * @param url 请求地址
   * @param method 方法名
   * @return Promise
   * */
  request (url, method) {
    return new Promise((resolve, reject) => {
      const data = this.type === 'formdata' ? new FormData() : {}
      // config 配置
      this.config.url = url
      this.config.method = method
      this.config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      // 拼接请求参数
      this.paramData && Object.keys(this.paramData).forEach(key => {
        const reger = new RegExp('{' + key + '}')
        if (reger.test(url)) {
          this.config.url = url.replace(reger, this.paramData[key])
        } else {
          if (this.type === 'formdata') {
            data.append(key, this.paramData[key])
          } else {
            data[key] = this.paramData[key]
          }
        }
      })

      // params是添加到url的请求字符串中的
      // data是添加到请求体（body）中的
      if (method === 'GET') {
        this.config.params = data
      } else {
        // post的三种 Content-Type
        switch (this.type) {
          case 'json':
            this.config.data = data
            this.config.headers['Content-Type'] = 'application/json'
            break
          case 'urlencoded':
            this.config.data = qs.stringify(data)
            this.config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            break
          case 'formdata':
            this.config.data = data
            this.config.headers['Content-Type'] = 'multipart/form-data'
            break
          default:
            break
        }
      }

      // 默认返回json类型的数据格式
      if (!this.config.dataType) {
        this.config.dataType = 'json'
      }

      // 开始请求
      this.instance(this.config).then((response) => {
        if (response.status === 200) {
          // console.log('HTTP请求成功,请求地址:' + this.config.url + ',返回信息:', response.statusText)
          resolve(response.data)
        } else {
          console.error('HTTP请求失败,请求地址:' + this.config.url + ',操作失败，失败信息:', response.statusText)
          reject(response)
        }
      }).catch((error) => {
        console.error('HTTP请求失败,请求地址:' + this.config.url + ',请求出现错误，异常信息', error)
        reject(error)
      })
    })
  }

  /**
   * post请求
   *
   * @param url 请求地址
   * @return promise
   * */
  post (url) {
    return this.request(url, 'POST')
  }

  /**
   * get请求
   *
   * @param url 请求地址
   * @return promise
   * */
  get (url) {
    return this.request(url, 'GET')
  }

  /**
   * put请求
   *
   * @param url 请求地址
   * @return promise
   * */
  put (url) {
    return this.request(url, 'PUT')
  }

  /**
   * delete请求
   *
   * @param url 请求地址
   * @return promise
   * */
  delete (url) {
    return this.request(url, 'DELETE')
  }
}

/**
 * 创建请求对象
 * */
function createRequest (servicesName, timeout) {
  return new Request(servicesName, timeout)
}

export {
  createRequest,
  configDefaultConfig
}
