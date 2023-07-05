<template>
  <!--地图容器-->
  <div style="height:100%;width:100%;">
    <!--<video-player ref="videoPlayer" :playsinline="true" :options="playerOptions" class="video-player vjs-custom-skin"
                      @ready="playerReadied"></video-player> :current-camera="currentPlayCamera" -->
    <div
      id="mapcontainer"
      style="height:100%;width:100%;overflow: visible;"
    ></div>
    <amap-player
      ref="amapPlayer"
      :visible.sync="cameraMarkVisable"
    ></amap-player>
    <div ></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
/*import aliPlayer from '@/components/AliPlayer'*/
import amapPlayer from "@/components/AmapPlayerDialog";

export default {
  name: "amap",
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
    return {
      mapInstance: null,
      districtExplorer: null,
      currentAreaNode: null,
      $tipMarkerContent: null,
      tipMarker: null,
      pointSimplifierIns: null,

      /*cameraImgUrl                     : require('@/assets/camera.gif'),
                cameraOfflineImgUrl              : require('@/assets/camera_offline.gif'),
                cameraErrorImgUrl                : require('@/assets/camera_error.gif'),*/
      cameraImgUrl: require("@/assets/map/normal.png"),
      cameraOfflineImgUrl: require("@/assets/map/off-line.png"),
      cameraErrorImgUrl: require("@/assets/map/abnormal.png"),
      cameraImgBtnUrl: require("@/assets/map/normal-btn.png"),
      cameraOfflineImgBtnUrl: require("@/assets/map/off-line-btn.png"),
      cameraErrorImgBtnUrl: require("@/assets/map/abnormal-btn.png"),
      cameraIconWidth: 19, //35,
      cameraIconHeight: 24, //42,

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
      infoWindow: null,
      editCameraInfoSign: false, //用户修改摄像机权限
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
      //路网
      var roadNet = new AMap.TileLayer.RoadNet({
        zIndex: 999,
      });
      //基础地图
      var baseLayer = new AMap.TileLayer({
        zooms: [0, 15], //可见级别
        visible: true, //是否可见
        opacity: 1, //透明度
        zIndex: 0, //叠加层级
      });
      //卫星地图
      /*var layer = new AMap.TileLayer.Satellite({
                    zooms:[15,20],    //可见级别
                    //visible:true,    //是否可见
                    opacity:1,       //透明度
                    zIndex:0         //叠加层级
                });*/

      var googleLayer = new AMap.TileLayer.Satellite({
        zooms: [15, 24], //可见级别
        getTileUrl:
          "http://mt2.google.cn/vt/lyrs=s@817&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
        zIndex: 20,
        //tileUrl : 'http://www.google.cn/maps/vt?lyrs=s@817&gl=cn&x=[x]&y=[y]&z=[z]',
        opacity: 1,
      });

      this.mapInstance = new AMap.Map("mapcontainer", {
        cursor: "default",
        resizeEnable: true,
        animateEnable: true,
        disableSocket: true,
        autoSetFitView: false,
        //viewMode: '3D',
        //showLabel: false,//不显示地图文字标记
        labelzIndex: 130,
        topAdcodes: [that.baseTopAdcodes],
        pitch: 0,
        zoom: 4.5,
        mapStyle: "amap://styles/b7f705be4f2be54091ca786949404f82",
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
          if (zom >= 15) {
            //清除已有的绘制内容
            that.districtExplorer.clearFeaturePolygons();
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

        //that.showLineLayer();
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

    showLineLayer() {
      let that = this;
      let layer = new Loca.LineLayer({
        map: that.mapInstance,
        fitView: true,
        //zooms:[0,15],    //可见级别
        visible: true, //是否可见
        opacity: 1, //透明度
        zIndex: 1000, //叠加层级
      });

      let start = [];
      let lines = [
        {
          line_id: "110100010117",
          line_name: "路段线",
          lnglat: [
            [118.678101, 31.644449],
            [118.678246, 31.644571],
            [118.67984, 31.645641],
            [118.680695, 31.646185],
            [118.68222, 31.647039],
            [118.684052, 31.647911],
            [118.686485, 31.64888],
            [118.689194, 31.649805],
            [118.693031, 31.651056],
            [118.694542, 31.651611],
            [118.696251, 31.652231],
            [118.696297, 31.652248],
            [118.698967, 31.65336],
            [118.700478, 31.654032],
            [118.70224, 31.654861],
            [118.706635, 31.657091],
            [118.707985, 31.657734],
            [118.710457, 31.658829],
            [118.713211, 31.659895],
            [118.716133, 31.660942],
            [118.717255, 31.661375],
            [118.718254, 31.661798],
            [118.719246, 31.662209],
            [118.720123, 31.662596],
            [118.720375, 31.662708],
            [118.721588, 31.663273],
            [118.722527, 31.663725],
            [118.723503, 31.66423],
            [118.724319, 31.664658],
            [118.725197, 31.665138],
            [118.726593, 31.665934],
            [118.727966, 31.666758],
            [118.729439, 31.667709],
            [118.73616, 31.672153],
            [118.738327, 31.673512],
            [118.738457, 31.67358],
            [118.739845, 31.674393],
            [118.740234, 31.674604],
            [118.740837, 31.67494],
            [118.741982, 31.675547],
            [118.742821, 31.675974],
            [118.744377, 31.676735],
            [118.745712, 31.677349],
            [118.747025, 31.677925],
            [118.748268, 31.678442],
            [118.75029, 31.679222],
            [118.751961, 31.679827],
            [118.753464, 31.680325],
            [118.75518, 31.680855],
            [118.756302, 31.681175],
            [118.762207, 31.682911],
            [118.766045, 31.684031],
            [118.766846, 31.684244],
            [118.768135, 31.68457],
            [118.769119, 31.684809],
            [118.770531, 31.685122],
            [118.772285, 31.685465],
            [118.774498, 31.685833],
            [118.775536, 31.68598],
            [118.777077, 31.686176],
            [118.778008, 31.686275],
            [118.780907, 31.686512],
            [118.781235, 31.686533],
            [118.782402, 31.686588],
            [118.784027, 31.68664],
            [118.78418, 31.68664],
            [118.787926, 31.68672],
            [118.790482, 31.686781],
            [118.791733, 31.686831],
            [118.793449, 31.686939],
            [118.795731, 31.68714],
            [118.798134, 31.687428],
            [118.800865, 31.687851],
            [118.802513, 31.688078],
            [118.804741, 31.688311],
            [118.806152, 31.688425],
            [118.806961, 31.68848],
            [118.808319, 31.688541],
            [118.809181, 31.688572],
            [118.810837, 31.688589],
            [118.812584, 31.688572],
            [118.813766, 31.688528],
            [118.814949, 31.688471],
            [118.816116, 31.688425],
            [118.817284, 31.688406],
            [118.817429, 31.688406],
            [118.818977, 31.688406],
            [118.82045, 31.688446],
            [118.821609, 31.688488],
            [118.822968, 31.68858],
            [118.823997, 31.688662],
            [118.825157, 31.68877],
            [118.82753, 31.689062],
            [118.828125, 31.689148],
            [118.828674, 31.689232],
            [118.829941, 31.689449],
            [118.830894, 31.689627],
            [118.832474, 31.689951],
            [118.833549, 31.690195],
            [118.83445, 31.690422],
            [118.835312, 31.690641],
            [118.836708, 31.691029],
            [118.838364, 31.691534],
            [118.839859, 31.692032],
            [118.843193, 31.693243],
            [118.844643, 31.693733],
            [118.845474, 31.693998],
            [118.847359, 31.694553],
            [118.848373, 31.694832],
            [118.849403, 31.695082],
            [118.850098, 31.695242],
            [118.85041, 31.695318],
            [118.851433, 31.695541],
            [118.851486, 31.695555],
            [118.853394, 31.695925],
            [118.854637, 31.696138],
            [118.85598, 31.696339],
            [118.857506, 31.696533],
            [118.859207, 31.696707],
            [118.865021, 31.697227],
            [118.867905, 31.697487],
            [118.869843, 31.697626],
            [118.87117, 31.697668],
            [118.871742, 31.697674],
            [118.87207, 31.697674],
            [118.873512, 31.697645],
            [118.874466, 31.697592],
            [118.875557, 31.6975],
            [118.876808, 31.697372],
            [118.878471, 31.697136],
            [118.879997, 31.696854],
            [118.881699, 31.696453],
            [118.882919, 31.696133],
            [118.883606, 31.695929],
            [118.884735, 31.695555],
            [118.885056, 31.695442],
            [118.88623, 31.695013],
            [118.888268, 31.694214],
            [118.894043, 31.691904],
            [118.89566, 31.691261],
            [118.897194, 31.690651],
            [118.898117, 31.690287],
            [118.898972, 31.689945],
            [118.899818, 31.6896],
            [118.900063, 31.689505],
            [118.90136, 31.688993],
            [118.903091, 31.688356],
            [118.903854, 31.688087],
            [118.905022, 31.6877],
            [118.905327, 31.687599],
            [118.905792, 31.687449],
            [118.907616, 31.686897],
            [118.908508, 31.686653],
            [118.909698, 31.686333],
            [118.911209, 31.685968],
            [118.913002, 31.685574],
            [118.914612, 31.685247],
            [118.915558, 31.685078],
            [118.916016, 31.685011],
            [118.917595, 31.684753],
            [118.91893, 31.68457],
            [118.919662, 31.684475],
            [118.921341, 31.684294],
            [118.922714, 31.684175],
            [118.925385, 31.684006],
            [118.925659, 31.683992],
            [118.926605, 31.683962],
            [118.927513, 31.683937],
            [118.928497, 31.68392],
            [118.930183, 31.683929],
            [118.93457, 31.683989],
            [118.937981, 31.684027],
            [118.941162, 31.684063],
            [118.943398, 31.68409],
            [118.946999, 31.684149],
            [118.948547, 31.68424],
            [118.949104, 31.68428],
            [118.949936, 31.684359],
            [118.95105, 31.684509],
            [118.951385, 31.68457],
            [118.952179, 31.68471],
            [118.953705, 31.685036],
            [118.9543, 31.685186],
            [118.954811, 31.685329],
            [118.956215, 31.685764],
            [118.957283, 31.686165],
            [118.958397, 31.686623],
            [118.959518, 31.687132],
            [118.959961, 31.687353],
            [118.960541, 31.687651],
            [118.961197, 31.688015],
            [118.963188, 31.689175],
            [118.963928, 31.68961],
            [118.965752, 31.690628],
            [118.968109, 31.691853],
            [118.969246, 31.69241],
            [118.970901, 31.693195],
            [118.973389, 31.694284],
            [118.975121, 31.694983],
            [118.976631, 31.695555],
            [118.976776, 31.695608],
            [118.977928, 31.69603],
            [118.979103, 31.696428],
            [118.980476, 31.696894],
            [118.981926, 31.69734],
            [118.98259, 31.697536],
            [118.983299, 31.697739],
            [118.984291, 31.698015],
            [118.985146, 31.698246],
            [118.986694, 31.698633],
            [118.987389, 31.698803],
            [118.987816, 31.698898],
            [118.988243, 31.698994],
            [118.988678, 31.699089],
            [118.989601, 31.699289],
            [118.991028, 31.699577],
            [118.991585, 31.699675],
            [118.99633, 31.700533],
            [119.003899, 31.701902],
            [119.003975, 31.701908],
            [119.005219, 31.702122],
            [119.013107, 31.703543],
            [119.014076, 31.703716],
            [119.016388, 31.704062],
            [119.018341, 31.704313],
            [119.019966, 31.704489],
            [119.02095, 31.704586],
            [119.023537, 31.704773],
            [119.024734, 31.704836],
            [119.025368, 31.704863],
            [119.025879, 31.704887],
            [119.025993, 31.704895],
            [119.028008, 31.704927],
            [119.033905, 31.705082],
            [119.037163, 31.705156],
          ],
        },
      ];

      let colors = [
        "#07E8E4",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
      ];

      layer.setData(lines, {
        lnglat: "lnglat",
      });

      layer.setOptions({
        style: {
          borderWidth: 8,
          opacity: 0.7,
          color: function(v) {
            var id = v.value.line_id;
            var len = colors.length;
            return "#33a02c"; //colors[id % len];
          },
        },
      });

      layer.render();
      //this.mapInstance.setZoomAndCenter(18, [record.data.position[0], record.data.position[1]]);
    },

    /**
     * 地图大小、层级等变化
     */
    mapChanged(e) {
      //console.info('mapChanged',e);
      let that = this;
      //1.5秒防抖
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
        DistrictExplorer,
        $
      ) {
        //创建一个实例
        let distExp = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: that.mapInstance,
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
        distExp.on("featureMousemove", function(e, feature) {
          //更新提示位置
          that.tipMarker.setPosition(e.originalEvent.lnglat);
        });

        //feature被点击
        distExp.on("featureClick", function(e, feature) {
          //event.stopPropagation();// 阻止冒泡// 阻止冒泡

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
        distExp.on("outsideClick", function(e) {
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

        that.pointSetInit();
      });
    },

    markerSetInit(list) {
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

        let groupStyleMap = {
          "0": new AMap.Icon({
            image: that.cameraOfflineImgUrl,
            size: new AMap.Size(that.cameraIconWidth, that.cameraIconHeight), // 图标尺寸
            //imageOffset : new AMap.Pixel(0-that.cameraIconWidth/2, 0-that.cameraIconHeight),
            imageSize: new AMap.Size(
              that.cameraIconWidth,
              that.cameraIconHeight
            ), // 根据所设置的大小拉伸或压缩图片
          }),
          "1": new AMap.Icon({
            image: that.cameraImgUrl,
            size: new AMap.Size(that.cameraIconWidth, that.cameraIconHeight), // 图标尺寸
            //imageOffset : new AMap.Pixel(0-that.cameraIconWidth/2, 0-that.cameraIconHeight),
            imageSize: new AMap.Size(
              that.cameraIconWidth,
              that.cameraIconHeight
            ), // 根据所设置的大小拉伸或压缩图片
          }),
          "2": new AMap.Icon({
            image: that.cameraErrorImgUrl,
            size: new AMap.Size(that.cameraIconWidth, that.cameraIconHeight), // 图标尺寸
            //imageOffset : new AMap.Pixel(0-that.cameraIconWidth/2, 0-that.cameraIconHeight),
            imageSize: new AMap.Size(
              that.cameraIconWidth,
              that.cameraIconHeight
            ), // 根据所设置的大小拉伸或压缩图片
          }),
        };

        //console.info('markerSetInit  ',groupStyleMap['0']);

        // 加载点数据
        for (let i = 0, len = num; i < len; i++) {
          let marker = new AMap.Marker({
            position: [list[i].longitude, list[i].latitude], //new AMap.LngLat(list[i].longitude,list[i].latitude),
            zIndex: 1000,
            //offset: new AMap.Pixel(0 - that.cameraIconWidth/2, 0 -  that.cameraIconHeight),
            //icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
            // title: list[i].roadId || list[i].road + ' '+list[i].cameraNum,
            //topWhenClick:true, // 点击置顶
            //draggable:true, // 是否可以拖拽
            //raiseOnDrag:true,// 是否开启点标记离开地图的效果
            //animation:'AMAP_ANIMATION_DROP', // 点掉落效果
            clickable: true,
            icon:
              groupStyleMap[
                list[i].onlineStatus === null ? "0" : list[i].onlineStatus
              ],
            extData: {
              onlineStatus:
                list[i].onlineStatus === null ? 0 : list[i].onlineStatus,
              cameraName: list[i].cameraName,
              cameraId: list[i].cameraId,
              cameraNum: list[i].cameraNum,
              organizationId: list[i].organizationId,
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
          marker.content = `K${
            list[i].cameraKmpile ? list[i].cameraKmpile : ""
          }+${list[i].cameraHmpile ? list[i].cameraHmpile : ""}`;

          // 摄像机图标点击事件
          marker.on("click", function(a) {
            console.info("marker click ", a);

            //子组件右击编辑窗口开启状态下，点击播放视频失效
            if (that.$refs.amapPlayer.cameraInfoAlongEditVisable) {
              that.$message({
                message: "请关闭修改窗口",
                type: "warning",
              });
              return;
            }

            that.setSelectCameraIndex(0);

            //加载当前播放选中图标
            that.addEventMarker(a.target.getExtData(), true);
            /*that.setSelectCameraIndex(record.index);
                            console.log('pointSimplifierIns click ',e,e.type, record);
                            */
            that.cameraInfoWindowShow({ data: a.target.getExtData() });
          });

          // 摄像机图标右击事件
          marker.on("rightclick", function(a) {
            console.info("marker mousedown ", a.target.getExtData());

            //判断用户是否有修改摄像机权限
            if (!that.editCameraInfoSign) {
              return;
            }

            that.addEventMarker(a.target.getExtData());
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

        // 摄像机图标mouseover事件
        function markerhover(e) {
          that.infoWindow.setContent(e.target.content);
          that.infoWindow.open(that.mapInstance, e.target.getPosition());
        }

        // 摄像机图标mouseout事件
        function markermouseout(e) {
          // console.log("infoWindow=>触发离开事件");
          that.infoWindow.close();
        }

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
     * 初始化点显示控件，海量点形式
     */
    pointSetInit() {
      let that = this;

      AMapUI.load(["ui/misc/PointSimplifier", "lib/$"], function(
        PointSimplifier,
        $
      ) {
        if (!PointSimplifier.supportCanvas) {
          that.$message.error("当前环境不支持 Canvas！");
          return;
        }

        function onIconLoad() {
          that.pointSimplifierIns.renderLater();
        }

        function onIconError(e) {
          that.$message.error("摄像头图标加载失败！");
        }

        let groupStyleMap = {
          "0": {
            pointStyle: {
              //绘制点占据的矩形区域
              //content: PointSimplifier.Render.Canvas.getImageContent(that.cameraOfflineImgBtnUrl, onIconLoad, onIconError),
              content: PointSimplifier.Render.Canvas.getImageContent(
                that.cameraOfflineImgUrl,
                onIconLoad,
                onIconError
              ),
              //宽度
              width: that.cameraIconWidth,
              //高度
              height: that.cameraIconHeight,
              //定位点为中心
              //offset: ['-50%', '-50%'],
              offset: ["-50%", "-100%"],
              //fillStyle: null,
              fillStyle: null,
              strokeStyle: null,
              //strokeStyle: null,
            },
          },
          "1": {
            pointStyle: {
              //绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                that.cameraImgUrl,
                onIconLoad,
                onIconError
              ),
              //宽度
              width: that.cameraIconWidth,
              //高度
              height: that.cameraIconHeight,
              //定位点为中心
              //offset: ['-50%', '-50%'],
              offset: ["-50%", "-100%"],
              fillStyle: null,
              strokeStyle: null,
              // strokeStyle: null
              //drawShadowPoint:true,
            },
          },
          "2": {
            pointStyle: {
              //绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                that.cameraErrorImgUrl,
                onIconLoad,
                onIconError
              ),
              //宽度
              width: that.cameraIconWidth,
              //高度
              height: that.cameraIconHeight,
              //定位点为中心
              //offset: ['-50%', '-50%'],
              offset: ["-50%", "-100%"],
              fillStyle: null,
              strokeStyle: null,
              //drawShadowPoint:true,
            },
          },
        };

        let pointSimplifierIns = new PointSimplifier({
          map: that.mapInstance, //所属的地图实例
          zIndex: 300,
          autoSetFitView: false,
          compareDataItem: function(a, b, aIndex, bIndex) {
            //数据源中靠后的元素优先，index大的排到前面去
            return aIndex > bIndex ? -1 : 1;
          },
          getPosition: function(item) {
            if (!item) {
              return null;
            }
            var parts = item.position;
            //返回经纬度
            return [parseFloat(parts[0]), parseFloat(parts[1])];
          },
          getHoverTitle: function(dataItem, idx) {
            //console.info('getHoverTitle ',dataItem);
            return (
              dataItem.roadId +
              " " +
              dataItem.cameraName +
              "  [" +
              ["离线", "在线", "故障"][dataItem.onlineStatus] +
              "]"
            ); //JSON.stringify(dataItem);
          },
          //使用GroupStyleRender
          renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            /*drawQuadTree: false,
                            drawPositionPoint: false,
                            drawShadowPoint: false,
                            disableHardcoreWhenPointsNumBelow: 0,*/
            pointStyle: {
              //绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                that.cameraImgUrl,
                onIconLoad,
                onIconError
              ),
              //宽度
              width: that.cameraIconWidth,
              //高度
              height: that.cameraIconHeight,
              //定位点为中心
              //offset: ['-50%', '-50%'],
              offset: ["-50%", "-100%"],
              fillStyle: null,
              strokeStyle: null,
              // strokeStyle: null
              //drawShadowPoint:true,
            },
            //聚合不显示红色块
            topNAreaStyle: {
              autoGlobalAlphaAlpha: true,
              content: "none",
              fillStyle: "#e25c5d",
              lineWidth: 1,
              strokeStyle: null,
            },
            /*pointHardcoreStyle: {
                                "content": "none",
                                //宽度
                                width: that.cameraIconWidth,
                                //高度
                                height: that.cameraIconHeight,
                                "lineWidth": 1,
                                "fillStyle": null,
                                "strokeStyle": null
                            },
                            //定位点
                            pointPositionStyle: {
                                "content": "none",
                                //宽度
                                width: that.cameraIconWidth,
                                //高度
                                height: that.cameraIconHeight,
                                "lineWidth": 1,
                                "strokeStyle": null,
                                "fillStyle": "#cc0000"
                            },*/
            //鼠标hover时显示的title样式
            hoverTitleStyle: {
              classNames: "my-hover-title",
              offset: [0, -15],
              position: "top",
            },
            //鼠标hover时的覆盖点
            pointHoverStyle: {
              //宽度
              width: that.cameraIconWidth,
              //高度
              height: that.cameraIconHeight * 2,
              content: "none",
              fillStyle: null,
              lineWidth: 2,
              strokeStyle: "#ffa500",
            },
            //空间被占用的点
            /*shadowPointStyle: {
                                "fillStyle": "rgba(0,0,0,0.2)",
                                "content": "none",
                                //宽度
                                //width: that.cameraIconWidth,
                                //高度
                                //height: that.cameraIconHeight,
                                //"lineWidth": 1,
                                //"strokeStyle": null
                            },*/
            getGroupId: function(item, idx) {
              return item.onlineStatus;
            },
            groupStyleOptions: function(gid) {
              //console.info('groupStyleOptions   ',gid);
              return groupStyleMap[gid];
            },
          },
        });
        that.pointSimplifierIns = pointSimplifierIns;
        //that.pointsSetIn();
        //TODO: 摄像头点位单击事件
        // pointMouseover pointMouseout pointClick
        that.pointSimplifierIns.on("pointClick", function(e, record) {
          that.setSelectCameraIndex(record.index);
          console.log("pointSimplifierIns click ", e, e.type, record);

          that.cameraInfoWindowShow(record);

          /*!// 创建 infoWindow 实例
                        that.cameraInfoWindow = new AMap.InfoWindow({
                            isCustom: true,  //使用自定义窗体
                            content: that.createInfoWindow(record.data),  //传入 dom 对象，或者 html 字符串
                            offset: new AMap.Pixel(0, -30)
                        });
                        // 在指定位置打开已创建的信息窗体
                        var position = new AMap.LngLat(record.data.position[0],record.data.position[1]);
                        that.cameraInfoWindow.open(that.mapInstance, position);*/
          // 关闭信息窗体
          //that.cameraInfoWindow.close();
          //console.info(event);
          //event.stopPropagation();// 阻止冒泡
        });

        //TODO: 摄像头点位悬浮事件
        that.pointSimplifierIns.on("pointMouseover", function(e, record) {
          let _event = e;
          console.log("pointMouseover=>", e, e.type, record);
          document.getElementsByClassName(
            "overlay-canvas"
          )[0].onmousedown = function(event) {
            if (event.button == 2) {
              console.log("右击触发", _event);
              console.log("右击触发record=>", record);

              that.$root.$emit("setCameraInfoAlongEditVisable", true);
              that.$root.$emit("setCameraInfoAlongForm", record.data);
            }
          };
          // console.log(document.getElementsByClassName("base-canvas"));
        });
      });
    },

    /**
     * 动态显示点样式
     */
    startAnim() {
      let _this = this;
      let renderOptions = _this.pointSimplifierIns.getRenderOptions();

      //获得pointStyle
      let pointStyle = renderOptions.pointStyle;

      let size = pointStyle.width,
        range = [20, 60],
        step = size < range[1] ? 1 : -1;

      pointStyle.width = 80;
      pointStyle.height = 90;

      //重新绘制
      _this.pointSimplifierIns.render();

      //console.info('renderOptions  ',renderOptions);

      //pointSimplifierIns.getRender().getLayer().set('alwaysRender', true);

      /*function anim() {

                    size += step;

                    //修改pointStyle
                    pointStyle.width = pointStyle.height = size;

                    //重新绘制
                    _this.pointSimplifierIns.render();

                    if (size >= range[1]) {
                        step = -1;
                    } else if (size <= range[0]) {
                        step = 1;
                    }

                    //window.requestAnimationFrame(anim);
                    //
                    setTimeout(anim, 100);
                }

                anim();*/
    },

    /**
     * 批量加载点数据
     */
    pointsSetIn(data) {
      this.markerSetInit(data);
      return false;

      let that = this;

      that.pointSimplifierIns.setData([]); //清除所有点

      if (data.length) {
        //加载点数据
        function createPoints(list) {
          var resdata = [],
            num = list.length;
          for (var i = 0, len = num; i < len; i++) {
            resdata.push({
              position: [list[i].longitude, list[i].latitude],
              onlineStatus:
                list[i].onlineStatus === null ? 0 : list[i].onlineStatus,
              cameraName: list[i].cameraName,
              cameraId: list[i].cameraId,
              cameraNum: list[i].cameraNum,
              organizationId: list[i].organizationId,
              roadId: list[i].roadId || list[i].road, // roadId
              regionCode: list[i].regionCode,
              //classIfy: list[i].classIfy,
              kmPile: list[i].kmPile,
              hmPile: list[i].hmPile,
              classify: list[i].classify,
              cameraType: list[i].cameraType,
              zoomlevel: list[i].zoomlevel,
            });
          }
          return resdata;
        }

        let pdata = createPoints(data);

        //设置数据源，data需要是一个数组
        that.pointSimplifierIns.setData(pdata);

        //that.pointSimplifierIns.renderLater(200);

        //this.startAnim();
      }
    },

    /**
     * 根据Hover状态设置相关样式
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
          fillOpacity: isHover ? 0.5 : 0.8,
        });
      }
    },

    /**
     * 绘制某个区域的边界
     */
    renderAreaPolygons(areaNode) {
      //清除已有的绘制内容
      this.districtExplorer.clearFeaturePolygons();

      var fillColor = "#147ea1";
      var strokeColor = "#32cbe0";

      //绘制子区域
      this.districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
        return {
          cursor: "default",
          bubble: true,
          strokeColor: strokeColor, //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: fillColor, //填充色
          fillOpacity: 0.8, //填充透明度
          zIndex: 1,
        };
      });

      //绘制父区域
      this.districtExplorer.renderParentFeature(areaNode, {
        cursor: "default",
        bubble: true,
        strokeColor: strokeColor, //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: fillColor, //填充色
        fillOpacity: 0.3, //填充透明度
        zIndex: 1,
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
     * 切换区域
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

    /*createInfoWindow(record){

                this.cameraVideoInfo = record;

                //document.getElementById('camera-info-window-view').style.display = 'block';

                this.cameraMarkVisable = true;

                this.videoDialogElement = document.getElementById('camera-info-window-view');

                //return document.getElementById('camera-info-window');//document.getElementById('camera-info-window-view').innerHTML;//document.getElementById('camera-info-window');
            },*/
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
    cameraInfoWindowShow(record) {
      let that = this;
      if (record && record.data && record.data.cameraName) {
        //that.currentPlayCamera = record.data;
        //console.info('cameraInfoWindowShow ',record);
        //
        // 传入经纬度，设置地图中心点
        let position = new AMap.LngLat(
          record.data.position[0],
          record.data.position[1]
        ); // 标准写法
        // 简写 var position = [116, 39];
        this.mapInstance.setCenter(position);

        //设置显示层级，判断当前点位是否在范围内，否则需要调整层级
        let currZoom = this.mapInstance.getZoom(), //当前层级
          newZoom = 18,
          myZoom = parseInt(record.data.zoomlevel) || 0;
        //层级大于当前层级，调整到指定层级
        if (myZoom) {
          newZoom = myZoom; // 存在特定层级
          if (myZoom <= currZoom) {
            newZoom = currZoom; // 当前层级已经显示摄像头，不做调整
          }
        }
        this.mapInstance.setZoom(newZoom);

        //marker.setIcon('//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png')

        //this.mapInstance.setZoomAndCenter(18, [record.data.position[0], record.data.position[1]]);

        setTimeout(() => {
          that.cameraMarkVisable = true;
          that.$refs.amapPlayer.getVideoUrlToPlay(record.data);
        }, 1000);
      }
    },

    /**
     * 新增marker标记
     * @param data
     * @param flag      true    播放状态添加
     *                  false   右击修改状态添加
     */
    addEventMarker(data, flag = false) {
      let that = this;
      //移除marker图标
      this.removeMarker(this.backMark);

      //加载图标属性
      var eventCameraMarker = new AMap.Marker({
        position: data.position,
        map: this.mapInstance,
        cursor: "move",
        draggable: that.editCameraInfoSign, // 是否可以拖拽
        zIndex: 1001,
        icon: new AMap.Icon({
          // 状态图片
          image: this.cameraOfflineImgUrl,
          size: new AMap.Size(this.cameraIconWidth, this.cameraIconHeight), // 图标尺寸
          //imageOffset : new AMap.Pixel(0-this.cameraIconWidth/2, 0-this.cameraIconHeight),
          imageSize: new AMap.Size(this.cameraIconWidth, this.cameraIconHeight), // 根据所设置的大小拉伸或压缩图片
        }),
        // offset : new AMap.Pixel(-10, -10),
      });

      if (that.editCameraInfoSign) {
        // marker点拖动结束事件
        eventCameraMarker.on("dragend", function(a) {
          console.log("dragend=>", a);
          var wgs84 = that.$gcoord.transform(
            [a.lnglat.Q, a.lnglat.P],
            that.$gcoord.GCJ02,
            that.$gcoord.WGS84
          );
          console.log("wgs84=>", wgs84);

          that.$root.$emit("updateCameraLnglatForm", {
            position: { lon: wgs84[0], lat: wgs84[1] - 0.00008 },
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
      this.$root.$off("removeEventMarker");
      this.$root.$off("editEventMarkerLonlat");

      //移除地图正在处理的marker标记
      this.$root.$on("removeEventMarker", (nv) => {
        this.removeMarker(this.backMark);
      });

      //设置marker点位置
      this.$root.$on("editEventMarkerLonlat", (nv) => {
        this.backMark.setPosition(nv);
      });
    },
  },
};
</script>

<style lang="less">
/**
     * 定义my-hover-title
     */

.amap-ui-pointsimplifier-container .overlay-title.my-hover-title {
  font-size: 14px;
  line-height: 200%;
  color: rgba(255, 255, 255, 0.8);
  padding: 0 10px;
  background-color: rgba(14, 45, 51, 0.8);
  border: 1px solid rgba(34, 135, 151, 0.61);

  &.top:before {
    bottom: -10px;
    border-top-color: rgba(14, 45, 51, 0.8);
  }
  &.top:after {
    bottom: -9px;
    left: 0;
    right: 0;
    border-top-color: rgba(14, 45, 51, 0.8);
  }
}

/**
     * marker点定义my-hover-title
     */
.bottom-center.amap-info-contentContainer {
  > .amap-info-content.amap-info-outer {
    font-size: 14px;
    line-height: 200%;
    color: rgba(255, 255, 255, 0.8);
    padding: 0 10px;
    background-color: rgba(14, 45, 51, 0.8);
    border: 1px solid rgba(34, 135, 151, 0.61);

    > .amap-info-close {
      display: none;
    }
  }

  > .amap-info-sharp {
    border-top: 6px solid rgba(14, 45, 51, 0.8);
    margin-left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    bottom: 3px;
  }
}

#loadingTip {
  position: absolute;
  z-index: 9999;
  top: 0;
  left: 0;
  padding: 3px 10px;
  background: red;
  color: #fff;
  font-size: 14px;
}
.tipMarker {
  color: #fff;
  background-color: rgba(20, 126, 161, 0.68);
  border: 1px solid rgba(50, 203, 224, 0.61);
  border-radius: 4px;
  padding: 4px 20px;
  font-size: 14px;
  white-space: nowrap;
  display: inline-block;
  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    margin: auto;
    width: 0;
    height: 0;
    border: solid transparent;
    border-width: 5px 5px;
  }
  &.top {
    transform: translate(-50%, -110%);
    &:before,
    &:after {
      bottom: -10px;
      left: 0;
      right: 0;
      border-top-color: #32cbe0;
    }
    &:before {
      bottom: -10px;
      border-top-color: #32cbe0;
    }
  }
}

#mapcontainer {
  overflow: visible;
  .amap-maps {
    overflow: visible;
  }
  .amap-drags {
    overflow: visible;
  }
}

.amap-markers {
  z-index: 301 !important;
}
</style>
