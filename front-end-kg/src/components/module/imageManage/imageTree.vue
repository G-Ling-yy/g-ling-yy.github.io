<template>
  <div class="imgTreeStyle">
    <div class="image-tree-con">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单位" name="third">
          <div class="third-tree">
                  <unit-tree :third="true" @on-click="handleTreenode"></unit-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import unitTree from "../../../views/sjk/unitTree.vue";
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
        4: "grey",
        1: "normal",
        3: "red",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {},
  methods: {
    ...mapActions(["getDeviceStatistics", "getCameraListForStatis"]),
    handleClick() {},
    queryStaticDataList(data, resolve) {
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
        //console.info('queryStaticDataList', res);

        if (res && res.code === 200) {
          if (resolve) {
            resolve(res.data);
          } else {
            if (data.dimensionType === "road" && _.isEmpty(data.data)) {
              this[data.dimensionType + "List"] = _.map(res.data, (it, k) => {
                return {
                  name: k,
                  childList: it,
                };
              });
              return;
            }
            this[data.dimensionType + "List"] = _.map(res.data, (it) => {
              return {
                ...it,
                childList: [],
              };
            });
          }
        }
      });
    },
    handleTreenode(item) {
      if (item.organizationId) {
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
      } else if (node.level === 1 && type === 1) {
        resolve(node.data.childList);
      } else {
        this.loadChildren(node, type, resolve);
      }
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
      this.$emit("after-drop", node.data);
    },
    allowDrop(draggingNode, dropNode, type) {
      // return type !== 'inner' && type !== 'prev' && type !== 'next';
      return true;
    },
  },
};
</script>
<style lang="less" scoped>
.imgTreeStyle {
  .image-tree-con {
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
      color: #000;
    }
  }
}
</style>