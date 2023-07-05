<template>
  <div ref="cameraNumBoxRef">
    <el-dialog
      title="所属摄像机数"
      :visible="visible"
      width="80%"
      v-dialogDrag
      custom-class="gd-custom-dialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="dialogClose"
    >
      <div class="content-wrapper">
        <div class="camera-search-display camera-manage-search">
          <div
            :class="
              isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'
            "
          >
            <el-form :inline="true" :model="filters" ref="CameraNumRef">
              <el-form-item label="所属地区:" prop="regionCode" v-if="uinfo.regionCode == 100000 ? true : false">
                <el-select
                  v-model="filters.areaValue"
                  filterable
                  placeholder="全国"
                  style="width:120px"
                  clearable
                >
                  <el-option
                    v-for="item in areaList"
                    :key="item.regionCode"
                    :label="item.alias"
                    :value="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属上云网关:">
                <el-select
                  v-model="filters.upCloud"
                  filterable
                  placeholder="请选择"
                  style="width:150px"
                  clearable
                >
                  <el-option
                    v-for="item in transCodeList"
                    :key="item.transcodingId"
                    :label="item.transcodingName"
                    :value="item.transcodingName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="管辖单位:">
                <el-cascader
                  v-model="jurisdictionList"
                  :class="jurisdictionList.length ? 'input-selected' : ''"
                  clearable
                  filterable
                  change-on-select
                  :show-all-levels="false"
                  :options="orgTreeList"
                  :props="orgCodeProps"
                  style="width: 150px"
                  @change="orgChange"
                  @clear="orgChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="所属路线:">
                <el-select
                  v-model="filters.roadCode"
                  filterable
                  :class="filters.roadCode ? 'input-selected' : ''"
                  placeholder="路线"
                  clearable
                  style="width:120px"
                >
                  <el-option label="全部路线" value></el-option>
                  <el-option
                    v-for="item in roadList"
                    :key="item.roadCode"
                    :label="item.roadName"
                    :value="item.roadCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="摄像机状态:">
                <el-select
                  v-model="filters.cameraStateValue"
                  filterable
                  placeholder="请选择"
                  style="width:120px"
                  clearable
                >
                  <el-option
                    v-for="item in cameraStateList"
                    :key="item.state"
                    :label="item.cameraState"
                    :value="item.state"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-right">
            <div class="btn-padding">
              <el-button
                type="primary"
                class="query"
                @click.native="queryList()"
                >查询</el-button
              >
              <el-button type="primary" class="reset" @click="resetSerach()"
                >重置</el-button
              >
            </div>
            <span
              @click="seachMore"
              v-if="isAllHeight % 2 == 0"
              class="have-more-info"
              >
              <i class="el-icon-arrow-down"  style="font-size: 18px;"></i>
              </span>
            <span
              @click="seachMore"
              v-if="isAllHeight % 2 != 0"
              class="have-more-info"
              >
              <i class="el-icon-arrow-up"  style="font-size: 18px;"></i>
              </span>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        class="custom-cloud-table"
        :data="transcodingCameraList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="organizationName"
          align="center"
          label="管辖单位"
        >
        </el-table-column>
        <el-table-column prop="cameraName" label="摄像机名称" align="center">
        </el-table-column>
        <el-table-column prop="reload" label="路线" align="center">
        </el-table-column>
        <el-table-column prop="number" label="桩号" align="center">
        </el-table-column>
        <el-table-column prop="upCloud" label="所属上云网关" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div class="img-con">
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  class="table-control-btn"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteSm(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="播放视频" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-video-play"
                  size="mini"
                  @click="handlePlay(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-button
                  class="table-control-btn"
                  type="primary"
                  icon="el-icon-document"
                  size="mini"
                  @click="handleWatch(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页选择器 -->
      <div class="table-pagination">
                <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          :current-page="currentPage"
          layout=" prev, pager, next, sizes, jumper "
          @size-change="changePageSize"
          @current-change="changeCurrentPage"
          :total="total"
        >
        </el-pagination>

        <!--摄像机详情弹窗-->
        <el-dialog
          title="查看详情"
          :visible.sync="cameraDialogVisible"
          width="879px"
          custom-class="gd-dialog camera-details-dialog"
          v-dialogDrag
          :append-to-body="true"
          :close-on-click-modal="false"
          @close="clearCameraList"
        >
          <camera-detail
            v-if="cameraDialogVisible"
            ref="cameraDetail"
            :camera="cameraDetailedInfo"
          ></camera-detail>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import axios from "axios";
import cameraDetail from "../equipment/cameraDetail";
import CameraPlayDialog from "../CameraManage/CameraPlayDialog";

export default {
  components: {
    cameraDetail,
  },
  props: {
    smId: {
      default() {
        return 0;
      },
    },
    visible: {
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      pageSize: 10,
      currentPage: 1,
      isAllHeight: 0, // 是否折叠搜索框
      areaList: [], //省份列表
      roadList: [], //路线列表
      cameraStateList: [
        //摄像机状态列表
        {
          state: 0,
          cameraState: "离线",
        },
        {
          state: 1,
          cameraState: "正常",
        },
        {
          state: 2,
          cameraState: "故障",
        },
      ],
      jurisdictionValue: "", //管辖单位
      orgTreeList: [], //管辖单位列表
      transCodeList: [], //上云网关列表
      transcodingCameraList: [], //获取流媒体服务器下的摄像机列表
      cameraDetailedInfo: {}, //摄像机详细信息
      jurisdictionList: [],
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
        //lazyLoad:this.propsLazyload
      },
      filters: {
        //表单数据对象
        areaValue: "", //省份
        cameraStateValue: "", //摄像机状态
        roadCode: "", //路线
        organizationId: "", //组织id
        upCloud: "", //上云网关
      },
      postData: {
        currPage: 1,
        pageSize: 5,
        smId: "",
      },
      total: null,
      playerDialogVisible: false, //摄像机播放开关
      cameraDialogVisible: false,
      cameraId: "", //摄像机id
    };
  },
  computed: {
    ...mapState(["streamMedia"]),
  },
  mounted() {
    this.queryList();
    this.queryOrgList();
    this.loadArea();
    this.queryRoadList("");
    this.queryUpCloud();
  },
  methods: {
    /**
     * 获取省份列表
     */
    loadArea() {
      this.$api
        .getProvince()
        .then((res) => {
          if (res.code != "200") {
            return Promise.reject;
          }

          this.areaList = res.data;
          this.areaList.unshift({
            regionCode: "",
            regionName: "全国",
            alias: "全国",
            parentRegionCode: "0",
          });
        })
        .catch(() => {});
    },

    /**
     * 获取路线列表
     */
    queryRoadList(orgId) {
      console.log("queryRoadList=>", orgId);
      let _this = this;
      this.$api
        .getRoadsByOrgId({ organizationId: orgId + "" })
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.roadList = data.data;
        })
        .catch(() => {});
    },

    /**
     * 获取管辖单位列表
     */
    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree(params)
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data[0].childList;
          _.each(nlist, it => {
            it.disabled = true;
          });
          _this.orgTreeList = nlist;
        })
        .catch((error) => {
          // this.$message({
          //   message:
          //     "获取组织架构树失败! [" + error.code + "]: " + error.message,
          //   type: "error",
          // });
          this.$message({
            message: "获取组织架构树失败! ",
            type: "error",
          });
        });
    },

    /**
     * 获取上云网关列表
     */
    queryUpCloud() {
      let _this = this,
        params = {};
      params = {
        currPage: 0,
        pageSize: 0,
        provinceCode: this.filters.provinceCode,
        organizationCode: this.filters.organizationId,
      };
      this.$api.getTranscodingList(params).then((msg) => {
        console.log(msg, "yyyyyyyyyy");
        _this.transCodeList = msg.data;
      });
    },
    /**
     * 单位列表change事件
     * @param val
     */
    orgChange(val) {
      this.filters.roadCode = "";
      this.roadList = [];
      this.filters.organizationId = "";
      if (val.length) {
        let orgId = val[val.length - 1];
        this.filters.organizationId = orgId;
        this.queryRoadList(orgId);
        this.queryUpCloud();
      }
    },
    clearCameraList() {
      this.$refs.cameraDetail.resetCurrent();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.currentPage = 1;
      this.queryList();
    },
    changeCurrentPage(page) {
      this.currentPage = page;
      this.queryList();
    },
    //在对话框关闭处理函数
    dialogClose() {
      this.$emit("update:visible", false);
    },
    seachMore() {
      this.isAllHeight++;
    },
    // 查询列表
    queryList() {
      // this.pageSize = 10;
      // this.currentPage = 1;
      axios
        .get(
          `/mock/cameraData/list?pageSize=${this.pageSize}&currentPage=${this.currentPage}`,
          {
            areaValue: this.filters.areaValue,
          }
        )
        .then((res) => {
          if (res.status != 200) {
            return this.$message.error("数据请求失败");
          }
          this.transcodingCameraList = res.data.data.cameraData;
          this.total = res.data.data.total;
          console.log(res.data.data.cameraData, "ddd");
        });
    },
    // 重置表单
    resetSerach() {
      console.log("00000001111");
      console.log(this.$refs.CameraNumRef, "ddd6");
      this.$refs.CameraNumRef.resetFields();
      this.jurisdictionList = "";
      this.filters.areaValue = "";
      this.filters.upCloud = "";
      this.filters.roadCode = "";
      this.filters.cameraStateValue = "";
      this.queryList();
    },
    edit(row) {
      console.log(row, "mad");
    },
    deleteSm(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false,
      })
        .then(() => {
          axios.post("/mock/cameraData/list", { id: row.id }).then((res) => {
            if (res.data.code == 200) {
              this.queryList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleWatch(obj) {
      this.cameraDetailedInfo = obj;
      this.cameraDialogVisible = true;
    },
    /**
     * 视频播放
     * @param obj
     */
    handlePlay(obj) {
      this.playerCamera = obj;
      this.cameraId = obj.cameraId;
      this.playerDialogVisible = true;
    },
  },
};
</script>
<style scoped></style>
