<template>
  <div class="boxs">
    <div class="boxs-split clearfix" id="con_lf_top_split">
       <div
        ref="boxsVideo"
        class="boxs-video"
        v-for="(vo, key) in size"
        :key="key"
        :class="[{ 'border-active': checkedFrame === key}, `split-video-${size}`, `split-item-${key}`]"
         @click="pitchFrame(size,key)"
      >
        <!-- 给播放区域设置边框 -->
        <div class="camera-image">
          <div class="leftTopVideoFrame"></div>
          <div class="rightTopVideoFrame"></div>
          <div class="botRightVideoFrame"></div>
          <div class="botVideoFrame"></div>
        </div>
        <!-- 视频播放区域 -->
        <div
          class="camera-video"
          v-if="multiScreenList[key]"
        >
          <div
            :id="`if_top_video_${key}`"
            class="camera-video-imgs"
            @dblclick="doubleVideo(key)"
          >
            <!-- <img
            :id="`if_top_video_${key}`"
            class="camera-video-imgs"
            :src="multiScreenList[key].src"
            alt="视频"
            @dblclick="doubleVideo(key)"
          /> -->
            <flv-player
              :ref="`flvPlay${key}`"
              video-type="flv"
            ></flv-player>
          </div>
           <!-- 视频播放头部 -->
          <div class="camera-video-header">
            <p>{{ multiScreenList[key].headTitle }}</p>
            <img
              class="closeBtn pointer set-zIndex"
              src="@/assets/images/icon/close.png"
              alt="关闭"
              @click="videoClose(key)"
            />
          </div>
          <!-- 视频播放器 -->
          <!-- <img
            :id="`if_top_video_${key}`"
            class="camera-video-imgs"
            :src="multiScreenList[key].src"
            alt="视频"
            @dblclick="doubleVideo(key)"
          /> -->
          <!-- 视频播放器底部 -->
          <div class="camera-video-footer">
            <!-- 详情 -->
            <div class="footer-box set-zIndex">
              <el-select
                v-model="
                  multiScreenList[key].definitionValue
                "
                class="roleSelect"
                size="mini"
                @change="definitionValueChange(key)"
              >
                <el-option
                  v-for="item in definitionList"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div
              v-if="false"
              class="icos  footer-box pointer set-zIndex"
              @click="openDetails(key)"
            >
              <i
                class="el-icon-tickets"
                :class="{
                  orange: multiScreenList[key].isDetails
                }"
              ></i>
            </div>
            <!-- 视频详情窗口 -->
            <div
              class="camera-detail"
              v-if="multiScreenList[key].isDetails"
            >
              <div class="camera-detail-last">
                <span></span>
                <span>原始视频</span>
                <span>当前视频</span>
              </div>
              <div class="camera-detail-box">
                <span>编辑类型</span>
                <span>H.264</span>
                <span>H.264</span>
              </div>
              <div class="camera-detail-box">
                <span>宽度</span>
                <span>1920</span>
                <span>352</span>
              </div>
              <div class="camera-detail-box">
                <span>高度</span>
                <span>1080</span>
                <span>288</span>
              </div>
              <div class="camera-detail-box">
                <span>帧率</span>
                <span>25</span>
                <span>25</span>
              </div>
              <div class="camera-detail-box">
                <span>码率</span>
                <span>4040.5kb</span>
                <span>32kb</span>
              </div>
            </div>
            <!-- 摄像机摄像机云台控制按钮 -->
            <div
              v-if="false"
              class="icos  pointer set-zIndex"
              @click="openSet(key)"
            >
              <i
                class="el-icon-s-help"
                :class="{
                  orange: multiScreenList[key].isSet
                }"
              ></i>
            </div>
            <!-- 全屏 -->
            <div
              class="fullScreen pointer set-zIndex"
              @click="openFullScreen(`if_top_video_${key}`)"
            ></div>
          </div>
        </div>
        <div v-else class="camera-default">
          <!-- <div class="camera-video-header">
            <p>暂无视频</p>
          </div> -->
          <!-- 视频播放器 -->
          <img
            class="camera-default-imgs"
            src="@/assets/images/icon/play.png"
            alt="视频"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flvPlayer from '../module/camera/FlvPlayer.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SaasSplitscreen',
  components: {
    flvPlayer
  },
  props: {
    size: {
      default() {
        return 4
      }
    }
  },
  data() {
    return {
      multiScreenList: [
        // {
        //   isVideoClose: false, //视频播放显示
        //   headTitle: 'S45 上下行 K54+935 隧道', //视频标题
        //   src: require('@/assets/images/icon/play.png'), ////视频地址
        //   definitionValue: 1, //清晰度
        //   isDetails: false, //详情
        //   isSet: false, //摄像机云台控制
        //   isMaximize: false // 是否最大化
        // },
        // {
        //   isVideoClose: false, //视频播放显示
        //   headTitle: 'G1521 下行 K4+000 收费站', //视频标题
        //   src: require('@/assets/images/icon/play.png'), ////视频地址
        //   definitionValue: 0, //清晰度
        //   isDetails: false, //详情
        //   isSet: false, //摄像机云台控制
        //   isMaximize: false // 是否最大化
        // },
        // {
        //   isVideoClose: false, //视频播放显示
        //   headTitle: 'G15 上行 K1205+980 桥梁', //视频标题
        //   src: require('@/assets/images/icon/play.png'), ////视频地址
        //   definitionValue: 0, //清晰度
        //   isDetails: false, //详情
        //   isSet: false, //摄像机云台控制
        //   isMaximize: false // 是否最大化
        // },
        // {
        //   isVideoClose: false, //视频播放显示
        //   headTitle: 'G15 上行 K1230+352 服务区', //视频标题
        //   src: require('@/assets/images/icon/play.png'), ////视频地址
        //   definitionValue: 1, //清晰度
        //   isDetails: false, //详情
        //   isSet: false, //摄像机云台控制
        //   isMaximize: false // 是否最大化
        // }
      ],
      isMaximize: false,
      definitionList: [
        //清晰度的数据
        {
          value: '0',
          lable: '标清'
        },
        {
          value: '1',
          lable: '高清'
        }
      ],
      isFullScreen: false, //全屏状态值
      isDisabledClick: false, //是否禁用点击事件
      checkedFrame: 0,// 当前选择播放区域key值
    }
  },
  created() {
    let that = this
    console.log('this.size', this.size)
    // if (this.size > 4) {
    // this.multiScreenList = []
    //   for (let i = 0; i < this.size; i++) {
    //     this.multiScreenList[i] = {
    //       isVideoClose: true, //视频播放显示
    //       headTitle: 'S45 上下行 K54+935 隧道' + (i + 1), //视频标题
    //       src: require('@/assets/images/icon/play.png'), //视频地址
    //       definitionValue: 1, //清晰度
    //       isDetails: false, //详情
    //       isSet: true, //摄像机云台控制
    //       isMaximize: false // 是否最大化
    //     }
    //     // that.$refs["flvPlay" + i][0].flv_Play('https://play.hngscloud.com/live/11ab69f8-7ef0-44ea-add9-d07708fc30c7.flv?txSecret=1ebddc9e0f31e8d1d34b0be72aabda7e&txTime=619DD68D')
    //   }
    // // }
    // this.multiScreenList = Array.from(this.multiScreenList)
    // console.log('this.multiScreenList',this.multiScreenList)
  },
  watch: {
    size() {
      this.presentCameraList()
    }
  },
  mounted() {},

  methods: {
    ...mapActions([
      'setCameraVisitRecords',
      'getCameraPlayUrl'
    ]),
    // 添加视频
    addVideo(item) {
      console.log('添加视频', item)
      let addCamera = [item]
      //   if (!addCamera || !addCamera.length) {
      //   this.multiScreenList.forEach((vo, idx) => {
      //     this.removeScreenCamera(idx);
      //   });
      //   this.multiScreenList = [];
      //   return false;
      // }
      // if (this.multiScreenList.length >= this.size) {
      //   this.$message.info('超过分屏数量限制！')
      //   return false
      // }
      if (
        this.multiScreenList.some(it => {
          return it?.cameraNum === addCamera[0].cameraNum
        })
      ) {
        this.$message.info('视频已存在！')
        return false
      }
      // if (this.multiScreenList.indexOf(addCamera[0]) >= 0) {
      //   this.$message.info("视频已存在！");
      //   return false;
      // }
      let multiScreenArr = {
        ...addCamera[0],
        headTitle: null, //视频标题
        src: null, //视频地址
        definitionValue: '0' //清晰度
        // isDetails: false, //详情
        // isSet: true, //摄像机云台控制
        // isMaximize: false // 是否最大化
      }
      this.$forceUpdate()
      this.$nextTick(() => {
         this.$set(this.multiScreenList, this.checkedFrame, multiScreenArr);
         console.log('addVideo',this.multiScreenList,this.checkedFrame,this.$refs)
          this.cameraPlay(
          this.checkedFrame,
          addCamera[0]
        )
         // 当窗口为最后一个占用时，选中窗口变为第1个
        if((this.checkedFrame + 1) === this.size){
          this.checkedFrame = 0
        }else {
          this.checkedFrame++ 
        }
        // this.multiScreenList.push(multiScreenArr)

        // this.cameraPlay(
        //   this.multiScreenList.length - 1,
        //   addCamera[0]
        // )
      })
    },
    cameraPlay(key, cameraInfo) {
      console.log('视频播放', key, cameraInfo)
      let that = this,
        cameraList = cameraInfo
      let params = {
        cameraNum: cameraList.cameraNum, //record.data.cameraName,
        // cameraNum: "d044169b-caaf-431a-8316-d05739a544d1", //record.data.cameraName,
        videoType:
          that.multiScreenList[key].definitionValue,
        // mediatype: mediatype,
        mediatype: 'flvUrl'
        // playDomain: playDomain,
      }
      console.log(params, 'params')
      that.getCameraPlayUrl(params).then(res => {
        if (res.code === 200) {
          if (!res.data) {
            this.$message.error(
              '视频地址请求失败，' + res.message
            )
            return false
          }
          // 播放地址
          that.$refs["flvPlay" + key][0].flv_Play(res.data.flv)
          that.multiScreenList[key].headTitle =
            res.data.cameraName
          that.multiScreenList[key].src = res.data.flv

          //  that.$refs["flvPlay" + key][0].flv_Play('https://play.hngscloud.com/live/fff58e8b-fbd0-4ea8-9581-6300f623f437.flv?txSecret=e698eb6e2db8a1d7d5fae8d198ada204&txTime=619DD9F7')
        }
        //  that.$refs["flvPlay" + key][0].flv_Play(data.flv)
      })
    },
    // 高低清切换
    definitionValueChange(val) {
      console.log('高低清切换', val)
      this.cameraPlay(val, this.multiScreenList[val])
      // 切换高低清停流
      if (
        this.multiScreenList[val].definitionValue === '0'
      ) {
        this.updateStreamStatus(
          this.multiScreenList[val].cameraNum
        )
      }
    },
    // 触摸当前播放区域回调
    pitchFrame(val, i) {
      // console.log('当前播放区域回调',val, i)
      this.checkedFrame = i
    },
    // 视频播放窗口双击事件
    doubleVideo(key) {
      // console.log('style',this.$refs.boxsVideo)
      if (!this.isMaximize) {
        this.$refs.boxsVideo[key].style.position =
          'absolute'
        this.$refs.boxsVideo[key].style.top = '0'
        this.$refs.boxsVideo[key].style.left = '0'
        this.$refs.boxsVideo[key].style.width = '100%'
        this.$refs.boxsVideo[key].style.height = '100%'
        this.$refs.boxsVideo[key].style['z-index'] = 99999
        this.isMaximize = true
      }
    },
    // 打开摄像机设置
    openSet(key) {
      this.multiScreenList[key].isSet = !this
        .multiScreenList[key].isSet
    },
    // 当分屏由多分屏切换到低分屏数时
    presentCameraList() {
      let cameraData = [],
        that = this
      if (this.multiScreenList.length) {
        this.multiScreenList.map((vo, idx) => {
          // console.log('idx',idx)
          if (idx > parseInt(this.size) - 1) {
            that.$refs["flvPlay" + idx][0].flv_destroy()
            // this.cameraList.splice(idx, 1);
          } else {
            cameraData.push(vo)
          }
          this.multiScreenList = []
          this.multiScreenList = cameraData
        })
      }
      // 所选窗口大于切换窗口时，默认选中第一窗口
      if((this.checkedFrame+1) > this.size) {
        this.checkedFrame = 0 //恢复初始值第一窗口
      }
      // console.log('this.multiScreenList',this.multiScreenList)
    },
    // 详情
    openDetails(key) {
      this.multiScreenList[key].isDetails = !this
        .multiScreenList[key].isDetails
    },
    //   页面全屏
    projectionScreen(val) {
      this.openFullScreen(val)
    },
     // 清除监控模式正在播放的所以视频
    oneKeyClear() {
       this.monitoringShut()
     },
    monitoringShut() {
      let that = this
      this.multiScreenList.map((it, i) => {
        that.$refs.boxsVideo[i].style.cssText = null
        // 高清停流
        if(!it) return
        if (it.definitionValue === '1') {
          this.updateStreamStatus(it.cameraNum)
        }
        that.$refs["flvPlay" + i][0].flv_destroy()
      })
      this.isMaximize = false
      this.multiScreenList = []
      this.checkedFrame = 0 //恢复初始值第一窗口
    },
    videoClose(key) {
      // 重复点击延迟一秒
      if (this.isDisabledClick) return false
      this.isDisabledClick = true
      setTimeout(() => {
        this.isDisabledClick = false
      }, 1000)
      let that = this
      // 判断当前视频是否最大化
      if (this.isMaximize) {
        // 清除最大化样式
        this.$refs.boxsVideo[key].style.cssText = null
        this.isMaximize = false
      } else {
        // 高清停流
        if (
          this.multiScreenList[key].definitionValue === '1'
        ) {
          this.updateStreamStatus(
            this.multiScreenList[key].cameraNum
          )
        }
        //that.$refs["flvPlay" + this.multiScreenList.length - 1][0].flv_destroy();
           that.$refs["flvPlay" + key][0].flv_destroy()
        that.$forceUpdate()
       
         that.$set(this.multiScreenList, key, null);
          console.log('videoClose',this.multiScreenList,key,that.$refs)
        // this.multiScreenList.splice(key, 1)
        // this.multiScreenList.map((vo, idx) => {
        //   // that.$refs["flvPlay" + idx][0].flv_destroy()
        //     if(idx >= key){
        //   this.$forceUpdate()
        //   this.$nextTick(() => {
        //     // that.$refs["flvPlay" + idx][0].flv_Play(vo.src)
        //     this.cameraPlay(idx, vo)
        //   })
        //   }
        // })

        // 临时保存播放地址循环播放
        // that.$refs["flvPlay" + this.multiScreenList.length - 1][0].flv_destroy();
        // this.multiScreenList.splice(key, 1);
        // this.multiScreenList.map((vo, idx) => {
        //   // that.$refs["flvPlay" + idx][0].flv_destroy()
        //   this.$forceUpdate();
        //   this.$nextTick(() => {
        //     that.$refs["flvPlay" + idx][0].flv_Play(vo.src);
        //     // this.cameraPlay(idx,vo);
        //   });
        // });

      }
    },
    // 停流
    updateStreamStatus(val) {
      let cameraIds = null
      cameraIds = [val]
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
    // 全屏
    openFullScreen(id) {
      // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
      let element = document.getElementById(id) //设置后就是   id的容器全屏
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      // this.isFullScreen = !this.isFullScreen;
    }
  }
}
</script>

<style lang="less" scoped>
* {
  text-align: center;
  user-select: none;
}

.boxs {
  width: 100%;
  // width: calc(100% - 40px);
  // height: 100%;
  // 减去父组件box-head的高度
  height: calc(100% - 52px);
  padding: 20px 15px;
  // background-color: pink;

  .boxs-split {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: left;
    font-size: 0;

    // border: 1px solid red;
    // 单个盒子公用样式
    .boxs-video {
      // display: inline-block;
      float: left;
      position: relative;
      font-size: 16px;
      overflow: hidden;
      // border-radius: 4px;
      // opacity: 0.6;
      background: #001836;
      // padding: 2px;
      border: 2px solid rgba(41, 173, 255, 0.6);
      cursor: pointer;
      box-sizing:border-box;
      &.border-active {
        border: 2px solid rgba(0, 248, 251);
      }
      // border: 1px solid #29adff;
      // 视频按钮样式
      .camera-video {
        width: 100%;
        // /*保证宽高比16/9*/
        height: 100%;
        //   background-color: pink;
        position: relative;
        .camera-video-imgs {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
        .camera-video-header {
          position: absolute;
          top: 0;
          display: flex;
          background: rgba(0, 0, 0, 0.4);
          width: 100%;
          color: #fff;
          // line-height: 30px;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          // z-index: 120;
          .closeBtn {
            display: inline-block;
            width: 18px;
            height: 18px;
            // margin-right: 16px;
            // padding: 5px;
          }
        }
        .camera-video-footer {
          position: absolute;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          // background-color: pink;
          display: flex;
          width: 100%;
          color: #fff;
          line-height: 30px;
          align-items: center;
          justify-content: flex-end;
          .closeBtn {
            width: 18px;
            height: 18px;
            padding: 5px 20px;
          }
          .footer-box {
            margin-right: 20px;
          }
          .icos {
            vertical-align: top;
            width: 18px;
            height: 18px;
            position: relative;
            i {
              position: absolute;
              top: 0;
              left: 0;
              display: inline-block;
              font-size: 20px;
              color: #02c9f4;
              &.orange {
                color: #f99801;
              }
            }
          }
          .camera-detail {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: -190px;
            right: 0;
            width: 288px;
            // height: 180px;
            // height: calc();
            opacity: 0.6;
            background: #000204;
            .camera-detail-last {
              flex: 1;
              width: 100%;
              display: flex;
              span {
                flex: 1;
                font-size: 16px;
                font-weight: 400;
                color: #ffffff;
                text-align: center;
              }
            }
            .camera-detail-box {
              flex: 1;
              width: 100%;
              display: flex;
              span {
                flex: 1;
                font-size: 16px;
                color: #00e7fc;
                text-align: center;
              }
            }
          }
        }
        img {
          width: 100%;
          vertical-align: top;
        }
      }
      // 没有播放视频时区域
      .camera-default {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        .camera-default-imgs {
          // width: 100%;
          // height: 100%;
        }
      }
    }
    // 视频盒子样式1个盒子
    .split-video-1 {
      width: 100%;
      height: 100%;
      // border: 1px solid red;
      // 单个视频盒子样式（索引为从左到右每个子盒子）
      &.split-item-0 {
      }
    }
    // 视频盒子样式4个盒子
    .split-video-4 {
      width: 100%;
      width: calc((100% - 8px) / 2);
      height: 100%;
      height: calc((100% - 8px) / 2);
      // border: 1px solid red;
      // 单个视频盒子样式（索引为从左到右每个子盒子）
      &.split-item-0 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-1 {
        margin-bottom: 8px;
      }
      &.split-item-2 {
        margin-right: 8px;
      }
      &.split-item-3 {
      }
      // .magnify {
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 100%;
      //   z-index: 999999;
      // }
    }
    // 视频盒子样式6个盒子
    .split-video-6 {
      // width: calc((100% - 16px) / 3);
      // height: calc((100% - 8px) / 2);
      // border: 1px solid red;
      // 单个视频盒子样式（索引为从左到右每个子盒子）
      &.split-item-0 {
        width: calc((((100% - 16px) / 3) * 2 + 8px));
        height: calc((((100% - 16px) / 3) * 2) + 8px);
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-1 {
        width: calc(((100% - 16px) / 3));
        height: calc((100% - 16px) / 3);
        margin-bottom: 8px;
      }
      &.split-item-2 {
        width: calc(((100% - 16px) / 3));
        height: calc((100% - 16px) / 3);
        margin-bottom: 8px;
      }
      &.split-item-3 {
        width: calc(((100% - 16px) / 3));
        height: calc((100% - 16px) / 3);
        margin-right: 8px;
      }
      &.split-item-4 {
        width: calc(((100% - 16px) / 3));
        height: calc((100% - 16px) / 3);
        margin-right: 8px;
      }
      &.split-item-5 {
        width: calc(((100% - 16px) / 3));
        height: calc((100% - 16px) / 3);
      }
    }
    // 视频盒子样式9个盒子
    .split-video-9 {
      width: calc((100% - 16px) / 3);
      height: calc((100% - 16px) / 3);
      // border: 1px solid red;
      // 单个视频盒子样式（索引为从左到右每个子盒子）
      &.split-item-0 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-1 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-2 {
        margin-bottom: 8px;
      }
      &.split-item-3 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-4 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-5 {
        margin-bottom: 8px;
      }
      &.split-item-6 {
        margin-right: 8px;
      }
      &.split-item-7 {
        margin-right: 8px;
      }
      &.split-item-8 {
      }
    }
    // 视频盒子样式13个盒子
    .split-video-13 {
      // width: calc((100% - 16px) / 3);
      // height: calc((100% - 8px) / 2);
      // border: 1px solid red;
      // 单个视频盒子样式（索引为从左到右每个子盒子）
      &.split-item-0 {
        position: absolute;
        top: calc(((100% - 24px) / 4) + 8px);
        left: calc(((100% - 24px) / 4) + 8px);
        width: calc(((((100% - 24px) / 4) * 2)) + 8px);
        height: calc((((100% - 24px) / 4) * 2) + 8px);
      }
      &.split-item-1 {
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-2 {
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-3 {
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-4 {
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
        margin-bottom: 8px;
      }
      &.split-item-5 {
        position: absolute;
        top: calc(((100% - 24px) / 4) + 8px);
        left: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-6 {
        position: absolute;
        top: calc(((100% - 24px) / 4) + 8px);
        right: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
      &.split-item-7 {
        position: absolute;
        top: calc((((100% - 24px) / 4) + 8px) * 2);
        left: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
      &.split-item-8 {
        position: absolute;
        top: calc((((100% - 24px) / 4) + 8px) * 2);
        right: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
      &.split-item-9 {
        position: absolute;
        left: 0;
        bottom: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
      &.split-item-10 {
        position: absolute;
        left: calc(((100% - 24px) / 4) + 8px);
        bottom: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
      &.split-item-11 {
        position: absolute;
        right: calc(((100% - 24px) / 4) + 8px);
        bottom: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
      &.split-item-12 {
        position: absolute;
        right: 0;
        bottom: 0;
        width: calc((100% - 24px) / 4);
        height: calc((100% - 24px) / 4);
      }
    }
    // 视频盒子样式16个盒子
    .split-video-16 {
      width: calc((100% - 24px) / 4);
      height: calc((100% - 24px) / 4);
      // border: 1px solid red;
      // 单个视频盒子样式（索引为从左到右每个子盒子）
      &.split-item-0 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-1 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-2 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-3 {
        margin-bottom: 8px;
      }
      &.split-item-4 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-5 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-6 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-7 {
        margin-bottom: 8px;
      }
      &.split-item-8 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-9 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-10 {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      &.split-item-11 {
        margin-bottom: 8px;
      }
      &.split-item-12 {
        margin-right: 8px;
      }
      &.split-item-13 {
        margin-right: 8px;
      }
      &.split-item-14 {
        margin-right: 8px;
      }
      &.split-item-15 {
      }
    }
  }
}
// 鼠标变小手
.pointer {
  cursor: pointer;
}
.set-zIndex {
  position: relative;
  z-index: 999;
}
// 下拉框样式
::v-deep .roleSelect {
  .el-input {
    //   width: 70px;
    //   height: 20px;
    // border-radius: 5px;
    // border: 1px solid #0de3f6;
  }
  .el-input--mini .el-input__inner {
    width: 80px;
    height: 20px;
    font-size: 14px;
    // text-align: left;
    color: #01d6ea;
    // line-height: 28px;
    border-radius: 5px;
    border: 1px solid #0de3f6;
    background-color: transparent;
    //   border: 1px solid #2dc4ce;
  }
}
// 边框四角样式调整
.leftTopVideoFrame {
  // background-color: pink;
  top: -0.5px;
  left: -0.5px;
}
.rightTopVideoFrame {
  top: -2px;
  right: -2px;
  // background-color: pink;
}
.botRightVideoFrame {
  right: -0.5px;
  bottom: -0.5px;
  // background-color: pink;
}
.botVideoFrame {
  // background-color: pink;
  bottom: -0.5px;
  z-index: 123;
}

// 清除浮动
.clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  overflow: hidden;
  *zoom: 1;
}
</style>
