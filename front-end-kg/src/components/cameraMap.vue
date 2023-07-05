<template>
  <!--地图容器-->
  <div class="traffic-map-box-camera">
    <div id="cameraContainer" style="height:100%;width:100%;overflow: visible;"></div>
    <camera-lonAndlat-player
      :visible.sync="playerVisible"
      ref="cameraVideos"
      :cameraName="cameraName"
    ></camera-lonAndlat-player>
  </div>
</template>

<script>
const AMap = window.AMap;
import CameraLonAndlatPlayer from "./module/CameraManage/CameraLonAndlatPlayer";
export default {
  name: "cameraMap",
  data() {
    return {
      cameraName: "",
      playerVisible: false,
      mapZIndexConfig: {
        baseLayer: 120, // 基础图层
        labelzIndex: 122, // 标注图层
        googleLayer: 120, // 卫星地图
        markerzIndex: 310, // 摄像头图标
        wmfLayer: 121 // 首都放射想
      },
      cameraMap: null,
      infoWindow: null,
      tipMarker: null,
      cameraIconWidth: 30, //35,
      cameraIconHeight: 35, //40*88/76
      //摄像机正常图标
      cameraImgUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera.png"),
        "2": require("@/assets/images/traffic_map/icon/camera-qd.png"),
        "3": require("@/assets/images/traffic_map/icon/camera-sd.png"),
        "4": require("@/assets/images/traffic_map/icon/camera-sfz.png"),
        "5": require("@/assets/images/traffic_map/icon/camera-sfz.png"),
        "6": require("@/assets/images/traffic_map/icon/camera-fwq.png"),
        "7": require("@/assets/images/traffic_map/icon/camera-etc.png")
      },
      //摄像机离线图标
      cameraOfflineImgUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera-offline.png"),
        "2": require("@/assets/images/traffic_map/icon/camera-qd-offline.png"),
        "3": require("@/assets/images/traffic_map/icon/camera-sd-offline.png"),
        "5": require("@/assets/images/traffic_map/icon/camera-sfz-offline.png"),
        "6": require("@/assets/images/traffic_map/icon/camera-fwq-offline.png"),
        "7": require("@/assets/images/traffic_map/icon/camera-etc-offline.png")
      },
      //摄像机故障图标
      cameraErrorImgUrl: {
        "1": require("@/assets/images/traffic_map/icon/camera-error.png"),
        "2": require("@/assets/images/traffic_map/icon/camera-qd-error.png"),
        "3": require("@/assets/images/traffic_map/icon/camera-sd-error.png"),
        "5": require("@/assets/images/traffic_map/icon/camera-sfz-error.png"),
        "6": require("@/assets/images/traffic_map/icon/camera-fwq-error.png"),
        "7": require("@/assets/images/traffic_map/icon/camera-etc-error.png")
      },
      currentMarkers: [],
      mapMarkList: [],
      eventRegionCode: null
    };
  },
  components: {
    CameraLonAndlatPlayer
  },
  props: {
    cameraNumber: String
  },
  methods: {
    getMap() {
      let that = this;
      this.$nextTick(() => {
        //基础地图
        // var baseLayer = new AMap.TileLayer({
        //   zooms: [0, 11], //可见级别
        //   visible: true, //是否可见
        //   opacity: 1, //透明度
        //   zIndex: this.mapZIndexConfig.baseLayer //叠加层级
        // });
        // var googleLayer = new AMap.TileLayer.Satellite({
        //   zooms: [11, 24], //可见级别
        //   getTileUrl:
        //     "http://mt2.google.cn/vt/lyrs=s@817&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
        //   zIndex: this.mapZIndexConfig.googleLayer,
        //   opacity: 1
        // });
        this.cameraMap = new AMap.Map("cameraContainer", {
          cursor: "default",
          resizeEnable: true,
          animateEnable: true,
          disableSocket: true,
          autoSetFitView: false,
          labelzIndex: this.mapZIndexConfig.labelzIndex,
          pitch: 0,
          zoom: 8,
          // mapStyle: "amap://styles/macaron",
          // layers: [baseLayer,googleLayer] //图层
        });
        //鼠标hover提示内容
        let ele = document.createElement("div"); //  .getElementById('maptip');
        ele.className = "tipMarker top";
        this.$tipMarkerContent = ele;
        this.tipMarker = new AMap.Marker({
          content: this.$tipMarkerContent,
          offset: new AMap.Pixel(0, 0),
          bubble: true
        });
        // 地图图块加载完成后触发 子组件
        //  that.cameraMap.on("complete", function() {
        //    that.$emit("amap-changed")
        // });
        //  that.$emit("amap-changed")
      });
    },
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
        imageSize: new AMap.Size(that.cameraIconWidth, that.cameraIconHeight) // 根据所设置的大小拉伸或压缩图片
      });
    },
    /**
     *
     * @param {*} list
     * 摄像机
     */
    async cameraViewPoint(list, cameraName) {
      await this.getMap();
      this.mapMarkList = list;
      this.cameraName = cameraName;
      let that = this,
        markerList = [];

      // 地图图块加载完成后触发
      if (!this.infoWindow) {
        this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30)
        });
      }
      that.cameraMap.remove(that.currentMarkers);

      if (list.length) {
        let num = list.length;

        // 摄像机图标mouseover事件
        let markerhover = e => {
          that.infoWindow.setContent(e.target.content);
          that.infoWindow.open(that.cameraMap, e.target.getPosition());
          that.tipMarker.hide();
        };
        // 摄像机图标mouseout事件
        let markermouseout = () => {
          that.infoWindow.close();
          that.tipMarker.show();
        };
        let markerClick = val => {
          let that = this,
            cameraNum = this.cameraNumber,
            cameraName = val.cameraName;
          let mediatype = that.$root.mediatype;
          this.$parent.$parent
            .getCameraPlayUrl({
              cameraNum: cameraNum, //record.data.cameraName,
              videoType: "0",
              mediatype: mediatype
            })
            .then(res => {
              if (res.code === 200) {
                if (!res.data || !res.data) {
                  that.$message({
                    message: "视频地址请求失败，" + res.message,
                    type: "error"
                  });
                  return false;
                }
                this.playerVisible = true;
                this.$nextTick(() => {
                  let flvPlayDom = this.$refs.cameraVideos.getFlvFlayer(
                    res.data
                  );
                  
                  // flvPlayDom.flv_Play(res.data.url);
                });

                if (!val) {
                  //TODO: 增加摄像头访问记录
                  this.setCameraVisitRecords({
                    cameraName: cameraInfo.cameraName,
                    cameraNum: cameraInfo.cameraNum,
                    organizationId: cameraInfo.organizationId,
                    regionCode: cameraInfo.regionCode,
                    roadId: cameraInfo.roadId
                    //cameraType      : cameraInfo.cameraType,
                    //classIfy        : cameraInfo.classIfy
                  });
                }
              }
            });
        };
        // 加载点数据
        for (let i = 0, len = num; i < len; i++) {
          let marker = new AMap.Marker({
            position: [list[i].longitude, list[i].latitude],
            zIndex: this.mapZIndexConfig.markerzIndex,
            offset: new AMap.Pixel(
              0 - that.cameraIconWidth / 2,
              0 - that.cameraIconHeight
            ),
            icon: this.getMarkerIcon(list[i].classifyCode, 0)
          });
          marker.content = `摄像机名称：${
            list[i].cameraName ? list[i].cameraName : ""
          } <br/> CameraNum：${list[i].cameraNum ? list[i].cameraNum : ""} <br/>
            经度：${list[i].longitude ? list[i].longitude : ""}<br/>
            纬度：${list[i].latitude ? list[i].latitude : ""}`;
          // 摄像机图标mouseover事件
          marker.on("mouseover", markerhover);
          // 摄像机图标mouseout事件
          marker.on("mouseout", markermouseout);
          marker.on("click", markerClick);
          markerList.push(marker);
        }
        // 创建覆盖物群组，并将 marker 传给   OverlayGroup覆盖物群组
        that.currentMarkers = new AMap.OverlayGroup(markerList);
        that.cameraMap.add(that.currentMarkers); //将覆盖物添加到map上
        that.cameraMap.setFitView(); //定位到目前操作位置
        that.cameraMap.setZoom(14); //地图层级
      }
    },
    // 关闭video
    handleCameraClose() {
      this.playerVisible = false;
      this.$refs.cameraVideos.handleDestroy();
    }
  }
};
</script>

<style lang="less" scoped>
/**
     * marker点定义my-hover-title
     */
/deep/.bottom-center.amap-info-contentContainer {
  > .amap-info-content.amap-info-outer {
    font-size: 14px;
    line-height: 200%;
    color: #000;
    padding: 0 10px;
    background: #fff;
    border: 1px solid #fff;
    box-shadow: outset 0 0 4px 0 rgb(136, 130, 130);

    > .amap-info-close {
      display: none;
    }
  }
}

/deep/.amap-icon {
  overflow: visible !important;
  
}
.amap-icon img {
    width: 20px !important;
    height: 20px !important;
  }
.traffic-map-box-camera {
  height: 600px;
  width: 100%;
}
/deep/.amap-markers {
  z-index: 301 !important;
}
</style>
