import { mapState, mapActions, mapMutations } from 'vuex'
import loading from '../common/Loading'
// import imagesView from '../module/camera/CameraImagesView';
import imagesView from '../module/camera/CameraImagesDrawer.vue'
import flvPlayer from '../module/camera/FlvPlayer'
import threePlayer from '../module/camera/ThreeVideo'
import webRTCPlayer from '@/components/module/camera/WebRTCPlayer/index.vue'
import preventReSubmit from '../../directives'
import api from '../../api'
import { cloneWith } from 'lodash'
const AMap = window.AMap
export default {
  name: 'AmapPlayerDialog',
  components: {
    loading,
    imagesView,
    flvPlayer,
    threePlayer,
    webRTCPlayer,
    preventReSubmit
  },
  props: {
    visible: {
      default() {
        return false
      }
    },
    currentMapZoom: {
      default() {
        return 0
      }
    }
  },
  data() {
    var roadId = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('路段名称不能为空'))
      } else {
        callback()
      }
    }

    /*var transcidingRoadId = (rule, value, callback) => {
      if (!this.addTranscodingForm.roadId) {
        return callback(new Error('路段名称不能为空'));
      } else {
        callback();
      }
    };*/

    var classify = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('所属类别不能为空'))
      } else {
        callback()
      }
    }

    var cameraName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('摄像机名称不能为空'))
      } else {
        const reg = /^[A-Za-z0-9-_\u4e00-\u9fa5]{1,50}$/
        if (reg.test(value)) {
          if (
            this.addForm.cameraId &&
            this.oldCameraName == value
          ) {
            callback()
          }
          api
            .checkCameraName(value)
            .then(data => {
              if (data.code != 200) {
                return Promise.reject()
              }

              if (data.data == 0) {
                return callback(
                  new Error('摄像机名称已被注册')
                )
              }

              callback()
            })
            .catch(() => {
              callback(new Error('摄像机名称查询失败'))
            })
        } else {
          return callback(
            new Error(
              '摄像机名称由1-50位中文、英文、数字、下划线组成'
            )
          )
        }
      }
    }

    var derection = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error('方向不能为空'))
      } else {
        callback()
      }
    }

    var transcodingId = (rule, value, callback) => {
      if (!value) {
        return callback(
          new Error('所属视频上云网关不能为空')
        )
      } else {
        if (
          this.oldTranscodingId == value &&
          this.addForm.cameraId
        ) {
          return callback()
        }
        api
          .getCameraRemainder(value)
          .then(data => {
            console.log('getCameraRemainder=>', data)
            if (data.code !== 2001) {
              return Promise.reject()
            }
            callback()
          })
          .catch(() => {
            callback(
              new Error(
                '视频上云网关下摄像机挂载数量已达到最大值'
              )
            )
          })
      }
    }

    var cameraPile = (rule, value, callback) => {
      var val1 = this.addForm.cameraKmpile
      var val2 = this.addForm.cameraHmpile
      const reg = /^\d{1,5}$/
      if (reg.test(val1) && reg.test(val2)) {
        callback()
      } else {
        return callback(new Error('桩号为取值0~99999'))
      }
    }

    var longitude = (rule, value, callback) => {
      const reg = /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(
          new Error('经度整数部分为0-180,小数部分为0到6位!')
        )
      }
    }

    var latitude = (rule, value, callback) => {
      const reg = /^(-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(
          new Error('纬度整数部分为0-90,小数部分为0到6位!')
        )
      }
    }

    return {
      style: {
        left: '28px'
      },
      drawer: false,
      editing: false,
      indexMapLevel: '',
      cameraDialogInfo: {},
      stepSize: 1,
      baseWindowWidth: (576 / 1920) * window.innerWidth,
      isThreePlayer: false,
      isAliPlayer: false,
      addFormRules: {
        //新增弹窗验证规则
        roadId: [
          {
            required: true,
            validator: roadId,
            trigger: 'blur'
          }
        ],
        classify: [
          {
            required: true,
            validator: classify,
            trigger: 'blur'
          }
        ],
        cameraName: [
          {
            required: true,
            validator: cameraName,
            trigger: 'blur'
          }
        ],
        derection: [
          {
            required: true,
            validator: derection,
            trigger: 'blur'
          }
        ],
        transcodingId: [
          {
            required: true,
            validator: transcodingId,
            trigger: 'change'
          }
        ],
        cameraPile: [
          {
            required: true,
            validator: cameraPile,
            trigger: 'blur'
          }
        ],
        longitude: [
          {
            required: true,
            validator: longitude,
            trigger: 'blur'
          }
        ],
        latitude: [
          {
            required: true,
            validator: latitude,
            trigger: 'blur'
          }
        ]
      },
      videoUrl: '',
      videoDialogElement: null,
      //cameraMarkVisable                : false,
      resolutionValue: '', //视频清晰度
      currentCamera: {},
      cameraImagesVisable: false, // 视频截图视窗
      cameraImagesLoading: true,
      cameraInfoVisable: false, // 摄像头信息
      cameraInfoEditVisable: false, // 摄像头信息编辑
      showCameraControlPanel: false,
      cameraInfo: {
        targetMileageInfo: '',
        kmPile: '',
        roadCode: ''
      },
      geoCameraPath: '',
      page: { top: 0, left: 0 },
      cameraInfoForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      cameraInfoAlongForm: {},
      offCameraList: [],

      cameraInfoAlongEditVisable: false,
      getUrlLoading: false,
      cameraRegulationVisable: false, // 视频调节
      adjustBright: 80, // 视频亮度调节
      adjustContrast: 90, //视频对比度调节
      adjustAcutance: 0, //视频对比度调节
      isCloudControl: false, //云台控制显示

      zoom: 0,

      deviceInfo: {}, // webRTC流播放信息
      iswebRTC: true,

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
    }
  },
  watch: {
    /**
     * 监视视频播放窗口状态变化
     */
    visible(nv) {
      //关闭情况下情况地图marker点
      if (!nv) {
        this.$root.$emit('removeEventMarker', '')
      }
    },

    currentMapZoom(v) {
      this.zoom = v
    },
    '$parent.$parent.asideShow.left': {
      handler: function(nV) {
        console.log(nV, '传参值状态')
        if (nV) {
          this.style.left = '428px'
        } else {
          this.style.left = '28px'
        }
      },
      immediate: true
    },
    /**
     * 监视右击修改窗口状态变化
     */
    cameraInfoAlongEditVisable(nv) {
      //关闭情况下情况地图marker点
      if (nv) {
        // this.$refs.zoomLevelInput.focus()
        document.addEventListener(
          'keyup',
          this.keyupHandler
        )
      } else {
        this.$root.$emit('removeEventMarker', '')
        document.removeEventListener(
          'keyup',
          this.keyupHandler
        )
      }
    }
  },
  computed: {
    ...mapState([
      'deviceStatistics',
      'transcoding',
      'provinces',
      'orgList',
      'roadList',
      'classIfyList',
      'derectionList'
    ]),

    usePlayerType() {
      // return 'ali';
      return this.$root.playerType
    },

    classIfyArr() {
      let ar = {}
      if (this.classIfyList && this.classIfyList.length) {
        let list = this.classIfyList
        list.forEach(vo => {
          ar[vo.codeValue] = vo.codeName
        })
      }
      return ar
    }

    /* videoUrlToPlay(){
         this.getVideoUrlToPlay(this.currentCamera.cameraNum);
     }*/

    /*videoPlayer() {
        return this.$refs.videoPlayer.player
    },*/
  },

  mounted() {
    //console.info('this.$root.playerType',this.$root.playerType,this.usePlayerType);
    this.getProvince()
    // this.getOrg();
    this.getRoad()
    // this.getCodemaster({
    //   codeType: 'CLASSIFY'
    // })
    // this.getCodemaster({
    //   codeType: 'DERECTION'
    // })

    //TODO:编辑摄像头信息，需要视频上云网关
    // this.getTranscodingList({ "currPage": 1, "pageSize": 1000 });

    //去除摄像机编辑弹窗浏览器右击事件
    // document.getElementById('camera-info-edit-window-view').oncontextmenu = function () {
    //   return false;
    // }
  },
  created() {
    process.env.NODE_ENV === 'development' &&
      (window.player = this)

    document.addEventListener('click', e => {
      if (this.$refs.showPanel) {
        let isSelf = this.$refs.showPanel.contains(e.target)
        if (!isSelf) {
          this.cameraInfoAlongEditVisable = false
          !this.visible && this.$parent.checkMark?.hide()
        }
      }
    })
    this.$root.$on('asideLeftShow', asideState => {
      console.log(asideState, 'this.asideState, ')
    })
  },
  methods: {
    ...mapActions([
      'getCameraInfoByList',
      'getCameraDetails',
      'editCameraSingle',
      // "getTranscodingList",
      'getProvince',
      // "getOrg",
      'getRoad',
      'getCodemaster',
      'setCameraVisitRecords',
      'maplevelInitialize',
      'cameraYtControlAction',
      'getCameraSnapShotsAction'
    ]),
    ...mapMutations(['setSelectCameraIndex']),
    controlChange(action) {
      // if (!this.cameraInfo) return false;
      console.log(this.currentCamera)
      let params = {
        cameraNum: this.currentCamera.cameraNum,
        videoType: 10,
        action: action,
        step: this.stepSize
      }
      this.cameraYtControlAction(params).then(res => {
        console.info(res)
      })
    },

    getLongAndLati(i) {
      if (this.cameraInfo && this.cameraInfo.longAndLati) {
        return this.cameraInfo.longAndLati.split('/')[i]
      }
    },
    getAddressByLnglat(lng, lat) {
      let that = this
      AMap.plugin('AMap.Geocoder', function() {
        let geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          //city: '010'
        })
        let lnglat = [lng, lat]
        geocoder.getAddress(lnglat, function(
          status,
          result
        ) {
          if (
            status === 'complete' &&
            result.info === 'OK'
          ) {
            // result为对应的地理位置详细信息
            let address = result.regeocode.formattedAddress
            that.geoCameraPath = address
            //console.info(that.cameraInfo,result);
          }
        })
      })
    },
    // 调节视频亮度
    adjust(type) {
      this.$refs.flvPlay?.adjust(
        this.adjustBright,
        this.adjustContrast,
        this.adjustAcutance
      )
    },
    // 判断是否需要云台控制
    isCloudHigh() {
      let role = JSON.parse(
        localStorage.getItem('cloudplatform')
      )?.role
      if (role) {
        if (role.split(',').length === 1) {
          if (role.split(',')[0] === '100000167') {
            return false
          }
        }
      }
      return true
    },
    // 是否显示云台控制
    clickCloudControl() {
      this.isCloudControl = !this.isCloudControl
    },
    //视频截图
    imgCut() {
      if (this.usePlayerType === 'flv') {
        if (this.isThreePlayer) {
          this.$refs['threePlay'].uploadImage(
            this.currentCamera.cameraId
          )
        } else {
          console.log('flv')
          this.$refs['flvPlay'].uploadImage(
            this.currentCamera.cameraId
          )
        }
      }
    },
    handleRemove() {},
    // 手动上传截图
    // uploadSuccess(res,response, file, fileList){
    //   console.log(res,"res")
    // 	if (this.usePlayerType === 'flv') {
    // 	  if (this.isThreePlayer) {
    // 	    this.$refs['threePlay'].uploadSuccess(res);
    // 	  } else {
    // 	    this.$refs['flvPlay'].uploadSuccess(res);
    // 	  }
    //   }
    //   this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
    // },
    uploadImgs() {
      if (this.usePlayerType === 'flv') {
        if (this.isThreePlayer) {
          this.$refs['threePlay'].cut()
        } else {
          this.$refs['flvPlay'].cut()
        }
      }
      let blob = new Blob(this.ctx) //转化为bolb对象
      console.log(blob, 'blob')
      let params = new FormData()
      params.append('file', blob)
      this.$api.uploadImgs(params).then(res => {
        if (res.code == 200) {
          this.$message.success('截图上传成功！')
        }
      })
    },
    cameraScreen() {
      this.$emit('updateCamerasData', {
        road: this.cameraDialogInfo.roadCode
      })
      this.cameraInfoAlongEditVisable = false
    },
    /**
     * 鼠标滑出关闭弹窗
     */
    leave() {
      this.cameraInfoAlongEditVisable = false
    },
    leaveInput(cameraInfo) {
      // console.log("离开调取接口",cameraInfo)
      let latObj = {
        cameraId: cameraInfo.cameraId,
        direction: cameraInfo.derectionCode,
        targetMileageInfo: cameraInfo.kmPile,
        roadCode: cameraInfo.roadCode
      }
      console.log(latObj, 'latObj')
      api.updateCameraMileage(latObj).then(res => {
        if (res.code == 200) {
          // 事件传到子组件
          this.$message.success('摄像机桩号已修复！')
        }
        // else {
        //   this.$message.error("摄像机桩号有误！");
        // }
      })
      this.$emit('refleshMapData', '')
    },
    leaveMapInput(cameraDialogInfo, zoom) {
      // 单次执行就关闭
      this.cameraInfoAlongEditVisable = false

      let latObj = {
        cameraId: cameraDialogInfo.cameraId,
        mapLevelStart: zoom
      }
      console.log(latObj, 'latObj')
      api.updateMapLevelStart(latObj).then(res => {
        if (res.code == 200) {
          // 事件传到子组件
          this.$emit('refleshMapData', zoom)
          this.$message.success('摄像机图层修改成功！')
        }
      })
    },
    /**
     * 视频分辨率切换 删除切换标高清
     */
    resolutionChange(val) {
      //console.info('resolutionChange',val);
      this.resolutionValue = val
      if (val === '0') {
        this.updateStreamStatus(this.currentCamera)
      }
      this.getVideoUrlToPlay(this.currentCamera, 1)
    },
    // 停流
    updateStreamStatus(val) {
      let cameraIds = null
      cameraIds = [val.cameraNum]
      let data = {
        streamType: '-2',
        // streamStatus: status,
        cameraNums: cameraIds,
        // streamType: 20,
        instructions: {
          module: '资源管理',
          page: '摄像机管理',
          feature: '高清切换-',
          description: '高清切换' + 1 + '路摄像机'
        }
      }
      this.$api.updateStreamStatus(data).then(res => {
        // this.$message({
        //   message: "成功",
        //   type: "success"
        // });
      })
    },
    playerFullScreen() {
      let that = this
      /*if(that.usePlayerType === 'ali') {
          that.$refs['ckVideo'].ck_play(res.data);
      }*/
      if (that.usePlayerType === 'flv') {
        if (that.isThreePlayer) {
          that.$refs['threePlay']?.flv_fullScreen()
        } else {
          that.$refs['flvPlay']?.flv_fullScreen()
        }
        if(that.BASETargetIsNbtd){
          that.$refs['refWebRTCPlayer']?.fullScreen()
        }
      }
    },
    // 播放视频弹窗
    onPlayerDialog() {
      this.resolutionValue = '0'
    },
    /**
     * 获取播放地址
     * @param cameraNum
     */
    getVideoUrlToPlay(cameraInfo, change) {
      console.log('获取播放地址', cameraInfo, change)
      if (!cameraInfo) return false
      //console.info('getVideoUrlToPlay',cameraInfo,that.cameraInfo.cameraType === '3');

      let that = this,
        cameraNum = cameraInfo.cameraNum
      that.currentCamera = cameraInfo

      //console.info('getVideoUrlToPlay',cameraInfo,cameraInfo.cameraType === '3');
      that.isThreePlayer = cameraInfo.cameraType === '3'
      let videoTypeData = that.resolutionValue || '0'
      if(cameraInfo?.style === 3 || cameraInfo?.hdStatus == 1){
        videoTypeData = -2
      }
      // that.getUrlLoading = true;
      //m3u8Url 播放器暂时有问题
      let mediatype = this.$root.mediatype // 'flvUrl';//rtmpUr flvUrl m3u8Url
      api
        .getCameraPlayUrl({
          cameraNum: cameraNum, //record.data.cameraName,
          videoType: videoTypeData,
          mediatype: mediatype
        })
        .then(res => {
          if (res.code === 200) {
            //that.videoUrl = 'http://stdq.play.jchc.cn/live/sxjgl_stdq_320621011221001016064.m3u8?auth_key=1572992108-0-0-6f54b3f49b1c2efc94ed1d2585f6d6c1';//res.data;
            // if(res.data.isCameraControl==undefined){
            that.showCameraControlPanel =
              res.data.isCameraControl
            // }
            console.log(res, 'res')
            if (!res.data) {
              this.$message({
                message: '视频地址请求失败，' + res.message,
                type: 'error'
              })
              this.$emit('update:visible', false)
              return false
            }
            this.iswebRTC = false
           let playType = res.data?.playType || []
            if(playType[0] === 'webRTC'){
              this.iswebRTC = true
            }else {
              this.$refs.refWebRTCPlayer && this.$refs.refWebRTCPlayer.stop()
              this.iswebRTC = false
              console.log('that.$refs',that.$refs)
            }
            console.log('类型',playType[0])
            that.videoUrl = res.data //res.data;

            // 南部通道webRTC播放器信息数据整理
            if(this.BASETargetIsNbtd && this.iswebRTC){
              this.deviceInfo = {
                deviceId: cameraNum,
                gatewayId: res.data?.gatewayId,
                playerId: res.data?.playerId,
                playUrl: res.data?.webRTC,
                IP: res.data?.IP,
                isCall: false
              }
            } 
            let playerTodo = function() {
              if (mediatype === 'm3u8Url') {
                that.isAliPlayer = true
              }
              if (that.usePlayerType === 'ali') {
                that.$root.$emit(
                  'setLoadAliPlayer',
                  that.videoUrl
                )
              }

              if (
               (that.usePlayerType === 'flv' &&
                !that.isAliPlayer) && (!that.BASETargetIsNbtd || 
                  !that.iswebRTC)
              ) {
                if (that.isThreePlayer) {
                  that.videoUrl = res.data
                  // that.$refs.refWebRTCPlayer && that.$refs.refWebRTCPlayer.stop()
                  that.$refs['threePlay']?.flv_Play(
                    that.videoUrl.flv
                  )
                } else {
                  // alert(2)
                  that.$refs['flvPlay']?.flv_Play(
                    that.videoUrl.flv
                  )
                }
              }

              that.getUrlLoading = false
            }

            if (change && that.resolutionValue === '30') {
              //高清码流延时3秒
              setTimeout(() => {
                playerTodo()
              }, 3000)
            } else {
              playerTodo()
            }
          } else if (that.resolutionValue === '30') {
            that.resolutionValue = '0'
          }
        })
      this.showInfoWrapper()
      // 摄像机详情
      this.cameraInfoVisable = true
      // 摄像机设置
      this.cameraRegulationVisable = true
    },

    /**
     * 摄像头详细信息弹窗
     */
    showInfoWrapper() {
      let _this = this
      _this
        .getCameraDetails({
          // currPage: 1,
          // pageSize: 1 ,
          // info: { cameraName: _this.currentCamera.cameraName }
          id: _this.currentCamera.cameraNum
        })
        .then(res => {
          console.info('showInfoWrapper=>', res)
          if (res.code === 200) {
            _this.cameraInfo = JSON.parse(
              JSON.stringify(res.data)
            )
            console.log(
              _this.cameraInfo,
              '_this.cameraInfo'
            )
            _this.cameraInfoForm = res.data
            _this.cameraInfoForm.oldLongitude =
              _this.cameraInfoForm.longitude
            _this.cameraInfoForm.oldLatitude =
              _this.cameraInfoForm.latitude
            _this.cameraInfo.level = this.cameraInfo.mapLevelStart
            // _this.cameraInfoForm.provinceCode = parseInt(_this.cameraInfoForm.regionCode.substr(0, 2)) * 10000;

            // _this.cameraInfoForm.provinceCode = res.data[0].regionCode * 1;
            _this.cameraInfoForm.transcodingId =
              res.data.transcodingId * 1
            _this.cameraInfoForm.organizationId =
              res.data.organizationCode * 1
            //高德地图逆地址解析
            _this.getAddressByLnglat(
              _this.cameraInfoForm.longitude,
              _this.cameraInfoForm.latitude
            )

            this.cameraInfoVisable = true
            this.cameraInfoEditVisable = false
            this.cameraImagesVisable = false
          }
        })
    },
    /**
     * 设置视频
     */
    showRegulation() {
      this.cameraRegulationVisable = !this
        .cameraRegulationVisable
    },
    //设置视频关闭
    regulationClose() {
      this.cameraRegulationVisable = false
    },
    /**
     * 摄像头截图浏览弹窗
     */
    showImageWrapper() {
      this.cameraImagesVisable = !this.cameraImagesVisable
      // this.cameraInfoVisable = false;
      this.cameraInfoEditVisable = false
      console.log(this.currentCamera, 'curCamera')
      //console.info('showImageWrapper ',this.currentCamera);
      if (this.cameraImagesVisable) {
        // this.$refs['cameraImages'].getImages(this.currentCamera.cameraNum,null,this.currentCamera.cameraId);
      }
      this.$refs['cameraImages'].getImages(this.cameraInfo)
    },

    /**
     * 摄像头截图浏览弹窗-关闭
     */
    cameraImagesClose() {
      this.cameraImagesVisable = false
      // this.$refs['cameraImages'].destoryImages();
    },

    /**
     * 播放窗口关闭
     */
    dialogClose() {
      console.info('dialogClose')
      this.cameraImagesVisable = false
      this.cameraInfoEditVisable = false
      this.cameraInfoVisable = false
      this.cameraRegulationVisable = false
      this.isCloudControl = false
      // 停流
      if (this.resolutionValue === '1') {
        this.updateStreamStatus(this.currentCamera)
      }

      this.setSelectCameraIndex(-1)

      this.$emit('update:visible', false)

      this.resolutionValue = '0'

      if (
        this.usePlayerType === 'flv' &&
        !this.isAliPlayer
      ) {
        if (this.usePlayerType === 'flv') {
          if (this.isThreePlayer) {
            this.$refs['threePlay']?.flv_destroy()
          } else {
            this.$refs['flvPlay']?.flv_destroy()
          }
          this.$refs.refWebRTCPlayer?.stop()
        }
      }
      /*if(this.usePlayerType === 'dplayer') {
          this.$refs['dplayerH5'].dplayer_destroy();
      }*/

      if (
        this.isAliPlayer ||
        this.usePlayerType === 'ali'
      ) {
        this.$refs['aliplayer'].disposePlayer()
      }
    },

    /**
     * 播放窗口拖拽
     * @param event
     * @param id
     */
    mousedown(event, id) {
      let that = this
      //var div1 = this.videoDialogElement
      that.videoDialogElement = document.getElementById(id)
      that.videoDialogElement.style.cursor = 'move'
      let distanceX =
        event.clientX - that.videoDialogElement.offsetLeft
      let distanceY =
        event.clientY - that.videoDialogElement.offsetTop
      document.onmousemove = function(ev) {
        ev.stopPropagation()
        //console.info('onmousemove',ev,ev.target.className);
        var oevent = ev || event
        that.videoDialogElement.style.left =
          oevent.clientX - distanceX + 'px'
        that.videoDialogElement.style.top =
          oevent.clientY - distanceY + 'px'
      }
      document.onmouseup = function(ev) {
        ev.stopPropagation()
        //console.info('onmouseup',ev);
        document.onmousemove = null
        document.onmouseup = null
        that.videoDialogElement.style.cursor = 'default'
      }
    },

    /**
     * 给窗口定位
     */
    setWindowSite(mouseX, mouseY) {
      let that = this
      //var div1 = this.videoDialogElement
      //that.videoDialogElement.style.cursor = 'move';
      //let left = mouseX - that.videoDialogElement.offsetWidth/2;
      this.$nextTick(() => {
        that.videoDialogElement = document.getElementById(
          'camera-info-window-view'
        )
        //优先显示到底部，底部不够显示完整视频，再计算顶部空间
        /*let top = mouseY + 20,
            fullHeight = window.innerHeight,
            left = mouseX - this.baseWindowWidth / 2;
        let lastSpace = fullHeight - top;
        if(that.videoDialogElement.offsetHeight - lastSpace > 10){
            top = top - that.videoDialogElement.offsetHeight - 40;
        }*/
        //优先显示到顶部，底部不够显示完整视频，再放到底部
        let cameraHeight =
            that.videoDialogElement.offsetHeight,
          top = mouseY - cameraHeight - 20,
          //fullHeight = window.innerHeight,
          left = mouseX - this.baseWindowWidth / 2
        //let lastSpace = fullHeight - top;
        //不挡住页面标题
        if (top < 20) {
          top = mouseY + 20
        }
        //console.info(that.videoDialogElement,window.outerHeight,mouseX,mouseY,top,left);
        //that.videoDialogElement.style = 'left:'+left + 'px;top:'+top + 'px;transform:""';
        that.videoDialogElement.style.left = left + 'px'
        that.videoDialogElement.style.top = top + 'px'
        that.videoDialogElement.style.transform = 'none'
      })
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
        : this.$refs.cameraInfoAlongForm
      eventDom.validate(valid => {
        //console.log(valid);
        if (!valid) {
          return this.$message({
            message: '请核对填写信息',
            type: 'error'
          })
        }
        //console.info('cameraInfoAlongForm=> ',this.cameraInfoAlongForm);
        let eventData = flag
          ? this.cameraInfoForm
          : this.cameraInfoAlongForm
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
          maplevelEnd: eventData.maplevelEnd
        }

        //console.info('onInfoSubmit ',postdata);

        this.editCameraSingle(postdata).then(res => {
          if (res.code === 200) {
            if (!flag) {
              this.cameraInfoAlongEditVisable = false
              this.$root.$emit('reloadCameraList', '')
              return
            }

            this.cameraInfoEditVisable = false
            this.cameraInfoVisable = true
            this.$root.$emit('reloadCameraList', '')

            this.showInfoWrapper()
          }
        })

        /*this.addForm.organizationName=this.userInfo.organizationName;
        if(this.dialogTitle == "编辑摄像机设备"){
            return this.editCamera(this.addForm);
        }
        this.addCamera(this.addForm);*/
      })
    },

    /**
     * 摄像机信息修改弹窗经纬度change事件
     * @param flag true 视频播放弹窗修改
     *             false 右击弹窗修改
     */
    lnglatChange(flag = false) {
      var gps = flag
          ? [
              this.cameraInfoForm.longitude,
              this.cameraInfoForm.latitude
            ]
          : [
              this.cameraInfoAlongForm.longitude,
              this.cameraInfoAlongForm.latitude
            ],
        that = this

      //WGS84转GCJ-02 并在页面进行展示
      AMap.convertFrom(gps, 'gps', function(
        status,
        result
      ) {
        if (result.info === 'ok') {
          var lnglats = result.locations // Array.<LngLat>
          console.log(lnglats, 'lnglats')
          that.$root.$emit('editEventMarkerLonlat', [
            lnglats[0].lng,
            lnglats[0].lat
          ])
        }
      })
    },

    /**
     * 路段图层初始化
     * @param flag true 视频播放弹窗修改
     *             false 右击弹窗修改
     */
    editMaplevel(flag = false) {
      let eventid = flag
        ? this.cameraInfoForm.roadId
        : this.cameraInfoAlongForm.roadId
      this.maplevelInitialize({ roadId: eventid }).then(
        res => {
          if (res.code == 200) {
            this.$message({
              message: `初始化成功,共修改${res.data.length}个摄像机`,
              type: 'success'
            })

            //手动更新起始结束层级
            if (flag) {
              this.cameraInfo.maplevelStart = 1
              this.cameraInfo.maplevelEnd = 18
              this.cameraInfoForm.maplevelStart = 1
              this.cameraInfoForm.maplevelEnd = 18
            } else {
              this.cameraInfoAlongForm.maplevelStart = 1
              this.cameraInfoAlongForm.maplevelEnd = 18
            }

            //刷新地图摄像机
            this.$root.$emit('reloadCameraList', '')
          }
        }
      )
    },

    /**
     * 右击修改弹窗经纬度 复位
     * @param flag true 视频播放弹窗修改
     *             false 右击弹窗修改
     */

    resetCameraLonLat(cameraDialogInfo) {
      console.log(cameraDialogInfo, 'cameraDialogInfo')
      let latObj = {
        cameraId: cameraDialogInfo.cameraId,
        roadCode: cameraDialogInfo.roadCode,
        kmHmPile: cameraDialogInfo.khPile,
        direction: cameraDialogInfo.derection
      }
      console.log(cameraDialogInfo, 'latObj')
      api.getResetCameraPosition(latObj).then(res => {
        if (res.code == 200) {
          let data = res.data
          cameraDialogInfo.longitude = data.longitude
          cameraDialogInfo.latitude = data.latitude
          // 事件传到子组件
          this.$emit('callEvent', {
            event: 'resetCameraPosition',
            param: cameraDialogInfo
          })
          this.$message.success('摄像机点已归位！')
        } else {
          this.$message.error(
            '该摄像机点无法获取所对应的经纬度！'
          )
        }
      })
    },
    //根据道路ID全线复位摄像机点
    resetCameraRoadLonLat(cameraDialogInfo, type) {
      this.$confirm(
        '此操作将全线复位该条道路所有摄像机, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$parent.removeMarker()
          let latObj = {
            roadId: cameraDialogInfo.roadId
          }
          // console.log(cameraDialogInfo,"latObj")
          api
            .resetCameraPositionByRoadId(latObj)
            .then(res => {
              if (res.code == 200) {
                let offCameraList = res.data.failList
                // console.log(offCameraList,"失败的摄像机归位列表")
                // 事件传到子组件
                this.$emit('callEvent', {
                  event: 'offlinePointsSetIn',
                  param: offCameraList
                })
                this.$emit('updateCamerasData', {
                  road: this.cameraDialogInfo.roadCode
                })
                this.$message.success({
                  message:
                    '归位摄像机总数:' +
                    res.data.count +
                    ',归位失败摄像机总数:' +
                    res.data.errorCount +
                    ',归位成功摄像机总数:' +
                    res.data.successCount,
                  duration: 6000
                })
              } else {
                this.$message.error('全线复位有误！')
              }
            })
        })
        .catch(() => {})
    },
    edit() {
      this.editing = true
      this.$nextTick(function() {
        this.$els.input.focus()
      })
    },
    save() {
      this.editing = false
    },
    /**
     * 默认事件
     */
    //摄像机右击弹窗修改弹窗内容
    // 限制弹窗不可出边框
    setCameraInfoAlongForm(nv) {
      console.log(nv, 'setCameraInfoAlongForm event')
      this.cameraDialogInfo = nv.data
      if (nv.orgin) {
        //  console.log(nv,window,document.getElementById('camera-info-edit-window-view').clientWidth,'window orgin')
        let cWidth =
          document.getElementById(
            'camera-info-edit-window-view'
          ).clientWidth < 192
            ? 192
            : document.getElementById(
                'camera-info-edit-window-view'
              ).clientWidth
        let cHeight =
          document.getElementById(
            'camera-info-edit-window-view'
          ).clientHeight < 10
            ? 380
            : document.getElementById(
                'camera-info-edit-window-view'
              ).clientHeight
        if (nv.orgin.y + cHeight > window.innerHeight) {
          cHeight = nv.orgin.y - cHeight - 10
        } else {
          cHeight = nv.orgin.y
        }
        if (nv.orgin.x + cWidth > window.innerWidth) {
          cWidth = nv.orgin.x - cWidth - 10
        } else {
          cWidth = nv.orgin.x
        }
        console.log(cHeight, cWidth, '高度')
        //获取摄像机top和left值
        // this.page.top=nv.orgin.y;
        // this.page.left=nv.orgin.x;
        this.page.top = cHeight
        this.page.left = cWidth
      }
      var _this = this

      this.getCameraInfoByList({
        currPage: 1,
        pageSize: 1,
        info: { cameraName: nv.data.cameraName }
      }).then(res => {
        //console.info(res);
        if (res.code === 200 && res.data.length > 0) {
          this.cameraInfoAlongForm = res.data[0]
          this.cameraInfoAlongForm.oldLongitude = this.cameraInfoAlongForm.longitude
          this.cameraInfoAlongForm.oldLatitude = this.cameraInfoAlongForm.latitude
          // this.cameraInfoAlongForm.provinceCode = parseInt(this.cameraInfoAlongForm.regionCode.substr(0, 2)) * 10000;
          console.log(
            'this.cameraInfoAlongForm=>',
            this.cameraInfoAlongForm
          )
        }
      })
    },

    //摄像机右击弹窗经纬度信息修改 nv=>{position:{},flag:boolean[true:视频窗口修改，false:右击修改]}
    updateCameraLnglatForm(nv) {
      if (nv.flag) {
        this.cameraInfoForm.longitude = nv.position.lon
        this.cameraInfoForm.latitude = nv.position.lat
        return
      }
      this.cameraInfoAlongForm.longitude = nv.position.lon
      this.cameraInfoAlongForm.latitude = nv.position.lat
    },

    // 给摄像机重新分类
    infoWindowClassify(type) {
      let latObj = {
        cameraId: this.cameraDialogInfo.cameraId,
        classify: type
      }
      api.updateCamera(latObj).then(res => {
        if (res.code == 200) {
          this.cameraDialogInfo.classify = type
          // 事件传到子组件
          this.$emit('callEvent', {
            event: 'resetCameraPosition',
            param: this.cameraDialogInfo
          })
          this.$message.success('摄像机已重新分类！')
        } else {
          this.$message.error('摄像机分类有误！')
        }
      })
    },

    // 键盘事件
    keyupHandler(e) {
      if (e.keyCode == 38) {
        this.leaveMapInput(
          this.cameraDialogInfo,
          this.zoom - 1
        )
      } else if (e.keyCode == 40) {
        this.leaveMapInput(
          this.cameraDialogInfo,
          this.zoom + 1
        )
      }
    }
  },
  directives: {
    drag: {
      // 指令的定义
      bind(el) {
        console.log(el, 'el')
        let oDiv = el // 获取当前元素
        oDiv.onmousedown = e => {
          // 算出鼠标相对元素的位置
          let disX = e.clientX - oDiv.offsetLeft
          let disY = e.clientY - oDiv.offsetTop
          console.log('本身的宽高', oDiv.clientHeight)

          document.onmousemove = e => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            let top = e.clientY - disY

            if (left <= 0) {
              left = 0
            } else if (
              left >=
              document.documentElement.clientWidth -
                oDiv.clientWidth
            ) {
              //document.documentElement.clientWidth 屏幕的可视宽度
              left =
                document.documentElement.clientWidth -
                oDiv.clientWidth
            }
            if (top <= 0) {
              top = 0
            } else if (
              top >=
              document.documentElement.clientHeight -
                oDiv.clientHeight
            ) {
              // document.documentElement.clientHeight 屏幕的可视高度
              top =
                document.documentElement.clientHeight -
                oDiv.clientHeight
            }
            oDiv.style.left = left + 'px'
            oDiv.style.top = top + 'px'
          }
          document.onmouseup = e => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  }
}
