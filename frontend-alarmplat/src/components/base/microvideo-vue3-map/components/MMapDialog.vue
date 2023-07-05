<template>
  <div
    v-show="visible"
    class="map-dialog"
    :style="{
      width: dialogSize[0],
      height: dialogSize[1],
      background: dialogBackground
    }"
  >
    <img :src="closeImg" @click="closeDialog" />
    <slot></slot>
  </div>
</template>

<script>
export default {
  /**
   * @description     地图信息窗体
   * @author          刘晖(liuh@microvideo.cn)
   * @time            2021/11/22 9:18
   */
  name: 'MMapDialog',
  data() {
    return {
      map: null,
      dialogSize: ['5vw', '10vh'],
      windowInfoCase: null,
      closeImg: null,
      dialogBackground: '',
      visible: false
    }
  },
  methods: {
    mapLoad(e) {
      this.map = e
    },

    /**
     * 显示弹框
     * @param size 弹框尺寸 - [String,String]
     * @param lngLat 弹框显示位置 - [Float,Float]
     * @param offset 偏移量 - [Int,Int]
     */
    openDialog(size, lngLat, offset) {
      this.visible = true
      this.dialogSize = size
      this.$mapFunction.setMapCenterAndZoom(lngLat)
      this.windowInfoCase = this.$mapFunction.createMapWindowInfo(
        {
          path: lngLat,
          content: this.$el,
          offset: offset ? offset : [15, 0]
        },
        true
      )
    },

    /**
     * 关闭弹框
     */
    closeDialog() {
      this.visible = false
      if (this.windowInfoCase) this.windowInfoCase.close()
    }
  },
  mounted() {},
  created() {
    this.closeImg = this.$businessStyleConfig.iconClose
    this.dialogBackground = this.$businessStyleConfig.background
  }
}
</script>

<style scoped>
.map-dialog {
  padding: 1vh;
  position: relative;
}

.map-dialog img {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
</style>
