<template>
  <div id="chart-container" ref="chartDom"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from '@/utils/lodash'
import selfStore from './self-store'
const {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} = require('vue')

const props = defineProps({
    data: {
      type: [Array, Object],
      default: () => []
    },

    loading: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible'])

// 图表dom
const chartDom = ref()

// 图表实例
let myChart,
  // 图表形变监听实例
  chartResizeObserver = new ResizeObserver(
    debounce(() => {
      myChart?.resize()
    }, 100)
  )

// 厂商名对象
const corpObj = computed(() => {
  const formData = selfStore.formData
  return formData.corps[formData.isPoc]
})

// 处理图表数据
const handeChartData = () => {
  const legendData = [], // legend 数据
    seriesData = [], // series 数据
    xData =
      props.data?.['all']?.checkDay?.map?.(e =>
        e.slice(5)
      ) || [], // x轴 数据
    // title时间范围文本
    titleRangeStr = (arr => {
      const startDate = arr[0]?.slice(5) || '--',
        endeDate = arr.slice(-1)?.[0]?.slice(5) || '--'

      return startDate === endeDate
        ? startDate
        : `${startDate} ~ ${endeDate}`
    })(props.data?.['all']?.checkDay || [])

  for (const key in corpObj.value) {
    if (props.data[key]) {
      legendData.push(corpObj.value[key].name)
      seriesData.push({
        name: corpObj.value[key].name,
        type: 'line',
        data: props.data[key].correctRate
      })
    }
  }

  const option = {
    title: {
      text: `(${titleRangeStr}) 累计正确率`
    },

    // color: ['#5470c6', '#30cc7b', '#ff7200'],

    grid: {
      bottom: '5%',
      right: '0',
      left: '3%'
    },

    tooltip: {
      formatter: params => `
              ${params.seriesName}<br/>
              ${params.marker} ${params.name}: ${params.data}%
            `
    },

    legend: {
      data: legendData
    },

    xAxis: {
      data: xData
    },

    yAxis: {
      axisLabel: {
        formatter: `{value}%`
      }
    },

    series: seriesData
  }

  myChart?.setOption(option, { notMerge: true })
}

onMounted(() => {
  myChart = echarts.init(chartDom.value)
  myChart?.showLoading()

  watch(
    () => props.loading,
    nV => {
      if (nV) {
        myChart?.showLoading()
      } else {
        myChart?.hideLoading()
      }
    }
  )

  watch(
    () => props.data,
    nV => {
      if (nV) {
        handeChartData()
      }
    },
    {
      deep: true
    }
  )

  chartResizeObserver.observe(chartDom.value)
})

onBeforeUnmount(() => {
  /* 清销 myChart 实例 */
  myChart?.clear()
  myChart?.dispose()
  myChart = null

  /* 关销 监听 实例 */
  chartResizeObserver.unobserve(chartDom.value)
  chartResizeObserver = null
})
</script>

<style lang="less" scoped>
#chart-container {
  height: 100%;
  width: 100%;
}
</style>
