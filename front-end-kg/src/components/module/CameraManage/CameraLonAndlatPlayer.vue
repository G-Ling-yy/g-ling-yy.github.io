<template>
  <el-dialog
    :title="cameraName"
    :visible="visible"
    custom-class="camera-player-dialog gd-custom-dialog"
    width="885px"
    v-dialogDrag="{ fullScreen: false }"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="video-wrapper">
      <flv-player v-if="visible" ref="flvPlay" video-type="flv"></flv-player>
    </div>
  </el-dialog>
</template>
<script>
import flvPlayer from "../camera/FlvPlayer";
export default {
  name: "CameraLonAndlatPlayer",
  components: {
    flvPlayer,
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    cameraName: String,
  },
  methods: {
    handleClose() {
      this.$parent.handleCameraClose();
    },
    handleDestroy() {
      this.$refs["flvPlay"].flv_destroy();
    },
    getFlvFlayer(url) {
      return this.$refs["flvPlay"].flv_Play(url.flv);
    },
  },
};
</script>
<style>
.video-wrapper {
  width: 100%;
  height: 100%;
  background: #f0f2f8;
  border-radius: 4px;
  vertical-align: middle;
}
</style>

