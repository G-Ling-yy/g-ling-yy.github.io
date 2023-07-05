<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 数据类型 -->
    <ma-form-item>
      <ma-select
        placeholder="数据类型"
        style="width: 100px"
        v-model:value="formData.exsitBsData"
      >
        <ma-select-option :value="1">业务</ma-select-option>
        <ma-select-option :value="0">算法</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 路公司 -->
    <ma-form-item v-if="OrgOptions.length > 1">
      <ma-select
        v-model:value="formData.orgId"
        style="width: 100px"
      >
        <ma-select-option
          v-for="opt of OrgOptions"
          :key="`opt-${opt.key}`"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 测试范围 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.isPoc"
        placeholder="测试范围"
      >
        <ma-select-option :value="1">POC</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 起止时间 -->
    <ma-form-item>
      <ma-range-picker
        :defaultValue="rangeDefaultValue"
        :allowClear="false"
        inputReadOnly
        :placeholder="['起日期', '止日期']"
        valueFormat="YYYY-MM-DD"
        @change="rangeChange"
      />
    </ma-form-item>

    <!-- btns -->
    <ma-form-item>
      <ma-button
        type="primary"
        html-type="submit"
        @click="$emit('handle-search')"
      >
        搜索
      </ma-button>
      <ma-button @click="exportFile">导出</ma-button>
    </ma-form-item>
  </ma-form>
</template>

<script>
import selfStore from './self-store'
import apis from '@/api'
var dayjs = require('dayjs')

// 默认起止日期（昨天） 和 对应时间
let yesterday = dayjs()
  .subtract(1, 'day')
  .format('YYYY-MM-DD')

const rangeStart = dayjs('2023-1-5').format('YYYY-MM-DD'),
  rangeEnd = dayjs('2023-2-4').format('YYYY-MM-DD')

export default {
  name: 'SelfForm',
  data() {
    return {
      rangeDefaultValue: [rangeStart, rangeEnd] // 范围日期默认值
    }
  },

  computed: {
    formData: {
      get: () => selfStore.formData,
      set: v => {
        selfStore.formData = v
      }
    },

    // 路公司选项
    OrgOptions() {
      return (
        this.$store.getters['user/userSpecificInfo']
          ?.orgId || []
      )
    }

    // 范围日期默认值
    // rangeDefaultValue: () => [JuneStart, JuneEnd]
  },

  methods: {
    // 报警日期选择
    rangeChange(dateAry) {
      this.formData.startDate = dateAry?.[0]
      this.formData.endDate = dateAry?.[1]
    },

    // 导出
    exportFile() {
      apis.events
        .exportStoriesFile({
          endDate: this.formData.endDate,
          exsitBsData: this.formData.exsitBsData,
          isPoc: this.formData.isPoc,
          startDate: this.formData.startDate
        })
        .then(res => {
          window.open(res, '_blank')
        })
    }
  },
  created() {
    process.env.NODE_ENV === 'development' &&
      (window.dataexportform_vue = this)

    /* 是否包含业务数据默认值 */
    this.formData.exsitBsData = 1

    /* 路公司默认值 */
    this.formData.orgId =
      this.$store.getters[
        'user/userSpecificInfo'
      ].orgId[0].value

    /* 测试范围默认POC */
    this.formData.isPoc = 1

    // 日期范围默认值
    this.rangeChange(this.rangeDefaultValue)

    yesterday = dayjs()
      .subtract(1, 'day')
      .format('YYYY-MM-DD')
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
