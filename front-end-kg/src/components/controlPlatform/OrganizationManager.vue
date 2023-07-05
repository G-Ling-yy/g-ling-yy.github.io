<template>
  <div class="content-wrapper organizationManager">
    <!--<p class="title"><i></i><span>基础数据>组织机构管理</span></p>-->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/dashboard' }"><i class="iconfont icondashboard" ></i></el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>上云网关管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="organization-content">
      <div class="content-left">
        <p class="content-title">树结构</p>
        <div class="content-tree">
          <p>交通运输部</p>
          <el-tree
            :data="orgList"
            :props="defaultProps"
            @node-click="handleAllClick"
          ></el-tree>
        </div>
      </div>
      <div class="content-right">
        <div>
          <div class="content-title">
            <p>一级单位</p>
            <p>
              <i
                class="icon-update"
                @click="updateData('first')"
              ></i>
              <i
                class="icon-delete"
                @click="delOrgClick('first')"
              ></i>
              <i
                class="icon-add"
                @click="addUnitClick('first')"
              ></i>
            </p>
          </div>
          <div class="content-tree">
            <el-tree
              :data="parent"
              :props="defaultProps"
              @node-click="handleFirstClick"
            ></el-tree>
          </div>
        </div>
        <div>
          <div class="content-title">
            <p>二级单位</p>
            <p>
              <i
                class="icon-update"
                @click="updateData('second')"
              ></i>
              <i
                class="icon-delete"
                @click="delOrgClick('second')"
              ></i>
              <i
                class="icon-add"
                @click="addUnitClick('second')"
              ></i>
            </p>
          </div>
          <div class="content-tree">
            <el-tree
              :data="children"
              :props="defaultProps"
              @node-click="handleSecondClick"
            ></el-tree>
          </div>
        </div>
        <div>
          <div class="content-title">
            <p>三级单位</p>
            <p>
              <i
                class="icon-update"
                @click="updateData('third')"
              ></i>
              <i
                class="icon-delete"
                @click="delOrgClick('third')"
              ></i>
              <i
                class="icon-add"
                @click="addUnitClick('third')"
              ></i>
            </p>
          </div>
          <div class="content-tree">
            <el-tree
              :data="son"
              :props="defaultProps"
              @node-click="handleThirdClick"
            ></el-tree>
          </div>
        </div>
      </div>
    </div>
    <OrganizationPopup ref="OrganizationPopup"></OrganizationPopup>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import OrganizationPopup from "./OrganizationPopup";
export default {
  name: "OrganizationManager",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "organizationName"
      },
      orgList: [],
      parent: [],
      children: [],
      son: [],
      firstDataObj: null,//一级单位数据
      secondDataObj: null,//二级单位数据
      thirdDataObj: null,//三级单位数据
    };
  },
  computed: {
    ...mapState(["organization", "organizationList"]),

  },
  components: {
    OrganizationPopup
  },
  props: ["showMask"],

  mounted() {
    let _this = this;
    _this.getOrganization();
  },
  methods: {
    ...mapActions(["setOrganizationList", "getOrganizationList", "addOrganization"]),
    handleAllClick(data, node) {
      let _this = this;
      if (node.level == 2) {
        _this.firstDataObj = data;
      } else if (node.level == 3) {
        _this.secondDataObj = data;
      } else if (node.level == 4) {
        _this.thirdDataObj = data;
      }
      _this.initTreeData(data, node);
    },//树结构展开点击事件
    handleFirstClick(data, node) {
      let _this = this;
      if (node.level == 1) {
        _this.firstDataObj = data;
      } else if (node.level == 2) {
        _this.secondDataObj = data;
      } else if (node.level == 3) {
        _this.thirdDataObj = data;
      }
      _this.initTreeData(data, node);
    },//树结构展开点击事件-一级单位
    handleSecondClick(data, node) {
      let _this = this;
      if (node.level == 1) {
        _this.secondDataObj = data;
      } else if (node.level == 2) {
        _this.thirdDataObj = data;
      }
      _this.initTreeData(data, node);
    },//树结构展开点击事件-二级单位
    handleThirdClick(data, node) {
      let _this = this;
      if (node.level == 1) {
        _this.thirdDataObj = data;
      }
      _this.initTreeData(data, node);
    },//树结构展开点击事件-三级单位
    initTreeData(data, node) {
      let _this = this;
      console.log(node)
      _this.organizationId = data.organizationId;
      if (_this.organizationId >= 9001 && _this.organizationId < 9901001) {
        _this.parent = [];
        _this.children = [];
        _this.son = [];
        if (data.children.length > 0) {
          _this.parent = data.children;
        }
      }

      if (_this.organizationId >= 9901001 && _this.organizationId < 9901001003) {
        _this.son = [];
        if (data.children.length > 0) {
          _this.children = data.children;
        }
      }
      if (_this.organizationId >= 9901001003) {
        if (data.children.length > 0) {
          _this.son = data.children;
        }
      }
    },
    getOrganization() {
      let _this = this;
      _this.parent = [];
      _this.children = [];
      _this.son = [];
      _this.getOrganizationList({}).then(function (res) {
        _this.orgList = res.data.filter(
          function (curValue) {
            return curValue.parentOrganizationId == 0;
          }
        );
        _this.orgList.forEach(function (curValue) {
          curValue["children"] = res.data.filter(function (tempValue) {
            return tempValue.parentOrganizationId == curValue.organizationId;
          });
        });
        _this.parent = res.data.filter(
          function (curValue) {
            return (
              curValue.parentOrganizationId >= 9901 &&
              curValue.parentOrganizationId < 9901001
            );
          }
        );
        _this.parent.forEach(function (curValue) {
          curValue["children"] = res.data.filter(function (tempValue) {
            return tempValue.parentOrganizationId == curValue.organizationId;
          });
        });
        _this.children = res.data.filter(
          function (curValue) {
            return (
              curValue.parentOrganizationId >= 9901001 &&
              curValue.parentOrganizationId < 9901001003
            );
          }
        );
        _this.children.forEach(function (curValue) {
          curValue[
            "children"
          ] = res.data.filter(function (
            tempValue
          ) {
            return tempValue.parentOrganizationId == curValue.organizationId;
          });
        });
        _this.son = res.data.filter(
          function (curValue) {
            return curValue.parentOrganizationId >= 9901001003;
          }
        );
        _this.son.forEach(function (curValue) {
          curValue[
            "children"
          ] = res.data.filter(function (
            tempValue
          ) {
            return tempValue.parentOrganizationId == curValue.organizationId;
          });
        });
      });
    },
    addUnitClick(type) {
      let _this = this;
      _this.$refs.OrganizationPopup.initOrganizationPopup(type);
    }, //单位点击
    updateData(type) {
      let _this = this;
      if (type == 'first') {
        if (_this.firstDataObj == null || _this.firstDataObj == undefined) {
          _this.$message({
            message: '请选择一级单位',
            type: 'warning'
          });
          return;
        }
        _this.$refs.OrganizationPopup.initEditData(_this.firstDataObj, type);
      } else if (type == 'second') {
        if (_this.firstDataObj == null || _this.firstDataObj == undefined) {
          _this.$message({
            message: '请选择二级单位',
            type: 'warning'
          });
          return;
        }
        _this.$refs.OrganizationPopup.initEditData(_this.secondDataObj, type);

      } else if (type == 'third') {
        if (_this.firstDataObj == null || _this.firstDataObj == undefined) {
          _this.$message({
            message: '请选择三级单位',
            type: 'warning'
          });
          return;
        }
        _this.$refs.OrganizationPopup.initEditData(_this.thirdDataObj, type);

      }

    },//更新编辑数据
    delOrgClick(type) {
      let _this = this;
      if (type == 'first') {
        if (_this.firstDataObj == null || _this.firstDataObj == undefined) {
          _this.$message({
            message: '请选择一级单位',
            type: 'warning'
          });
          return;
        }
        _this.$refs.OrganizationPopup.initDelData(_this.firstDataObj, type);
      } else if (type == 'second') {
        if (_this.firstDataObj == null || _this.firstDataObj == undefined) {
          _this.$message({
            message: '请选择二级单位',
            type: 'warning'
          });
          return;
        }
        _this.$refs.OrganizationPopup.initDelData(_this.secondDataObj, type);

      } else if (type == 'third') {
        if (_this.firstDataObj == null || _this.firstDataObj == undefined) {
          _this.$message({
            message: '请选择三级单位',
            type: 'warning'
          });
          return;
        }
        _this.$refs.OrganizationPopup.initDelData(_this.thirdDataObj, type);
      }
    },//删除组织点击事件
  }
};
</script>

<style scoped lang="less">
.organizationManager {
  width: 100%;
  height: 100%;
}

.organizationManager .title {
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 14px;
  margin: 0;
  height: 14px;
}
.organizationManager .title i {
  width: 15px;
  height: 19px;
  float: left;
  background: url(../../assets/images/organization/position.png) no-repeat;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: -2px;
}
.organization-content {
  width: 100%;
  height: calc(100% - 32px);
  margin-top: 18px;
}
.content-left {
  width: 20%;
  float: left;
  height: 100%;
  background: #fff;
}
.content-tree {
  padding: 14px 40px;
  box-sizing: border-box;
  height: calc(100% - 68px);
  overflow: auto;
}
.content-tree p {
  height: 16px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(53, 62, 63, 1);
}
.content-title {
  height: 68px;
  line-height: 68px;
  padding-left: 40px;
  font-size: 20px;
  color: #353e3f;
  font-family: Source Han Sans CN;
  font-weight: 400;
  width: 100%;
  margin: 0;
  border-bottom: 1px dashed #2a2f37;
}
.content-title p {
  margin: 0;
  float: left;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-title p i {
  width: 24px;
  height: 24px;
  float: left;
  margin-left: 18px;
  cursor: pointer;
}
.icon-update {
  background: url(../../assets/images/organization/update.png) no-repeat;
}
.icon-delete {
  background: url(../../assets/images/organization/delete.png) no-repeat;
}
.icon-add {
  background: url(../../assets/images/organization/add.png) no-repeat;
}
.content-right {
  width: calc(100% - 21%);
  float: left;
  margin-left: 10px;
  height: 100%;
  background: #fff;
}
.content-right > div {
  width: calc(100% / 3);
  height: 100%;
  float: left;
}
.content-right > div:last-child {
  border-right: none !important;
}
.content-right > div .content-tree {
  width: calc(100% - 1px);
  border-right: 1px solid #b0b2b5;
}
</style>
