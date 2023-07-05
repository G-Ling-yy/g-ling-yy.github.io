<template>
    <div class="inspectionTree">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="路线" name="first" v-if="false">
          <div class="text item content-tree">
            <el-tree
              class="road-tree"
              :data="roadList"
              node-key="id"
              :props="{
                children: 'childList',
                label: 'name',
                isLeaf: 'leaf',
              }"
              :default-expanded-keys="idArr"
              @node-click="handleTreenode"
              :load="(node, resolve) => loadNode(node, resolve, 1)"
              lazy
              :draggable="drag"
              @node-drag-enter="nodeDrop"
            >
              <span
                class="custom-tree-node organize-box"
                slot-scope="{ node, data }"
              >
                <div v-if="data.leaf" class="custom-tree-circle">
                  <div :class="cameraColor[data.onlineStatus]"></div>
                </div>
                <span class="space-l">{{ node.label }}</span>
                <span class="space-r">{{
                  data.total ? data.online + "/" + data.total : ""
                }}</span>
              </span>
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="区域" name="second" v-if="false">
          <div class="text item content-tree">
            <el-tree
              :data="provinceList"
              node-key="id"
              :props="{
                children: 'childList',
                label: 'name',
                isLeaf: 'leaf',
              }"
              :default-expanded-keys="idArr"
              @node-click="handleTreenode"
              :load="(node, resolve) => loadNode(node, resolve, 2)"
              lazy
              :draggable="drag"
              @node-drag-start="nodeDrop"
            >
              <span
                class="custom-tree-node organize-box"
                slot-scope="{ node, data }"
              >
                <div v-if="data.leaf" class="custom-tree-circle">
                  <div :class="cameraColor[data.onlineStatus]"></div>
                </div>
                <span class="space-l">{{ node.label }}</span>
                <span class="space-r">{{
                  data.total ? data.online + "/" + data.total : ""
                }}</span>
              </span>
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单位" name="third">
          <div class="text item content-tree" v-if="false">
            <el-tree
              :data="provinceList"
              node-key="id"
              :props="{
                children: 'childList',
                label: 'name',
                isLeaf: 'leaf',
              }"
              :default-expanded-keys="idArr"
              @node-click="handleTreenode"
              :load="(node, resolve) => loadNode(node, resolve, 3)"
              lazy
              :draggable="drag"
              @node-drag-start="nodeDrop"
            >
              <span
                class="custom-tree-node organize-box"
                slot-scope="{ node, data }"
              >
                <div v-if="data.leaf" class="custom-tree-circle">
                  <div :class="cameraColor[data.onlineStatus]"></div>
                </div>
                <span class="space-l">{{ node.label }}</span>
                <span class="space-r">{{
                  data.total ? data.online + "/" + data.total : ""
                }}</span>
              </span>
            </el-tree>
          </div>
          <!-- 单位组织树 -->
          <div class="text item content-tree">
            <unit-tree @on-click="handleTreenode"></unit-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="摄像机组" name="fourth">
          <div class="text item content-tree">
            <el-tree
              node-key="id"
              :props="{
                label: 'neme',
                children: 'childList',
                isLeaf: 'leaf',
              }"
              @node-click="handleTreenode"
              :load="groupLoadNode"
              lazy
            >
              <span
                class="custom-tree-node organize-box"
                slot-scope="{ node, data }"
              >
                <div v-if="data.leaf" class="custom-tree-circle">
                  <div :class="cameraColor[data.onlineStatus]"></div>
                </div>
                <span class="space-l">{{ node.label }}</span>
                <span>{{
                  data.total ? data.online + "/" + data.total : ""
                }}</span>
              </span>
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import api from "../../api/index.js";
import unitTree from "../sjk/unitTree.vue";
export default {
  components: {
    unitTree,
  },
  props: {
    drag: Boolean,
  },
  data() {
    return {
      idArr: [],
      activeName: "third",
      roadList: [],
      companyList: [],
      provinceList: [],
      deviceGroupList: [],
      /**
       * 查找摄像头路线分类，归类处理，方便扩展
       * 省份-城市-摄像头、省份-单位-摄像头、线路-摄像头
       * province 省份, city 城市, company 单位, road 路线, camera 摄像头
       * code 当前列表显示数据级别
       * name 选择项名称
       * value 选择项标识(id)
       */
      cameraCategoryRouteList: {
        1: [
          //{code:'country',name:'全国',value:'100000'},
          { code: "road", name: "", road: "" },
          { code: "province", name: "", regionCode: "", provinceCode: "" },
          { code: "camera", name: "", value: "" },
        ],
        2: [
          { code: "province", name: "", regionCode: "", provinceCode: "" },
          { code: "road", name: "", road: "" },
          { code: "camera", name: "", value: "" },
        ],
        3: [
          { code: "province", regionCode: "", provinceCode: "" },
          { code: "organization", name: "", organizationId: "" },
          { code: "organization", name: "", organizationId: "" },
          { code: "road", name: "", road: "" },
          { code: "camera", name: "", value: "" },
        ],
      },
      // 查找摄像头所选路径
      cameraCategoryRoute: 2, // 默认是路线
      // 当前路径所显示位置
      currCategoryPathIndex: 0,
      cameraColor: {
        2: "grey",
        1: "normal",
        0: "red",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(["getDeviceStatistics", "getCameraListForStatis"]),
    handleClick() {},
    queryStaticDataList(data, resolve) {
      console.log("参数", data, resolve);
      let _this = this;

      if (!data.dimensionType) {
        return false;
      }
      if (!data.data)
        data.data = {
          ..._this.getPreParamsAr(),
        };
      //{dimensionType:'province'}
      _this.getDeviceStatistics(data).then((res) => {
        console.info("queryStaticDataList", res);

        if (res && res.code === 200) {
          if (resolve) {
            console.log("sgjdgjagajdhjgasdag ");
            res.data[0].dimensionType1112232 = data.dimensionType;
            console.log("sgjdgjagajdhjgasdag ", res.data);
            resolve(res.data);
          } else {
            if (data.dimensionType === "road" && _.isEmpty(data.data)) {
              this[data.dimensionType + "List"] = _.map(res.data, (it, k) => {
                return {
                  name: k,
                  childList: it,
                  dimensionType: data.dimensionType,
                };
              });
              return;
            }
            // alert(44444)
            this[data.dimensionType + "List"] = _.map(res.data, (it) => {
              return {
                ...it,
                childList: [],
                dimensionType: data.dimensionType,
              };
            });
          }
        }
      });
    },
    handleTreenode(item, node, arr) {
      console.log("lone", item, node, arr);
      if (item.cameraNum) {
        this.$emit("on-click", item);
      }
    },
    loadNode(node, resolve, type) {
      if (node.level === 0) {
        let route = this.cameraCategoryRouteList[type];
        this.queryStaticDataList({
          dimensionType: route[node.level].code,
          data: {},
        });
        console.log();
      } else if (node.level === 1 && type === 1) {
        resolve(node.data.childList);
      } else {
        this.loadChildren(node, type, resolve);
      }
    },
    /**
     * 获取摄像机组列表
     */
    getDeviceList(resolve) {
      let deviceList = [];
      this.$api.getDeviceGroupList().then((res) => {
        deviceList = res.data;
        deviceList.map((item) => {
          item.neme = item.groupName;
          item.leaf = false;
        });
        return resolve(deviceList);
        console.log("摄像机组", this.deviceList);
      });
    },
    // 预案摄像机组摄像机列表
    getCamerasGroupDetailList(val, resolve) {
      console.log("节点参数", val);
      let deviceCameraList = [];
      let params = {
        id: val.groupId,
      };
      this.$api.getDeviceCameraList(params).then((res) => {
        if (res.code === 200) {
          deviceCameraList = res.data;
          deviceCameraList.map((item) => {
            //   item.neme = item.khPile + '(' + item.cameraName + ')',
            item.neme = `k${item.kmPile.split(".")[0]}
                                    ${item.kmPile.split(".")[1]}
                                    (${item.cameraName})`;
            //     item.total = res.total
            //   item.online = res.total
            item.leaf = true;
          });
          console.log(122346, deviceCameraList);
          return resolve(deviceCameraList);
        }
      });
    },
    // 摄像机组树节点
    groupLoadNode(node, resolve) {
      console.log("节点", node, resolve);
      if (node.level === 0) {
        this.getDeviceList(resolve);
      }
      if (node.level > 1) return resolve([]);

      setTimeout(() => {
        this.getCamerasGroupDetailList(node.data, resolve);
      }, 500);
    },
    loadChildren(node, type, resolve) {
      let that = this;
      //是否还有下一级，更新当前列表
      //TODO: 刷新当前列表显示数据
      let route = this.cameraCategoryRouteList[type];
      let level = type === 1 ? node.level - 1 : node.level;
      let dimensionType = route[level].code;
      let data = {
        dimensionType: dimensionType,
        data: {
          //classify:that.cameraCateSelect,
          //regionCode: cid,
        },
      };
      //获取路径所选的所有参数
      data.data = that.getPreParamsAr(node, type);
      // data.data = that.getDibvjsd(node, type);
      switch (dimensionType) {
        //country
        default:
        case "province":
          that.queryStaticDataList(data, resolve);
          break;
        case "city":
          //查询城市列表
          data.dimensionType = "city";
          that.queryStaticDataList(data, resolve);
          break;
        case "organization":
          //
          //单位
          data.dimensionType = "organization";
          // modify zhang yufeng by 20191203
          if (level === 1) {
            data.data.organizationType = 20;
          } else {
            data.data.organizationType = 10;
            data.data.organizationId = node.data.id;
          }
          that.queryStaticDataList(data, resolve);
          break;
        case "road":
          //路线
          data.dimensionType = "road";
          //data.data.organizationId = ''+cid;
          that.queryStaticDataList(data, resolve);
          break;
        case "camera":
          //摄像头列表
          //data.dimensionType = 'road';
          that.queryCameraStaticDataList(data, resolve);
          // that.cameraLoading = false;
          break;
      }
    },
    getPreParamsAr(node, type) {
      let route = this.cameraCategoryRouteList[type];
      let level = type === 1 ? node.level - 2 : node.level - 1;
      let value = node.data.id;
      switch (route[level].code) {
        case "province":
          // 优先选择的省份，其次选择用户所属省份，全国不填
          if (value && parseInt(value) !== 100000) {
            route[level].regionCode = parseInt(value) ? parseInt(value) : "";
            route[level].provinceCode = parseInt(value) ? parseInt(value) : "";
          } else if (that.userInfo.regionCode !== 100000) {
            route[level].regionCode = that.userInfo.regionCode;
            route[level].provinceCode = that.userInfo.regionCode;
          }
          break;
        case "city":
          if (value)
            route[level].regionCode = parseInt(value) ? parseInt(value) : "";
          route[level].cityCode = parseInt(value) ? parseInt(value) : "";
          //route[level].regionCode = value;
          break;
        case "organization":
          route[level].organizationId = value;
          break;
        case "road":
          route[level].road = value;
          break;
      }
      route[level].name = node.label;
      this.cameraCategoryRouteList[type][level] = route[level];
      let params = {};
      if (route[level + 1].code === "road") {
        params.orderRate = true;
      }
      _.each(this.cameraCategoryRouteList[type], (route) => {
        _.each(route, (it, key) => {
          if (key !== "code" && key !== "name") {
            params[key] = it;
          }
        });
      });
      return params;
    },
    getDibvjsd(node, type) {
      let route = this.cameraCategoryRouteList[type];
      let level = type === 1 ? node.level - 2 : node.level - 1;
      let value = node.data.id;
      switch (route[level].code) {
        case "province":
          // 优先选择的省份，其次选择用户所属省份，全国不填
          if (value && parseInt(value) !== 100000) {
            route[level].regionCode = parseInt(value) ? parseInt(value) : "";
            route[level].provinceCode = parseInt(value) ? parseInt(value) : "";
          } else if (that.userInfo.regionCode !== 100000) {
            route[level].regionCode = that.userInfo.regionCode;
            route[level].provinceCode = that.userInfo.regionCode;
          }
          break;
        case "city":
          if (value)
            route[level].regionCode = parseInt(value) ? parseInt(value) : "";
          route[level].cityCode = parseInt(value) ? parseInt(value) : "";
          //route[level].regionCode = value;
          break;
        case "organization":
          route[level].organizationId = value;
          break;
        case "road":
          route[level].road = value;
          break;
      }
      route[level].name = node.label;
      this.cameraCategoryRouteList[type][level] = route[level];
      let params = {};
      if (route[level + 1].code === "road") {
        params.orderRate = true;
      }
      _.each(this.cameraCategoryRouteList[type], (route) => {
        _.each(route, (it, key) => {
          if (key !== "code" && key !== "name") {
            params[key] = it;
          }
        });
      });
      return params;
    },
    /**
     * 查询摄像机详细信息列表
     * @returns {boolean}
     */
    queryCameraStaticDataList(data, resolve) {
      //getCameraListForStatis
      let _this = this,
        args = {
          params: {
            currPage: 1,
            pageSize: 2000, // 暂未使用分页功能
          },
          data: {},
        };

      //获取路径所选的所有参数
      args.data = data.data;

      //查询数据
      _this.getCameraListForStatis(args).then((res) => {
        let data = _.map(res.data, (it) => {
          return {
            ...it,
            id: it.cameraId,
            name: it.khPile + "(" + it.poiName + ")",
            leaf: true,
            childList: [],
          };
        });
        resolve(data);
      });
    },
    nodeDrop(node, i, event) {
      console.log("拖拽", node, i, event);
      this.$emit("after-drop", node.data);
    },
    allowDrop(draggingNode, dropNode, type) {
      // return type !== 'inner' && type !== 'prev' && type !== 'next';
      return true;
    },
  },
};
</script>
<style lang="less" scope>
.inspectionTree {
  .custom-tree-circle {
    height: 20px;
    line-height: 20px;
    div {
      width: 10px;
      height: 10px;
      border: 1px solid transparent;
      border-radius: 5px;
      margin-top: 5px;
      // &.red {
      //   border: 1px solid #ff3607;
      // }
      // &.grey {
      //   border: 1px solid #8b8f91;
      // }
      // &.normal {
      //   border: 1px solid #1ae57a;
      // }
    }
  }
  .custom-tree-node .space-l {
    width: 90%;
    color: #fff;
  }
  .custom-tree-node .space-r {
    color: #fff;
  }
  .el-tree{
      color: #fff;
  }
}

.el-tree-node:focus > .el-tree-node__content {
  background-color: rgba(45, 159, 255, 0.24);
}
.el-tree-node:hover > .el-tree-node__content {
  background-color: rgba(45, 159, 255, 0.24);
}
</style>