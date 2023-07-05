<template>
  <div class="clearfix">
    <ma-upload
      v-if="!onlyPic"
      v-model:file-list="fileList"
      :action="action"
      :accept="accept"
      @change="handleChange"
      :beforeUpload="beforeUpload"
      :list-type="`text`"
    >
      <ma-button
        value="large"
        type="primary"
        v-if="
          (isMultiple &&
            fileList.length &&
            fileList.length < limit &&
            !disabled) ||
          !isMultiple
        "
      >
        <template #icon>
          <icon icon="upload-line" style="font-size: 11px" />
        </template>
        {{ text }}
      </ma-button>
    </ma-upload>

    <ma-upload
      v-if="onlyPic"
      v-model:file-list="fileList"
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
      <!--单图效果 -->
      <img
        v-if="!isMultiple"
        :src="getAvatarView()"
        style="height: 104px; max-width: 300px"
      />
      <!-- 多图效果 -->
      <div
        v-else-if="
          (isMultiple &&
            fileList.length &&
            fileList.length < limit &&
            !disabled) ||
          !isMultiple
        "
      >
        <icon icon="upload-line" />
        <div class="ant-upload-text">{{ text }}</div>
      </div>
    </ma-upload>
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
    <p class="notice-text">* 已超过文件数量限制</p>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    components: {},

    setup() {},
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
      },
      handleChange(info) {
        console.log('调用了，handleChange', info)
        let fileList = info.fileList
        if (info.file.status === 'done') {
          if (info.file.response) {
            fileList = fileList.map((file) => {
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
              name:
                uploadFiles[a].name || uploadFiles[a].response.data.fileName,
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
  })
</script>

<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .downbtn {
    display: block;
    margin: 0 auto;
  }
  .notice-text {
    background-color: rgb(254, 240, 240);
    padding: 8px 20px;
    margin-top: 10px;
    border-radius: 8px;
    color: #f56c6c;
    font-weight: 500;
  }
</style>
