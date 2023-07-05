<template>
  <ma-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
  >
    <ma-form-item has-feedback label="密码" name="pass">
      <ma-input
        v-model:value="formState.pass"
        type="password"
        autocomplete="off"
      />
    </ma-form-item>
    <ma-form-item has-feedback label="确认密码" name="checkPass">
      <ma-input
        v-model:value="formState.checkPass"
        type="password"
        autocomplete="off"
      />
    </ma-form-item>
    <ma-form-item has-feedback label="年龄" name="age">
      <ma-input-number v-model:value="formState.age" />
    </ma-form-item>
    <ma-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <ma-button type="primary" html-type="submit">提交</ma-button>
      <ma-button style="margin-left: 10px" @click="resetForm">重设</ma-button>
    </ma-form-item>
  </ma-form>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue'
  export default defineComponent({
    setup() {
      const formRef = ref()
      const formState = reactive({
        pass: '',
        checkPass: '',
        age: undefined
      })

      const checkAge = async (_rule, value) => {
        if (!value) {
          return Promise.reject('请输入年龄')
        }

        if (!Number.isInteger(value)) {
          return Promise.reject('请输入数字')
        } else {
          if (value < 18) {
            return Promise.reject('年龄必须大于18')
          } else {
            return Promise.resolve()
          }
        }
      }

      const validatePass = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('请输入密码')
        } else {
          if (formState.checkPass !== '') {
            formRef.value.validateFields('checkPass')
          }

          return Promise.resolve()
        }
      }

      const validatePass2 = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('请再次输入密码')
        } else if (value !== formState.pass) {
          return Promise.reject('两次密码不匹配!')
        } else {
          return Promise.resolve()
        }
      }

      const rules = {
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: 'change'
          }
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: 'change'
          }
        ],
        age: [
          {
            validator: checkAge,
            trigger: 'change'
          }
        ]
      }
      const layout = {
        labelCol: {
          span: 4
        },
        wrapperCol: {
          span: 14
        }
      }

      const handleFinish = () => {}

      const handleFinishFailed = () => {}

      const resetForm = () => {
        formRef.value.resetFields()
      }

      const handleValidate = () => {}

      return {
        formState,
        formRef,
        rules,
        layout,
        handleFinishFailed,
        handleFinish,
        resetForm,
        handleValidate
      }
    }
  })
</script>
