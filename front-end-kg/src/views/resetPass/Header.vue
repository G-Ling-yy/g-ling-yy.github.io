<template>
  <div class="bg-header p-m">
    <div class="logo">
      <img :src="logoUrl" alt="" />
      <span>{{ BASECONFIG.WEBSITE_NAME }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      systemName: '公路视频云联网',
      logoUrl: this.BASECONFIG.WEBSITE_LOGO,
    };
  },
  created() {},
  computed: {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.bg-header {
  background: #000;
  color: #fff;
  &.p-m {
    padding: 10px 20px;
    line-height: 50px;
    font-size: 26px;
  }
}
.logo {
  display: flex;
  align-items: center;
  img {
    width: 60px;
    margin-right: 10px;
  }
}
</style>
