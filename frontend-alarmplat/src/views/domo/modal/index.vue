<template>
  <div>
    <ma-button @click="success" type="primary">成功弹窗</ma-button>
    <ma-button @click="error" type="danger">错误弹窗</ma-button>
    <ma-button @click="warning">警告弹窗</ma-button>

    <ma-modal
      v-model="visible"
      title="这是一个标题"
      ok-text="确认"
      cancel-text="取消"
      @ok="hideModal"
    >
      <p>自定义弹窗 ...</p>
      <p>自定义弹窗 ...</p>
      <p>自定义弹窗 ...</p>
    </ma-modal>
    <br />
    <br />
    <ma-button @click="confirm">自定义弹窗按钮</ma-button>
  </div>
</template>
<script>
  // import { Modal } from 'ant-design-vue'
  export default {
    data() {
      return { visible: false }
    },
    mounted() {},
    methods: {
      showModal() {
        this.visible = true
      },
      hideModal() {
        this.visible = false
      },
      confirm() {
        this.$confirm({
          title: '自定义弹窗标题',
          content: '自定义弹窗内容',
          okText: '确认',
          cancelText: '取消'
        })
      },
      success() {
        this.$success({
          title: '这是一个成功弹窗',
          // JSX support
          content: (
            <div>
              <p>成功！！！！</p>
              <p>成功！！！！</p>
            </div>
          )
        })
      },

      error() {
        this.$error({
          title: '这是一个错误弹窗',
          content: '错误：XXXXXXXX'
        })
      },

      warning() {
        this.$warning({
          title: '这是一个警告弹窗',
          content: '警告：11111'
        })
      }
    }
  }
</script>
