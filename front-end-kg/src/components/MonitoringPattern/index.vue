<template>
  <div class="box">
    <div class="box-head">
      <div class="head-left">
        <div
          class="head-but"
          @click="differentiateScreen"
          :class="{ borderColor: differentiateScreenFlag }"
        >
          <div class="img">
            <img
              src="@/assets/images/icon/split-screen.png"
            />
          </div>
          <span>分屏</span>
        </div>
        <div
        v-if="false"
          class="head-but"
          @click="multicast"
          :class="{ borderColor: multicastFlag }"
        >
          <div class="img">
            <img src="@/assets/images/icon/multicast.png" />
          </div>
          <span>组播</span>
        </div>
        <div class="head-but" @click="projectionScreen">
          <div class="img">
            <img
              src="@/assets/images/icon/full-screen.png"
            />
          </div>
          <span>全屏</span>
        </div>
      </div>
      <div class="head-right">
         <div class="head-but" @click="oneKeyClear">
          一键清屏
        </div>
        <div class="head-but" @click="monitoringClose">
          关闭监控模式
        </div>
      </div>
    </div>
    <div class="box-main">
      <split-screen
        ref="splitScreen"
        :size="splitScreenSize"
      ></split-screen>
    </div>
  </div>
</template>

<script>
import splitScreen from './splitScreen.vue'
export default {
  components: { splitScreen },
  name: 'SaasMonitoringpattern',

  data() {
    return {
      differentiateScreenFlag: false, // 分屏
      multicastFlag: false, // 组播
      splitScreenSize: 4, //分屏数量
      // splitScreenList: [1, 4, 6, 9, 13, 16], //分屏类别
      splitScreenList: [1, 4, 6], //分屏类别
      nums: 2
    }
  },


  mounted() {},

  methods: {
    // 分屏
    differentiateScreen() {
      // this.differentiateScreenFlag = !this
      //   .differentiateScreenFlag
      this.splitScreenSize = this.splitScreenList[this.nums]
      if (this.nums + 1 >= this.splitScreenList.length) {
        this.nums = 0
      } else {
        this.nums++
      }
    },
    // 组播
    multicast() {
      this.multicastFlag = !this.multicastFlag
    },
    // 全屏
    projectionScreen() {
      this.$refs.splitScreen.projectionScreen(
        'con_lf_top_split'
      )
    },
    // 清除监控模式正在播放的所以视频
    oneKeyClear() {
      this.$refs.splitScreen.monitoringShut()
    },
    // 关闭监控模式
    monitoringClose() {
      this.monitoringRecover()
      this.$emit('monitoring-close', false)
    },
    // 监控模式关闭后恢复默认值
    monitoringRecover(){
       this.nums = 2
       this.splitScreenSize = 4
       this.$refs.splitScreen.monitoringShut()
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-align: center;
  user-select: none;
}
.box {
  width: 100%;
  // width: calc(100% - 40px);
  height: 100%;
  // height: calc(100% - 90px);
  // width: 1494px;v
  // height: 998px;
  background: rgba(0, 12, 24, 0.5);
  // box-shadow: -19px 7px 84px 84px rgba(0,192,255,0.46) inset;
  box-shadow: 0px 0px 56px 0px rgb(0 192 255) inset;
  .box-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 52px;
    // padding: 3px;
    // background: pink;
    .head-left {
      display: inline-block;
      margin-left: 15px;
      .head-but {
        display: inline-block;
        width: 120px;
        height: 46px;
        line-height: 46px;
        margin-right: 10px;
        background: rgba(0, 12, 24, 0.6);
        box-shadow: 0px 0px 25px 0px rgb(0 192 255) inset;
        border: 1px solid #02bccd;
        border-radius: 5px;
        cursor: pointer;
        .img {
          display: inline-block;
          width: 22px;
          height: 22px;
          line-height: 22px;
          font-size: 18px;
          margin-right: 5px;
          img {
            width: 100%;
            height: 100%;
            vertical-align: top;
          }
        }
        span {
          display: inline-block;
          width: 36px;
          height: 17px;
          line-height: 17px;
          margin-left: 5px;
          font-size: 16px;
          font-weight: 400;
          color: #e4ffff;
          vertical-align: text-top;
        }
        &.borderColor {
          border: 1px solid #f99801;
          span {
            color: #f99801;
          }
        }
      }
    }
    .head-right {
      display: inline-block;
      margin-right: 15px;
      .head-but {
        display: inline-block;
        width: 120px;
        height: 46px;
        line-height: 46px;
        background: rgba(0, 12, 24, 0);
        box-shadow: 0px 0px 16px 0px rgb(0 192 255) inset;
        border: 1px solid #02bccd;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        color: #e4ffff;
        cursor: pointer;
        margin-left: 10px;
      }

    }
  }
  .box-main {
    width: 100%;
    height: 100%;
  }
}
</style>
