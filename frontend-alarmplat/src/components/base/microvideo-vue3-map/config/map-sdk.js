/**
 * @description  地图SDK
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/12 13:23
 * @updata          by smigoo:制作vue3.0版本地图组件
 */

import { getMassIconUrl, getMarkerIcon, setMapIconConfig } from './public-function';
// import { createApp } from 'vue'
import { darkConfig } from "./theme/theme-dark";
import { normalConfig } from "./theme/theme-normal";
class MapFunction {

  // map = null;
  // mapUI = {};
  // mapIcon = [];

  constructor(map, mapUIConfig, mapIconConfig) {
    this.initMapConfig();
    this.map = map;
    this.createMapUIApiLoaderInstance(mapUIConfig);
    this.configureMapIconConfig(mapIconConfig);
    this.initMapPlugins();
  }

  /**
   * 配置基础参数
   */
  initMapConfig() {
    this.map = null;
    this.mapUI = {};
    this.mapIcon = [];
  }

  /**
   * 配置地图基础插件
   */
  initMapPlugins() {
    this.mouseTool = new AMap.MouseTool(this.map);
  }

  configureMapIconConfig(config = []) {
    this.mapIcon = config;
    setMapIconConfig(this.mapIcon)
  }

  /**
   * 创建Marker标记点
   * @param data
   *          -- icon: [] -Array (['icon-gl-etc','icon-gl-etc-active'])
   *          -- path: [lng,lat]
   *          -- name: ''
   */
  mapMark(data, callback) {
    let markers = [];
    if (data) {
      data.map((item, index) => {
        markers[index] = new AMap.Marker({
          title: item.name,
          icon: item.icon ? new AMap.Icon(getMarkerIcon(item)) : item.iconUrl ? item.iconUrl : '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          position: item.path,
          offset: item.offset || [0, 0],
          size: item.size || [32, 32],
          zIndex: item.index || 112
        })
        markers[index].on('click', e => callback(e, item))
        markers[index].on('mouseover', (e) => {
          markers[index].setLabel({
            offset: new AMap.Pixel(0, 0),
            content: item.name,
            direction: 'top',
          });
          callback(e, item)
        })
        markers[index].on('mouseout', (e) => {
          markers[index].setLabel({
            content: null,
          });
          callback(e, item)
        })
      })
      this.map.add(markers);
    }
    return markers;
  }

  /**
   * 移除Marker标记点
   * @param markers Marker实例
   */
  removeMark(markers) {
    if (markers) {
      markers.map((marker, index) => {
        marker.setMap(null);
      })
    }
    return null;
  }

  /**
   * 显示Marker标记点
   * @param markers Marker实例
   */
  showMapMarkerLayer(markers) {
    if (markers) {
      markers.map((marker, index) => {
        marker.show();
      })
    }
  }

  /**
   * 隐藏Marker标记点
   * @param markers Marker实例
   */
  hideMapMarkerLayer(markers) {
    if (markers) {
      markers.map((marker, index) => {
        marker.hide();
      })
    }
  }
  /**
   * 创建热力图
   */
  heatMap({ points, config }) {
    let heatMap;
    if (points.length) {
      points.map((point, index) => {
        point.lng = point.path[0]
        point.lat = point.path[1]
      })
    }
    this.map.plugin(["AMap.HeatMap"], () => {
      heatMap = new AMap.HeatMap(this.map, config);
      heatMap.setDataSet({ data: points, max: 100 }); //设置热力图数据集
    });
    return heatMap
  }
  /**
     * 移除热力图
  */
  hideHeatMap(HeatMap) {
    // return
    HeatMap.hide()
    return null;
  }

  /**
   * 修改marker图标
   * @param marker    -marker对象
   * @param icon      -图标名称
   */
  setMapMarkerStyle(marker, icon) {
    marker.setIcon(new AMap.Icon(getMarkerIcon(icon)));
  }

  /**
   * 创建海量点Point图层
   * @param data-Array
   *          -- id       设施ID-String
   *          -- name     设施名称-String
   *          -- lnglat   经纬度( [lng(float),lat(float)] )-Array
   * @param config-Object
   *          -- type     图标类型(
   *                              情报板:qbb;桩号:zh;服务区:fwq;枢纽:sn;收费站:sfz;工区:gq;汽渡:qd;ETC:etc;停车区:tcq;
   *                              路况:lk;摄像头:sxt;交调点:jdd;道路事件:dlsj;桥梁:ql;隧道:sd;路线:lx;救援车辆:jycl;
   *                              警车:jc;雷雨图层:lytc;气象点:qxd
   *                              )-String
   *          -- name     图标名称-String
   *          -- img      图层图标( [] )-Array
   *          -- icon     地图图标( ['icon-fwq','icon-fwq-active'] )-Array
   *          -- model    图层类型(point、line)-String
   *          -- queryUrl 图层数据函数-Function
   * @return 海量点图层实例
   */
  massPoint(data, config, callBack) {
    let mass = new AMap.MassMarks(JSON.parse(JSON.stringify(data)), {
      zIndex: 100,
      cursor: 'pointer',
      style: getMassIconUrl(config)
    });
    let marker = new AMap.Marker({ content: ' ', map: this.map });
    mass.on('mouseover', e => {
      marker.setPosition(e.data.lnglat);
      marker.setLabel({ content: e.data.name })
    });
    mass.on('mouseout', e => {
      marker.setLabel({ content: '' })
    })
    mass.on('click', e => callBack(e));
    mass.setMap(this.map);
    return mass;
  }

  /**
   * AMapUI加载海量点-PointSimplifier组件
   * @param data
   * @param config
   * @param callBack
   */
  massPointUI(obj, callBack) {
    const data = obj && obj.data ? obj.data : []
    const config = obj && obj.config ? obj.config : null
    let self = this;
    return new Promise((resolve, reject) => {
      AMapUI.load(
        ["ui/misc/PointSimplifier", "lib/$"],
        function (PointSimplifier, $) {
          if (!PointSimplifier.supportCanvas) {
            alert("当前环境不支持 Canvas！");
            return;
          }
          let pointSimplifierIns = new PointSimplifier({
            zIndex: 117,
            map: self.map,
            autoSetFitView: false,
            compareDataItem: function (a, b, aIndex, bIndex) {
              //数据源中靠后的元素优先，index大的排到前面去
              return aIndex > bIndex ? -1 : 1;
            },
            getPosition: function (dataItem) {
              //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
              return dataItem.position;
            },
            getHoverTitle: function (dataItem, idx) {
              //返回数据项的Title信息，鼠标hover时显示
              return dataItem.data.title;
            },
            renderOptions: {
              //点的样式
              pointStyle: {
                // 绘制点占据的矩形区域
                content: PointSimplifier.Render.Canvas.getImageContent(
                  config && config.url ? config.url : '',
                  function onload() {
                    pointSimplifierIns.renderLater();
                  },
                  function onerror(e) { }
                ),
                //宽度
                width: config && config.width ? config.width : 35,
                //高度
                height: config && config.height ? config.height : 35,
                //定位点为底部中心
                offset: ["-50%", "-50%"],
                fillStyle: null,
                strokeStyle: null,
              },
            },
          });
          pointSimplifierIns.setData(data);
          pointSimplifierIns.on("pointClick", (event, point) =>
            callBack(event, point)
          );
          pointSimplifierIns.on("pointMouseover", (event, point) =>
            callBack(event, point)
          );
          pointSimplifierIns.on("pointMouseout", (event, point) =>
            callBack(event, point)
          );
          resolve(pointSimplifierIns);
        }
      );
    });
  }
  hideMassPoint(pointSimplifierIns) {
    console.log(pointSimplifierIns, 'hideMassPointhideMassPointhideMassPoint')
  }
  /**
   * 创建线图层
   * @param data
   */
  createLine(data, callback) {
    let polylineList = [];
    if (data.length > 0) {
      data.map((item, index) => {
        let config = item.config;
        polylineList[index] = new AMap.Polyline({
          path: item.path,
          strokeColor: config.lineColor || "#3366FF",
          strokeWeight: config.lineWidth || 4,
          strokeStyle: config.lineStyle || "solid",
          ...config,
          zIndex: 101,
          strokeOpacity: 1,
          cursor: "pointer",
        });
        let marker = new AMap.Marker({
          content: " ",
          map: this.map,
          offset: new AMap.Pixel(-10, -20),
        });
        polylineList[index].on("mouseover", (e) => {
          polylineList[index].setOptions({
            strokeWeight: config.selectWidth || 6,
            strokeColor: config.selectColor || "#FF0000",
          });
          marker.setPosition(e.lnglat);
          marker.setLabel({ content: item.name });
          callback(e, item);
        });
        polylineList[index].on("mouseout", (e) => {
          polylineList[index].setOptions({
            strokeColor: config.lineColor || "#3366FF",
            strokeWeight: config.lineWidth || 4,
            strokeStyle: config.lineStyle || "solid",
            ...config,
          });
          marker.setLabel({ content: "" });
          callback(e, item);
        });
        polylineList[index].on("click", (e) => {
          callback(e, item);
        });
      });
    }
    this.map.add(polylineList);
    return polylineList;
  }
  /* 
  * 移除线条
  */
  hideLine(lines) {
    for (let index in lines) {
      console.log(lines[index], index)
      lines[index].hide()
      console.log(lines[index].getOptions())
    }
    return null
  }
  /**
   * 创建文本标记
   */
  createMapTextMarker(data) {
    let textLayers = []
    if (data) {
      data.map((item, index) => {
        textLayers.push(
          new AMap.Text({
            text: item.text || '',
            map: this.map,
            position: item.path || this.getMapCenter(),
            zIndex: 103,
            offset: new AMap.Pixel(item.offset ? item.offset[0] : 0, item.offset ? item.offset[1] : 0),
            style: item.style || null
          })
        )
      })
    }
    return textLayers;
  }


  /**
   * 创建点聚合
   */
  markerCluster({ data, color }, callback) {
    if (!color) {
      color = "#ff0000";
    }
    let points = [];
    if (data && data.length) {
      data.map((item, index) => {
        points.push({ lnglat: item.path, ...item, index });
      });
    }
    var count = data && data.length ? data.length : 0;
    let cluster = new AMap.MarkerClusterer(this.map, points, {
      renderMarker: (context) => {
        let markerStyle = [];
        if (context.data) {
          context.data.map((item, index) => {
            markerStyle.push(getMarkerIcon(item));
          });
        }
        context.marker.setIcon(new AMap.Icon(markerStyle[0]));
      },
      renderClusterMarker: (context) => {
        let div = document.createElement("div");
        div.style.backgroundColor = color;
        let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + "px";
        div.style.border = "solid 1px " + color;
        div.style.borderRadius = size / 2 + "px";
        div.style.boxShadow = "0 0 5px " + color;
        div.innerHTML = context.count;
        div.style.lineHeight = size + "px";
        div.style.color = "#ffffff";
        div.style.fontSize = "14px";
        div.style.textAlign = "center";
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        context.marker.setContent(div);
      },
    });
    cluster.on('click', (item) => {
      (item) => callback(item)
      if (item.clusterData.length <= 1) {
        (item) => callback(item, item.clusterData[0])
        return
      }
      let alllng = 0, alllat = 0;
      for (const mo of item.clusterData) {
        alllng += mo.lnglat.lng;
        alllat += mo.lnglat.lat;
      }
      const lat = alllat / item.clusterData.length;
      const lng = alllng / item.clusterData.length;
      this.map.setZoomAndCenter(this.map.getZoom() + 2, [lng, lat]);
    });
    if (!data || !data.length) {
      cluster.clearMarkers()

    }
    return cluster;
  }

  /**
   * 创建弹框
   * @param isCustom - 是否使用自定义组件
   * @param data - Object
   *          -- path: [lng,lat] -弹框显示位置
   *          -- content: ''/VNode/$el -弹框内容
   */
  createWindow(data, isCustom) {
    let windowInfo = new AMap.InfoWindow({
      isCustom: isCustom || false,
      content: data.content,
      offset: new AMap.Pixel(data.offset ? data.offset[0] : 0, data.offset ? data.offset[1] : 0)
    });
    windowInfo.open(this.map, data.path);
    return windowInfo;
  }

  /**
   * 地图中点移动（层级/中心）
   * @param center 中心点坐标 [lng,lat]
   * @param zoom   层级
   */
  setCenterAndZoom(center, zoom) {
    if (center) {
      this.map.setCenter(center);
    }
    if (zoom) {
      this.map.setZoom(zoom)
    }
  }
  /**
   * 显示地区imageLayerData
   */
  showArea(name, imageLayerData) {
    // let theme = Vue.prototype.$defaultMapConfig.mapStyle
    // console.log(theme, 'theme')
    this.district = new AMap.DistrictLayer.Province({
      zIndex: 12,
      adcode: ['320500'],
      depth: 2,
      styles: {
        "nation-stroke": "#E9F6FE",
        'fill': function () {
          return 'rgba(1,49,133,0)';
        },
        'province-stroke': 'cornflowerblue',
        'city-stroke': '#E9F6FE', // 中国地级市边界
        'county-stroke': 'rgba(255,255,255,0.5)'//中国区县边界 
      }
    });
    if (imageLayerData) {
      // 设置遮罩图层
      let imageLayer = new AMap.ImageLayer({
        bounds: new AMap.Bounds(imageLayerData.bounds[0], imageLayerData.bounds[1]
        ),
        url: imageLayerData.url, // 图片 Url
        zIndex: imageLayerData.index || 2,
        zooms: imageLayerData.zoom || [8, 10] // 设置可见级别，[最小级别，最大级别]
      })
      this.map.add(imageLayer)
    }
    this.district.setMap(this.map);
    let district = new AMap.DistrictSearch({
      subdistrict: 0,
      extensions: 'all',
      level: 'city'
    })
    district.search(name, (status, result) => {
      let bounds = result.districtList[0].boundaries
      var outer = [
        new AMap.LngLat(-360, 90, true),
        new AMap.LngLat(-360, -90, true),
        new AMap.LngLat(360, -90, true),
        new AMap.LngLat(360, 90, true),
      ];
      var holes = result.districtList[0].boundaries
      var pathArray = [
        outer
      ];
      pathArray.push.apply(pathArray, holes)
      var polygon = new AMap.Polygon({
        pathL: pathArray,
        // 线条颜色，使用16进制颜色代码赋值。默认值为#006600
        strokeColor: 'rgb(255,255,255)',
        strokeWeight: 4,
        // 轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
        strokeOpacity: 0.8,
        // 多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
        fillColor: '#191970',
        // 多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
        fillOpacity: 1,
        // 轮廓线样式，实线:solid，虚线:dashed
        strokeStyle: 'solid',
      });
      polygon.setPath(pathArray);
      this.map.add(polygon);
    })
  }

  /**
   * 获取地图实例
   */
  getMap() {
    return this.map;
  }

  /**
   * 获取地图中心点
   */
  getMapCenter() {
    return this.map.getCenter()
  }

  /**
   * 获取地图层级
   */
  getMapZoom() {
    return this.map.getZoom()
  }

  /**
   * 清除地图所有的覆盖物
   */
  clearMap() {
    return this.map.clearMap()
  }
  /**
     * 清除地图所有的覆盖物
     */
  clearMarkers() {
    return this.map.clearMarkers()
  }


  /**
   * 设置地图显示范围
   * @param southWestLngLat([lng,lat])-Array
   * @param northEastLngLat([lng,lat])-Array
   */
  setMapBounds(southWestLngLat, northEastLngLat) {
    this.map.setBounds(new AMap.Bounds(southWestLngLat, northEastLngLat));
  }

  /**
   * 设置地图可拖动区域
   * @param southWestLngLat([lng,lat])-Array
   * @param northEastLngLat([lng,lat])-Array
   */
  limitBounds([southWestLngLat, northEastLngLat]) {
    this.map.setLimitBounds(new AMap.Bounds(southWestLngLat, northEastLngLat))
  }

  /**
   * 清除地图限制拖动区域
   */
  clearLimitBounds() {
    this.map.clearLimitBounds();
  }

  /**
   * 添加地图控件
   * @param controls( ['scale','toolBar','controlBar','overView'] )-Array
   *          -- scale        比例尺
   *          -- toolBar      工具条
   *          -- controlBar   工具条方向盘
   *          -- overView     显示鹰眼
   */
  mapControl(controls) {
    let Controls = {}
    if (controls.indexOf("scale") != -1) {
      Controls.scale = new AMap.Scale();
      this.map.addControl(Controls.scale);
    }
    if (controls.indexOf("toolBar") != -1) {
      Controls.toolBar = new AMap.ToolBar({
        position: { top: "10px", right: "10px" },
      });
      this.map.addControl(Controls.toolBar);
    }
    if (controls.indexOf("controlBar") != -1) {
      Controls.ControlBar = new AMap.ControlBar()
      this.map.addControl(Controls.ControlBar);
    }
    if (controls.indexOf("overView") != -1) {
      Controls.HawkEye = new AMap.HawkEye()
      this.map.addControl(Controls.HawkEye);
    }
    return Controls
  }

  /**
  * 隐藏地图控件
  **/
  hideControl(controls) {
    for (let control in controls) {
      controls[control].hide()
    }
    return null
  }
  /**
   * 设置地图显示样式
   * @param style(dark) - String
   */
  mapStyle(style, globalProperties) {
    if (style === '9cdea5bfec221e6791bb4492c74a0fbd') { // 想要设置浅色
      globalProperties.$businessIconConfig = normalConfig

    } else {
      globalProperties.$businessIconConfig = darkConfig
    }
    globalProperties.$defaultMapConfig = { ...globalProperties.$defaultMapConfig, mapStyle: "amap://styles/" + style }
    console.log(globalProperties, 'globalProperties22222')
    this.map.setMapStyle("amap://styles/" + style)
  }

  /**
   * 设置地图显示元素
   * @param features( ['bg','point','road','building'] )-Array
   *          -- bg       地图背景
   *          -- point    兴趣点
   *          -- road     道路
   *          -- building 建筑物
   */
  setMapFeatures(features) {
    this.map.setFeatures(features)
  }

  /**
   * 创建图片图层
   * @param img               图片地址
   * @param southWestLngLat   ([lng,lat])-Array
   * @param northEastLngLat   ([lng,lat])-Array
   * @param zooms             显示层级范围
   */
  addLayer(param) {
    const img = param.url
    const southWestLngLat = param.path[0]
    const northEastLngLat = param.path[1]
    const zooms = param.zooms || [8, 18]
    const opacity = param.opacity || 1
    const imageLayer = new AMap.ImageLayer({
      url: img,
      bounds: new AMap.Bounds(southWestLngLat, northEastLngLat),
      zooms,
      zIndex: 117,
      opacity
    });
    this.map.add(imageLayer);
    return imageLayer
  }

  /**
   * 地图缩放至适合marker级别
   */
  setMapFitView() {
    this.map.setFitView();
  }

  /**
   * 右击菜单
   * @param events
   *          -- 事件数组  [{name:String,event:Function}]
   */
  mapRightClick(events) {
    let contextMenu = new AMap.ContextMenu();
    if (events && events.length > 0) {
      events.map((item, index) => {
        contextMenu.addItem(
          item.name,
          (e) => {
            item.event(item.param);
            console.log('执行了。')
            contextMenu.close();
          },
          index
        );
      });
    }
    console.log(contextMenu, 'contextMenu')
    this.map.on("rightclick", (e) => {
      contextMenu.open(this.map, e.lnglat);
    });
    return contextMenu
  }


  /**
   * 绘制区域
   * @param region
   *              -{name:'',lineColor:'',areaColor:''}
   *              -String
   * @param pointData
   * @param callback
   *              - Function
   *                  -return 覆盖物对象
   */
  drawMapRegion(region, markers, callback) {
    const name = region.name ? region.name : region
    this.mouseTool = null
    switch (name) {
      case 'rectangle': {
        this.mouseTool = new AMap.MouseTool(this.map);
        this.mouseTool.rectangle({
          fillColor: region.areaColor || '#00b0ff',
          strokeColor: region.lineColor || '#80d8ff'
        })
        break;
      }
      case 'circle': {
        this.mouseTool = new AMap.MouseTool(this.map);
        this.mouseTool.circle({
          fillColor: region.areaColor || '#00b0ff',
          strokeColor: region.lineColor || '#80d8ff'
        })
        break;
      }
      case 'polygon': {
        this.mouseTool = new AMap.MouseTool(this.map);
        this.mouseTool.polygon({
          fillColor: region.areaColor || '#00b0ff',
          strokeColor: region.lineColor || '#80d8ff'
        })
        break;
      }
    }
    this.mouseTool.on('draw', e => {
      console.log(e, 'e.obj.className')
      this.mouseTool.close(false);
      let drawRegion = null;
      let inRegionPoints = [];
      if (e.obj.className.indexOf('Rectangle') != -1) {
        drawRegion = new AMap.RectangleEditor(this.map, e.obj);
      } else if (e.obj.className.indexOf('Circle') != -1) {
        drawRegion = new AMap.CircleEditor(this.map, e.obj);
      } else {
        drawRegion = new AMap.PolyEditor(this.map, e.obj);
      }
      inRegionPoints = this.judgePointIsInRegion(e.obj, markers);
      e.obj.on('click', obj => {
        drawRegion.open();
      })
      e.obj.on('rightclick', obj => {
        drawRegion.close();
        inRegionPoints = this.judgePointIsInRegion(e.obj, markers);
        callback(e.obj, inRegionPoints);
      })
      callback(e.obj, inRegionPoints);
    })
  }


  /**
   * 判断点是否在区域内
   * @param region    -区域对象
   * @param markers   -点对象集合
   */
  judgePointIsInRegion(region, markers) {
    let result = [];
    if (markers && markers.length > 0) {
      markers.map((item, index) => {
        if (region.contains(item.getPosition())) {
          result.push(item);
        }
      })
    }
    return result;
  }


  /**
   * 清除绘制内容
   */
  clearMapRegion() {
    this.mouseTool.close(true);
  }



  /**
   * 创建AMapUI实例
   */
  createMapUIApiLoaderInstance(mapUIConfig) {
    let self = this;
    if (mapUIConfig) {
      Object.keys(mapUIConfig).forEach(key => {
        AMapUI.load(mapUIConfig[key], function (Simplifier) {
          self.mapUI[key] = Simplifier;
        })
      })
    }
  }
}

function createMapFunction(map, mapUIConfig, mapIconConfig) {
  return new MapFunction(map, mapUIConfig, mapIconConfig);
}

export { createMapFunction }
