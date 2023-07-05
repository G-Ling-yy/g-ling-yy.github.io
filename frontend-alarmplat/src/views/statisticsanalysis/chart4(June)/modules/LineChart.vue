<template>
  <div id="chart-container" ref="chartDom"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from '@/utils/lodash'
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
const corpNameObj = {
  all: '平台',
  vid_yckj_test: '预策',
  vid_zglt_test: '联通',
  vid_jsxrd_test: '鑫瑞德',
  vid_alibaba_test: '阿里',
  vid_zxfl_test: '中兴',
  vid_zjdh_test: '大华',
  vid_ysbg_test: '宇视'
  // vid_jslkj_test: '金三立'
}

// 处理图表数据
const handeChartData = () => {
  const legendData = [], // legend 数据
    seriesData = [], // series 数据
    xData =
      props.data?.['all']?.checkDay?.map?.(e =>
        e.slice(5)
      ) || [], // x轴 数据
    // title时间范围文本
    titleRangeStr = `${
      props.data?.['all']?.checkDay?.[0]?.slice(5) || '---'
    } ~ ${
      props.data?.['all']?.checkDay
        ?.slice(-1)?.[0]
        ?.slice(5) || '---'
    }`

  for (const key in corpNameObj) {
    if (props.data[key]) {
      legendData.push(corpNameObj[key])
      seriesData.push({
        name: corpNameObj[key],
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
