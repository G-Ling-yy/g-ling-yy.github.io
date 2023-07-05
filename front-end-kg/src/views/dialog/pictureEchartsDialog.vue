<template>
  <div class="content-wrapper" id="viewBox" ref="viewBox">
    <div class="camera-type-panel">
      <!-- 底部选项按钮 -->
      <div class="btn-wrap">
        <el-tooltip
          v-for="it in cameraInfo"
          :key="it.type"
          class="item"
          effect="dark"
          :content="it.title + '(' + it.count + ')'"
          placement="top-start"
          popper-class="itemTips"
        >
          <div
            :class="cameraTypeClass(it.bg, it.type)"
            @click="cameraTypeSelectClick(it.type)"
          ></div>
        </el-tooltip>

        <div class="last-item"></div>
      </div>
    </div>
    <!-- 摄像机截图统计 -->
    <div class="echart-content">
      <el-button
        v-if="organizationTypeTemporary === 20"
        style="
          padding: 3px 0;
          width: 20px;
          height: 20px;
          font-size: 0.6rem;
          margin: -2px 0 0 20px;
        "
        type="primary"
        @click="backBarSuperior"
      >
        <i class="el-icon-top-left"></i>
      </el-button>
      <div id="myChart" style="height: 670px; width: 100%"></div>
    </div>
    <div class="imgCountList">
      <span
        size="mini"
        class="dayList"
        v-for="(time, index) in dayList"
        :key="index"
        :class="[idx == index ? 'active' : '']"
        @click="isActive(index, time)"
        >{{ time }}</span
      >
        <div class="download" @click="exportSnapshotList()"><i class="el-icon-download"></i></div>

    </div>
    <!-- 截图管理弹窗 -->
    <el-dialog
      :visible.sync="dialogss"
      width="88.2%"
      top="8vh"
      :close-on-click-modal="false"
      :append-to-body="true"
      custom-class="picList-dialog"
      @closed="
        () => {
          {
            $refs.refPicList.reset();
          }
        }
      "
    >
      <pictureManagement-dialog
        ref="refPicList"
        :show="dialogss"
        :vo="vo"
        :isActiveData="isActiveData"
        :selectType="cameraTypeSelect"
      ></pictureManagement-dialog>
    </el-dialog>
  </div>
</template>

<script>
import pictureManagementDialog from "./pictureManagementDialog";
import util from "../../filters/utils";

export default {
  name: "pictureEchartsDialog",
  components: {
    pictureManagementDialog,
  },
  computed: {},
  data() {
    return {
      idx: 0,
      dialogss: false,
      imgData: [],
      getImgStatisticsData: [],
      baseDataList: [],
      vo: {},
      isActiveData: null,
      orgList: [], //x轴
      orgIdList: [],
      onlineCountList: [],
      outlineCount: [],
      totalCount: [],
      dayList: [],
      cameraTypeSelect: [],
      cameraTypeList: [
        { title: "道路", bg: "dlyx-btn", type: "1" },
        { title: "桥梁", bg: "mj-btn", type: "2" },
        { title: "隧道", bg: "qd-btn", type: "3" },
        { title: "门架", bg: "etc-btn", type: "7" },
        { title: "收费站", bg: "sfz-btn", type: "5" },
        { title: "服务区", bg: "fwq-btn", type: "6" },
        { title: "加油站", bg: "online-btn", type: "9" },
        { title: "默认", bg: "qt-btn", type: "0" },
      ],
      cameraInfo: [],
      myChart: null,
      today: "",
      resArr: [],
      organizationIdData: null,
      organizationTypeData: 10,
      organizationTypeTemporary: 10,
    };
  },
  created() {
    /* 动态magnify样式加载 */
    const sheet = Array.from(document.styleSheets).find(
      (e) => e.title === "magnifyMinCssLink"
    );
    sheet && (sheet.ownerNode.href = sheet.ownerNode.dataset.href);

    /* 动态magnify脚本加载 */
    // const jqueryJs = Array.from(document.scripts).find(
    //   e => e.title === 'jqueryMin'
    // )
    const magnifyJs = Array.from(document.scripts).find(
      (e) => e.title === "magnifyMin"
    );

    magnifyJs && (magnifyJs.src = magnifyJs.dataset.src);

    // if (jqueryJs) {
    //   jqueryJs.onload = () => {
    //     magnifyJs && (magnifyJs.src = magnifyJs.dataset.src)
    //   }
    //   jqueryJs.src = jqueryJs.dataset.src
    // }
  },
  mounted() {
    // this.drawBat();
    this.recentTime();
    this.idx = this.dayList.length - 1;
    this.query(this.dayList[this.idx]);
    this.queryClassifyStatistics(this.dayList[this.idx]);
  },

  methods: {
    /**
     *故障类型统计
     *
     */
    drawBat(p) {
      var _this = this;
      this.myChart = this.$echarts.init(document.getElementById("myChart")); //获取容器元素
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
          // formatter: function (params) {
          //   console.log(params,"2222")
          //   const item = params[0].data, item2 =params[1].data;
          //   return item+ item2;
          // },
        },
        // 条形图位置调整
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.orgList,

            splitLine: {
              show: false,
              lineStyle: {
                color: "#000",
              },
            },
            axisLabel: {
              rotate: 30,
              show: true,
              textStyle: {
                fontFamily: "PingFang-SC-Medium",
                color: "#fff",
              },
            },
            triggerEvent: true,
          },
        ],
        yAxis: {
          type: "value",
          axisLabel: {
            rotate: 0,
            show: true,
            textStyle: {
              fontFamily: "PingFang-SC-Medium",
              color: "#fff",
            },
          },
        },
        series: [
          {
            name: "在线数",
            barMaxWidth: 50, // 最大宽度
            type: "bar",
            stack: "total",
            label: {
              show: true,
              formatter: (params) => `${params.value > 0 ? params.value : ""}`,
            },
            emphasis: {
              offset: 0,
              focus: "series",
            },
            itemStyle: {
              color: "#1a79c9",
            },
            data: this.onlineCount,
          },
          {
            name: "离线数",
            type: "bar",
            stack: "total",
            label: {
              show: true,
              formatter: (params) => `${params.value > 0 ? params.value : ""}`,
            },
            emphasis: {
              focus: "series",
            },
            data: this.outlineCount,
          },
        ],
      };

      //防止越界，重绘canvas
      window.onresize = this.myChart.resize;
      this.myChart.setOption(option); //设置option
      //防重复触发点击事件
      if (this.myChart._$handlers.click) {
        this.myChart._$handlers.click.length = 0;
      }
      this.myChart.on("click", function (obj) {
        // _this.myChart.getZr().on("click",function(obj){
        // console.log(obj,"objobjobjobj")
        // let pointInPixel = [obj.offsetX, obj.offsetY]
        // if (_this.myChart.containPixel('grid', pointInPixel)) {
        //   let xIndex = _this.myChart.convertFromPixel({ seriesIndex: 0 }, [obj.offsetX, obj.offsetY])[0]
        //   console.log(xIndex)
        // }
        let type = obj.componentType;
        let orgObj = _this.baseDataList[obj.dataIndex];
        let orgDataList = _this.baseDataList.find(
          (item) => item.organizationName === obj.value
        );
        _this.vo = orgObj;
        if (type === "xAxis") {
          if (
            orgDataList.sonCount &&
            parseInt(orgDataList.sonCount) > 0 &&
            _this.organizationTypeTemporary === 10
          ) {
            _this.organizationIdData = orgDataList.organizationId;
            _this.organizationTypeData = 20;
            _this.query(_this.dayList[_this.idx]);
          } else {
            _this.organizationTypeTemporary === 10 &&
              _this.$message("该路公司下无管理处");
          }
          console.log(
            "X轴点击事件",
            orgDataList,
            _this.organizationTypeTemporary
          );
        } else if (type === "series") {
          _this.dialogss = true;
          _this.$emit("selfDisplay", {
            show: false,
            mark: "self",
          });
          // console.log(_this.vo, "_this.vo");
          window.pp = _this;
        }
      });
    },
    /**
     *查询统计数据
     *
     */
    query(time) {
      let obj = {
        createDate: time,
        cameraTypes: this.cameraTypeSelect,
        organizationId: this.organizationIdData,
        organizationType: this.organizationTypeData,
      };
      this.$api.getImgStatistics(obj).then((res) => {
        if (res.code == 200) {
          this.pageSize = res.pageSize;
          let imgData = res.data;
          // for (var i = 0;i < imgData.length; i++){
          //   if (imgData[i].organizationName=="镇扬汽渡" || imgData[i].organizationName=="暨阳轮渡"|| imgData[i].organizationName=="通沙汽渡"){
          //       imgData.splice(i,1);
          //   }
          // }
          // let directlyUnder=imgData[0].organizationName + "直属单位"
          this.organizationTypeTemporary = this.organizationTypeData;
          if (this.organizationTypeTemporary == 20) {
            imgData[0].organizationName =
              imgData[0].organizationName + "（直属）";
          }
          // this.baseDataList = imgData
          this.baseDataList = imgData.sort(
            (a, b) =>
              b.onlineCount / (b.onlineCount+b.outlineCount) - a.onlineCount / (a.onlineCount+a.outlineCount)
          );
          console.log( this.baseDataList," this.baseDataList")
          this.orgList = imgData.map((item) => {
            return item.organizationName;
          });
          this.orgIdList = imgData.map((item) => {
            return item.organizationId;
          });
          this.outlineCount = imgData.map((item) => {
            return item.outlineCount;
          });
          this.onlineCount = imgData.map((item) => {
            return item.onlineCount;
          });
          this.drawBat("myChart", "");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**
     *返回上级组织图标
     *
     */
    backBarSuperior() {
      if (this.organizationTypeTemporary === 20) {
        this.organizationIdData = null;
        this.organizationTypeData = 10;
        this.query(this.dayList[this.idx]);
      }
    },
    /**
     *获取分类统计数据
     *
     */
    queryClassifyStatistics(time) {
      let obj = {
        createDate: time,
      };
      console.log(obj, "objobj");
      this.$api.getImgStatisticsClassify(obj).then((res) => {
        if (res.code == 200) {
          this.getImgStatisticsData = res.data;
          this.cameraInfo = this.cameraTypeList.map((item) => {
            const { count = 0 } =
              this.getImgStatisticsData.find((r) => r.classify === item.type) ||
              {};
            return { ...item, count };
          });
          console.log(this.cameraInfo, "cameraInfo");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    cameraArr() {},
    /**
     *获取前7天日期
     *
     */
    recentTime() {
      let myDate = new Date(); // 获取今天日期
      myDate.setDate(myDate.getDate() - 6);
      let dateTemp;
      let flag = 1;
      for (var i = 0; i < 7; i++) {
        myDate.setDate(myDate.getDate());
        let MM = myDate.getMonth() + 1;
        let day = myDate.getDate();

        if (MM < 10) {
          MM = "0" + MM;
        }
        if (day < 10) {
          day = "0" + day;
        }
        dateTemp = myDate.getFullYear() + "-" + MM + "-" + day;
        this.dayList.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
      }
      this.isActiveData = this.dayList[this.dayList.length - 1];
      console.log(this.isActiveData, "this.isActiveDatathis.isActiveData  ");
    },
    //摄像机类别
    cameraTypeClass(bg, type) {
      return this.cameraTypeSelect.length != 0 &&
        this.cameraTypeSelect.indexOf(type) < 0
        ? bg
        : bg + " active";
    },
    /**
     * 摄像机类型筛选切换
     * @param type
     */
    cameraTypeSelectClick(type) {
      if (this.cameraTypeSelect.length >= 7) {
        this.cameraTypeSelect = [];
      }
      let iddx = this.cameraTypeSelect.indexOf(type);
      if (iddx >= 0) {
        // this.cameraTypeSelect.splice(iddx, 1);
        this.cameraTypeSelect = [];
      } else {
        // this.cameraTypeSelect.push(type);
        this.cameraTypeSelect = [type];
      }
      // this.selectType = [this.cameraTypeSelect]
      this.query(this.dayList[this.idx]);
    },
    // 重置
    reset() {
      this.item = "";
      this.cameraTypes = [];
      this.cameraTypeSelect = [];
      this.currPage = 1;
      this.organizationIdData = null;
      this.organizationTypeData = 10;
      this.organizationTypeTemporary = 10;
      this.isActive(
        this.dayList.length - 1,
        this.dayList[this.dayList.length - 1]
      );
      console.log("%c%s", "font-size: 30px;color: #f00", "我来重置echat");
      console.log("我来重置echat");
    },
    isActive(index, time) {
      console.log(index, time, "index,item");
      // var x = document.getElementsByClassName("dayList");
      // if(index==6){
      //   x[6].style.backgroundColor = "blue";
      // }else{
      //   x[6].style.backgroundColor = "#091543";
      //   x[6].style.color="#ccc";
      // }
      this.isActiveData = time;
      console.log(this.isActiveData, "this.isActiveData");
      this.query(time);
      this.queryClassifyStatistics(time);
      console.log(index);
      this.idx = index;
    },
    /**
     * 导出截图路公司数据表
     */
    exportSnapshotList() {
      var params = {
        createDate: this.isActiveData,
      };
      this.$api
        .exportSnapshotList(params)
        .then(data => {
          var blob = new Blob([data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "路公司截图在线统计.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "数据导出失败! ",
            type: "error"
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .picList-dialog {
  background: #091543;
  border: 1px solid #0393d1;
  box-shadow: 0 0 8px 0 #0393d1;
  display: flex;
  align-items: center;
  .el-dialog__header {
    padding: 0;
  }
}
/deep/ .el-dialog__body {
  padding: 30px 20px 0;
  width: 100%;
}
.el-dialog__wrapper {
  display: flex;
  align-items: center;
  /deep/ .el-dialog {
    margin: 0 auto !important;
  }
}
.el-dialog {
  margin: 0 auto !important;
}
.imgCountList {
  display: flex;
  .dayList {
    cursor: pointer;
    color: #ccc;
  }
  span {
    padding: 5px 10px;
    border: 1px solid;
    margin: 0 6px;
  }
  // .dayList:nth-last-child(1) {
  //   background-color: blue;
  //   color: #fff;
  // }
  .active {
    background-color: blue;
    color: #fff;
  }
   .download{
      font-size: 24px;
      color: #fff;
    }
}
#viewBox {
  padding: 10px;
  .camera-type-panel {
    float: right;
    height: 50px;
    width: 25%;
  }
  .btn-wrap {
    height: 100%;
    background-image: url("../../assets/images/traffic_map/camera_wrap_bg_right.png");
    background-repeat: no-repeat;
    background-position: left center;
    background-size: auto 100%;
    &:first-child {
      background-image: url("../../assets/images/traffic_map/camera_wrap_bg_left.png");
      background-position: right center;
      // padding-right: 26px;
      .collapse-btn {
        min-width: 13px;
        width: 13px;
        height: 9px;
        margin: 20px 0;
        padding: 0;
        transition: all 0.3s;
        background-image: url("../../assets/images/traffic_map/type-wrap-btn.png");
        background-position: right center;
        background-repeat: no-repeat;
        /*&:hover{
            height: 10px;
            !*background-image:url('../assets/images/traffic_map/type-wrap-btn-gif.gif');*!
          }*/
      }
    }
    &:last-child {
      padding-left: 5px;
      margin-left: -16px;
    }

    &.status-collapsed {
      background-image: url("../../assets/images/traffic_map/camera_wrap_bg_left-cos.png");
      .fl-btn,
      .ero-btn {
        width: 0;
        padding: 0;
      }
      .collapse-btn {
        background-image: url("../../assets/images/traffic_map/type-wrap-collapsed.png");
        /*&:hover{
            height: 10px;
            !*background-image:url('../assets/images/traffic_map/type-wrap-collapsed-gif.gif');*!
          }*/
      }
    }

    > div {
      padding: 0 7%;
      height: 100%;
      display: inline-block;
      cursor: pointer;
      transition: all 0.3s;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: 30% center;
      position: relative;

      & + div {
        margin-left: -5%;
      }
      /*&:hover,*/
      &.all-btn {
        background-image: url("../../assets/images/traffic_map/icon/all-active.png");
        z-index: 8;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/all-active.png");
        }
      }
      &.ol-btn {
        background-image: url("../../assets/images/traffic_map/icon/online.png");
        z-index: 3;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/online-active.png");
        }
      }
      &.fl-btn {
        background-image: url("../../assets/images/traffic_map/icon/offline.png");
        z-index: 2;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/offline-active.png");
        }
      }
      &.ero-btn {
        background-image: url("../../assets/images/traffic_map/icon/error.png");
        z-index: 1;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/error-active.png");
        }
      }
      &.dlyx-btn {
        background-image: url("../../assets/images/traffic_map/icon/dlyx.png");
        z-index: 6;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/dlyx-active.png");
        }
      }
      &.online-btn {
        background-image: url("../../assets/images/traffic_map/icon/jyz.png");
        z-index: 9;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/jyz-active.png");
        }
      }
      &.mj-btn {
        background-image: url("../../assets/images/traffic_map/icon/mj.png");
        z-index: 5;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/mj-active.png");
        }
      }
      &.qd-btn {
        background-image: url("../../assets/images/traffic_map/icon/qd.png");
        z-index: 4;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/qd-active.png");
        }
      }
      &.etc-btn {
        background-image: url("../../assets/images/traffic_map/icon/etc.png");
        z-index: 3;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/etc-active.png");
        }
      }
      &.sfz-btn {
        background-image: url("../../assets/images/traffic_map/icon/sfz.png");
        z-index: 2;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/sfz-active.png");
        }
      }
      &.fwq-btn {
        background-image: url("../../assets/images/traffic_map/icon/fwq.png");
        z-index: 1;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/fwq-active.png");
        }
      }
      &.qt-btn {
        background-image: url("../../assets/images/traffic_map/icon/qt.png");
        z-index: 8;
        &.active {
          background-image: url("../../assets/images/traffic_map/icon/qt-active.png");
        }
      }
      &.last-item {
        display: none;
        width: 86px;
        background-image: url("../../assets/images/traffic_map/header-left-bg.png");
      }
    }
    &:after {
      display: inline-block;
      content: "";
      height: 0;
      width: 0;
      clear: both;
    }
   
  }
}
</style>
