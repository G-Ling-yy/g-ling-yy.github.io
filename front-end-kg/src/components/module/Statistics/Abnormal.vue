<template>
  <div class="content-wrapper" id="viewBox" ref="viewBox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>异常统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="statistics-wrap" v-loading="getAllDataLoading">
      <el-card class="box-card" shadow="hover" style="height: 370px">
        <div slot="header">
          <span>故障数：{{ abnormalTotal }}</span>
          <el-button
            v-if="orgIdView"
            style="
              padding: 3px 0;
              width: 20px;
              height: 20px;
              font-size: 0.6rem;
              margin: -2px 0 0 20px;
            "
            type="primary"
            @click="backBarChart"
          >
            <i class="el-icon-top-left"></i>
          </el-button>
        </div>
        <div id="openBarChart" class="echart-wrapper"></div>
      </el-card>

      <!-- <el-card class="box-card" shadow="hover" style="height: 370px;">
        <div slot="header">
          <span>故障数：{{ abnormalTotal }}</span>
        </div>
        <div id="box2"></div>
      </el-card> -->

      <el-row :gutter="15">
        <el-col :span="12" style="height: 370px">
          <el-card class="box-card" shadow="hover" style="height: 370px">
            <div slot="header" class="clearfix">
              <span>
                各单位故障占比
                <small
                  style="
                    display: inline-block;
                    margin-left: 10px;
                    color: #dd6161;
                  "
                  >TOP 5</small
                >
              </span>
            </div>

            <div id="openLineChartAllApp" class="echart-wrapper"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="height: 100%">
          <el-card class="box-card" shadow="hover" style="height: 370px">
            <div slot="header" class="clearfix">
              <span>故障类型统计</span>
            </div>
            <!-- 故障类型统计 -->
            <div class="echart-content">
              <div
                id="myChart"
                :style="{ width: '600px', height: '300px' }"
              ></div>
            </div>
            <!-- <el-row
              v-for="(vo, idx) in abnormalTypeCount"
              :key="idx"
              class="abnormal-type-progress"
            >
              <el-col :span="4">{{ vo.errorName | abnormalFilters }}</el-col>
              <el-col :span="19">
                <div class="rightChart">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="8"
                    :percentage="vo.number"
                    :color="abnormalTypeProgressColor"
                    :format="abnormalTypeProgressFormat"
                  ></el-progress>
                </div>
              </el-col>
            </el-row> -->
          </el-card>
        </el-col>
      </el-row>

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <div>
            <span>故障列表</span>
          </div>
        </div>
        <div class="table-wrapper" style="width: 100%">
          <div
            class="search-wrapper clearfix abnormal-search"
            style="width: 100%"
          >
            <el-form
              :inline="true"
              v-model="tableSearchData"
              style="width: 100%"
            >
              <!-- <el-form-item label="途径省份:"   v-if="uinfo.regionCode == 100000 ? true : false">
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
              <el-form-item label="错误类型">
                <el-select
                  placeholder="错误类型"
                  style="width: 150px"
                  v-model="tableSearchData.errorType"
                >
                  <el-option value>全部</el-option>
                  <el-option
                    style="width: 150px"
                    v-for="(vo, idx) in abnormalTypeSelect"
                    :key="idx"
                    :label="vo.name"
                    :value="vo.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="管辖单位:">
                <el-cascader
                  v-model="jurisdictionValue"
                  clearable
                  filterable
                  :show-all-levels="false"
                  :options="UserOrgTreeChild"
                  :props="orgCodeProps"
                  style="width: 150px"
                  change-on-select
                  @change="orgChange"
                  @clear="orgChange"
                ></el-cascader>
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
              <el-form-item>
                <el-button
                  type="primary"
                  class="query"
                  style="margin-left: 25px"
                  @click="queryList"
                  >查询</el-button
                >
                <el-button type="primary" class="reset" @click="resetSerach"
                  >重置</el-button
                >
                <el-button
                  type="primary"
                  plain
                  class="query"
                  @click="exportAbnormalList"
                  >数据导出</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <div class="table-content-body">
            <el-table
              class="custom-cloud-table"
              ref="multipleTable"
              :data="deviceStatistics.cameraAbnormalList"
              border
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              ></el-table-column>
              <el-table-column
                prop="cameraName"
                label="摄像机名称"
              ></el-table-column>
              <el-table-column
                prop="createTime"
                label="故障上报时间"
                width="160"
              >
                <template slot-scope="scoped">
                  {{
                    Utils.date("Y-m-d H:i:s", new Date(scoped.row.createTime))
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="astatus" label="故障类型" width>
                <template slot-scope="scoped">{{
                  checkCameraErrorInfo(scoped.row)
                }}</template>
              </el-table-column>
              <!--<el-table-column prop="name" label="管辖单位" width="120"></el-table-column>
              <el-table-column prop="province" label="所属路线" width="120"></el-table-column>
              <el-table-column prop="city" label="摄像机名称" ></el-table-column>
              <el-table-column prop="address" label="桩号" width="300"></el-table-column>
              <el-table-column prop="address" label="故障类型" width="300"></el-table-column>
              <el-table-column prop="date" label="故障上报时间" width="300"></el-table-column>-->
            </el-table>
          </div>
          <div class="table-pagination">
                <p class="total-pagination">共{{deviceStatistics.cameraAbnormalTotal}}条</p>
            <el-pagination
              background
              layout=" prev, pager, next, sizes, jumper "
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="deviceStatistics.cameraAbnormalTotal"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
/**
 * 故障统计
 */
import { mapState, mapActions, mapMutations } from "vuex";
import loading from "../../common/Loading";
import api from "../../../api";
export default {
  name: "Abnormal",
  components: {
    loading,
  },
  computed: {
    ...mapState([
      "provinces",
      "UserOrgTreeChild",
      "deviceStatistics",
      "userInfo",
    ]),
  },
  data() {
    return {
      uinfo: {
        regionCode: JSON.parse(localStorage.getItem("cloudplatform"))
          .regionCode,
      },
      showPagination: false,
      // box: "",
      orgIdView: null,
      baseDataList: [],
      getAllDataLoading: true,
      abnormalTotal: 0,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      jurisdictionValue: "", //管辖
      cascaderProps: {
        value: "id",
        label: "orgName",
        children: "children",
      },
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true,
        //lazyLoad:this.propsLazyload
      },
      tableSearchData: {
        regionCode: "",
        organizationId: "",
        errorType: "",
        reportDateRs: [],
        createDateEnd: "",
        createDateStart: "",
        //cameraName: "",
        //cameraType: null,
        //roadId: 100
      },
      // 黑屏 被遮挡 画面模糊 有闪烁 被冻结 亮度故障 有噪声 有滚动条纹
      abnormalTypeCount: [
        // { name: "摄像机不在线", code: "a", value: 0 },
        // { name: "信号丢失,黑屏", code: "b", value: 0 },
        // { name: "图像被遮挡", code: "c", value: 0 },
        // { name: "图像模糊", code: "d", value: 0 },
        // { name: "亮度故障", code: "e", value: 0 },
        // { name: "图像冻结", code: "f", value: 0 },
        // { name: "有噪声", code: "g", value: 0 },
        // { name: "有闪烁", code: "h", value: 0 },
        // { name: "有滚动条纹", code: "i", value: 0 }
      ],
      abnormalTypeSelect: [
        { name: "网络异常", code: "a", value: 0 },
        { name: "信号丢失,黑屏", code: "b", value: 0 },
        { name: "图像被遮挡", code: "c", value: 0 },
        { name: "图像模糊", code: "d", value: 0 },
        { name: "亮度故障", code: "e", value: 0 },
        { name: "图像冻结", code: "f", value: 0 },
        { name: "有噪声", code: "g", value: 0 },
        { name: "有闪烁", code: "h", value: 0 },
        { name: "有滚动条纹", code: "i", value: 0 },
      ],
      abnormalTypeCheck: {
        astatus: "摄像机不在线",
        bstatus: "信号丢失,黑屏",
        cstatus: "图像被遮挡",
        dstatus: "图像模糊",
        estatus: "亮度故障",
        fstatus: "图像冻结",
        gstatus: "有噪声",
        hstatus: "有闪烁",
        istatus: "有滚动条纹",
      },
      barChartSelectPath: [],
    };
  },
  filters: {
    abnormalFilters(value) {
      let errorTypeVal = "";
      switch (value) {
        case "aTotal":
          errorTypeVal = "摄像机不在线";
          break;
        case "bTotal":
          errorTypeVal = "信号丢失,黑屏";
          break;
        case "cTotal":
          errorTypeVal = "图像被遮挡";
          break;
        case "dTotal":
          errorTypeVal = "图像模糊";
          break;
        case "eTotal":
          errorTypeVal = "亮度故障";
          break;
        case "fTotal":
          errorTypeVal = "图像冻结";
          break;
        case "gTotal":
          errorTypeVal = "有噪声";
          break;
        case "hTotal":
          errorTypeVal = "有闪烁";
          break;
        case "iTotal":
          errorTypeVal = "有滚动条纹";
          break;
      }
      return errorTypeVal;
    },
  },
  mounted() {
    this.drawLine();
    // this.getOrgTree();
    this.getUserOrganization();
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

    this.queryTableData(1);
    document.addEventListener("scroll", this.handleScroll, true);
    // this.scrollListener();
    // let box = this.$refs.viewBox;
    // // 监听这个dom的scroll事件
    // this.box.addEventListener(
    //   "scroll",
    //   () => {
    //     console.log(this.$refs.viewBox.scrollTop);
    //   },
    //   false
    // );
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.handleScroll, true); //监听页面滚动事件
  },
  methods: {
    ...mapActions([
      "playCount",
      "getOrgTree",
      "getCodemaster",
      "getUserOrganization",
      "getAllCameraAbnormalStatisticsAction",
      "getAllCameraAbnormalListAction",
    ]),
    //故障类型统计
    drawLine(p) {
      var j =[]
      var d =[]
      // console.log(p,"ppppppp")
      var _this=this;
      if(p){
        for(var k in this.abnormalTypeSelect){
          var ats=_this.abnormalTypeSelect[k];
          _this.abnormalTypeSelect[k].value=p[ats.code+"total"]
        }
      }
      // for(var i in this.abnormalTypeSelect){
      for(var i= this.abnormalTypeSelect.length-1;i>=0;i--){
        var aname=_this.abnormalTypeSelect[i];
          j.push(aname.name)
          d.push(aname.value)
      }
      // console.log(j,"jjjjj")
      // console.log(_this.abnormalTypeSelect,"_this.abnormalTypeSelect")
      var myChart = this.$echarts.init(document.getElementById("myChart")); //获取容器元素
      var option = {
        tooltip: {
          trigger: "axis",
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
          },
          right: "6%",
        },
        calculable: true,
        xAxis: [
         {
           name:"数量",
            show:true,
            type : 'value',
            boundaryGap : [0, 0],
            position: 'bottom'
         }
        ],
        grid:{
          top:48,
          left:100,
          right:100,
          bottom:50,
        },
        yAxis: [
          {
            name:"原因",
            type : 'category',
            // data : ['亮度故障','图像冻结','图像被遮挡','有滚动条纹','信号丢失,黑屏','图像模糊','有噪声','有闪烁','摄像机不在线',],
            data : j,
            axisLine:{show:true},     //坐标轴
            axisTick:[{    //坐标轴小标记
                show:true
            }],
          },
        ],
        series: [
          {
            name:'',
            type:'bar',
            tooltip:{show:true},
            data:d,
          }
        ],
      };
      //防止越界，重绘canvas
      window.onresize = myChart.resize
      myChart.setOption(option); //设置option
      myChart.on('click',function(params){
        console.log(params,"柱状图")
      })
    },
    // // // 监听滚动事件
    handleScroll() {
      this.$nextTick(() => {
        let scrollTop = document
          .querySelector("#viewBox")
          .getBoundingClientRect().top;
        document.querySelector(".table-pagination").style.position = "fixed";

        if (Math.abs(scrollTop) > 400) {
          this.showPagination = true;
          return;
        }
        this.showPagination = false;
      });
    },
    exportAbnormalList() {
      let parmas = {};
      if (!_.isEmpty(this.tableSearchData)) {
        parmas = {
          regionCode: this.tableSearchData.regionCode,
          organizationId: this.tableSearchData.organizationId,
          errorType: this.tableSearchData.errorType,
          createDateEnd: this.tableSearchData.createDateEnd[1],
          createDateStart: this.tableSearchData.createDateStart[0],
        };
      }
      api
        .exportErrorList(parmas)
        .then((res) => {
          console.log(res, "sddsdsd");
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(res); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "摄像机异常列表.xls"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          this.$message({
            message: "表格导出失败! ",
            type: "error",
          });
        });
    },
    // scrollListener: function() {
    //   this.box = this.$refs.viewBox;
    //   this.box.addEventListener(
    //     "scroll",
    //     () => {
    //       colsole.log(this.$refs.viewBox.scrollTop);
    //     },
    //     false
    //   );
    // },
    checkCameraErrorInfo(row) {
      //scoped.row.astatus ? abnormalTypeCheck.astatus : ""
      let str = "";
      str += row.astatus === "1" ? this.abnormalTypeCheck.astatus + "  " : "";
      str += row.bstatus === "1" ? this.abnormalTypeCheck.bstatus + "  " : "";
      str += row.cstatus === "1" ? this.abnormalTypeCheck.cstatus + "  " : "";
      str += row.dstatus === "1" ? this.abnormalTypeCheck.dstatus + "  " : "";
      str += row.estatus === "1" ? this.abnormalTypeCheck.estatus + "  " : "";
      str += row.fstatus === "1" ? this.abnormalTypeCheck.fstatus + "  " : "";
      str += row.gstatus === "1" ? this.abnormalTypeCheck.gstatus + "  " : "";
      str += row.hstatus === "1" ? this.abnormalTypeCheck.hstatus + "  " : "";
      str += row.istatus === "1" ? this.abnormalTypeCheck.istatus + "  " : "";

      return str;
    },

    backBarChart() {
      let orgId = "";
      this.getAllData(orgId);
      // let len = this.barChartSelectPath.length,
      // if (len) {
      //   this.barChartSelectPath.splice(len - 1, 1);
      //   if (len === 1) this.barChartSelectPath = [];
      //   len = this.barChartSelectPath.length;
      //   if (this.barChartSelectPath[len - 1]) {
      //     orgId = this.barChartSelectPath[len - 1];
      //     //delete this.barChartSelectPath[len - 2];
      //   }

      // }
    },

    getAllData(orgId) {
      this.getUserOrganization();
      let params = { organizationId: "" };
      if (orgId) params.organizationId = orgId;
      this.getAllDataLoading = true;
      this.getAllCameraAbnormalStatisticsAction(params).then((res) => {
        this.getAllDataLoading = false;
        if (res.code == 200) {
          // // 没有下级单位数据，删除查询路径最后一级；
          if (!res.data.childInfo || !res.data.childInfo.length) {
            //没有下一级
            let len = this.barChartSelectPath.length;
            this.barChartSelectPath.splice(len - 1, 1);
            if (len === 1) {
              this.barChartSelectPath = [];
            }
            this.$message({
              message: "该组织下无异常",
              type: "info",
            });
            return false;
          }
          //if(orgId) this.barChartSelectPath.push(orgId);
          this.orgIdView = orgId;
          this.abnormalTotal = res.data.errorTotal;
          // this.abnormalTotal = res.data.inerror;
          let orgList = res.data.childInfo,
            xAxisList = [],
            seriesData = [];
          this.baseDataList = orgList;
          // 柱状图数据
          if (orgList.length) {
            orgList.forEach((vo) => {
              xAxisList.push(vo.name);
              seriesData.push(vo.errorTotal);
            });
          }
          console.log(xAxisList, seriesData, "arrays");
          this.openBarChartInit("openBarChart", "", {
            xAxis: xAxisList,
            series: seriesData,
          });
          this.drawLine(res.data)

          // 饼图数据
          let newList = JSON.parse(JSON.stringify(orgList)),
            pieData = [],
            top5TErrorTotal = 0,
            getRate = (num, baseNm, fixNm) => {
              // if (baseNm <= 0 || num >= baseNm) return 100;

              if (fixNm) {
                return parseFloat(((num / baseNm) * 100).toFixed(fixNm));
              }
              // return parseFloat(Math.ceil((num / baseNm) * 100));
              return num;
            },
            errorTypeData = [];
          if (newList.length) {
            newList.sort((a, b) => b.errorTotal - a.errorTotal);
            for (let i = 0; i < 5; i++) {
              if (!newList[i]) break;
              let nm = newList[i].errorTotal;
              top5TErrorTotal += nm;
              pieData.push({
                value: nm,
                name: `{a| ${newList[i].name}} {b| ${nm}} {c| ${getRate(
                  nm,
                  res.data.errorTotal,
                  1
                )}%}`,
              });
              //console.info("wvwvwvwv     ",newList[i].name, nm, res.data.inerror, Math.ceil(nm / res.data.inerror * 100));
            }
            console.log(pieData);
            let otherErrorNm = res.data.errorTotal - top5TErrorTotal;
            if (newList.length > 5)
              pieData.push({
                value: otherErrorNm,
                name: `{a| 其它} {b| ${otherErrorNm}} {c| ${getRate(
                  otherErrorNm,
                  res.data.errorTotal,
                  1
                )}%}`,
              });
          }
          this.rightPieChart(
            "openLineChartAllApp",
            pieData,
            this.abnormalTotal
          );

          if (res.data.atotal) {
            // errorTypeData = [
            //   {
            //     name: "摄像机不在线",
            //     code: "a",
            //     value: getRate(res.data.atotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "信号丢失,黑屏",
            //     code: "b",
            //     value: getRate(res.data.btotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "图像被遮挡",
            //     code: "c",
            //     value: getRate(res.data.ctotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "图像模糊",
            //     code: "d",
            //     value: getRate(res.data.dtotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "亮度故障",
            //     code: "e",
            //     value: getRate(res.data.etotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "图像冻结",
            //     code: "f",
            //     value: getRate(res.data.ftotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "有噪声",
            //     code: "g",
            //     value: getRate(res.data.gtotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "有闪烁",
            //     code: "h",
            //     value: getRate(res.data.htotal, res.data.inerror, 0)
            //   },
            //   {
            //     name: "有滚动条纹",
            //     code: "i",
            //     value: getRate(res.data.itotal, res.data.inerror, 0)
            //   }
            //   /*{name: "黑屏",code: 'a',value: getRate(res.data.btotal ,res.data.inerror,0)},
            //       {name: "被遮挡",code: 'a',value: getRate(res.data.ctotal ,res.data.inerror,0)},
            //       {name: "画面模糊",code: 'a', value: getRate(res.data.dtotal ,res.data.inerror,0)},
            //       {name: "亮度故障",code: 'a', value: getRate(res.data.etotal ,res.data.inerror,0)},
            //       {name: "有闪烁",code: 'a', value: getRate(res.data.htotal ,res.data.inerror,0)},
            //       {name: "被冻结",code: 'a', value: getRate(res.data.ftotal ,res.data.inerror,0)},
            //       {name: "有噪声",code: 'a', value: getRate(res.data.gtotal ,res.data.inerror,0)},
            //       {name: "有滚动条纹",code: 'a', value: getRate(res.data.itotal ,res.data.inerror,0)},*/
            // ];
          }
          // this.abnormalTypeCount = errorTypeData;
          this.abnormalTypeCount = res.data.errorDetails;
          let data = {
            params: {
              currPage: this.currentPage,
              pageSize: this.pageSize,
              ...params,
            },
          };

          this.getAllCameraAbnormalListAction(data);
        }
      });
    },
    /**
     * 查询摄像机故障列表数据
     */
    queryTableData(page) {
      if (page) this.currentPage = page;

      let dateRs = this.tableSearchData.reportDateRs;
      if (dateRs && dateRs.length) {
        this.tableSearchData.createDateStart = dateRs[0];
        this.tableSearchData.createDateEnd = dateRs[1];
      }

      let data = {
        params: {
          currPage: this.currentPage,
          pageSize: this.pageSize,
          regionCode: this.tableSearchData.regionCode,
          organizationId: this.tableSearchData.organizationId,
          errorType: this.tableSearchData.errorType,
          createDateEnd: this.tableSearchData.createDateEnd,
          createDateStart: this.tableSearchData.createDateStart,
        },
      };

      this.getAllCameraAbnormalListAction(data);
    },
    // 每页数量处理
    handleSizeChange(sizeVal) {
      console.log(sizeVal);
      this.pageSize = sizeVal;
      this.currentPage = 1;
      this.queryTableData();
    },
    // 页码处理
    handleCurrentChange(curPage) {
      this.currentPage = curPage;
      this.queryTableData();
      //this.tableData = this.roleList.roleList.slice((curPage - 1) * this.pageSize , curPage * this.pageSize);
    },
    queryList() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.queryTableData();
    },
    orgChange(val) {
      this.tableSearchData.organizationId = "";
      if (val.length) {
        let orgId = val[val.length - 1];
        this.tableSearchData.organizationId = orgId;
      }
    },
    resetSerach() {
      this.jurisdictionValue = "";
      this.tableSearchData.reportDateRs = "";
      this.tableSearchData.regionCode = "";
      this.tableSearchData.organizationId = "";
      this.tableSearchData.errorType = "";
      this.tableSearchData.createDateEnd = "";
      this.tableSearchData.createDateStart = "";
      this.currentPage = 1;
      let data = {
        params: {
          currPage: this.currentPage,
          pageSize: this.pageSize,
        },
        // data: this.tableSearchData,
      };
      this.getAllCameraAbnormalListAction(data);
    },

    abnormalTypeProgressColor(percentage) {
      //console.info("abnormalTypeProgressColor", percentage);
      if (percentage < 50) {
        return "#67c23a";
      } else if (percentage < 70) {
        return "#e6a23c";
      }
      return "#993700";
    },
    abnormalTypeProgressFormat(percentage) {
      return percentage === 100 ? "100" : percentage; //`${percentage}`;
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
              textBorderColor: "#fff",
            },
          },
        },
        options = {
          title: {
            text: chartTitle,
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
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            extraCssText: "box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);",
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
            containLabel: true,
          },
          xAxis: {
           name:"组织", 
            type: "category",
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
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#f2f2f2",
                width: 1,
                type: "solid",
              },
            },
            minorTick: {
              show: false,
            },
            axisTick: {
              show: false,
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
            name:"数量",
            type: "value",
            minorTick: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#000",
            },
            //网格样式
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
              name: "故障数",
              type: "bar",
              itemStyle: {
                barBorderRadius: [20, 20, 0, 0],
                emphasis: {
                  /*text: pieChartDataTotal + 10000000,*/
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#FDAD00" },
                  { offset: 1, color: "#FFD16D" },
                ]),
              },
              data: chartData.series, // [320, 332, 301, 334, 500, 330, 320, 286]
            },
          ],
        };

      //console.info('myChart ', myChart);
      // 绘制图表
      myChart.setOption(options);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      myChart.off("click");
      myChart.on("click", (params) => {
        //let sersName = params.name;
        console.info('click', params);
        let type = params.componentType;
        if (type === "series") {
          let vo = this.baseDataList[params.dataIndex];
          // 单位查询路径组装，在未查到数据后删除末位。
          this.barChartSelectPath.push(vo.id);
          //that.cameraStatusSelectClick(s.indexOf(params.name.split(' ')[0]) + '');/**/
          this.getAllData(vo.id);
        }
      });
    },
    /**
     * 饼图
     */
    rightPieChart(elId, pieChartData, pieChartDataTotal) {
      let obj = document.getElementById(elId);
      if (!obj) {
        return false;
      }
      let that = this,
        myChart = this.$echarts.init(obj);
      myChart.clear(); //清除canvas上一次绘制数据
      myChart.setOption({
        tooltip: {
          show: false,
          trigger: "item",
          //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
          formatter: "{a} <br/>{b}: {c} ({d}%)",
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
          left: "50%",
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
            show: false,
          },
          textStyle: {
            rich: {
              a: {
                color: "#000",
                fontSize: 12,
                lineHeight: 16,
                width: 200,
              },
              b: {
                color: "#333",
                fontSize: 12,
                lineHeight: 16,
                width: 40,
                align: "right",
              },
              c: {
                fontSize: 12,
                width: 30,
                color: "#333",
              },
            },
          },
        },
        title: {
          text: pieChartDataTotal,
          //subtext: datasubtext[0],
          left: "29%",
          y: "center",
          textAlign: "center",
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
            color: ["#000"],
          },
        },
        series: [
          {
            //coordinateSystem: 'polar',
            roundCap: true,
            name: "摄像机统计",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            //hoverAnimation: false,
            //legendHoverLink: false,
            silent: false,
            label: {
              normal: {
                show: false,
              },
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
                show: false,
              },
            },
            itemStyle: {
              emphasis: {
                /*text: pieChartDataTotal + 10000000,*/
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              color: function (params) {
                let colorList = [
                    "rgba(195,88,50,1)",
                    "rgba(203,196,46,1)",
                    "rgba(17,199,192,1)",
                    "rgba(7,179,235,1)",
                    "rgba(17,119,246,1)",
                    "rgba(150,154,171,1)",
                  ],
                  startColorList = [
                    "rgba(195,88,50,0.4)",
                    "rgba(203,196,46,0.4)",
                    "rgba(17,199,192,0.4)",
                    "rgba(7,179,235,0.4)",
                    "rgba(17,119,246,0.4)",
                    "rgba(150,154,171,0.4)",
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
              },
            },
            data: pieChartData,
          },
        ],
      });

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="less">
.statistics-wrap {
  height: calc(100% - 20px);
  margin-bottom: 0 !important;
  .box-card {
    margin-bottom: 15px;
    .el-card__body {
      padding: 20px 20px 0 20px;
      height: calc(100% - 47px);
      margin-bottom: 60px;
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
          &.abnormal-search {
            height: auto;
          }
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
.table-pagination {
  padding: 20px 0;
  z-index: 99999;
  position: static;
  left: 246px;
  bottom: 0;
  background-color: #fff;
}
</style>
