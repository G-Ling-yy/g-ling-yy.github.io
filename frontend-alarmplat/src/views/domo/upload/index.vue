<template>
  <div class="domo">
    <h2>Text列表效果</h2>
    <ma-button
      type="primary"
      @click="openUpload('text')"
      style="margin-top: 10px"
      >点击上传</ma-button
    >
    <ma-divider />
    <h2>Picture列表效果</h2>
    <ma-button
      type="primary"
      @click="openUpload('picture')"
      style="margin-top: 10px"
      >点击上传</ma-button
    >
    <ma-divider />
    <h2>Picture Card列表效果</h2>
    <ma-button
      type="primary"
      @click="openUpload('picture-card')"
      style="margin-top: 10px"
      >点击上传</ma-button
    >
    <ma-modal
      :visible="showUpload"
      :footer="null"
      @cancel="previewHandleCancel"
      width="1000px"
    >
      <upload
        :action="action"
        :list="serverList"
        :limit="5"
        :list-type="listType"
        :text="`选择文件`"
        :accept="`.png, .jpg, .jpeg,.doc,.docx`"
        @onChange="change"
        @onDelete="onDelete"
        @before="before"
        :onlyPic="false"
        @returnView="returnView"
      />
    </ma-modal>
  </div>
</template>

<script>
import Upload from '@/components/base/Upload.vue'
export default {
  data() {
    return {
      showUpload: false,
      listType: 'text',
      // 上传路径
      action:
        '/bds-manage/file/upload?busType=svca&kind=3&micro-account=13390777550',
      // 后端返回的文件列表，可整理为以下格式已有的文件列表
      serverList: [
        {
          name: 'image.png',
          url: 'https://bds.jchc.cn/bds-manage-test/file/stream/svca/2e7b7f1f72fd4db58d015ee6314ba88f.jpg'
        },
        {
          name: 'image.png',
          url: 'https://bds.jchc.cn/bds-manage-test/file/stream/svca/4a9859469c054465b06caf4d03a244f4.jpeg'
        },
        {
          name: 'image.png',
          url: 'https://bds.jchc.cn/bds-manage-test/file/stream/svca/1fa1748a4698426792b0f227171580bd.png'
        }
      ]
    }
  },
  components: { Upload },
  methods: {
    // 打开弹窗
    openUpload(type) {
      this.listType = type
      this.showUpload = true
    },
    // 关闭弹框
    previewHandleCancel() {
      this.listType = null
      this.showUpload = false
    },
    // 传递给上传组件的change方法
    change(arr) {
      console.log(arr, '父组件拿到的的新数组')
      this.serverList = arr
    },
    onDelete(file) {
      console.log(file, '父组件删除数据')
    },
    // 上传文件前触发限制类型等。
    before(file) {
      const isJpgOrPng =
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('仅支持jpg/jpeg/png/gif/bmp格式文件！')
        this.$nextTick(() => {
          this.fileList.splice(this.fileList.length - 1, 1)
        })
        return false
      }
      if (file.size > 10485760) {
        this.$message.error('最高只能上传10MB图片')
        this.$nextTick(() => {
          this.fileList.splice(this.fileList.length - 1, 1)
        })
        return false
      }
      return true
    }
  }
}
</script>
