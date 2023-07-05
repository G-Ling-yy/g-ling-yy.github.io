/* eslint-disable no-undef */
import { mapMutations } from "vuex";
/*import aliPlayer from '@/components/AliPlayer'*/
import amapPlayer from "../AmapPlayerDialog";

//import axios from 'axios';
const AMap = window.AMap;
/**
 * 三块屏地图页
 */
export default {
  name: "traffic-amap",
  components: {
    //aliPlayer,
    amapPlayer,
  },
  props: {
    baseTopAdcodes: {
      type: Number,
      default: 100000,
    },
    baseTopAdcodesName: {
      type: String,
      default: "中国",
    },
  },
  data() {
    let googleLayer = new AMap.TileLayer.Satellite({
      //zooms:[15,24],    //可见级别
      getTileUrl:
        "http://mt2.google.cn/vt/lyrs=s@817&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
      zIndex: 20,
      //tileUrl : 'http://www.google.cn/maps/vt?lyrs=s@817&gl=cn&x=[x]&y=[y]&z=[z]',
      opacity: 1,
    });

    return {
      googleLayer,
      mapInstance: null,
      districtExplorer: null,
      currentAreaNode: null,
      $tipMarkerContent: null,
      tipMarker: null,
      pointSimplifierIns: null,

      /*cameraImgUrl                     : require('@/assets/camera.gif'),
            cameraOfflineImgUrl              : require('@/assets/camera_offline.gif'),
            cameraErrorImgUrl                : require('@/assets/camera_error.gif'),*/

      /*cameraImgUrl                     : require('@/assets/map/normal.png'),
            cameraOfflineImgUrl              : require('@/assets/map/off-line.png'),
            cameraErrorImgUrl                : require('@/assets/map/abnormal.png'),
            cameraImgBtnUrl                  : require('@/assets/map/normal-btn.png'),
            cameraOfflineImgBtnUrl           : require('@/assets/map/off-line-btn.png'),
            cameraErrorImgBtnUrl             : require('@/assets/map/abnormal-btn.png'),*/
      //'1','2','3','7','5','6'
      //摄像机选中图标
      cameraGifUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera-gif.gif"),
        "2": require("@/assets/images/traffic_map/icon/camera-gif-2.gif"),
        "3": require("@/assets/images/traffic_map/icon/camera-gif-3.gif"),
        "4": require("@/assets/images/traffic_map/icon/camera-gif-5.gif"),
        "5": require("@/assets/images/traffic_map/icon/camera-gif-5.gif"),
        "6": require("@/assets/images/traffic_map/icon/camera-gif-6.gif"),
        "7": require("@/assets/images/traffic_map/icon/camera-gif-7.gif"),
      },
      //摄像机正常图标
      cameraImgUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera.png"),
        "2": require("@/assets/images/traffic_map/icon/camera-qd.png"),
        "3": require("@/assets/images/traffic_map/icon/camera-sd.png"),
        "4": require("@/assets/images/traffic_map/icon/camera-sfz.png"),
        "5": require("@/assets/images/traffic_map/icon/camera-sfz.png"),
        "6": require("@/assets/images/traffic_map/icon/camera-fwq.png"),
        "7": require("@/assets/images/traffic_map/icon/camera-etc.png"),
      }, //require('@/assets/images/traffic_map/icon/camera.png'),
      //摄像机离线图标
      cameraOfflineImgUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera-offline.png"),
        "2": require("@/assets/images/traffic_map/icon/camera-qd-offline.png"),
        "3": require("@/assets/images/traffic_map/icon/camera-sd-offline.png"),
        "5": require("@/assets/images/traffic_map/icon/camera-sfz-offline.png"),
        "6": require("@/assets/images/traffic_map/icon/camera-fwq-offline.png"),
        "7": require("@/assets/images/traffic_map/icon/camera-etc-offline.png"),
      }, //require('@/assets/images/traffic_map/icon/camera-offline.png'),
      //摄像机故障图标
      cameraErrorImgUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera-error.png"),
        "2": require("@/assets/images/traffic_map/icon/camera-qd-error.png"),
        "3": require("@/assets/images/traffic_map/icon/camera-sd-error.png"),
        "5": require("@/assets/images/traffic_map/icon/camera-sfz-error.png"),
        "6": require("@/assets/images/traffic_map/icon/camera-fwq-error.png"),
        "7": require("@/assets/images/traffic_map/icon/camera-etc-error.png"),
      }, //require('@/assets/images/traffic_map/icon/camera-error.png'),
      cameraIconWidth: 40, //35,
      cameraIconHeight: 47, //40*88/76

      cameraVideoInfo: {},
      videoUrl: "",
      currentPlayCamera: {},
      cameraInfoWindow: null,

      cameraMarkVisable: false,
      cameraImagesVisable: false,
      cameraInfoVisable: false,
      cameraInfoEditVisable: false,

      videoDialogElement: null,

      //baseTopAdcodes                   : 100000,

      resolutionValue: "20", //视频清晰度

      currentMarkers: [],
      backMark: null, //当前选中或之前选中的mark点
      chosedMark: null,
      infoWindow: null,
      editCameraInfoSign: false, //用户修改摄像机权限

      mapLayerType: "base",

      mapZIndexConfig: {
        /*baseLayer: 120, // 基础图层
        labelzIndex: 122, // 标注图层
        googleLayer: 20, // 卫星地图
        markerzIndex: 310, // 摄像头图标
        wmfLayer: 121, // 首都放射线*/
        baseLayer: 120, // 基础图层
        googleLayer: 120, // 卫星地图
        labelzIndex: 140, // 标注图层
        markerzIndex: 310, // 摄像头图标
        wmfLayer: 125, // 首都放射线
        featureZIndex: 121,
      },
    };
  },
  /*computed: {

        videoPlayer() {
            return this.$refs.videoPlayer.player
        },
    },*/
  beforeMount() {
    this.loadDefaultAmapEvent();
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      //基础地图
      var baseLayer = new AMap.TileLayer({
        //zooms:[0,15],    //可见级别
        visible: true, //是否可见
        opacity: 1, //透明度
        zIndex: this.mapZIndexConfig.baseLayer, //叠加层级
      });

      //卫星图层
      var googleLayer = new AMap.TileLayer.Satellite({
        zooms: [11, 24], //可见级别
        getTileUrl:
          "http://mt2.google.cn/vt/lyrs=s@817&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
        zIndex: this.mapZIndexConfig.googleLayer,
        //tileUrl : 'http://www.google.cn/maps/vt?lyrs=s@817&gl=cn&x=[x]&y=[y]&z=[z]',
        opacity: 1,
      });

      this.mapInstance = new AMap.Map("mapcontainer", {
        cursor: "default",
        resizeEnable: true,
        animateEnable: true,
        disableSocket: true,
        autoSetFitView: false,
        // viewMode: '3D',
        //showLabel: false,//不显示地图文字标记
        labelzIndex: this.mapZIndexConfig.labelzIndex,
        topAdcodes: [that.baseTopAdcodes],
        pitch: 0,
        zoom: 6,
        mapStyle: "amap://styles/b7f705be4f2be54091ca786949404f82",
        // mapStyle: 'amap://styles/218d2a567692dd432b4cafd07316d9cc',
        layers: [
          baseLayer,
          //layer,
          googleLayer,
          //roadNet
          //disCountry
        ], //图层
      });

      //当前聚焦的区域
      this.currentAreaNode = null;

      //鼠标hover提示内容
      let ele = document.createElement("div"); //  .getElementById('maptip');
      ele.className = "tipMarker top";
      this.$tipMarkerContent = ele;
      this.tipMarker = new AMap.Marker({
        content: this.$tipMarkerContent,
        offset: new AMap.Pixel(0, 0),
        bubble: true,
      });

      // 地图图块加载完成后触发
      that.mapInstance.on("complete", function() {
        that.$emit("amapComplete");
        //that.mapInstance.panBy(-250, -300);
        //地图内容
        that.initMapContent();
        //地图单击
        /*that.mapInstance.on('click', function(e){
                    console.info(e,e.target);
                } );*/
        //地图缩放
        that.mapInstance.on("zoomend", function(e) {
          that.mapChanged(e);

          let zom = that.mapInstance.getZoom(),
            feaps = that.districtExplorer.getAllFeaturePolygons();
          if (zom >= 11) {
            //清除已有的绘制内容
            //that.districtExplorer.clearFeaturePolygons();
          } else if (!feaps || feaps.length === 0) {
            //that.refreshAreaNode(that.currentAreaNode);
            that.renderAreaPolygons(that.currentAreaNode);
          }
          console.info(
            "zoomend  ",
            e,
            zom,
            that.districtExplorer.getAllFeaturePolygons()
          );
        });
        //地图移动
        that.mapInstance.on("moveend", function(e) {
          that.mapChanged(e);
        });
        //地图大小变化
        that.mapInstance.on("resize", function(e) {
          that.mapChanged(e);
        });

        setTimeout(() => {
          that.showLineLayer();
        }, 1000);
        that.mapInstance.setFitView();
      });

      /*that.mapInstance.on('click', function(ev) {
                //event.stopPropagation()// 阻止冒泡
                // 触发事件的对象
                var target = ev.target;

                // 触发事件的地理坐标，AMap.LngLat 类型
                var lnglat = ev.lnglat;

                // 触发事件的像素坐标，AMap.Pixel 类型
                var pixel = ev.pixel;

                // 触发事件类型
                var type = ev.type;

                console.info(target,type);
            });*/

      //判断用户修改摄像机信息权限
      this.editCameraInfoSign = this.$_btnPermissionCheck(10931010);
    });
  },
  methods: {
    /*...mapActions([
            'getCameraPlayUrl',
        ]),*/
    ...mapMutations(["setSelectCameraIndex"]),

    /**
     * 切换卫星图层
     */
    checkGoogleMapType(type) {
      if (type === "google") {
        //this.mapLayerType = type;
        //this.districtExplorer.clearFeaturePolygons();
        this.mapInstance.add(this.googleLayer);
      }

      if (type === "base") {
        //this.mapLayerType = type;

        this.mapInstance.remove(this.googleLayer);
      }
      this.mapLayerType = type;
      
      this.renderAreaPolygons(this.currentAreaNode);

      /*var googleLayer = new AMap.TileLayer.Satellite({
                zooms:[15,24],    //可见级别
                getTileUrl: 'http://mt2.google.cn/vt/lyrs=s@817&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil',
                zIndex:20,
                //tileUrl : 'http://www.google.cn/maps/vt?lyrs=s@817&gl=cn&x=[x]&y=[y]&z=[z]',
                opacity : 1
            });*/
    },

    /**
     * 路线图层
     * @returns {boolean}
     */
    showLineLayer() {
      let wms = new AMap.TileLayer.WMS({
        url: "http://testqxsj.txffp.com/geoserver/sf/wms",
        blend: false,
        tileSize: 512,
        zIndex: this.mapZIndexConfig.wmfLayer,
        /*params:{"service":"WMS","version":"1.1.0","request":"GetMap","layers":"sf:71118_polyline","styles":"",
                    "bbox":"80.4272689819336,20.3882083892822,131.186065673828,49.2997512817383","width":"579","height":"330",
                    "srs":"EPSG:4326","format":"application/openlayers","CQL_FILTER":'lx%20%3D%207'}*/
        params: {
          STYLES: "",
          LAYERS: "sf%3Ahighway_71118",
          FORMAT: "image%2Fpng",
          SERVICE: "WMS",
          VERSION: "1.1.1",
          REQUEST: "GetMap",
          SRS: "EPSG%3A3857",
          CQL_FILTER: "lx%20%3D%207",
          BBOX:
            "12653649.606408,2625087.7436574,12697806.169576,2656394.0569978",
          WIDTH: 512,
          HEIGHT: 363,
        },
      });
      wms.setMap(this.mapInstance);

      /*return true;

            let that = this;
            let layer =  new Loca.LinkLayer({
                map: that.mapInstance,
                fitView: true,
                //zooms:[0,15],    //可见级别
                visible:true,    //是否可见
                opacity:1,       //透明度
                zIndex:300         //叠加层级
            });

            let start = [];
            let lines = [];
            let colors = ['#07E8E4','#1f78b4','#b2df8a','#33a02c',
                '#fb9a99','#e31a1c','#fdbf6f','#ff7f00'];


            let newaxios = axios;
            //newaxios.defaults.baseURL = '';
            //'./t_load_line.json'

            //let lineUrl = 'http://localhost:8081/new_road.json';
            //let lineUrl = 'http://localhost:8081/line_data10w.json';
            let lineUrl = this.BASECONFIG.ROAD_LINE_JSON_URL + '/line_dataG1-7.json';//G1-G7完整数据
            //let lineUrl = this.BASECONFIG.ROAD_LINE_JSON_URL + '/line_data_thins.json';//稀释数据

            newaxios.get(lineUrl).then((res)=>{
                if(res){
                    let records = res.data;//JSON.parse(data);

                    //console.info('new_road      ',records.length);

                    layer.setData(records, {
                        lnglat: 'LINE_POINT_JSON'
                    });

                    layer.setOptions({
                        style: {
                            borderWidth: 2,
                            opacity: 0.7,
                            color:'#33a02c'
                            /!*color: function(v){
                                /!*var id = v.value.line_id;
                                var len = colors.length;*!/
                                let rd = parseInt(Math.random()*3);
                                return rd === 3 ? '#e31a1c' : rd === 2 ? '#fdbf6f' : '#33a02c';//colors[id % len];
                            },*!/
                        }
                    });

                    layer.render();

                }
            }).catch((e)=>{
                console.info(e);
            });*/

      //this.mapInstance.setZoomAndCenter(18, [record.data.position[0], record.data.position[1]]);
    },

    /**
     * 地图大小、层级等变化
     */
    mapChanged() {
      //console.info('mapChanged',e);
      let that = this;
      //0.5秒防抖
      clearTimeout(window.setMapTimeout);
      window.setMapTimeout = setTimeout(function() {
        // console.info('更新摄像头数据');
        //地图层级变动，清除marker的title信息框
        if (that.infoWindow) {
          that.infoWindow.close();
        }
        that.$emit("amap-changed", that.currentAreaNode.adcode);
      }, 500);
      /*let that = this;
            //增加防抖保护
            that.Utils.debounce(function(){
                console.info('mapChanged',e);
                that.$emit('amap-changed');
            },1500,false);*/
    },

    /**
     * 创建地图显示内容
     */
    initMapContent() {
      let that = this;

      that.mapInstance.AmbientLight = new AMap.Lights.AmbientLight(
        [1, 1, 1],
        0.3
      );
      that.mapInstance.DirectionLight = new AMap.Lights.DirectionLight(
        [0, 0, 1],
        [1, 1, 1],
        0.5
      );

      AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], function(
        DistrictExplorer
      ) {
        //创建一个实例
        let distExp = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: that.mapInstance,
          zIndex: that.mapZIndexConfig.featureZIndex,
        });

        //监听feature的hover事件
        distExp.on("featureMouseout featureMouseover", function(e, feature) {
          that.toggleHoverFeature(
            feature,
            e.type === "featureMouseover",
            e.originalEvent ? e.originalEvent.lnglat : null
          );
        });

        //监听鼠标在feature上滑动
        distExp.on("featureMousemove", function(e) {
          //更新提示位置
          that.tipMarker.setPosition(e.originalEvent.lnglat);
        });

        /*//feature被点击
        distExp.on("featureClick", function () {
          console.info('featureClick',e);
          //that.loadDefaultAmapEvent();
          that.removeMarker(that.backMark);
        });

        //外部区域被点击
        distExp.on("outsideClick", function () {
          console.info('outsideClick',e);
          //that.loadDefaultAmapEvent();
          that.removeMarker(that.backMark);
        });*/
        //TODO: 地图点击不跳转
        //feature被点击
        distExp.on("featureClick", function(e, feature) {
          //event.stopPropagation();// 阻止冒泡// 阻止冒泡
          //console.info('featureClick',e);

          if (that.cameraMarkVisable) {
            that.cameraInfoWindowClose();
            return false;
          }

          //console.info('featureClick',event);

          if (
            event.target.className.indexOf("overlay-title") >= 0 ||
            event.target.className.indexOf("overlay-canvas") >= 0
          ) {
            return false;
          }
          //console.info(event,event.target.className.indexOf('overlay-title'));

          that.cameraInfoWindowClose();

          var props = feature.properties;

          //console.info('featureClick ', props);

          //如果存在子节点
          if (props.childrenNum > 0) {
            //切换聚焦区域
            that.switch2AreaNode(props.adcode);
          }

          that.$emit("amapClick", [props.adcode, props.name, props.level]);
        });

        //外部区域被点击
        distExp.on("outsideClick", function(e, feature) {
          //console.info('outsideClick',e.properties, feature);

          if (that.cameraMarkVisable) {
            that.cameraInfoWindowClose();
            return false;
          }

          //console.info('outsideClick',event);
          if (
            event.target.className.indexOf("overlay-title") >= 0 ||
            event.target.className.indexOf("overlay-canvas") >= 0
          ) {
            return false;
          }
          //that.cameraInfoWindowClose();

          //console.info('featureClick ', e);
          distExp.locatePosition(
            e.originalEvent.lnglat,
            function(error, routeFeatures) {
              //console.info('featureClick ', routeFeatures);
              let addcode = that.baseTopAdcodes,
                adname = that.baseTopAdcodesName,
                level = "";

              //TODO:切换到全国/本省
              //that.switch2AreaNode(that.baseTopAdcodes);

              if (routeFeatures && routeFeatures.length > 1) {
                addcode = routeFeatures[1].properties.adcode;
                adname = routeFeatures[1].properties.name;
                level = routeFeatures[1].properties.level;

                //TODO: 非全国用户不同省份，限制不可跳转
                if (that.baseTopAdcodes !== 100000) {
                  let baseNum = parseInt(
                      ("" + that.baseTopAdcodes).substr(0, 2)
                    ),
                    nNum = parseInt(("" + addcode).substr(0, 2));
                  if (baseNum !== nNum) {
                    return false;
                  }
                }
                //切换到省级区域
                that.switch2AreaNode(addcode);
              } else {
                //切换到全国/本省
                that.switch2AreaNode(that.baseTopAdcodes);
              }

              that.$emit("amapClick", [addcode, adname, level]);
            },
            {
              levelLimit: 2,
            }
          );
        });
        that.districtExplorer = distExp;

        //全国
        that.switch2AreaNode(that.baseTopAdcodes);
      });
    },

    /**
     * 动态获取摄像机点位图标，类型、状态
     */
    getMarkerIcon(type, status) {
      let that = this,
        iconBase = {};
      if (!status || status === "0") {
        iconBase = that.cameraOfflineImgUrl;
      }
      if (status === "1") {
        iconBase = that.cameraImgUrl;
      }
      if (status === "2") {
        iconBase = that.cameraErrorImgUrl;
      }

      return new AMap.Icon({
        image: iconBase[type] || iconBase["1"],
        size: new AMap.Size(that.cameraIconWidth, that.cameraIconHeight), // 图标尺寸
        //imageOffset : new AMap.Pixel(0-that.cameraIconWidth/2, 0-that.cameraIconHeight),
        imageSize: new AMap.Size(that.cameraIconWidth, that.cameraIconHeight), // 根据所设置的大小拉伸或压缩图片
        //imageOffset : new AMap.Pixel(0-that.cameraIconWidth/2, 0-that.cameraIconHeight),
        //anchor:'bottom-center', // 设置锚点方位
      });
    },

    /**
     * 批量加载点数据,创建摄像机marker
     * @param list
     */
    pointsSetIn(list) {
      //this.markerSetInit(data);
      let that = this,
        markerList = [];

      if (!this.infoWindow) {
        this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30),
        });
      }

      //that.mapInstance.clearMap();
      that.mapInstance.remove(that.currentMarkers);

      if (list.length) {
        let num = list.length;

        // 摄像机图标mouseover事件
        let markerhover = (e) => {
          that.infoWindow.setContent(e.target.content);
          that.infoWindow.open(that.mapInstance, e.target.getPosition());

          that.tipMarker.hide();
          //console.info('that.tipMarker.hide();');
        };

        // 摄像机图标mouseout事件
        let markermouseout = () => {
          // console.log("infoWindow=>触发离开事件");
          that.infoWindow.close();
          that.tipMarker.show();
        };
        //console.info('markerSetInit  ',groupStyleMap['0']);

        // 加载点数据
        for (let i = 0, len = num; i < len; i++) {
          let marker = new AMap.Marker({
            position: [list[i].longitude, list[i].latitude], //new AMap.LngLat(list[i].longitude,list[i].latitude),
            zIndex: that.mapZIndexConfig.markerzIndex,
            //offset: new AMap.Pixel(0 - that.cameraIconWidth/2, 0 -  that.cameraIconHeight),
            offset: new AMap.Pixel(
              0 - that.cameraIconWidth / 2,
              0 - that.cameraIconHeight
            ),
            //icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
            // title: list[i].roadId || list[i].road + ' '+list[i].cameraNum,
            //topWhenClick:true, // 点击置顶
            //draggable:true, // 是否可以拖拽
            //raiseOnDrag:true,// 是否开启点标记离开地图的效果
            //animation:'AMAP_ANIMATION_DROP', // 点掉落效果
            clickable: true,
            icon: that.getMarkerIcon(list[i].classify, list[i].onlineStatus), //  groupStyleMap[list[i].onlineStatus === null ? '0' : list[i].onlineStatus],
            extData: {
              onlineStatus:
                list[i].onlineStatus === null ? 0 : list[i].onlineStatus,
              cameraName: list[i].cameraName,
              cameraId: list[i].cameraId,
              cameraNum: list[i].cameraNum,
              organizationId: list[i].organizationId,
              cameraKmpile: list[i].cameraKmpile,
              cameraHmpile: list[i].cameraHmpile,
              roadId: list[i].roadId || list[i].road, // roadId
              regionCode: list[i].regionCode,
              position: [list[i].longitude, list[i].latitude],
              cameraType: list[i].cameraType,
              kmPile: list[i].kmPile,
              hmPile: list[i].hmPile,
              classify: list[i].classify,
              zoomlevel: list[i].zoomlevel,
            },
          });
          let sta = [
            '<span style="color:#b1bfdc">(离线)</span>',
            "",
            '<span style="color:#fe3708">(故障)</span>'
          ][list[i].onlineStatus];
          marker.content = `K${
            list[i].cameraKmpile ? list[i].cameraKmpile : ""
          }${list[i].cameraHmpile ? "+" + list[i].cameraHmpile : ""}${
            typeof sta === "undefined" ? " (未知)" + list[i].onlineStatus : sta
          }`;

          // 摄像机图标点击事件
          marker.on("click", function(a) {
            //子组件右击编辑窗口开启状态下，点击播放视频失效
            if (that.$refs.amapPlayer.cameraInfoAlongEditVisable) {
              that.$message({
                message: "请关闭修改窗口",
                type: "warning",
              });
              return;
            }

            if (that.chosedMark) that.chosedMark.show();
            that.setSelectCameraIndex(0);

            let cameraInfo = a.target.getExtData();
            console.info("marker click ", a, cameraInfo);

            //a.hide();
            //加载当前播放选中图标
            //that.addEventMarker(a, true);
            /*that.setSelectCameraIndex(record.index);
                        console.log('pointSimplifierIns click ',e,e.type, record);
                        */

            that.$emit("amapMarkerClick", cameraInfo);

            /*if (cameraInfo.onlineStatus === "1")
              that.cameraInfoWindowShow({ data: cameraInfo }, a.pixel || null);*/
          });

          // 摄像机图标右击事件
          marker.on("rightclick", function(a) {
            console.info("marker mousedown ", a.target.getExtData());

            //判断用户是否有修改摄像机权限
            if (!that.editCameraInfoSign) {
              return;
            }

            that.addEventMarker(a);
          });

          // 摄像机图标mouseover事件
          marker.on("mouseover", markerhover);

          // 摄像机图标mouseout事件
          marker.on("mouseout", markermouseout);
          // marker.emit('mouseover', {target: marker});
          //marker.emit('click', {target: marker});

          markerList.push(marker);
        }

        // 创建覆盖物群组，并将 marker 传给 OverlayGroup
        that.currentMarkers = new AMap.OverlayGroup(markerList);
        // that.currentMarkers = markerList;

        that.mapInstance.add(that.currentMarkers);

        /*// 添加覆盖物群组
                function addOverlayGroup() {

                    map.add(overlayGroups);
                }

                // 移除覆盖物群组
                function removeOverlayGroup() {

                    map.remove(overlayGroups);
                }*/
      }
      // 移除已创建的 marker
      //this.mapInstance.remove(marker);
    },

    /**
     * 根据区块Hover状态设置相关样式
     */
    toggleHoverFeature(feature, isHover, position) {
      this.tipMarker.setMap(isHover ? this.mapInstance : null);

      if (!feature) {
        return;
      }

      var props = feature.properties;

      if (isHover) {
        //更新提示内容
        this.$tipMarkerContent.innerHTML = props.name;
        //更新位置
        this.tipMarker.setPosition(position || props.center);
      }

      //更新相关多边形的样式
      var polys = this.districtExplorer.findFeaturePolygonsByAdcode(
        props.adcode
      );
      for (var i = 0, len = polys.length; i < len; i++) {
        polys[i].setOptions({
          strokeColor: isHover ? "#63a5fe" : "#0c2254",
          fillColor: isHover ? "#0e397c" : "#0d4692",
          //fillOpacity: isHover ? 0.5 : 1
          zIndex: isHover
            ? this.mapZIndexConfig.featureZIndex + 1
            : this.mapZIndexConfig.featureZIndex,
        });
      }
    },

    /**
     * 绘制某个区域的边界
     */
    renderAreaPolygons(areaNode) {
      //清除已有的绘制内容
      this.districtExplorer.clearFeaturePolygons();

      /*let fillColor = this.mapLayerType === "google" ? 0 : "#0d4692",
        strokeColor = "#0c2254", // '#0c3574',
        fillOpacity = this.mapLayerType === "google" ? 0 : 1;// 1*/

      let fillColor = this.mapLayerType === "google" ? "#1164ed" : "#1164ed",
        strokeColor = "#08142b", // '#0c3574',
        fillOpacity = this.mapLayerType === "google" ? 0.01 : 0.02; // 1

      if (areaNode.adcode !== 100000) {
        this.districtExplorer.renderSubFeatures(areaNode, {
          cursor: "default",
          bubble: false, // 事件冒泡
          strokeColor: strokeColor, //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: null, // fillColor, //填充色
          fillOpacity: fillOpacity, //填充透明度
          zIndex: this.mapZIndexConfig.featureZIndex,
        });
      }

      //绘制子区域
      /*this.districtExplorer.renderSubFeatures(areaNode, function () {
        return {
          cursor: "default",
          bubble: true,
          strokeColor: strokeColor, //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: fillColor, //填充色
          fillOpacity: fillOpacity, //填充透明度
          zIndex: 1
        };
      });*/

      //绘制父区域
      this.districtExplorer.renderParentFeature(areaNode, {
        cursor: "default",
        bubble: true,
        strokeColor: strokeColor, //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 0, //线宽
        fillColor: fillColor, //填充色
        fillOpacity: 0.4, //填充透明度
        zIndex: this.mapZIndexConfig.featureZIndex,
      });
    },

    /**
     * 加载区域
     */
    loadAreaNode(adcode, callback) {
      let _this = this;

      this.districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
        //console.info('areaNode  ',adcode,areaNode);
        _this.districtExplorer.clearFeaturePolygons();
        if (error) {
          if (callback) {
            callback(error);
          }
          //console.error('loadAreaNode error ', error);
          return;
        }

        if (callback) {
          callback(null, areaNode);
        }
      });

      return false;
    },

    /**
     * 切换区域后刷新显示内容
     */
    refreshAreaNode(areaNode) {
      this.districtExplorer.setHoverFeature(null);

      //更新地图视野
      this.mapInstance.setBounds(areaNode.getBounds());
      this.renderAreaPolygons(areaNode);
    },

    /**
     * 切换显示区域
     */
    switch2AreaNode(adcode, callback) {
      //let currentAreaNode = null;
      if (
        this.currentAreaNode &&
        "" + this.currentAreaNode.getAdcode() === "" + adcode
      ) {
        return;
      }
      let that = this;
      this.loadAreaNode(adcode, function(error, areaNode) {
        if (error) {
          if (callback) {
            callback(error);
          }
          return;
        }
        that.currentAreaNode = areaNode; //this.currentAreaNodeBack =
        //设置当前使用的定位用节点
        that.districtExplorer.setAreaNodesForLocating([that.currentAreaNode]);
        that.refreshAreaNode(areaNode);
        if (callback) {
          callback(null, areaNode);
        }
      });
    },

    /**
     * 鼠标hover，显示对应区块
     *
     * @param adcode
     */
    districtHover(adcode) {
      this.districtExplorer.setHoverFeature(
        this.currentAreaNode.getSubFeatureByAdcode(adcode)
      );
    },

    /**
     * 关闭播放器
     */
    cameraInfoWindowClose() {
      let that = this;

      /*console.log("cameraInfoWindowClose");
            // 关闭信息窗体
            if(that.cameraInfoWindow) that.cameraInfoWindow.close();
            that.cameraInfoWindow = null;*/
      that.cameraMarkVisable = false;
      that.currentPlayCamera = {};
    },

    /**
     * 打开播放器
     * @param record
     */
    cameraInfoWindowShow(record, pixel) {
      let that = this;
      if (record && record.data && record.data.cameraName) {
        //that.currentPlayCamera = record.data;
        console.info("cameraInfoWindowShow ", record, pixel);

        /*// 传入经纬度，设置地图中心点
                let position = new AMap.LngLat(record.data.position[0], record.data.position[1]);  // 标准写法
                // 简写 var position = [116, 39];
                this.mapInstance.setCenter(position);

                //设置显示层级，判断当前点位是否在范围内，否则需要调整层级
                let currZoom = this.mapInstance.getZoom(),//当前层级
                    newZoom = 18,
                    myZoom = parseInt(record.data.zoomlevel) || 0;
                //层级大于当前层级，调整到指定层级
                if(myZoom) {
                    newZoom = myZoom;// 存在特定层级
                    if(myZoom <= currZoom){
                        newZoom = currZoom;// 当前层级已经显示摄像头，不做调整
                    }
                }
                this.mapInstance.setZoom(newZoom);*/

        //marker.setIcon('//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png')

        //this.mapInstance.setZoomAndCenter(18, [record.data.position[0], record.data.position[1]]);

        that.cameraMarkVisable = true;

        //鼠标位置
        if (pixel && pixel.x && pixel.y) {
          that.$refs.amapPlayer.setWindowSite(pixel.x, pixel.y);
        }
        setTimeout(() => {
          that.$refs.amapPlayer.getVideoUrlToPlay(record.data);
        }, 1000);
      }
    },

    /**
     * marker标记点击效果
     * @param data
     * @param flag      true    播放状态添加
     *                  false   右击修改状态添加
     */
    addEventMarker(obj, flag = false) {
      let that = this,
        data = obj.target.getExtData();
      if (!data) {
        return false;
      }

      //当前选中的摄像头
      that.chosedMark = obj.target;
      obj.target.hide();

      //移除marker图标
      this.removeMarker(this.backMark);

      let ctype =
        data.classify === "0" || data.classify === "9" ? "1" : data.classify;
      ctype = data.classify === "4" ? "5" : ctype;

      //加载图标属性
      var eventCameraMarker = new AMap.Marker({
        position: data.position,
        map: this.mapInstance,
        cursor: "move",
        draggable: that.editCameraInfoSign, // 是否可以拖拽
        zIndex: this.mapZIndexConfig.markerzIndex,
        icon: new AMap.Icon({
          // 状态图片
          image: this.cameraGifUrl[ctype],
          size: new AMap.Size(this.cameraIconWidth, this.cameraIconHeight), // 图标尺寸
          //imageOffset : new AMap.Pixel(0-this.cameraIconWidth/2, 0-this.cameraIconHeight),
          imageSize: new AMap.Size(this.cameraIconWidth, this.cameraIconHeight), // 根据所设置的大小拉伸或压缩图片
        }),
        offset: new AMap.Pixel(
          0 - that.cameraIconWidth / 2,
          0 - that.cameraIconHeight
        ),
        // offset : new AMap.Pixel(-10, -10),
      });

      let sta = [
        '<span style="color:#b1bfdc">(离线)</span>',
        "",
        '<span style="color:#fe3708">(故障)</span>'
      ][data.onlineStatus];
      eventCameraMarker.content = `K${
        data.cameraKmpile ? data.cameraKmpile : ""
      }${data.cameraHmpile ? "+" + data.cameraHmpile : ""}${sta || ""}`;
      eventCameraMarker.on("mouseover", (e) => {
        that.infoWindow.setContent(e.target.content);
        that.infoWindow.open(that.mapInstance, e.target.getPosition());
        that.tipMarker.hide();
      });
      eventCameraMarker.on("mouseout", () => {
        that.infoWindow.close();
        that.tipMarker.show();
      });

      if (that.editCameraInfoSign) {
        // marker点拖动结束事件
        /*eventCameraMarker.on("dragend", function (a) {
          console.log("dragend=>", a);
          var wgs84 = that.$gcoord.transform(
            [a.lnglat.Q, a.lnglat.P],
            that.$gcoord.GCJ02,
            that.$gcoord.WGS84
          );
          console.log("wgs84=>", wgs84);

          that.$root.$emit("updateCameraLnglatForm", {
            position: { lon: wgs84[0], lat: wgs84[1] - 0.00008 },
            flag: flag
          });
        });*/

        eventCameraMarker.on("dragend", function(a) {
          //let wgs84 = that.$gcoord.transform([a.lnglat.R, a.lnglat.Q] ,that.$gcoord.GCJ02,that.$gcoord.WGS84);
          let wgs84 = that.$gcoord.transform(
            [a.lnglat.R, a.lnglat.Q],
            that.$gcoord.GCJ02,
            that.$gcoord.WGS84
          );
          //console.log('dragend=>',a,wgs84);
          that.$root.$emit("updateCameraLnglatForm", {
            position: { lon: wgs84[0], lat: wgs84[1] },
            flag: flag,
          });
          //that.$root.$emit('updateCameraLnglatForm',{position : {lon:a.lnglat.lng,lat:a.lnglat.lat}, flag : flag});
        });
        eventCameraMarker.on("dragging", function(a) {
          //console.log('dragging=>',a);
          //let wgs84 = that.$gcoord.transform([a.lnglat.Q, a.lnglat.R],that.$gcoord.GCJ02,that.$gcoord.WGS84);
          //that.$root.$emit('updateCameraLnglatForm',{position : {lon:wgs84[1]-0.00008,lat:wgs84[0]}, flag : flag});
          that.$root.$emit("updateCameraLnglatForm", {
            position: { lon: a.lnglat.lng, lat: a.lnglat.lat },
            flag: flag,
          });
        });
      }

      this.mapInstance.add(eventCameraMarker);
      this.backMark = eventCameraMarker;

      if (flag) {
        return;
      }
      //调用AmapPlayerDialog子组件方法，展示修改弹窗
      this.$root.$emit("setCameraInfoAlongEditVisable", true);
      this.$root.$emit("setCameraInfoAlongForm", data);
    },

    /**
     * 移除marker标记
     * @param flag  marker数据
     */
    removeMarker(flag) {
      if (!flag) return;
      this.mapInstance.remove(flag);
    },

    loadDefaultAmapEvent() {
      //console.info('loadDefaultAmapEvent ',this.backMark);
      this.$root.$off("removeEventMarker");
      this.$root.$off("editEventMarkerLonlat");

      //移除地图正在处理的marker标记
      this.$root.$on("removeEventMarker", () => {
        this.removeMarker(this.backMark);
        this.chosedMark.show();
      });

      //设置marker点位置
      this.$root.$on("editEventMarkerLonlat", (nv) => {
        this.backMark.setPosition(nv);
      });
    },
  },
};
