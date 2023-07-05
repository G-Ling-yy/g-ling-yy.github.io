<template>
  <div class="content-wrapper">
    <!-- 面包屑 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>周报详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容主体 -->
    <div class="textView-wrapper">
      <h1 class="x"></h1>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="backIcon" @click="goback"></span>
          <span>{{detailTitle}}</span>
          <el-button
            type="primary"
            style="float:right;height:30px"
            @click="exportReport"
            >导出报表</el-button
          >
        </div>
        <!-- 文本容器 -->
        <div class="text_box">
          <p>各{{data.reportLevel}}接入情况总览</p>
          <div v-html="data.text" class="item">
          </div>
        </div>
        <div id="mainRight">
        <!-- 表格容器 -->
        <div class="table-wrapper">
          <div class="tablebox_top">
            <span> 各公司接入情况总览</span>
          </div>
          <div class="tablebox_body">
            <el-table :data="table" style="width: 100%" border>
              <el-table-column prop="item" label="省份\统计" width="100">
              </el-table-column>
              <el-table-column prop="newCon" label="新接入量" width="100">
              </el-table-column>
              <el-table-column label="在线统计">
                <el-table-column
                  prop="online.num"
                  label="在线数量"
                  width="120"

                ></el-table-column>
                <el-table-column prop="online.rate" label="在线率">
                </el-table-column>
                <el-table-column
                  prop="online.comparedRate"
                  label="较上周"
                >
                  <template slot-scope="scope">
                    <i
                      :class="
                        scope.row.online.comparedRate.indexOf('-')
                          ? 'rise'
                          : 'fall'
                      "
                    ></i
                    >{{
                      Math.abs(
                        scope.row.online.comparedRate.substring(
                          0,
                          scope.row.online.comparedRate.length - 1
                        )
                      ) + "%"
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="离线统计">
                <el-table-column
                  prop="offline.num"
                  label="离线发生数"
                  width="120"

                ></el-table-column>
                <el-table-column
                  prop="offline.repairedNum"
                  label="已修复离线数"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="offline.perioNum"
                  label="当前离线数"
                  width="120"

                >
                </el-table-column>
                <el-table-column prop="offline.rate" label="离线率">
                </el-table-column>
                <el-table-column
                  prop="offline.comparedRate"
                  label="较上周"
                >
                  <template slot-scope="scope">
                    <i
                      :class="
                        scope.row.offline.comparedRate.indexOf('-')
                          ? 'rise'
                          : 'fall'
                      "
                    ></i
                    >{{
                      Math.abs(
                        scope.row.offline.comparedRate.substring(
                          0,
                          scope.row.offline.comparedRate.length - 1
                        )
                      ) + "%"
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="异常统计">
                <el-table-column
                  prop="inerror.num"
                  label="异常发生数"
                  width="120"

                ></el-table-column>
                <el-table-column
                  prop="inerror.repairedNum"
                  label="已恢复数"
                  width="120"

                >
                </el-table-column>
                <el-table-column
                  prop="inerror.perioNum"
                  label="当前异常数"
                  width="120"

                >
                </el-table-column>
                <el-table-column
                  prop="inerror.rate"
                  label="异常率"
                >
                </el-table-column>
                <el-table-column
                  prop="inerror.comparedRate"
                  label="较上周"
                >
                  <template slot-scope="scope">
                    <i
                      :class="
                        scope.row.inerror.comparedRate.indexOf('-')
                          ? 'rise'
                          : 'fall'
                      "
                    ></i
                    >{{
                      Math.abs(
                        scope.row.inerror.comparedRate.substring(
                          0,
                          scope.row.inerror.comparedRate.length - 1
                        )
                      ) + "%"
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 数据可视化容器 -->
        <div class="dataVisual-wrapper" v-if="reportInfo.report_type !== 'DAILY'">
          <div class="dataVisual_top">
            <!-- <span>各省 / 各公司运维统计</span> -->
          </div>
          <div class="dataVisual_body">
            <div id="dataVisual_pie"></div>
            <div id="dataVisual_line"></div>
          </div>
        </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
import picToPdf from '../../js/picToPdf'
export default {
  data() {
    return {
      // 列表数据
      htmlTitle: '统计报表',
      table: [],
      text: "{reportDate}本省{companyNum}个路公司共接入{accessNum}路视频资源，涉及{roadNum}条路线：{roadNames}。\\n\r\n截至{expirationDate}0点，本省云平台累计接入视频{accessCount}路。视频在线率为{onlineRate}%，较前一日上升{onlineCompareRate}%。其中，在线率最高的三个公司为{highRateDepartNames}，分别为{departHighOnlineRates}；在线率最低的三个公司为{lowRateDepartNames}，分别为{departLowOnlineRates}。\\n\r\n{reportDate}摄像机异常总数为{abnormalNum}，较前一日下降{abnormalCompareRate}%；离线总数为{offlineNum}，较前一日下降{offlineCompareRate}%。需进一步排查问题，确保联网视频传输稳定。",
      // 饼状图数据
      pieChartData: [],
      pieChartDataTotal: 10,
      // 在线率
      onlineRateArr: [],
      // 离线率
      offLineRateArr: [],
      //故障率
      abnormalRateArr: [],
      // 总在线数
      onlineSum: 0,
      // 总离线数
      offLineSum: 0,
      // 总故障数
      abnormalSum: 0,
      // 文字内容
      data: {},
      report_id:Number,
      report_type:String,
      reportInfo:'',
      detailTitle: ''
    };
  },
  created() {
    this.tamp()
    this.getOperationInfo();
  },
  mounted() {
    
  },

  methods: {
    tamp(){
      //获取所有的参数（通过对象的形式返回）
          this.reportInfo = this.$router.history.current.query;
          let title = {
            DAILY: '运维日报',
            WEEKLY: '运维周报',
            MONTHLY: '运维月报',
          };
          this.detailTitle = title[this.reportInfo.report_type];
    },
    // 获取详情列表数据
    getOperationInfo() {
      let params = {
        report_id:this.reportInfo.report_id,
        report_type:this.reportInfo.report_type
      };
      api.getOperationInfo(params).then(res => {
        this.data = res.data
        this.table = res.data.table
            res.data.table.forEach((item) => {
            this.onlineSum += item.online.num; //在线数量
            this.offLineSum += item.offline.num;//离线数量
            this.abnormalSum += item.inerror.num; //故障数量
            this.onlineRateArr.push(item.online.rate);
            this.offLineRateArr.push(item.offline.rate);
            this.abnormalRateArr.push(item.inerror.rate);

            let countSum = this.onlineSum + this.offLineSum + this.abnormalSum;
            let pieChartData = [
              {
                value: this.onlineSum,
                name: `{a| 在线} {b| ${this.onlineSum}} {c| ${this.getRate(
                  this.onlineSum,
                  countSum,
                  1
                )}%}`,
                // itemStyle: {
                //   normal: {
                //     color: {
                //         type: 'linear',
                //         colorStops: [
                //             // !! 在此添加想要的渐变过程色 !!
                //             { offset: 0, color: '#76CDFF' },
                //             { offset: 1, color: '#0E98E7' }
                //         ]
                //     },
                //     borderColor: '#76CDFF',
                //     borderWidth: 1,
                //   }
                // },
                // coordinateSystem: 'polar',
	              // roundCap: true,
              },
              {
                value: this.abnormalSum,
                name: `{a| 故障} {b| ${this.abnormalSum}} {c| ${this.getRate(
                  this.abnormalSum,
                  countSum,
                  1
                )}%}`,
                // itemStyle: {
                //   normal: {
                //       color: {
                //           type: 'linear',
                //           colorStops: [
                //               // !! 在此添加想要的渐变过程色 !!
                //               { offset: 0, color: '#FDD000' },
                //               { offset: 1, color: '#FFE87B' }
                //           ]
                //       },
                //       borderColor: '#FDD000',
                //       borderWidth: 1,
                //   }
                // },
                // coordinateSystem: 'polar',
	              // roundCap: true,
              },
              {
                value: this.offLineSum,
                name: `{a| 离线} {b| ${this.offLineSum}} {c| ${this.getRate(
                  this.offLineSum,
                  countSum,
                  1
                )}%}`,
                // itemStyle: {
                //   normal: {
                //       color: {
                //           type: 'linear',
                //           colorStops: [
                //               // !! 在此添加想要的渐变过程色 !!
                //               { offset: 0, color: '#62778C' },
                //               { offset: 1, color: '#B0BECC' }
                //           ]
                //       },
                //       borderColor: '#B0BECC',
                //       borderWidth: 1,
                //   }
                // },
                // coordinateSystem: 'polar',
	              // roundCap: true,
              },
            ];
             this.leftPieChart("dataVisual_pie", pieChartData, countSum);
             this.rightLineChart("dataVisual_line", res.data.chart);
                console.log(this.onlineRateArr);
              },
              (err) => {
                console.log(err);
          });
      });
    },
    // 导出用户列表
    exportReport() {
      picToPdf.pdfExport();
      // htmlToPdf.downloadPDF( document.querySelector('.exportReport'),'日期报表');
    },
    goback() {
      this.$router.go(-1);
    },
    // 计算百分比函数
    getRate(num, baseNm, fixNm) {
      if (baseNm <= 0 || num >= baseNm) return 100;
      if (fixNm) {
        return parseFloat(((num / baseNm) * 100).toFixed(fixNm));
      }
      return parseFloat(Math.ceil((num / baseNm) * 100));
    },
    /**
     * 饼图
     */
    leftPieChart(elId, pieChartData, pieChartDataTotal) {
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }
      let that = this,
        myChart = this.$echarts.init(obj);

      let option = {
        title: {
          text: pieChartDataTotal,
          textStyle: {
            fontSize: 30,
            color: "#999",
            lineHeight: 20,
          },
          subtextStyle: {
            fontSize: 20,
            color: "#333",
          },
          textAlign: "center",
          left: "29%",
          top: "45%",
        },
        tooltip: {
          show: false,
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: "4%",
          top: "center",
          itemGap: 30,
          selectedMode: false,
          icon: "circle",
          data: pieChartData.name,
          textStyle: {
            color: "#77899c",
            rich: {
              a: {
                color: "#000",
                fontSize: 12,
                lineHeight: 16,
                width: 30,
              },
              b: {
                color: "#333",
                fontSize: 12,
                lineHeight: 16,
                width: 40,
              },
              c: {
                fontSize: 12,
                width: 30,
                color: "#333",
              },
            },
          },

          formatter: function(name) {
            return name;
          },
        },
        color: ["#0E98E7", "#F9D00E", "#62778C"],
        itemStyle:{
          show:false,
        },
        angleAxis: {
          max: 100, // 满分
          clockwise: false, // 逆时针
            // 隐藏刻度线
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
            // 隐藏刻度线
          axisLine: {
            show: false
            },
            axisTick: {
            show: false
            },
            axisLabel: {
            show: false
            },
            splitLine: {
            show: false
            }
          },
        polar: {
          center: ['50%', '50%'],
          radius: '140%' //图形大小
        },
        series: [
          {
            name: "占比率",
            type: "pie",
            radius: ["35%", "50%"],
            center: ["30%", "50%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
            },
            data: pieChartData,
            
          },
        ],
      };
      myChart.setOption(option);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    // 右侧折线图
    rightLineChart(elId, lineChartData, lineChartDataTotal) {
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }
      let myChart = this.$echarts.init(obj);
      let option = {
        color: ["#0D75F5", "#F9D00E", "#9EA5AE"],
        title: {
          text: "本月平均在线数/离线数/故障数",
          textStyle: {
            fontSize: 14,
            color: "#333",
            fontStyle: "normal",
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#ffffff",
          borderWidth: 0,
          padding: 10,
          textStyle: {
            color: "#000",
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(255,255,255)", // 0% 处的颜色
                  },
                  {
                    offset: 0.2,
                    color: "#1274EE", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "#1274EE", // 0% 处的颜色
                  },
                  {
                    offset: 0.8,
                    color: "#1274EE", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgb(255,255,255)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              }, // "#1274EE",
              type: "dashed",
            },
          },
          // 额外附加到浮层的 css 样式。如下为浮层添加阴影的示例
          extraCssText: "box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.4);",
        },
        legend: {
          data: ["在线率", "故障率", "离线率"],
          right: "4%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20"],
          axisLabel: {
            color: "#000",
          },
          axisTick: {
            lineStyle: {
              color: "#1274EE",
              width: 1,
              type: "solid",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f2f2f2",
              width: 1,
              type: "solid",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#1274EE",
              width: 1,
              type: "solid",
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f2f2f2",
              width: 1,
              type: "solid",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#000",
          },
          axisLine: {
            lineStyle: {
              color: "#1274EE",
              width: 1,
              type: "solid",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#1274EE",
              width: 1,
              type: "solid",
            },
          },
        },
        series: [
          {
            symbol: "circle",
            symbolSize: 1,
            name: "在线数",
            type: "line",

            data: [120, 132, 300, 134, 90, 230, 210],
          },
          {
            symbol: "circle",
            symbolSize: 1,
            name: "故障数",
            type: "line",

            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            symbol: "circle",
            symbolSize: 1,
            name: "离线数",
            type: "line",

            data: [150, 232, 201, 154, 190, 330, 410],
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>
<style lang="less" scoped>
.textView-wrapper {
  .box-card {
    .clearfix {
      line-height: 30px;
      .backIcon {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url("../../../assets/images/icon/goback.png");
        vertical-align: middle;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .text_box {
      .item {
        font-size: 14px;
        margin-bottom: 18px;
      }
      p {
        margin-top: 0;
        border-left: 3px solid rgba(18, 116, 238, 1);
        padding-left: 5px;
        border-radius: 2px;
      }
    }
    .table-wrapper {
      .tablebox_top {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        border-top: 1px dashed #ccc;
        span {
          margin-top: 0;
          border-left: 3px solid rgba(18, 116, 238, 1);
          padding-left: 5px;
          border-radius: 2px;
        }
      }
      .tablebox_body {
        .el-table {
          // height: 500px !important;
          .rise {
            display: inline-block;
            width: 8px;
            height: 12px;
            margin-right: 2px;
            background-image: url("../../../assets/images/icon/rise.png");
          }
          .fall {
            display: inline-block;
            width: 8px;
            height: 12px;
            margin-right: 2px;
            background-image: url("../../../assets/images/icon/descend.png");
          }
        }
      }
    }
    .dataVisual-wrapper {
      .dataVisual_top {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        span {
          margin-top: 0;
          border-left: 3px solid rgba(18, 116, 238, 1);
          padding-left: 5px;
          border-radius: 2px;
        }
      }
      .dataVisual_body {
        display: flex;
        margin-bottom: 30px;
        #dataVisual_pie {
          float: left;
          width: 35%;
          height: 400px;
          border: 1px solid #ccc;
        }
        #dataVisual_line {
          float: right;
          padding: 30px 15px;
          // width: calc(100% - 490px);
          width: 65%;
          height: 400px;
          margin-left: -2px;
          border: 1px solid #ccc;
        }
      }
    }
  }
}
</style>
