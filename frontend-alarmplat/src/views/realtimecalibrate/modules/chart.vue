<template>
  <p></p>
</template>

<script>
var dayjs = require('dayjs')
const today = dayjs()

export default {
  name: 'Chart',

  data() {
    return {
      dateDefaultValue: today, // 事件时间默认值
      evtSelectLoading: true, // 事件多选框loading
      evtOptions: [] // 事件多选框选项
    }
  },

  computed: {},

  methods: {
    // 获取事件类型选项值
    getEventValue() {
      this.evtSelectLoading = true
      ;(() =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve([
              { key: 'vehi_accident', value: '事故' },
              { key: 'vehi_rescue', value: '救援' },
              { key: 'construction_area', value: '施工区域' },
              { key: 'vehi_stop', value: '停驶' },
              { key: 'into_forbidden_area', value: '禁行闯入' },
              { key: 'abandon', value: '抛洒物' },
              { key: 'vehi_converse', value: '逆行' },
              { key: 'vehi_reverse', value: '倒车' },
              { key: 'vehi_slow_pass', value: '单车慢速经过' },
              { key: 'vehi_day_congestion', value: '车辆拥堵' }
            ])
          }, 300)
        }))()
        .then(res => {
          this.evtOptions = res
        })
        .finally(() => {
          this.evtSelectLoading = false
        })
    }
  },

  created() {
    process.env.NODE_ENV === 'development' && (window.chart_vue = this)
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
