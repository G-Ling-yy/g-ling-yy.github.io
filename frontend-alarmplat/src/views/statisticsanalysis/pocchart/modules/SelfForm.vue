<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 报警厂商 -->
    <ma-form-item>
      <ma-select
        v-model:value="formData.corp"
        placeholder="报警厂商"
        :loading="corpLoading"
        style="width: 120px"
      >
        <ma-select-option
          v-for="opt of corpOptions"
          :key="opt.key"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 统计类型 -->
    <ma-form-item>
      <ma-select
        v-model:value="statisticsType"
        placeholder="统计类型"
        style="min-width: 130px"
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
// const yesterday = dayjs().subtract(1, 'day')
const JuneEnd = dayjs('2022-6-30')

export default {
  name: 'SelfForm',
  data() {
    return {
      corpLoading: false,
      statisticsType: 'jianchuRate' // 统计类型
      // dateDefaultValue: yesterday // 报警时间默认值
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
      const corpOptions =
        this.$store.state.dataDictionary['online_corp'] ||
        []

      return [
        {
          key: '平台',
          value: 'all'
        }
      ].concat(
        corpOptions.filter(
          e => e.value !== 'vid_microvideo'
        )
      )
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
      (window.pocChartForm_vue = this)

    /* 各字典数据 没值取去 */
    // 在线厂商
    if (
      !this.$store.state.dataDictionary['online_corp']
        ?.length
    ) {
      this.getDicByKey('online_corp', 'corpLoading')
    }

    this.formData.corp = 'all'

    /* 统计类型数据初始化 */
    this.statisticsTypeOptions = [
      {
        key: '累计检出率',
        value: 'jianchuRate'
      },
      // {
      //   key: '累计正确率',
      //   value: 'zhengqueRate'
      // },

      {
        key: '累计主动发现率',
        value: 'zhudongfaxianRate'
      },

      // {
      //   key: '累计业务转换率',
      //   value: 'yewuzhanbiRate'
      // },
      // {
      //   key: '累计报错率',
      //   value: 'baocuoRate'
      // },

      // {
      //   key: '相机检出距离',
      //   value: 'xiangjijianchuDistance'
      // },

      // {
      //   key: '累计误警率',
      //   value: 'wujingRate'
      // },

      {
        key: '标定次数',
        value: 'biaodingCount'
      }
    ]

    /* 报警日期默认值 */
    this.formData.date = JuneEnd.format('YYYY-MM-DD')
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
