<template>
  <div class="content-wrapper streamMediaManage" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图像管理</el-breadcrumb-item>
        <el-breadcrumb-item>事件分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-search-display camera-manage-search">
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item prop="typeName">
            <el-select
              v-model="postData.typeName"
              placeholder="事件类型"
              clearable
              style="width: 100px;"
            >
              <el-option
                v-for="item in featureOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属路线:">
                <el-select
                  v-model="postData.roadCode"
                  filterable
                  :class="postData.roadCode ? 'input-selected' : ''"
                  placeholder="路线"
                  clearable
                  style="width:100px"
                >
                  <el-option label="请选择" value></el-option>
                  <el-option
                    v-for="(item,index) in roadList"
                    :key="index"
                    :label="item.roadCode + ` ` + item.roadName"
                    :value="item.roadCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
            <el-date-picker
              v-model="postData.operationDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 360px;"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="query"
            >搜索</el-button
          >
          <el-button type="primary" class="reset" @click="clearData"
            >重置</el-button
          >
        <el-button type="primary" style="margin-left: 10px" plain class="query" @click="eventDownload">数据导出</el-button>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          :data="eventListData"
          border
          height="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column prop="sj" label="报送时间" width></el-table-column>
          <el-table-column prop="sjgk" label="事件描述" width></el-table-column>
          <el-table-column prop="roadName" label="所属路线" width></el-table-column>
          <el-table-column prop="sjdd" label="具体位置" width></el-table-column>
          <el-table-column prop="typeName" label="事件类型"></el-table-column>
          <el-table-column
            label="状态"
            width
          >
            <template slot-scope="scope">
                <div>{{ scope.row.czzt == 1 ? "已处理" : scope.row.czzt == 0 ?"正在处理":""}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template class slot-scope="scope">
              <div class="img-con">
                <el-button
                    class="table-control-btn"
                    type="primary"
                    icon="el-icon-document"
                    size="mini"
                    @click="details(scope.row)"
                  ></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <p class="total-pagination">共{{streamMediaTotal}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="changePageSize"
          @current-change="changeCurrentPage"
          :current-page="postData.currPage"
          :page-size="postData.pageSize"
          :total="streamMediaTotal"
        ></el-pagination>
      </div>
    </div>
    

    
    <!-- 详情弹窗 -->
    <detailsDialog
      ref="eventRowData"
      :visible.sync="dialogTableVisible"
    ></detailsDialog>
     
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import detailsDialog from "./eventDetails.vue";

export default {
  name: "streamMedia",
  components: {
    detailsDialog
  },
  data() {
    return {
      isAllHeight: 0,
      roadList: [],
      tableData: {},
      postData: {
        currPage: 1,
        pageSize: 10,
        roadCode:"",
        typeName: "",
        operationDate:""
      },
      streamMediaTotal: 0,
      vendors: [],
      eventListData: [],
      dialogTableVisible: false,
      transcodingBindSmId: 0,
      featureOptions: [],
      eventRowData: null,
    };
  },
  mounted() {
      this.query()
      this.queryRoadList()
      this.eventTypeList()
  },
  computed: {
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.postData.pageSize * (this.postData.currPage - 1);
    },
    details(row) {
      this.eventRowData = row
      this.$refs.eventRowData.eventDetails(row)
      this.dialogTableVisible = true;
    },
    query() {
      let data = {
        currPage: this.postData.currPage,
        pageSize: this.postData.pageSize,
        roadId: this.postData.roadCode,
        typeName: this.postData.typeName,
        startTime	: this.postData.operationDate === null ? '' : this.postData.operationDate[0],
        endTime:  this.postData.operationDate === null ? '' : this.postData.operationDate[1],
      }
      this.$api.eventList(data).then(res => {
        if (res.code == 200) {
          this.pageSize=res.pageSize;
          this.streamMediaTotal = res.total;
          this.eventListData = res.data
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //事件类型
    eventTypeList() {
      let data = {}
      this.$api.eventType(data).then(res => {
        if (res.code == 200) {
          this.featureOptions = res.data
          console.log(this.featureOptions,"this.featureOptions")
        } else {
          this.$message.error(res.message);
        }
      });
    },
    queryRoadList(orgId) {
      orgId = ''
      let _this = this;
      this.$api
        .getRoadsByOrgId({ regionCode: orgId + "" })
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.roadList = data.data;
        })
        .catch(() => {});
    },
    changePageSize(page) {
      this.postData.currPage = 1;
      this.postData.pageSize = page;
      this.query();
    },
    changeCurrentPage(page) {
      this.postData.currPage = page;
      this.query();
    },
    clearData() {
      this.postData.currPage = 1
      this.postData.roadCode = null
      this.postData.typeName = null
      this.postData.operationDate = null
      this.query();
    },
    // 事件导出
    eventDownload () {
         let params = {
              currPage: this.postData.currPage,
              pageSize: this.postData.pageSize,
              roadId: this.postData.roadCode,
              typeName: this.postData.typeName,
              startTime	: this.postData.operationDate === null ? '' : this.postData.operationDate[0],
              endTime:  this.postData.operationDate === null ? '' : this.postData.operationDate[1],
        };
        this.$api
        .eventDownload(params)
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "高速事件信息" +".xlsx"; // 下载后文件名

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
    }
  },
};
</script>
<style lang="less">
.streamMediaManage {
   .table-wrapper .table-content-body {
    max-height: calc(100% - 77px) !important;
  }
  .search-btn-right {
    width: 22%;
  }
}
</style>
