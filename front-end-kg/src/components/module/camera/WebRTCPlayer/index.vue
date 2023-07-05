<template>
  <div class="gdplayer-wrapper" v-loading="loading">
    <video autoplay id="GDPlayer-Video" ref="refGDPlayerVideo"></video>
  </div>
</template>

<script>
import GDPlayer from "./modules/GDPlayer";

let gdPlayer, // GDPlayer实例
  reLinkTimeout; // 重连定时

export default {
  props: {
    device: {
      type: Object,
      default: () => ({
        playUrl: "", // 播放地址
        playerId: "", // 此次播放标识
        gatewayId: "", // 网关id
        IP: "", // websocket所需
        isCall: true,//判断是否需要监听deviceId
      }),
    },
  },

  data() {
    return {
      loading: true,
    };
  },

  watch: {
    device(nV, oV) {
      if (nV) {
        if ((nV.deviceId === oV.deviceId) && nV.isCall) return;

        this.loading = true;
        gdPlayer = new GDPlayer();

        this.$refs.refGDPlayerVideo &&
          (this.$refs.refGDPlayerVideo.srcObject = gdPlayer.stream);
        const { playUrl, gatewayId, playerId, deviceId } = nV;
        this.play(playUrl, gatewayId, playerId, deviceId);
      }
    },
  },

  methods: {
    play(playUrl, gatewayId, playerId, deviceId) {
      // const { IP } = this.device,
      let IP = 'hdsp.gandongyun.com',
        startTime = ''
        if(this.device?.IP)IP  = this.device?.IP
      gdPlayer
        ?.play(playUrl, IP, deviceId, gatewayId, playerId, startTime, null)
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = true;
        });
    },

    stop() {
      gdPlayer?.stopPlay();
    },
    fullScreen() {
      let ele = document.querySelector(
        '#GDPlayer-Video'
      )
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen()
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen()
      }
    },
  },

  created() {
    process.env.NODE_ENV === "development" && (window.GDPlayer = this); // dev 调试用 随时删除
  },
};
</script>

<style lang="less" scoped>
.gdplayer-wrapper {
  height: 100%;
  width: 100%;

  #GDPlayer-Video {
    height: 100%;
    width: 100%;
  }
}
</style>
