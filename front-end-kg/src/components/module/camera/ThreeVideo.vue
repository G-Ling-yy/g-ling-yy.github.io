<template>
  <div class="flvPlayerWrap">
    <div id="playerContainer" @mousemove="videoClick"></div>
    <video
      id="threevideo"
      loop
      muted
      crossorigin="anonymous"
      playsinline
      style="display:none"
    >
      <!-- <source src="textures/pano.webm">
      <source src="textures/pano.mp4">-->
    </video>
    <!-- <source src="../../../views/123.mp4" /> -->

    <loading
      class="flvplayer-loading"
      loading-status="loading"
      message="正在加载中..."
      v-if="flvLoading"
    ></loading>
  </div>
</template>

<script>
import * as Three from 'three'
import FlvJs from 'flv.js'
import Loading from '../../common/Loading'

export default {
  name: 'ThreeVideo',
  components: {
    Loading
  },
  data() {
    return {
      flvLoading: false,
      flvPlayer: null,
      camera: null,
      scene: null,
      renderer: null,
      isUserInteracting: false,
      lon: 0,
      lat: 0,
      phi: 0,
      theta: 0,
      distance: 500,
      onPointerDownPointerX: 0,
      onPointerDownPointerY: 0,
      onPointerDownLon: 0,
      onPointerDownLat: 0,
      parentHeight: 0,
      parentWidth: 0,
      requestFrameStep: 0,
      chunks: [],
      recorder: null,
      canvasContext: null,
      frameId: null,
      isloading: false
    }
  },
  mounted() {},
  methods: {
    init() {
      const _this = this
      var container, mesh

      //console.info(Three);

      container = document.getElementById('playerContainer')
      this.parentHeight = container.offsetHeight
      this.parentWidth = container.offsetWidth

      this.camera = new Three.PerspectiveCamera(
        75,
        this.parentWidth / this.parentHeight,
        1,
        1100
      )
      this.camera.target = new Three.Vector3(0, 0, 0)
      this.scene = new Three.Scene()
      var geometry = new Three.SphereBufferGeometry(
        500,
        60,
        40
      )
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, 1, 1)

      var video = document.getElementById('threevideo')
      //video.play();
      var texture = new Three.VideoTexture(video)

      var material = new Three.MeshBasicMaterial({
        map: texture
      })
      mesh = new Three.Mesh(geometry, material)
      this.scene.add(mesh)
      this.renderer = new Three.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      //this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.renderer.setSize(
        this.parentWidth,
        this.parentHeight
      )
      container.appendChild(this.renderer.domElement)
      container.addEventListener(
        'mousedown',
        this.onDocumentMouseDown,
        false
      )
      container.addEventListener(
        'mousemove',
        this.onDocumentMouseMove,
        false
      )
      container.addEventListener(
        'mouseup',
        this.onDocumentMouseUp,
        false
      )
      container.addEventListener(
        'wheel',
        this.onDocumentMouseWheel,
        false
      )
      //window.addEventListener( 'resize', _this.onWindowResize, false );
      //container.addEventListener( 'resize', _this.onWindowResize, false );
    },
    onWindowResize() {
      let _this = this
      _this.camera.aspect =
        _this.parentWidth / _this.parentHeight
      _this.camera.updateProjectionMatrix()
      _this.renderer.setSize(
        _this.parentWidth,
        _this.parentHeight
      )
    },
    onDocumentMouseDown(event) {
      event.preventDefault()
      let _this = this
      _this.isUserInteracting = true
      _this.onPointerDownPointerX = event.clientX
      _this.onPointerDownPointerY = event.clientY
      _this.onPointerDownLon = _this.lon
      _this.onPointerDownLat = _this.lat
    },
    onDocumentMouseMove(event) {
      let _this = this
      if (_this.isUserInteracting === true) {
        _this.lon =
          (_this.onPointerDownPointerX - event.clientX) *
            0.1 +
          _this.onPointerDownLon
        _this.lat =
          (_this.onPointerDownPointerY - event.clientY) *
            0.1 +
          _this.onPointerDownLat
      }
    },
    onDocumentMouseUp() {
      let _this = this
      _this.isUserInteracting = false
    },
    onDocumentMouseWheel(event) {
      this.distance = Three.Math.clamp(
        this.distance + event.deltaY * 0.1,
        1,
        500
      )
    },
    animate() {
      if (this.renderer) {
        this.requestFrameStep = window.requestAnimationFrame(
          this.animate
        )
        this.update()
      }
    },
    update() {
      this.lat = Math.max(-85, Math.min(85, this.lat))
      this.phi = Three.Math.degToRad(90 - this.lat)
      this.theta = Three.Math.degToRad(this.lon)
      this.camera.position.x =
        this.distance *
        Math.sin(this.phi) *
        Math.cos(this.theta)
      this.camera.position.y =
        this.distance * Math.cos(this.phi)
      this.camera.position.z =
        this.distance *
        Math.sin(this.phi) *
        Math.sin(this.theta)
      this.camera.lookAt(this.camera.target)
      this.renderer.render(this.scene, this.camera)
    },

    flv_Play(sourceUrl) {
      if (!FlvJs.isSupported()) {
        var check1 = !!window.MediaSource
        var check2 = false
        if (
          check1 &&
          window.MediaSource.isTypeSupported(
            'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
          )
        ) {
          check2 = true
        }
        alert(
          '你的设备不支持flvjs。其中window.MediaSource：' +
            check1 +
            '。\n window.MediaSource.isTypeSupported(\'video/mp4; codecs="avc1.42E01E,mp4a.40.2"\'):' +
            check2
        )
      }

      let videoElement = document.getElementById(
        'threevideo'
      )
      if (typeof this.flvPlayer !== 'undefined') {
        if (this.flvPlayer != null) {
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
          this.flvPlayer.destroy()
          this.flvPlayer = null
        }
      }

      // 根据加载的数据，动态设置播放位置
      /*videoElement.addEventListener('progress', function() {
                    var range = 0;
                    var bf = this.buffered;
                    var time = this.currentTime;

                    while(!(bf.start(range) <= time && time <= bf.end(range))) {
                        range += 1;
                    }
                    this.currentTime = this.buffered.end(range) + 0.08;
                    //console.info('progress ',this.currentTime,this.buffered,range);
                });*/

      this.flvPlayer = FlvJs.createPlayer(
        {
          type: 'flv',
          isLive: true, // 直播
          hasVideo: true, // 视频
          hasAudio: false, // 音频
          //autoplay        : true, // 自动播放
          //controls        : true, // 控件
          url: sourceUrl, // 视频地址
          withCredentials: false, //

          cors: true,
          timestampBase: 0
        },
        {
          /*enableWorker: false,
                    lazyLoadMaxDuration: 3 * 60,
                    seekType: 'range',*/

          //seekType: 'range', // 搜索
          enableWorker: true, // 分离线程加载数据
          enableStashBuffer: false, //禁用IO存储缓冲区,解决卡顿的根本问题
          //stashInitialSize: 1,//指示IO存储缓冲区初始大小,默认是 384kb*/
          //lazyLoad: true,// 数据缓存量足够情况下停止加载。默认打开，这里会阻止实时加载。
          //lazyLoadMaxDuration: 60,// 缓存秒数
          //lazyLoadRecoverDuration: 20,// 更新覆盖描述
          deferLoadAfterSourceOpen: false // 切换浏览器选项卡之后停止加载，false取消限制
          //autoCleanupSourceBuffer: true,
          //autoCleanupMaxBackwardDuration: 60,
          //autoCleanupMinBackwardDuration: 30,
          //statisticsInfoReportInterval: 1,
          //fixAudioTimestampGap: false,
        }
      )
      this.flvPlayer.attachMediaElement(videoElement)
      this.flvPlayer.on('error', (a, b, c) => {
        // console.log("=========================== player ERROR", a, b, c);
        this.$message.error('视频播放失败')
        // this.$notification.error({
        //   message: "播放错误(" + a + ")",
        //   description:
        //     "错误原因：" +
        //     b +
        //     "，" +
        //     this.player_error_types[a] +
        //     "，错误提示：" +
        //     c.msg,
        //   duration: 10,
        //   class: "player-notification"
        // });
        this.flvPlayer.unload()
        this.flvLoading = false
      })
      this.flvPlayer.on('statistics_info', info => {
        //console.log("=========================== player statistics_info", a, b, c);
        if (info && info.speed) {
          this.flvLoading = false
        }
      })

      //console.info(this.flvPlayer,this.flvPlayer.play,sourceUrl);
      try {
        this.flvLoading = true
        this.flvPlayer.load()
      } catch (e) {
        that.$message({
          type: 'warning',
          message: ''
        })
      }
      this.flvPlayer.play()
      // this.flvLoading = true;
      // this.flvPlayer.load();
      // this.flvPlayer.play();

      /*setTimeout(()=>{
                    this.flvPlayer.play();
                },1000)*/

      /** */
      !this.renderer && this.init()
      this.animate()
    },
    flv_destroy() {
      if (this.flvPlayer) {
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
        //全景机展示重置
        //this.update();
        //this.camera = null;
        this.scene = null
        this.renderer = null
        document.getElementById(
          'playerContainer'
        ).innerHTML = ''
        //console.info('this.requestFrameStep   ',this.requestFrameStep);
        if (this.requestFrameStep)
          window.cancelAnimationFrame(this.requestFrameStep)
      }
    },
    flv_fullScreen() {
      let ele = document.querySelector(
        '#playerContainer canvas'
      )
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen()
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen()
      }
      /*let container = document.getElementById( 'playerContainer' );
                /!*container.style.height = window.offsetHeight;
                container.style.width  = window.innerWidth;*!/

                container.style = {
                    height : window.innerHeight,
                    width  : window.innerWidth,
                };*/
      //console.info('flv_fullScreen  ',ele.offsetHeight,container.offsetHeight);
      //this.onWindowResize();
    },
    videoClick(event) {
      //event.preventDefault();
      event.stopPropagation()
    },
    playPause() {
      var video = document.getElementById('threevideo')
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    loopvideoStart() {
      this.chunks = []
      let canvasElement = document.querySelector('#canvas')
      const frameRate = 60
      const encodeType = 'video/webm;codecs=vp8'
      //   this.frameId = null;
      //设置画布背景
      this.canvasContext = canvasElement.getContext('2d')
      this.canvasContext.fillStyle = 'deepskyblue'
      this.canvasContext.fillRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )
      //创建MediaRecorder，设置媒体参数
      const stream = canvasElement.captureStream(frameRate)
      this.recorder = new MediaRecorder(stream, {
        mimeType: encodeType
      })
      //收集录制数据
      this.recorder.ondataavailable = e => {
        this.chunks.push(e.data)
      }

      this.recorder.start(10)
      this.drawFrame()
    },
    // 播放视频
    drawFrame() {
      let videoElement = document.querySelector(
        '#threevideo'
      )
      const videoWidth = 617
      const videoHeight = 400
      this.canvasContext.drawImage(
        videoElement,
        0,
        0,
        videoWidth,
        videoHeight
      )
      this.frameId = requestAnimationFrame(this.drawFrame)
    },
    // 下载录制内容
    videoDownload() {
      let blob = new Blob(this.chunks)
      let url = window.URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = new Date().getTime() + '.mp4'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    loopVideoStop() {
      this.recorder.stop()
      this.videoDownload()
      this.isloading = true
      this.$parent.$parent.getOssInfo()
    }
  }
}
</script>

<style lang="less" scoped>
#playerContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.flvPlayerWrap {
  width: 100%;
  height: 100%;
  position: relative;
  video {
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 10;
    object-fit: contain;
  }

  .flvplayer-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(13, 45, 74, 0.6);
    z-index: 11;
  }
}

/*video默认setting按钮*/
video::-internal-media-controls-overflow-button {
  display: none !important;
}
/*播放按钮*/
video::-webkit-media-controls-play-button {
  display: none !important;
}
/* 时间线*/
video::-webkit-media-controls-timeline {
  display: none !important;
}
/* 时间*/
video::-webkit-media-controls-current-time-display {
  display: none !important;
}
video::-webkit-media-controls-time-remaining-display {
  display: none !important;
}
/*video默认aduio音量按钮*/
video::-webkit-media-controls-mute-button {
  display: none !important;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none !important;
}
video::-webkit-media-controls-volume-slider {
  display: none !important;
}
</style>
