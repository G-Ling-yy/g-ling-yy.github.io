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
        <ma-select-option
          v-for="opt of corpOptions"
          :key="`opt-${opt.key}`"
          :value="opt.key"
          >{{ opt.value }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 统计类型 -->
    <ma-form-item>
      <ma-select
        v-model:value="statisticsType"
        placeholder="统计类型"
        style="min-width: 110px"
      >
        <ma-select-option
          v-for="opt of statisticsTypeOptions"
          :key="`opt-${opt.key}`"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 报警时间 -->
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
      corpLoading: true,
      allCorpOptions: [], // 报警厂商总选项数据
      statisticsType: 'jianchuRate', // 统计类型
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
    }
  },
  created() {
    process.env.NODE_ENV === 'development' && (window.staticTableForm_vue = this)

    /* 获取报警厂商 并 默认值 */
    this.getCorpOptions()
    this.formData.corp = 'all'

    /* 统计类型数据初始化 */
    this.statisticsTypeOptions = [
      {
        key: '检出率',
        value: 'jianchuRate'
      },
      {
        key: '正确率',
        value: 'zhengqueRate'
      },
      {
        key: '主动发现率',
        value: 'zhudongfaxianRate'
      },
      {
        key: '业务转换率',
        value: 'yewuzhanbiRate'
      },
      {
        key: '报错率',
        value: 'baocuoRate'
      },
      {
        key: '相机检出距离',
        value: 'xiangjijianchuDistance'
      },
      {
        key: '标定次数',
        value: 'biaodingCount'
      }
    ]

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
