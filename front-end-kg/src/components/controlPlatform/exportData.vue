<template>
  <div class="copy-data">
    <div class="copy-data-con" v-if="isViewMode">
      <a @click="exportData(config)">导出对接参数</a>
    </div>
  </div>
</template>
<script>
import store from '../../store';
import axios from 'axios';
export default {
  props: ['config', 'isViewMode', 'value', 'parent'],
  data: function () {
    let Authorization = store.state.userInfo
      ? store.state.userInfo.Authorization : '';
    return {
      uploadHeaders: {
        Authorization: Authorization
      }
    }
  },
  created () {
    console.error(this.config, this.value, this.parent);
  },
  methods: {
    /* exportData () {
      this.$message({
        message: "复制成功!",
        type: "success",
        duration: 1000
      });
    }, */
    exportData (config) {
      /* var instructionsAdd = {
        module: "接入中心",
        page: "上云网关管理",
        feature: "导出对接参数数据",
        description: "上云网关管理的导出对接参数数据",
          "http://139.9.157.61:9527/v1/device/platforms/download/" +
      }; */
      let transcodingId = config.transcodingId;
      axios
        .get(
         `${this.BASECONFIG.API_BASE_URL}/device/platforms/download/` +
          transcodingId + "/accessorInfo",
          {
            headers: {
              'Content-Type': 'application/json',
              ...this.uploadHeaders
            },
            responseType: 'blob'
          }
        )
        .then((res) => {
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(res.data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.parent.model.platformName + ".xlsx"; // 下载后文件名

          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          // document.body.removeChild(downloadElement); // 下载完成移除元素
          // window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          this.$message.error(error);
        });

    },
  }
}
</script>
<style lang="less">
.copy-data-con {
  width: calc(100% - 52px);
  display: flex;
  .copy-data-text {
    width: calc(100% - 36px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  a {
    color: #1274ee;
  }
}
</style>