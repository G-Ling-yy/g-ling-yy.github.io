<template>
  <ma-modal
    centered
    :footer="null"
    :maskClosable="false"
    title="新增字典"
    visible="visible"
    ok-text="确定"
    cancel-text="取消"
    @cancel="emits('update:visible', false)"
    width="fit-content"
  >
    <ma-form
      v-bind="{
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      }"
      :model="formData"
      ref="formRef"
      :rules="rules"
    >
      <!-- 类型 -->
      <ma-form-item label="类型" name="type">
        <ma-input
          v-model:value="formData.type"
          allowClear
          placeholder="类型"
        />
      </ma-form-item>

      <!-- 类型描述 -->
      <ma-form-item label="类型描述" name="typeDesc">
        <ma-input
          v-model:value="formData.typeDesc"
          allowClear
          placeholder="类型描述"
        />
      </ma-form-item>

      <!-- key -->
      <ma-form-item label="key" name="key">
        <ma-input
          v-model:value="formData.key"
          allowClear
          placeholder="key"
        />
      </ma-form-item>

      <!-- value -->
      <ma-form-item label="value" name="value">
        <ma-input
          v-model:value="formData.value"
          allowClear
          placeholder="value"
        />
      </ma-form-item>

      <!-- 排序 -->
      <ma-form-item label="排序">
        <ma-input-number
          v-model:value="formData.order"
          :controls="false"
          :max="99999"
          :min="0"
          :precision="0"
        />
      </ma-form-item>

      <!-- 是否启用 -->
      <ma-form-item label="是否启用">
        <ma-switch
          v-model:checked="formData.enable"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </ma-form-item>

      <ma-form-item
        v-bind="{ wrapperCol: { span: 16, offset: 8 } }"
      >
        <ma-button
          :loading="submitLoading"
          type="primary"
          @click="submitHandler"
        >
          确定
        </ma-button>
      </ma-form-item>
    </ma-form>
  </ma-modal>
</template>

<script setup>
import apis from '@/api'
import { message } from 'ant-design-vue'

const {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount
} = require('vue')

const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible', 'add-success'])

/* 表单 */
const formData = reactive({
    type: '', // 类型
    typeDesc: '', // 类型描述
    key: '', // key
    value: '', // value
    order: 0, // 排序
    enable: 1 // 是否启用
  }),
  formRef = ref(),
  // 校验规则
  rules = reactive({
    type: [
      {
        required: true,
        message: '请填入类型',
        trigger: 'blur'
      }
    ],
    typeDesc: [
      {
        required: true,
        message: '请填入类型描述',
        trigger: 'blur'
      }
    ],
    key: [
      {
        required: true,
        message: '请填入key值',
        trigger: 'blur'
      }
    ],
    value: [
      {
        required: true,
        message: '请填入value值',
        trigger: 'blur'
      }
    ]
  }),
  // 提交loading
  submitLoading = ref(false),
  // 提交处理
  submitHandler = () => {
    formRef.value
      .validateFields()
      .then(() => {
        submitLoading.value = true
        apis.dataDictionary
          .setInnerData(formData)
          .then(() => {
            message.success('新增成功')

            emits('update:visible', false)
            emits('add-success')
          })
          .finally(() => {
            submitLoading.value = false
          })
      })
      .catch(err => {
        console.log('validateFields() err: ', err)
      })
  }
</script>

<style lang="less" scoped></style>
