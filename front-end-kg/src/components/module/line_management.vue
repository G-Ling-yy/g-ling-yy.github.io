<template>
  <div class="content-wrapper" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>路线管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-search-display camera-manage-search">
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form
          :inline="true"
          hide-required-asterisk
          :model="searchValidateForm"
          ref="searchValidateForm"
        >
          <el-form-item label="途经省份:" prop="pass_city" v-if="uinfo.regionCode == 100000 ? true : false">
            <el-select
              clearable
              v-model="searchValidateForm.roadRegion"
              style="width: 120px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in provinces"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路线编号:" prop="roadCode">
            <el-input
              type="roadCode"
              style="width: 120px;"
              placeholder="请输入"
              v-model.number="searchValidateForm.roadCode"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="路线名称" prop="roadName">
            <el-input
              style="width: 120px;"
              placeholder="请输入"
              type="roadName"
              v-model.number="searchValidateForm.roadName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="路线类型" prop="roadType">
            <el-select
              clearable
              v-model="searchValidateForm.roadType"
              placeholder="请选择"
              style="width: 120px;"
            >
              <el-option
                v-for="item in roadTypes"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" class="query" @click="query(1)">查询</el-button>
            <el-button type="primary" class="reset" @click="resetSearch">重置</el-button>
          </el-form-item>-->
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button type="primary" class="query" @click="query(1)"
            >查询</el-button
          >
          <el-button type="primary" class="reset" @click="resetSearch"
            >重置</el-button
          >
          <el-button type="primary" plain class="query" @click="addRoadInfo()"
            >新增</el-button
          >
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <!-- <div class="table-control">
        <el-button type="primary" plain class="query" @click="addRoadInfo()"
          >新增</el-button
        >
        <el-button type="primary" plain class="query" @click="exportRoute"
          >数据导出</el-button
        >
      </div> -->
      <div class="table-content-body line-management">
        <el-table
          class="custom-cloud-table"
          height="100%"
          ref="multipleTable"
          :data="roadFullList"
          @selection-change="handleSelectionChange"
          border
        >
          <!-- <el-table-column
            type="selection"
            width="50"
            align="center"
          ></el-table-column> -->
          <el-table-column label="序号" width="60" type="index" align="center">
            <!-- {{(currentPage - 1) * pageSize + scope.$index + 1}}  随数据自增 -->
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="roadCode"
            label="线路编号"
            min-width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="roadName"
            label="线路名称"
            min-width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="roadValue"
            label="线路类型"
            min-width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="regionNames"
            label="途径省市"
            min-width="360"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="roadLength"
            label="全长"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.roadLength + "km" }}
            </template></el-table-column
          >
          <el-table-column prop="operation" width="100" label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editRoleInfo(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  class="table-control-btn"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteRoleInfo(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <p class="total-pagination">共{{roadTotal}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="roadTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增/编辑按钮的弹出框开始 -->
    <el-dialog
      :title="formDialogTitle"
      :visible.sync="roadInfoDialogVisible"
      width="25%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="rodeInfo"
        ref="rodeInfoForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="线路编号"
          prop="roadCode"
          :rules="[{ required: true, message: '线路编码不能为空' }]"
        >
          <el-input
            type="roadCode"
            v-model="rodeInfo.roadCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="线路名称"
          prop="roadName"
          :rules="[{ required: true, message: '线路名称不能为空' }]"
        >
          <el-input
            type="roadName"
            v-model="rodeInfo.roadName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="线路类型"
          prop="roadType"
          class="lineType"
          :rules="[{ required: true, message: '线路类型不能为空' }]"
        >
          <el-select
            v-model="rodeInfo.roadType"
            placeholder="请选择"
            class="lineType"
          >
            <el-option
              v-for="item in roadTypes"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="途径省市"
          class="lineType"
          prop="linkedRegion"
          :rules="[{ required: true, message: '途径省市不能为空' }]"
        >
          <!--<el-cascader :options="regionList" :show-all-levels="false"
              :props="{ label: 'regionName', children: 'childRegion', value:'regionCode',  multiple: true }"
          clearable></el-cascader>-->

          <el-select
            clearable
            multiple
            filterable
            v-model="rodeInfo.linkedRegion"
            placeholder="请选择"
          >
            <el-option
              v-for="item in provinces"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode + ''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="线路全长"
          prop="roadLength"
          :rules="[{ required: true, message: '线路全长不能为空' }]"
        >
          <el-input
            type="roadLength"
            v-model="rodeInfo.roadLength"
            autocomplete="off"
          ></el-input
          >千米
        </el-form-item>
        <!-- 重构版本开发 -->
        <template v-if="0">
          <el-form-item label="线路全长" prop="roadLength">
            <el-input
              type="roadLength"
              v-model="rodeInfo.roadLength"
              autocomplete="off"
            ></el-input>
            <!-- <el-select
              @change="on_roadLength_change(rodeInfo.roadLength)"
              v-model="rodeInfo.roadLength"
              placeholder="请选择"
            >
              <el-option
                v-for="item in lineOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="管辖单位" prop="orgCode">
            <el-input
              type="text"
              v-model="rodeInfo.orgCode"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input
              type="text"
              v-model="rodeInfo.desc"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roadInfoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRoadInfoSubmit()"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增/编辑按钮的弹出框结束 -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      showPagination: false,
      isAllHeight: 0,
      searchValidateForm: {
        roadRegion: "",
        roadCode: "",
        roadName: "",
        roadType: "",
      },
      rodeInfo: {
        roadId: "",
        roadRegion: "",
        roadCode: "",
        roadName: "",
        roadType: "",
        linkedRegion: [],
        roadLength: "",
        orgCode: "",
        desc: "",
      },
      roadTypes: [],
      currentPage: 1,
      pageSize: 10,
      roadInfoDialogVisible: false,
      formDialogTitle: "新增路线",
      multipleSelection: [],
      roadFullList: [],
      roadTotal: 0,
      /*dialogVisible: false,
        deleteId: "",
        editRoleInfoVisible: false,*/
    };
  },
  computed: {
    ...mapState(["provinces", "regionList", "road"]),
  },
  mounted() {
    
    // ROADTYPE
    let params = {
      codeType: "ROADTYPE",
    };
    this.getCodemaster(params).then((res) => {
      this.roadTypes = res.data;
      this.query(1);
    });
    this.getRegion({
      regionLevel: 1
    });
    //console.info('regionList', this.regionList);
  },
  methods: {
    ...mapActions([
      "getCodemaster",
      "getRegion",
      "getRoadListAction",
      "getRoadInfoAction",
      "addRoadInfoAction",
      "deleteRoadInfoAction",
      "editRoadInfoAction",
    ]),

    query(page) {
      if (page) this.currentPage = page;
      this.$api
        .getRoadList({
          currPage: this.currentPage,
          pageSize: this.pageSize,
          roadCode: this.searchValidateForm.roadCode,
          roadName: this.searchValidateForm.roadName,
          roadType: this.searchValidateForm.roadType,
          regionCode: this.searchValidateForm.roadRegion,
        })
        .then((res) => {
          this.roadFullList = res.data;
          this.roadTotal = res.total;
          console.log(this.roadTotal,res,"this.roadTotalthis.roadTotal")
          this.roadFullList.forEach((item) => {
            for (var i = 0; i < this.roadTypes.length; i++) {
              if (item.roadType == this.roadTypes[i].codeValue) {
                item.roadValue = this.roadTypes[i].codeName;
              }
            }
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportRoute() {
      this.$api
        .exportOperateLog(this.searchValidateForm)
        .then((data) => {
          var blob = new Blob([data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "路线详情表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          this.$message({
            message: "路线详情导出失败! ",
            type: "error",
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.query();
      console.log(this.currentPage,"fenye")
    },
    //编辑表单
    editRoleInfo(e) {
      console.log(e);
      let linkedRegion = (e.regionCodes || "").split(',');
      // let linkedRegion = e.regionCodes.split(",");
      // let linkedRegion = e.regionCodes;
      this.rodeInfo = {
        roadCode: e.roadCode,
        roadName: e.roadName,
        roadLength: e.roadLength,
        roadType: JSON.stringify(e.roadType),
        linkedRegion: linkedRegion,
        roadId: e.roadId,
      };
      this.roadInfoDialogVisible = true;
      this.formDialogTitle = "路线编辑";
      this.$nextTick(() => {
        this.$refs.rodeInfoForm.clearValidate();
      });
    },
    addRoadInfo() {
      this.rodeInfo = {
        roadId: "",
        roadCode: "",
        roadName: "",
        roadLength: "",
        roadType: "",
        linkedRegion: [],
        roadRegion: "",
        orgCode: "",
        desc: "",
      };
      this.roadInfoDialogVisible = true;
      this.formDialogTitle = "路线新增";
      this.$nextTick(() => {
        this.$refs.rodeInfoForm.clearValidate();
      });
    },

    handleRoadInfoSubmit() {
      this.$refs.rodeInfoForm.validate((valid) => {
        if (valid) {
          let params = {
              linkedRegion: this.rodeInfo.linkedRegion,
              roadCode: this.rodeInfo.roadCode,
              roadName: this.rodeInfo.roadName,
              // roadRegion: "",
              roadType: this.rodeInfo.roadType,
              roadLength: this.rodeInfo.roadLength,
            },
            submitFuncName = "addRoadInfoAction";

          if (this.rodeInfo.roadId) {
            params.roadId = this.rodeInfo.roadId;
            submitFuncName = "editRoadInfoAction";
          }
          //console.log(this.rodeInfo);
          this[submitFuncName](params).then((res) => {
            if (res.code === 200) {
              this.query();
              this.roadInfoDialogVisible = false;
            }
          });
        }
      });
    },

    deleteRoleInfo(e) {
      this.$confirm(
        "确认删除路线：" + e.roadName + "[" + e.roadCode + "]吗？",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      ).then(() => {
        this.deleteRoadInfoAction(e.roadId).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除路线信息成功!",
            });
            this.query();
          }
        });
      });
    },
    // 重置查询表单
    resetSearch() {
      this.$refs.searchValidateForm.resetFields();
      this.searchValidateForm = {
        roadRegion: "",
        roadCode: "",
        roadName: "",
        roadType: "",
      };
      this.query(1);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  padding: 15px 20px 5px !important;
}
/deep/.el-dialog__footer {
  padding-top: 0 !important;
  padding-bottom: 30px !important;
}

.el-input,
.el-select {
  width: 275px;
}
.content-wrapper .table-wrapper .table-content-body.line-management {
  max-height: calc(100% - 78px) !important
} 
</style>
