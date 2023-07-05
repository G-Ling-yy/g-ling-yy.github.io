<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>组织与用户</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-w">
      <el-card class="box-card centent-body detail">
        <div slot="header" class="clearfix">
          <el-button type="primary" @click="handleBack" style="vertical-align: middle">返回</el-button>
          <!-- <div class="goback" @click="handleBack">&lt; &nbsp; &lt; &nbsp;返回</div> -->
          <span style="line-height: 32px; padding-left:20px;">
            {{
            userInfo.userName
            }}
          </span>
          <div class="clearfix-r">
            <span>
              {{ userInfo.createDate }}
              由 {{ userInfo.createUser }} 创建
            </span>
          </div>
        </div>
        <div class="text item user-detail-body">
          <div>
            <div class="list-head">
              <i class="basicBgc"></i>
              <span class="basicInfo">基础信息</span>
            </div>
            <el-row class="spile-h" :gutter="24">
              <!-- <el-col  style="color:#000000;margin-left:20px;"></el-col> -->
              <el-col :span="3" style="padding-left:40px;">
                <span class="H-color">姓名：</span>
                <span style="color:#000000;margin-left:6px; font-size:12px">{{ userInfo.userName }}</span>
              </el-col>
              <el-col :span="3">
                <span class="H-color">电话:</span>
                <span style="color:#000000;margin-left:6px;font-size:12px">{{ userInfo.phoneNum }}</span>
              </el-col>
              <el-col :span="4" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                <span class="H-color">所属组织：</span>
                <el-tooltip
                class="item"
                effect="dark"
                :content="userInfo.organizationName"
                placement="top-start"
              >
                <span
                  style="color:#000000;margin-left:6px;font-size:12px"
                >{{ userInfo.organizationName }}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="3">
                <span class="H-color">组织类型：</span>
                <span style="color:#000000;margin-left:6px;font-size:12px">
                  {{
                  userInfo.organizationTypeDesc
                  }}
                </span>
              </el-col>
              <el-col :span="3">
                <span class="H-color">账号状态：</span>
                <span
                  style="color:#000000;margin-left:6px;font-size:12px"
                >{{ userInfo.status == 0 ? "禁用" : "启用" }}</span>
              </el-col>
              <el-col :span="8">
                <span class="H-color">关联角色:</span>
                <span style="color:#000000;margin-left:6px;font-size:12px">
                  {{
                  userInfo.roleName
                  ? userInfo.roleName
                  : ""
                  }}
                </span>
              </el-col>
            </el-row>
            <div>
              <div style="border:1px dashed rgba(212,212,212,1);width:100%;"></div>
              <p class="list-body">
                <i class="basicBgc"></i>
                <span class="H-color">关联摄像机组:</span>
                (
                <span class="equipmentCount">{{ groups.length }}</span>)
              </p>
              <div class="userInfo-a">
                <el-collapse v-model="activeRoads" @change="handleOpenTable" accordion>
                  <el-collapse-item v-for="(item, idx) in groups" :key="idx" :name="item.groupId">
                    <template slot="title">
                      <el-button type="primary" size="mini">摄像机组</el-button>
                      <span style="padding:0 20px">
                        <span style="padding:0 5px;">{{ item.groupName }}</span>(
                        <span style="padding-left:5px;">摄像机数:</span>
                        <span class="equipmentCount">{{ item.cameraList.total }}</span>)
                      </span>
                    </template>
                    <div class="table-coll-h">
                      <el-table
                        ref="singleTable"
                        :data="item.cameraList.list"
                        highlight-current-row
                        style="width: 100%;  overflow-y:auto;"
                        border
                        class="user-detail-table"
                      >
                        <el-table-column type="index" label="序号" width="55" fixed></el-table-column>
                        <el-table-column prop="provinceName" label="省市" width="200" fixed>
                          <template slot-scope="scope">
                            <div>
                              {{
                              scope.row.regionName
                              }}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="organizationId" label="管辖单位" width="200"></el-table-column>
                        <el-table-column prop="roadCode" label="所属路线" width="100"></el-table-column>
                        <el-table-column prop="cameraName" label="摄像机名称" width="300"></el-table-column>
                        <el-table-column prop="kmPile" label="桩号" width="100"></el-table-column>
                        <el-table-column align="center" label="经纬度" width="200">
                          <template slot-scope="scope">
                            <div>
                              <span class="itude">{{ scope.row.longAndLati }}</span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="classifyCodeDesc" label="所属类别" width="100"></el-table-column>
                        <el-table-column prop="derectionCodeDesc" label="方向" width="100"></el-table-column>
                        <el-table-column prop="cameraStatusDesc" label="摄像机状态" width="100" fixed="right">
                        </el-table-column>
                        <el-table-column
                          prop="transcodingName"
                          label="所属上云网关"
                          width="200"
                          fixed="right"
                        ></el-table-column>
                        <el-table-column
                          prop="cameraType"
                          label="摄像机类型"
                          width="100"
                          fixed="right"
                        ></el-table-column>
                      </el-table>
                    </div>
                    <div class="table-pagination"  v-if="tableData.length > 9">
                    	<p class="total-pagination">共{{totalSize}}条</p>
                      <el-pagination
                        background
                        layout=" prev, pager, next, sizes, jumper "
                        :current-page="currPage"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :total="totalSize"
                      ></el-pagination>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/api";
export default {
  name: "orgDetail",
  data() {
    return {
      stateList: ["离线", "正常", "故障"],
      stateCol: ["#878787", "#26B55F", "#F9552F"],
      userDetail: {
        userName: "",
        createDate: "",
        createUser: "",
        userPhone: "",
        orgainUtil: "",
        orgType: "",
        person: 0,
        status: "1",
        userPerson: ""
      },
      deviceAmount: 0,
      cameraAmount: 0,
      cameraRoad: "",
      activeRoads: 0,
      roadList: [],
      userInfo: "",
      userInfoList: {},
      tableData: [],
      groups: [],
      currPage: 1,
      pageSize: 10,
      totalSize: 0
    };
  },
  created() {
    this.userInfo = this.$router.history.current.query;
    console.log(this.userInfo, "信息");
    this.getUserInfoList();
  },
  // mounted() {
  //   this.getUserInfoList();
  // },
  methods: {
    handleCurrentChange(cpage) {
      this.currPage = cpage;
      // this.getTableinfo();
      this.getUserInfoList();
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
      // this.getTableinfo();
      thsi.getUserInfoList();
    },

    // 获取用户详情列表
    getUserInfoList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.currPage,
        userId: this.userInfo.userId
      };
      
      api.getOrgUserInfo(params).then(res => {
        // this.userInfoList = res.data;
        this.groups = res.data;
        console.log(this.groups, "摄像机组数据");
        this.tableData = res.data.cameraList
          ? res.data.cameraList.list
          : [];
      });
    },
    // getTableinfo() {
    //   var params = {
    //     currPage: this.currPage,
    //     pageSize: this.pagesize,
    //     param: { groupId: this.groupId }
    //   };
    //   api.checkDev(params).then(res => {
    //     this.tableData = res.data.content;
    //     this.totalSize = res.data.totalSize;
    //   });
    // },
    handleBack() {
      this.$router.go(-1);
    },
    handleOpenTable(val) {
      this.groupId = val;
      // this.getTableinfo();
      this.getUserInfoList();
    }
  }
};
</script>
<style lang="less" src="../../css/userOrganize.less" scoped></style>
