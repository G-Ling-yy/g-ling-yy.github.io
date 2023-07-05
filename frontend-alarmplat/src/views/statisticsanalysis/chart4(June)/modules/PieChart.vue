<template>
  <div id="chart-container" ref="chartDom"></div>
</template>

<script setup>
const { ref, computed, watch, onMounted, onBeforeUnmount } = require('vue')
import selfStore from './self-store'
import * as echarts from 'echarts'

const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible'])

// 表单数据
const formData = computed(() => selfStore.formData),
  // 额外传参
  extraData = computed(() => selfStore.extraData)

const chartDom = ref()
let myChart

// 处理图表数据
const handeChartData = () => {
  const seriesData = [], // series数据
    // title时间范围文本
    titleRangeStr =
      formData.value.rangePickerValue[0] === formData.value.rangePickerValue[1]
        ? formData.value.rangePickerValue[1].slice(5)
        : `${formData.value.rangePickerValue[0].slice(
            5
          )} ~ ${formData.value.rangePickerValue[1].slice(5)}`

  for (const key in formData.value.circleSwitches) {
    const evt = formData.value.circleSwitches[key]
    if (evt.checked) {
      seriesData.push({
        name: evt.name,
        value: evt.count
      })
    }
  }
  const option = {
    title: {
      text: `(${titleRangeStr}) 报警类型占比`
    },

    // color: ['#5470c6', '#a90000'],

    tooltip: {
      formatter: params => `
              ${params.percent}%<br/>
              ${params.marker} ${params.name}: ${params.data.value}`
    },

    series: [
      {
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        data: seriesData
      }
    ]
  }

  myChart?.setOption(option, { notMerge: true })
}

// 图表自适应事件处理
const chartResize = () => {
  setTimeout(() => {
    myChart?.resize()
  }, 100)
}

onMounted(() => {
  myChart = echarts.init(chartDom.value)

  handeChartData()

  watch(
    () => props.loading,
    nV => {
      if (nV) {
        myChart?.showLoading()
      } else {
        myChart?.hideLoading()
        handeChartData()
      }
    }
  )

  watch(
    () => formData.value.circleSwitches,
    () => {
      handeChartData()
    },
    {
      deep: true
    }
  )

  window.addEventListener('resize', chartResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', chartResize)
})
</script>

<style lang="less" scoped>
#chart-container {
  height: 100%;
  width: 100%;
}
</style>
