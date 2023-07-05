<template>
  <div class="search-bar">
    <el-input v-model="searchBlock" placeholder="请输入内容"> </el-input>
    <i class="el-icon-search" @click="refreshAmapMarks"></i>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click"
      content="您可以输入路线、桩号、管辖单位名称、摄像机名称；
若您需要搜索桩号范围，请输入Kxxx~Kxxx，例如K100~K200即为搜索千米桩为100~200范围内的摄像机；
若您需要搜索组合条件，请用空格分开，例如“G2 K100~K200”即为搜索G2路线上K100~K200范围内的摄像机；
若您搜索的摄像机桩号不存在，我们会为您自动检索上下10公里范围的摄像机。"
    >
      <i class="el-icon-question" slot="reference"></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchBlock: "",
    };
  },
  computed: {},
  watch: {},
  methods: {
    query() {
      console.log("查询");
    },
  },
};
</script>

<style lang="less">
.indexSearch {
  position: absolute;
  top: 120px;
  left: 380px;
  z-index: 999;
  .search-bar{
    display: flex;
  }
  .el-input__inner {
    background-color: #091543;
    border: 1px solid #0393d1;
    box-shadow: 0px 0px 8px 0px #0393d1;
    padding: 0 30px 0 15px;
  }
  .el-icon-search {
    color: #fff;
    font-size: 20px;
    line-height: 40px;
    left: 190px;
    position: absolute;
  }
  .el-icon-question{
    padding-left: 10px;
    color: #fff;
    font-size: 20px;
    line-height: 40px;
  }
  
}
</style>
