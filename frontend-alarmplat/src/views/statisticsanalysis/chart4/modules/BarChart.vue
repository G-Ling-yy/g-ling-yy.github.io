<template>
  <div id="chart-container" ref="chartDom"></div>

  <!-- 弹窗 -->
  <BarModal
    v-if="barModalShow"
    v-model:visible="barModalShow"
    :data="barModalData"
    :title="`${evtName}详情`"
  />
</template>

<script setup>
import selfStore from './self-store'
import * as echarts from 'echarts'
import BarModal from './BarModal'
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
// 弹窗显隐
const barModalShow = ref(false),
  barModalData = ref({}), // 柱图点击弹窗传参数
  evtName = computed(
    () =>
      formData.value.circleSwitches[
        formData.value.eventType
      ].name || ''
  ) // 弹窗标题处 报警类型字段

// 表单数据
const formData = computed(() => selfStore.formData)

// 厂商名对象
let corpObj, corpNameKeyObj // 厂商name: key对象

// 处理图表数据
const handeChartData = () => {
  if (!corpObj) {
    corpObj = formData.value.corps[formData.value.isPoc]
    corpNameKeyObj = {} // 厂商key对象
    Object.keys(corpObj).forEach(key => {
      corpNameKeyObj[corpObj[key].name] = key
    })
  }
  // 对 props.data对象 按 厂商选项顺序 排序成 data数组
  const data = []
  for (const key in corpObj) {
    props.data[key] && data.push(props.data[key])
  }

  // 图表参数处理
  const correctData = [], // 标定正确数 数据
    errorData = [], // 标定错误数 数据
    uncalibratedData = [], // 暂未标定数 数据
    videoUnusualData = [], // 视频异常数 数据
    xData = [], // x轴 数据
    // title时间范围文本
    titleRangeStr =
      formData.value.rangePickerValue[0] ===
      formData.value.rangePickerValue[1]
        ? formData.value.rangePickerValue[1].slice(5)
        : `${formData.value.rangePickerValue[0].slice(
            5
          )} ~ ${formData.value.rangePickerValue[1].slice(
            5
          )}`
  data.forEach(e => {
    correctData.push(e.correctNum ?? 0)
    errorData.push(e.errorNum ?? 0)
    uncalibratedData.push(e.unmarkedNum ?? 0)
    videoUnusualData.push(e.videoErrorNum ?? 0)
    xData.push(corpObj[e.corp].name)
  })

  const option = {
    title: {
      text: `(${titleRangeStr}) 报警标定情况`
    },

    color: ['#aaa', '#5470c6', '#a90000', '#ff8d00'],

    grid: {
      bottom: '30',
      right: '0',
      left: '60'
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },

    legend: {
      data: [
        '暂未标定数',
        '标定正确数',
        '标定错误数'
        // '视频异常数'
      ]
    },

    xAxis: {
      type: 'category',
      data: xData
    },

    yAxis: {
      type: 'value',
      minInterval: 1
    },

    series: [
      {
        name: '暂未标定数',
        type: 'bar',
        stack: 'all',
        data: uncalibratedData,
        label: {
          show: true,
          formatter: ({ data }) => (data > 0 ? data : '')
        },
        barMaxWidth: 50
      },

      {
        name: '标定正确数',
        type: 'bar',
        stack: 'all',
        data: correctData,
        label: {
          show: true,
          formatter: ({ data }) => (data > 0 ? data : '')
        },
        barMaxWidth: 50
      },

      {
        name: '标定错误数',
        type: 'bar',
        stack: 'all',
        data: errorData,
        label: {
          show: true,
          formatter: ({ data }) => (data > 0 ? data : '')
        },
        barMaxWidth: 50
      }

      // {
      //   name: '视频异常数',
      //   type: 'bar',
      //   stack: 'all',
      //   data: videoUnusualData,
      //   label: {
      //     show: true,
      //     formatter: ({ data }) => (data > 0 ? data : '')
      //   },
      //   barMaxWidth: 50
      // }
    ]
  }

  myChart?.setOption(option, { notMerge: true })
}

onMounted(() => {
  myChart = echarts.init(chartDom.value)
  myChart?.showLoading()

  // 图表点击事件
  myChart.on('click', params => {
    // 弹窗传参
    barModalData.value = {
      isCorrect: {
        0: 2,
        1: 1,
        2: 0,
        3: 3
      }[params.componentIndex],
      corp: corpNameKeyObj[params.name]
    }
    // 弹窗显示
    barModalShow.value = true
  })

  watch([() => props.loading, () => props.data], nV => {
    if (nV[0]) {
      myChart?.showLoading()
    } else {
      myChart?.hideLoading()
      handeChartData()
    }
  })

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
