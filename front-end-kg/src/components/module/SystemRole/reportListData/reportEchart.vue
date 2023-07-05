<template>
<div>
    <div   class="pie-wrap chartPie" ref="chartPie"></div>
    <div   class="line-wrap chartLine" ref="chartLine"></div>
</div>
    
</template>

<script>
    import * as echarts from 'echarts';
    require('echarts/theme/macarons');
    export default {
    data() {
      return {
        chartPie: null,
        chartLine: null,
        chartPieData: [],
        chartPieContent: '',
        chartLineX: [],
        chartLineData: {
          cameraRate: [],
          offlineRate: [],
          abnorma: [],
        }
      }
    },
     props: {
      companyReportId: {
        type: String,
        default: ''
    },
    reporyType: {
      type: String,
      default: 'week'
    },
    },
    mounted() {
        // this.drawPieChart();
        this.drawLineChart();
        this.getEchartsData();
    },
    methods: {
      // echarts图形渲染
      getEchartsData () {
          console.log('Echarts', this.reporyType)
      switch (this.reporyType) {
        case 'week': 
          this.getWeekCurrentStat()
          this.getWeekLine()
          break;
          case 'month': 
          this.getMonthCurrentStat()
          this.getMonthLine ()
          break;
        default:
          break;
      }
      },
      // 查询周报当前接入统计
      getWeekCurrentStat   () {
         let obj = {
          reportId: this.companyReportId
        };
        this.$api.getWeekCurrentStat  (obj).then(res => {
          if (res.code == 200) {
            let chartList = res.data
            this.chartPieData.push({
              value:parseInt(chartList.cameraCount),
              name : '正常'
            })
            this.chartPieData.push({
              value:parseInt(chartList.offlineCount),
              name : '离线'
            })
            this.chartPieData.push({
              value:parseInt(chartList.abnormalCount),
              name : '异常'
            })
          this.chartPieContent = parseInt(chartList.cameraCount) + parseInt(chartList.offlineCount) + parseInt(chartList.abnormalCount)
          this.drawPieChart( this.chartPieData ,this.chartPieContent)
          } else {
            this.$message.error(res.message);
          }
        });
      },

      // 查询本周平均在线率、离线率、异常率
      getWeekLine  () {
         let obj = {
          reportId: this.companyReportId
        };
        this.$api.getWeekLine   (obj).then(res => {
          if (res.code == 200) {
             let chartList = res.data
              chartList.map(item => {
                console.log(233,/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.gmtCreate)[0])
              this.chartLineX.push(/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.gmtCreate)[0])
              this.chartLineData.cameraRate.push(parseInt(item.cameraRate))
              this.chartLineData.offlineRate.push(parseInt(item.offlineRate))
              this.chartLineData.abnorma.push(parseInt(item.abnormalRate))
            });
            this.drawLineChart()

          } else {
            this.$message.error(res.message);
          }
        });
      },
       // 查询月报当前接入统计
      getMonthCurrentStat  () {
         let obj = {
          reportId: this.companyReportId
        };
        this.$api.getMonthCurrentStat  (obj).then(res => {
          if (res.code == 200) {
            console.log('饼图', res.data)
            let chartList = res.data
            this.chartPieData.push({
              value:parseInt(chartList.cameraCount),
              name : '正常'
            })
            this.chartPieData.push({
              value:parseInt(chartList.offlineCount),
              name : '离线'
            })
            this.chartPieData.push({
              value:parseInt(chartList.abnormalCount),
              name : '异常'
            })
          this.chartPieContent = parseInt(chartList.cameraCount) + parseInt(chartList.offlineCount) + parseInt(chartList.abnormalCount)
          this.drawPieChart( this.chartPieData ,this.chartPieContent)
          } else {
            this.$message.error(res.message);
          }
        });
      },

      // 查询本月平均在线率、离线率、异常率
      getMonthLine    () {
         let obj = {
          reportId: this.companyReportId
        };
        this.$api.getMonthLine    (obj).then(res => {
          if (res.code == 200) {
            console.log('折线图', res.data)
            let chartList = res.data
              chartList.map(item => {
                console.log(233,/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.gmtCreate)[0])
              this.chartLineX.push(/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.gmtCreate)[0])
              this.chartLineData.cameraRate.push(parseInt(item.cameraRate))
              this.chartLineData.offlineRate.push(parseInt(item.offlineRate))
              this.chartLineData.abnorma.push(parseInt(item.abnormalRate))
            });
            this.drawLineChart()
          } else {
            this.$message.error(res.message);
          }
        });
      },
      // 饼图
      drawPieChart() {
        let mytextStyle = {
          color: "#333",                          
          fontSize: 18,                            
        };
        let mylabel = {
          show: true,                 
          position: "right",          
          offset: [30, 40],             
          formatter: '{b} : {c} ({d}%)',      
          textStyle: mytextStyle
        };
        this.chartPie = echarts.init(this.$refs.chartPie);
        this.chartPie.setOption({
          title: {
            text: 'Pie Chart',
            subtext: '纯属虚构',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            data: ['正常', '离线', '异常'],
            left:"center",                              
            top:"bottom",                              
            orient:"horizontal",                        
          },
          title: {
          text: this.chartPieContent,
          //subtext: datasubtext[0],
          left: "50%",
          y: "center",
          textAlign: "center",
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
            color: ["#000"]
          }
        },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              data: this.chartPieData,
              animationEasing: 'cubicInOut',
              animationDuration: 2600,
              label: {           
                emphasis: mylabel
              }
            }
          ]
        });
      },
      // 折线图
      drawLineChart() {
        this.chartLine = echarts.init(this.$refs.chartLine);// 基于准备好的dom，初始化echarts实例
        let option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['在线率','离线率','异常率']
            },
            calculable : true,
            xAxis : [
                {
                  type: "category",
                  boundaryGap: false,
                  data: this.chartLineX,
                  axisLabel: {
                  color: "#000"
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                    color: "#f2f2f2",
                    width: 1,
                    type: "solid"
                  }
                },
                minorTick: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: "#1274EE",
                    width: 1,
                    type: "solid"
                  }
                }
                      }
            ],
            yAxis : [
                {
                    type : 'value',
                    boundaryGap : false,
                    axisLabel: {  
                            formatter: '{value} %'  
                        },
                    name: this.reporyType === 'week' ? '本周平均在线率/离线率/异常率': '本月平均在线率/离线率/异常率',
                    splitNumber : 9,
                    
                }
            ],
            series : [
                {
                    name:'在线率',
                    type:'line',
                    data:this.chartLineData.abnorma
                },
                {
                    name:'离线率',
                    type:'line',
                    data:this.chartLineData.cameraRate
                },
                 {
                    name:'异常率',
                    type:'line',
                    data:this.chartLineData.offlineRate
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表
        this.chartLine.setOption(option);
      },
      reporyClose  () {
      }
    }
  }
</script>

<style lang='less' scope>
    .pie-wrap{
        width:100%;
        height:400px;
    }
    .line-wrap{
        width:100%;
        height:400px;
    }
</style>