<template>
  <el-dialog
    title="关联摄像机组"
    :visible="visible"
    width="60%"
    @close="groupDialogClose"
    custom-class="camera-report-dialog gd-custom-dialog"
    v-dialogDrag="{ fullScreen: false }"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <!-- <div>
      <p>角色名称：超级管理员</p>
      <el-transfer 
        v-model="value" 
        filterable
        filter-placeholder ="请输入摄像机组名称"
        :titles="['可选摄像机组', '已选摄像机组']"
        :button-texts="['到左边', '到右边']"
        :left-footer="sdad"
        :data="data">
      </el-transfer>
    </div> -->
    <div class="groupMain">
      <el-row>
        <el-col :span="12">
          <el-card class="box-card" style="margin-right: 20px">
            <div slot="header" class="clearfix">
              <span class="title">可选摄像机组（5）</span>
              <div style="float: right">
                <el-input
                  v-model="groupName"
                  placeholder="请输入关键字"
                  style="width: 180px"
                >
                </el-input>
                <i class="el-icon-search" @click="getDeviceList"></i>
              </div>
            </div>
            <div>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="(camera, i) in deviceGroupList"
                  :label="camera.groupName"
                  :key="i"
                  >{{ camera.groupName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">已选摄像机组</span>
                <el-input
                  v-model="groupName"
                  placeholder="请输入关键字"
                  style="width: 180px; float: right"
                >
                </el-input>
              </div>
              <div>
                <el-table
                  class="custom-cloud-table"
                  height="100%"
                  ref="multipleTable"
                  :data="selectedGroupsList"
                  tooltip-effect="dark"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="groupName"
                    label="摄像机组名称"
                  ></el-table-column>
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" content="删除" placement="top">
                        <el-button
                          class="table-control-btn"
                          type="danger"
                          icon="el-icon-close"
                          size="mini"
                          @click="handleDelete(scope.row)"
                        ></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="groupDialogClose()">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {  mapActions } from "vuex";
export default {
  name: "groupDialogVisible",
  components: {},
  data() {
    // const generateData = (_) => {
    //   const data = [];
    //   for (let i = 1; i <= 15; i++) {
    //     data.push({
    //       key: i,
    //       label: `摄像机 ${i}`,
    //       disabled: i % 4 === 0,
    //     });
    //   }
    //   return data;
    // };
    return {
      groupDialogVisible: false,
      groupName: "",
      // data: generateData(),
      // value: [1, 4],
      checkAll: false,
      deviceGroupList: [], //数据源
      checkedCities: [], //绑定默认选中
      isIndeterminate: false, //设置 indeterminate 状态，只负责样式控制
      selectedGroupsList: [], //已选摄像机组
      selectData:[]
    };
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    cameraInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    event: Object,
    roleCode: String,
  },
  computed: {},
  mounted() {
    this.getDeviceList();
    this.selectedGroups();
  },
  watch: {
    cameraId: {
      handler(newName, oldName) {},
      immediate: true,
    },
  },
  methods: {
    ...mapActions([
      "deleteUnbindGroups",
    ]),
    //   关闭弹窗
    groupDialogClose() {
      this.$emit("update:visible", false);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 全选
    handleCheckAllChange(val) {
      console.log(val); //val的值是一个布尔值，点中全选为false，取消全选为true
      this.deviceGroupList.forEach((item) => {
        //当全选被选中的时候，循环遍历源数据，把数据的每一项加入到默认选中的数组去
        this.checkedCities.push(item.groupName);
      });
      this.checkedCities = val ? this.checkedCities : []; //三元表达式，如果val的值为true，那么就把当前默认选中的值赋值给自身，这样页面页面上所有的元素就都选中了。如果为false，就是取消全选
      this.isIndeterminate = false; //官网说这是个样式控制，是来控制，什么时候半选的，要不要都无所谓，看你需求
    },
    // checkbox选中
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length; //选中值的长度
      this.checkAll = checkedCount === this.deviceGroupList.length; //如果选中值的长度和源数据的长度一样，返回true，就表示你已经选中了全部checkbox，那么就把true赋值给this.checkAll
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.deviceGroupList.length; //同全选按钮事件里面的那个样式控制
    },
    //获取摄像机组列表
    getDeviceList() {
      let params = { groupName: this.groupName };
      this.$api.getDeviceGroupList(params).then((res) => {
        this.deviceGroupList = res.data;
      });
    },
    //已选择摄像机
    selectedGroups(roleCode) {
      let params = { roleCode: this.roleCode };
      this.$api.selectedGroups(params).then((res) => {
        if (res.code === 200) {
          this.selectedGroupsList = res.data;
        }
      });
    },
        // 是否删除
    handleDelete(row) {
      console.log(row,"row")
      this.$confirm(
        "确定移除该所关联的组？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).then(() => {
        
        let params = {
          groupIds:[row.groupId],
          userId:this.roleCode,
        };
      console.log(params,"params")
        this.deleteUnbindGroups(params).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scope>
.groupMain {
  .box-card {
    .title {
      font-size: 14px;
      color: #ccc;
      line-height: 28px;
    }
    .el-checkbox {
      display: block;
    }
  }
}
</style>
