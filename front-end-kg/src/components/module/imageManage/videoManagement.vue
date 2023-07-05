<template>
  <div class="content-wrapper system-user-organize" ref="viewbox">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
        <el-breadcrumb-item>录像管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="organize-content" style="height:90%">
      <el-card class="box-card centent-l">
        <div slot="header" class="clearfix">
          <image-tree
            @on-click="clickScreenshot"
            ></image-tree>
        </div>
      </el-card>

      <el-card class="box-card centent-r">
        <div slot="header" class="clearfix">
          <span v-if="!titleh.orgName">全国</span>
          <span v-if="titleh.orgName">{{ titleh.orgName }}</span>
        </div>
        <div class="text item content-rbody">
          <div class="camera-search-display camera-manage-search">
            <div
              :class="
                isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'
              "
              style="width:100%;height:auto;"
            >
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="录像时间">
                  <el-date-picker
                    v-model="searchInfo.selectDate"
                    type="datetimerange"
                    width="400"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="left"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="query" @click="query">搜索</el-button>
                  <el-button type="primary" class="reset" @click="handleReset">重置</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain class="query" @click="delCamera()">删除</el-button>
                  <el-button type="primary" plain class="query" @click="exportVideoList()">下载</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="r-table" style="max-height: calc(100% - 200px);">
              <div v-for="(item , index) in tableData" :key="index" style="float:left;padding:0.5%">
                  <video 
                    width="300" 
                    height="240" 
                    controls
                    controlsList="download"
                    >
                    <source :src="item.playUrl" type="video/ogg" />
                    <source :src="item.playUrl" type="video/mp4"/>
                  </video>
                  <el-checkbox style="position: relative;right: 299px;top: -226px;"
                    :key="item.recordId"
                    @change="args => chooseData(args,item)"
                  ></el-checkbox>
                  <!-- <p>{{item.recordId}}</p> -->
                  <div style="display: -webkit-box;">
                    <p style="padding-left:10px">{{item.confirmTime}}</p>
                    <img @click="downVideo(item)" src="../../../assets/images/icon/notDownload.png" style="width:20px;height:20px;    width: 20px;margin: 10px 0 0 100px;cursor: pointer;"/>
                  </div>
                  
              </div>
          </div>
          <!-- 分页 -->
          <div class="table-pagination">
                <p class="total-pagination">共{{sysVideoTotal}}条</p>
            <el-pagination
              background
              layout=" prev, pager, next, jumper "
              :total="sysVideoTotal"
              :page-size="postData.pageSize"
              :current-page="postData.currPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
import checkCamera from "../SystemRole/checkCamera";
import imageTree from "./imageTree";
export default {
  name: "videoManagement",
  components: { checkCamera, imageTree },
  data() {
    return {
      videoData:"",
      searchInfo: {
        selectDate: ""
      },
      tableData: [],
      videoss:"",
      activeName: "second",
      showPagination: false,
      isAllHeight: 0,
      titleh: {
        organizationId: "",
        UName: "",
        uStatus: "",
        loginUser: "",
        orgName: "",
        flag: true,
        selectManyProvince: true,
        parentId: 0
      },
      cascaderProps: {
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true,
        multiple: false
      },

      addUserOrgVisable: false,
      addUserOrg: "",
      newDialog: {
        organizationName: [],
        loginName: "",
        userName: "",
        phoneNum: "",
        regionName: "",
        userStatus: "",
        roleName: [],
        roleCode: [],
        organizationId: "",
        // newOrganizationId:'',
        userId: "",
        roleIds: "",
        source: "1"
      },
      userList: [],
      userTableData: [],
      sysVideoTotal: 0,
      sysUserCurrentPage: 1,
      sysUserCurrentPage: 10,
      org: {
        orgPid: 0,
        orgName: "",
        orgType: "",
        regionCodes: [],
        addProviceList: [],
        proviceName: [],
        firstUtil: [],
        regionName: [],
        parentId: 0,
        parentOrgName: "",
        organizationId: "",
        regionCode: [],
        phone: "",
        responsiblePerson: ""
      },
      postData: {
        currPage: 1,
        pageSize: 5,
        cameraNum: "",
        saveTime: "",
        confirmTime: "",
        saveUserName: ""
      },
      
      orgProviceList: [],
      userSelList: [],
      orgUserList: [],
      idArr: [],
      organizationId: "",
      choosedVideo: [],
      cameraNum: ''
    };
  },
  computed: {
    ...mapState([
      "UserOrgTree",
      "sysUser",
      "setSysUserList",
      "roleList",
      "orgTreeData",
      "provinces"
    ])
  },
  created() {
    this.getCameraList();

  },
  mounted() {
    this.getCameraList();
    
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    ...mapActions(["getSysUserList", "getUserOrganization", "getRoleList"]),
    //查询摄像机录像列表
    getCameraList() {
      this.$api.getCamera(this.postData).then(res => {
        if (res.code == 200) {
          this.sysVideoTotal = res.total;
          let devs = [];
          _.each(res.data, it => {
            devs.push(this.$api.videoPlayRecord(it.recordId))
          });
          Promise.all(devs).then(res1 => {
            this.tableData = _.map(res.data, (it, index) => {
              it.playUrl = res1[index].data;
              return it;
            })
          })
        } else {
          this.$message.error(res.message);
        }
      });
    },
    clickScreenshot(item){
      this.postData.cameraNum = item.cameraNum;
      this.getCameraList();
    },
    // videoPlayRecord(video) {
    //   this.$api.videoPlayRecord(video.recordId).then(res => {
    //     if (res.code == 200) {
    //       this.videoData = res.data;
    //       console.log("2222", this.videoData);
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },

    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 监听滚动事件
    handleScroll() {
      let scrollTop = this.$refs.viewbox.getBoundingClientRect().top;
      if (scrollTop) {
        this.showPagination = true;
        return;
      }
      this.showPagination = false;
    },

    // 导出用户列表
    exportVideoList() {
      _.each(this.choosedVideo, it => {
        this.downVideo(it);
      })
    },
    // 批量处理
    getuserSelect(val) {
      this.userSelList = val.map(item => {
        return item.userId;
      });
    },
    handleSelectionChange(val) {
      this.userSelList = val.map(item => {
        return item.userId;
      });
    },

    chooseData(checked, video) {
      if(checked){
        this.choosedVideo.push(video);
      }else {
        this.choosedVideo = this.choosedVideo.filter(it => {
          return it.recordId !== video.recordId;
        })
      }
    },
    // 删除
    delCamera() {
      // if (!this.tableData.length) {
      //   console.log(this.tableData.length)
      //   this.$message.info({
      //     message: "请选择要删除的项",
      //     type: "info"
      //   });
      //   return false;
      // }
      this.$confirm("提示", {
        title: "提示",
        message: "确认删除吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(res => {
        let ids = _.map(this.choosedVideo, it => it.recordId);
        api.delCamera(ids).then(res => {
          if (res.code == 200) {
            this.$message.success({
              message: "已删除",
              type: "success"
            });
            this.getCameraList();
          }
        });
      });
    },
    // 用户分页处理
    handleSizeChange(sizeVal) {
      this.setSysVideoPages = sizeVal;
      this.getCameraList();
    },
    handleCurrentChange(curPage) {
      this.transcodingCurrentPage = 1;
      this.setSysVideoPages = curPage;
      this.getCameraList();
    },

    // 搜索
    query() {
      this.postData.saveTime = this.searchInfo.selectDate[0]; //开始时间
      this.postData.confirmTime = this.searchInfo.selectDate[1]; //结束时间
      console.log('开始'+this.postData.saveTime+'结束'+this.postData.confirmTime)
      this.getCameraList();
    },
    // 重置
    handleReset() {
      this.postData.saveTime = '';
      this.postData.confirmTime = '';
      this.searchInfo.selectDate = '';
      this.postData.cameraNum = '';
      this.getCameraList();
    },
    downVideo(item){
      this.$http.get(item.playUrl, {
        responseType: 'blob'
      }).then(res => {
        var href = window.URL.createObjectURL(res.data);             // 创建下载的链接
        var downloadElement = document.createElement('a');
        downloadElement.href = href;
        downloadElement.download = item.confirmTime;    // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click();                                 // 点击下载
        document.body.removeChild(downloadElement);              // 下载完成移除元素
        window.URL.revokeObjectURL(href);
      })
    }
  }
};
</script>
<style lang="less" src="../../css/imageManage.less"></style>
