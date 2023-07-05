<template>
  <div class="com_searchAndpageBoxPadding">
    <div class="priority-list">
        <div class="index">1.</div>
      <el-select v-model="value1" placeholder="请选择">
        <el-option v-for="item in haha" :key="item.id" :label="item.label" :value="item.id" :disabled="disabledChoose(item)">
        </el-option>
      </el-select>
        <div class="index">2.</div>
      <el-select v-model="value2" placeholder="请选择">
        <el-option v-for="item in haha" :key="item.id" :label="item.label" :value="item.id" :disabled="disabledChoose(item)">
        </el-option>
      </el-select>
        <div class="index">3.</div>
      <el-select v-model="value3" placeholder="请选择">
        <el-option v-for="item in haha" :key="item.id" :label="item.label" :value="item.id" :disabled="disabledChoose(item)">
        </el-option>
      </el-select>
     
    </div>
     <a href="https://hngssnapshot.obs.cn-north-4.myhuaweicloud.com/7daysPic/snapshot/push.hngscloud.com/live/03a55b1b-95c7-47d7-bad1-bd2c91ab2e7d/20201110161000.jpg?AWSAccessKeyId=E644ZMSTG39MV3JVMRQ7&Expires=1620576601&Signature=6rsK4VL4cc0XwVFIXS5Ykcl%2BHfw%3D" download="下载">下载</a>
  </div>
</template>
<script>

export default {
  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
      haha: [{
        id: 1,
        value: '选项1',
        label: '部级'
      }, {
        id: 2,
        value: '选项2',
        label: '省级',
        disabled: true
      }, {
        id: 3,
        value: '选项3',
        label: '其它'
      }],
    }
  },

  computed: {
    disabledChoose(item) {
      return function (item) {
        let findItemIndex = [this.value1, this.value2, this.value3].findIndex(item2 => item2 == item.id);
        console.log('findItemIndex', findItemIndex)
        let newArr = [this.value1, this.value2, this.value3].splice(findItemIndex, 1);
        console.log('newArr', newArr)
        return newArr.includes(item.id);
      }
    }
  },
  methods: {
    showToggle(item) {
      item.isSubShow = !item.isSubShow //需要展开内容，显示与隐藏之间切换
    },
    toDetail(item) {
      this.$router.push('/helpDetails/' + item)
    },
  },
  mounted() {
  }
}
</script>
<style lang="less">
.priority-list {
  display: flex;
  margin-right: 20px;
  .index {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    color: #fff;
    background-color: #1274ee ;
    margin:10px 5px;
  }
  .priority-select {
    width: 90px;
      /deep/.el-input__inner {
          font-size: 14px;
          height: 20px;
        }
        /deep/ .el-input__icon {
          line-height: 20px;
        }
  }
}
</style>