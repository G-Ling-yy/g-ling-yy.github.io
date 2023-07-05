<template>
  <ma-form class="self-form" layout="inline" :model="formData">
    <ma-form-item>
      <ma-select
        v-model:value="formData.corp"
        allowClear
        placeholder="报警厂商"
        :loading="corpLoading"
        style="width: 100px"
      >
        <ma-select-option
          v-for="opt of corpOptions"
          :key="`opt-${opt.key}`"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <ma-form-item>
      <ma-date-picker
        :allowClear="false"
        :defaultValue="dateDefaultValue"
        inputReadOnly
        placeholder="报警时间"
        valueFormat="YYYY-MM-DD"
        @change="date => (formData.date = date)"
      />
    </ma-form-item>

    <ma-form-item>
      <ma-button type="primary" html-type="submit" @click="$emit('handle-search')">
        搜索
      </ma-button>
    </ma-form-item>
  </ma-form>
</template>

<script>
import selfStore from './self-store'
import apis from '@/api'

var dayjs = require('dayjs')
// const today = dayjs()
const yesterday = dayjs().subtract(1, 'day')

export default {
  name: 'SelfForm',
  data() {
    return {
      corpLoading: true,
      corpOptions: [], // 报警厂商选项
      dateDefaultValue: yesterday // 报警时间默认值
    }
  },

  computed: {
    formData: {
      get: () => selfStore.formData,
      set: v => {
        selfStore.formData = v
      }
    }
  },

  methods: {
    // 获取报警厂商
    getCorpOptions() {
      this.corpLoading = true
      apis.events
        .fakeRequest()
        .then(res => {
          this.corpOptions = [
            {
              key: '平台',
              value: 'all'
            },
            {
              key: '预策科技',
              value: 'vid_yckj_test'
            }
          ]
        })
        .finally(() => {
          this.corpLoading = false
        })
    }
  },
  created() {
    process.env.NODE_ENV === 'development' && (window.staticTableForm_vue = this)

    /* 获取报警厂商 并 默认值 */
    this.getCorpOptions()

    /* 报警日期默认值 */
    this.formData.date = yesterday.format('YYYY-MM-DD')
  }
}
</script>
<style lang="less" scoped>
.self-form {
  margin: 0 auto 20px;
  button {
    margin-right: 20px;
  }
}
</style>
