<template>
  <div class="flvPlayerWrap">
    <!-- <div v-if="cameraInfo.onlineStatus == 0 ? false : true"> -->
    <!-- <div class="play-before" v-if="flvManualPlay">
      <div class="play-control" @click="flv_play" ></div>
    </div> -->
    <div class="play-pause" v-if="!flvManualPlay">
      <div class="play-control" @click="flv_pause"></div>
    </div>
    <canvas
      id="canvas"
      width="617"
      height="400"
      style="display:none"
    ></canvas>
    <video
      ref="videoEle"
      :style="[adjustVideo, adjustContrast, adjustAcutance]"
      id="videoEle"
      :class="(cameraInfo.onlineStatus == 0 && cameraInfo.hdStatus != 1) ? 'hide' : ''"
    >
      Your browser is too old which doesn't support HTML5
      video.
    </video>
    <!-- </div> -->
    <p
      v-if="cameraInfo.onlineStatus == 0 && cameraInfo.hdStatus != 1"
      class="onlineStatusTitle"
    >
      视频离线无法播放
    </p>
    <loading
      class="flvplayer-loading"
      loading-status="loading"
      message="正在加载中..."
      v-if="flvLoading && (cameraInfo.onlineStatus == 1 || cameraInfo.hdStatus == 1)"
    ></loading>
    <div class="canvasImg">
      <!-- <p class="close" @click="closeCanvas">X</p> -->
      <canvas id="canvas2" v-show="showCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import OSS from 'ali-oss'
import FlvJs from 'flv.js'
import Loading from '../../common/Loading'
export default {
  name: 'FlvPlayer',
  props: {
    cameraInfo: {
      onlineStatus: String,
      default: ''
    }
  },

  components: {
    Loading
  },
  data() {
    return {
      flvLoading: false,
      flvPlayer: null,
      chunks: [],
      recorder: null,
      canvasContext: null,
      ctx: null,
      frameId: null,
      ossStatus: 0,
      isloading: false,
      flvManualPlay: true,
      flvPause: false,
      flag: true,
      showCanvas: false,
      adjustVideo: {},
      adjustContrast: {},
      adjustAcutance: {}
    }
  },
  mounted() {
    //console.info(FlvJs,FlvJs.isSupported());
  },
  methods: {
    /**
     * 视频转换为canvas画布
     */
    cutImgIntoCanvas() {
      let canvas2 = document.getElementById('canvas2')
      let video = document.getElementById('videoEle')
      canvas2.width = video.offsetWidth
      canvas2.height = video.offsetHeight
      this.ctx = canvas2.getContext('2d')
      this.ctx.drawImage(
        video,
        0,
        0,
        canvas2.width,
        canvas2.height
      )
      return canvas2
    },
    //获取canvas的URL
    cut() {
      var canvas2 = this.cutImgIntoCanvas()
      var imgUrl = canvas2
        .toDataURL('image/jpg', 1)
        .replace('image/jpg', 'image/octet-stream')
    },
    dataURLtoFile(urlData, fileName) {
      var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
      var mime = urlData.split(',')[0].match(/:(.*?);/)[1]
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new File([ab], fileName, { type: mime })
    },
    /**
     * 上传手动截图
     */
    uploadImage(cameraId) {
      let canvas2 = document.getElementById('canvas2')
      let video = document.getElementById('videoEle')
      canvas2.width = video.offsetWidth
      canvas2.height = video.offsetHeight
      this.ctx = canvas2.getContext('2d')
      this.ctx.drawImage(
        video,
        0,
        0,
        canvas2.width,
        canvas2.height
      )
      //获取画布base64的编码
      let imgBase64 = canvas2.toDataURL('image/jpg')
      // this.showCanvas=true
      var file = this.dataURLtoFile(
        imgBase64,
        '手动截图.jpg'
      ) // 将base转为file对象
      this.doUpdateFile(cameraId, file)
    },
    /**
     * 自动上传手动截图
     */
    doUpdateFile(cameraId, file) {
      // console.log('update file',cameraId,file)
      let params = new FormData()
      params.append('file', file)
      params.append('cameraId', cameraId)
      this.$api.uploadImgs(params).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功！')
        } else {
          this.$message({
            type: 'error',
            message: res.msg || '上传失败'
          })
        }
      })
    },
    //图片下载
    imgDown(url) {
      var filename = '手动截图' + '.jpg'
      var save_link = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'a'
      )
      save_link.href = url
      save_link.download = filename
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      save_link.dispatchEvent(event)
    },
    // 调节视频 type:1:亮度 2:对比度 3:锐度
    adjust(adjustBright, adjustContrast, adjustAcutance) {
      this.adjustVideo = {
        '-webkit-filter': `brightness(${adjustBright}%) contrast(${adjustContrast}%) blur(${adjustAcutance}px)`
      }
    },
    closeCanvas() {
      this.showCanvas = false
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message.success('上传成功！')
      } else {
        this.$message({
          type: 'error',
          message: res.msg || '上传失败'
        })
      }
      this.$refs.upload.clearFiles() //上传成功之后清除历史记录
    },
    /*flv_load(sourceUrl) {
                console.log('isSupported: ' + flvjs.isSupported());
                if (mediaSourceURL.className === '') {
                    var url = document.getElementById('msURL').value;

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onload = function (e) {
                        var mediaDataSource = JSON.parse(xhr.response);
                        flv_load_mds(mediaDataSource);
                    }
                    xhr.send();
                } else {
                    var i;
                    var mediaDataSource = {
                        type: 'flv'
                    };
                    for (i = 0; i < checkBoxFields.length; i++) {
                        var field = checkBoxFields[i];
                        /!** @type {HTMLInputElement} *!/
                        var checkbox = document.getElementById(field);
                        mediaDataSource[field] = checkbox.checked;
                    }
                    mediaDataSource['url'] = document.getElementById('sURL').value;
                    console.log('MediaDataSource', mediaDataSource);
                    flv_load_mds(mediaDataSource);
                }
            },*/
    flv_Play(sourceUrl, manualPlay) {
      console.log('sourc2eUrl', sourceUrl)
      this.flag = true
      var _this = this

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

      let videoElement = this.$refs.videoEle
      console.log(
        videoElement,
        this.flvPlayer,
        'videoElement'
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
      // if(sourceUrl.indexOf("http://")>=0){
      //   sourceUrl=sourceUrl.replace("http:","")
      // }
      // console.log(window.location)
      // console.log(sourceUrl,"1211")
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
      try {
        console.log(this.flvPlayer, 'qqqq')
        this.flvPlayer.attachMediaElement(videoElement)

        this.flvPlayer.on('error', (a, b, c) => {
          // console.log("=========================== player ERROR", a, b, c);
          //this.$message.error("播放错误["+c.code+"]:"+a+" "+b+" "+c.msg);
          // this.$notification.error({
          //   message: "播放错误(" + a + ")",
          //   description:"错误原因："+ b + "，" + this.player_error_types[a] +"，错误提示："+c.msg,
          //   duration: 10,
          //   class: "player-notification",
          // })
          if (!c.code && _this.flag) {
            _this.flag = false
            this.flvPlayer.unload()
            _this.flv_play()
            return
          }

          this.flvPause = true
          this.flvPlayer.unload()
          this.flvLoading = false
          this.flvManualPlay = true
        })

        this.flvPlayer.on('statistics_info', info => {
          //console.log("=========================== player statistics_info", a, b, c);
          if (info && info.speed) {
            this.flvLoading = false
          }
        })
        this.flv_play_status_reset()
        if (!manualPlay) {
          this.flv_play()
        }
        setTimeout(() => {
          console.log('delay star plyss')
          this.flvPlayer.play()
        }, 1000)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 播放开始
     */
    flv_play() {
      this.flvPause = false
      this.flvLoading = true
      this.flvManualPlay = false
      this.flvPlayer.load()
      this.flvPlayer.play()
    },
    flv_pause() {
      this.flvPause = !this.flvPause
      if (this.flvPause) {
        this.flv_play_status_reset()
        this.flvPlayer.pause()
        this.flvPlayer.unload()
      } else {
        this.flv_play()
      }
    },
    flv_play_status_reset() {
      this.flvPause = true
      this.flvLoading = false
      this.flvManualPlay = true
    },
    flv_destroy() {
      if (this.flvPlayer) {
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    },
    //暂停
    playPause() {
      var video = document.getElementById('videoEle')
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    flv_fullScreen() {
      var ele = document.getElementById('videoEle')
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen()
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flvPlayerWrap {
  width: 100%;
  height: 100%;
  position: relative;
  #canvas {
    display: none;
  }
  video {
    width: 100%;
    // height: calc((25vw + 70px) / 16 * 9);
    height: 100%;
    background: #000;
    z-index: 10;
    // object-fit: fill;
    object-fit: contain;
  }
  // 禁用视频播放鼠标时间
  #videoEle {
    pointer-events: none;
    &::-webkit-media-controls {
      display: none !important;
    }
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
.play-before,
.play-pause,
.flvplayer-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 45, 74, 0.6);
  z-index: 11;
}
.play-before {
  .play-control {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-image: url('../../../assets/images/camera_manage/playIcon.png');
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      width: 70px;
      height: 70px;
    }
  }
}
.play-pause {
  display: none;
  .play-control {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-image: url('../../../assets/images/camera_manage/playIcon.png');
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      width: 70px;
      height: 70px;
    }
  }
}
.canvasImg {
  .close {
    position: absolute;
    top: 117%;
    right: 10px;
  }
  #canvas2 {
    padding-top: 40px;
  }
}
.onlineStatusTitle {
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 150px;
  z-index: 99;
}
.hide {
  display: none;
}
</style>
