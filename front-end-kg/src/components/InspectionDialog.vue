<template>
  <div class="content-wrapper spt-monitor-manage" ref="viewbox">
    <div class="organize-content">
      <el-card class="box-card centent-l">
        <div slot="header" class="clearfix">
          <szh-tree
            :drag="true"
            @after-drop="afterDrop"
            @on-click="clickScreenshot"
            ></szh-tree>
        </div>
      </el-card>
      <split-screen
        :size="4"
        ></split-screen>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
import checkCamera from "./module/SystemRole/checkCamera";
import splitScreen from './module/spt/splitScreen';
import szhTree from './module/spt/szhTree';
export default {
  name: "InspectionDialog",
  components: { checkCamera, szhTree, splitScreen },
  data() {
    return {
      loading:true,
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
      cameraNum: '',
      dropCamera: null
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
    },
    afterDrop(node){
      this.dropCamera = node;
    }
  }
};
</script>
<style lang="less" src="./css/imageManage.less"></style>
<style lang="less" scoped>
.spt-monitor-manage {
  height: 100%;
  .organize-content {
    height: 100%;
  }
}
.contentBox {
  float: left;
  width: 410px;
  margin: 1%;
  border: 1px solid #ccc;
  height: 300px;
  overflow: hidden;
}
.contentBox {
  .el-upload-dragger {
    width: 100%;
    height: 100%;
    border: 0;
    margin-top: 20%;
  }
} 
.organize-content .centent-r{
  width: 100%;
}
</style>