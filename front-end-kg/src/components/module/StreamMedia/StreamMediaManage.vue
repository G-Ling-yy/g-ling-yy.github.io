<template>
  <div class="content-wrapper streamMediaManage" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>流媒体管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="camera-search-display camera-manage-search">
      <!-- <div> -->
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="名称">
            <el-input
              v-model="postData.smName"
              clearable
              placeholder="请输入内容"
              style="width: 150px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备厂商">
            <el-select
              v-model="postData.smType"
              clearable
              style="width: 150px;"
              placeholder="设备厂商"
            >
              <el-option
                :value-key="item.codeValue"
                v-for="item in vendors"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
          <el-button type="primary" class="query" @click="query"
            >搜索</el-button
          >
          <el-button type="primary" class="reset" @click="clearData"
            >重置</el-button
          >
          </el-form-item>-->
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
          <el-button type="primary" plain class="query" @click="add()"
            >新增</el-button
          >
        </div>
        <!-- <span @click="seachMore" v-if="isAllHeight%2==0" class="have-more-info">更多</span>
        <span @click="seachMore" v-if="isAllHeight%2!=0" class="have-more-info">收起</span>-->
      </div>
    </div>
    <div class="table-wrapper">
      <!-- <div class="table-control">
        <el-button type="primary" style="margin-left: 10px" plain class="query">数据导出</el-button>
      </div> -->
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          :data="streamMediaList"
          border
          height="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column prop="smName" label="名称" width></el-table-column>
          <el-table-column prop="smValue" label="厂商" width></el-table-column>
          <el-table-column prop label="归属上云网关数" width>
            <template slot-scope="scope">
              <span
                @click="toInfo(scope.row.smId)"
                style="cursor: pointer;color:#007fc4;text-decoration: underline"
                >{{ scope.row.transcodingNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="channelNum" label="归属摄像机数" width>
            <!-- <template slot-scope="scope">
              <span
                @click="toCameraNum(scope.row)"
                style="cursor: pointer;color:#007fc4;text-decoration: underline"
                >{{ scope.row.channelNum }}</span
              >
            </template> -->
          </el-table-column>
          <el-table-column
            prop="smPushurl"
            label="推流地址"
            width
          ></el-table-column>

          <el-table-column
            prop="smPullurl"
            label="拉流地址"
            width
          ></el-table-column>
          <el-table-column label="操作" width="150">
            <template class slot-scope="scope">
              <div class="img-con">
                <el-tooltip effect="dark" content="修改" placement="top">
                  <el-button
                    class="table-control-btn"
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="edit(scope.row.smId)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button
                    class="table-control-btn"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteSm(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="查看详情" placement="top">
                  <el-button
                    class="table-control-btn"
                    type="primary"
                    icon="el-icon-document"
                    size="mini"
                    @click="toDetail(scope.row.smId)"
                  ></el-button>
                </el-tooltip>
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
    <!--<el-dialog  title="新增" :visible.sync="dialogTableVisible" width="850px"
               custom-class="gd-custom-dialog"
               v-dialogDrag
               :append-to-body="true"
               :close-on-click-modal="false"
    >
    </el-dialog>-->
    <!-- 修改弹窗 -->
    <stream-media-dialog
      :visible.sync="dialogTableVisible"
      :handleType="handleType"
      :streamMetiaId.sync="editStreamMetiaId"
      @handleSubmitSucess="query"
    ></stream-media-dialog>

    <!--<el-dialog title="归属上云网管信息" :visible.sync="dialogTableVisibleDetail" width="850px"
               custom-class="gd-custom-dialog"
               v-dialogDrag
               :append-to-body="true"
               :close-on-click-modal="false">
    </el-dialog>-->
    <!-- 详情弹窗 -->
    <InfoEle
      ref="infoRef"
      :smId="transcodingBindSmId"
      :visible.sync="dialogTableVisibleDetail"
    ></InfoEle>
    <!-- <Camera-num-dialog
      ref="cameraNum"
      :smId="transcodingBindSmId"
      :visible.sync="showCameraNumDialog"
    ></Camera-num-dialog> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
//import {mapActions, mapState} from 'vuex';
//import $http from '../../../filters/http';
//import api from '../../api/index';
//import Add  from './bk/StreamMediaManageAdd.vue';
//import Edit  from './bk/StreamMediaManageEdit.vue';
import InfoEle from "./StreamMediaBindTranscodingInfo.vue";

import StreamMediaDialog from "./StreamMediaDialog";
import CameraNumDialog from "./streamMediaCameraNumDialog";
export default {
  name: "streamMedia",
  components: {
    //Add,Edit,
    InfoEle,
    StreamMediaDialog,
    CameraNumDialog,
  },
  data() {
    return {
      isAllHeight: 0,
      tableData: {},
      postData: {
        currPage: 1,
        pageSize: 10,
        smName: "",
        smType: "",
        vendor: "",
      },
      streamMediaTotal: 0,
      vendors: [],
      streamMediaList: [],
      dialogTableVisible: false,
      editStreamMetiaId: {},
      handleType: "add",
      dialogTableVisibleDetail: false,
      transcodingBindSmId: 0,
      showCameraNumDialog: false,
      //dialogTableVisibleEdit:false,
    };
  },
  mounted() {
    let params = {
      codeType: "SMTYPE",
    };
    this.getCodemaster(params).then((res) => {
      this.vendors = res.data;
      this.query();
    });
    // this.$nextTick(() => {
    //   this.query();
    // });
  },
  computed: {
    ...mapState(["streamMedia"]),
  },
  methods: {
    ...mapActions(["getCodemaster", "getStreamMediaList", "deleteStreamMedia"]),
    indexMethod(index) {
      return index + 1 + this.postData.pageSize * (this.postData.currPage - 1);
    },
    toDetail(id) {
      this.$router.push({
        name: "流媒体详情",
        
        params: {
          id: id,
        },
      });
    },
    
    query() {
      this.$api.getStreamMediaList(this.postData).then((res) => {
        this.streamMediaList = res.data;
        this.streamMediaTotal = res.total;
        // this.streamMediaList = _.map(res.data, (it) => {
        //   let vendor = _.find(this.vendors, {
        //     codeValue: it.smType,
        //   });
        //   // let vendor = _.find(this.vendors, item => {
        //   //   return item.codeValue === it.smType
        //   // });
        //   it.smValue = vendor ? vendor.codeName : "";
        //   // return it;
        // });
        this.streamMediaList.forEach((item) => {
          for (var i = 0; i < this.vendors.length; i++) {
            if (item.smType == this.vendors[i].codeValue) {
              item.smValue = this.vendors[i].codeName;
            }
          }
        });
      });
    },
    /*getData() {
        $http.post("/sm/pages",this.postData).then((res)=>{
          var res=res.data;
          if(res.code==200){
            this.tableData=res.data;
          }else{
            this.$message.error(res.message);
          }
        })
      },*/
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
      /*this.postData.smName="";
        this.postData.smType="";
        this.postData.vendor="";*/
      this.postData = {
        smName: "",
        smType: "",
        vendor: "",
      };
      this.query();
    },
    add() {
      this.dialogTableVisible = true; //默认页面不显示为false,点击按钮将这个属性变成true
      this.handleType = "add";
      this.editStreamMetiaId = "";
    },
    toInfo(id) {
      this.transcodingBindSmId = id;
      this.dialogTableVisibleDetail = true; //默认页面不显示为false,点击按钮将这个属性变成true
    },
    toCameraNum(row) {
      // console.log(row, "ddd");
      this.transcodingBindSmId = row.smId;
      this.showCameraNumDialog = true; //显示所属摄像机对话框
    },
    edit(id) {
      //var that=this;
      console.log(id);
      this.handleType = "edit";
      this.dialogTableVisible = true;
      this.editStreamMetiaId = id;
      //console.log(this.$refs.editRef);
      /*setTimeout(() => {
          that.$refs.editRef.getEditData(id);
        }, 10)*/
    },
    /*handleSubmitSucess(){
        //this.editStreamMetiaId = "";
        this.query();
      },*/
    deleteSm(row) {
      var params = {
        instructionsDel: {
          module: "资源管理",
          page: "流媒体管理",
          feature: "删除",
          description: "删除流媒体 " + row.smName,
        },
        smId: row.smId,
      };
      this.$confirm("确认删除流媒体：" + row.smName + " ？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        this.deleteStreamMedia(params).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: "删除流媒体成功!",
              type: "success",
            });
            this.query();
          }
        });
      });
    },
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
