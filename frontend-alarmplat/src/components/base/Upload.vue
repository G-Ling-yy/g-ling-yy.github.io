<template>
  <div class="clearfix" :class="fileList.length >= limit ? 'nodo' : ''">
    <p v-if="accept" class="notice-text green" style="text-align: center">
      仅支持{{ accept }}格式的文件上传
    </p>
    <ma-upload-dragger
      v-if="listType === `text`"
      :file-list="fileList"
      :action="action"
      :accept="accept"
      @change="handleChange"
      :beforeUpload="beforeUpload"
      :list-type="`text`"
    >
      <p class="ant-upload-drag-icon">
        <ma-icon type="inbox" />
      </p>
      <p
        v-if="fileList.length && fileList.length < limit && !disabled"
        class="ant-upload-text"
      >
        点击或者拖拽至此区域进行下载
      </p>
      <ma-button
        style="margin-top: 20px"
        value="large"
        type="primary"
        :disabled="(fileList.length && fileList.length >= limit) || disabled"
      >
        <template #icon>
          <icon icon="upload-line" style="font-size: 11px" />
        </template>
        {{ text }}
      </ma-button>
      <p v-if="fileList.length >= limit" class="notice-text red">
        * 已超过文件数量限制
      </p>
    </ma-upload-dragger>
    <!-- :disabled="(fileList.length && fileList.length >= limit) || disabled" -->

    <ma-upload-dragger
      v-else
      :file-list="fileList"
      :list-type="listType"
      :name="name"
      :multiple="isMultiple"
      :showUploadList="isMultiple"
      :action="action"
      :accept="accept"
      @change="handleChange"
      @preview="handlePreview"
      :beforeUpload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <ma-icon type="inbox" />
      </p>
      <p
        v-if="fileList.length && fileList.length < limit && !disabled"
        class="ant-upload-text"
      >
        点击或者拖拽至此区域进行下载
      </p>
      <!--单图效果 -->
      <img
        v-if="!isMultiple"
        :src="getAvatarView()"
        style="height: 104px; max-width: 300px"
      />
      <!-- 多图效果 -->

      <ma-button
        value="large"
        type="primary"
        :disabled="(fileList.length && fileList.length >= limit) || disabled"
      >
        <template #icon>
          <icon icon="upload-line" style="font-size: 11px" />
        </template>
        {{ text }}
      </ma-button>
      <p v-if="fileList.length >= limit" class="notice-text red">
        * 已超过文件数量限制
      </p>
    </ma-upload-dragger>
    <ma-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewHandleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
      <ma-button type="primary" class="downbtn" @click="down(previewImage)">
        下载
      </ma-button>
    </ma-modal>
    <ma-button type="primary" class="surebtn" @click="returnView">
      确认
    </ma-button>
  </div>
</template>
<script>
export default {
  name: 'Upload',
  components: {},
  props: {
    // 是否仅支持图片
    onlyPic: {
      type: Boolean,
      required: false,
      default: false
    },
    // 发到后台的参数名，可自定义拼接
    name: {
      type: String,
      required: false,
      default: 'name'
    },
    // 支持文件类型
    accept: {
      type: String,
      required: false,
      default: ''
    },
    // 上传路径
    action: {
      type: String,
      required: true,
      default: ''
    },
    // 文件列表类型 ：text, picture 和 picture-card
    listType: {
      type: String,
      required: false,
      default: 'text'
    },
    // 父组件传进来的已有的图片数据
    list: {
      type: Array,
      required: false
    },
    // 是否多图
    isMultiple: {
      type: Boolean,
      required: false,
      default: true
    },
    // 多图情况下限制图片张数
    limit: {
      type: Number,
      required: false,
      default: 10
    },
    text: {
      type: String,
      default: '上传'
    }
  },
  data() {
    return {
      // 本地数据
      fileList: [],
      // 成功数据
      successList: [],
      previewVisible: false
    }
  },
  watch: {
    list: {
      handler(val) {
        // 深拷贝到本地
        this.initFileList(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    returnView() {
      this.$emit('returnView', this.fileList)
    },
    // 深拷贝方法
    shencopy(obj) {
      if (typeof obj !== 'object') {
        return obj
      }
      var res = Array.isArray(obj) ? [] : {}
      for (const i in obj) {
        // 递归处理
        res[i] = this.shencopy(obj[i])
      }
      return res
    },
    // 若后端未生成唯一uid,可生成唯一UID
    uidGenerator() {
      // antv官网建议生成一个负数uid，防止和内部产生的 id 冲突
      return '-' + parseInt(Math.random() * 10000 + 1, 10)
    },
    // 显示已有图片
    initFileList(paths) {
      // 如果未传入已存在文件列表，则数组为空
      if (!paths || paths.length == 0) {
        this.fileList = []
        return
      }
      const fileList = []
      // 深拷贝
      const arr = this.shencopy(paths)
      for (var a = 0; a < arr.length; a++) {
        const url = arr[a].url
        const uid = arr[a].uid || this.uidGenerator() // 如果不存在uid，可以自己生成
        const name = arr[a].name || arr[a].url // 如果不存在name,可以根据url生成
        fileList.push({
          uid,
          name,
          status: 'done', // 状态有：uploading done error removed(删除时会标记为removed)
          url
        })
      }
      this.fileList = fileList
      console.log(this.fileList, ' this.fileList')
    },
    handleChange(info) {
      console.log('调用了，handleChange', info)
      let fileList = info.fileList
      if (info.file.status === 'done') {
        if (info.file.response) {
          fileList = fileList.map(file => {
            return file
          })
          this.$message.success(`上传成功!`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`上传失败.`)
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      console.log(this.fileList, ' this.fileList')
      if (info.file.status === 'done' || info.file.status === 'removed') {
        // 数据变动处理
        this.handlePathChange()
      }
    },
    // 回传父组件
    handlePathChange() {
      const uploadFiles = this.fileList
      const arr = []
      // 在此处理服务器数据，可更改
      if (!this.isMultiple) {
        arr.push({
          name: uploadFiles[uploadFiles.length - 1].response.data.fileName,
          url: uploadFiles[uploadFiles.length - 1].response.data.url
        })
      } else {
        for (var a = 0; a < uploadFiles.length; a++) {
          arr.push({
            name: uploadFiles[a].name || uploadFiles[a].response.data.fileName,
            url:
              uploadFiles[a].url ||
              `https://bds.jchc.cn/bds-manage-test/file/stream/svca/` +
                uploadFiles[a].response.data.fileName
          })
        }
      }
      this.$emit('onChange', arr)
    },
    // 删除
    handleDelete(file) {
      this.$emit('onDelete', file)
    },
    /**
     * 上传文件前触发
     * @param file
     * @return {boolean}
     */
    beforeUpload(file) {
      console.log('')
      this.$emit('before', file)
    },
    // 关闭弹框
    previewHandleCancel() {
      this.previewVisible = false
    },
    // 预览
    handlePreview(file) {
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 单图上传显示最新的一张
    getAvatarView() {
      if (this.fileList.length > 0) {
        const url = this.fileList[this.fileList.length - 1].url
        return url
      }
    },
    down(previewImage) {
      window.open(previewImage)
    }
  }
}
</script>

<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }
.ant-modal-body {
  padding: 48px 34px 34px 40px;
}
.downbtn {
  display: block;
  margin: 20px auto 0 auto;
}
.surebtn {
  float: right;
  margin-top: 40px;
}
.notice-text {
  padding: 8px 20px;

  &.green {
    // color: #67c23a;
    font-size: 16px;
  }
  &.red {
    // background-color: rgb(254, 240, 240);
    color: #f56c6c;
    font-weight: 500;
    margin-top: 10px;
    // border-radius: 8px;
  }
}
:deep .ant-upload-list {
  background: rgb(236, 245, 255);
  padding: 20px;
  margin-top: 30px;

  &::before {
    content: '文件列表';
    font-weight: 600;
    margin-bottom: 24px;
    font-size: 16px;
  }
  &.ant-upload-list-text > div {
    border-bottom: 1px dotted #cecece;
    padding-bottom: 12px;
    &:last-child {
      border-bottom: 0;
    }
  }
  &.ant-upload-list-picture-card {
    &:after {
      clear: both;
      content: '.';
      text-indent: -999999px;
      display: block;
    }
  }
  &.ant-upload-list-picture > div {
    border: 1px dotted #cecece;
    border-radius: 6px;
    margin-bottom: 10px;
    background: rgb(242, 246, 252);
    padding: 0 40px 0 12px;
    &:hover .ant-upload-list-item-card-actions i {
      color: #f00;
    }
    div {
      border: 0 !important;
    }
  }
}
:deep .ant-upload.ant-upload-drag {
  padding: 80px 0;
}
.nodo :deep .ant-upload.ant-upload-drag {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
