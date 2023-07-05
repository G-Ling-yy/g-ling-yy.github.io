<template>
  <div class="content-wrapper" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>图像质量</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-search-display camera-manage-search">
      <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
        <el-form :inline="true">
          <el-form-item label="摄像机名称">
            <el-input placeholder="摄像机名称" v-model="searchFormData.cameraName" style="width: 120px;"></el-input>
          </el-form-item>
          <!--<el-form-item label="错误类型">
          <el-select placeholder="错误类型" style="width: 160px;"  v-model="searchFormData.errorType">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchFormData.param3"
            size="mini"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          </el-form-item>-->
          <!-- <el-form-item>
          <el-button type="primary" class="query" @click="queryList">查询</el-button>
          <el-button type="primary" class="reset" @click="queryList">重置</el-button>
          </el-form-item>-->
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="queryList">查询</el-button>
          <el-button type="primary" class="reset" @click="queryList">重置</el-button>
        </div>
      </div>
    </div>
    <div class="table-wrapper table-wrapper-exthend">
      <div class="table-control">
        <div class="tab-wrapper">
          <div @click="$router.push({ path: '/deviceCameraManage' })">摄像机管理</div>
          <div @click="$router.push({ path: '/deviceGroupManage' })">摄像机组管理</div>
          <!-- <div @click="$router.push({ path: '/borrow' })">借阅审核</div> -->
          <div class="active">图像质量</div>
        </div>
        <div style="height: 30px;"></div>
      </div>
      <!--<div class="table-control">
        <el-button type="primary" plain class="query" @click="dialogVisible = true">新增</el-button>
        <el-button type="primary" plain class="query">数据导出</el-button>
        <el-button type="primary" plain class="query">数据导入</el-button>
       
      </div>-->
      <!-- table-exthend -->
      <div class="table-content-body table-exthend">
        <el-table class="custom-cloud-table" :data="detectionList" height="100%" border>
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="cameraName" label="摄像机名称"></el-table-column>
          <el-table-column prop="astatus" label="丢失检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.astatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="cstatus" label="遮挡检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.cstatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="dstatus" label="清晰度检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.dstatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="estatus" label="亮度检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.estatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="fstatus" label="冻结检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.fstatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="gstatus" label="噪声检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.gstatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="hstatus" label="闪烁检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.hstatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="istatus" label="滚动条纹检测" align="center">
            <template slot-scope="scope">
              <i
                class="status-icon el-icon-circle-check text-info"
                v-if="scope.row.istatus === '0'"
              ></i>
              <i class="status-icon el-icon-warning text-warning" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="检测时间">
            <template slot-scope="scope">
              {{
              Utils.date(
              "Y-m-d H:i:s",
              Date.parse(scope.row.createTime) / 1000
              )
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <p class="total-pagination">共{{pageTotal}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="pageTotal"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import QS from "qs";
export default {
  name: "tableDemo",
  data() {
    return {
      isAllHeight: 0,
      pageTotal: 0,
      pageSize: 10,
      detectionList: [],
      currentPage: 0,
      searchFormData: {
        cameraName: ""
        /*errorType:"",
          roadId:"",
          regionCode:"",
          cameraType:"",
          organizationId:"",*/
      }
    };
  },
  mounted() {
    /*for(let i=0; i < 30; i++){
        console.info("tableData  ", i);
        this.tableData.pui({
          key: i,
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        });
      }*/

    this.$nextTick(() => {
      this.getList(1, 10);
    });
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    getList(currPage, pageSize) {
      // this.searchFormData.cameraName
      let cameraname = { cameraName: this.searchFormData.cameraName };
      this.$http
        .post(
          "/device/camera/findCameraStatusDetection?" +
            QS.stringify({
              currPage: currPage,
              pageSize: pageSize
            }),
          cameraname
        )
        .then(response => {
          let res = response.data;
          console.info(res);
          if (res.code === 200) {
            this.detectionList = JSON.parse(JSON.stringify(res.data));
            this.pageTotal = res.total;
            // if (res.total <= 10) {
            //   this.showPagination = false;
            // }
          }
        });
    },
    queryList() {
      this.currentPage = 1;
      this.getList(1, this.pageSize);
    },
    handleCurrentChange(val) {
      console.info("handleCurrentChange", val);
      this.currentPage = val;
      this.getList(val, this.pageSize);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getList(1, val);
      console.info("handleSizeChange", val);
    }
  }
};
</script>

<style lang="less">
.status-icon {
  font-size: 1.6rem;
}
</style>
