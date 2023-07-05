<template>
  <!-- 图表 -->
  <div class="chart-wrap">
    <div id="today-alarm-chart" ref="chartRef"></div>
  </div>
</template>

<script setup>
/* eslint no-unused-vars: off */
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import apis from '@/api'
import * as echarts from 'echarts'
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from '@/utils/lodash'

const chartRef = ref() // 图表dom ref

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
const getChartData = (showLoading = true) => {
    !myChart && (myChart = echarts.init(chartRef.value))

    showLoading && myChart?.showLoading()
    apis.alarmLive
      .getTodayAlarmStatistics()
      .then(res => {
        handleChartData(res)
      })
      .finally(() => {
        myChart?.hideLoading()
      })
  },
  // 处理图表数据
  handleChartData = data => {
    let total = 0
    const seriesData = data.map(e => {
      total += e.alarmCount

      return {
        value: e.alarmCount,
        name: e.eventTypeName
      }
    })

    renderChart({
      total,
      seriesData
    })
  },
  // 渲染图表
  renderChart = ({ total, seriesData }) => {
    const option = {
      grid: {
        bottom: '0',
        right: '10',
        left: '0'
      },

      title: {
        text: total,
        textStyle: {
          color: '#25292D',
          fontSize: 36,
          fontWeight: 'normal',
          fontFamily: 'DINPro'
        },
        subtext: '总数(件)',
        subtextStyle: {
          color: '#A5ADBF',
          fontSize: 14,
          lineHeight: 0,
          height: 0
        },
        top: '30%',
        left: 'center'
      },

      tooltip: {
        trigger: 'item'
      },

      legend: {
        bottom: 0,
        icon: 'circle',
        itemHeight: 6,
        itemWidth: 6,
        itemStyle: {
          borderColor: 'transparent'
        },
        left: 'center',
        textStyle: {
          backgroundColor: 'transparent',
          color: '#414C5D',
          width: 30
        }
      },

      series: [
        // 内刻度
        {
          name: '',
          legend: {
            show: false
          },
          bottom: '20%',
          type: 'gauge',
          splitNumber: 48,
          radius: '74%',
          center: ['50%', '40%'],
          startAngle: 0,
          endAngle: 360,
          axisLine: {
            show: false
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#b3b8c7',
              width: 1
            },
            length: 5,
            splitNumber: 1
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          }
        },

        // 内环虚影
        {
          name: '',
          color: [
            '#0255FF1f',
            '#046AFF1f',
            '#088AFF1f',
            '#10A1FB1f',
            '#19B4EB1f',
            '#25C8D51f',
            '#2FDBBF1f',
            '#37E8B01f',
            '#38EA831f'
          ].slice(0, seriesData.length),
          bottom: '20%',
          type: 'pie',
          radius: ['75%', '88%'],
          hoverAnimation: false,
          label: {
            color: '#333',
            show: false,
            fontFamily: 'DS-Digital',
            position: 'center'
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            borderColor: '#fff'
          },
          tooltip: {
            show: false
          },
          data: seriesData.map(e => ({
            value: e.value,
            name: ''
          }))
        },

        // 外环实环
        {
          name: '',
          color: [
            '#0255FF',
            '#046AFF',
            '#088AFF',
            '#10A1FB',
            '#19B4EB',
            '#25C8D5',
            '#2FDBBF',
            '#37E8B0',
            '#38EA83'
          ].slice(0, seriesData.length),
          bottom: '20%',
          type: 'pie',
          radius: ['88%', '95%'],
          label: {
            color: '#333',
            show: false,
            fontFamily: 'DS-Digital',
            position: 'center'
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            borderColor: '#fff'
          },
          data: seriesData
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart?.setOption(option, { notMerge: true })
  }

onMounted(() => {
  // 获取图表数据
  getChartData()

  chartResizeObserver.observe(chartRef.value)
})

onBeforeUnmount(() => {
  /* 清销 myChart 实例 */
  myChart?.clear()
  myChart?.dispose()
  myChart = null

  /* 关销 监听 实例 */
  chartResizeObserver.unobserve(chartRef.value)
  chartResizeObserver = null
})

defineExpose({
  // 获取图表数据
  getChartData
})
</script>

<style lang="less" scoped>
/* 图表 */
.chart-wrap {
  height: 100%;

  #today-alarm-chart {
    height: 100%;
  }
}
</style>
