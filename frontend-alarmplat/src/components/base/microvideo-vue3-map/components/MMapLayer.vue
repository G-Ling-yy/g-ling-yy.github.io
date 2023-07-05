<template>
  <div class="map-layer">
    <slot></slot>
  </div>
</template>

<script>
export default {
  /**
   * @description     自定义图层
   * @author          刘晖(liuh@microvideo.cn)
   * @time            2021/12/3 13:12
   */
  name: 'MMapLayer',
  data() {
    return {
      map: null
    }
  },
  methods: {
    mapLoad(e) {
      this.map = e
    }
  },
  mounted() {},
  created() {}
}
</script>

<style scoped>
.map-layer {
  position: relative;
  z-index: 101;
  display: inline-block;
}
</style>
