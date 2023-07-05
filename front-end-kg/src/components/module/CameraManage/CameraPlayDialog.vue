<template>
  <el-dialog
    title="播放视频"
    :visible="visible"
    width="676px"
    @close="cameraPlayDialogClose"
    custom-class="camera-player-dialog gd-custom-dialog"
    v-dialogDrag="{ fullScreen: false }"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="0"
  >
    <div class="camera-name">
      <span
        class="state-square"
        :style="
          `background:${
            playerCamera.synOnlineStatus == null
              ? stateList[2].color
              : stateList[playerCamera.synOnlineStatus]
                  .color
          }`
        "
      ></span>
      {{ cameraName }}
    </div>
    <div class="player-wrapper">
      <div class="video-wrapper">
        <!-- flv播放器 -->
        <flv-player
          ref="flvPlay"
          v-if="!isThreePlayer && !BASETargetIsNbtd"
          video-type="flv"
        ></flv-player>

        <!-- 全景播放器 -->
        <three-player
          ref="threePlay"
          v-if="isThreePlayer && !BASETargetIsNbtd"
          video-type="flv"
        ></three-player>

        <!-- webRTC播放器 -->
        <webRTC-player
          v-if="BASETargetIsNbtd"
          ref="refWebRTCPlayer"
          :device="deviceInfo"
        />
      </div>
      <div class="video-consol">
        <div class="cloud-console">
          云台控制
        </div>
        <div class="control-wrap">
          <div class="control-center">云台</div>
          <div class="control-panel">
            <div
              class="control-top"
              @click="controlChange(3)"
            >
              <i class="el-icon-caret-top"></i>
            </div>
            <div
              class="control-right"
              @click="controlChange(2)"
            >
              <i class="el-icon-caret-top"></i>
            </div>
            <div
              class="control-bottom"
              @click="controlChange(4)"
            >
              <i class="el-icon-caret-top"></i>
            </div>
            <div
              class="control-left"
              @click="controlChange(1)"
            >
              <i class="el-icon-caret-top"></i>
            </div>
          </div>
        </div>
        <div class="control-column">
          <div class="zoom">
            <div class="left-btn">
              <div
                class="minus"
                @click="controlChange(5)"
              ></div>
            </div>
            变倍
            <div class="right-btn">
              <div
                class="add"
                @click="controlChange(6)"
              ></div>
            </div>
          </div>
          <div class="focusing">
            <div class="left-btn">
              <div
                class="minus"
                @click="controlChange(7)"
              ></div>
            </div>
            聚焦
            <div class="right-btn">
              <div
                class="add"
                @click="controlChange(8)"
              ></div>
            </div>
          </div>
          <div class="aperture">
            <div class="left-btn">
              <div
                class="minus"
                @click="controlChange(9)"
              ></div>
            </div>
            光圈
            <div class="right-btn">
              <div
                class="add"
                @click="controlChange(10)"
              ></div>
            </div>
          </div>
        </div>
        <div class="step-size">
          <span>步长</span>
          <el-input-number
            v-model="stepSize"
            controls-position="right"
            :min="1"
            :max="8"
          ></el-input-number>
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <div class="user-hander">
        <!-- <span @click="closeStream" v-if="showStream">
          <img
            src="../../../assets/images/camera_manage/offlineIcon.png"
            alt
          />
          <span>关流</span>
        </span>
        <span @click="openStream" v-else>
          <img
            src="../../../assets/images/camera_manage/openIcon.png"
            alt
          />
          <span>开流</span>
        </span> -->

        <span @click="closeVideo" v-if="showVideo">
          <img
            src="../../../assets/images/camera_manage/pauseIcon.png"
            alt
          />
          <span>暂停</span>
        </span>
        <span @click="playVideo" v-else>
          <i class="el-icon-video-play"></i>
          <span>播放</span>
        </span>

        <span
          @click="openVideo"
          v-if="showOpen === '0' ? true : false"
        >
          <img
            src="../../../assets/images/camera_manage/openIcon.png"
            alt
          />
          <span>开放</span>
        </span>

        <span @click="pauseVideo" v-else>
          <i class="el-icon-circle-close"></i>
          <span>关闭</span>
        </span>
        <span @click="fullScreen" v-if="isThreePlayer">
          <i class="el-icon-full-screen" />
          <span>全屏</span>
        </span>
      </div>
      <div class="user-hander">
        <!-- <span
          style="margin-left:30px;width:100px;"
          v-if="isCloud && !isLoadings"
          id="button-start"
          @click="cloudVideo"
        >
          <img
            src="../../../assets/images/camera_manage/cloudpage.png"
            class="imgBox"
            alt
          />
          <span>云端录像</span>
        </span>
        <span
          style="margin-left:30px;width:100px;"
          v-else-if="!isCloud"
          id="button-stop"
          @click="readlyVideo"
        >
          <img
            src="../../../assets/images/camera_manage/clouldReadly.png"
            class="imgBox"
            alt
          />
          <span>已录像{{ count }}s</span>
        </span>
        <span
          style="margin-left:30px;width:100px;"
          v-else-if="isLoadings"
          id="button-start"
        >
          <span>上传中……</span>
        </span> -->

        <template>
          <!-- <span @click="resolutionChange('1')" v-if="resolutionValue==='0'">高清</span>
          <span @click="resolutionChange('0')" v-else>标清</span> -->
          <span @click="resolutionChange('-2')">原画</span>
          <span @click="resolutionChange('1')">高清</span>
          <span @click="resolutionChange('0')">标清</span>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import OSS from 'ali-oss'
import { mapState, mapActions, mapMutations } from 'vuex'
import flvPlayer from '../camera/FlvPlayer'
import threePlayer from '../camera/ThreeVideo'
import webRTCPlayer from '@/components/module/camera/WebRTCPlayer/index.vue'
import ossutil from '../../../tools/ossUtil'
export default {
  name: 'CameraPlayDialog',
  components: {
    flvPlayer,
    threePlayer,
    webRTCPlayer
  },
  data() {
    return {
      showCameraControlPanel: 0,
      cameraName: '',
      isCloud: true,
      stepSize: 1,
      isThreePlayer: false,
      playerCamera: {
        synOnlineStatus: 1,
        cameraId: null
      },
      activeNames: '1',
      stateList: [
        { name: '离线', color: '#878787' },
        { name: '正常', color: '#26B55F' },
        { name: '故障', color: '#F9552F' }
      ],
      playerDialogVisible: false,
      timer: null,
      count: 0,
      showVideo: true,
      showOpen: this.cameraInfo.openStatus,
      showStream: true,
      streamMessage: '',
      videoMessage: '',
      dataMessage: '',
      isLoadings: false,
      cameraNums: null,
      clouldVideoData: {},
      recordId: null,
      currentPlayCamera: '',
      resolutionValue: '',
      deviceInfo: {} // webRTC流播放信息
    }
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    cameraInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    cameraId: String
  },
  computed: {
    ...mapState(['deviceStatistics', 'camera']),
    usePlayerType() {
      // return 'ali';
      return this.$root.playerType
    }
  },
  mounted() {
    // this.getVideoUrlToPlay(obj);
  },
  watch: {
    cameraId: {
      handler(newName, oldName) {},
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'getCameraPlayUrl',
      'cameraYtControlAction'
    ]),
    ...mapMutations(['setCameraVisitRecords']),
    getTimer() {
      clearInterval(this.timer)
      this.timer = null
      if (!this.timer) {
        this.count = 0
        this.timer = setInterval(() => {
          this.count++
        }, 1000)
      }
    },
    controlChange(action) {
      if (!this.cameraInfo || this.isThreePlayer)
        return false
      console.log(this.cameraInfo)
      let params = {
        cameraNum: this.cameraInfo.cameraNum,
        videoType: 10,
        action: action,
        step: this.stepSize
      }
      this.cameraYtControlAction(params).then(res => {
        // console.info(res,"res");
      })
    },

    cameraPlayDialogClose() {
      this.$emit('update:visible', false)
      if (this.isThreePlayer) {
        this.$refs.threePlay?.flv_destroy()
      } else {
        this.$refs['flvPlay']?.flv_destroy()
      }
      this.$refs.refWebRTCPlayer?.stop()
    },

    /**
     * 获取播放地址
     * @param cameraNum
     */
    getVideoUrlToPlay(val) {
      this.cameraNums = val.cameraNum
      this.currentPlayCamera = val
      let that = this,
        cameraInfo = this.cameraInfo,
        cameraNum = val.cameraNum,
        cameraName = val.cameraName
      that.isThreePlayer = cameraInfo.cameraType == 3 //lmy修改
      //m3u8Url 播放器暂时有问题
      let mediatype = that.$root.mediatype // 'flvUrl';//rtmpUr flvUrl m3u8Url
      that
        .getCameraPlayUrl({
          cameraNum: cameraNum, //record.data.cameraName,
          videoType: that.resolutionValue || '0',
          mediatype: mediatype
        })
        .then(res => {
          if (res.code === 200) {
            that.showCameraControlPanel =
              res.data.isCameraControl
            that.cameraName = res.data.cameraName
            console.log(that.cameraName, 'that.cameraName')
            if (!res.data) {
              that.$message({
                message: '视频地址请求失败，' + res.message,
                type: 'error'
              })
              this.$emit('update:visible', false)
              return false
            }
            if (this.isThreePlayer) {
              console.log(this.isThreePlayer)
              that.$refs.threePlay?.flv_Play(res.data.flv)
            } else {
              that.$refs['flvPlay']?.flv_Play(res.data.flv)
            }

            this.BASETargetIsNbtd &&
              (this.deviceInfo = {
                deviceId: cameraNum,
                gatewayId: res.data?.gatewayId,
                playerId: res.data?.playerId,
                playUrl: res.data?.webRTC,
                IP: res.data?.IP
              })
          } else if (that.resolutionValue === '30') {
            that.getVideoUrlToPlay(that.playerCamera, 1)
            //this.$emit('update:visible', false);
          }
        })
    },
    cloudVideo() {
      this.isCloud = false
      this.getTimer()
      if (this.isThreePlayer) {
        this.$refs.threePlay?.loopvideoStart()
      } else {
        this.$refs['flvPlay']?.loopvideoStart()
      }
    },
    getOssInfo() {
      let params = {
        duration: this.count,
        cameraNum: this.cameraNums
      }
      // this.$api.uploadCloudVideo(params).then((res) => {
      //   if (res.code == 200) {
      //     this.clouldVideoData = res.data;
      //     this.recordId = res.data.recordId;
      //     this.$message({
      //       type: "success",
      //       message: "录制成功",
      //     });
      //     //上传oss
      //   }
      // });
      this.uploadCloudOss()
    },
    addCloudVideoRecord(data) {
      let _this = this
      data.cameraNum = _this.cameraNums
      data.duration = _this.count
      data.status = data.status ? 1 : -1
      data.recordFilePath = data.filePath
      _this.$api.addCloudVideoRecord(data).then(res => {
        _this.isCloud = true
        _this.isLoadings = false
        if (res.code == 200 && data.status == 1) {
          if (res.data > 0) {
            _this.$message({
              type: 'success',
              message: '上传成功'
            })
          } else {
            _this.$message({
              type: 'err',
              message: '上传失败'
            })
          }
        }
      })
    },
    uploadCloudOss() {
      let val = this.isThreePlayer
        ? this.$refs['threePlay'].chunks
        : this.$refs['flvPlay'].chunks
      let blob = new Blob(val) //转化为bolb对象
      var _this = this
      ossutil
        .uploadVideo(this.cameraNums, blob)
        .then(res => {
          res.status = true
          _this.addCloudVideoRecord(res)
        })
        .catch(res => {
          res.status = false
          _this.addCloudVideoRecord(res)
        })
      // if (this.isThreePlayer) {
      //   let successParam = { status: "1", recordId: this.recordId },
      //     errorParam = { status: "-1", recordId: this.recordId };
      //   let val = this.$refs.threePlay.chunks;
      //   let blob = new Blob(val); //转化为bolb对象
      //   let head = this.clouldVideoData.header,
      //     requestType = this.clouldVideoData.method,
      //     url = this.clouldVideoData.url;
      //   this.$http
      //     .put(url, blob, { headers: head })
      //     .then(res => {
      //       this.isLoadings = false;
      //       if (res && res.status == 200) {
      //         this.$message({
      //           message: "视频上传成功,请到详情中查看!",
      //           type: "success"
      //         });
      //         this.$api.settleVideo(successParam);
      //       }
      //     })
      //     .catch(res => {
      //       this.$message({
      //         message: "视频上传失败!",
      //         type: "error"
      //       });
      //       this.$api.settleVideo(errorParam);
      //     });
      // } else {
      //   let successParam = { status: "1", recordId: this.recordId },
      //     errorParam = { status: "-1", recordId: this.recordId };
      //   let val = this.$refs["flvPlay"].chunks;
      //   let blob = new Blob(val); //转化为bolb对象
      //   let head = this.clouldVideoData.header,
      //     requestType = this.clouldVideoData.method,
      //     url = this.clouldVideoData.url;
      //   this.$http
      //     .put(url, blob, { headers: head })
      //     .then(res => {
      //       this.isLoadings = false;
      //       if (res && res.status == 200) {
      //         this.$message({
      //           message: "视频上传成功!",
      //           type: "success"
      //         });
      //         this.$api.settleVideo(successParam);
      //       }
      //     })
      //     .catch(res => {
      //       this.$message({
      //         message: "视频上传失败!",
      //         type: "error"
      //       });
      //       this.$api.settleVideo(errorParam);
      //     });
      // }
    },
    readlyVideo() {
      this.isCloud = true
      if (this.isThreePlayer) {
        this.$refs.threePlay.loopVideoStop()
        this.isLoadings = true
      } else {
        this.$refs['flvPlay'].loopVideoStop()
        this.isLoadings = true
      }
    },
    // 关流
    closeStream() {
      this.mutilStatusAll(0)
    },
    openStream() {
      this.mutilStatusAll(1)
    },
    closeVideo() {
      this.showVideo = false
      if (this.isThreePlayer) {
        this.$refs.threePlay.playPause()
      } else {
        this.$refs['flvPlay'].playPause()
      }
    },
    playVideo() {
      this.showVideo = true
      if (this.isThreePlayer) {
        this.$refs.threePlay.playPause()
      } else {
        this.$refs['flvPlay'].playPause()
      }
    },
    mutilStatusAll(obj) {
      let streamMessage =
        parseInt(obj) === 1
          ? '确定摄像机要开放推流'
          : '确定摄像机要关闭推流'
      this.$confirm(streamMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: 'gd-confirm'
      })
        .then(() => {
          // 判断是否为推拉流
          this.$api
            .updateStreamStatus({
              openStatus: parseInt(obj) === 1 ? '10' : '0',
              cameraIds: [this.cameraInfo.cameraNum],
              instructions: {
                module: '资源管理',
                page: '摄像机管理',
                feature:
                  parseInt(obj) === 1 ? '开流' : '关流',
                description:
                  this.cameraInfo.cameraName +
                    ':' +
                    parseInt(obj) ===
                  1
                    ? '推流'
                    : '停止推流'
              }
            })
            .then(res => {
              this.showStream = parseInt(obj) === 1
              this.$forceUpdate()
              this.$parent.query()
              if (!_.isEmpty(res.data.errorList)) {
                let HTMLText = ''
                _.each(res.data.errorList, (v, k) => {
                  HTMLText =
                    HTMLText +
                    '<p><span>' +
                    k +
                    ':</span><span>' +
                    v +
                    '</span></p>'
                })
                this.$alert(HTMLText, '警告', {
                  dangerouslyUseHTMLString: true,
                  type: 'error'
                })
              }
              if (!_.isEmpty(res.data.success)) {
                let len = 0
                _.each(res.data.success, (v, k) => {
                  len++
                })
                this.$message({
                  message: len + '路摄像机操作成功', //msg+'播放摄像机成功',
                  type: 'success'
                })
                if (parseInt(obj) === 1) {
                  this.getVideoUrlToPlay(
                    this.currentPlayCamera
                  )
                }
              }
            })
        })
        .catch(() => {})
    },
    openVideo() {
      this.openstream(1)
    },
    pauseVideo() {
      this.openstream(0)
    },

    resolutionChange(val) {
      //console.info('resolutionChange',val);
      this.resolutionValue = val
      this.getVideoUrlToPlay(this.cameraInfo, 1)
    },
    openstream(status) {
      this.videoMessage =
        status === 0 ? '设定摄像机关闭?' : '设定摄像机开放?'
      this.$confirm(this.videoMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: 'gd-confirm'
      }).then(() => {
        this.$api
          .batchUpdateOpen({
            cameraIds: [this.cameraInfo.cameraId],
            openStatus: status ? '1' : '0',
            // playStatus: "0",
            instructions: {
              module: '资源管理',
              page: '摄像机管理',
              feature:
                parseInt(status) === 1 ? '开放' : '关闭',
              description:
                this.cameraInfo.cameraName +
                  ':' +
                  parseInt(status) ===
                1
                  ? '对外平台开放'
                  : '对外平台不可见'
            }
          })
          .then(data => {
            if (data.code !== 200) {
              return Promise.reject(data)
            }
            this.showOpen = status ? '1' : '0'
            this.dataMessage =
              status === 0 ? '摄像机已关闭' : '摄像机已开放'
            this.$parent.query()
            this.$message({
              message: this.dataMessage, //msg+'播放摄像机成功',
              type: 'success'
            })
          })
      })
    },

    // 全景视频全屏
    fullScreen() {
      if (this.isThreePlayer) {
        const canvas = this.$refs.threePlay?.$el?.querySelector(
          '#playerContainer canvas'
        )
        if (canvas) {
          const fullScreenFunc =
            canvas.requestFullscreen ||
            canvas.webkitRequestFullScreen ||
            canvas.mozRequestFullScreen ||
            canvas.msRequestFullscreen
          fullScreenFunc.call(canvas)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-dialog__wrapper {
  align-items: center;
  display: flex;

  ::v-deep .el-dialog {
    margin: 0 auto;
  }
}
</style>
<style lang="less" scope>
.player-wrapper {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: space-between;
  .video-wrapper {
    width: 617px;
    height: 100%;
    background: #f0f2f8;
    border-radius: 4px;
    // display: inline-block;
    // margin-right: 3px;
    vertical-align: middle;
  }

  .video-consol {
    // display: inline-block;
    width: 200px;
    height: 100%;
    background: #f0f2f8;
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 4px;
    vertical-align: middle;
    text-align: center;

    .cloud-console {
      line-height: 40px;
      padding: 0px 10px;
      vertical-align: middle;
      text-align: left;

      .refresh-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../../assets/images/camera_manage/refreshIcon.png');
        float: right;
        margin-top: 12px;
        cursor: pointer;
      }

      .refresh-icon:hover {
        background-image: url('../../../assets/images/camera_manage/refreshIcon_hover.png');
      }
    }

    .control-wrap {
      width: 140px;
      height: 140px;
      border: 1px solid rgba(202, 204, 209, 1);
      border-radius: 100%;
      display: inline-block;
      cursor: pointer;
      box-sizing: border-box;
      position: relative;

      .control-center {
        width: 60px;
        height: 60px;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        text-align: center;
        line-height: 60px;
        background: #fff;
        color: #666;
        box-shadow: 0 0 5px 0 #9e9e9e;
      }
      .control-panel {
        position: absolute;
        top: 7px;
        left: 7px;
        padding: 0;
        width: 124px;
        height: 124px;
        border-radius: 50%;
        list-style: none;
        overflow: hidden;
        background-color: #bdbdbd;
        > div {
          overflow: hidden;
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 50%;
          background: #e6e6e6;
          transform-origin: 0% 100%;
          cursor: pointer;
          /*border-bottom: 1px solid #bdbdbd;*/
          transition: all 0.3s;
          &:hover {
            /*background: #dcdcdc;*/
            box-shadow: 0 0 5px 0 #9e9e9e;
            z-index: 1;
            i {
              color: #5d5d5d;
            }
          }
          &:active {
            background: #dcdcdc;
          }
          &.control-top {
            transform: rotate(-45deg) skewY(0deg);
          }
          &.control-right {
            transform: rotate(45deg) skewY(0deg);
          }
          &.control-bottom {
            transform: rotate(135deg) skewY(0deg);
          }
          &.control-left {
            transform: rotate(-135deg) skewY(0deg);
          }

          i {
            color: #9e9e9e;
            font-size: 1.5rem;
            line-height: 60px;
            transform: rotate(45deg);
          }
        }
      }
    }

    .control-column {
      > div {
        display: inline-block;
        width: 112px;
        height: 32px;
        border: 1px solid rgba(202, 204, 209, 1);
        background: linear-gradient(
          90deg,
          rgba(210, 210, 210, 1),
          rgba(255, 255, 255, 1)
        );
        border-radius: 4px;
        margin: 18px 0px 0px;
        line-height: 29px;
        position: relative;

        .left-btn {
          display: inline-block;
          width: 30px;
          background: linear-gradient(
            -90deg,
            rgba(210, 210, 210, 1),
            rgba(255, 255, 255, 1)
          );
          height: 100%;
          position: absolute;
          left: 0px;
          border-radius: 4px 0px 0px 4px;
          cursor: pointer;

          .minus {
            height: 100%;
            background-image: url('../../../assets/images/camera_manage/minus_icon.png');
            background-repeat: no-repeat;
            background-position: center;
          }
        }

        .left-btn:hover {
          .minus {
            height: 100%;
            background-image: url('../../../assets/images/camera_manage/minus_icon_hover.png');
            background-repeat: no-repeat;
            background-position: center;
          }
        }

        .right-btn {
          display: inline-block;
          width: 30px;
          background: linear-gradient(
            90deg,
            rgba(210, 210, 210, 1),
            rgba(255, 255, 255, 1)
          );
          height: 100%;
          position: absolute;
          right: 0px;
          border-radius: 0px 4px 4px 0px;
          cursor: pointer;

          .add {
            height: 100%;
            background-image: url('../../../assets/images/camera_manage/add_icon.png');
            background-repeat: no-repeat;
            background-position: center;
          }
        }

        .right-btn:hover {
          .add {
            height: 100%;
            background-image: url('../../../assets/images/camera_manage/add_icon_hover.png');
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }

    .step-size {
      margin-top: 18px;
      text-align: left;
      padding-left: 10px;

      > span {
        display: inline-block;
        width: 34px;
      }

      .el-input-number {
        width: 112px;

        .el-input-number__decrease {
          height: 14px;
          width: 24px;
          bottom: 3.5px;
          background: rgba(234, 236, 240, 1);

          i {
            vertical-align: top;
          }
        }

        .el-input-number__increase {
          height: 14px;
          width: 24px;
          background: rgba(234, 236, 240, 1);
          top: 5.5px;

          i {
            vertical-align: top;
          }
        }

        .el-input__inner {
          height: 32px;
          padding-right: 40px;
          font-size: 12px;
        }
      }
    }
  }
}
.footer-btn {
  display: flex;
  justify-content: space-between;
}
.user-hander {
  height: 50px;

  > span {
    margin-top: 10px;
    display: inline-block;
    width: 73px;
    height: 32px;
    line-height: 26px;
    border: 1px solid rgba(202, 204, 209, 1);
    border-radius: 2px;
    margin-right: 17px;
    text-align: center;
    cursor: pointer;

    img {
      margin-right: 3px;
      vertical-align: middle;
    }
    i {
      margin-right: 3px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
    .imgBox {
      width: 16px;
      height: 16px;
    }
  }
}
#button-start {
  visibility: hidden;
}
</style>
