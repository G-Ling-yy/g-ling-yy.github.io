<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>摄像机统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="statistics-wrap" v-loading="getAllDataLoading">
      <el-card class="box-card" shadow="hover" style="height: 370px;">
        <div slot="header">
          <span>摄像机接入量：{{ abnormalTotal }}</span>
          <el-button
            v-if="orgViewId"
            style="padding: 3px 0;width: 20PX;height: 20px;font-size: .6rem;margin: -2px 0 0 20px;"
            type="primary"
            @click="backBarChart"
          >
            <i class="el-icon-top-left"></i>
          </el-button>
        </div>
        <!--<div v-for="o in 4" :key="o" class="text item">
          {{'列表内容 ' + o }}
        </div>-->
        <div id="openBarChart" class="echart-wrapper"></div>
      </el-card>

      <el-row :gutter="15" style="height:70%">
        <el-col :span="12" style="height: 100%;">
          <el-card class="box-card" shadow="hover" style="height: 100%;">
            <div slot="header" class="clearfix">
              <span>摄像机运行情况</span>
            </div>
            <div id="openLineChartAllApp" class="echart-wrapper-left"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="height:100%">
          <el-card class="box-card" shadow="hover" style="height: 100%;">
            <div slot="header" class="clearfix">
              <span>接入统计——按摄像机类型</span>
            </div>
            <div id="accessChartAllApp" class="echart-wrapper-right"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/**
 * 摄像机统计
 */
import { mapState, mapActions, mapMutations } from "vuex";
import loading from "../../common/Loading";
export default {
  name: "Camera",
  components: {
    loading
  },
  computed: {
    ...mapState(["provinces", "orgTreeData"])
  },
  data() {
    return {
      orgViewId: null,
      baseDataList: [],
      getAllDataLoading: true,
      abnormalTotal: 0,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
        //lazyLoad:this.propsLazyload
      },
      tableSearchData: {
        linkedRegion: "",
        orgCode: "",
        errorType: "全部",
        reportDateRs: []
      },
      // 黑屏 被遮挡 画面模糊 有闪烁 被冻结 亮度故障 有噪声 有滚动条纹
      abnormalTypeCount: [
        { name: "黑屏", value: 0 },
        { name: "被遮挡", value: 0 },
        { name: "画面模糊", value: 0 },
        { name: "有闪烁", value: 0 },
        { name: "被冻结", value: 0 },
        { name: "亮度故障", value: 0 },
        { name: "有噪声", value: 0 },
        { name: "有滚动条纹", value: 0 }
      ],
      barChartSelectPath: []
    };
  },
  mounted() {
    //this.getOrgTree();

    //console.info(this.$echarts);
    /*this.rightPieChart("openLineChartAllApp",[
        {value: 300, name: "{a| 京台高速公路廊坊管理中心} {b| 88888} {c| 100%}"},
        {value: 600, name: '{a| 京新高速公路张家口段} {b| 600} {c| 88%}'},
        {value: 900, name: '{a| 京台高速公路廊坊管理中心} {b| 900} {c| 60%}'},
        {value: 700, name: '{a| 京新高速公路张家口段} {b| 700} {c| 35%}'},
        {value: 400, name: '{a| 京台高速公路廊坊管理中心} {b| 400} {c| 22%}'},
        {value: 500, name: '{a| 其它} {b| 500} {c| 15%}'},
      ], 1800);*/

    this.getAllData();
  },
  methods: {
    ...mapActions([
      "getCodemaster",
      "getOrgTree",
      "getAllCameraRunStatisticsAction"
    ]),

    backBarChart() {
      //
      let len = this.barChartSelectPath.length,
        orgId = 0;
      if (len) {
        this.barChartSelectPath.splice(len - 1, 1);
        len = this.barChartSelectPath.length;
        if (this.barChartSelectPath[len - 1]) {
          orgId = this.barChartSelectPath[len - 1];
          //delete this.barChartSelectPath[len - 2];
        }
        //console.info("backBarChart ",this.barChartSelectPath, orgId);
        this.getAllData(orgId);
      }
    },

    getAllData(orgId) {
      let params = { organizationId: "" };
      if (orgId) params.organizationId = orgId;
      this.getAllDataLoading = true;
      this.getAllCameraRunStatisticsAction(params).then(res => {
        //console.info("getAllCameraAbnormalStatisticsAction ", res);
        this.getAllDataLoading = false;

        if (res.code === 200) {
          // 没有下级单位数据，删除查询路径最后一级；
          if (!res.data.childInfo || !res.data.childInfo.length) {
            let len = this.barChartSelectPath.length;
            this.barChartSelectPath.splice(len - 1, 1);
            if (len === 1) this.barChartSelectPath = [];
            this.$message({
              message: "该组织无下级组织",
              type: "info"
            });
            return false;
          }
          this.orgViewId = orgId;
          //this.barChartSelectPath.push(orgId);

          this.abnormalTotal = res.data.total;
          let orgList = res.data.childInfo,
            xAxisList = [],
            seriesData = [];
          this.baseDataList = orgList;
          // this.baseDataList[0] = {
          //     value: this.baseDataList[0],
          //     textStyle: {
          //       align: 'left'
          //     }
          //   }
          console.log(this.baseDataList,"this.baseDataList")
          // 柱状图数据
          if (orgList.length) {
            orgList.forEach(vo => {
              xAxisList.push(vo.name);
              seriesData.push(vo.total);
            });
          }
          this.openBarChartInit("openBarChart", "", {
            xAxis: xAxisList,
            series: seriesData
          });

          // 饼图数据
          let pieData = [
            {
              value: res.data.offline,
              name: `{a| 离线} {b| ${res.data.offline}} {c| ${this.getRate(
                res.data.offline,
                res.data.total,
                1
              )}%}`
            },
            {
              value: res.data.inerror,
              name: `{a| 故障} {b| ${res.data.inerror}} {c| ${this.getRate(
                res.data.inerror,
                res.data.total,
                1
              )}%}`
            },
            {
              value: res.data.online,
              name: `{a| 在线} {b| ${res.data.online}} {c| ${this.getRate(
                res.data.online,
                res.data.total,
                1
              )}%}`
            }
          ];
          this.rightPieChart("openLineChartAllApp", pieData, res.data.total);

          let classifyList = JSON.parse(JSON.stringify(res.data.classifyInfo)),
            classifyPieData = this.checkPieData(classifyList, res.data.total);
          this.rightPieChart(
            "accessChartAllApp",
            classifyPieData,
            res.data.total,
            true
          );
        }
      });
    },

    getRate(num, baseNm, fixNm) {
      if (baseNm <= 0 || num >= baseNm) return 100;
      if (fixNm) {
        return parseFloat(((num / baseNm) * 100).toFixed(fixNm));
      }
      return parseFloat(Math.ceil((num / baseNm) * 100));
    },

    checkPieData(newList, total) {
      let pieData = [],
        top5TErrorTotal = 0,
        errorTypeData = [],
        len = newList.length;

      if (len) {
        newList.sort((a, b) => b.inerror - a.inerror);
        for (let i = 0; i < len; i++) {
          if (!newList[i]) break;
          let nm = newList[i].total;
          top5TErrorTotal += nm;
          pieData.push({
            value: nm,
            name: `{a| ${newList[i].name}} {b| ${nm}} {c| ${this.getRate(
              nm,
              total,
              1
            )}%}`
          });
          //console.info("wvwvwvwv     ",newList[i].name, nm, res.data.inerror, Math.ceil(nm / res.data.inerror * 100));
        }
        /*let otherErrorNm = total - top5TErrorTotal;
          if(newList.length > 5){
            pieData.push({
              value: otherErrorNm,
              name: `{a| 其它} {b| ${otherErrorNm}} {c| ${this.getRate(otherErrorNm, inerror)}%}`,
            });
          }*/
      }

      return pieData;
    },

    // 页码处理
    handleSizeChange(sizeVal) {
      console.log(sizeVal);
      this.pageSize = sizeVal;
    },
    handleCurrentChange(curPage) {
      this.currentPage = curPage;
      //this.tableData = this.roleList.roleList.slice((curPage - 1) * this.pageSize , curPage * this.pageSize);
    },
    queryList() {
      this.pageSize = 10;
      this.currentPage = 1;
    },
    resetSerach() {},
    abnormalTypeProgressColor(percentage) {
      if (percentage < 30) {
        return "#909399";
      } else if (percentage < 70) {
        return "#e6a23c";
      } else {
        return "#67c23a";
      }
    },
    abnormalTypeProgressFormat(percentage) {
      return percentage === 100 ? "满" : percentage; //`${percentage}`;
    },
    /**
     * 柱状图
     */
    openBarChartInit(elId, chartTitle, chartData) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }

      let baseSer = [],
        max = Math.max.apply(Math, chartData.series);
      chartData.series.forEach(() => {
        baseSer.push(max);
      });

      let myChart = this.$echarts.init(obj),
        labelOption = {
          show: true,
          position: "top",
          distance: 10,
          align: "center",
          verticalAlign: "bottom",
          rotate: 0,
          formatter: "{c}", // '{c}  {name|{a}}'
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: "#fff"
            }
          }
        },
        options = {
          title: {
            text: chartTitle,
            textStyle: {
              fontSize: 14,
              color: "#333",
              fontStyle: "normal",
              fontWeight: "normal"
            }
          },
          tooltip: {
            trigger: "axis",
            backgroundColor: "#ffffff",
            borderWidth: 0,
            padding: 10,
            textStyle: {
              color: "#000"
            },
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(0, 0, 0, 0.1)"
              }
            },
            extraCssText: "box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);"
          },
          /*legend:[
              {
                icon: "none",
                itemWidth : 8,
                itemHeight: 8,
                data: ['故障数'],
                x: "left",
                textStyle: {
                  color: "#000",
                }
              },
              {
                icon: "circle",itemWidth : 8, itemHeight: 8,
                data: ['视频调取数'],
                x: "right",
                textStyle: {
                  color: "#000",
                }
              }
            ],*/
          grid: {
            top: "30px",
            left: "5%",
            right: "5%",
            bottom: "0%",
            containLabel: true
          },
          xAxis: {
            name:"组织",
            type: "category",
            // nameLocation:"start",
            data: chartData.xAxis,
            /*[
                '京台高速公路廊坊管理中心',
                '京新高速公路张家口段',
                '京昆高速京冀界至涞水段',
                '京台高速公路廊坊管理中心',
                '京新高速公路张家口段',
                '京昆高速京冀界至涞水段',
                '京台高速公路廊坊管理中心',
                '京新高速公路张家口段'
              ],*/
            axisLabel: {
              color: "#000",
            //   interval:0,//横轴信息全部显示    
            // rotate:-15,//-15度角倾斜显示  
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
          },
          yAxis: {
            name:"数量",
            type: "value",
            minorTick: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#000"
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: "#f2f2f2",
                width: 1,
                type: "solid"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#1274EE",
                width: 1,
                type: "solid"
              }
            }
          },
          color: ["#FDAD00", "#1274EE"],
          series: [
            //不知道为啥会有这段代码，先应测试要求先去掉，后面有需要再加上
            // {
            //   // For shadow
            //   type: "bar",
            //   itemStyle: {
            //     color: "rgba(0,0,0,0)"
            //   },
            //   barGap: "-100%",
            //   barCategoryGap: "40%",
            //   data: baseSer,
            //   animation: false
            // },
            {
              label: labelOption,
              barWidth: 20,
              name: "接入数",
              type: "bar",
              itemStyle: {
                barBorderRadius: [20, 20, 0, 0],
                emphasis: {
                  /*text: pieChartDataTotal + 10000000,*/
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                },
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#FDAD00" },
                  { offset: 1, color: "#FFD16D" }
                ])
              },
              data: chartData.series // [320, 332, 301, 334, 500, 330, 320, 286]
            }
          ]
        };

      //console.info('myChart ', myChart);
      // 绘制图表
      myChart.setOption(options);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      myChart.off("click");
      myChart.on("click", params => {
        //let sersName = params.name;
        console.info("click", params);
        let type = params.componentType;
        if (type === "series") {
          let vo = this.baseDataList[params.dataIndex];
          console.log(vo,"vovo")
          this.barChartSelectPath.push(vo.id);
          //that.cameraStatusSelectClick(s.indexOf(params.name.split(' ')[0]) + '');/**/
          this.getAllData(vo.id);
        }
      });
    },

    /**
     * 饼图
     */
    rightPieChart(elId, pieChartData, pieChartDataTotal, fullpie) {
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }
      let that = this,
        myChart = this.$echarts.init(obj);

      myChart.setOption({
        tooltip: {
          show: false,
          trigger: "item",
          //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        /*graphic: {
              type: 'text',
              left: "center",
              top: 'center',
              //z: 2,
              zlevel: 100,// 显示层级
              style: {
                  text: pieChartDataTotal,
                  textAlign: 'center',
                  //position: 'center',
                  fill: '#ffffff',
                  font: '18px Microsoft YaHei'
              }
          },*/
        legend: {
          orient: "vertical",
          left: "65%",
          top: "center",
          align: "left",
          data: pieChartData.name,
          padding: [0, 20],
          selectedMode: true,
          itemWidth: 20,
          itemHeight: 10,
          icon: "circle",
          inactiveColor: "#cdc1c8",
          itemGap: 20,
          /*textStyle: {
              fontSize: 12,
              color: '#000',
              width: 80
            },*/
          tooltip: {
            show: false
          },
          textStyle: {
            rich: {
              a: {
                color: "#000",
                fontSize: 12,
                lineHeight: 16,
                width: 50
              },
              b: {
                color: "#333",
                fontSize: 12,
                lineHeight: 16,
                width: 40,
                align: "right"
              },
              c: {
                fontSize: 12,
                width: 30,
                color: "#333"
              }
            }
          }
        },
        title: {
          show: !fullpie,
          text: pieChartDataTotal,
          //subtext: datasubtext[0],
          left: "29%",
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
            //coordinateSystem: 'polar',
            roundCap: true,
            name: "摄像机统计",
            type: "pie",
            radius: fullpie ? ["0%", "50%"] : ["40%", "50%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            //hoverAnimation: false,
            //legendHoverLink: false,
            silent: false,
            label: {
              normal: {
                show: false
              }
              /*normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                }*/
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                /*text: pieChartDataTotal + 10000000,*/
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              color: function(params) {
                /*let colorList = [
                    'rgba(195,88,50,1)',// #FF5756
                    'rgba(203,196,46,1)',// #FF8700
                    'rgba(17,199,192,1)',// #EFD638
                    'rgb(7,115,158)',// #7DC82C
                    'rgb(6,162,255)',// #12C64F
                    'rgb(13,255,0)',// #28C7DD
                    'rgb(255,0,176)',// #3175FA
                    'rgba(150,154,171,1)',// #845EFB
                    'rgba(150,154,171,1)'// #ABBFC8
                  ], startColorList = [
                    'rgba(195,88,50,0.4)',
                    'rgba(203,196,46,0.4)',
                    'rgba(17,199,192,0.4)',
                    'rgba(7,179,235,0.4)',
                    'rgba(17,119,246,0.4)',
                    'rgba(13,255,0,0.4)',
                    'rgba(255,0,176,0.4)',
                    'rgba(150,154,171,0.4)'
                  ];*/
                let colorList = [
                  "#FF5756", // #FF5756
                  "#FF8700", // #FF8700
                  "#EFD638", // #EFD638
                  "#7DC82C", // #7DC82C
                  "#12C64F", // #12C64F
                  "#28C7DD", // #28C7DD
                  "#3175FA", // #3175FA
                  "#845EFB", // #845EFB
                  "#ABBFC8" // #ABBFC8
                ];
                return colorList[params.dataIndex];
                /*return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [//{
                      //     offset: 0, color: 'red' // 0% 处的颜色
                      // },
                      {offset: 0, color: colorList[params.dataIndex] // 0% 处的颜色
                      },
                      //  {offset: 0.5, color: 'green' // 0% 处的颜色
                      //  },
                      {
                        offset: 0.8, color: startColorList[params.dataIndex] // 100% 处的颜色
                      }],
                    globalCoord: false // 缺省为 false
                  };*/
              }
            },
            data: pieChartData
          }
        ]
      });

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
};
</script>

<style lang="less">
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
      .echart-wrapper-left,.echart-wrapper-right {
        width: 80%;
        height: 80%;
      }
      .abnormal-type-progress {
        margin-bottom: 15px;
        .el-progress-bar__outer {
          overflow: visible;
          background: transparent;
          .el-progress-bar__innerText {
            position: absolute;
            color: #000;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      .table-wrapper {
        height: auto;
        margin-top: -20px;
        .search-wrapper {
          padding: 20px 0 0;
          > .el-form {
            float: left;
          }
          > .el-button {
            float: right;
          }
        }
      }
    }
  }
}
</style>
