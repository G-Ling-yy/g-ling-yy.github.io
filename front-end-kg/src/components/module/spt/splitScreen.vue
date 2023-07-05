<template>
  <div :class="projection ? 'split-screen-full' : 'split-screen'" ref="css">
    <div
      class="exit-projection"
      @click="exitProjection"
      v-show="type === 'inspection' && projection"
    >
      <i class="el-icon-full-screen icon-full-screen"></i>
    </div>
    <drop
      class="screen-camera-item"
      :style="[screenStyle]"
      v-for="(vo, key) in size"
      :key="key"
      :class="'screen-item width-' + size"
      @drop="addScreenCamera($event, key)"
    >
      <span>{{ vo }}</span>
      <template v-if="cameraList[key]">
        <div class="screen-camera-delete">
          <i class="el-icon-close" @click="removeScreenCamera(key)"></i>
        </div>
        <div class="screen-camera-title">
          <span>{{ cameraList[key].cameraName }}</span>
        </div>
        <div class="screen-camera-image">
          <flv-player :ref="'flvPlay' + key" video-type="flv"></flv-player>
        </div>
        <!-- <div class="screen-camera-definition">
          <span v-hasPermiss="10931010">
            <template>
              <span
                @click="resolutionChange(key,'1')"
                v-if="resolutionValue === '0'"
                >高清</span
              >
              <span @click="resolutionChange(key,'0')" v-else>标清</span>
            </template>
          </span>
        </div> -->
      </template>
      <template v-else>
        <div class="screen-camera-title">
          <span> </span>
        </div>
        <div class="screen-camera-image">
          <img src="../../../assets/images/login/play-xc.png" />
          <!-- <loading loading-status="empty" message="请拖入想监控的视频画面"></loading> -->
        </div>
      </template>
    </drop>
  </div>
</template>

<script>
import flvPlayer from "../camera/FlvPlayer";
import { Drop } from "vue-drag-drop";
import { mapState, mapActions } from "vuex";

export default {
  name: "SplitScreen",
  components: {
    flvPlayer,
    Drop,
  },
  data() {
    return {
      getUrlLoading: false,
      cameraList: [],
      screenStyle: {
        width: "50%",
        height: "50%",
      },
      projection: false, // 是否全屏
      resolutionValue: "",
    };
  },
  props: {
    screenType: {
      default() {
        return "";
      },
    },
    size: {
      default() {
        return 4;
      },
    },
    type: {
      default() {
        return "";
      },
    },
    /*baseList:{
      default(){
        return [];
      }
    }*/
  },
  computed: {
    ...mapState(["Camera"]),
  },
  watch: {
    size(newVal, oldVal) {
      if (this.type === "inspection") {
        this.countScreenSize();
      }
    },
  },
  created() {},
  mounted() {
    if (this.type === "inspection") {
      this.countScreenSize();
    }
    /*this.$root.$on("removeEventMarker", () => {
      if(!this.chosedMark){
        return false;
      }
      if(this.cameraMarkVisable){
        this.backMark.show();
        return false;
      }
      //console.info(this.chosedMark);
      this.chosedMark.show();
      this.removeMarker(this.backMark);

      this.$refs.dragMarkerGhost.$el.style.top = "-50px";
      this.$refs.dragMarkerGhost.$el.style.left = "-50px";

    });*/
  },
  methods: {
    ...mapActions(["setCameraVisitRecords","getCameraPlayUrl"]),
    cameraDelete(key) {
      //console.info("cameraDelete", key);
      this.$emit("itemDelete", key);
    },
    // 添加视频
    addCameraList(addCamera) {
      let domain = null;
      // console.log("我执行了", addCamera, this.cameraList);
      if (!addCamera || !addCamera.length) {
        this.cameraList.forEach((vo, idx) => {
          this.removeScreenCamera(idx);
        });
        this.cameraList = [];
        return false;
      }
      if (this.cameraList.length >= this.size) {
        this.$message.info("超过分屏数量限制！");
        return false;
      }
      if (this.cameraList.indexOf(addCamera[0]) >= 0) {
        this.$message.info("视频已存在！");
        return false;
      }
      this.cameraList.push(addCamera[0]);
      // console.log("this.cameraList", this.cameraList);
      // 判断视频播放数量传入不同参数获取不同域名播放地址
      let extent = null;
      extent = this.cameraList.length;
      if (extent > 0 && extent < 5) {
        addCamera[0].playDomain = 0;
      } else if (extent > 4 && extent < 9) {
        addCamera[0].playDomain = 1;
      } else if (extent > 8 && extent < 13) {
        addCamera[0].playDomain = 2;
      } else if (extent > 12 && extent < 17) {
        addCamera[0].playDomain = 3;
      } else {
        addCamera[0].playDomain = null;
      }
      this.$forceUpdate();
      this.$nextTick(() => {
        this.cameraPlay(this.cameraList.length - 1, addCamera[0]);
      });
    },
    setCameraList(list) {
      // console.log("我执行了", list);
      if (!list || !list.length) {
        this.cameraList.forEach((vo, idx) => {
          this.removeScreenCamera(idx);
        });
        this.cameraList = [];
        return false;
      }
      this.cameraList = [];
      list.forEach((vo, idx) => {
        console.log("播放", vo);
        this.addScreenCamera(vo, idx);
      });
    },
    addScreenCamera(cameraInfo, key) {
      console.log("drop", cameraInfo, this.cameraList, key);
      if (!cameraInfo) {
        cameraInfo = this.$parent.dropCamera;
      }

      if (this.cameraList.length >= this.size) {
        this.$message.info("超过分屏数量限制！");
        return false;
      }
      if (this.cameraList.indexOf(cameraInfo) >= 0) {
        this.$message.info("视频已存在！");
        return false;
      }
      //this.screenSizeList.push(cameraInfo);
      this.cameraList.push(cameraInfo);
      let that = this;
      //this.cameraList.push(cameraInfo);
      //this.cameraList = [...[cameraInfo]];
      this.$forceUpdate();
      this.$nextTick(() => {
        that.cameraPlay(key, cameraInfo);
      });
      /*setTimeout(() => {
        let idx = key, //this.cameraList.length - 1,
          obj = this.$refs["flvPlay"][idx];
        console.info("addScreenCamera", obj);
        this.cameraPlay(obj, cameraInfo);
      },500);*/

      console.info("addScreenCamera list", this.cameraList);
    },
    removeScreenCamera(idx) {
      let obj = this.$refs["flvPlay" + idx][0];
      if (obj) {
        obj.flv_destroy();
      }
      this.$forceUpdate();
      // delete this.cameraList[idx];
      this.cameraList.splice(idx, 1);
      this.cameraList.forEach((vo, idx) => {
        this.$forceUpdate();
        this.$nextTick(() => {
          this.cameraPlay(idx, vo);
        });
      });
    },
    cameraPlay(key, cameraInfo, change) {
      console.log("摄像机信息", key, cameraInfo);
       console.log(this.$refs);
      let idx = key, //this.cameraList.length - 1,
        refObj = this.$refs["flvPlay" + key][0];
      console.log("refObj播放", 12);
      let that = this,
        cameraNum = cameraInfo.cameraNum;

      //m3u8Url 播放器暂时有问题
      let mediatype = that.$root.mediatype; // 'flvUrl';//rtmpUr flvUrl m3u8Url
      // playDomain 传参 0-3
      let playDomain = cameraInfo.playDomain;
      // console.log(cameraInfo, "playDomain");
      let params = {
        cameraNum: cameraNum, //record.data.cameraName,
        videoType: that.resolutionValue || "0",
        mediatype: mediatype,
        playDomain: playDomain,
      };
      console.log(params, "params");
      that.getCameraPlayUrl(params).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            this.$message.error("视频地址请求失败，" + res.message);
            //this.$emit("update:visible", false);
            return false;
          }
          // console.log("refObj播放666", refObj, res.data);
          refObj.flv_Play(res.data.flv);

          let playerTodo = function () {
            if (mediatype === "m3u8Url") {
              that.isAliPlayer = true;
            }
            if (that.usePlayerType === "ali") {
              that.$root.$emit("setLoadAliPlayer", that.videoUrl);
            }
            if (that.usePlayerType === "flv" && !that.isAliPlayer) {
              if (that.isThreePlayer) {
                that.videoUrl = res.data;
                that.$refs["threePlay"].flv_Play(that.videoUrl.flv);
              } else {
                that.$refs["flvPlay"].flv_Play(that.videoUrl.flv);
              }
            }

            that.getUrlLoading = false;
          };

          if (change && that.resolutionValue === "1") {
            //高清码流延时3秒
            setTimeout(() => {
              playerTodo();
            }, 3000);
          } else {
            playerTodo();
          }
          if (!change) {
            // TODO: 增加摄像头访问记录
            that.setCameraVisitRecords({
              cameraName: cameraInfo.cameraName,
              cameraNum: cameraInfo.cameraNum,
              organizationId: cameraInfo.organizationId,
              regionCode: cameraInfo.regionCode,
              roadId: cameraInfo.roadId,
            });
          }
        } else if (that.resolutionValue === "1") {
          that.resolutionValue = "0";
        }
      });
    },
    countScreenSize() {
      let heightCss = parseInt(
        window.getComputedStyle(this.$refs.css).height.split("p")[0]
      );
      let widthCss = parseInt(
        window.getComputedStyle(this.$refs.css).width.split("p")[0]
      );
      switch (this.size) {
        case 4:
          this.screenStyle.width = `${widthCss / 2 - 6}px`;
          this.screenStyle.height = `${((widthCss / 2 - 6) * 9) / 16}px`;
          break;
        case 6:
          this.screenStyle.width = `${widthCss / 3 - 4}px`;
          this.screenStyle.height = `${((widthCss / 3 - 4) * 9) / 16}px`;
          break;
        case 9:
          this.screenStyle.width = `${widthCss / 3 - 4}px`;
          this.screenStyle.height = `${((widthCss / 3 - 4) * 9) / 16}px`;
          break;
        case 12:
          this.screenStyle.width = `${widthCss / 4 - 6}px`;
          this.screenStyle.height = `${((widthCss / 4 - 6) * 9) / 16}px`;
          break;
      }
      // switch (this.size) {
      //   case 4:
      //     this.screenStyle.width =  `${(heightCss/2-2)*16/9}px`
      //     this.screenStyle.height =  `${heightCss/2-2}px`
      //     break;
      //   case 6:
      //     this.screenStyle.width = `${(heightCss/3-4)*16/9}px`
      //     this.screenStyle.height =  `${heightCss/3-4}px`
      //     break;
      //   case 8:
      //     this.screenStyle.width = `${(heightCss/3-4)*16/9}px`
      //     this.screenStyle.height = `${heightCss/3-4}px`
      //     break;
      //   case 12:
      //     this.screenStyle.width = `${(heightCss/4-6)*16/9}px`
      //     this.screenStyle.height =  `${heightCss/4-6}px`
      //     break;
      // }
    },
    // 全屏
    clickProjection() {
      this.projection = true;
      setTimeout(() => {
        this.countScreenSize();
      }, 0);
    },
    // 退出全屏
    exitProjection() {
      console.log("hdajskhdj");
      this.projection = false;
      setTimeout(() => {
        this.countScreenSize();
      }, 0);
    },
    //高标清切换
    resolutionChange(index,val) {
      this.resolutionValue = val;
      this.cameraPlay(index,this.cameraList[index], 1);
    },
  },
};
</script>

<style lang="less" scoped>
.screen-camera-item {
  display: inline-block;
  // background-color: red;
  // flex: 1;
  padding: 0px;
  margin-bottom: 0px;
  position: relative;
  vertical-align: middle;
  > span {
    display: inline-block;
    width: 20px;
    position: absolute;
    top: 2px;
    left: 0;
    color: #fff;
    text-align: center;
  }
  .screen-camera-delete {
    position: absolute;
    top: 5px;
    right: 8px;
    z-index: 15;
    text-align: center;
    i {
      font-size: 0.675rem;
      color: #fff;
    }
  }
  .screen-camera-title {
    line-height: 22px;
    background: #0060ff;
    color: #fff;
    padding: 0 5px;
    position: absolute;
    top: 5px;
    left: 0px;
    z-index: 2;
    width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .screen-camera-image {
    border: 1px solid #2b5286;
    padding: 0;
    height: 100%;
    border-right: 0 none;
    border-bottom: 0 none;
    display: flex;
    justify-content: center;
    align-items: center;
    /*background-image: url("../../../assets/images/1.jpeg");
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: left center;*/
    img {
      width: 180px;
      height: 108px;
    }
  }
  .screen-camera-definition {
    line-height: 22px;
    background: #0060ff;
    color: #fff;
    padding: 0 5px;
    position: absolute;
    bottom: 5px;
    right: 10px;
    z-index: 99;
    width: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.split-screen {
  width: 78%;
  height: 100%;
  overflow-y: auto;
  // display: flex;
  // flex-wrap: wrap;
  border-right: 1px solid #d5d8dc;
  border-bottom: 1px solid #d5d8dc;
  // background-color: pink;
}
.split-screen-full {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #d5d8dc;
  border-bottom: 1px solid #d5d8dc;
  // background-color: pink;
  background-image: url("../../../assets/images/traffic_map/map_bg.png");
  z-index: 99;
  .exit-projection {
    cursor: pointer;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 999;
    .icon-full-screen {
      cursor: pointer;
      display: inline-block;
      width: 45px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      font-size: 26px;
      color: #fff;
    }
  }
}
</style>
