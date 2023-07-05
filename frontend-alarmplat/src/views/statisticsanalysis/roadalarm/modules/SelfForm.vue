<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 事件类型 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.eventType"
        placeholder="事件类型"
      >
        <ma-select-option
          v-for="{ key, value } of evtTypeOtps"
          :key="key"
          :value="value"
        >
          {{ key }}
        </ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 厂商 -->
    <ma-form-item>
      <ma-select
        v-model:value="formData.corp"
        allowClear
        placeholder="厂商"
        :loading="corpLoading"
        style="width: 120px"
      >
        <ma-select-option
          v-for="{ key, value } of corpOpts"
          :key="key"
          :value="value"
        >
          {{ key }}
        </ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 国标ID -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="国标ID"
        v-model:value="formData.gbId"
        style="width: 160px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 起止时间 -->
    <ma-form-item>
      <ma-config-provider :locale="locale">
      <ma-range-picker
        inputReadOnly
        :placeholder="['起日期', '止日期']"
        valueFormat="YYYY-MM-DD"
        v-model:value="rangePickerValue"
        @change="rangeChange"
        :locale="locale"
      />
      </ma-config-provider>
    </ma-form-item>

    <!-- 搜索按钮 -->
    <ma-form-item>
      <ma-button type="primary" @click="$emit('search')">
        搜索
      </ma-button>
    </ma-form-item>

    <!-- 重置按钮 -->
    <ma-form-item>
      <ma-button @click="reset">重置</ma-button>
    </ma-form-item>
  </ma-form>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default {
        data() {
          return {
           locale: zhCN
          }
        }
     }
</script>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import selfStore from './self-store'
import dayjs from 'dayjs'

let yesterday = dayjs()
  .subtract(1, 'day')
  .format('YYYY-MM-DD')

const store = useStore(),
  emits = defineEmits(['search'])

const formData = computed(() => selfStore.formData),
  // 事件类型选项
  evtTypeOtps = [
    {
      key: '停驶',
      value: 'vehi_stop'
    },
    {
      key: '拥堵',
      value: 'vehi_day_congestion'
    },
    {
      key: '禁行闯入',
      value: 'into_forbidden_area'
    }
  ],
  // 厂商选项loading
  corpLoading = ref(false),
  // 厂商选项
  corpOpts = computed(
    () => store.state.dataDictionary['online_corp'] || []
  ),
  // 归属路线loading
  // roadLoading = ref(false),
  // // 归属路线选项
  // roadOpts = computed(
  //   () =>
  //     store.state.constData['belongingRoute_shy'].data || []
  // ),
  // 起止日期默认选项
  rangePickerValue = ref([yesterday, yesterday]),
  // 报警日期选择
  rangeChange = dateAry => {
    formData.value.startDate = dateAry?.[0]
    formData.value.endDate = dateAry?.[1]
  },
  // 重置
  reset = () => {
    selfStore.initialize()

    // 归属路线默认G25
    // formData.value.roadCode = 'G25'

    yesterday = dayjs()
      .subtract(1, 'day')
      .format('YYYY-MM-DD')

    // 起止日期值默认
    formData.value.startDate = yesterday
    formData.value.endDate = yesterday

    // 起止日期显示重置
    rangePickerValue.value = [yesterday, yesterday]

    emits('search')
  }

onMounted(() => {
  // 厂商选项检查
  corpLoading.value = true
  store
    .dispatch('dataDictionary/checkDicByKey', 'online_corp')
    .finally(() => {
      corpLoading.value = false
    })

  reset()
})
</script>

<style lang="less" scoped>
.self-form {
  .ant-form-item {
    margin: 0 1rem 1rem 0;
  }
}
</style>
