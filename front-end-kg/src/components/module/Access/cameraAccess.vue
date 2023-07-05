<template>
  <div class="content-wrapper camera-manage-wrapper" ref="viewbox">
    <!--头部导航-->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>摄像机接入</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isCloudGateway"
          >上云网关详情</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div
      class="camera-manage-con"
      style="
         {
          height: calc(100% - 14px - 20px);
        }
      "
    >
      <div class="cameraheader" v-if="!isCloudGateway" style="padding: 30px">
        <div class="tab-wrapper">
          <div @click="$router.push({ path: '/deviceCameraManage' })">
            摄像机管理
          </div>
          <div @click="$router.push({ path: '/deviceGroupManage' })">
            摄像机组管理
          </div>
          <div @click="$router.push({ path: '/cameraStatusDetection' })">
            摄像机审核
          </div>
          <div class="active">摄像机接入</div>
        </div>
      </div>
    </div>
    <!-- 条件搜索区域 -->
    <div class="camera-search-display camera-manage-search">
      <div class="search-wrapper">
        <el-form
          v-show="false"
          :inline="true"
          class="demo-form-inline"
          ref="deviceGroupForm"
        >
          <!-- 查询条件 -->
          <el-form-item prop="groupName">
            <el-cascader
              placeholder="请选择路公司"
              v-model="deviceGroupQuery.company"
              :options="options"
            >
            </el-cascader>
          </el-form-item>
          <el-button type="primary" class="query">查询</el-button>
          <el-button type="primary" class="reset">重置</el-button>
        </el-form>
      </div>
      <div class="search-btn-right">
        <div class="btn-padding">
          <el-button v-if="isEdit" type="primary" class="query" @click="save"
            >保存</el-button
          >
          <el-button v-else type="primary" class="reset" @click="edit"
            >编辑</el-button
          >
        </div>
      </div>
    </div>

    <div>
      <div id="table-content">
        <el-table
          :data="listData"
          style="width: 100%"
          border
          :span-method="objectSpanMethod"
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column
            v-for="col in cols"
            :key="col.index"
            :prop="col.prop"
            :label="col.label"
          >
            <template slot-scope="scope">
              <input
                v-if="col.prop === 'estimateQuantity' && isEdit"
                type="text"
                v-model="scope.row.estimateQuantity"
              />
              <input
                v-else-if="col.prop === 'remarks' && isEdit"
                type="text"
                v-model="scope.row.remarks"
              />

              <span v-else>{{ scope.row[col.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      deviceGroupQuery: {
        company: null,
        userName: null,
      },
      options: [
        {
          value: "zhinan",
          label: "指南",
        },
        {
          value: "ada",
          label: "指南2",
        },
      ],
      isEdit: false,
      isCloudGateway: false,
      rowList: [],
      spanArr: [],
      spanArrtwin: [],
      spanArrThree: [],
      listData: [],
      position: 0,
      unitList: {},
      orgmap: {},
      columnKey: [],
      defColums: [
        {
          prop: "estimateQuantity",
          label: "应接入量",
        },
        {
          prop: "remarks",
          label: "备注",
        },
      ],
      cols: [
        // {
        //   prop: "proOrganizationName",
        //   label: "id",
        // },
        // {
        //   prop: "organizationName",
        //   label: "organizationName",
        // },
        // {
        //   prop: "organizationId",
        //   label: "地址",
        // },
      ],
    };
  },
  created() {},
  watch: {},
  computed: {},
  methods: {},
  methods: {
    queryData() {
      //查询操作
      this.getCountUserOrganization();
    },
    // 保存
    save() {
      console.log("save", this.listData);
      let data = [];
      this.listData.map((it) => {
        data.push({
          estimateQuantity: parseInt(it.estimateQuantity),
          organizationId: it.organizationId,
          remarks: it.remarks,
        });
      });
      console.log("参数", data);
      this.$api.updateOrganizations(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("保存成功！");
          this.getCountUserOrganization();
          this.isEdit = false;
          console.log("修改数据", res.data);
        } else {
          this.$message.error("修改失败" + res.message);
        }
      });
    },
    // 编辑
    edit() {
      this.isEdit = true;
      console.log("edit");
    },
    rowspan(columnIndex, position) {
      let spanArr = [];
      position = 0;
      var _this = this;
      this.initColumn();
      // console.log(_this.columnKey)
      console.log(this.listData[this.listData.length - 1], "sadad");
      this.listData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1);
          position = 0;
        } else {
          var k = _this.columnKey[columnIndex];
          if (this.listData[index][k] === this.listData[index - 1][k]) {
            spanArr[position] += 1;
            spanArr.push(0);
          } else {
            spanArr.push(1);
            position = index;
          }
        }
      });
      return spanArr;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行 第一列
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }

      //表格合并行 第二列
      if (columnIndex === 2) {
        const _row = this.spanArrtwin[rowIndex];
        console.log;
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      //表格合并行 第三列
      if (columnIndex === 3) {
        const _row = this.spanArrThree[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    getCountUserOrganization() {
      let data = {};
      var _this = this;
      _this.listData = [];
      this.$api.getCountUserOrganization(data).then((res) => {
        if (res.code == 200) {
          var list = res.data;
          console.log(list, "list");
          _this.parseOrgData(list, 0, {});
        }
        console.log(_this.listData, "listdata");
        this.spanArr = _this.rowspan(0, 0); //合并第一列
        this.spanArrtwin = _this.rowspan(1, 0); //合并第二列
        this.spanArrThree = _this.rowspan(2, 0); //合并第三列
        // _this.rowspan();
      });
    },
    initColumn() {
      this.cols = [];
      this.columnKey.forEach((it, i) => {
        this.cols.push({ prop: it, label: "业主单位" });
      });
      this.defColums.forEach((it, i) => {
        this.cols.push(it);
      });
    },
    parseOrgData(orgs, level, p) {
      var k = "organizationName_" + level;
      var size = 0;
      orgs.forEach((org, i) => {
        if (
          org.organizationType == undefined ||
          parseInt(org.organizationType) <= 10
        ) {
          var s = 0;
          var param = {};
          for (var j in p) {
            param[j] = p[j];
          }
          if (org.organizationType) {
            if (this.columnKey.indexOf(k) < 0) {
              this.columnKey.push(k);
            }
            param[k] = org.organizationName;
          }
          if (org.childList && org.childList.length > 0) {
            s += this.parseOrgData(org.childList, level + 1, param);
          }
          if (org.organizationType <= 10 && s < 1) {
            if (param[this.columnKey[1]]) {
              //底层组织
              for (var j in param) {
                org[j] = param[j];
              }
              org.size = s;
              this.listData.push(org);
              s++;
            }
          }
          console.log(org, s);
          size += s;
        }
      });
      return size;
    },
  },
  mounted() {
    this.queryData();
  },
};
</script>

