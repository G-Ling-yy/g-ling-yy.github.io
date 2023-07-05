<template>
  <ma-modal
    v-if="visible"
    :title="modalType"
    visible="visible"
    ok-text="提交"
    cancel-text="取消"
    @ok="submitModal"
    @cancel="cancelModal"
    width="800px"
  >
    <ma-form
      ref="form"
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
      :rules="rules"
    >
      <ma-form-item v-if="modalType === '编辑'" label="ID">
        <ma-input v-model:value="formData.id" disabled />
      </ma-form-item>

      <ma-form-item label="任务编码" name="code">
        <ma-input v-model:value="formData.code" />
      </ma-form-item>

      <ma-form-item label="名称" name="name">
        <ma-input v-model:value="formData.name" />
      </ma-form-item>

      <ma-form-item v-if="modalType === '编辑'" label="任务环节编码">
        <ma-input v-model:value="formData.nodeCode" disabled />
      </ma-form-item>

      <ma-form-item label="环节操作人">
        <ma-input v-model:value="formData.nodeOptUser" />
      </ma-form-item>
      <!-- {{ formData.day }} -->
      <ma-form-item
        v-if="modalType === '编辑' && formData.day"
        label="更新时间"
      >
        <ma-date-picker
          style="margin-right: 10px"
          :default-value="$dayjs(formData.dataUpdateTime, 'YYYY-MM-DD')"
          disabled
        />
        <ma-time-picker
          :default-value="$dayjs(formData.dataUpdateTime, 'HH:mm:ss')"
          disabled
        />
      </ma-form-item>

      <ma-form-item v-if="modalType === '编辑'" label="任务下一环节编码">
        <ma-input v-model:value="formData.nextNodeCode" disabled />
      </ma-form-item>
    </ma-form>
  </ma-modal>
</template>

<script>
export default {
  name: 'TestModal',
  setup() {
    const rules = {
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
    }
    return {
      rules
    }
  },

  data() {
    return {
      formData: {}
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: '新增'
    },
    modalData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  methods: {
    submitModal() {
      this.$refs.form
        .validate()
        .then(res => {
          this.$emit('submitModal', this.formData)
        })
        .catch(error => {
          console.log('校验错误', error)
        })
    },
    cancelModal() {
      this.$emit('cancelModal')
    },
    initData() {
      if (this.modalType === '新增') {
        this.formData = {}
      } else {
        this.formData = JSON.parse(JSON.stringify(this.modalData))
        if (this.formData.dataUpdateTime) {
          this.formData = {
            ...this.formData,
            day: this.$dayjs(this.formData.dataUpdateTime).format('YYYY-MM-DD')
          }
        }
      }
    }
  },
  created() {
    this.initData()
  }
}
</script>
