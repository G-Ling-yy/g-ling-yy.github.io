/**
 * @description
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/9 16:28
 */
// import Vue from 'vue';
// import { createApp } from 'vue'loadMapThemeConfig
// const Vue = createApp()
import LazyMapLoader from './load-map/lazy-map'
import { chooseThemeConfig } from '../config/theme/index'
import { normalConfig } from '../config/theme/theme-normal'
import { darkConfig } from "../config/theme/theme-dark";
import { defaultMapIconStyles } from '../config/business-icon-config'

let lazyAMapApiLoaderInstance = null //地图加载实例
let mapIconConfig = defaultMapIconStyles

/**
 * 初始化Map
 * @param config
 */
export const initAMap = (config = {}) => {
  if (!lazyAMapApiLoaderInstance)
    lazyAMapApiLoaderInstance = new LazyMapLoader(config)
}

/**
 * 加载MapUI配置
 * @param config
 */
export const loadMapUIConfig = (Vue, config = {}) => {
  Vue.config.globalProperties.$globalProperties = Object.assign(
    chooseThemeConfig().getMapUIConfig(),
    config
  )
}

/**
 * 加载Map主题配置
 * @param config
 */
export const loadMapThemeConfig = (Vue, config, type) => {
  let mapThemeConfig
  let themeConfig = config
  if (!themeConfig) {
    themeConfig = type === 'dark' ? darkConfig : normalConfig
    mapThemeConfig = chooseThemeConfig().setThemeConfig(themeConfig)
  } else {
    mapThemeConfig = chooseThemeConfig(themeConfig).setThemeConfig(themeConfig)
  }
  mapIconConfig = mapIconConfig.concat(mapThemeConfig.mapIconConfig)
  Vue.config.globalProperties.$defaultMapConfig = mapThemeConfig.mapConfig
  Vue.config.globalProperties.$businessIconConfig = mapThemeConfig.themeConfig
  Vue.config.globalProperties.$businessStyleConfig =
    mapThemeConfig.businessStyleConfig
}

/**
 * 配置地图图标
 * @param config
 */
export const mergeMapIconConfig = (Vue, config = []) => {
  if (config.length > 0) {
    mapIconConfig = mapIconConfig.concat(config)
  }
  Vue.config.globalProperties.$mapIconConfig = mapIconConfig
}

export { lazyAMapApiLoaderInstance }
