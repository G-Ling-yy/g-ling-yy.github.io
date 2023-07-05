<template>
  <div class="full-wrap">
    <!-- 表单 -->
    <SelfForm
      :curChartType="curChartType"
      @handleSearch="getChartData"
    />

    <main>
      <div class="charts-wrap">
        <!-- 柱状图 -->
        <BarChart
          v-if="curChartType === 'bar'"
          :data="chartData"
          :loading="loading"
        />

        <!-- 饼图 -->
        <!-- <PieChart v-if="curChartType === 'pie'" :loading="evtsLoading" /> -->

        <!-- 折线图 -->
        <LineChart
          v-if="curChartType === 'line'"
          :data="chartData"
          :loading="loading"
        />
      </div>

      <!-- 图表切换 -->
      <div class="charts-switches">
        <div
          v-for="chartType of ['bar', 'line']"
          :class="[
            'switch btn',
            chartType,
            chartType === curChartType && 'active'
          ]"
          :key="chartType"
          @click="tabChartType(chartType)"
        ></div>
      </div>
    </main>
  </div>
</template>

<script setup>
/* eslint no-unused-vars: off */
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import selfStore from './modules/self-store'
import SelfForm from './modules/SelfForm'
import BarChart from './modules/BarChart'
// import PieChart from './modules/PieChart'
import LineChart from './modules/LineChart'
import apis from '@/api'

/* 表单 */
const formData = computed(() => selfStore.formData),
  // 额外传参
  extraData = computed(() => selfStore.extraData)

/* main */
const curChartType = ref('bar'), // 当前图表
  // 切换图表
  tabChartType = chartType => {
    if (chartType === curChartType.value) return

    curChartType.value = chartType
    getChartData(chartType)
  },
  chartData = ref([]) // 图表数据

const evtsLoading = ref(false), // 事件or饼图接口loading
  loading = ref(false) // 接口loading

/*
@param chartType: String ('bar' | 'pie' | 'line'), 用于标记图表类型切换触发
 */
const getChartData = chartType => {
  // 事件参数（多选变单选）
  const eventTypes = [formData.value.eventType]
  // for (const key in formData.value.circleSwitches) {
  //   formData.value.circleSwitches[key].checked && eventTypes.push(key)
  // }

  // 厂商参数
  const corps = []
  for (const key in formData.value.corps[
    formData.value.isPoc
  ]) {
    formData.value.corps[formData.value.isPoc][key]
      .checked && corps.push(key)
  }

  // 接口参数
  const params = {
    corps,
    eventTypes,
    isPoc: formData.value.isPoc,
    startDate: formData.value.rangePickerValue[0],
    endDate: formData.value.rangePickerValue[1]
  }

  // 事件条件变更 或 切饼图 不触发 事件饼图接口请求
  if (extraData.value.isTriggerByEvt || chartType) {
    extraData.value.isTriggerByEvt = false
  } else {
    evtsLoading.value = true
    apis.events
      .getEvtsPercentStatistics({
        ...params,
        orgId: 'ff80818159af9032015a1258ae5f001a'
      })
      .then(res => {
        extraData.value.pieData = res
      })
      .finally(() => {
        evtsLoading.value = false
      })
  }

  // 饼图切换不调用
  if (curChartType.value !== 'pie') {
    loading.value = true
    apis.events[
      {
        bar: 'getCorpsCalibrationCount',
        line: 'getCorpsCumulativeRight'
      }[curChartType.value]
    ]({
      ...params,
      orgId: 'ff80818159af9032015a1258ae5f001a'
    })
      .then(res => {
        chartData.value = res
      })
      .finally(() => {
        loading.value = false
      })
  }
}

onMounted(() => {
  // getChartData()
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')
  // 初始化 extraData 数据
  selfStore.initialize('extraData')
})
</script>

<style lang="less" scoped>
.full-wrap {
  height: 100%;
  position: relative;

  main {
    display: flex;
    height: calc(100% - 80px - 40px);
    left: 0;
    position: absolute;
    top: 80px;
    width: 100%;

    /* 图表 */
    .charts-wrap {
      height: 100%;
      width: calc(100% - 70px);
    }

    .charts-switches {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;

      .switch {
        background: 0 0/ 100% 100% no-repeat;
        border-radius: 50%;
        height: 50px;
        margin-bottom: 5vh;
        transition: 0.2s;
        width: 50px;
        &:last-child {
          margin-bottom: 0;
        }
        &.bar {
          background-image: url(~@images/bar_chart_icon.png);
          &:hover {
            box-shadow: 0 0 15px 0 #80a6df;
          }
          &.active {
            box-shadow: 0 0 0 3px #3161a9 inset;
          }
        }
        &.pie {
          background-image: url(~@images/pie_chart_icon.png);
          &:hover {
            box-shadow: 0 0 0 1px #fdb417 inset;
          }
          &.active {
            box-shadow: 8px -8px 0 2px #fdb417 inset;
          }
        }
        &.line {
          background-image: url(~@images/line_chart_icon.png);
          &:hover {
            box-shadow: 0 0 15px 0 #80a6df;
          }
          &.active {
            box-shadow: 0 0 0 3px #3161a9 inset;
          }
        }
      }
    }
  }
}
</style>
