<template>
  <div class="my-detaills">
    <div class="my-details-left">
      <el-tree
        :data="UserOrgTree"
        node-key="id"
        :props="{
              children: 'children',
              label: 'orgName',
            }"
        @node-click="handleTreenode"
      ></el-tree>
    </div>
    <div class="my-details-right">
      <div class="my-details-r-h">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="所属地区">
            <el-select v-model="provinceName" placeholder="全国" style="width: 120px;">
              <el-option
                v-for="(item) in provinceData"
                :value-key="item.regionCode"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="管辖单位">
            <el-select v-model="organizationName" placeholder="请选择" style="width: 150px">
              <el-option
                v-for="(item) in organizationData"
                :value-key="item.organizationId"
                :key="item.organizationId"
                :label="item.organizationName"
                :value="item.organizationId"
                style="width: 200px"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="所属路线:">
            <el-select v-model="roadCode" filterable placeholder="路线" clearable style="width:120px">
              <el-option label="全部路线" value></el-option>
              <el-option
                v-for="item in roadList"
                :key="item.roadCode"
                :label="item.roadName"
                :value="item.roadCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="桩号范围">
            <div style="display: flex">
              <el-input
                placeholder="请输入起始公里数"
                v-model="startPile"
                style="width: 120px;margin-right: 10px;padding-right:0px;"
              ></el-input>
              <span style="color: #000">~</span>
              <el-input
                placeholder="请输入终点公里数"
                v-model="endPile"
                style="width: 120px;padding-right:0px;"
              ></el-input>
            </div>
          </el-form-item>-->
          <!-- <el-form-item label="方向">
            <el-select v-model="derectionName" placeholder="请选择" style="width:120px">
              <el-option
                v-for="(item) in derectionData"
                :value-key="item.codeValue"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue"
                style="width:120px"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="所属类别">
            <el-select v-model="classifyName" placeholder="请选择" style="width:120px">
              <el-option
                v-for="(item) in classify"
                :value-key="item.codeValue"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue"
                style="width:120px"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="对接方式">
            <el-select v-model="connectionWayName" placeholder="请选择" style="width:120px">
              <el-option
                v-for="(item) in connectionWay"
                :value-key="item.codeValue"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="所属上云网关">
            <el-select
              v-model="transcodingName"
              filterable
              placeholder="请选择"
              style="width:150px"
              clearable
              @change="changeTransCode"
            >
              <el-option
                style="width:150px"
                v-for="item in transCodeList"
                :key="item.transcodingId"
                :label="item.transcodingName"
                :value="item.transcodingName"
              ></el-option>
          </el-select>-->
          <!-- <el-input placeholder="请输入关键字" v-model="transcodingName"></el-input> -->
          <!-- </el-form-item> -->
          <el-form-item label="摄像机状态" style="margin-bottom:0;">
            <el-select v-model="playStatusName" placeholder="请选择" style="width:80px">
              <el-option
                style="width:80px"
                v-for="(item) in playStatusData"
                :value-key="item.codeValue"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="摄像机名称" style="margin-bottom:0;">
            <el-input
              v-model="cameraName"
              type="text"
              placeholder="请输入摄像机名称"
              style="width:150px;padding-right:0px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTableData">搜索</el-button>
            <el-button type="info" @click="resetData">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="selected-table-h">
        <!-- <div class="cameraCount">
          <span class="cameraCount-box1">已选</span>
          <span class="cameraCount-box2">{{ checkData.length }}</span>
        </div>-->
        <div class="table-content-body table-height-s">
          <el-tabs v-model="activeName" type="card" @tab-click="handleChangTab">
            <el-tab-pane label="全部" name="all">
              <div class="table-content-inner" v-if="activeName=='all'">
                <el-table
                  ref="multipleTable"
                  :data="allCameraChecked ? tableAllData:tableData"
                  tooltip-effect="dark"
                  border
                  :header-cell-style="{
                    background: '#F5F7FA',
                    color: '#606266',
                    textAlign: 'left'
                  }"
                  :row-key="getRowkeys"
                  @selection-change="handleSelectionChange"
                  @select="hanldeCameraAll"
                  @select-all="hanldeCameraAll"
                  class="custom-cloud-table"
                >
                  <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column align="center" label="省市" width="180">
                    <template slot-scope="scope">
                      <div>
                        {{
                        scope.row.provinceName +
                        "/" +
                        scope.row.cityName +
                        "/" +
                        scope.row.regionName
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="organizationName" label="管辖单位" width="120"></el-table-column>
                  <el-table-column prop="road" label="所属路线" width="100"></el-table-column>
                  <el-table-column prop="cameraName" label="摄像机名称"></el-table-column>
                  <el-table-column prop="pile" label="桩号" width="100"></el-table-column>
                  <!-- <el-table-column align="center" label="经纬度">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude + "," + scope.row.latitude }}</div>
                </template>
                  </el-table-column>-->
                  <el-table-column prop="classifyName" label="所属类别" width="100"></el-table-column>
                  <!-- <el-table-column prop="derectionName" label="方向"></el-table-column> -->
                  <el-table-column prop="playStatus" label="状态" width="80">
                    <template slot-scope="scope">
                      <div>
                        <span
                          :style="
                      `display: inline-block;width: 5px;height: 5px;vertical-align: middle;background-color:${
                        stateCol[scope.row.playStatus]
                      }`
                    "
                        ></span>
                        {{ stateList[scope.row.playStatus] }}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="transcodingName" label="所属上云网关"></el-table-column>
              <el-table-column prop="appName" label="所属平台"></el-table-column>
                  <el-table-column prop="cameraTypeName" label="摄像机类型"></el-table-column>-->
                </el-table>
              </div>
              <el-checkbox
                v-model="apperSelect"
                @change="handleCheckAllChange($event,tableAllData)"
                class="my-detalis-all-selected"
              >选择所有数据</el-checkbox>
              <div class="myPage">
                <el-pagination
                  background
                  layout="prev, pager, next, sizes, total, jumper"
                  :page-sizes="[pagesize]"
                  :page-size="pagesize"
                  :total="total"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  @close="selectEquipmentDis"
                ></el-pagination>
              </div>
              <div class="footer-btn">
                <!-- <el-button @click="selectEquipmentDis">取 消</el-button> -->
                <el-button type="primary" @click="selectEquip">选 择</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="已选" name="selected">
              <div class="table-content-inner" v-if="activeName=='selected'">
                <el-table
                  ref="multipleTable"
                  :data="allCameraChecked ? tableAllData:tableData"
                  tooltip-effect="dark"
                  border
                  :header-cell-style="{
                    background: '#F5F7FA',
                    color: '#606266',
                    textAlign: 'left'
                  }"
                  :row-key="getRowkeys"
                  @selection-change="handleSelectionChange"
                  @select="hanldeCameraAll"
                  @select-all="hanldeCameraAll"
                  class="custom-cloud-table"
                >
                  <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column align="center" label="省市" width="180">
                    <template slot-scope="scope">
                      <div>
                        {{
                        scope.row.provinceName +
                        "/" +
                        scope.row.cityName +
                        "/" +
                        scope.row.regionName
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="organizationName" label="管辖单位" width="120"></el-table-column>
                  <el-table-column prop="road" label="所属路线" width="100"></el-table-column>
                  <el-table-column prop="cameraName" label="摄像机名称"></el-table-column>
                  <el-table-column prop="pile" label="桩号" width="100"></el-table-column>
                  <!-- <el-table-column align="center" label="经纬度">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude + "," + scope.row.latitude }}</div>
                </template>
                  </el-table-column>-->
                  <el-table-column prop="classifyName" label="所属类别" width="100"></el-table-column>
                  <!-- <el-table-column prop="derectionName" label="方向"></el-table-column> -->
                  <el-table-column prop="playStatus" label="状态" width="80">
                    <template slot-scope="scope">
                      <div>
                        <span
                          :style="
                      `display: inline-block;width: 5px;height: 5px;vertical-align: middle;background-color:${
                        stateCol[scope.row.playStatus]
                      }`
                    "
                        ></span>
                        {{ stateList[scope.row.playStatus] }}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="transcodingName" label="所属上云网关"></el-table-column>
              <el-table-column prop="appName" label="所属平台"></el-table-column>
                  <el-table-column prop="cameraTypeName" label="摄像机类型"></el-table-column>-->
                </el-table>
              </div>
              <el-checkbox
              v-model="apperSelect"
                @change="handleCheckSelectedChange($event,tableAllData)"
                class="my-detalis-all-selected"
              >选择所有数据</el-checkbox>
              <div class="myPage">
                <el-pagination
                  background
                  layout="prev, pager, next, sizes, total, jumper"
                  :page-sizes="[pagesize]"
                  :page-size="pagesize"
                  :total="total"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  @close="selectEquipmentDis"
                ></el-pagination>
              </div>
              <div class="footer-btn">
                <!-- <el-button @click="selectEquipmentDis">取 消</el-button> -->
                <el-button type="primary" @click="selectEquip">取消选择</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- <div class="myPage" v-if="this.tableData.data.length>0"> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import $http from "../../filters/http";
export default {
  data() {
    return {
      allCameraChecked: false,
      activeName: "all",
      cameraName: "",
      transCodeList: [],
      tableData: [],
      tableAllData: [],
      pagesize: 10,
      currpage: 1,
      total: 0,
      stateList: ["离线", "正常", "故障"],
      stateCol: ["#878787", "#26B55F", "#F9552F"],
      provinceData: [], //省
      provinceName: "",
      organizationData: [], //管辖单位
      organizationName: "", //
      organizationId: "", //组织id
      startPile: "", //开始桩号
      endPile: "", //结束桩号
      derectionData: [], //方向
      derectionName: "",
      playStatusData: [
        { codeValue: "0", codeName: "离线" },
        { codeValue: "1", codeName: "在线" },
        { codeValue: "2", codeName: "故障" }
      ], //摄像机状态
      playStatusName: "",
      connectionWay: [
        { codeValue: "0", codeName: "路段" },
        { codeValue: "1", codeName: "部省" }
      ], //对接方式
      connectionWayName: "",
      classify: [], //所属类别
      classifyName: "",
      transcodingName: "", //所属上云网关
      checkData: [],
      selectEquipment: false,
      roadList: [], //路线列表
      roadCode: "",
      apperSelect:false,//选择的状态
    };
  },
  computed: {
    ...mapState(["UserOrgTree"])
  },

  methods: {
    // 查询列表数据
    handleTreenode(val) {
      this.organizationId = val.id;
      this.getTableData();
    },
    /**
     *tab切换 全部 预选
     */
    handleChangTab(tab, val) {
      this.activeName = tab.name;
      this.apperSelect=false;
    },
    // 选择全部数据
    handleCheckAllChange(value, all) {
      this.allCameraChecked = value;
      if (value) {
        all.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
        this.hanldeCameraAll(all);
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleCheckSelectedChange(value, all) {
      //全选tableList获取值
      this.allCameraChecked = value;
      if (value) {
        all.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
        this.hanldeCameraAll(all);
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
      this.getTableData();
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
      this.getTableData();
    },
    // 获取上云网关list
    queryUpCloud() {
      let _this = this,
        params = {};
      params = {
        currPage: 0,
        pageSize: 0,
        provinceCode: "",
        organizationCode: ""
      };
      this.$api.getTranscodingList(params).then(msg => {
        _this.transCodeList = msg.data;
      });
    },
    // 选中的上云网关名称
    changeTransCode(val) {
      this.transcodingName = val;
    },
    //获取tableData
    getTableData() {
      var params = {
        roadId: this.roadCode,
        cameraName: this.cameraName,
        derectionCode: null,
        classifyCode: null,
        provinceCode: this.provinceName,
        organizationId: this.organizationId, //组织id
        derectionCode: this.derectionName,
        synOnlineStatus: this.playStatusName,
        connectionWay: this.connectionWayName,
        classifyCode: this.classifyName,
        kmPileMin: this.startPile,
        kmPileMax: this.endPile,
        transcodingName: this.transcodingName
      };
      this.$api
        .getCameraList({
          currPage: this.currpage,
          pageSize: this.pagesize,
          info: params
        })
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.$message({
              type: "info",
              message: res.message
            });
          }
        });
      // 全部数据
      this.$api
        .getCameraList({
          currPage: this.currpage,
          pageSize: 0,
          info: params
        })
        .then(res => {
          if (res.code == 200) {
            this.tableAllData = res.data;
            this.total = res.total;
          } else {
            this.$message({
              type: "info",
              message: res.message
            });
          }
        });
    },
    //获取所有省份
    getGrovinceData() {
      $http.get("/basic/region/0").then(res => {
        if (res.data.code == 200) {
          this.provinceData = res.data.data;
        } else {
          this.$message({
            type: "info",
            message: res.data.message
          });
        }
      });
    },
    //获取所有管辖单位
    getOrganizationData() {
      $http.get("/basic/org/all").then(res => {
        if (res.data.code == 200) {
          this.organizationData = res.data.data;
        } else {
          this.$message({
            type: "info",
            message: res.data.message
          });
        }
      });
    },
    //获取所有方向
    getDerectionData() {
      $http.get("/base/code-masters/list?codeType=DERECTION").then(res => {
        if (res.data.code == 200) {
          this.derectionData = res.data.data;
        } else {
          this.$message({
            type: "info",
            message: res.data.message
          });
        }
      });
    },
    //获取所有类别
    getClassify() {
      $http.get("/base/code-masters/list?codeType=CLASSIFY").then(res => {
        if (res.data.code == 200) {
          this.classify = res.data.data;
        } else {
          this.$message({
            type: "info",
            message: res.data.message
          });
        }
      });
    },
    //重置数据
    resetData() {
      this.provinceName = "";
      this.organizationId = "";
      this.startPile = "";
      this.endPile = "";
      this.derectionName = "";
      this.playStatusName = "";
      this.connectionWayName = "";
      this.classifyName = "";
      this.transcodingName = "";
      (this.roadCode = ""), (this.cameraName = ""), this.getTableData();
    },
    //checkbox
    handleSelectionChange(val) {
      this.checkData = val;
    },
    getRowkeys(row) {
      return row.cameraId;
    },
    // 全选
    hanldeCameraAll(allList, row) {
      this.checkData = [];
      if (allList.length) {
        this.checkData.push(...allList);
      }
    },
    //确定选择
    selectEquip() {
      this.currpage = 1;
      this.getTableData();
      this.$parent.$parent.checkData = this.$parent.$parent.checkData.concat(
        this.checkData
      );
      this.checkData = this.$parent.$parent.checkData; //所选中的摄像机
      this.$parent.$parent.selectEquipment = false;
      console.log(this.checkData);
    },
    // 取消
    selectEquipmentDis() {
      this.currpage = 1;
      this.getTableData();
      console.log(this.checkData);
      this.$parent.$parent.selectEquipment = false;
    },
    //根据条件搜索摄像机数据
    searchTableData() {
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
    this.getGrovinceData();
    this.getOrganizationData();
    this.getDerectionData();
    this.getClassify();
    this.queryUpCloud();
  }
};
</script>

<style lang="less"scoped>
.my-detaills {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.my-details-left {
  width: 20%;
}
.my-details-right {
  width: 80%;
  .my-details-r-h {
    /deep/.el-form .el-form-item {
      margin-bottom: 10px;
    }
  }
  /deep/.el-table td,
  .el-table th {
    padding: 5px 0;
  }
  .footer-btn {
    text-align: center;
  }
}
.my-detalis-all-selected {
  padding-top: 10px;
}
.search-header > div {
  display: flex;
  align-items: center;
}

.search-header > div > div {
  display: flex;
  align-items: center;
}
.el-button {
  height: 30px !important;
  line-height: 5px !important;
}
.myPage {
  margin-top: 25px;
}
.selected-table-h {
}
.table-height-s {
}
.dialog-footer {
  margin: 8px 0px;
}
</style>
