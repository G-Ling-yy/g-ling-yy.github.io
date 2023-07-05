<template>
  <div class="webrtc-player-container">
    <!-- loading -->
    <div v-if="loading" class="loading flex-center">
      <ma-spin size="large" />
    </div>

    <!-- 无法播放提示内容 -->
    <div
      v-else-if="isPlayError"
      class="err-tips flex-center"
    >
      <div class="err-content">
        <div class="tip-block flex-center">
          <div class="cry-face"></div>

          <div class="ps">
            <p>对不起，该视频暂时无法播放，</p>
            <p>请稍后重试。</p>
          </div>
        </div>
        <p>如有疑问，请联系运维人员处理！</p>
      </div>
    </div>

    <video
      v-else
      autoplay
      controls
      controlsList="nodownload"
      disablePictureInPicture
      muted
      ref="videoRef"
      :srcObject="srcObject"
    ></video>
  </div>
</template>

<script setup>
/* eslint no-unused-vars: off */
import { ref, watch, onMounted, onUnmounted } from 'vue'
import GDPlayer from './modules/GDPlayerPub'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  options: {
    type: Object,
    default: () => ({
      // 播放地址
      playUrl: '',

      //
      IP: '',

      // 心跳地址
      webWss: '',

      // 心跳参数
      params: {
        connectId: '',
        pushStreamRecordId: '' // 对应 heartbeatId
      }
    })
  }
})

// video dom
const videoRef = ref(),
  // 流地址数据对象
  srcObject = ref(undefined),
  // 无法播放
  isPlayError = ref(false)

// GDPlayer实例
let gdPlayer

onMounted(() => {
  // 监听 播放地址playUrl变化
  watch(
    () => props.options,
    nV => {
      // 实例停止播放
      gdPlayer?.stopPlay?.()
      gdPlayer = null
      isPlayError.value = false

      // 实例新参播放
      gdPlayer = new GDPlayer()
      srcObject.value = gdPlayer?.stream
      const { playUrl, IP, webWss, params } = nV

      if (playUrl && IP) {
        gdPlayer
          ?.play?.(playUrl, IP, webWss, params)
          .then(res => {
            console.log('播放成功 res', res)
          })
          .catch(err => {
            console.log('gg err', err)
            // 无法播放
            isPlayError.value = true
          })
      } else {
        // 无法播放
        isPlayError.value = true
      }
    },
    {
      immediate: true
    }
  )
})

onUnmounted(() => {
  // 实例停止播放
  gdPlayer?.stopPlay?.()
  gdPlayer = null
})
</script>

<style lang="less" scoped>
*:not([class|='ant']) {
  margin: 0;
  padding: 0;
}

.webrtc-player-container {
  background-color: #000;
  height: 100%;
  overflow: hidden;
  width: 100%;

  .loading {
    background-color: #333;
  }

  .err-tips {
    color: #fff;
    height: 100%;

    .err-content {
      // width: 400px;

      .tip-block {
        height: 80px;
        margin-bottom: 10px;
        position: relative;
        &::after,
        &::before {
          background: linear-gradient(
            90deg,
            transparent,
            #fff,
            transparent
          );
          content: '';
          height: 1px;
          left: -25%;
          position: absolute;
          top: 0;
          width: 150%;
        }
        &::after {
          bottom: 0;
          top: initial;
        }
        + p {
          color: #a6a6a6;
          font-size: 14px;
          padding-left: 56px;
        }

        .cry-face {
          background: url(~@images/cry.png) center / contain
            no-repeat;
          height: 40px;
          margin-right: 16px;
          width: 40px;
        }

        .ps {
          font-size: 16px;
        }
      }
    }
  }

  ::v-deep(video) {
    height: 100%;
    width: 100%;
    // 控制控件
    &::-webkit-media-controls-panel {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }
    // 音量按钮
    &::-webkit-media-controls-mute-button {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }
  }
}
</style>
