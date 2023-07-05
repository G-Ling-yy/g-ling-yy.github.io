<template>
  <div>
    <el-form class="demo-form-inline">
      <!-- <el-form-item label="日期:">
        <el-date-picker
          class="date-picker"
          v-model="searchInfo.selectDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item> -->
      <!-- <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"> -->
          <!-- <el-form-item label="日期:" v-if="reporyType == 'day'">
            <el-date-picker class="date-picker" v-model="searchInfo.selectDate" type="date" value-format="yyyy-MM-dd"
              placeholder="选择日期"></el-date-picker>
          </el-form-item> -->
          <el-form-item label="日期:" v-if="reporyType == 'week'">
            <el-date-picker v-model="searchInfo.selectDate" type="week" format="yyyy 第 WW 周" placeholder="选择周">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="日期:" v-if="reporyType == 'day' || reporyType == 'month'">
            <el-date-picker v-show="false" v-model="searchInfo.selectDate" type="daterange" format="yyyy-MM-dd"
              range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-date-picker v-model="searchInfo.selectDate" type="daterange" format="yyyy-MM-dd" range-separator="~"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

      <el-form-item>
        <el-button type="primary" class="query" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" class="reset" @click="resetSearch"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <div class="table-content-body">
      <el-table
        class="custom-cloud-table"
        height="100%"
        ref="multipleTable"
        :data="dailyList.dayList"
        border
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column
          prop="reportName"
          label="名称"
          width="460"
        ></el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="接收时间"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <img
                src="../../../../assets/images/icon/info.png"
                @click="handleDetail(scope.row)"
                style="width:24px; height:24px"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog 
      title="运维报告"
      :visible.sync="dialogVisible"
      width="80%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="reporyClose"
      >

        <!-- 内容主体 -->
    <div class="textView-wrapper">
      <h1 class="x"></h1>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="reporyType === 'day'">运维日报</span>
          <span v-else-if="reporyType === 'week'">运维周报</span>
          <span v-else-if="reporyType === 'month'">运维月报</span>
          <el-button
            type="primary"
            style="float:right;height:30px"
            @click="exportReport"
            >导出报表</el-button
          >
        </div>
        <!-- 文本容器 -->
        
        <div id="mainRight">
        <!-- 表格容器 -->
        <div class="table-wrapper">
          
          
          <div class="tablebox_body" v-if="true">
            <div id="table-content">
              <el-table
                :data="listData"
                style="width: 100%"
                border
                :span-method="objectSpanMethod"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                  >
                  </el-table-column>
                <el-table-column
                  v-for="col in cols"
                  :key="col.index"
                  :prop="col.prop"
                  :label="col.label"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        
            <!-- 数据可视化容器 -->
            <div class="dataVisual-wrapper" v-if="reporyType === 'week' || reporyType === 'month'" >
                <div class="dataVisual_top" v-if="false" >
                    <!-- <span>各省 / 各公司运维统计</span> -->
                    
                </div>
                    <div class="dataVisual_body" >
                      <!-- <reportEchart ref="reportEchart" :companyReportId="companyReportId" :reporyType="reporyType" ></reportEchart> -->
                    </div>
            </div>
        </div>
      </el-card>
    </div>
    </el-dialog>
    <div class="table-pagination">
	    <p class="total-pagination">共{{total}}条</p>
      <el-pagination
        background
        :current-page="currentPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
// import reportEchart from './reportEchart';

export default {
  // components: {reportEchart},

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      activeName: "day",
      searchInfo: {
        selectDate: ""
      },
      dailyList: {
        // 日报的当前页
        dailyCurrentPage: 1,
        dailyPageSize: 10,
        dailyTotal: 80,
        // 运行数据列表
        dayList: []
      },
      // 时间参数
      postData: {
        startDate: '', // 开始时间
        endDate: ''  //  结束时间
      },
     
      companyReporyData: {},
      companyReportId: '', // 各路公司id
      deriveName: '', // 导出文件名
      dialogVisible: false,
      // 接入情况总览
      insertCase: {
        departmentRate: {}, // 公司在线率排名信息
        extReport: {}, // 扩展信息
        extRoadReport: [], // 路线信息
      },
      cols: [],//合并表格头
      listData: [],//数据列表
      spanArr: [], // 第一列合并数据
      spanArrtwin: [],// 第二列合并数据
      spanArrThree: [],// 第三列合并数据
      columnKey: [],
      defColums: [
        {
          prop: "organizationName",
          label: "路段单位",
        },
        // {
        //   prop: "estimateQuantity",
        //   label: "应接入量",
        // },
        {
          prop: "realQuantity",
          label: "实际接入量",
        },
        //   {
        //   prop: "ratio",
        //   label: "接入率",
        // },
          {
          prop: "onlineQuantity",
          label: "在线数量",
        },
          {
          prop: "onlineRatio",
          label: "在线率",
        },
      ],
    };
  },
  props: {
    reporyType: {
      type: String,
      default: 'day'
    },
    // dataList: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  created() {
  },
  mounted() {
    this.getReportList();
  },
  destroyed() {},
  watch: {
    "reporyType" (newVal, oldVal) {
      console.log(343435345)
       this.getReportList();
    }
  },
  methods: {
    // 获取运维报告
    getReportList() {
      console.log('类型', this.reporyType)
      let obj = {
        type:this.reporyType,
        data: {
          pageSize: this.pageSize,
          currPage: this.currentPage,
          startDate: this.postData.startDate,
          endDate: this.postData.endDate,
          reportType: 'S',
          proOrganizationId: JSON.parse(localStorage.getItem("cloudplatform")).organizationId // 组织id
        }
      };
      this.$api.queryCameraReportList (obj).then(res => {
        if (res.code == 200) {
          console.log('运维报告data', res.data)
          this.dailyList.dayList = res.data;
          this.total = res.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取各路公司运维表
    getCompanyReporyList () {
        console.log('公司类型', this.reporyType)
      let obj = {
        type:this.reporyType,
        data: {
          reportId: this.companyReportId
        }
      };
      this.$api.queryCameraReportGroupDetail (obj).then(res => {
        if (res.code == 200) {
          this.companyReporyList = res.data.details;
          this.companyReporyData = res.data
          console.log('公司数据', this.companyReporyData)
        } else {
          this.$message.error(res.message);
        }
      });
    },
  
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSearch() {
      this.currentPage = 1
      console.log('时间', this.searchInfo)
      if (this.searchInfo.selectDate.length) {
          this.postData.startDate = moment(this.searchInfo.selectDate[0]).format('YYYY-MM-DD'); //开始时间
          this.postData.endDate = moment(this.searchInfo.selectDate[1]).format('YYYY-MM-DD');   //结束时间
          this.getReportList()
        }

      if (Array.isArray(this.searchInfo.selectDate)) {
        if (this.searchInfo.selectDate.length) {
          this.postData.startDate = moment(this.searchInfo.selectDate[0]).format('YYYY-MM-DD'); //开始时间
          this.postData.endDate = moment(this.searchInfo.selectDate[1]).format('YYYY-MM-DD');   //结束时间
          this.getReportList()
        }
      } else {
        this.postData.startDate = this.searchInfo.selectDate ? moment(this.searchInfo.selectDate).format('YYYY-MM-DD') : '';
        if (this.reporyType === 'week') {
          let last_monday = moment(moment(this.postData.startDate) + 3600 * 1000 * 24 * 7).format('YYYY-MM-DD');
          this.postData.endDate = last_monday;
        } else {
          this.postData.endDate = this.searchInfo.selectDate ? moment(this.searchInfo.selectDate).format('YYYY-MM-DD') : '';

        }
        this.getReportList()
      }
    },
    resetSearch() {
      this.currentPage = 1
      this.searchInfo.selectDate = "";
      this.postData.startDate = "";
      this.postData.endDate = "";
      this.getReportList();
    },
    handleDetail(row) {
      console.log('当前行的数据' + this.reporyType, row )
      this.companyReportId = row.id
      this.deriveName = row.reportName
      this.dialogVisible = true;
      this.getCompanyReporyList()
      this.queryCqCameraAccessList();
      // this.getInsertCaseList()
    },
    // 导出运维报告
    exportReport(){
       console.log('导出运维报告', this.reporyType)
      let obj = {
        type:this.reporyType,
        data: {
          reportId: this.companyReportId
        }
      };
      this.$api
        .exportCqCameraReportList(obj)
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.deriveName +".xlsx"; // 下载后文件名

          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "导出失败",
            type: "error"
          });
      });
    },
    // 获取运维报告详情
    queryCqCameraAccessList () {
      console.log(21324)
        let obj = {
        type:this.reporyType,
        data: {
          reportId: this.companyReportId
        }
      };
        var _this = this;
        _this.listData = [];
        this.$api.queryCqCameraAccessList(obj).then((res) => {
          if (res.code == 200) {
            var list = res.data;
            console.log(list, "list");
            _this.parseOrgData(list, 0, {});
          }
          console.log(_this.listData, "listdata");
          this.spanArr = _this.rowspan(0,0) //合并第一列
          // this.spanArrtwin = _this.rowspan(1,0) //合并第二列
          // this.spanArrThree = _this.rowspan(2,0) //合并第三列
          // _this.rowspan();
        });
    },
    
    // 表格配置项
    initColumn() {
      this.cols = [];
      this.columnKey.forEach((it, i) => {
        this.cols.push({ prop: it, label: "业主单位"});
      });
      this.defColums.forEach((it, i) => {
        this.cols.push(it);
      });
      console.log(this.cols, "cols");
    },
    // 处理组织树数据
    parseOrgData(orgs, level, p) {
      var k = "parentOrganizationName_" + level;

      orgs.forEach((org, i) => {
        if (org.organizationType == undefined ||org.organizationType <= 100) {
          var param = {};
          for (var j in p) {
            param[j] = p[j];
          }
          if (org.organizationType) {
            if (this.columnKey.indexOf(k) < 0) {
              this.columnKey.push(k);
            }
            param[k] = org.parentOrganizationName;
          }
          if (org.children && org.children.length > 0) {
            this.parseOrgData(org.children, level + 1, param);
          } else {
            //底层组织
            for (var j in param) {
              org[j] = param[j];
            }
            this.listData.push(org);
          }
        }
      });
    },
    // 合并单元格表格数据
    rowspan(columnIndex, position) {
      let spanArr = []
      position = 0
      var _this = this;
      this.initColumn();
      this.listData.forEach((item, index) => {
        console.log(item,index,'tab item')
        if (index === 0) {
          spanArr.push(1);
          position = 0;
        } else {
          console.log()
          var k=_this.columnKey[columnIndex]
          console.log(k,this.listData[index][k])
          if (
            this.listData[index][k] ===
            this.listData[index - 1][k]
          ) {
            spanArr[position] += 1;
            spanArr.push(0);
          } else {
            spanArr.push(1);
            position = index;
          }
        }
      });
      return spanArr
    },
    // 合并单元格
     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 表格合并行 第一列
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
       //表格合并行 第二列
      // if (columnIndex === 2) {
      //   const _row = this.spanArrtwin[rowIndex];
      //   const _col = _row > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   };
      // }
      // //  //表格合并行 第三列
      // if (columnIndex === 3) {
      //   const _row = this.spanArrThree[rowIndex];
      //   const _col = _row > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   };
      // }
    },
    /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
      this.currentPage = val;
      this.getReportList();
    },

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      this.pageSize = index;
      this.currentPage = 1;

      this.getReportList();
    },
    reporyClose () {
      this.dialogVisible = false
      if (this.reporyType === 'week' || this.reporyType === 'month') {
        this.$refs.reportEchart.reporyClose()
      }
    }
    
  }
};
</script>
<style lang="less">
    .text_box {
      .current-text {
        width: 100%;
        margin-bottom: 10px;
        // background-color: pink;
        // height: 600px;
          .current-text-details {
            line-height: 40px;
          }
          span {
            color: #108EE9;
          }
          strong {
            font-weight: normal;
          }
          i {
            color: black;
          }
      }
    }
</style>