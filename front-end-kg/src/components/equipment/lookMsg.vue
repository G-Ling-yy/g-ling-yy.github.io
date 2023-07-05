<template>
  <div class="my-detaills">
    <div class="my-header">
      <div class="my-header-left">
        <div class="my-left-box1">摄像机组</div>
        <div class="my-left-box2">{{ row.groupName }}</div>
      </div>
      <div class="my-header-right">
        <div class="my-right-box1" style="padding-right:10px;">创建时间</div>
        <div class="my-right-box2">{{ row.createDate }}</div>
      </div>
    </div>
    <div style="height:1px;
border:1px solid rgba(212,212,212,1);"></div>
    <div class="cameraCount">
      <span class="cameraCount-box1">摄像机数：</span>
      <span class="cameraCount-box2">{{ tableData.total }}</span>
    </div>
    <div class="table-content-body">
      <div class="table-content-inner">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          :max-height="maxHeight"
          border
          :header-cell-style="{
            background: '#F5F7FA',
            color: '#606266',
            textAlign: 'left'
          }"
        >
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="regionName" label="省市" width="200">
            <!-- <template slot-scope="scope">
              <div>
                {{
                scope.row.provinceName +
                "/" +
                scope.row.cityName +
                "/" +
                scope.row.regionName
                }}
              </div>
            </template>-->
          </el-table-column>
          <el-table-column prop="organizationId" label="管辖单位" width="120"></el-table-column>
          <el-table-column prop="roadCode" label="所属路线" width="100"></el-table-column>
          <el-table-column
            prop="cameraName"
            label="摄像机名称"
            :show-overflow-tooltip="true"
            width="120"
          ></el-table-column>
          <el-table-column prop="kmPile" label="桩号" width="100"></el-table-column>
          <el-table-column align="center" label="经纬度" width="200" prop="longAndLati">
            <!-- <template slot-scope="scope">
              <div>
                <span class="itude">{{ scope.row.longitude }},</span>
                <span class="itude">{{ scope.row.latitude }}</span>
              </div>
            </template>-->
          </el-table-column>
          <el-table-column prop="classifyCode" label="所属类别" width="100">
            <!-- 	
            所属类别,0：默认 1：道路沿线 2：桥梁 3：隧道 4：收费广场 5：收费站 6：服务区 7：ETC门架 8：移动视频源-->
            <template slot-scope="scope">
              <div>
                {{ scope.row.classifyCodeDesc}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="derectionCode" label="方向" width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.derectionCodeDesc }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="cameraStatus" label="摄像机状态" width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.cameraStatusDesc}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="transcodingName" label="所属上云网关" width="200"></el-table-column>
          <el-table-column prop="reportSource" label="所属平台" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.reportSource==1 ? "网关" : "平台" }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="cameraType" label="摄像机类型" width="100">
            <!-- 摄像机类型 1:监控型枪机 2:监控型球机 3:全景型 4:抓拍型 -->
          </el-table-column>
          <el-table-column prop label="查看" fixed="right">
            <template slot-scope="scope">
              <img @click="checkDes(scope.row)" src="../../assets/images/equipment/chakan.png" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <div class="search-one" v-if="tableData.content.length>0"> -->
    <div class="table-pagination">
      <p class="total-pagination">共{{tableTotal}}条</p>
      <el-pagination
        background
        layout="prev, pager, next, sizes, total, jumper"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        :total="tableTotal"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <div class="my-user">
      <div>所含角色：</div>
      <span class="one-user" v-for="(item, index) in roleData" :key="index">{{ item.roleName }}</span>
      <!-- <div class="one-user">用户二</div>
        <div class="one-user">用户三</div>
        <div class="one-user">用户四</div>
      <div class="one-user">用户五</div>-->
    </div>
    <div class="my-user">
      <div>所含用户：</div>
      <span class="one-user" v-for="(item, index) in userData" :key="index">{{ item.loginName }}</span>
      <!-- <div class="one-user">用户二</div>
        <div class="one-user">用户三</div>
        <div class="one-user">用户四</div>
      <div class="one-user">用户五</div>-->
    </div>
    <el-dialog
      title="查看详情"
      :visible.sync="cameraDialogVisible"
      width="879px"
      custom-class="gd-dialog camera-details-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <camera-detail v-if="cameraDialogVisible" ref="cameraDetail" :camera-detailed-info="cameraDetailedInfo"></camera-detail>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import cameraDetail from "../module/equipment/cameraDetail";
import $http from "../../filters/http";
import api from "../../api/index";
export default {
  components: { cameraDetail },
  data() {
    let maxHeight =
      document.documentElement.clientHeight * 0.86 -
      50 -
      47 -
      20 -
      45 -
      40 -
      32 -
      20 -
      26 -
      30;
    return {
      maxHeight,
      tableData: [],
      tableTotal: '',
      pagesize: 10,
      currpage: 1,
      total: "",
      userData: [],
      roleData: [],
      stateList: ["离线", "正常", "故障"],
      stateCol: ["#878787", "#26B55F", "#F9552F"],
      row: [],
      groupId: "",
      cameraDetailedInfo: {},
      cameraDialogVisible: false
    };
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currpage = cpage;
      this.getData(this.groupId);
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
      this.getData(this.groupId);
    },
    getData(groupId) {
      var groupid = this.$parent.$parent.groupId;
      this.row = this.$parent.$parent.rows;
      var params = {
        id: groupId,
        info:{
          currPage:this.currpage,
          pageSize:this.pagesize
        }
      };
      this.$api.getDeviceCameraList(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.tableTotal = res.total
        }
      });
    },
    // 获取已关联的用户
    getUserData(groupId) {
      var groupId = this.$parent.$parent.groupId;
      var params = { groupId: groupId };
      this.$api.getSelectedUser(params).then(res => {
        if (res.code === 200) {
          this.userData = res.data;
          // res.data.content.map(item => {
          //   this.userData.push(item);
          // });
        }
      });
    },
    // 获取已关联的角色
    getRoleData(groupId) {
      var groupId = this.$parent.$parent.groupId;
      var params = { groupId: groupId };
      this.$api.getSelectdRole(params).then(res => {
        if (res.code === 200) {
          this.roleData = res.data;
          // res.data.content.map(item => {
          //   this.userData.push(item);
          // });
        }
      });
    },
    checkDes(row) {
      let params = {
        id: row.cameraNum
      };
      this.$api.getCameraDetails(params).then(res => {
        if (res.code == 200) {
          this.cameraDetailedInfo = res.data;
          this.cameraDialogVisible = true;
        }
      });
    },
    clearCameraList() {
      this.$refs.cameraDetail.resetCurrent();
    }
  },
  mounted() {
    this.getUserData();
  }
  
};
</script>

<style>
.el-dialog__body {
  height: calc(100% - 47px);
}
.my-detaills {
  height: 100%;
}
.el-pagination__total {
  margin-left: 30px;
}

.table-content-inner {
  height: 100%;
}

.my-header {
  display: flex;
  justify-content: space-between;
  height: 45px;
  align-items: center;
}

.my-header > div {
  display: flex;
  align-items: center;
}

.my-header .my-header-left .my-left-box1 {
  width: 50px;
  line-height: 24px;
  text-align: center;
  background: #1274ee;
  color: #fff;
  font-size: 12px;
  margin-right: 10px;
}

.my-header .my-header-left .my-left-box2 {
  color: #000;
  font-size: 14px;
}
.my-header .my-header-right .my-left-box1 {
  color: #ffffff;
  font-size: 14px;
  margin-right: 5px;
}

.cameraCount {
  height: 40px;
  line-height: 40px;
}

.cameraCount .cameraCount-box2 {
  color: #1274ee;
}

.my-user {
  display: flex;
  margin-top: 20px;
}
.my-user div {
  height: 26px;
  line-height: 26px;
  margin-right: 10px;
}

.my-user .one-user {
  background: rgba(232, 234, 239, 1);
  border-radius: 2px;
  font-size: 14px;
  padding: 0 4px;
  margin-right: 5px;
  line-height: 25px;
}

.itude {
  text-decoration: underline;
}
</style>
