<template>
  <div class="index-container">
    <div id="test"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Index',
  mounted() {
    const myChart = echarts.init(document.getElementById('test'))
    // 绘制图表
    myChart.setOption({
      title: {
        text: '示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    })
  }
}
</script>
<style lang="less">
#test {
  height: 60vh;
  width: 500px;
}
</style>
