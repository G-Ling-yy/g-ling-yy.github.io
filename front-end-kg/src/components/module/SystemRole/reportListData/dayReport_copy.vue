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
          width="630"
        ></el-table-column>
        <el-table-column
          prop="reportReceive"
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
        <div class="text_box">
          <p>接入情况总览</p>
          <div class="current-text" v-if="reporyType === 'day'">
            <div class="current-text-details">本省<span>{{insertCase.extReport.departmentCount}}</span>个路公司共接入<span>{{insertCase.extReport.cameraCountDay}}</span>路视频资源，涉及{{insertCase.extRoadReport.length}}条路线：
                <strong v-for="(item, index) in insertCase.extRoadReport" :key="index">{{item.roadName}}<i>{{insertCase.extRoadReport.length-1 === index ? '。' : '、'}}</i></strong>
            </div>
            <div class="current-text-details">本省云平台累计接入视频<span>{{insertCase.extReport.cameraCount}}</span>路。视频在线率为<span>{{insertCase.extReport.cameraOnlineRate}}%</span>，较前一日上升<span>{{insertCase.extReport.cameraOnlineRateRaise}}%</span>。其中，平均在线率最高的三个公司为
            <span v-for="(item, index) in insertCase.departmentRate.tall" :key="'tall-' + index">{{item.departmentName}}<i>{{insertCase.departmentRate.tall.length-1 === index ? ',' : '、'}}</i></span>分别为
            <span v-for="(item, index) in insertCase.departmentRate.tall" :key="'tall_'+ index">{{item.onlineRate}}%<i>{{insertCase.departmentRate.tall.length-1 === index ? ';' : ','}}</i></span>
            平均在线率最低的三个公司为
             <span v-for="(item, index) in insertCase.departmentRate.low" :key="'low-' + index">{{item.departmentName}}<i>{{insertCase.departmentRate.low.length-1 === index ? ',' : '、'}}</i></span>分别为
            <span v-for="(item, index) in insertCase.departmentRate.low" :key="'low_'+ index">{{item.onlineRate}}%<i>{{insertCase.departmentRate.low.length-1 === index ? '。' : ','}}</i></span>
            </div>
            <div class="current-text-details">摄像机异常总数为<span>{{insertCase.extReport.abnormalCameraCount}}</span>，较前一日下降<span>{{insertCase.extReport.abnormalCameraRateDecline}}%</span>；离线总数为<span>{{insertCase.extReport.offlineCameraCount}}</span>，较前一日下降<span>{{insertCase.extReport.offlineCameraRateDecline}}%</span>。需进一步排查问题，确保联网视频传输稳定。</div>
          </div>

          <div class="current-text" v-if="reporyType === 'week'">
            <div class="current-text-details">本省<span>{{insertCase.extReport.departmentCount}}</span>个路公司共接入<span>{{insertCase.extReport.cameraCount}}</span>路视频资源，涉及<span>{{insertCase.extReport.roadCountWeek}}</span>条路线：
            <strong v-for="(item, index) in insertCase.extRoadReport" :key="index">{{item.roadName}}<i>{{insertCase.extRoadReport.length-1 === index ? '' : '、'}}</i></strong>等。
            </div>
            <div class="current-text-details">本省云平台累计接入视频<span>{{insertCase.extReport.cameraCount}}</span>路。视频在线率为<span>{{insertCase.extReport.cameraOnlineRate}}%</span>，其中，平均在线率最高的三个公司为
            <span v-for="(item, index) in insertCase.departmentRate.tall" :key="'tall-' + index">{{item.departmentName}}<i>{{insertCase.departmentRate.tall.length-1 === index ? ',' : '、'}}</i></span>分别为
            <span v-for="(item, index) in insertCase.departmentRate.tall" :key="'tall_'+ index">{{item.onlineRate}}%<i>{{insertCase.departmentRate.tall.length-1 === index ? ';' : ','}}</i></span>
            平均在线率最低的三个公司为
             <span v-for="(item, index) in insertCase.departmentRate.low" :key="'low-' + index">{{item.departmentName}}<i>{{insertCase.departmentRate.low.length-1 === index ? ',' : '、'}}</i></span>分别为
            <span v-for="(item, index) in insertCase.departmentRate.low" :key="'low_'+ index">{{item.onlineRate}}%<i>{{insertCase.departmentRate.low.length-1 === index ? '。' : ','}}</i></span>
            </div>
            <div class="current-text-details">摄像机异常发生数为<span>{{insertCase.extReport.abnormalCameraCount}}</span>，修复数为<span>{{insertCase.extReport.abnormalCameraRepaired}}</span>，修复率<span>{{insertCase.extReport.abnormalRepairedRate}}%</span>，修复率较前一周下降<span>{{insertCase.extReport.abnormalRepairedRateDecline}}%</span>；离线发生数为<span>{{insertCase.extReport.offlineCameraCount}}</span>，恢复上线数为<span>{{insertCase.extReport.offlineCameraRepaired}}</span>，修复率<span>{{insertCase.extReport.offlineRepairedRate}}%</span>，修复率较前一日下降<span>{{insertCase.extReport.offlineRepairedRateDecline}}%</span>。需进一步排查问题，确保联网视频传输稳定。</div>
          </div>

          <div class="current-text" v-if="reporyType === 'month'">
            <div class="current-text-details">本省<span>{{insertCase.extReport.departmentCount}}</span>个路公司共接入<span>{{insertCase.extReport.cameraCountMonth}}</span>路视频资源，涉及<span>{{insertCase.extReport.roadCountMonth}}</span>条路线：包括
            <strong v-for="(item, index) in insertCase.extRoadReport" :key="index">{{item.roadName}}<i>{{insertCase.extRoadReport.length-1 === index ? '' : '、'}}</i></strong>等。
            </div>
            <div class="current-text-details">本省云平台累计接入视频<span>{{insertCase.extReport.cameraCount}}</span>路。视频在线率为<span>{{insertCase.extReport.cameraOnlineRate}}%</span>，其中，平均在线率最高的三个公司为
              <span v-for="(item, index) in insertCase.departmentRate.tall" :key="'tall-'+index">{{item.departmentName}}<i>{{insertCase.departmentRate.tall.length-1 === index ? ',' : '、'}}</i></span>分别为
            <span v-for="(item, index) in insertCase.departmentRate.tall" :key="'tall_'+index">{{item.onlineRate}}<i>{{insertCase.departmentRate.tall.length-1 === index ? ';' : ','}}</i></span>
            平均在线率最低的三个公司为
             <span v-for="(item, index) in insertCase.departmentRate.low" :key="'low-'+index">{{item.departmentName}}<i>{{insertCase.departmentRate.low.length-1 === index ? ',' : '、'}}</i></span>分别为
            <span v-for="(item, index) in insertCase.departmentRate.low" :key="'low_'+index">{{item.onlineRate}}%<i>{{insertCase.departmentRate.low.length-1 === index ? '。' : ','}}</i></span>
           </div>
            <div class="current-text-details">摄像机异常发生数为<span>{{insertCase.extReport.abnormalCameraCount}}</span>，修复数为<span>{{insertCase.extReport.abnormalCameraRepaired}}</span>，修复率<span>{{insertCase.extReport.abnormalRepairedRate}}</span>，修复率较前一周下降<span>{{insertCase.extReport.abnormalRepairedRateDecline}}</span>；离线发生数为<span>{{insertCase.extReport.offlineCameraCount}}</span>，恢复上线数为<span>{{insertCase.extReport.offlineCameraRepaired}}</span>，修复率<span>{{insertCase.extReport.offlineRepairedRate}}</span>，修复率较前一日下降<span>{{insertCase.extReport.offlineRepairedRateDecline}}%</span>。需进一步排查问题，确保联网视频传输稳定。</div>
          </div>
        </div>
        <div id="mainRight">
        <!-- 表格容器 -->
        <div class="table-wrapper">
          <div class="tablebox_top">
            <span>各省 / 各公司运维表</span>
          </div>
          <div class="tablebox_body">
            <el-table 
              :data="companyReporyList"
               style="width: 100%" 
               border>
                <el-table-column 
                  prop="department" 
                  label="省份" 
                  width="100">
              </el-table-column>
              <el-table-column 
                prop="accessCount" 
                label="新接入量" 
                width="100">
              </el-table-column>

              <!-- 在线统计 -->
              <el-table-column label="在线统计">
                <el-table-column
                  prop="onlineCount"
                  label="在线数量"
                ></el-table-column>
                <el-table-column 
                  prop="onlineRate" 
                  label="在线率">
                  <template slot-scope="scope">
                    <div>{{ scope.row.onlineRate }}%</div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="reporyType === 'day'"
                  prop="onlineComparedWithYesterday"
                  label="较昨日"
                >
                </el-table-column>
                <el-table-column
                  v-if="reporyType === 'week'"
                  prop="onlineComparedWithLastweek"
                  label="较上周"
                >
                </el-table-column>
                <el-table-column
                  v-if="reporyType === 'month'"
                  prop="onlineComparedWithMonth"
                  label="较上月"
                >
                </el-table-column>
              </el-table-column>


                <!-- 离线统计  -->
              <el-table-column label="离线统计">
                <el-table-column
                  v-if="reporyType === 'week' || reporyType === 'month'"
                  prop="offlineCount"
                  label="离线发生数"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'week' || reporyType === 'month'"
                  prop="offlineRepaired"
                  label="已修复离线数"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'week' || reporyType === 'month'"
                  prop="currentOfflineCount"
                  label="离线量"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'day'"
                  prop="offlineCount"
                  label="离线量"
                ></el-table-column>
                <el-table-column 
                  prop="offlineRate" 
                  label="离线率">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.offlineRate }}%
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="reporyType === 'day'"
                  prop="offlineComparedWithYesterday"
                  label="较昨日"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'week'"
                  prop="offlineComparedWithWeek"
                  label="较上周"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'month'"
                  prop="offlineComparedWithMonth"
                  label="较上月"
                ></el-table-column>
              </el-table-column>

              <!-- 异常统计  -->
              <el-table-column label="异常统计">
                <el-table-column
                  v-if="reporyType === 'week' || reporyType === 'month'"
                  prop="abnormalCount"
                  label="异常发生数"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'week' || reporyType === 'month'"
                  prop="abnormalRepaired"
                  label="已恢复数"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'week' || reporyType === 'month'"
                  prop="currentAbnormalCount"
                  label="异常数"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'day'"
                  prop="abnormalCount"
                  label="异常数"
                ></el-table-column>
                <el-table-column
                  prop="abnormalRate"
                  label="异常率"
                >
                  <template slot-scope="scope">
                    <div>{{scope.row.abnormalRate}}%</div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="reporyType === 'day'"
                  prop="abnormalComparedWithYesterday"
                  label="较昨日"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'week'"
                  prop="abnormalComparedWithWeek"
                  label="较上周"
                ></el-table-column>
                <el-table-column
                  v-if="reporyType === 'month'"
                  prop="abnormalComparedWithMonth"
                  label="较上月"
                ></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
        
            <!-- 数据可视化容器 -->
            <div class="dataVisual-wrapper" v-if="reporyType === 'week' || reporyType === 'month'" >
                <div class="dataVisual_top"  >
                    <span>各省 / 各公司运维统计</span>
                    
                </div>
                    <div class="dataVisual_body" >
                      <reportEchart ref="reportEchart" :companyReportId="companyReportId" :reporyType="reporyType" ></reportEchart>
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
import reportEchart from './reportEchart';

export default {
  components: {reportEchart},

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
      companyReporyList: [
        {
          item: "江苏",
          newCon: "100",
          address: "上海市普陀区金沙江路 1518 弄",
          online:{
              num:"111",
              rate:"27%",
              comparedRate:"213",
          },
          offline:{
              num:"111",
              rate:"27%",
              comparedRate:"213",
          },
          inerror:{
              num:"111",
              rate:"27%",
              comparedRate:"213",
          },
        }
      ],
      companyReportId: '', // 各路公司id
      deriveName: '', // 导出文件名
      dialogVisible: false,
      // 接入情况总览
      insertCase: {
        departmentRate: {}, // 公司在线率排名信息
        extReport: {}, // 扩展信息
        extRoadReport: [], // 路线信息
      }
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
       this.getReportList();
    }
  },
  methods: {
    // 获取运维报告
    getReportList() {
      console.log('类型', this.reporyType)
      switch (this.reporyType) {
        case 'day': 
          this.getListDayReport()
          break;
        case 'week': 
          this.getWeekReport()
          break;
          case 'month': 
          this.getMonthReport()
          break;
        default:
          break;
      }
    },
    // 获取各路公司运维表
    getCompanyReporyList () {
        console.log('公司类型', this.reporyType)
      switch (this.reporyType) {
        case 'day': 
          this.getDayDepartment()
          break;
        case 'week': 
          this.getWeekDepartment()
          break;
          case 'month': 
          this.getMonthDepartment()
          break;
        default:
          break;
      }
    },
        // 接入情况总览
    getInsertCaseList () {
        console.log('接入情况总览', this.reporyType)
      switch (this.reporyType) {
        case 'day': 
          this.getDayInsertCase()
          break;
        case 'week': 
          this.getWeekInsertCase()
          break;
          case 'month': 
          this.getMonthInsertCase()
          break;
        default:
          break;
      }
    },
    // 运维报告日报列表
    getListDayReport () {
       let obj = {
        pageSize: this.pageSize,
        currPage: this.currentPage,
        startDate: this.postData.startDate,
        endDate: this.postData.endDate
      };
      this.$api.getListDayReport(obj).then(res => {
        if (res.code == 200) {
          this.dailyList.dayList = res.data;
          this.total = res.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
     // 运维报告周报列表
    getWeekReport  () {
       let obj = {
        pageSize: this.pageSize,
        currPage: this.currentPage,
        startDate: this.postData.startDate,
        endDate: this.postData.endDate
      };
      this.$api.getWeekReport (obj).then(res => {
        if (res.code == 200) {
          this.dailyList.dayList = res.data;
          this.total = res.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
     // 运维报告月报列表
    getMonthReport  () {
       let obj = {
        pageSize: this.pageSize,
        currPage: this.currentPage,
        startDate: this.postData.startDate,
        endDate: this.postData.endDate
      };
      this.$api.getMonthReport (obj).then(res => {
        if (res.code == 200) {
          this.dailyList.dayList = res.data;
          this.total = res.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
      // 各路公司信息运维报日报
    getDayDepartment   () {
       let obj = {
        reportId: this.companyReportId
      };
      this.$api.getDayDepartment  (obj).then(res => {
        if (res.code == 200) {
          this.companyReporyList = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
    },
      // 各路公司信息运维报周报
    getWeekDepartment   () {
       let obj = {
        reportId: this.companyReportId
      };
      this.$api.getWeekDepartment  (obj).then(res => {
        if (res.code == 200) {
          this.companyReporyList = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
    },
      // 各路公司信息运维报月报
    getMonthDepartment   () {
       let obj = {
        reportId: this.companyReportId
      };
      this.$api.getMonthDepartment  (obj).then(res => {
        if (res.code == 200) {
          this.companyReporyList = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
    },
        // 接入情况总览(日报)
    getDayInsertCase   () {
       let obj = {
        reportId: this.companyReportId
      };
      // 公司在线率排名信息
      this.$api.getDayDepartmentRate   (obj).then(res => {
        if (res.code == 200) {
            this.insertCase.departmentRate.tall = []
            this.insertCase.departmentRate.low = []
          if (res.data.length) {
            res.data.forEach(item => {
               if (item.rateType === '1'){
              this.insertCase.departmentRate.tall.push(item)
            } else {
              this.insertCase.departmentRate.low.push(item)
            }
            });
          }
        } else {
          this.$message.error(res.message);
        }
      });
       // 扩展信息
      this.$api.getDayExtReport    (obj).then(res => {
        if (res.code == 200) {
          if(res.data) {
            this.insertCase.extReport = res.data;
          }
          console.log('公司数据4353535', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
       //路线信息
      this.$api.getDayExtRoadReport(obj).then(res => {
        if (res.code == 200) {
          this.insertCase.extRoadReport = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
      console.log('接入情况总览'+this.reporyType, this.insertCase)
    },
      // 接入情况总览（周报）
    getWeekInsertCase   () {
             let obj = {
        reportId: this.companyReportId
      };
      // 公司在线率排名信息
      this.$api.getWeekDepartmentRate    (obj).then(res => {
        if (res.code == 200) {
           this.insertCase.departmentRate.tall = []
            this.insertCase.departmentRate.low = []
          if (res.data.length) {
            res.data.forEach(item => {
               if (item.rateType === '1'){
              this.insertCase.departmentRate.tall.push(item)
            } else {
              this.insertCase.departmentRate.low.push(item)
            }
            });
          }
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
       // 扩展信息
      this.$api.getWeekExtReport     (obj).then(res => {
        if (res.code == 200) {
          this.insertCase.extReport = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
       //路线信息
      this.$api.getWeekExtRoadReport     (obj).then(res => {
        if (res.code == 200) {
          this.insertCase.extRoadReport = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
      console.log('接入情况总览'+this.reporyType, this.insertCase)
    },
      // 接入情况总览（月报）
    getMonthInsertCase   () {
             let obj = {
        reportId: this.companyReportId
      };
      // 公司在线率排名信息
      this.$api.getMonthDepartmentRate    (obj).then(res => {
        if (res.code == 200) {
           this.insertCase.departmentRate.tall = []
            this.insertCase.departmentRate.low = []
          if (res.data.length) {
            res.data.forEach(item => {
               if (item.rateType === '1'){
              this.insertCase.departmentRate.tall.push(item)
            } else {
              this.insertCase.departmentRate.low.push(item)
            }
            });
          }
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
       // 扩展信息
      this.$api.getMonthExtReport     (obj).then(res => {
        if (res.code == 200) {
          this.insertCase.extReport = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
       //路线信息
      this.$api.getMonthExtRoadReport     (obj).then(res => {
        if (res.code == 200) {
          this.insertCase.extRoadReport = res.data;
          console.log('公司数据', res.data)
        } else {
          this.$message.error(res.message);
        }
      });
      console.log('接入情况总览'+this.reporyType, this.insertCase)
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
      this.companyReportId = row.reportId
      this.deriveName = row.reportName
      this.dialogVisible = true;
      this.getCompanyReporyList()
      this.getInsertCaseList()
    },
    // 导出运维报告
    exportReport(){
       console.log('导出运维报告', this.reporyType)
      switch (this.reporyType) {
        case 'day': 
          this.exportDayDetail()
          break;
        case 'week': 
          this.exportWeekDetail()
          break;
          case 'month': 
          this.exportMonthDetail()
          break;
        default:
          break;
      }
    },
    // 导出日报信息
     exportDayDetail(){
         let params = {
              reportId: this.companyReportId
        };
      this.$api
        .exportDayDetail(params)
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
     // 导出周报信息
     exportWeekDetail(){
         let params = {
              reportId: this.companyReportId
        };
      this.$api
        .exportWeekDetail(params)
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
     // 导出月报信息
     exportMonthDetail(){
         let params = {
              reportId: this.companyReportId
        };
      this.$api
        .exportMonthDetail(params)
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