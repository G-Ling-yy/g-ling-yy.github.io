<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 数据类型 -->
    <ma-form-item>
      <ma-select
        allowClear
        placeholder="类型"
        style="width: 80px"
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

    <!-- 事件类型 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.eventType"
        :loading="evtSelectLoading"
        placeholder="事件类型"
      >
        <ma-select-option
          v-for="opt of evtOptions"
          :key="opt.key"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 报警厂商 -->
    <ma-form-item>
      <ma-select
        allowClear
        placeholder="报警厂商"
        style="width: 100px"
        v-model:value="formData.corp"
        :loading="corpLoading"
      >
        <ma-select-option
          v-for="opt of corpOptions"
          :key="opt.key"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 运行状态 -->
    <ma-form-item>
      <ma-select
        allowClear
        placeholder="运行状态"
        style="width: 100px"
        v-model:value="formData.runningStatus"
      >
        <ma-select-option :value="0"
          >已结束</ma-select-option
        >
        <ma-select-option :value="1"
          >进行中</ma-select-option
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

    <!-- 路段编号 -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="路段编号"
        v-model:value="formData.roadCode"
        style="width: 110px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 千米桩 -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="千米桩"
        v-model:value="formData.mileageNo"
        style="width: 90px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 事件时间 -->
    <ma-form-item>
      <ma-date-picker
        :allowClear="false"
        :defaultValue="dateDefaultValue"
        inputReadOnly
        placeholder="事件时间"
        style="width: 120px"
        valueFormat="YYYY-MM-DD"
        @change="date => (formData.begTime = date)"
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
    },

    // 路公司选项
    OrgOptions() {
      return (
        this.$store.getters['user/userSpecificInfo']
          ?.orgId || []
      )
    },

    // 报警厂商选项
    corpOptions() {
      return (
        this.$store.state.dataDictionary['online_corp'] ||
        []
      )
    },

    // 事件多选框选项
    evtOptions() {
      return (
        this.$store.state.dataDictionary['enable_event'] ||
        []
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
      (window.alertoriginform_vue = this)

    /* 路公司默认值 */
    this.formData.orgId =
      this.$store.getters[
        'user/userSpecificInfo'
      ].orgId[0].value

    /* 各字典数据 没值取去 */
    // 在线厂商
    if (
      !this.$store.state.dataDictionary['online_corp']
        ?.length
    ) {
      this.getDicByKey('online_corp', 'corpLoading')
    }

    // 启用事件
    if (
      !this.$store.state.dataDictionary['enable_event']
        ?.length
    ) {
      this.getDicByKey('enable_event', 'evtSelectLoading')
    }

    /* 测试范围默认POC */
    // this.formData.isPoc = 1 // 改为默认不传

    /* 数据类型默认值 */
    this.formData.exsitBsData = 1

    /* 事件日期默认值 */
    this.formData.begTime = today.format('YYYY-MM-DD')
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
