<template>
  <div class="table-box">
    <div class="table-content-body">
      <el-table
        ref="multipleTable"
        class="custom-cloud-table"
        :data="this.tableData.data"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="groupName" label="摄像机组名称"></el-table-column>

        <el-table-column prop="deviceCount" label="设备数量"></el-table-column>
        <el-table-column prop="userCount" label="关联用户"></el-table-column>
        <el-table-column prop="createUser" label="创建人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <img
              src="../../assets/images/equipment/copy.png"
              v-if="scope.row.status == 1"
              @click="changeStatus(scope.row.groupId, 0)"
            />
            <img
              src="../../assets/images/equipment/copy2.png"
              v-if="scope.row.status == null || scope.row.status == 0"
              @click="changeStatus(scope.row.groupId, 1)"
            />
            <img
              src="../../assets/images/equipment/glyh.png"
              @click="associated(scope.row.groupId)"
            />
            <img
              src="../../assets/images/equipment/bianji.png"
              @click="updateEquip(scope.row.groupId, scope.row)"
            />
            <img
              src="../../assets/images/equipment/shanchu.png"
              @click="delEquip(scope.row.groupId)"
            />
            <img
              src="../../assets/images/equipment/chakan.png"
              @click="lookMsg(scope.row.groupId, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 关联用户 -->
      <el-dialog
        title="关联用户"
        :visible.sync="associatedUser"
        :modal-append-to-body="false"
        width="30%"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="关联用户">
            <el-select
              v-model="myUserData"
              multiple
              placeholder="请选择"
              style="width:400px;"
              @change="changeUserVal"
            >
              <input
                type="text"
                placeholder="请输入"
                class="el-input__inner"
                v-model="dropDownValue"
                @keyup="dropDownSearch"
              />
              <el-option
                v-for="(item, index) in userDataShow"
                :value-key="item"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="associatedUser = false">取 消</el-button>
          <el-button type="primary" @click="addAssociatedUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 查看详情 -->
      <el-dialog
        title="查看详情"
        :visible.sync="lookmsg"
        width="85%"
        :modal-append-to-body="false"
        custom-class="gd-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <LookMsg ref="mychild"></LookMsg>
      </el-dialog>

      <!-- 新增设备/修改设备 -->
      <el-dialog
        :title="!addEquipment ? this.myTitle : ''"
        :visible.sync="addEquipment"
        width="25%"
        :modal-append-to-body="false"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <div class="add-equipment">
          <div class="equipment-name">
            <div class="equipment-name-left left">摄像机组名称：</div>
            <div class="equipment-name-right right">
              <el-input v-model="equipmentName" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="select-equipment">
            <div class="select-box1">
              <div class="select-equipment-left left">选择设备：</div>
              <div class="select-equipment-right right">
                <div>
                  <img src="../../assets/images/equipment/add.png" @click="selectEquip" />
                </div>
              </div>
            </div>
            <div class="select-box2">
              <div class="left"></div>
              <div class="right">
                <ul class="equipment-options" v-if="checkData.length > 0">
                  <li v-for="(item, index) in checkData" :key="index">
                    <span
                      style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: left;"
                    >{{ item.cameraName }}</span>
                    <span @click="delOndCamera(index)">x</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="select-role">
            <div class="select-role-left left">选择人员：</div>
            <div class="select-role-right right">
              <el-select v-model="userId" multiple placeholder="请选择" style="width:350px;">
                <el-option
                  v-for="(item, index) in allUserData"
                  :value-key="item.userId"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addEquipment = false">取 消</el-button>
            <el-button type="primary" @click="btnAddEquipment">确 定</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 选择设备 -->
      <el-dialog
        title="选择设备"
        :visible.sync="selectEquipment"
        width="75%"
        :modal-append-to-body="false"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <SelectEquipment ref="mychild1"></SelectEquipment>
      </el-dialog>
    </div>
    <div class="table-pagination">
      <p class="total-pagination">共{{tableData.total}}条</p>
      <el-pagination
        background
        layout="prev, pager, next, sizes, total, jumper"
        :page-sizes="[1, 2, 3]"
        :page-size="pagesize"
        :total="tableData.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import $http from "../../filters/http";
import api from "../../api/index";
import LookMsg from "./lookMsg";
import SelectEquipment from "./selectEquipment";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      userDataShow: [],
      valueMeta: [],
      dropDownValue: "",
      pagesize: 3,
      currpage: 1,
      associatedUser: false,
      lookmsg: false,
      addEquipment: false, //是否是增加
      selectEquipment: false,
      userData: [],
      myUserData: [],
      groupId: "",
      rows: [],
      equipmentName: "",
      allUserData: [],
      checkData: [],
      userId: "",
      myUserArr: [],
      myTitle: "",
      //   isAdd: false, //是否是编辑
      isAll: false,
      updateGroupId: "",
      checkTableData: [],
      groupId1: ""
    };
  },
  components: {
    //用来注册子组件的节点
    LookMsg,
    SelectEquipment
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currpage = cpage;
      this.getData();
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
      this.getData();
    },
    getData() {
      var params = {
        currPage: this.currpage,
        pageSize: this.pagesize,
        param: {
          userName: "",
          groupName: "",
          provinceCode: "",
          organizationCode: ""
        }
      };

      $http.post("/device/group/groupInfo/", params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data;
        }
      });
    },
    //关联用户
    associated(groupId) {
      this.isAll = false;
      this.associatedUser = true;
      this.groupId1 = groupId;
      var params1 = { currPage: 0, pageSize: 0, param: { groupId: groupId } };
      $http.post("/device/group/checkUser/", params1).then(res => {
        if (res.data.code === 2000) {
          this.myUserData = res.data.data.content.map(item => {
            if (item != null) {
              return item.userName;
            }
          });
        }
      });

      $http
        .post("/user/list/" + groupId + "?currPage=0&pageSize=0", {})
        .then(res => {
          this.userData = res.data.data;
          this.userDataShow = res.data.data.map(item => {
            return item.userName;
          });
        });
    },
    changeUserVal(val) {
      console.info(val);
    },

    //搜索
    dropDownSearch() {
      this.userDataShow = this.userData
        .map(item => {
          return item.userName;
        })
        .filter(this.filterSearch);
    },
    filterSearch(item) {
      return item.includes(this.dropDownValue);
    },

    addAssociatedUser() {
      if (this.isAll) {
        var groupIds = this.checkTableData.map(item => {
          return item.groupId;
        });
      } else {
        var groupIds = [this.groupId1];
      }
      var data = [];
      for (let i = 0; i < this.myUserData.length; i++) {
        for (let j = 0; j < this.userData.length; j++) {
          if (this.myUserData[i] == this.userData[j].userName) {
            data.push(this.userData[j].userId);
          }
        }
      }
      var params = { groupIds: groupIds, users: data };
      console.info(params);
      $http.post("/device/group/v2/user", params).then(res => {
        console.info(res);
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "关联成功"
          });
        }
      });
      this.associatedUser = false;
      this.getData();
    },
    //查看摄像机组详情
    lookMsg(groupId, row) {
      this.lookmsg = true;
      this.groupId = groupId;
      this.rows = row;

      setTimeout(() => {
        this.$refs.mychild.groupId = groupId;
        this.$refs.mychild.getUserData(groupId);
        this.$refs.mychild.getData(groupId);
      }, 5);
    },

    //删除摄像机组
    delEquip(groupId) {
      this.$confirm("确定要删除该设备分组吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var arr = [];
          arr.push(groupId);
          var params = {
            groupIds: arr
          };
          $http.delete("/device/group/delete", { data: params }).then(res => {
            if (res.data.code == 2000) {
              this.getData();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //选择设备
    selectEquip() {
      this.selectEquipment = true;
      if (this.isAdd) {
        //this.equipmentName = "";
        //this.userId = [];
        //this.checkData = [];
      }
    },
    delOndCamera(idx) {
      this.checkData.splice(idx, 1);
    },
    //确定添加或者更新设备
    btnAddEquipment() {
      if (this.addEquipment) {
        var cameraIds = this.checkData.map(item => {
          return parseInt(item.cameraId);
        });
        console.log(cameraIds);
        var params = {
          cameraIds: cameraIds,
          groupName: this.equipmentName,
          users: this.userId
        };
        console.log(params);
        $http.post("/device/group/newAdd", params).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
          this.getData();
          this.addEquipment = false;
        });
      } else {
        var cameraIds = this.checkData.map(item => {
          return parseInt(item.cameraId);
        });
        var params = {
          cameraIds: cameraIds,
          groupId: this.updateGroupId,
          groupName: this.equipmentName,
          users: this.userId
        };
        $http.post("/device/group/newUpdate", params).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
          }
          this.getData();
          this.addEquipment = false;
        });
      }
    },
    //编辑设备
    updateEquip(groupId, row) {
      // this.isAdd = true;
      this.updateGroupId = groupId;
      this.equipmentName = row.groupName;
      this.myTitle = "编辑设备";
      this.addEquipment = true;
      // this.checkData = [];
      this.allUserData = [];
      var params = { currPage: 1, pageSize: 10, param: { groupId: groupId } };
      $http.post("/device/group/checkDev", params).then(res => {
        if (res.data.code == 2000) {
          this.checkData = res.data.data.content;
        }
      });
      $http.post("/device/group/checkUser", params).then(res => {
        if (res.data.code == 2000) {
          this.userId = res.data.data.content.map(item => {
            return item.userId;
          });
        }
      });
      var params1 = {
        endDate: "",
        organizationId: "0",
        organizationName: "",
        phoneNum: "",
        regionName: "",
        startDate: "",
        userName: "",
        userStatus: ""
      };
      $http
        .post("/org/orgUsers?currentPage=1&pageSize=1000", params1)
        .then(res => {
          if (res.data.code == 200) {
            this.allUserData = res.data.data;
          }
        });
    },
    handleSelectionChange(val) {
      this.checkTableData = val;
      this.multipleSelection = val;
    },
    //改变摄像机组状态
    changeStatus(groupId, status) {
      console.log(1111111);
      this.$confirm("确定更改吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        var params = [
          {
            groupId: groupId,
            status: status
          }
        ];
        $http.post("/device/group/batch/alter", params).then(res => {
          if (res.data.code == 200) {
            this.getData();
          }
        });
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
.table-box {
  height: 100%;
}
img {
  vertical-align: middle;
  margin-right: 10px;
}

.el-scrollbar {
  display: block !important;
}

.left {
  width: 20%;
}

.right {
  width: 80%;
}

.add-equipment {
  width: 100%;
}

.add-equipment .equipment-name {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.add-equipment .select-equipment {
  width: 100%;
  margin-bottom: 15px;
}

.add-equipment .select-equipment .select-box1 {
  display: flex;
  align-items: center;
  width: 100%;
}

.add-equipment .select-equipment .select-box2 {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 5px;
}

.add-equipment .select-equipment .select-box2 .left {
  width: 20%;
}

.add-equipment .select-equipment .select-box2 .right {
  width: 80%;
}

.add-equipment .select-equipment .select-box2 .equipment-options {
  width: 100%;
  /* box-shadow: 2px 2px 2px 2px #ccc; */
  border: 1px solid #ccc;
  border-radius: 3px;
}

.add-equipment .select-equipment .select-box2 .equipment-options li {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
}

.add-equipment .select-equipment .select-box2 .equipment-options li:hover {
  background: rgba(232, 234, 239, 1);
}

.add-equipment
  .select-equipment
  .select-box2
  .equipment-options
  li
  span:last-child {
  color: #ff1414;
  cursor: pointer;
  margin-left: 5px;
}

.add-equipment .select-role {
  display: flex;
  align-items: center;
  width: 100%;
}

.dialog-footer {
  width: 100%;
  margin: auto;
  text-align: center;
}
</style>
