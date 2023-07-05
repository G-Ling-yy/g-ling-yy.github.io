<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>调取统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="statistics-wrap" v-loading="getAllDataLoading">
      <el-card class="box-card" shadow="hover" style="height: 370px;">
        <div slot="header">
          <!-- <span>摄像机接入量：{{ abnormalTotal }}</span> -->
          <span>视频调取量统计</span>
          <el-button
            v-if="orgViewId"
            style="padding: 3px 0;width: 20PX;height: 20px;font-size: .6rem;margin: -2px 0 0 20px;"
            type="primary"
            @click="backBarChart"
          >
            <i class="el-icon-top-left"></i>
          </el-button>
        </div>
        <div id="openBarChart" class="echart-wrapper"></div>
      </el-card>

      <el-row :gutter="15" style="height:300px">
        <el-col :span="12" style="height: 100%;">
          <el-card class="box-card" shadow="hover" style="height: 100%;">
            <div slot="header" class="clearfix">
              <span>各单位被访问量占比</span>
            </div>
            <div id="accessChartAllApp" class="echart-wrapper"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="height:100%">
          <el-card class="box-card" shadow="hover" style="height: 100%;">
            <div slot="header" class="clearfix">
              <span>访问量来源统计</span>
            </div>
            <div id="openLineChartAllApp" class="echart-wrapper"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 调取统计列表详情 -->
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <div>
            <span>调取统计列表</span>
          </div>
        </div>
        <div class="table-wrapper" style="width:100%">
          <div
            class="search-wrapper clearfix abnormal-search"
            style="width:100%;height:100%"
          >
            <el-form
              :inline="true"
              v-model="tableSearchData"
              style="width:100%"
            >
              <!-- <el-form-item label="途径省份:">
                <el-select
                  clearable
                  filterable
                  style="width: 100px;"
                  v-model="tableSearchData.regionCode"
                  placeholder="请选择"
                >
                  <el-option
                    style="width: 100px;"
                    v-for="item in provinces"
                    :key="item.regionCode"
                    :label="item.regionName"
                    :value="item.regionCode + ''"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="调取人">
                <el-input
                  v-model="tableSearchData.username"
                  style="width:170px"
                  placeholder="请输入名称"
                  clearable
                ></el-input>
                <!-- <el-select
                  placeholder="调取人"
                  style="width: 150px;"
                  v-model="tableSearchData.userName"
                >
                  <el-option value>全部</el-option>
                  <el-option
                    style="width: 150px;"
                    v-for="(vo, idx) in abnormalTypeCount"
                    :key="idx"
                    :label="vo.name"
                    :value="vo.code"
                  ></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="管辖单位:">
                <el-cascader
                  v-model="jurisdictionValue"
                  clearable
                  filterable
                  :show-all-levels="false"
                  :options="orgTreeList"
                  :props="orgCodeProps"
                  style="width: 150px;"
                  change-on-select
                ></el-cascader>
                <!-- @change="orgChange"
                  @clear="orgChange" -->
              </el-form-item>

              <el-form-item label="上报时间">
                <el-date-picker
                  v-model="tableSearchData.reportDateRs"
                  size="mini"
                  class="gd-custom-date-picker"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="IP:">
                <el-input
                  v-model="tableSearchData.IP"
                  style="width:170px"
                  placeholder="请输入访问IP地址"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="query"
                  style="margin-left: 25px;"
                  @click="queryList"
                  >查询</el-button
                >
                <el-button type="primary" class="reset" @click="resetSerach"
                  >重置</el-button
                >
                <el-button type="primary" plain class="query" @click="exportAbnormalList">数据导出</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="table-content-body">
            <el-table
              class="custom-cloud-table"
              ref="multipleTable"
              :data="tableListData"
              border
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              ></el-table-column>
              <el-table-column prop="regionName" label="地区"></el-table-column>
              <el-table-column
                prop="cameraName"
                label="摄像机名称"
              ></el-table-column>
              <el-table-column prop="username" label="调取人"></el-table-column>
              <el-table-column
                prop="organizationName"
                label="所属单位"
              ></el-table-column>
              <el-table-column prop="ip" label="访问IP地址"></el-table-column>
              <el-table-column
                prop="playDateTime"
                label="调取时间"
                width="160"
              ></el-table-column>
              <!-- <el-table-column
                prop="time"
                label="调取时长"
                width
              ></el-table-column> -->
            </el-table>
          </div>
          <!-- <div class="table-pagination" v-show="showPagination"> -->
          <div class="table-pagination">
                <p class="total-pagination">共{{tableTotal}}条</p>
            <el-pagination
              background
              layout=" prev, pager, next, sizes, jumper "
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="tableTotal"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
/**
 * 摄像机统计
 */
import { mapState, mapActions, mapMutations } from "vuex";
import loading from "../../common/Loading";
import util from "../../../filters/utils";
export default {
  name: "Camera",
  components: {
    loading
  },
  computed: {
    ...mapState([
      "provinces",
      "orgTreeData",
      "deviceStatistics",
      "UserOrgTreeChild"
    ])
  },
  data() {
    return {
      jurisdictionValue:"",
      orgViewId: null,
      baseDataList: [],
      getAllDataLoading: true,
      abnormalTotal: 0,
      tableTotal:0,
      tableListData: [],
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
        IP: "",
        username: "",
        linkedRegion: "",
        orgCode: "",
        reportDateRs: [],
      },
      barChartSelectPath: [],
      orgTreeList: []
    };
  },
  mounted() {
    this.getAllData();
    this.getTime();
    this.recentTime();
    this.getSourceAll();
    this.getRegionAll();
    this.getPlayRecordLists();
    this.queryOrgList()

  },
  methods: {
    ...mapActions([
      "getCodemaster",
      "getOrgTree",
      // "getAllCameraRunStatisticsAction",
      "getCountDaily",
      "getSourceStatistics",
      "getRegionStatistics",
      "getPlayRecordList"
    ]),
    //获取当前时间
    getTime() {
      this.nowtime = new Date();
      console.log("nowtime: ", this.nowtime);
    },
    //前7天日期
    recentTime() {
      let myDate = new Date(); // 获取今天日期
      myDate.setDate(myDate.getDate() - 6);
      let dayList = [];
      let dateTemp;
      let flag = 1;

      for (var i = 0; i < 7; i++) {
        myDate.setDate(myDate.getDate());
        let MM = myDate.getMonth();
        let day = myDate.getDate();
        let hh = myDate.getHours();
        let mm = myDate.getMinutes();
        let ss = myDate.getSeconds();
        if (MM < 10) {
          MM = "0" + MM;
        }
        if (day < 10) {
          day = "0" + day;
        }
        if (hh < 10) {
          hh = "0" + hh;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
        if (ss < 10) {
          ss = "0" + ss;
        }
        dateTemp =
          (myDate.getMonth() + 1) +
          "-" +
          day ;
        // dateTemp = ;
        dayList.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
      }
      return dayList;
    },
    timeFormat(time) {
      var d;
      if ("string" == typeof time) {
        d = new Date(time.substr(0, 19)); //加入substr(0, 19)处理兼容ios报错NAN
      } else {
        d = time;
      }
      var year = d.getFullYear(); //年
      var month = d.getMonth() + 1; //月
      var day = d.getDate(); //日
      var hh = d.getHours(); //时
      var mm = d.getMinutes(); //分
      var ss = d.getSeconds(); //秒
      var clock = year + "-";
      if (month < 10) clock += "0";
      clock += month + "-";
      if (day < 10) clock += "0";
      clock += day + " ";
      if (hh < 10) clock += "0";
      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";
      if (ss < 10) clock += "0";
      clock += ss;
      return clock;
    },
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
        this.getAllData(orgId);
      }
    },
    //获取表格数据
    getPlayRecordLists(){
      let params = {};
      params = {
          currPage: this.currentPage,
          pageSize: this.pageSize,
          provinceCode:this.tableSearchData.regionCode,          
          ip:this.tableSearchData.IP,
          playUsername:this.tableSearchData.username,
          endTime: this.tableSearchData.reportDateRs[1],
          startTime: this.tableSearchData.reportDateRs[0],
          // organizationId:this.jurisdictionValue
          organizationId: this.jurisdictionValue[this.jurisdictionValue.length - 1],

      };
      this.getPlayRecordList(params).then(res=>{
        if(res.code === 200){
          this.tableListData = res.data.list,
          this.tableTotal = res.data.total
        }
      })
    },
      queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree(params)
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data[0].childList;
          _.each(nlist, it => {
            it.disabled = true;
          });
          _this.orgTreeList = nlist;
        })
        .catch(error => {
          this.$message({
            message:
              "获取组织架构树失败! [" + error.code + "]: " + error.message,
            type: "error"
          });
        });
    },
    // 获取数据来源信息
    getSourceAll(){
      let params = {};
      this.getAllDataLoading = true;
      this.getSourceStatistics(params).then(res=>{
        this.getAllDataLoading = false;
        if(res.code === 200){
          let sourceData = res.data;
          res.data.forEach((it)=>{it.value=it.count})
          this.leftPieChart("openLineChartAllApp", "各区域访问量占比-饼图", {
            series: res.data
          });
        }
      })
    },
    // 获取区域信息
    getRegionAll(){
      let params = {};
      this.getAllDataLoading = true;
      this.getRegionStatistics(params).then(res=>{
        this.getAllDataLoading = false;
        if(res.code === 200){
          let sourceData = res.data;
          res.data.forEach((it)=>{it.value=it.count})
          this.rightPieChart("accessChartAllApp", "区域-饼图", {
            series: res.data
          });
        }
      })
    },
    //获取调取数据
    getAllData() {
     let myDate = new Date();
      myDate.setTime(myDate.getTime()-1);
      let dateTemp;
      let endDay;
      let offset=0;
      var perDay=new Date();
      perDay.setTime(myDate.getTime()-1);
      perDay.setDate(perDay.getDate()-6)
      dateTemp =util.date('Y-m-d H:i:s',perDay);
      endDay = util.date('Y-m-d H:i:s',myDate);
      let params = {
        startDate: dateTemp,
        endDate: endDay
      };
      console.log(params,"params")
      this.getAllDataLoading = true;
      this.getCountDaily(params).then(res => {
        this.getAllDataLoading = false;
        if (res.code === 200) {
          this.abnormalTotal = res.data.total;
          let orgList = res.data,
            xAxisList = [],
            seriesData = [];
          this.baseDataList = orgList;

          this.openBarChartInit("openBarChart", "视频调用量统计", {
            xAxis: this.recentTime(),
            series: res.data.series
          });
        }
      });
    },

    // getRate(num, baseNm, fixNm) {
    //   if (baseNm <= 0 || num >= baseNm) return 100;
    //   if (fixNm) {
    //     return parseFloat(((num / baseNm) * 100).toFixed(fixNm));
    //   }
    //   return parseFloat(Math.ceil((num / baseNm) * 100));
    // },

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
      this.getPlayRecordLists();
    },
    handleCurrentChange(curPage) {
      this.currentPage = curPage;
      this.getPlayRecordLists();
      //this.tableData = this.roleList.roleList.slice((curPage - 1) * this.pageSize , curPage * this.pageSize);
    },
    queryList() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.getPlayRecordLists();
    },
    resetSerach() {
      this.tableSearchData.IP = "",
      this.tableSearchData.username = "",
      this.tableSearchData.reportDateRs = "",
      this.tableSearchData.regionCode = "",
      this.jurisdictionValue = "",
      this.currentPage = 1;
      this.getPlayRecordLists()
    },
    

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
     * 折线图
     */
    openBarChartInit(elId, chartTitle, chartData) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }

      let baseLend = [],
        max = Math.max.apply(Math, chartData.series);
      chartData.series.forEach(it => {
        it.type = "line";
        it.smooth = true ;
        it.areaStyle = {
        },
        baseLend.push(it.name);
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
          legend: { data: baseLend },
         
          grid: {
            top: "80px",
            left: "0%",
            right: "5%",
            bottom: "0%",
            containLabel: true
          },
          xAxis: {
            name:"日期",
            type: "category",
            data: chartData.xAxis,
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
          series: chartData.series
        };

      //console.info('myChart ', myChart);
      // 绘制图表
      console.log("chart option", options);
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
          this.barChartSelectPath.push(vo.id);
          //that.cameraStatusSelectClick(s.indexOf(params.name.split(' ')[0]) + '');/**/
          this.getAllData(vo.id);
        }
      });
    },

    //右侧饼图
    leftPieChart(eleId, title, pieChartLeftData, fullpie) {
      let obj = document.getElementById(eleId);
      if (!obj) {
        return false;
      }
    console.log(pieChartLeftData)
    var legendData=[];
    pieChartLeftData.series.forEach((it)=>{
      legendData.push(it.name)
    })
      let that = this,
        myChart = this.$echarts.init(obj);

      myChart.setOption({
        tooltip: {
          trigger: "item",
          //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        
        legend: {
          selectedMode: true,
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        itemWidth: 24,   // 设置图例图形的宽
        itemHeight: 18,  // 设置图例图形的高
        bottom: 20,
        data: legendData,
        },
        series: [
          {
            roundCap: true,
            name: "访问来源",
            type: "pie",
            radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
            center: ['50%', '30%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            avoidLabelOverlap: false,
            silent: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              color: function(params) {
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
                return {
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
                  };
              }
            },
            data:pieChartLeftData.series
          }
        ]
      });

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    
    // 左侧饼图
    rightPieChart(elId, title, pieChartData, fullpie) {
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }
    console.log(pieChartData)
    var legend_data=[];
    pieChartData.series.forEach((it)=>{
      legend_data.push(it.name)
    })
      let that = this,
        myChart = this.$echarts.init(obj);

      myChart.setOption({
        tooltip: {
          trigger: "item",
          //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        
        legend: {
          selectedMode: true,
        type: 'scroll',
        orient: 'vertical',
        right: 0,
        top: 20,
        bottom: 20,
        data: legend_data,
        },
        series: [
          {
            roundCap: true,
            name: "访问来源",
            type: "pie",
            radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
            center: ['30%', '30%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            avoidLabelOverlap: false,
            silent: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              color: function(params) {
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
                return {
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
                  };
              }
            },
            data:pieChartData.series
          }
        ]
      });

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    //数据导出
    exportAbnormalList() {
      var obj = {};
      this.$api
        .exportPlayRecord(obj)
        .then((data) => {
          var blob = new Blob([data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "调取统计列表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          this.$message({
            message: "摄像机导出失败! ",
            type: "error",
          });
        });
    },
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
