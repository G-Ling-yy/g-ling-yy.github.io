<template>
  <!-- 表单 -->
  <SelfForm @handleSearch="searchHandler" />

  <!-- 图表 -->
  <div class="chart-wrap">
    <div id="statistics-analysis-chart" ref="statisticsChartRef"></div>
    <!-- 图表loading（echart自带了） -->
    <!-- <div class="chart-loading flex-center" v-if="chartLoading">
      <ma-spin size="large" />
    </div> -->
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

const chartType = ref('jianchuRate'),
  chartTypeObj = {
    baocuoRate: {
      name: '报错率',
      yAxisUnit: '%'
    },
    jianchuRate: {
      name: '检出率',
      yAxisUnit: '%'
    },
    xiangjijianchuDistance: {
      name: '相机检出距离',
      yAxisUnit: '米'
    },
    yewuzhanbiRate: {
      name: '业务转换率',
      yAxisUnit: '%'
    },
    zhengqueRate: {
      name: '正确率',
      yAxisUnit: '%'
    },
    zhudongfaxianRate: {
      name: '主动发现率',
      yAxisUnit: '%'
    },
    biaodingCount: {
      name: '标定次数',
      yAxisUnit: '次'
    }
  },
  // chartLoading = ref(false),
  statisticsChartRef = ref() // 图表dom ref

/* 表单 */
const formData = computed(() => selfStore.formData),
  searchHandler = ({ statisticsType }) => {
    chartType.value = statisticsType
    getChartData()
  }

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
      .getStatisticsChart(formData.value)
      .then(res => {
        handleChartData(res)
      })
      .finally(() => {
        myChart?.hideLoading()
      })
  },
  // 处理图表数据
  handleChartData = data => {
    data.sort((a, b) => (a.dataSourceDate > b.dataSourceDate ? 1 : -1))
    const xAxisData = [],
      legendData = [],
      legendSelected = {},
      seriesData = [],
      PreAryObj = {
        综合检出率: {
          propName: 'checkRate',
          data: []
        },

        白天检出率: {
          propName: 'checkRateDay',
          data: []
        },

        夜晚检出率: {
          propName: 'checkRateNight',
          data: []
        },

        晴天检出率: {
          propName: 'checkRateSun',
          data: []
        },

        非晴天检出率: {
          propName: 'checkRateNoSun',
          data: []
        },

        综合正确率: {
          propName: 'correctRate',
          data: []
        },

        白天正确率: {
          propName: 'correctRateDay',
          data: []
        },

        夜晚正确率: {
          propName: 'correctRateNight',
          data: []
        },

        晴天正确率: {
          propName: 'correctRateSun',
          data: []
        },

        非晴天正确率: {
          propName: 'correctRateNoSun',
          data: []
        },

        综合主动发现率: {
          propName: 'earlyRate',
          data: []
        },

        白天主动发现率: {
          propName: 'earlyRateDay',
          data: []
        },

        夜晚主动发现率: {
          propName: 'earlyRateNight',
          data: []
        },

        晴天主动发现率: {
          propName: 'earlyRateSun',
          data: []
        },

        非晴天主动发现率: {
          propName: 'earlyRateNoSun',
          data: []
        },

        业务转换率: {
          propName: 'bsRate',
          data: []
        },

        报错率: {
          propName: 'errorRate',
          data: []
        },

        检出相机距离平均数: {
          propName: 'avgRangeChecked',
          data: []
        },

        检出相机距离中位数: {
          propName: 'medianRangeChecked',
          data: []
        },

        标定次数: {
          propName: 'bodyNum',
          data: []
        }
      }
    let keys

    switch (chartType.value) {
      case 'jianchuRate':
        keys = ['综合检出率', '白天检出率', '夜晚检出率', '晴天检出率', '非晴天检出率']
        keys.forEach((e, i) => {
          i > 0 && (legendSelected[e] = false)
        })
        break

      case 'zhengqueRate':
        keys = ['综合正确率', '白天正确率', '夜晚正确率', '晴天正确率', '非晴天正确率']
        keys.forEach((e, i) => {
          i > 0 && (legendSelected[e] = false)
        })
        break

      case 'zhudongfaxianRate':
        keys = [
          '综合主动发现率',
          '白天主动发现率',
          '夜晚主动发现率',
          '晴天主动发现率',
          '非晴天主动发现率'
        ]
        keys.forEach((e, i) => {
          i > 0 && (legendSelected[e] = false)
        })
        break

      case 'yewuzhanbiRate':
        keys = ['业务转换率']
        break

      case 'baocuoRate':
        keys = ['报错率']
        break

      case 'xiangjijianchuDistance':
        keys = ['检出相机距离平均数', '检出相机距离中位数']
        break

      case 'biaodingCount':
        keys = ['标定次数']
        break

      default:
        break
    }

    data.forEach(e => {
      xAxisData.push(e.dataSourceDate.slice(5))
      keys.forEach(key => {
        PreAryObj[key].data.push(e.id ? trans2Num(e[PreAryObj[key].propName]) : 0)
      })
    })

    keys.forEach(key => {
      legendData.push(key)
      seriesData.push({
        name: key,
        type: 'line',
        data: PreAryObj[key].data
      })
    })

    renderChart({
      legendData,
      legendSelected,
      xAxisData,
      seriesData
    })

    function trans2Num(v) {
      return v === '无' ? 0 : Number((v + '').split('%')[0])
    }
  },
  // 渲染图表
  renderChart = ({ legendData, legendSelected, xAxisData, seriesData }) => {
    const option = {
      title: {
        text: `${chartTypeObj[chartType.value].name}图表`
      },

      grid: {
        bottom: '30',
        right: '10',
        left: '60'
      },

      tooltip: {},

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
          formatter: `{value}${chartTypeObj[chartType.value].yAxisUnit}`
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
