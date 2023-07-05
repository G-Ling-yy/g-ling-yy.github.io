<template>
  <div class="check-camera">
    <div class="check-camera-body">
      <div class="check-camera-tree" style="width: 25%;
      float: left;">
        <el-tree
          ref="tree"
          :data="UserOrgTree"
          node-key="organizationId"
          :props="{
              children: 'childList',
              label: 'organizationName',
            }"
          :default-expanded-keys="idArr"
          @node-click="handleTreenode"
        ></el-tree>
      </div>
      <div class="check-camera-right" style="width: 70%;
      float: left;">
        <div class="check-camera-search">
          <search-form ref="form" :options="searchForm" class="check-camera-search-form"></search-form>
          <div class="check-camera-search-btn">
            <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
            <el-button size="mini" @click="doClear">重置</el-button>
          </div>
        </div>
        <div class="check-camera-table">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="未选" name="total">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange(1)">选择所有的数据</el-checkbox>
              <camera-table
                ref="table"
                :options="tableOptions"
                @on-select="selectedData"
                @on-select-all="selectedData"
                @on-change-page="changeCurrentPage"
                @on-page-size-change="changePageSize"
              ></camera-table>
              <div style="text-align:center;">
                <span
                  style="padding-right: 10px"
                >{{checkAll ? '已选择全部' : '已选择' + choosedDataLen + '条'}}</span>
                <el-button
                  size="mini"
                  type="primary"
                  style="margin-right: 4px;"
                  @click="chooseCamera"
                >选择</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="'已选' + checkedOptions.total" name="checked">
              <el-checkbox v-model="cancelCheckAll" @change="handleCheckAllChange(2)">取消选择所有的数据</el-checkbox>
              <camera-table
                ref="table1"
                :options="checkedOptions"
                @on-select="cancelSelectedData"
                @on-select-all="cancelSelectedData"
                @on-change-page="changeCurrentPage"
                @on-page-size-change="changePageSize"
              ></camera-table>
              <div style="text-align:center;">
                <span>{{cancelCheckAll ? '已取消选择全部' : '已取消选择' + cancelCheckedDataLen + '条'}}</span>
                <el-button
                  size="mini"
                  type="primary"
                  style="margin-right: 4px;"
                  @click="cancelChecked"
                >取消选择</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import searchForm from "../../form/index";
import cameraTable from "../../table/table";
export default {
  
  components: { searchForm, cameraTable },
  data() {
    let height =
      document.documentElement.clientHeight * 0.85 -
      50 -
      54 -
      49 -
      40 -
      15 -
      42 -
      20;
    return {
      isIndeterminate: true,
      dataVisible: false,
      idArr: [],
      cameraStatusList: [
        {
          id: 4,
          name: "离线"
        },
        {
          id: 1,
          name: "正常"
        },
        {
          id: 3,
          name: "故障"
        }
      ],
      searchForm: {
        model: {},
        cols: 6,
        size: "mini",
        formItemList: [
          {
            label: "",
            placeholder: "省份",
            type: "select",
            name: "regionCode",
            optionsList: []
          },
          {
            label: "",
            placeholder: "路线",
            type: "select",
            name: "roadId",
            optionsList: []
          },
          {
            label: "",
            placeholder: "摄像机状态",
            type: "select",
            name: "onlineStatus",
            optionsList: [
              {
                id: 0,
                name: "离线"
              },
              {
                id: 1,
                name: "正常"
              },
              {
                id: 2,
                name: "故障"
              }
            ]
          },
          {
            label: "",
            placeholder: "所属类别",
            type: "select",
            name: "classify",
            optionsList: []
          },
          {
            label: "",
            placeholder: "请输入摄像机名称",
            type: "input",
            name: "cameraName",
            width: "150px"
          }
        ]
      },
      tableOptions: {
        pageNumber: 1,
        pageSize: 10,
        selection: true,
        localData: [],
        border: true,
        uniqueId: "cameraId",
        selectionCache: true,
        maxHeight: height,
        columns: [
          {
            key: "sort",
            title: "序号"
          },
          {
            key: "regionName",
            title: "省份"
          },
          {
            key: "organizationName",
            title: "管辖单位"
          },
          {
            key: "cameraName",
            title: "摄像机名称"
          },
          {
            key: "roadName",
            title: "路线"
          },
          {
            key: "pile",
            title: "桩号"
          },
          {
            key: "classify",
            title: "所属类别"
          },
          {
            key: "cameraStatus",
            title: "状态"
          }
        ]
      },
      checkedOptions: {
        pageNumber: 1,
        pageSize: 10,
        selection: true,
        localData: [],
        border: true,
        maxHeight: height,
        total: 0,
        columns: [
          {
            key: "sort",
            title: "序号"
          },
          {
            key: "regionName",
            title: "省份"
          },
          {
            key: "organizationName",
            title: "管辖单位"
          },
          {
            key: "cameraName",
            title: "摄像机名称"
          },
          {
            key: "roadName",
            title: "路线"
          },
          {
            key: "pile",
            title: "桩号"
          },
          {
            key: "classify",
            title: "所属类别"
          },
          {
            key: "cameraStatus",
            title: "状态"
          }
        ]
      },
      activeName: "total",
      choosedDataLen: 0,
      choosedData: [],
      classifyList: [],
      checkAll: false,
      areadyChoose: false,
      cancelCheckedData: [],
      cancelCheckAll: false,
      cancelCheckedDataLen: 0
    };
  },

  computed: {
    ...mapState([
      "UserOrgTree",
      "UserOrgTreeChild"
    ]),
  },
  props: {
    // UserOrgTree: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // },
      borrowId: String,
    editUser: {
      type: Object,
      default: () => {
        return {};
      }
    },
    listData:{
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  created() {
    this.getUserOrganization().then(() => {
       this.UserOrgTree.forEach((item) => {
        this.idArr.push(item.organizationId);
      });
      window.localStorage.setItem("orgId", this.idArr);
    });
    this.queryList();
  },
  // created() {
  //   Promise.all([
  //     this.loadClassify(),
  //     this.loadArea(),
  //     this.queryRoadList()
  //   ]).then(res => {
  //     _.each(this.searchForm.formItemList, it => {
  //       if (it.name === "regionCode" && res[1].code === 200) {
  //         let list = res[1].data;
  //         list.unshift({
  //           regionCode: "",
  //           regionName: "全国",
  //           alias: "全国",
  //           parentRegionCode: "0"
  //         });
  //         it.optionsList = _.map(list, item => {
  //           return {
  //             id: item.regionCode,
  //             name: item.regionName
  //           };
  //         });
  //       }
  //       if (it.name === "roadId" && res[2].code === 200) {
  //         it.optionsList = _.map(res[2].data, item => {
  //           return {
  //             id: item.roadCode,
  //             name: item.roadName
  //           };
  //         });
  //       }
  //       if (it.name === "classify" && res[0].code === 200) {
  //         it.optionsList = _.map(res[0].data, item => {
  //           return {
  //             id: item.codeValue,
  //             name: item.codeName
  //           };
  //         });
  //         this.classifyList = _.map(res[0].data, item => {
  //           return {
  //             id: item.codeValue,
  //             name: item.codeName
  //           };
  //         });
  //       }
  //     });
  //   });
  //   this.getUserOrganization();
  //   this.queryList();
  // },

  mounted() {
    // this.$refs.tree.setCurrentKey(this.UserOrgTree[0].organizationId);
  },
  methods: {
    ...mapActions(["getSysUserList", "getUserOrganization", "getRoleList"]),
    changeCurrentPage(pageNumber) {
      if (this.activeName === "total") {
        this.tableOptions.pageNumber = pageNumber;
        this.queryList();
      } else {
        this.checkedOptions.pageNumber = pageNumber;
        this.queryChoosedData();
      }
    },
    
    changePageSize(pageSize) {
      if (this.activeName === "total") {
        this.tableOptions.pageNumber = 1;
        this.tableOptions.pageSize = pageSize;
        this.queryList();
      } else {
        this.tableOptions.pageNumber = 1;
        this.checkedOptions.pageSize = pageSize;
        this.queryChoosedData();
      }
    },
    queryList() {
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if (it && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      });
      
      let params = {
        currPage: this.tableOptions.pageNumber,
        pageSize: this.tableOptions.pageSize,
        ...form,
        organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : "",
        selected: 0,
        type: !_.isEmpty(this.editUser) ? 1 : 0,
      };
      console.log(params,"aaaa")
      this.$api.getCameraBindList(params).then(res => {
        this.tableOptions.localData = this.resetTableData(res.data);
        this.tableOptions.total = res.total;
      });
    },
    queryChoosedData() {
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if (it && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      });
      let params = {
        currPage: this.checkedOptions.pageNumber,
        pageSize: this.checkedOptions.pageSize,
        ...form,
        organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : "",
        selected: 1,
      };
      console.log(params,"sdsd")
      this.$api.getCameraBindList(params).then(res => {
        this.checkedOptions.localData = this.resetTableData(res.data);
        this.checkedOptions.total = res.total;
      });
    },
    closeChoosedDialog() {
      this.areadyChoose = this.checkAll || this.choosedDataLen > 0;
      this.$emit("close-choose-cameras", this.areadyChoose);
    },
    resetTableData(data) {
      let vm = this;
      data = _.map(data, (it, index) => {
        let cameraStatus = _.find(vm.cameraStatusList, {
          id: it.cameraStatus
        });
        let classify = _.find(vm.classifyList, {
          id: it.classify + ""
        });
        return {
          sort: index + 1,
          ...it,
          cameraStatus: cameraStatus ? cameraStatus.name : it.cameraStatus,
          classify: classify ? classify.name : it.classify
        };
      });
      return data;
    },
    handleCheckAllChange(type) {
      let table = null;
      if (type === 1) {
        table = this.$refs.table.getOriginTable();
        table.toggleAllSelection(this.checkAll);
      } else {
        table = this.$refs.table1.getOriginTable();
        table.toggleAllSelection(this.cancelCheckAll);
      }
    },
    chooseCamera() {
      let cameras = this.$refs.table.getSelected();
      let params = {};
      if (this.checkAll) {
        let form = {};
        _.each(this.searchForm.model, (it, key) => {
          if (it && !_.isNumber(it) && it.trim()) {
            form[key] = it;
          } else if (it && _.isNumber(it)) {
            form[key] = it;
          }
        });
        params = {
          userId: this.editUser.userId,
          borrowId: this.borrowId,
          userBindCameraReq: {
            // all: 1,
            // ...form,
            // userOrgId: this.editUser.organizationId,
            all: 1,
            ...form,
            userOrgId: this.editUser.organizationId
          },
        };
      } else {
        let data = _.map(cameras, it => {
          return it.cameraId;
        });
        this.choosedData = this.choosedData.concat(data);
        params = {
          userId: this.editUser.userId,
          borrowId: this.borrowId,
          userBindCameraReq: {
            // all: this.checkAll ? 1 : 0,
            // cameraIds: this.choosedData,
            "all": this.checkAll ? 1 : 0,
            "cameraIds": this.choosedData
          },
        };
      }
      console.log(params,"sdadas")
      this.$api.camerasChoose(params).then(res => {
        if (res.code !== 200) {
          this.$message({
            type: "error",
            message: res.message || "选择失败"
          });
          return;
        }
        this.$message({
          type: "success",
          message: "选择成功"
        });
        this.queryList();
        this.queryChoosedData();
        this.checkAll = false;
        this.choosedData = [];
        this.choosedDataLen = 0;
      });
      // this.checkedOptions.localData = cameras;
    },
    cancelChecked() {
      let cancelData = this.$refs.table1.getSelected();
      this.cancelCheckedData = cancelData;
      let params = {};
      if (this.cancelCheckAll) {
        let form = {};
        _.each(this.searchForm.model, (it, key) => {
          if (it && !_.isNumber(it) && it.trim()) {
            form[key] = it;
          } else if (it && _.isNumber(it)) {
            form[key] = it;
          }
        });
        params = {
          userId: this.editUser.userId,
          borrowId: this.borrowId,
          userBindCameraReq: {
            all: 1,
            userOrgId: this.editUser.organizationId,
            ...form
          }
        };
      } else {
        let data = _.map(cancelData, it => {
          return it.cameraId;
        });
        this.cancelCheckedData = data;
        params = {
          userId: this.editUser.userId,
          borrowId: this.borrowId,
          userBindCameraReq: {
            all: this.cancelCheckAll ? 1 : 0,
            cameraIds: this.cancelCheckedData
          }
        };
      }
      this.$api.params.delCamerasChoose(params).then(res => {
        if (res.code !== 200) {
          this.$message({
            type: "error",
            message: res.message || "取消选择失败"
          });
          return;
        }
        this.$message({
          type: "success",
          message: "取消选择成功"
        });
        this.queryList();
        this.queryChoosedData();
        this.cancelCheckAll = false;
        this.cancelCheckedData = [];
        this.cancelCheckedDataLen = 0;
      });
    },
    loadClassify() {
      var _this = this;
      return this.$api.getCodemaster({
        codeType: "CLASSIFY"
      });
    },
    queryRoadList(orgId) {
      let _this = this;
      return this.$api.getRoadsByOrgId("");
    },
    loadArea() {
      return this.$api.getProvince({
        regionLevel: 1
      });
    },
    setDataPermission() {
      this.dataVisible = true;
      this.queryChoosedData(true);
      this.queryList();
      this.$nextTick(() => {
        this.queryChoosedData();
      });
      this.cancelCheckedDataLen = 0;
      this.choosedDataLen = 0;
      this.checkAll = false;
      this.cancelCheckAll = false;
    },
    handleTreenode() {
      this.tableOptions.pageNumber = 1;
      this.queryList();
    },
    doSearch() {
      this.tableOptions.pageNumber = 1;
      if (this.activeName === "total") {
        this.queryList();
      } else {
        this.queryChoosedData();
      }
    },
    handleClick() {
      this.searchForm.model = {};
    },
    doClear() {
      this.searchForm.model = {};
      this.tableOptions.pageNumber = 1;
      this.tableOptions.pageSize = 10;
      this.checkedOptions.pageNumber = 1;
      this.checkedOptions.pageSize = 10;
      this.doSearch();
    },
    selectedData(data) {
      this.$nextTick(() => {
        this.choosedDataLen = this.$refs.table.getSelected().length;
      });
    },
    cancelSelectedData(data) {
      this.$nextTick(() => {
        this.cancelCheckedDataLen = this.$refs.table1.getSelected().length;
      });
    },
    getChoosedData() {
      return {
        all: this.checkAll,
        choosedData: this.choosedData
      };
    },
    doCheckedAll() {}
  }
};
</script>
<style lang="less">
.check-camera-dialog {
  overflow: hidden;
  .el-dialog__body {
    padding: 0px 20px 20px !important;
    height: calc(85vh - 50px - 54px);
  }
  .check-camera-body {
    display: flex;
    height: 100%;
    .check-camera-tree {
      
      border-right: 1px solid #ddd;
      height: 100%;
      overflow-y: auto;
    }
    .check-camera-right {
      
      padding-left: 16px;
      .check-camera-search {
        display: flex;
        .check-camera-search-btn {
          width: 224px;
          padding-left: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>