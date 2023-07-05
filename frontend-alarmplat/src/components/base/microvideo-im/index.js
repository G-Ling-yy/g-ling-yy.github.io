import socket from './socket-api'
/**
 * im插件
 * @author 张喜津
 * @time 2021年11月9日 16:30
 **/
export default {
  /**
   * @param Object  此实例为挂载到Vue全局方式 也支持传入document等做对应业务处理
   * @param options object 安装参数容器
   * ------ oprions Properties ------
   * -- type   腾讯 'easemob' 环信 'tencent'
   * -- key   腾讯应用appid或者环信应用appkey
   **/
  install: (Vue, options = {}) => {
    try {
      if (options.key && options.type) {
        // Vue.prototype.$webIm = socket(options);
        Vue.config.globalProperties.$webIm = socket(options)
      } else {
        throw new Error('init-error: 初始化参数有误!')
      }
    } catch (error) {
      throw new Error('install-error: ', error)
    }
  }
}
