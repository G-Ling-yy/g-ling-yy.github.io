<template>
  <div class="camera-images-body">
    <el-drawer
      :visible.sync="drawer"
      direction="btt"
      size="100%"
      :modal-append-to-body="false"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :show-close="false"
    >
      <!-- 头部 -->
      <template slot="title">
        <div class="images-title">
          <span @click="handleClose"> <i class="el-icon-back"></i>返回 </span>
          <div class="images-title-right">
            <div class="images-title-box">
              <!-- <div class="search-wrapper change-padding"> -->
              <el-form class="demo-form-inline">
                <el-form-item class="demo-form-item" prop="type">
                  <span class="demonstration">截图方式:</span>
                  <el-select v-model="searchInfo.type" style="width: 120px">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="自动截图" value="1"></el-option>
                    <el-option label="手动截图" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="demo-form-item">
                  <span class="demonstration">截图时间:</span>
                  <el-date-picker
                    v-model="searchInfo.selectDate"
                    type="datetimerange"
                    range-separator="~"
                    :start-placeholder="stime"
                    :end-placeholder="etime"
                    align="left"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item class="demo-form-item">
                  <el-button type="primary" class="query" @click="query"
                    >搜索</el-button
                  >
                  <el-button type="info" class="reset" @click="handleReset"
                    >重置</el-button
                  >
                  <el-button type="info" class="reset" @click="delImg"
                    >批量删除</el-button
                  >
                </el-form-item>
                <el-form-item class="demo-form-item">
                  <!-- <el-button type="primary" plain class="query" @click="delImg">批量删除</el-button> -->
                  <!-- <el-button type="primary" plain class="query" @click="downLoad">下载</el-button> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </template>
      <!-- 内容区域 -->
      <div class="images-main">
        <span class="main-title">
          <!-- <i
            class="main-title-i"
            :class="cameraColor[dataList.onlineStatus]"
          ></i> -->
          <!-- {{
                    `${dataList.roadCode ? dataList.roadCode : ''} 
                    ${dataList.road ? dataList.road : ''}  
                    ${dataList.khPile ? dataList.khPile : ""} 
                     ${dataList.poiName ? dataList.poiName : ''} 
                    ${derection ? derection : ''}`
                    }} -->
          <!-- {{ dataList.cameraName }} -->
          <!-- 0上行  1下行 2上下行 -->
          <!-- <i
            v-show="
              dataList.derectionCode === '0' || dataList.derectionCode === '2'
            "
            class="el-icon-top"
          ></i>
          <i
            v-show="
              dataList.derectionCode === '1' || dataList.derectionCode === '2'
            "
            class="el-icon-bottom"
          ></i> -->
        </span>
        <div class="main-box">
          <!-- <div class="main-box-left">
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="index === activity.colorIndex ? activity.color : null"
                  :size="activity.size"
                >
                  <span
                    :class="{
                      activity: true,
                      'activity-color-default': index !== activity.colorIndex,
                      'activity-color-blue': index === activity.colorIndex,
                    }"
                    @click="queryTimeList(activity, index)"
                  >
                    {{ activity.dayListYear }}
                  </span>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div> -->
          <div class="main-box-right">
            <el-row :gutter="24" style="margin: 0">
              <div
                style="width: 300px; height: 240px; float: left; padding: 0.5%"
                v-for="(item, i) in tableData"
                :key="item.id"
                @selection-change="selsChange"
              >
                <!-- <img :src="item.snapshotUrl" /> -->
                <el-image
                  :src="item.snapshotUrl"
                  :preview-src-list="[item.snapshotUrl]"
                  style="
                     {
                      width: 100%;
                      height: calc(100% - 64px);
                    }
                  "
                >
                </el-image>
                <el-checkbox
                  style="position: relative; top: -160px; right: -2px"
                  :key="item.id"
                  @change="(args) => chooseData(args, item)"
                ></el-checkbox>
                <div class="imgInfo">
                  <span class="manualImg" v-if="item.type == 1">自动</span>
                  <span class="automaticImg" v-else>手动</span>
                  <span class="imgTime">{{ item.snapshotTime }}</span>
                  <span :id="'output' + i" class="imgSize">{{
                    getImgSize(item.snapshotUrl, i)
                  }}</span>
                  <!-- <el-button size="small" type="primary" @click="downloadImage(item)">下载</el-button> -->
                  <span
                    class="operate-btn bold"
                    type="md-download"
                    @click="downloadImage(item.snapshotUrl)"
                  >
                    <img
                      src="../../../assets/images/icon/notDownload.png"
                      style="width: 20px; heigth: 20px"
                    />
                  </span>
                </div>
              </div>
            </el-row>
            <!-- 分页 -->
            <div class="table-pagination">
              <p class="total-pagination">共{{transcodingTotal}}条</p>
              <el-pagination
                background
                layout=" prev, pager, next, jumper "
                :total="transcodingTotal"
                :page-size="pageSize"
                :current-page="transcodingCurrentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 批量删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="delDialogVisible"
      :modal-append-to-body="false"
      width="30%"
    >
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchDelImg()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { forEach } from "jszip";
import util from "../../../filters/utils";

// import {mapState, mapActions, mapMutations} from 'vuex';
// import loading from '@/components/common/Loading';
export default {
  name: "CameraImagesDrawer",
  // components:{
  //     loading
  // },
  data() {
    return {
      stime: "",
      etime: "",
      dataList: null,
      sels: [], //选中的值显示
      choosedImg: [],
      drawer: false, //抽屉开关
      searchInfo: {
        selectDate: null,
        type: "0",
      },
      cameraId: null,
      tableData: {}, // 数据列表
      pageSize: 12,
      transcodingTotal: 0,
      transcodingCurrentPage: 1,
      delDialogVisible: false, // 删除提示框
      activities: [
        {
          dayListYear: null,
          timestamp: null,
          color: "#0186E7",
          colorIndex: 0,
        },
        {
          dayListYear: null,
          timestamp: null,
          dayListZero: null,
          color: "#0186E7",
          colorIndex: 0,
        },
        {
          dayListYear: null,
          timestamp: null,
          dayListZero: null,
          color: "#0186E7",
          colorIndex: 0,
        },
        {
          dayListYear: null,
          timestamp: null,
          dayListZero: null,
          color: "#0186E7",
          colorIndex: 0,
        },
        {
          dayListYear: null,
          timestamp: null,
          dayListZero: null,
          color: "#0186E7",
          colorIndex: 0,
        },
        {
          dayListYear: null,
          timestamp: null,
          dayListZero: null,
          color: "#0186E7",
          colorIndex: 0,
        },
        {
          dayListYear: null,
          timestamp: null,
          dayListZero: null,
          color: "#0186E7",
          colorIndex: 0,
        },
      ],
      queryData: null,
      cameraColor: {
        // 摄像机在线状态
        2: "grey",
        1: "normal",
        0: "red",
      },
    };
  },
  // computed: {
  //     ...mapState([
  //         "deviceStatistics",
  //     ]),
  // thumbListWidth(){
  //     let count = this.deviceStatistics.cameraSnapShotsList.length,
  //         width = count*98 + 10*(count-1);
  //     return count ? width + 'px' : 0;
  // }
  // },
  mounted() {},
  created() {},
  methods: {
    // ...mapActions([
    //     "getCameraSnapShotsAction",
    // ]),
    // ...mapMutations([
    //     "setDirectionItemList",
    //     "setCameraSnapShotsList",
    // ]),
    // 获取所有图片
    getImgListData(curPage) {
      let myDate = new Date();
      myDate.setTime(myDate.getTime()-1);
      let dateTemp;
      let endDay;
      let offset=0;
      var perDay=new Date();
      perDay.setTime(myDate.getTime()-1);
      perDay.setDate(perDay.getDate()-1)
      dateTemp =util.date('Y-m-d H:i:s',perDay);
      endDay = util.date('Y-m-d H:i:s',myDate);
      let Ftime =util.date('Y-m-d',perDay);
      let Ttime = util.date('Y-m-d',myDate);
      this.stime=Ftime
      this.etime=Ttime
      console.log(this.stime,this.stime,"myDate")
      let obj = {};
      if (
        this.searchInfo.selectDate == null ||
        this.searchInfo.selectDate == ""
      ) {
        obj = {
          status: this.searchInfo.status,
          currPage: curPage || this.transcodingCurrentPage,
          type:this.searchInfo.type,
          startTime: dateTemp,
          endTime: endDay,           
          cameraId: this.cameraId,
          pageSize:this.pageSize,
        };
      } else {
        obj = {
          pageSize:this.pageSize,
          status: this.searchInfo.status,
          type:this.searchInfo.type,
          currPage: curPage || this.transcodingCurrentPage,
          startTime: this.searchInfo.selectDate[0]
            ? this.searchInfo.selectDate[0]
            : "",
          endTime: this.searchInfo.selectDate[1]
            ? this.searchInfo.selectDate[1]
            : "",
          cameraId: this.cameraId
        };
      }
      console.log(obj, "数据");
      this.$api.getImgList(obj).then(res => {
        if (res.code == 200) {
          this.pageSize=res.pageSize;
          this.transcodingTotal = res.total;
          this.tableData = res.data
        } else {
          this.$message.error(res.message);
        }
      });
    },
    chooseData(checked, img) {
      if (checked) {
        this.choosedImg.push(img);
      } else {
        this.choosedImg = this.choosedImg.filter((it) => {
          return it.id !== img.id;
        });
      }
    },
    getImgSize(url, i) {
      let than = this;
      fetch(url)
        .then(function (res) {
          return res.blob();
        })
        .then(function (data) {
          document.getElementById("output" + i).innerHTML = than.getfilesize(
            data.size
          );
        });
    },
    // 字节转文件大小单位（K、M、G、T）保留两位小数
    getfilesize(size) {
      if (!size) return "";
      var num = 1024.0; //byte
      if (size < num) return size + "B";
      if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "KB"; //kb
      if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
      if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
      return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
    },
    // 下载图片
    downloadImage(imgsrc, name) {
    //   console.log(this.$refs, it_ref["img_" + it_ref]);
    //   console.log("下载", imgsrc, name, it_ref);
      var image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/jpeg"); //得到图片的base64编码数据
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "摄像机截图"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      let fileSize = image.fileSize;
      image.src = imgsrc;
    },
    // 打开抽屉事件
    getImages(val) {
      console.log("开启", val);
      this.drawer = true;
      this.dataList = val;
      this.cameraId = val.cameraId;
      // this.getImgListData(1)
      this.handleReset();
      this.recentTime();
    },
    // 搜索
    query() {
      this.queryData = null;
      this.getImgListData(1);
    },
    // 重置
    handleReset() {
      this.queryData = null;
      // 高亮显示默认
      this.activities.map((item) => {
        item.colorIndex = 0;
      });
      this.transcodingCurrentPage = 1;
      this.searchInfo.selectDate = "";
      this.searchInfo.type = "0";
      this.getImgListData(1);
    },
    // 批量删除
    delImg() {
      if (this.choosedImg.length) {
        this.delDialogVisible = true;
      } else {
        this.$message.error("请勾选需要删除的图片！");
      }
    },
    // 确定删除图片
    batchDelImg() {
      console.log("删除");
      let imgIds = _.map(this.choosedImg, (it) => {
        return it.id;
      });
      this.$api.delImg(imgIds).then((res) => {
        if (res.code == 200) {
          this.$message.success({
            message: "已删除",
            type: "success",
          });
          this.delDialogVisible = false;
          this.getImgListData();
        }
      });
    },
    // 通过时间获取列表
    queryTimeList(activity, index) {
      console.log("出发了", activity);
      // 高亮显示
      this.activities.map((item) => {
        item.colorIndex = index;
      });
      this.queryData = activity;
      this.getImgListData(1);
    },
    // 获取前7天的日期
    recentTime() {
      let myDate = new Date(); // 获取今天日期
      myDate.setDate(myDate.getDate() -5);
      let dayList = [];
      let dayListYear = [];
      let dayListZero = [];
      let dateTemp;
      let dataYear;
      let dataZero;
      let flag = 1;
      for (let i = 0; i < 7; i++) {
        myDate.setDate(myDate.getDate());
        let MM = myDate.getMonth();
        let day = myDate.getDate();
        let hh = myDate.getHours();
        let mm = myDate.getMinutes();
        let ss = myDate.getSeconds();
        dataYear =
          myDate.getFullYear() +
          "年" +
          (myDate.getMonth() + 1) +
          "月" +
          day +
          "日";
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
          myDate.getFullYear() +
          "-" +
          (myDate.getMonth() + 1) +
          "-" +
          day +
          " " +
          hh +
          ":" +
          mm +
          ":" +
          ss;
        dataZero =
          myDate.getFullYear() +
          "-" +
          (myDate.getMonth() + 1) +
          "-" +
          day +
          " " +
          "00" +
          ":" +
          "00" +
          ":" +
          "00";
        // dateTemp = ;
        dayListYear.unshift(dataYear);
        dayListZero.unshift(dataZero);
        dayList.unshift(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
      }
      // 数据处理
      this.activities.map((it, i) => {
        it.dayListYear = dayListYear[i];
        it.dayListZero = dayListZero[i];
        it.timestamp = dayList[i];
      });
      console.log("30days", dayList);
    },
    // 抽屉关闭
    handleClose(done) {
      console.log("关闭", done);
      this.drawer = false;
    },
    selsChange(sels) {
      this.sels = sels;
    },
    // 用户分页处理
    handleSizeChange(sizeVal) {
      this.transcodingCurrentPage = 1;
      this.pageSize = sizeVal;
      this.getImgListData();
    },
    handleCurrentChange(curPage) {
      this.transcodingCurrentPage = curPage;
      this.getImgListData();
    },
  },
};
</script>

<style lang="less" scoped>
/*截图窗口样式*/
.camera-images-body {
  /deep/.el-drawer {
    background-color: #091d62;
  }
  .images-title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    background-color: #1955ae;
    span {
      display: inline-block;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
    .images-title-right {
      display: inline-block;
      .images-title-box {
        display: inline-block;
        .demo-form-inline {
          // background-color: red;
          .demo-form-item {
            display: inline-block;
            margin-left: 10px;
          }
          .demonstration {
            font-size: 16px;
            color: #fff;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .images-main {
    padding: 20px 30px;
    //    background-color: pink;
    .main-title {
      display: block;
      font-size: 26px;
      color: #fff;
      .main-title-i {
        display: inline-block;
        width: 10px;
        height: 10px;
        vertical-align: middle;
        border-radius: 50%;
        &.red {
          background-color: #ff3607;
        }
        &.grey {
          background-color: #8b8f91;
        }
        &.normal {
          background-color: #1ae57a;
        }
      }
    }
    .main-box {
      display: flex;
      width: 100%;
      margin-top: 20px;
      // background-color: red;
      .main-box-left {
        display: inline-block;
        width: 10%;
        // background-color: olivedrab;
      }
      .main-box-right {
        display: inline-block;
        width: 100%;
        height: 100%;

        .r-table {
          max-height: calc(100% - 170px);
          // overflow: scroll;
          // overflow-x: hidden;
          // background-color: orange;
          img {
            width: 100%;
          }
          .el-image-viewer__close {
            top: 10%;
            right: 27%;
          }
        }
      }
    }
  }
  /deep/.el-drawer__header {
    margin: 0;
    padding: 0;
    padding-top: 20px;
    //    margin-top: 20px;
  }
}
.imgInfo {
  display: flex;
  .imgSize{
      display: none;
  }
  .manualImg {
    background: #ee9a00;
    color: #fff;
    padding: 4px;
  }
  .imgTime {
    padding-left: 5%;
    line-height: 24px;
    color: #fff;
  }
  .imgSize {
    line-height: 24px;
    margin: 0 5px;
  }
  .automaticImg {
    color: #ee9a00;
    padding: 4px;
    border: 1px solid #ee9a00;
  }
  .operate-btn {
    margin-left: 10px;
    cursor: pointer;
  }
}

.block {
  /deep/ .el-timeline-item__node {
    font-size: 16px;
    background-color: rgb(155, 155, 155);
  }
  /deep/ .el-timeline-item {
    padding-bottom: 60px;
  }
}
.activity {
  font-size: 14px;
  cursor: pointer;
}
.activity-color-default {
  color: rgb(155, 155, 155);
}
.activity-color-blue {
  color: #0186e7;
}
</style>
