<template>
  <div class="image-detection">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图像管理</el-breadcrumb-item>
        <el-breadcrumb-item>图像质量检测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="image-detection-body" ref="viewbox">
      <div class="image-detection-tree">
        <el-tree
          :data="UserOrgTree"
          node-key="organizationId"
          :props="{
            children: 'childList',
            label: 'organizationName',
          }"
          :default-expanded-keys="idArr"
          ref="tree"
          @node-click="handleTreenode"
        >
          <span
            class="custom-tree-node organize-box"
            slot-scope="{ node, data }"
          >
            <span class="space-l">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="image-detection-right">
        <div class="image-detection-search">
          <search-form
            ref="form"
            :options="searchForm"
            class="image-detection-search-form"
          ></search-form>
          <div class="image-detection-search-btn">
            <el-button type="primary" size="mini" @click="doSearch"
              >搜索</el-button
            >
            <el-button size="primary" @click="doClear" class="reset"
              >重置</el-button
            >
            <el-button type="primary" size="mini" @click="exportData"
              >数据导出</el-button
            >
          </div>
        </div>
        <div class="image-detection-table">
          <div class="total-error">
            <span class="totalNormal"
              >正常：{{ totalError.onlineCount }}({{
                totalError.onlineRatio
              }})</span
            >
            <span class="totalAbnormal"
              >异常:{{ totalError.errorCount }}({{
                totalError.errorRatio
              }})</span
            >
            <span class="totalOffline"
              >离线：{{ totalError.offlineCount }}({{
                totalError.offlineRatio
              }})</span
            >
          </div>
          <camera-table
            ref="table"
            :options="tableOptions"
            @on-change-page="changeCurrentPage"
            @on-page-size-change="changePageSize"
          ></camera-table>
        </div>
      </div>
    </div>
    <camera-play-dialog
      v-if="playerDialogVisible"
      :visible.sync="playerDialogVisible"
      :cameraInfo="playerCamera"
      :cameraId="cameraId"
      ref="cameraVideo"
    ></camera-play-dialog>
    <report-dialog
      v-if="reportDialogVisible"
      :visible.sync="reportDialogVisible"
      :cameraId="cameraId"
      :event="queryData"
      ref="cameraReport"
    ></report-dialog>
    <submit-report-dialog
      v-if="submitReportDialog"
      :visible.sync="submitReportDialog"
      :cameraId="cameraId"
      ref="cameraReport"
    ></submit-report-dialog>
  </div>
</template>
<script>
import searchForm from "../../form/index";
import cameraTable from "../../table/table";
import reportDialog from "./reportDialog";
import submitReportDialog from "./submitReportDialog";

import CameraPlayDialog from "../CameraManage/CameraPlayDialog";
import { mapState, mapActions } from "vuex";
export default {
  components: { searchForm, cameraTable, CameraPlayDialog,reportDialog ,submitReportDialog},
  data() {
    let height = document.documentElement.clientHeight - 300;
    var _this = this;
    return {
      playerDialogVisible: false,
      reportDialogVisible:false,
      submitReportDialog:false,
      jurisdictionValue: "",
      regionCode: "",
      totalError: 12,
      idArr: [],
      searchForm: {
        model: {},
        cols: 3,
        size: "mini",
        formItemList: [
          {
            label: "异常类型",
            placeholder: "异常类型",
            type: "select",
            name: "faultType",
            optionsList: [
              {
                id: "1",
                name: "在线检测",
              },
              {
                id: "2",
                name: "丢失检测",
              },
              {
                id: "3",
                name: "遮挡检测",
              },
              {
                id: "4",
                name: "清晰度检测",
              },
              {
                id: "7",
                name: "噪声检测",
              },
              {
                id: "6",
                name: "冻结检测",
              },
              {
                id: "5",
                name: "亮度检测",
              },
              {
                id: "8",
                name: "闪烁检测",
              },
              {
                id: "9",
                name: "滚动条检测",
              },
            ],
          },
          {
            label: "所属路线",
            placeholder: "所属路线",
            type: "select",
            name: "roadCode",
            optionsList: [],
          },
          {
            label: "管辖单位",
            placeholder: "管辖单位",
            type: "cascader",
            name: "organizationId",
            optionsList: [],
          },
          {
            label: "",
            placeholder: "日期",
            type: "daterange",
            name: "createDateStart",
            optionsList: [],
          },
          
        ],
      },
      selectedNodeData: null,
      tableOptions: {
        pageNumber: 1,
        pageSize: 10,
        selection: true,
        localData: [],
        border: true,
        uniqueId: "cameraId",
        total: 0,
        selectionCache: true,
        maxHeight: height,
        columns: [
          //     {
          //     key: 'sort',
          //     title: '序号',
          // },
          {
            key: "cameraName",
            title: "摄像机名称",
            showOverflowTooltip: true,
          },
          {
            key: "detectTime",
            title: "检测时间",
          },
          {
            key: "oneStatus",
            title: "在线检测",
            render: (h, { row }) => {
              let iconclass =
                row.oneStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "twoStatus",
            title: "丢失检测",
            render: (h, { row }) => {
              let iconclass =
                row.twoStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "threeStatus",
            title: "遮挡检测",
            render: (h, { row }) => {
              let iconclass =
                row.threeStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "fourStatus",
            title: "清晰度检测",
            render: (h, { row }) => {
              let iconclass =
                row.fourStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "fiveStatus",
            title: "亮度检测",
            render: (h, { row }) => {
              let iconclass =
                row.fiveStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "sixStatus",
            title: "冻结检测",
            render: (h, { row }) => {
              let iconclass =
                row.sixStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "sevenStatus",
            title: "噪声检测",
            render: (h, { row }) => {
              let iconclass =
                row.sevenStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "eightStatus",
            title: "闪烁检测",
            render: (h, { row }) => {
              let iconclass =
                row.eightStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },
          {
            key: "nineStatus",
            title: "滚动条检测",
            render: (h, { row }) => {
              let iconclass =
                row.nineStatus == 1
                  ? "el-icon-warning-outline yellow"
                  : "el-icon-circle-check green";
              return <i class={iconclass}></i>;
            },
          },{
            key: "errorReason",
            title: "异常原因",
            width:"200px",
            render: (h, { row }) => {
              return <p>{ row.errorReason }</p>;
            },
          },
          {
            key: "operation",
            width: "120px",
            title: "操作",
            render: (h, { row }) => {
              
              return [
                h(
                  "i",
                  {
                   class: "iconfont iconbofang",
                   style: {
                      padding:"0 4px",
                      color: "#409EFF",
                      textAlign: "center",
                      float: "left",
                    },
                    on: {
                      click: () => {
                        _this.playVideo(row, event);
                      },
                    },
                  },
                ),
                h(
                  "i",
                  {
                    class: "iconfont iconxiugai",
                    style: {
                      padding:"0 4px",
                      color: "#409EFF",
                      textAlign: "center",
                      float: "left",
                    },
                    on: {
                      click: () => {
                        _this.reportEditClick(row, event);
                      },
                    },
                  }
                ),
                h("i", {
                  class:"iconfont iconshangbao",
                  style: {
                    padding:"0 4px",
                    color: "#409EFF",
                    textAlign: "center",
                    float: "left",
                  },
                  on: {
                    click: () => {
                      _this.reportClick(row, event);
                    },
                  },
                }),
              ];
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["UserOrgTree"]),
  },
  created() {
    //         queryQualityCount,
    //   queryQualityList,
    //   exportQuality,
    this.getUserOrganization();
    this.queryData();
    this.queryQualityCount();
    this.queryRoadList();
  },
  methods: {
    ...mapActions(["getUserOrganization"]),
    // 播放视频
    playVideo(row, event) {
      this.playerCamera = row;
      this.cameraId = row.cameraId;
      this.playerDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.cameraVideo.getVideoUrlToPlay(row);
      });
    },
    //上报编辑
    reportEditClick(row, event) {
     console.log(row, event, "row, column, event");
      this.playerCamera = row;
      this.cameraId = row.cameraId;
      this.reportDialogVisible = true;
    },
    reportClick(row, event){
      console.log(row, event)
      this.playerCamera = row;
      this.cameraId = row.cameraId;
      this.submitReportDialog = true
    },
    
    // 获取路线
    queryRoadList() {
      let _this = this;
      this.$api
        .getRoadsByOrgId()
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _.each(_this.searchForm.formItemList, (it) => {
            if (it.name === "roadCode") {
              it.optionsList = _.map(data.data, (item) => {
                return {
                  id: item.roadCode,
                  name: item.roadName,
                  ...item,
                };
              });
            }
          });
        })
        .catch(() => {});
    },
    getParams() {
      let params = {};
      console.log("参数1", params, this.searchForm.model);
      _.each(this.searchForm.model, (it, key) => {
        if (Array.isArray(it)) {
          console.log("arr", it, key);
          if (key === "createDateStart") {
            params["createDateStart"] = this.timeFormat(it[0]);
            params["createDateEnd"] = this.timeFormat(it[1]);
          }
        } else {
          if (it && !_.isNumber(it) && it.trim()) {
            params[key] = it;
          } else if (it && _.isNumber(it)) {
            params[key] = it;
          }
        }
      });
      console.log("参数2", params);
      if (this.selectedNodeData) {
        if (this.selectedNodeData.updateAndDel) {
          params.regionCode = this.selectedNodeData.regionCode;
        } else {
          params.organizationId = this.selectedNodeData.organizationId;
        }
      }
      return {
        currPage: this.tableOptions.pageNumber,
        pageSize: this.tableOptions.pageSize,
        ...params,
      };
    },
    queryData() {
      var params = this.getParams();
      this.$api.queryQualityList(params).then((res) => {
        if (res.code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.tableOptions.localData = _.map(res.data, (it, index) => {
          return {
            sort: index + 1,
            ...it,
          };
        });
        this.tableOptions.total = res.total;
      });
    },
    exportData() {
      let params = this.getParams();
      this.$api.exportQuality(params).then((res) => {
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(res); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "图像质量检测.xlsx"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    queryQualityCount() {
      let params = this.getParams();
      this.$api.queryQualityCount(params).then((res) => {
        this.totalError = res.data;
      });
    },
    doSearch() {
      this.tableOptions.pageNumber = 1;
      this.queryData();
      this.queryQualityCount();
    },
    doClear() {
      this.tableOptions.pageNumber = 1;
      this.searchForm.model = {};
      this.regionCode = "";
      this.queryData();
      this.queryQualityCount();
    },
    handleTreenode(node) {
      this.selectedNodeData = node;
      this.regionCode = node.regionCode;
      this.queryData();
      this.queryQualityCount();
    },
    changeCurrentPage(page) {
      this.tableOptions.pageNumber = page;
      this.queryData();
    },
    changePageSize(size) {
      this.tableOptions.pageSize = size;
      this.tableOptions.pageNumber = 1;
      this.queryData();
    },
    // 转换时间格式 yyyy-MM-dd hh:mm:ss
    timeFormat(time) {
      let date = new Date(time);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      return y + "-" + m + "-" + d + " " + h + ":" + minute;
    },
  },
};
</script>
<style lang="less">
.image-detection {
  .image-detection-body {
    border-radius: 4px;
    display: flex;
    height: calc(100vh - 70px - 48px - 20px);
    background: #fff;
    margin-top: 12px;
    .image-detection-search-form {
      width: calc(100% - 230px);
    }
    .image-detection-tree {
      width: 25%;
      border-right: 1px solid #ddd;
      height: 100%;
      overflow-y: auto;
      padding: 12px;
    }
    .image-detection-right {
      padding: 16px;
      width: 75%;
      .image-detection-search {
        display: flex;
        .image-detection-search-btn {
          display: flex;
          width: 230px;
          padding-left: 20px;
          box-sizing: border-box;
          .reset {
            span {
              color: #fff;
            }
          }
        }
      }
    }
    .total-error {
      .totalNormal {
        color: #2472f0;
        padding-right: 10px;
      }
      .totalAbnormal {
        color: #ee4a4a;
        padding-right: 10px;
      }
      .totalOffline {
        color: #757575;
        padding-right: 10px;
      }
      margin-bottom: 12px;
      .total-margin {
        margin: 0 12px 12px 0;
      }
    }
    .yellow {
      color: #e6a23c;
      font-size: 16px;
    }
    .green {
      color: #1ae57a;
      font-size: 16px;
    }
  }
  .el-table__row .cell i{
      font-size: 20px;
  }
}

</style>