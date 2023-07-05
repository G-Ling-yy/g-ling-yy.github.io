<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 操作状态 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.operateStatus"
        placeholder="操作状态"
      >
        <ma-select-option :value="1">成功</ma-select-option>
        <ma-select-option :value="0">失败</ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 功能模块 -->
    <ma-form-item>
      <ma-select
        v-model:value="formData.funcModule"
        allowClear
        placeholder="功能模块"
        style="width: 120px"
      >
        <ma-select-option :value="1">
          实时标定
        </ma-select-option>
        <ma-select-option :value="2">
          图像标注
        </ma-select-option>
        <ma-select-option :value="3">
          摄像机管理
        </ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 操作人 -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="操作人"
        v-model:value="formData.userName"
        style="width: 100px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 起止时间 -->
    <ma-form-item>
      <ma-range-picker
      id="range"
        inputReadOnly
        :placeholder="['起日期', '止日期']"
        valueFormat="YYYY-MM-DD"
        @change="rangeChange"
      />
    </ma-form-item>

    <!-- 搜索按钮 -->
    <ma-form-item>
      <ma-button type="primary" @click="$emit('search')">
        搜索
      </ma-button>
    </ma-form-item>

    <!-- 重置按钮 -->
    <ma-form-item>
      <ma-button @click="reset"> 重置 </ma-button>
    </ma-form-item>
  </ma-form>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import selfStore from './self-store'
const store = useStore(),
  emits = defineEmits(['search'])

// 用户部分信息
const userInfo = reactive({
  userSpecificInfo: store.getters['user/userSpecificInfo']
})

const formData = computed(() => selfStore.formData),
  // 报警日期选择
  rangeChange = dateAry => {
    formData.value.startTime = dateAry?.[0]
    console.log('formData1111111111:', formData.value)
    formData.value.endTime = dateAry?.[1]
  },
  // 重置
  reset = () => {
    selfStore.initialize()

    emits('search')
  }

watch(
  () => formData.value.endTime,
  (nV, oV) => {
    console.log('nV11111111111:', nV)
    console.log('oV11111111111:', oV)
  },
  { deep: true }
)
onMounted(() => {
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