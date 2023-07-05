<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 日期范围 -->
    <ma-form-item>
      <ma-date-picker
        :allowClear="false"
        :defaultValue="dateDefaultValue"
        inputReadOnly
        picker="month"
        style="width: 120px"
        @change="
          (date, dateString) => {
            formData.checkMonth = dateString
            $emit('handle-search')
          }
        "
      />
    </ma-form-item>

    <ma-form-item>
      <ma-button
        type="primary"
        html-type="submit"
        @click="$emit('handle-search')"
      >
        搜索
      </ma-button>
    </ma-form-item>
  </ma-form>
</template>

<script>
import selfStore from './self-store'

var dayjs = require('dayjs')
const today = dayjs()

export default {
  name: 'SelfForm',
  data() {
    return {
      corpLoading: false, // 报警厂商loading
      dateDefaultValue: today, // 事件时间默认值
      evtSelectLoading: false // 事件多选框loading
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
    // 获取字典
    getDicByKey(key, loading) {
      this[loading] = true
      this.$store
        .dispatch('dataDictionary/getDicByKey', key)
        .finally(() => {
          this[loading] = false
        })
    }
  },
  created() {
    process.env.NODE_ENV === 'development' &&
      (window.alertoriginform_vue = this)

    /* 事件日期默认值 */
    this.formData.checkMonth = today.format('YYYY-MM')
  }
}
</script>
<style lang="less" scoped>
.self-form {
  .ant-form-item {
    margin: 0 1rem 1rem 0;
  }
}
</style>
