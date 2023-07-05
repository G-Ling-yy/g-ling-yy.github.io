<template>
  <div class="content-wrapper" id="viewBox" ref="viewBox">
    <!-- 故障类型统计 -->
    <div class="echart-content">
      <div id="myChart" style="height: 270px; width: 100%"></div>
    </div>
  </div>
</template>

<script>
import { mapActions} from "vuex";
export default {
  name: "faultModel",
  components: {},
  computed: {},
  data() {
    return {
      uinfo: {
        regionCode: JSON.parse(localStorage.getItem("cloudplatform"))
          .regionCode,
      },
      abnormalTypeCount: [],
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

      barChartSelectPath: [],
    };
  },

  mounted() {
    this.drawLine();
    this.getUserOrganization();
    this.getAllData();
  },

  methods: {
    ...mapActions([
      "getUserOrganization",
      "getAllCameraAbnormalStatisticsAction",
    ]),
    //故障类型统计
    drawLine(p) {
      var j = [];
      var d = [];
      var _this = this;
      if (p) {
        for (var k in this.abnormalTypeSelect) {
          var ats = _this.abnormalTypeSelect[k];
          _this.abnormalTypeSelect[k].value = p[ats.code + "total"];
        }
      }
      for (var i = this.abnormalTypeSelect.length - 1; i >= 0; i--) {
        var aname = _this.abnormalTypeSelect[i];
        j.push(aname.name);
        d.push(aname.value);
      }
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
            name: "数量",
            show: true,
            type: "value",
            boundaryGap: [0, 0],
            position: "bottom",
          },
        ],
        grid: {
          top: 48,
          left: 100,
          right: 100,
          bottom: 50,
        },
        yAxis: [
          {
            name: "原因",
            type: "category",
            data: j,
            axisLine: { show: true }, //坐标轴
            axisTick: [
              {
                //坐标轴小标记
                show: true,
              },
            ],
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            tooltip: { show: true },
            data: d,
          },
        ],
      };
      //防止越界，重绘canvas
      window.onresize = myChart.resize;
      myChart.setOption(option); //设置option
      myChart.on("click", function (params) {
        console.log(params, "柱状图");
      });
    },
    getAllData(orgId) {
      this.getUserOrganization();
      let params = { organizationId: "" };
      if (orgId) params.organizationId = orgId;
      this.getAllCameraAbnormalStatisticsAction(params).then((res) => {
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
          this.abnormalTotal = res.data.inerror;
          let orgList = res.data.childInfo,
            xAxisList = [],
            seriesData = [];
          this.baseDataList = orgList;
          // 柱状图数据
          if (orgList.length) {
            orgList.forEach((vo) => {
              xAxisList.push(vo.name);
              seriesData.push(vo.inerror);
            });
          }
          this.drawLine(res.data);
          this.abnormalTypeCount = res.data.errorDetails;
        }
      });
    },
  },
};
</script>

<style lang="less"></style>
