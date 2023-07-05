<template>
  <div class="camera-player-single">
    <flv-player
      ref="flvPlay"
      v-if="usePlayerType === 'flv' && !isThreePlayer && !isAliPlayer"
      video-type="flv"
    ></flv-player>
    <three-player
      ref="threePlay"
      v-if="usePlayerType === 'flv' && isThreePlayer && !isAliPlayer"
      video-type="flv"
    ></three-player>
  </div>
</template>

<script>rou
import { mapState, mapActions, mapMutations } from "vuex";
import loading from "../common/Loading";
import flvPlayer from "../module/camera/FlvPlayer";
import threePlayer from "../module/camera/ThreeVideo";
//import api from '../api';
const AMap = window.AMap;
export default {
  name: "CameraPlayerSingle",
  components: {
    loading,
    flvPlayer,
    threePlayer,
  },
  props: {
    visible: {
      default() {
        return false;
      },
    },
    /*currentCamera:{
          type: Object,
          default() {
              return {};
          }
      }*/
  },
  data() {
    return {
      webSocketClient: "",
      baseWindowWidth: (576 / 1920) * window.innerWidth,
      isThreePlayer: false,
      isAliPlayer: false,
      videoUrl: "",
      videoDialogElement: null,
      //cameraMarkVisable                : false,
      resolutionValue: "30", //视频清晰度 30 20
      currentCamera: {},

      cameraImagesVisable: false, // 视频截图视窗
      cameraImagesLoading: true,
      cameraInfoVisable: false, // 摄像头信息
      cameraInfoEditVisable: false, // 摄像头信息编辑

      cameraInfo: {},
      geoCameraPath: "",
      cameraInfoAlongForm: {},
      cameraInfoAlongEditVisable: false,
      getUrlLoading: false,

      /*playerOptions: {
            events: [],
            height:'100%',
            width:'100%',
            playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
            autoplay: 'play', // 如果true,浏览器准备好时开始回放。
            controls: true, // 控制条
            liveui:true,
            preload: 'auto', // 视频预加载
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            language: 'zh-CN',
            controlBar: {
                timeDivider: false,
                durationDisplay: false
            },
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
                type: 'application/x-mpegURL',
                src: ''
            }],
            hls: true, // 启用hls？
            poster: '', // 你的封面地址
            notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }*/
    };
  },
  computed: {
    ...mapState([
      "deviceStatistics",
      "transcoding",

      "provinces",
      "orgList",
      "roadList",
      "classIfyList",
      "derectionList",
    ]),

    usePlayerType() {
      // return 'ali';
      return this.$root.playerType;
    },

    classIfyArr() {
      let ar = {};
      if (this.classIfyList && this.classIfyList.length) {
        let list = this.classIfyList;
        list.forEach((vo) => {
          ar[vo.codeValue] = vo.codeName;
        });
      }
      return ar;
    },

    /* videoUrlToPlay(){
           this.getVideoUrlToPlay(this.currentCamera.cameraNum);
       }*/

    /*videoPlayer() {
          return this.$refs.videoPlayer.player
      },*/
  },
  beforeMount() {
    //加载默认绑定事件
    this.loadDefaultEvent();
  },
  mounted() {
    /////////////////////////////////////////
    /////               websocket链接
    /////////////////////////////////////////
    this.connectWebsocket();
    //去除摄像机编辑弹窗浏览器右击事件
    /*document.getElementById('camera-info-edit-window-view').oncontextmenu = function(){
        return false;
      }*/

    // cameraNum: 265a8156983c4d43a1a2e57989f99d9d

    // 全景机
    //this.showInfoWrapper("10000000459");
    // cameraId: "10000000459"
    // 枪机
    //this.showInfoWrapper('10000034536');

    //this.showInfoWrapper("K32+100下行CAM7");
  },
  methods: {
    ...mapActions([
      "getCameraPlayUrl",
      "getCameraInfoByList",
      "editCameraSingle",
      //"getTranscodingList",
      "getProvince",
      "getOrg",
      "getRoad",
      "getCodemaster",
      "setCameraVisitRecords",
      "maplevelInitialize",

      "getCameraSnapShotsAction",
    ]),
    ...mapMutations(["setSelectCameraIndex"]),

    connectWebsocket() {
      let that = this;
      if ("WebSocket" in window) {
        let url = that.BASECONFIG.WEBSOCKET_SERVER_URL;
        that.webSocketClient = new WebSocket(url); //打开WebSocket
      } else {
        alert("你的浏览器不支持WebSocket");
        return false;
      }

      that.webSocketClient.onopen = function() {
        //处理连接开启事件
        console.log("Opening");
        setInterval(() => {
          that.webSocketClient.send("left_heart");
        }, 1000);
      };

      that.webSocketClient.onmessage = function(e) {
        //处理信息
        e = e || event; //获取事件，这样写是为了兼容IE浏览器
        //console.log(e, e.data, that.webSocketClient);
        if (e.data.indexOf("successful") > 0) {
          let data = { msgType: "login", idname: "left_screen" };
          if (that.webSocketClient)
            that.webSocketClient.send(JSON.stringify(data));
        }

        if (parseInt(e.data) > 0) {
          that.showInfoWrapper(e.data);
        }
      };

      that.webSocketClient.onclose = function() {
        //处理连接关闭事件
        console.log("Closing");
      };

      that.webSocketClient.onerror = function(error) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log(error);
      };
    },

    sendCameraSocketInfo(cameraInfo) {
      let data = {
        msgType: "action",
        idname: "touch_screen",
        target: "left_screen",
        cameraInfo: cameraInfo,
      };
      if (this.webSocketClient) this.webSocketClient.send(JSON.stringify(data));
    },

    getAddressByLnglat(lng, lat) {
      let that = this;
      AMap.plugin("AMap.Geocoder", function() {
        let geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          //city: '010'
        });

        let lnglat = [lng, lat];

        geocoder.getAddress(lnglat, function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // result为对应的地理位置详细信息
            let address = result.regeocode.formattedAddress;
            that.geoCameraPath = address;
            //console.info(that.cameraInfo,result);
          }
        });
      });
    },

    /**
     * 视频分辨率切换
     */
    resolutionChange(val) {
      //console.info('resolutionChange',val);
      this.resolutionValue = val;
      this.getVideoUrlToPlay(this.currentCamera, 1);
    },

    playerFullScreen() {
      let that = this;
      /*if(that.usePlayerType === 'ali') {
            that.$refs['ckVideo'].ck_play(res.data);
        }*/
      if (that.usePlayerType === "flv") {
        if (that.isThreePlayer) {
          that.$refs["threePlay"].flv_fullScreen();
        } else {
          that.$refs["flvPlay"].flv_fullScreen();
        }
      }
    },

    /**
     * 查询摄像头详细信息
     */
    showInfoWrapper(cameraId) {
      if (this.usePlayerType === "flv" && !this.isAliPlayer) {
        //this.$refs['flvPlay'].flv_destroy();
        if (this.usePlayerType === "flv") {
          if (this.isThreePlayer) {
            this.$refs["threePlay"].flv_destroy();
          } else {
            this.$refs["flvPlay"].flv_destroy();
          }
        }
      }

      let _this = this;
      _this
        .getCameraInfoByList({
          currPage: 1,
          pageSize: 1,
          info: {
            //cameraNum:cameraNum
            cameraId: cameraId,
          },
        })
        .then((res) => {
          // console.info('showInfoWrapper=>',res);
          if (res.code === 200 && res.data.length > 0) {
            _this.cameraInfo = JSON.parse(JSON.stringify(res.data[0]));
            _this.cameraInfoForm = res.data[0];
            _this.cameraInfoForm.oldLongitude = _this.cameraInfoForm.longitude;
            _this.cameraInfoForm.oldLatitude = _this.cameraInfoForm.latitude;
            _this.cameraInfoForm.provinceCode =
              parseInt(_this.cameraInfoForm.regionCode.substr(0, 2)) * 10000;

            _this.cameraInfoForm.provinceCode = res.data[0].regionCode * 1;
            _this.cameraInfoForm.transcodingId = res.data[0].transcodingId * 1;
            _this.cameraInfoForm.organizationId =
              res.data[0].organizationCode * 1;

            _this.getVideoUrlToPlay(_this.cameraInfo);

            //高德地图逆地址解析
            //_this.getAddressByLnglat(_this.cameraInfoForm.longitude,_this.cameraInfoForm.latitude);
            /*

            provinceCode         : this.cameraInfoForm.provinceCode,
            organizationName     : this.cameraInfoForm.organizationName,
            roadId               : this.cameraInfoForm.roadId,
            classify             : this.cameraInfoForm.classify,
            cameraName           : this.cameraInfoForm.cameraName,
            direction            : this.cameraInfoForm.direction,
            transcodingId        : this.cameraInfoForm.transcodingCode,
            cameraKmpile         : this.cameraInfoForm.cameraKmpile,
            cameraHmpile         : this.cameraInfoForm.cameraHmpile,
            longitude            : this.cameraInfoForm.longitude,
            latitude             : this.cameraInfoForm.latitude,
            cameraId             : this.cameraInfoForm.cameraId
            */
          }
        });
    },

    /**
     * 获取播放地址
     * @param cameraNum
     */
    getVideoUrlToPlay(cameraInfo, change) {
      if (!cameraInfo) return false;

      //console.info('getVideoUrlToPlay',cameraInfo,that.cameraInfo.cameraType === '3');

      let that = this,
        cameraNum = cameraInfo.cameraNum;
      that.currentCamera = cameraInfo;

      //console.info('getVideoUrlToPlay',cameraInfo,cameraInfo.cameraType === '3');
      that.isThreePlayer = cameraInfo.cameraType === "3";

      that.getUrlLoading = true;
      //m3u8Url 播放器暂时有问题
      let mediatype = this.$root.mediatype; // 'flvUrl';//rtmpUr flvUrl m3u8Url
      that
        .getCameraPlayUrl({
          cameraNum: cameraNum, //record.data.cameraName,
          videoType: that.resolutionValue || "0",
          mediatype: mediatype,
        })
        .then((res) => {
          //
          if (res.code === 200) {
            //that.videoUrl = 'http://stdq.play.jchc.cn/live/sxjgl_stdq_320621011221001016064.m3u8?auth_key=1572992108-0-0-6f54b3f49b1c2efc94ed1d2585f6d6c1';//res.data;

            if (!res.data || !res.data) {
              this.$message({
                message: "视频地址请求失败，" + res.message,
                type: "error",
              });
              this.$emit("update:visible", false);
              return false;
            }

            that.videoUrl = res.data; //res.data;
            that.currentCamera.cameraNameStr =
              res.data.cameraName || "摄像机名称";
            /*if(res.data.cameraName){
                that.videoUrl = res.data.url;//res.data;
                that.currentCamera.cameraNameStr = res.data.cameraName;
            }else{
                that.videoUrl = res.data;//res.data;
                that.currentCamera.cameraNameStr = '摄像机名称';
            }*/

            that.$forceUpdate();
            let playerTodo = function() {
              if (mediatype === "m3u8Url") {
                that.isAliPlayer = true;
                //this.$root.playerType = 'ck';
              }
              if (that.usePlayerType === "ali") {
                that.$root.$emit("setLoadAliPlayer", that.videoUrl);
              }
              if (that.usePlayerType === "flv" && !that.isAliPlayer) {
                /*if(cameraInfo.cameraType === '3'){
                    that.isThreePlayer = true;
                    that.$refs['threePlay'].flv_Play(res.data);
                }else{
                    that.isThreePlayer = false;
                    that.$refs['flvPlay'].flv_Play(res.data);
                }*/
                if (that.isThreePlayer) {
                  that.$refs["threePlay"].flv_Play(that.videoUrl.flv);
                } else {
                  that.$refs["flvPlay"].flv_Play(that.videoUrl.flv);
                }

                /*that.isThreePlayer = true;
                setTimeout(()=>{
                    that.$refs['threePlay'].flv_Play(res.data);
                },400);*/
              }

              that.getUrlLoading = false;
            };

            if (change && that.resolutionValue === "30") {
              //高清码流延时3秒
              setTimeout(() => {
                playerTodo();
              }, 3000);
            } else {
              playerTodo();
            }

            /*if(that.usePlayerType === 'ali'){
                that.$root.$emit("setLoadAliPlayer",res.data);
            }
            if(that.usePlayerType === 'dplayer') {
                that.$refs['dplayerH5'].dplayer_play(res.data);
            }*/

            if (!change) {
              //TODO: 增加摄像头访问记录
              this.setCameraVisitRecords({
                cameraName: cameraInfo.cameraName,
                cameraNum: cameraInfo.cameraNum,
                organizationId: cameraInfo.organizationId,
                regionCode: cameraInfo.regionCode,
                roadId: cameraInfo.roadId,
                //cameraType      : cameraInfo.cameraType,
                //classIfy        : cameraInfo.classIfy
              });
            }
          } else if (that.resolutionValue === "30") {
            that.resolutionValue = "20";
            this.getVideoUrlToPlay(this.currentCamera, 1);
            //this.$emit('update:visible', false);
          }
        });
    },

    /**
     * 摄像头截图浏览弹窗
     */
    showImageWrapper() {
      this.cameraImagesVisable = !this.cameraImagesVisable;
      this.cameraInfoVisable = false;
      this.cameraInfoEditVisable = false;

      //console.info('showImageWrapper ',this.currentCamera);
      if (this.cameraImagesVisable)
        this.$refs["cameraImages"].getImages(this.currentCamera.cameraNum);
    },

    /**
     * 摄像头截图浏览弹窗-关闭
     */
    cameraImagesClose() {
      this.cameraImagesVisable = false;
      this.$refs["cameraImages"].destoryImages();
    },

    /**
     * 播放窗口关闭
     */
    dialogClose() {
      //console.info('dialogClose');

      this.cameraImagesVisable = false;
      this.cameraInfoEditVisable = false;
      this.cameraInfoVisable = false;
      this.setSelectCameraIndex(-1);

      this.$emit("update:visible", false);

      this.resolutionValue = "20";

      if (this.usePlayerType === "flv" && !this.isAliPlayer) {
        //this.$refs['flvPlay'].flv_destroy();
        if (this.usePlayerType === "flv") {
          if (this.isThreePlayer) {
            this.$refs["threePlay"].flv_destroy();
          } else {
            this.$refs["flvPlay"].flv_destroy();
          }
        }
      }
      /*if(this.usePlayerType === 'dplayer') {
            this.$refs['dplayerH5'].dplayer_destroy();
        }*/

      if (this.isAliPlayer || this.usePlayerType === "ali") {
        this.$refs["aliplayer"].disposePlayer();
      }
    },

    /**
     * 播放窗口拖拽
     * @param event
     * @param id
     */
    mousedown(event, id) {
      let that = this;
      //var div1 = this.videoDialogElement
      that.videoDialogElement = document.getElementById(id);
      that.videoDialogElement.style.cursor = "move";
      let distanceX = event.clientX - that.videoDialogElement.offsetLeft;
      let distanceY = event.clientY - that.videoDialogElement.offsetTop;
      // alert(distanceX)
      // alert(distanceY)
      //console.log(distanceX)
      //console.log(distanceY)
      document.onmousemove = function(ev) {
        ev.stopPropagation();
        //console.info('onmousemove',ev,ev.target.className);

        var oevent = ev || event;
        that.videoDialogElement.style.left = oevent.clientX - distanceX + "px";
        that.videoDialogElement.style.top = oevent.clientY - distanceY + "px";
      };
      document.onmouseup = function(ev) {
        ev.stopPropagation();
        //console.info('onmouseup',ev);
        document.onmousemove = null;
        document.onmouseup = null;
        that.videoDialogElement.style.cursor = "default";
      };
    },

    /**
     * 给窗口定位
     */
    setWindowSite(mouseX, mouseY) {
      let that = this;
      //
      //var div1 = this.videoDialogElement
      //that.videoDialogElement.style.cursor = 'move';
      //let left = mouseX - that.videoDialogElement.offsetWidth/2;
      this.$nextTick(() => {
        that.videoDialogElement = document.getElementById(
          "camera-info-window-view"
        );

        //优先显示到底部，底部不够显示完整视频，再计算顶部空间
        /*let top = mouseY + 20,
              fullHeight = window.innerHeight,
              left = mouseX - this.baseWindowWidth / 2;
          let lastSpace = fullHeight - top;
          if(that.videoDialogElement.offsetHeight - lastSpace > 10){
              top = top - that.videoDialogElement.offsetHeight - 40;
          }*/

        //优先显示到顶部，底部不够显示完整视频，再放到底部
        let cameraHeight = that.videoDialogElement.offsetHeight,
          top = mouseY - cameraHeight - 20,
          //fullHeight = window.innerHeight,
          left = mouseX - this.baseWindowWidth / 2;
        //let lastSpace = fullHeight - top;
        //不挡住页面标题
        if (top < 20) {
          top = mouseY + 20;
        }

        //console.info(that.videoDialogElement,window.outerHeight,mouseX,mouseY,top,left);

        //that.videoDialogElement.style = 'left:'+left + 'px;top:'+top + 'px;transform:""';

        that.videoDialogElement.style.left = left + "px";
        that.videoDialogElement.style.top = top + "px";
        that.videoDialogElement.style.transform = "none";
      });

      /*setTimeout(()=>{

        },200);*/
    },

    /**
     * 摄像机编辑弹窗提交
     * @param flag true 视频弹窗提交
     *             false 右击弹窗提交
     */
    onInfoSubmit(flag = false) {
      //console.log('submit!');
      let eventDom = flag
        ? this.$refs.cameraInfoForm
        : this.$refs.cameraInfoAlongForm;

      eventDom.validate((valid) => {
        //console.log(valid);
        if (!valid) {
          return this.$message({
            message: "请核对填写信息",
            type: "error",
          });
        }
        //console.info('cameraInfoAlongForm=> ',this.cameraInfoAlongForm);
        let eventData = flag ? this.cameraInfoForm : this.cameraInfoAlongForm;
        let postdata = {
          provinceCode: eventData.provinceCode,
          organizationName: eventData.organizationName,
          roadId: eventData.roadId,
          classify: eventData.classify,
          cameraName: eventData.cameraName,
          derection: eventData.derection,
          transcodingId: eventData.transcodingId,
          cameraKmpile: eventData.cameraKmpile,
          cameraHmpile: eventData.cameraHmpile,
          longitude: eventData.longitude,
          latitude: eventData.latitude,
          cameraId: eventData.cameraId,
          maplevelStart: eventData.maplevelStart,
          maplevelEnd: eventData.maplevelEnd,
        };

        //console.info('onInfoSubmit ',postdata);

        this.editCameraSingle(postdata).then((res) => {
          if (res.code === 200) {
            if (!flag) {
              this.cameraInfoAlongEditVisable = false;
              this.$root.$emit("reloadCameraList", "");
              return;
            }

            this.cameraInfoEditVisable = false;
            this.cameraInfoVisable = true;
            this.$root.$emit("reloadCameraList", "");

            this.showInfoWrapper();
          }
        });

        /*this.addForm.organizationName=this.userInfo.organizationName;
          if(this.dialogTitle == "编辑摄像机设备"){
              return this.editCamera(this.addForm);
          }
          this.addCamera(this.addForm);*/
      });
    },

    /**
     * 摄像机信息修改弹窗经纬度change事件
     * @param flag true 视频播放弹窗修改
     *             false 右击弹窗修改
     */
    lnglatChange(flag = false) {
      var gps = flag
          ? [this.cameraInfoForm.longitude, this.cameraInfoForm.latitude]
          : [
              this.cameraInfoAlongForm.longitude,
              this.cameraInfoAlongForm.latitude,
            ],
        that = this;

      //WGS84转GCJ-02 并在页面进行展示
      AMap.convertFrom(gps, "gps", function(status, result) {
        if (result.info === "ok") {
          var lnglats = result.locations; // Array.<LngLat>
          that.$root.$emit("editEventMarkerLonlat", [
            lnglats[0].lng,
            lnglats[0].lat,
          ]);
        }
      });
    },

    /**
     * 路段图层初始化
     * @param flag true 视频播放弹窗修改
     *             false 右击弹窗修改
     */
    editMaplevel(flag = false) {
      let eventid = flag
        ? this.cameraInfoForm.roadId
        : this.cameraInfoAlongForm.roadId;
      this.maplevelInitialize({ roadId: eventid }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: `初始化成功,共修改${res.data.length}个摄像机`,
            type: "success",
          });

          //手动更新起始结束层级
          if (flag) {
            this.cameraInfo.maplevelStart = 1;
            this.cameraInfo.maplevelEnd = 18;
            this.cameraInfoForm.maplevelStart = 1;
            this.cameraInfoForm.maplevelEnd = 18;
          } else {
            this.cameraInfoAlongForm.maplevelStart = 1;
            this.cameraInfoAlongForm.maplevelEnd = 18;
          }

          //刷新地图摄像机
          this.$root.$emit("reloadCameraList", "");
        }
      });
    },

    /**
     * 右击修改弹窗经纬度 复位
     * @param flag true 视频播放弹窗修改
     *             false 右击弹窗修改
     */
    resetCameraLonLat(flag = false) {
      if (flag) {
        this.cameraInfoForm.longitude = this.cameraInfoForm.oldLongitude;
        this.cameraInfoForm.latitude = this.cameraInfoForm.oldLatitude;
      } else {
        this.cameraInfoAlongForm.longitude = this.cameraInfoAlongForm.oldLongitude;
        this.cameraInfoAlongForm.latitude = this.cameraInfoAlongForm.oldLatitude;
      }
      this.lnglatChange(flag);
    },

    /**
     * 默认事件
     */
    loadDefaultEvent() {
      this.$root.$off("setCameraInfoAlongEditVisable");
      this.$root.$off("setCameraInfoAlongForm");
      this.$root.$off("updateCameraLnglatForm");

      //控制摄像机信息修改弹窗
      this.$root.$on("setCameraInfoAlongEditVisable", (nv) => {
        if (nv) {
          document.getElementById("camera-info-edit-window-view").style.top =
            "90px";
          document.getElementById("camera-info-edit-window-view").style.left =
            "340px";
        }
        this.cameraInfoAlongEditVisable = nv;
      });

      //摄像机右击弹窗修改弹窗内容
      this.$root.$on("setCameraInfoAlongForm", (nv) => {
        console.log("nv=>", nv);
        this.getCameraInfoByList({
          currPage: 1,
          pageSize: 1,
          info: { cameraName: nv.cameraName },
        }).then((res) => {
          //console.info(res);
          if (res.code === 200 && res.data.length > 0) {
            this.cameraInfoAlongForm = res.data[0];
            this.cameraInfoAlongForm.oldLongitude = this.cameraInfoAlongForm.longitude;
            this.cameraInfoAlongForm.oldLatitude = this.cameraInfoAlongForm.latitude;
            this.cameraInfoAlongForm.provinceCode =
              parseInt(this.cameraInfoAlongForm.regionCode.substr(0, 2)) *
              10000;
            console.log("this.cameraInfoAlongForm=>", this.cameraInfoAlongForm);
          }
        });
      });

      //摄像机右击弹窗经纬度信息修改 nv=>{position:{},flag:boolean[true:视频窗口修改，false:右击修改]}
      this.$root.$on("updateCameraLnglatForm", (nv) => {
        if (nv.flag) {
          this.cameraInfoForm.longitude = nv.position.lon;
          this.cameraInfoForm.latitude = nv.position.lat;
          return;
        }
        this.cameraInfoAlongForm.longitude = nv.position.lon;
        this.cameraInfoAlongForm.latitude = nv.position.lat;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.camera-player-single {
  width: 100vw;
  height: 100vh;
}
</style>
