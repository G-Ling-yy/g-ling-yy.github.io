<template>
    <div class="self-search">
        <ma-form-item>
            <span>报表统计时间:</span>
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

         <!-- 查询按钮 -->
        <ma-form-item>
            <ma-button type="primary"  @click="$emit('search')">
                查询
            </ma-button>
        </ma-form-item>
         <!-- 重置按钮 -->
        <ma-form-item>
            <ma-button  @click="reset">
                重置
            </ma-button>
        </ma-form-item>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import selfStore from './self-store'

const emits = defineEmits(['search'])

const formData = computed(() => selfStore.formData),
  // 日期选择
  rangeChange = dateAry => {
    formData.value.startDate = dateAry?.[0]
    console.log('formData1111111111:', formData.value.startDate)
    console.log('dateAry1111111111:', dateAry)
    formData.value.endDate = dateAry?.[1]
  },
    // 重置
  reset = () => {
    selfStore.initialize()

    emits('search')
  }

watch(
  () => formData.value.endDate,
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
.self-search{
    display: flex;
    .ant-form-item{
        margin: 0 1rem 1rem 0;
    }
}
</style>