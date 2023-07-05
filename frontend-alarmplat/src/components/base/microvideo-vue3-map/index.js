/**
 * @description  地图加载
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/11 13:06
 */

import {
  initAMap,
  loadMapUIConfig,
  loadMapThemeConfig,
  mergeMapIconConfig
} from './lib/init-map'
import { configureFetchConfig } from './lib/request'

import MMap from './components/MMap'
import MMapIcon from './components/MMapIcon'
import MMapDialog from './components/MMapDialog'
import MMapLayer from './components/MMapLayer'

let components = [MMap, MMapIcon, MMapDialog, MMapLayer]

export default {
  install: (Vue, option = {}) => {
    try {
      /**
       * 加载Map主题配置
       */
      loadMapThemeConfig(Vue, option.themeConfig, option.themeType)
      /**
       * 初始化Map
       */
      initAMap(option.initMapConfig)
      /**
       * 加载MapUI配置
       */
      loadMapUIConfig(Vue, option.mapUIConfig)

      /**
       * 加载Map图标配置
       */
      mergeMapIconConfig(Vue, option.mapIconConfig)

      /**
       * 配置业务图层请求地址
       */
      configureFetchConfig(option.fetchConfig)

      //组件注册
      components.map((_component) => {
        // 组件注册
        Vue.component(_component.name, { ..._component, Vue })
      })
    } catch (error) {
      throw new Error('install-error: ', error)
    }
  }
}
