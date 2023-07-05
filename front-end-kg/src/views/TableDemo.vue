<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"
          ><i class="iconfont icondashboard"></i
        ></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="审批人">
          <el-input
            placeholder="审批人"
            v-model="searchFormData.param1"
            style="width: 120px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select
            placeholder="活动区域"
            style="width: 160px;"
            v-model="searchFormData.param2"
          >
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
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="query">查询</el-button>
          <el-button type="primary" class="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <div class="table-control">
        <el-button
          type="primary"
          plain
          class="query"
          @click="dialogVisible = true"
          >新增</el-button
        >
        <el-button type="primary" plain class="query">数据导出</el-button>
        <el-button type="primary" plain class="query">数据导入</el-button>
        <el-dropdown split-button type="primary">
          批量操作
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
        >
          <el-table-column type="selection" align="center" width="50">
          </el-table-column>
          <el-table-column fixed prop="date" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="province" label="省份" width="120">
          </el-table-column>
          <el-table-column prop="city" label="市区" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="300">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="300">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="300">
          </el-table-column>
          <el-table-column prop="zip" label="邮编" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <!--<el-tooltip effect="dark" content="状态切换" placement="top">
            </el-tooltip>-->
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="启用" placement="top">
                <el-switch
                  v-model="scope.row.tableSwitch"
                  class="gd-custom-status-switch"
                  style="margin-right: 10px;"
                  active-icon-class="el-icon-check"
                  inactive-icon-class="el-icon-close"
                ></el-switch>
              </el-tooltip>
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  class="table-control-btn"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-document"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          :total="18"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="form" :model="powerForm" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="powerForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="powerForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tableDemo",
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      tableSwitch: false,
      searchFormData: {
        param1: "",
        param2: "",
      },
      powerForm: {},
    };
  },
  /*computed: {
      tableData(){
        let newList = [];
        for(let i=0; i < 30; i++){
          console.info("tableData  ", i);
          newList.push({
            key: i,
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1516 弄',
            zip: 200333
          });
        }
        console.info("tableData  ", newList);
        return newList;
      }
    },*/
  mounted() {
    for (let i = 0; i < 30; i++) {
      //console.info("tableData  ", i);
      this.tableData.push({
        key: i,
        date: "2016-05-03",
        name: "王小虎",
        province: "上海",
        city: "普陀区",
        address: "上海市普陀区金沙江路 1516 弄",
        isBind: true,
        zip: 200333,
      });
    }

    setTimeout(() => {
      this.tableData.forEach((row, index) => {
        if (row.isBind) {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        }
        //console.info(index);
      });
    }, 1000);
  },
  methods: {
    columnSelectable(row, index) {
      console.info(row, index, row.isBind);
      return row.isBind;
    },
    handleClick(row) {
      console.log(row);
    },
  },
};
</script>

<style scoped></style>
