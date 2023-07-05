<template>
  <div class="box">
    <!-- 头部区域 -->
    <div class="box-title">
      <p>视频列表</p>
    </div>
    <!-- 内容区域 -->
    <div class="box-main">
      <div class="box-main-tree">
        <unit-org-tree
          ref="unitTree"
          @on-click="treeNode"
        ></unit-org-tree>
      </div>
    </div>
  </div>
</template>

<script>
import unitOrgTree from './unitOrgTree.vue'
export default {
  components: { unitOrgTree },
  name: 'SaasVideolist',

  data() {
    return {}
  },

  mounted() {},
  created() {
    this.$root.$on("clickVideoDialog",(item)=>{
      this.$refs.unitTree.handleTreenode()
    })
  },
  methods: {
    //    树节点事件
    treeNode() {
      
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
}
.box {
  width: 100%;
  height: 100%;
  // 减去头部区域 box-title的高度
  height: calc(100% - 56px);
  .box-title {
    position: relative;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background: rgba(0, 12, 24, 0.7);
    box-shadow: -19px 7px 84px 84px rgba(0, 192, 255, 0.46)
      inset;
    p {
      font-size: 20px;
      font-weight: 600;
      font-style: italic;
      color: #00f1fa;
      letter-spacing: 1px;
    }
    &::before {
      content: '';
      width: 8px;
      height: 100%;
      background: #00b8ce;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  // 内容区域
  .box-main {
    // width: 100%;
    height: 100%;

    padding: 30px 0;
    text-align: left;
    background: rgba(0, 12, 24, 0.5);
    box-shadow: -19px 7px 100px 2px rgba(0, 192, 255, 0.53)
      inset;
    .box-main-tree {
      height: 100%;
      padding: 0 30px;
      overflow: auto;
      // background:pink;
    }
  }
}
</style>
