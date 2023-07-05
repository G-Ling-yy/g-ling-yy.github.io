/**
 * @description 地图配置
 */
import { patchIOS11Geo } from './polyfill';

const defaultConfig = {
  key: 'a1fc0ec5f3b78143136030409f1c6e59',
  v: '2.0',
  uiVersion: '1.1',
  plugin: [
    "AMap.HawkEye", // 2.0版本原名HawkEye==》OverView鹰眼
    "AMap.MouseTool", // 鼠标工具
    "AMap.CircleEditor",
    "AMap.PolyEditor",
    "AMap.RectangleEditor",
    "AMap.MarkerClusterer",
    "AMap.Scale",
    "AMap.ToolBar",
    "AMap.ControlBar",
    "AMap.HeatMap",// 热力图
    "AMap.DistrictSearch"
  ],
  callback: 'amapInitComponent'
}

export default class LazyMapLoader {

  constructor(mapConfig) {
    this.config = Object.assign(defaultConfig, mapConfig);
    this.mapDocument = document;
    this.mapWindow = window;
    this.mapQueueEvents = [patchIOS11Geo];
  }

  lazyMapLoad() {
    if (this.mapWindow.AMap && this.mapWindow.AMap.Map)
      return this.lazyLoadUIAMap();
    if (this.scriptLoadingPromise) return this.scriptLoadingPromise;
    const script = this.mapDocument.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = this.getScriptSrc();
    const UIPromise = this.config.uiVersion ? this.lazyLoadUIAMap() : null;
    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      this.mapWindow['amapInitComponent'] = () => {
        while (this.mapQueueEvents.length) {
          this.mapQueueEvents.pop().apply();
        }
        if (UIPromise) {
          UIPromise.then(() => {
            window.initAMapUI();
            setTimeout(resolve)
          })
        } else {
          return resolve();
        }
      };
      script.onerror = err => reject(err);
    });
    this.mapDocument.head.appendChild(script);
    return this.scriptLoadingPromise;
  }

  lazyLoadUIAMap() {
    if (!this.config.uiVersion || window.AMapUI)
      return Promise.resolve();
    return new Promise((resolve, reject) => {
      const UIScript = document.createElement('script');
      const [versionMain, versionSub] = this.config.uiVersion.split('.');
      if (versionMain === undefined || versionSub === undefined) {
        console.log('AMapUI版本不正确，请检查版本；当前版本为：' + this.config.uiVersion);
        return;
      }
      let src = `https://webapi.amap.com/ui/${versionMain}.${versionSub}/main-async.js`;
      UIScript.src = src;
      UIScript.type = 'text/javascript';
      UIScript.async = true;
      this.mapDocument.head.appendChild(UIScript);
      UIScript.onload = () => {
        setTimeout(resolve, 0)
      };
      UIScript.onerror = () => reject();
    })

  }


  getScriptSrc() {
    const mapPrefixReg = /^AMap./;
    const config = this.config;
    const paramKeys = ['v', 'key', 'plugin', 'callback'];
    if (config.plugin && config.plugin.length > 0) {
      config.plugin.push('Autocomplete', 'PlaceSearch', 'PolyEditor', 'CircleEditor');
      const plugins = [];
      config.plugin.forEach(item => {
        const prefixName = (mapPrefixReg.test(item)) ? item : 'AMap.' + item;
        const pureName = prefixName.replace(mapPrefixReg, '');
        plugins.push(prefixName, pureName);
      });
      config.plugin = plugins;
    }
    const params = Object.keys(config)
      .filter(k => ~paramKeys.indexOf(k))
      .filter(k => config[k] != null)
      .filter(k => {
        return !Array.isArray(config[k]) ||
          (Array.isArray(config[k]) && config[k].length > 0);
      })
      .map(k => {
        let v = config[k];
        if (Array.isArray(v)) return { key: k, value: v.join(',') };
        return { key: k, value: v };
      })
      .map(entry => `${entry.key}=${entry.value}`)
      .join('&');
    return `https://webapi.amap.com/maps?${params}`;
  }

}
