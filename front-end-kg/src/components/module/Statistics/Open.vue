<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>开放统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="statistics-wrap">
      <el-card
        class="box-card"
        shadow="hover"
        style="height: 370px;"
      >
        <div slot="header" class="clearfix">
          <span>开放摄像机数</span>
          <el-button
            v-if="cameraId"
            style="padding: 3px 0;width: 20PX;height: 20px;font-size: .6rem;margin: -2px 0 0 20px;"
            type="primary"
            @click="backBarChart"
          >
            <i class="el-icon-top-left"></i>
          </el-button>
        </div>
        <div id="openBarChart" class="echart-wrapper"></div>
      </el-card>
      <el-card
        class="box-card"
        shadow="hover"
        style="height:100%"
      >
        <div slot="header" class="clearfix">
          <div>
            <span>近7日视频调取量统计</span>
            <span>
              本周调取量/总调取量: {{ nearSeries }}/{{
                videoSeries
              }}
              较上周
              <i class="el-icon-top" style="color:#f00"></i>
              {{ lastWeekStatisticsRatio }}%
            </span>
          </div>
        </div>
        <el-row style="height:100%" :gutter="20">
          <el-col :span="12" style="height:100%">
            <div
              class="loading-wrap"
              style="width:100%;height:100%"
            >
              <!-- <div class="loading-empty" v-if="countVisable==0">
                <i class="el-icon-coffee-cup"></i>
                <span>暂无数据</span>
              </div>-->
              <div
                id="openLineChartPerApp"
                class="echart-wrapper"
              ></div>
            </div>
          </el-col>
          <el-col :span="12" style="height:100%">
            <div
              class="loading-wrap"
              style="width:100%;height:100%"
            >
              <!-- <div class="loading-empty" v-if="weekVisable == 0">
                <i class="el-icon-coffee-cup"></i>
                <span>暂无数据</span>
              </div>-->
              <div
                id="openLineChartAllApp"
                class="echart-wrapper"
              ></div>
            </div>
            <!-- <div id="openLineChartAllApp" class="echart-wrapper"></div> -->
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
/**
 * 开放统计
 */
import { mapState, mapActions, mapMutations } from 'vuex'
import loading from '../../common/Loading'
export default {
  name: 'Open',
  components: {
    loading
  },
  data() {
    return {
      flag: false, //图形是否展示
      flag1: false, //图形是否展示
      weekVisable: 0,
      countVisable: 0,
      cameraId: null,
      xdata: [
        {
          value: '周一',
          textStyle: {
            align: 'left'
          }
        },
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        {
          value: '周日',
          textStyle: {
            align: 'right'
          }
        }
      ],
      cameraPlayList: [],
      cameraVideoList: [], //x轴
      // 周播放
      weekXyDataList: [],
      seriesTotal: [],
      legendRs: [],
      videoPlaytime: '',
      videoPlaycount: [],
      videoSeries: '',
      nearSeries: '', //近期总量
      lastWeekStatisticsRatio: 0 //最后
    }
  },
  mounted() {
    this.getCameraAndPlayRecord()
    this.getWeekVideoPlayCount()
    this.getCountVideo()
  },

  methods: {
    ...mapActions([
      'getfindCameraAndPlayRecord',
      'getWeekVideoPlayRecordCount',
      'getvideoPlayRecordCount'
    ]),
    // 返回页面
    backBarChart() {
      let orgId = ''
      this.getCameraAndPlayRecord(orgId)
      this.getWeekVideoPlayCount(orgId)
      this.getCountVideo(orgId)
    },
    // 获取柱状图数据
    getCameraAndPlayRecord(appId) {
      let id = !appId ? '' : appId
      this.cameraId = id
      this.getfindCameraAndPlayRecord(id).then(res => {
        if (res.code == 200) {
          this.weekVisable = res.data.length
          if (res.data.length == 0) {
            this.$message({
              message: '该组织下无开放摄像机',
              type: 'info'
            })
            return false
          } else {
            this.cameraPlayList = res.data
            this.cameraVideoList = res.data.map(item => {
              return item.name
            })
            this.cameraCountList = res.data.map(item => {
              return item.cameraCount
            })
            this.videoPlayRecordCountList = res.data.map(
              item => {
                return item.videoPlayRecordCount
              }
            )
            console.log()
            this.openBarChartInit('openBarChart', '')
          }
        }
      })
    },
    /**
     * 柱状图
     */
    openBarChartInit(
      elId,
      lineChartData,
      lineChartDataTotal
    ) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById(elId)
      if (!obj) {
        return false
      }
      let myChart = this.$echarts.init(obj),
        labelOption = {
          // show: true,//柱状图是否展示数据
          position: 'top',
          distance: 10,
          align: 'center',
          verticalAlign: 'bottom',
          rotate: 0,
          formatter: '{c}', // '{c}  {name|{a}}'
          fontSize: 14,
          rich: {
            name: {
              textBorderColor: '#fff'
            }
          }
        },
        options = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#ffffff',
            borderWidth: 0,
            padding: 10,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            extraCssText:
              'box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);'
          },
          legend: [
            {
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              data: ['开放摄像机数'],
              x: 'left',
              textStyle: {
                color: '#000'
              }
            },
            {
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              data: ['视频调取数'],
              x: 'right',
              textStyle: {
                color: '#000'
              }
            }
          ],
          grid: {
            left: '5%',
            right: '5%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            name: '组织',
            type: 'category',
            data: this.cameraVideoList,
            axisLabel: {
              color: '#000'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f2f2f2',
                width: 1,
                type: 'solid'
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
                color: '#1274EE',
                width: 1,
                type: 'solid'
              }
            }
          },
          yAxis: {
            name: '数量',

            type: 'value',
            minorTick: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#000'
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f2f2f2',
                width: 1,
                type: 'solid'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#1274EE',
                width: 1,
                type: 'solid'
              }
            }
          },
          color: ['#FDAD00', '#1274EE'],
          series: [
            {
              label: labelOption,
              barWidth: 20,
              name: '开放摄像机数',
              type: 'bar',
              itemStyle: {
                // barBorderRadius: [20, 20, 0, 0],
                emphasis: {
                  /*text: pieChartDataTotal + 10000000,*/
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    { offset: 0, color: '#FDAD00' },
                    { offset: 1, color: '#FFD16D' }
                  ]
                )
              },
              data: this.cameraCountList
            },
            {
              label: labelOption,
              barWidth: 20,
              name: '视频调取数',
              type: 'bar',
              itemStyle: {
                // barBorderRadius: [20, 20, 0, 0],
                emphasis: {
                  /*text: pieChartDataTotal + 10000000,*/
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    { offset: 0, color: '#1274EE' },
                    { offset: 1, color: '#7EB7FF' }
                  ]
                )
              },
              data: this.videoPlayRecordCountList
              /*markLine: {
                  lineStyle: {
                    type: 'dashed'
                  },
                  data: [
                    [{type: 'min'}, {type: 'max'}]
                  ]
                }*/
            }
          ]
        }
      // 绘制图表
      myChart.setOption(options)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      myChart.off('click')
      myChart.on('click', params => {
        //图标点击事件
        //let sersName = params.name;
        let type = params.componentType
        if (type === 'series') {
          let vo = this.cameraPlayList[params.dataIndex]
          this.getCameraAndPlayRecord(vo.id)
          this.getWeekVideoPlayCount(vo.id)
          this.getCountVideo(vo.id)
        }
      })
    },
    // 获取折线图数据 周播放量
    getWeekVideoPlayCount(appId) {
      let id = !appId ? '' : appId
      this.getWeekVideoPlayRecordCount(id).then(res => {
        if (res.code == 200) {
          let weekXyData = res.data.series
          this.seriesTotal = res.data.seriesTotal
          for (var i in weekXyData) {
            weekXyData[i].type = 'line'
            // weekXyData[i].type=
          }
          this.weekXyDataList = weekXyData
          this.legendRs =
            weekXyData && weekXyData.length
              ? weekXyData.map(item => {
                  return item.name
                })
              : []
          // if (!weekXyData) {
          //   this.flag1 = true;
          //   return;
          // }
          if (weekXyData) {
            this.weekVisable = res.data.series.length
          }

          this.appLineChart(
            'openLineChartAllApp',
            this.videoPlaytime,
            '各应用总调取量统计',
            this.legendRs,
            this.weekXyDataList
          )
        }
      })
    },
    // 总播放量
    getCountVideo(appId) {
      let id = !appId ? '' : appId
      this.getvideoPlayRecordCount(id).then(res => {
        if (res.code == 200) {
          let videoPlay = res.data.list
          this.videoSeries = res.data.totalPlayStatistics
          this.nearSeries =
            res.data.nearlySevenDaysStatistics
          this.lastWeekStatisticsRatio =
            res.data.lastWeekStatisticsRatio
          this.videoPlaycount = videoPlay.map(item => {
            return item.count
          })
          this.videoPlaytime = videoPlay.map(item => {
            return item.createDate
          })
          this.videoPlaytime[6] = {
            value: this.videoPlaytime[6],
            textStyle: {
              align: 'right'
            }
          }
          this.videoPlaytime[0] = {
            value: this.videoPlaytime[0],
            textStyle: {
              align: 'left'
            }
          }
          console.log(
            '参数223',
            videoPlay,
            this.videoPlaytime
          )
          let series = [
            {
              name: '系统总调取量',
              data: this.videoPlaycount,
              type: 'line',
              itemStyle: {
                color: '#0D75F5'
              }
            }
          ]
          this.legendRs = res.data.totalPlayStatistics
          this.$nextTick(() => {
            this.countVisable = res.data.list.length
          })
          this.appLineChart(
            'openLineChartPerApp',
            this.videoPlaytime,
            '所有应用总调取量统计',
            this.legendRs,
            series
          )
        }
      })
    },
    /**
     * 折线图
     */
    appLineChart(
      elId,
      videoPlaytime,
      chartTitle,
      legendRs,
      weekXyDataList
    ) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById(elId)
      if (!obj) {
        return false
      }
      let myChart = this.$echarts.init(obj)
      // 绘制图表
      let options = {
        title: {
          text: chartTitle,
          textStyle: {
            fontSize: 14,
            color: '#333',
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },

        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderWidth: 0,
          padding: 10,
          textStyle: {
            color: '#000'
          },
          extraCssText:
            'box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);'
          // formatter: `{b} 系统总调取量: {c}<br /> `
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          nameLocation: 'end',
          // nameLocation:"start",
          nameGap: '5',
          type: 'category',
          boundaryGap: false,
          data: videoPlaytime,
          axisLabel: {
            color: '#000'
            // interval:0,
            //   rotate:50
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f2f2f2',
              width: 1,
              type: 'solid'
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
              color: '#1274EE',
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          name: '数量',
          type: 'value',
          minorTick: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000'
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f2f2f2',
              width: 1,
              type: 'solid'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#1274EE',
              width: 1,
              type: 'solid'
            }
          }
        },
        series: weekXyDataList
      }

      if (legendRs)
        options.legend = {
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          data: legendRs,
          x: 'right'
        }
      myChart.clear() //清除canvas上一次绘制数据
      myChart.setOption(options)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.statistics-wrap {
  height: calc(100% - 20px);
  margin-bottom: 0 !important;
  .box-card {
    margin-bottom: 15px;
    .el-card__body {
      /*padding: 0;*/
      height: calc(100% - 47px);
      .echart-wrapper {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
/*.loading-wrap{text-align: center;font-size: 1rem;padding:30px;}*/
.loading-wrap i {
  font-size: 5rem;
  color: #2f9eff;
}
.loading-wrap span {
  display: block;
  line-height: 30px;
  font-size: 1.5rem;
  color: #2f9eff;
}
.temp-loading-wrap a {
  color: #333;
}
.loading-empty i {
  font-size: 5rem;
}
.loading-empty span {
  font-size: 1.2rem;
  line-height: 50px;
}
</style>
