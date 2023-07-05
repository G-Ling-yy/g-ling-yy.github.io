<template>
  <ma-form class="self-form" layout="inline" :model="formData">
    <!-- 报警厂商 -->
    <ma-form-item>
      <ma-select
        v-model:value="formData.corp"
        placeholder="报警厂商"
        :loading="corpLoading"
        style="width: 100px"
      >
        <ma-select-option v-for="opt of corpOptions" :key="opt.key" :value="opt.key">{{
          opt.value
        }}</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 事件类型 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="min-width: 120px"
        v-model:value="formData.eventType"
        :loading="evtSelectLoading"
        placeholder="事件类型"
      >
        <ma-select-option v-for="opt of evtOptions" :key="opt.key" :value="opt.key">{{
          opt.value
        }}</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 统计类型 -->
    <ma-form-item>
      <ma-select
        style="min-width: 120px"
        v-model:value="formData.statisticalType"
        placeholder="统计类型"
      >
        <ma-select-option
          v-for="opt of statisticsOptions"
          :key="opt.key"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 报警时间 -->
    <!-- <ma-form-item>
      <ma-date-picker
        :allowClear="false"
        :defaultValue="dateDefaultValue"
        inputReadOnly
        placeholder="报警时间"
        valueFormat="YYYY-MM-DD"
        @change="date => (formData.date = date)"
      />
    </ma-form-item> -->

    <ma-form-item>
      <ma-button
        type="primary"
        html-type="submit"
        @click="$emit('handle-search', { statisticsType })"
      >
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
      allCorpOptions: [], // 报警厂商总选项数据
      corpLoading: false,
      evtOptions: [], // 事件多选框选项
      evtSelectLoading: false, // 事件多选框loading
      dateDefaultValue: yesterday // 报警时间默认值
    }
  },

  computed: {
    formData: {
      get: () => selfStore.formData,
      set: v => {
        selfStore.formData = v
      }
    },

    // 报警厂商选项
    corpOptions() {
      const corpOptions = this.allCorpOptions.filter(
        e => e.corpOnlineStatus == 1 && e.key !== 'vid_microvideo'
      )
      return [
        {
          key: 'all',
          value: '平台'
        }
      ].concat(corpOptions)
    }
  },

  methods: {
    // 获取报警厂商
    getCorpOptions() {
      this.corpLoading = true
      apis.events.getConstantByType({ type: 3 }).then(res => {
        this.allCorpOptions = res
        this.corpLoading = false
      })
    },

    // 获取事件类型选项值
    getEventValue() {
      this.evtSelectLoading = true
      ;(() =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve([
              { key: 'vehi_stop', value: '停驶' },
              { key: 'into_forbidden_area', value: '禁行闯入' },
              { key: 'abandon', value: '抛洒物' },
              { key: 'vehi_reverse', value: '倒车' },
              { key: 'vehi_day_congestion', value: '车辆拥堵' },
              { key: 'vehi_slow_pass', value: '单车慢速经过' },
              { key: 'vehi_converse', value: '逆行' }
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
    process.env.NODE_ENV === 'development' && (window.chart3Form_vue = this)

    /* 获取报警厂商 并 默认值 */
    this.getCorpOptions()
    this.formData.corp = 'all'

    /* 获取事件类型选项值 */
    this.getEventValue()

    /* 报警日期默认值 */
    this.formData.date = yesterday.format('YYYY-MM-DD')

    /* 统计类型选项值 及 默认*/
    this.statisticsOptions = [
      {
        key: '标定情况',
        value: 1
      },
      {
        key: '累计正确率',
        value: 2
      }
    ]
    this.formData.statisticalType = 1
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
