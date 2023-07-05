<template>
  <el-dialog
    title="播放视频"
    :visible="visible"
    width="885px"
    @close="cameraPlayDialogClose"
    custom-class="camera-player-dialog gd-custom-dialog"
    v-dialogDrag="{ fullScreen: false }"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div id="videoPlay">
      <video id="pathVideo" controls width="100%" height="100%" autoplay muted>
        <source type="video/mp4" :src="record" />
      </video>
    </div>
  </el-dialog>
</template>

<script>
import OSS from "ali-oss";
import { mapState, mapActions, mapMutations } from "vuex";
import flvPlayer from "../camera/FlvPlayer";
import threePlayer from "../camera/ThreeVideo";
export default {
  name: "CameraPlayDetail",
  components: {
    flvPlayer,
    threePlayer
  },
  data() {
    return {
      isCloud: true,
      stepSize: 1,
      isThreePlayer: false,
      playerCamera: {
        cameraName: "摄像机名称",
        synOnlineStatus: 1,
        cameraId: null
      },
      activeNames: "1",
      stateList: [
        { name: "离线", color: "#878787" },
        { name: "正常", color: "#26B55F" },
        { name: "故障", color: "#F9552F" }
      ],
      playerDialogVisible: false,
      timer: null,
      count: 0,
      showVideo: true,
      showOpen: true,
      showStream: true,
      streamMessage: "",
      videoMessage: "",
      dataMessage: "",
      isLoadings: false
      // recordFilePaths: ""
    };
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    cameraInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    record: String
  },
  computed: {
    ...mapState(["deviceStatistics", "camera"]),
    usePlayerType() {
      // return 'ali';
      return this.$root.playerType;
    }
  },
  methods: {
    ...mapActions(["getCameraPlayUrl", "cameraYtControlAction"]),
    ...mapMutations(["setCameraVisitRecords"]),
    cameraPlayDialogClose() {
      this.$emit("update:visible", false);
    //  let vPlay = document.getElementById("videoPlay"),
    //  pathVideo=document.getElementById("pathVideo");
    //  vPlay.removeChild(pathVideo);
    //  console.log(vPlay)
    }
  }
};
</script>

<style lang="less" scoped>
.video-wrapper {
  width: 100%;
  height: 100%;
  background: #f0f2f8;
  border-radius: 4px;
  display: inline-block;
  margin-right: 3px;
  vertical-align: middle;
}
</style>
