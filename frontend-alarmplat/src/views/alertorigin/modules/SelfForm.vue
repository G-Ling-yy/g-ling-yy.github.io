<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 环境 -->
    <!-- 取消按条件筛选 -->
    <ma-form-item v-if="!isCorpUser">
    <!-- <ma-form-item> -->
      <ma-select
        placeholder="环境"
        style="width: 80px"
        v-model:value="formData.corpOnlineStatus"
        @change="formData.corp = undefined"
      >
        <ma-select-option :value="1">线上</ma-select-option>
        <ma-select-option :value="2" v-if="!isCorpUser">测试</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 路公司 -->
    <!-- 取消按条件筛选 -->
    <ma-form-item v-if="OrgOptions.length > 1">
    <!-- <ma-form-item> -->
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

    <!-- 报警厂商:整个部分都不需要展现 -->
    <ma-form-item v-if="!isCorpUser">
      <!-- <ma-form-item> -->
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
        v-model:value="formData.mileKm"
        style="width: 90px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 数据范围 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.isPoc"
        placeholder="数据范围"
      >
        <ma-select-option :value="1">POC</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 标定状态 -->
    <ma-form-item>
      <ma-select
        allowClear
        placeholder="标定状态"
        style="width: 120px"
        v-model:value="formData.dataStatus"
      >
        <ma-select-option :value="0">
          未标定
        </ma-select-option>
        <ma-select-option :value="1">
          已标定正确
        </ma-select-option>
        <ma-select-option :value="2">
          已标定错误
        </ma-select-option>
        <ma-select-option :value="3">
          视频异常
        </ma-select-option>
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
        @change="date => (formData.alarmDate = date)"
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
import { userConfig } from '@/config'

var dayjs = require('dayjs')
const today = dayjs()

export default {
  name: 'SelfForm',

  data() {
    return {
      corpLoading: false, // 报警厂商loading
      dateDefaultValue: today, // 报警时间默认值
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

    // 当前是否厂商用户
    isCorpUser: vm =>
      vm.$store.state.user.userType ==
      userConfig.userType.corp,

    // 路公司选项
    OrgOptions() {
      return (
        this.$store.getters['user/userSpecificInfo']
          ?.orgId || []
      )
    },

    // 报警厂商选项
    corpOptions() {
      const type = `${this.formData.orgId}:online_corp`,
        testAry =
          this.$store.state.dataDictionary['test_corp'] ||
          []

      return this.formData.corpOnlineStatus == 1
        ? this.$store.state.dataDictionary[type]
        : this.formData.corpOnlineStatus == 2
        ? testAry
        : null
    },

    // 事件多选框选项
    evtOptions() {
      return (
        this.$store.state.dataDictionary['enable_event'] ||
        []
      )
    }
  },

  watch: {
    corpOptions(nV) {
      if (!nV) {
        const type = `${this.formData.orgId}:online_corp`
        // 若 无值 且 非厂商用户
        if (
          !this.$store.state.dataDictionary[type]?.length &&
          !this.isCorpUser
        ) {
          this.getDicByKey(type, 'corpLoading')
        }
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

    /* 环境默认值 */
    /* 路公司默认值 */
    this.formData.orgId =
      this.$store.getters[
        'user/userSpecificInfo'
      ].orgId[0].value

    /* 各字典数据 没值取去 */
    // 测试厂商
    // 若 无值 且 非厂商用户
    if (
      !this.$store.state.dataDictionary['test_corp']
        ?.length &&
      !this.isCorpUser
    ) {
      this.getDicByKey('test_corp', 'corpLoading')
    }

    // 启用事件
    if (
      !this.$store.state.dataDictionary['enable_event']
        ?.length
    ) {
      this.getDicByKey('enable_event', 'evtSelectLoading')
    }

    // 若 厂商用户
    if (this.isCorpUser) {
      // this.formData.corpOnlineStatus =
      //   this.$store.state.user.userSpecificInfo.corpOnlineStatus
      //   console.log('this.formData!!!!!!!!!!!!:', this.formData)
      console.log('this.$store.state.user.userSpecificInfo!!!!!!!!!!!!:', this.$store.state.user.userSpecificInfo)
      this.formData.corpOnlineStatus = 1
    } else {
      this.formData.corpOnlineStatus = 1
    }

    /* 厂商默认值 */
    // 若 厂商用户
    if (this.isCorpUser) {
      this.formData.corp =
        this.$store.state.user.userSpecificInfo.corp
    }

    /* 数据类型默认值 */
    // this.formData.isPoc = 1 // 改为默认不传

    /* 报警日期默认值 */
    this.formData.alarmDate = today.format('YYYY-MM-DD')
  }
  // mounted() {
  //   console.log('formData11111111111:', formData)
  // }
}
</script>
<style lang="less" scoped>
.self-form {
  .ant-form-item {
    margin: 0 1rem 1rem 0;
  }
}
</style>
