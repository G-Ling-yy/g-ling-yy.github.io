/**
 * @description  加载地图主题配置入口
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/18 14:31
 */

import { darkConfig } from './theme-dark';
import { normalConfig } from './theme-normal'
import businessApi from '../../api/business-api';

/**
 * 基础业务图标配置
 * @type {({queryUrl: (function(): Promise<unknown> | Promise<unknown>), name: string, model: string, type: string}|{queryUrl: (function(): Promise<unknown> | Promise<unknown>), name: string, model: string, type: string}|{queryUrl: (function(): Promise<unknown> | Promise<unknown>), name: string, model: string, type: string}|{queryUrl: (function(): Promise<unknown> | Promise<unknown>), name: string, model: string, type: string}|{queryUrl: (function(): Promise<unknown> | Promise<unknown>), name: string, model: string, type: string})[]}
 */
const themePublicConfig = [
  {
    type: 'lk',
    name: '路况',
    model: 'line',
    queryUrl: businessApi.getLKMapLayerList
  }, {
    type: 'sxt',
    name: '摄像头',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    type: 'qbb',
    name: '情报板',
    model: 'point',
    queryUrl: businessApi.getQBBMapLayerList
  }, {
    type: 'jdd',
    name: '交调点',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '道路事件',
    type: 'dlsj',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '救援车辆',
    type: 'jycl',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '警车',
    type: 'jc',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '执法车',
    type: 'zfc',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '雷雨图层',
    type: 'lytc',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '气象点',
    type: 'qxd',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '工区',
    type: 'gq',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '服务区',
    type: 'fwq',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '收费站',
    type: 'sfz',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '汽渡',
    type: 'qd',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: 'ETC',
    type: 'etc',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '停车区',
    type: 'tcq',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '枢纽',
    type: 'sn',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '桥梁',
    type: 'ql',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '隧道',
    type: 'sd',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }, {
    name: '路线',
    type: 'lx',
    model: 'line',
    queryUrl: businessApi.getLXMapLayerList
  }, {
    name: '桩号',
    type: 'zh',
    model: 'point',
    queryUrl: businessApi.getZHMapLayerList
  }
]


/**
 * 地图家加载配置
 * @type {{center: number[], zoom: number, pitch: number, rotateEnable: boolean}}
 */
const defaultMapConfig = {
  //层级
  zoom: 10,
  //中心点
  center: [119.378231, 32.458852],
  //地图俯仰角度，有效范围 0 度- 83 度
  pitch: 45,
  //是否允许旋转
  rotateEnable: false,
  //地图平移是否有动画
  animateEnable: false,
  //是否展示3D地图
  // viewMode: '3D'
}

/**
 * AMapUI基础配置
 * @type {{ZhddMapSimpleInfoWindow: string, ZhddMapPointSimplifier: string, ZhddMapSimpleMarkers: string, ZhddMapSimpleMarker: string, ZhddMapPathSimplifier: string}}
 */
const defaultMapUIConfig = {
  ZhddMapPointSimplifier: 'ui/misc/PointSimplifier',          //海量点
  ZhddMapPathSimplifier: 'ui/misc/PathSimplifier',            //路线
  ZhddMapSimpleMarker: 'ui/overlay/SimpleMarker',             //单个标记点
  ZhddMapSimpleMarkers: 'ui/misc/MarkerList',                 //多个标记点
  ZhddMapSimpleInfoWindow: 'ui/overlay/SimpleInfoWindow'      //弹框
}

class themeConfigClass {

  constructor(config) {
    this.defineMapConfig();
    this.allThemeConfig.push(darkConfig, normalConfig);
    if (typeof config === 'object') {
      this.allThemeConfig.push(config);
    }
    this.createMapIconConfig(this.allThemeConfig);
  }

  defineMapConfig() {
    this.allThemeConfig = [];
    this.mapConfig = null;
    this.mapIconConfig = [];
  }

  /**
   * 创建地图图标配置
   * @param data
   */
  createMapIconConfig(data) {
    this.mapIconConfig = [];
    data.map(themeConfig => {
      if (themeConfig.businessConfig) {
        themeConfig.businessConfig.map(item => {
          if (item.icon) {
            item.icon.map(icon => {
              this.mapIconConfig.push({
                name: themeConfig.theme + '-' + icon.name,
                url: icon.url
              })
            })
          }
        })
      }
    });
  }

  /**
   * 获取地图图标配置
   * @param mapIconConfig
   * @returns {*[]}
   */
  getMapIconConfig(mapIconConfig) {
    return this.mapIconConfig.concat(mapIconConfig);
  }

  /**
   * 地图加载配置
   * @param mapThemeConfig
   */
  setMapConfig(mapThemeConfig) {
    this.mapConfig = Object.assign(defaultMapConfig, mapThemeConfig)
  }

  /**
   * 获取MapUI
   * @returns {{ZhddMapSimpleInfoWindow: string, ZhddMapPointSimplifier: string, ZhddMapSimpleMarkers: string, ZhddMapSimpleMarker: string, ZhddMapPathSimplifier: string}}
   */
  getMapUIConfig() {
    return defaultMapUIConfig;
  }

  /**
   * 创建地图主题配置
   * @param config
   * @returns {*}
   */
  createThemeConfig(config) {
    let themeConfig = config;
    themePublicConfig.map((defaultTheme, defaultIndex) => {
      themeConfig.map((item, index) => {
        if (defaultTheme.type === item.type) {
          themeConfig[index] = Object.assign(defaultTheme, item)
        }
      })
    })
    return themeConfig;
  }

  /**
   * 配置地图主题及相关业务图标样式
   * @param config
   * @returns {{mapIconConfig: [], themeConfig: (*|[]), mapConfig: null}}
   */
  setThemeConfig(config) {
    let themeConfig = null;
    let theme = null;
    let businessStyleConfig = this.allThemeConfig[0].businessStyleConfig;
    if (typeof config === 'string') {
      theme = config;
    } else {
      theme = config.theme;
      if (config.businessStyleConfig) {
        businessStyleConfig = config.businessStyleConfig;
      }
    }
    this.allThemeConfig.map((item, index) => {
      if (item.theme === theme) {
        themeConfig = item.businessConfig;
        this.setMapConfig(item.mapConfig);
      } else {
        if (config.businessConfig) {
          themeConfig = config.businessConfig;
        }
        if (config.mapConfig) {
          this.setMapConfig(config.mapConfig);
        }
      }
    })
    return {
      themeConfig: themeConfig ? this.createThemeConfig(themeConfig) : [],
      mapConfig: this.mapConfig,
      mapIconConfig: this.mapIconConfig,
      businessStyleConfig: businessStyleConfig
    };
  }
}

function chooseThemeConfig(config) {
  return new themeConfigClass(config)
}

export { chooseThemeConfig }
