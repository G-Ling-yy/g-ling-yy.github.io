<template>
  <ma-form class="self-form" layout="inline" :model="formData">
    <ma-form-item>
      <ma-select
        allowClear
        placeholder="报警厂商"
        v-model:value="formData.corp"
        :loading="corpLoading"
      >
        <ma-select-option
          v-for="opt of corpOptions"
          :key="`opt-${opt.key}`"
          :value="opt.key"
          >{{ opt.value }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <ma-form-item>
      <ma-input allowClear placeholder="路段编号" v-model:value="formData.roadCode">
      </ma-input>
    </ma-form-item>

    <ma-form-item>
      <ma-input allowClear placeholder="千米桩" v-model:value="formData.mileKm">
      </ma-input>
    </ma-form-item>

    <ma-form-item>
      <ma-date-picker
        :allowClear="false"
        :defaultValue="dateDefaultValue"
        inputReadOnly
        placeholder="报警时间"
        valueFormat="YYYY-MM-DD"
        @change="date => (formData.alarmDate = date)"
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
const today = dayjs()

export default {
  name: 'SelfForm',
  data() {
    return {
      corpLoading: true,
      corpOptions: [], // 报警厂商选项
      dateDefaultValue: today // 报警时间默认值
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
      apis.events.getConstantByType({ type: 3 }).then(res => {
        this.corpOptions = res
        this.corpLoading = false
      })
    }
  },
  created() {
    process.env.NODE_ENV === 'development' && (window.alertoriginform_vue = this)

    /* 获取报警厂商 */
    this.getCorpOptions()

    /* 报警日期默认值 */
    this.formData.alarmDate = today.format('YYYY-MM-DD')
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
