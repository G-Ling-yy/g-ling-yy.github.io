import { mapState, mapActions, mapMutations } from "vuex";
import loading from "@/components/common/Loading";
import imagesView from "@/components/module/camera/CameraImagesView";

//import aliPlayer from '@/components/camera/AliPlayer'
import flvPlayer from "@/components/module/camera/FlvPlayer";
import threePlayer from "@/components/module/camera/ThreeVideo";
import boolean from "less/lib/less/functions/boolean";
//import h5dPlayer from '@/components/camera/DPlayer_h5';
//import ckPlayer from '@/components/camera/CKplayer';

export default {
  name: "AmapPlayerDialog",
  components: {
    loading,
    imagesView,
    //aliPlayer,
    flvPlayer,
    threePlayer,
    //h5dPlayer,
    //ckPlayer,
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
    var roadId = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("路段名称不能为空"));
      } else {
        callback();
      }
    };

    var transcidingRoadId = (rule, value, callback) => {
      if (!this.addTranscodingForm.roadId) {
        return callback(new Error("路段名称不能为空"));
      } else {
        callback();
      }
    };

    var classify = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("所属类别不能为空"));
      } else {
        callback();
      }
    };

    var cameraName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("摄像机名称不能为空"));
      } else {
        const reg = /^[A-Za-z0-9-_\u4e00-\u9fa5]{1,50}$/;
        if (reg.test(value)) {
          if (this.addForm.cameraId && this.oldCameraName == value) {
            callback();
          }
          api
            .checkCameraName(value)
            .then((data) => {
              if (data.code != 200) {
                return Promise.reject();
              }

              if (data.data == 0) {
                return callback(new Error("摄像机名称已被注册"));
              }

              callback();
            })
            .catch((error) => {
              callback(new Error("摄像机名称查询失败"));
            });
        } else {
          return callback(
            new Error("摄像机名称由1-50位中文、英文、数字、下划线组成")
          );
        }
      }
    };

    var derection = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("方向不能为空"));
      } else {
        callback();
      }
    };

    var transcodingId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("所属视频上云网关不能为空"));
      } else {
        if (this.oldTranscodingId == value && this.addForm.cameraId) {
          return callback();
        }
        api
          .getCameraRemainder(value)
          .then((data) => {
            console.log("getCameraRemainder=>", data);
            if (data.code != 2001) {
              return Promise.reject();
            }
            callback();
          })
          .catch((error) => {
            callback(new Error("视频上云网关下摄像机挂载数量已达到最大值"));
          });
      }
    };

    var cameraPile = (rule, value, callback) => {
      var val1 = this.addForm.cameraKmpile;
      var val2 = this.addForm.cameraHmpile;
      const reg = /^\d{1,5}$/;
      if (reg.test(val1) && reg.test(val2)) {
        callback();
      } else {
        return callback(new Error("桩号为取值0~99999"));
      }
    };

    var longitude = (rule, value, callback) => {
      const reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("经度整数部分为0-180,小数部分为0到6位!"));
      }
    };

    var latitude = (rule, value, callback) => {
      const reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("纬度整数部分为0-90,小数部分为0到6位!"));
      }
    };

    var transcodingName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("转码设备名称不能为空"));
      } else {
        const reg = /^[A-Za-z0-9-_\u4e00-\u9fa5]{1,50}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(
            new Error("转码设备名称由1-50位中文、英文、数字、下划线组成")
          );
        }
      }
    };

    var transcodingCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("设备编码不能为空"));
      } else {
        const reg = /^[\s|\u4e00-\u9fa5]+$/i;
        if (!reg.test(value)) {
          api
            .checkTranscoding(value)
            .then((data) => {
              console.log(data);
              if (data.code != 200) {
                return Promise.reject();
              }
              if (data.data != 0) {
                return callback(new Error("设备编码已存在"));
              }
              callback();
            })
            .catch((error) => {
              callback(new Error("设备编码查询失败"));
            });
        } else {
          return callback(new Error("设备编码不能包含中文、空格"));
        }
      }
    };

    var channelNum = (rule, value, callback) => {
      const reg = /^\d{0,5}$/;
      const sign = value == null ? 0 : value.length;
      if (reg.test(value) || sign == 0) {
        callback();
      } else {
        return callback(new Error("最大接入数取值0~99999"));
      }
    };

    var ipAddress = (rule, value, callback) => {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(value) && value) {
        callback(new Error("IP格式错误"));
      } else {
        callback();
      }
    };

    var port = (rule, value, callback) => {
      console.log("port=>", value);
      const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (!reg.test(value) && value) {
        callback(new Error("端口格式错误"));
      } else {
        callback();
      }
    };

    return {
      infoWindowContentCollapse: true,
      baseWindowWidth: (576 / 1920) * window.innerWidth,
      isThreePlayer: false,
      isAliPlayer: false,
      tabsActiveName: "video-tab",
      initializeDialogVisible: false, // 初始化提示确认弹窗
      resetDialogVisible: false, // 复位提示确认弹窗
      addFormRules: {
        //新增弹窗验证规则
        roadId: [{ required: true, validator: roadId, trigger: "blur" }],
        classify: [{ required: true, validator: classify, trigger: "blur" }],
        cameraName: [
          { required: true, validator: cameraName, trigger: "blur" },
        ],
        derection: [{ required: true, validator: derection, trigger: "blur" }],
        transcodingId: [
          { required: true, validator: transcodingId, trigger: "change" },
        ],
        cameraPile: [
          { required: true, validator: cameraPile, trigger: "blur" },
        ],
        longitude: [{ required: true, validator: longitude, trigger: "blur" }],
        latitude: [{ required: true, validator: latitude, trigger: "blur" }],
      },
      videoUrl: "",
      videoDialogElement: null,
      //cameraMarkVisable                : false,
      resolutionValue: "20", //视频清晰度
      currentCamera: {},

      cameraImagesVisable: false, // 视频截图视窗
      cameraImagesLoading: true,
      cameraInfoVisable: false, // 摄像头信息
      cameraInfoEditVisable: false, // 摄像头信息编辑

      cameraInfo: {},
      geoCameraPath: "",
      cameraInfoForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
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
  watch: {
    /**
     * 监视视频播放窗口状态变化
     */
    visible(nv) {
      //关闭情况下情况地图marker点
      if (!nv) {
        this.infoWindowContentCollapse = true;
        this.$root.$emit("removeEventMarker", "");
      }
    },

    /**
     * 监视右击修改窗口状态变化
     */
    cameraInfoAlongEditVisable(nv) {
      //关闭情况下情况地图marker点
      if (!nv) {
        this.$root.$emit("removeEventMarker", "");
      }
    },
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
    //console.info('this.$root.playerType',this.$root.playerType,this.usePlayerType);

    this.getProvince();
    // this.getOrg();
    this.getRoad();
    this.getCodemaster({
      codeType: "CLASSIFY"
    });
    this.getCodemaster({
      codeType: "DERECTION"
    });

    //TODO:编辑摄像头信息，需要视频上云网关
    this.getTranscodingList({ currPage: 1, pageSize: 1000 });

    //去除摄像机编辑弹窗浏览器右击事件
    document.getElementById(
      "camera-info-edit-window-view"
    ).oncontextmenu = function(e) {
      return false;
    };
    let that = this;
    // 回车提交表单
    document.onkeydown = function(e) {
      if (!that.visible) return false;
      // 兼容FF和IE和Opera
      let theEvent = window.event || e;
      let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      // Alt+z 点位图层下降一级
      if (theEvent.altKey && code === 90) {
        //console.info(that);
        if (that.cameraInfoForm.maplevelStart < 18) {
          that.cameraInfoForm.maplevelStart++;
          that.onInfoSubmit(true);
        }
        //console.info(that.cameraInfoForm.maplevelStart);
      }
    };
  },
  beforeDestroy() {
    document.onkeydown = () => {};
  },
  methods: {
    ...mapActions([
      "getCameraPlayUrl",
      "getCameraInfoByList",
      "editCameraSingle",
      "getTranscodingList",
      "getProvince",
      "getOrg",
      "getRoad",
      "getCodemaster",
      "setCameraVisitRecords",
      "maplevelInitialize",

      "getCameraSnapShotsAction",
    ]),
    ...mapMutations(["setSelectCameraIndex"]),

    tabsActiveClick(e) {
      //console.info(e,this.tabsActiveName);
      if (this.tabsActiveName === "images-tab")
        this.$refs["cameraImages"].getImages(this.currentCamera.cameraNum);
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
     * 获取播放地址
     * @param cameraNum
     */
    getVideoUrlToPlay(cameraInfo, change) {
      if (!cameraInfo) return false;

      //console.info('getVideoUrlToPlay',cameraInfo,that.cameraInfo.cameraType === '3');

      let that = this,
        cameraNum = cameraInfo.cameraNum;
      that.currentCamera = cameraInfo;
      that.showInfoWrapper();
      //console.info('getVideoUrlToPlay',cameraInfo,cameraInfo.cameraType === '3');
      that.isThreePlayer = cameraInfo.cameraType === "3";

      that.getUrlLoading = true;
      //m3u8Url 播放器暂时有问题
      let mediatype = this.$root.mediatype; // 'flvUrl';//rtmpUr flvUrl m3u8Url
      that
        .getCameraPlayUrl({
          cameraNum: cameraNum, //record.data.cameraName,s
          videoType: that.resolutionValue || "0",
          mediatype: mediatype,
        })
        .then((res) => {
          //
          if (res.code === 200) {
            //that.videoUrl = 'http://stdq.play.jchc.cn/live/sxjgl_stdq_320621011221001016064.m3u8?auth_key=1572992108-0-0-6f54b3f49b1c2efc94ed1d2585f6d6c1';//res.data;

            if (!res.data || !res.data.url) {
              this.$message({
                message: "视频地址请求失败，" + res.message,
                type: "error",
              });
              this.$emit("update:visible", false);
              return false;
            }

            that.videoUrl = res.data.url; //res.data;
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
                  that.$refs["threePlay"].flv_Play(that.videoUrl);
                } else {
                  that.$refs["flvPlay"].flv_Play(that.videoUrl);
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
     * 摄像头详细信息弹窗
     */
    showInfoWrapper() {
      let _this = this;
      _this
        .getCameraInfoByList({
          currPage: 1,
          pageSize: 1,
          info: { cameraId: _this.currentCamera.cameraId }, // {cameraName:_this.currentCamera.cameraName}
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

            //高德地图逆地址解析
            _this.getAddressByLnglat(
              _this.cameraInfoForm.longitude,
              _this.cameraInfoForm.latitude
            );
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
      //console.log(event,id);

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
        if (ev.target.tagName === "INPUT") {
          return true;
        }

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
        that.videoDialogElement.style.left = mouseY + "px";
        that.videoDialogElement.style.top = mouseX + "px";
        that.videoDialogElement.style.transform = "none";
        return true;

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
          fullHeight = window.innerHeight,
          left = mouseX - this.baseWindowWidth / 2;
        let lastSpace = fullHeight - top;
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
          //maplevelEnd          : eventData.maplevelEnd
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
          that.$message.success("复位成功！");
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
