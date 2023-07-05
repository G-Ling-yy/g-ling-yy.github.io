<template>
  <!-- 表单 -->
  <SelfForm @handleSearch="getChartData" />

  <!-- 图表 -->
  <div class="chart-wrap">
    <div id="statistics-analysis-chart" ref="statisticsChartRef"></div>
  </div>
</template>

<script setup>
/* eslint no-unused-vars: off */
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import selfStore from './modules/self-store'
import SelfForm from './modules/SelfForm'
import apis from '@/api'
import * as echarts from 'echarts'
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from '@/utils/lodash'

const statisticsChartRef = ref() // 图表dom ref

// 转值为数
function trans2Num(v) {
  return v === '无' ? 0 : Number((v + '').split('%')[0])
}

/* 表单 */
const formData = computed(() => selfStore.formData)

/* 图表 */
// 图表实例
let myChart,
  // 图表形变监听实例
  chartResizeObserver = new ResizeObserver(
    debounce(() => {
      myChart?.resize()
    }, 100)
  )

// 获取图表数据
const getChartData = () => {
    !myChart && (myChart = echarts.init(statisticsChartRef.value))

    myChart?.showLoading()
    apis.events
      .getRightStatisticsChart({
        ...formData.value,
        eventType: formData.value.eventType || 'all'
      })
      .then(res => {
        const f = res?.[0]
        f?.id && f?.corp ? renderBarChart(res) : renderLineChart(res)
      })
      .finally(() => {
        myChart?.hideLoading()
      })
  },
  // 渲染柱状图表
  renderBarChart = data => {
    // 处理图表数据
    data.sort((a, b) => (a.checkDay > b.checkDay ? 1 : -1))

    const xAxisData = [],
      legendData = [],
      legendSelected = {},
      seriesData = [],
      keys = {
        correctNum: {
          name: '标定正确数',
          data: []
        },

        errorNum: {
          name: '标定错误数',
          data: []
        }
      }

    data.forEach(e => {
      xAxisData.push(e.checkDay.slice(5))
      for (const key in keys) {
        keys[key].data.push(e[key])
      }
    })

    for (const key in keys) {
      legendData.push(keys[key].name)
      seriesData.push({
        name: keys[key].name,
        type: 'bar',
        stack: 'all',
        data: keys[key].data,
        label: {
          show: true,
          formatter: ({ data }) => (data > 0 ? data : '')
        }
      })
    }

    const option = {
      title: {
        text: '标定情况图表'
      },

      color: ['#5470c6', '#a90000'],

      grid: {
        bottom: '30',
        right: '10',
        left: '60'
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      legend: {
        data: legendData,
        selected: legendSelected
      },

      xAxis: {
        type: 'category',
        data: xAxisData
      },

      yAxis: {
        type: 'value'
      },

      series: seriesData
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart?.setOption(option, { notMerge: true })
  },
  // 渲染折线图表
  renderLineChart = data => {
    // 处理图表数据
    data.sort((a, b) => (a.checkDay > b.checkDay ? 1 : -1))

    const xAxisData = [],
      legendData = [],
      legendSelected = {},
      seriesData = [],
      keys = {
        checkRateCumulative: {
          name: '累计正确率',
          data: []
        }
      }

    data.forEach(e => {
      xAxisData.push(e.checkDay.slice(5))
      for (const key in keys) {
        keys[key].data.push(trans2Num(e[key]))
      }
    })

    for (const key in keys) {
      legendData.push(keys[key].name)
      seriesData.push({
        name: keys[key].name,
        type: 'line',
        data: keys[key].data,
        smooth: true
      })
    }

    const option = {
      title: {
        text: '累计正确率图表'
      },

      color: ['#5470c6'],

      grid: {
        bottom: 30,
        right: 10,
        left: 60
      },

      tooltip: {
        trigger: 'axis'
        // axisPointer: {
        //   type: 'shadow'
        // }
      },

      legend: {
        data: legendData,
        selected: legendSelected
      },

      xAxis: {
        type: 'category',
        data: xAxisData
      },

      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: `{value}%`
        }
      },

      series: seriesData
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart?.setOption(option, { notMerge: true })
  }

onMounted(() => {
  getChartData()

  chartResizeObserver.observe(statisticsChartRef.value)
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')

  /* 清销 myChart 实例 */
  myChart?.clear()
  myChart?.dispose()
  myChart = null

  /* 关销 监听 实例 */
  chartResizeObserver.unobserve(statisticsChartRef.value)
  chartResizeObserver = null
})
</script>

<style lang="less" scoped>
/* 图表 */
.chart-wrap {
  height: calc(100% - 52px);
  position: relative;

  #statistics-analysis-chart {
    height: 100%;
  }
  /* 图表loading */
  .chart-loading {
    background-color: #fffb;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
