<template>
  <div class="image-tree-container">
    <div
      class="text item"
      :class="{ 'third-tree': third, 'content-tree': !third }"
      v-if="unitListLoading"
    >
      <el-tree
        ref="tree"
        :data="unitList"
        :props="{
          children: 'childList',
          label: 'organizationName',
          isLeaf: 'leaf',
        }"
        node-key="organizationId"
        :default-expanded-keys="idArr"
        @node-click="handleTreenode"
        @node-expand="handleTreenode"
        @node-drag-start="nodeDrop"
      >
        <span class="custom-tree-node organize-box" slot-scope="{ node, data }">
          <!-- <div  class="custom-tree-circle">
                                <div :class="cameraColor[data.onlineStatus]"></div>
                            </div> -->
          <div
            class="loading"
            v-show="data.isControl && data.isCamera && data.loading"
          >
            <loading message=""></loading>
          </div>
          <div>
            <el-tooltip
              class="tooltip"
              effect="dark"
              :content="node.label"
              placement="top-start"
            >
              <span v-show="!data.cameraNum" class="space-title">{{
                node.label
              }}</span>
            </el-tooltip>
            <span v-show="!data.cameraNum" class="space-total">{{
              data.total
            }}</span>
            <!-- 摄像机数据 -->
            <!-- <span 
                            v-show="data.cameraNum"
                            class="space-index">{{data.idx + 1}}
                            </span> -->
            <!-- <div class="loading" v-show="data.isControl && data.isCamera && data.loading">
                                <loading message="数据加载中..." ></loading>
                            </div> -->
            <div v-show="data.cameraNum">
              <div class="custom-tree-circle">
                <div :class="cameraColor[data.onlineStatus]"></div>
              </div>
              <!-- <el-tooltip class="tooltip" effect="dark" placement="top-start">
                                <div slot="content">
                                    <span >{{ node.label }} {{data.poiName}}</span>
                                    <i v-show="data.derection ===  '0' || data.derection ===  '2'" class="el-icon-top"></i>
                                    <i v-show="data.derection ===  '1' || data.derection ===  '2'"  class="el-icon-bottom"></i>
                                </div> -->
              <span class="space-blue"
                >{{ node.label }} {{ data.poiName }}
              </span>
              <!-- </el-tooltip> -->
              <!-- 0上行  1下行 2上下行 -->
              <i
                v-show="data.derection === '0' || data.derection === '2'"
                class="el-icon-top"
              ></i>
              <i
                v-show="data.derection === '1' || data.derection === '2'"
                class="el-icon-bottom"
              ></i>
            </div>

            <!-- <span 
                                v-show="data.cameraNum"  
                                :class="data.onlineStatus ? ['space-red','space-r','space-grey'][data.onlineStatus*1] : 'space-r'" 
                                >
                                {{data.onlineStatus | filtersOnlineStatus}}
                            </span> -->
          </div>
        </span>
      </el-tree>
    </div>
    <!-- 数据加载 -->
    <div v-else>
      <loading message="数据加载中..."></loading>
    </div>
  </div>
</template>
<script>
import loading from "../../components/common/Loading";
import api from "../../api/index.js";
import { Collapse } from "element-ui";
export default {
  components: {
    loading,
  },
  props: {
    third: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      unitList: "",
      unitListLoading: false, //加载数据
      cameraColor: {
        // 摄像机在线状态
        2: "grey",
        1: "normal",
        0: "red",
      },
      idArr: [], // 默认展开
      flag: false,
      treeData: [],
    };
  },
  created() {
    this.getCameraCount();
  },
  // filters: {
  //     filtersOnlineStatus (value) {
  //         let _result = ''
  //         switch (value) {
  //             case '0':
  //                 _result = '离线'
  //                 break;
  //             case '1':
  //                 _result = '在线'
  //                 break;
  //             case '2':
  //                 _result = '故障'
  //                 break;
  //         }
  //         return _result
  //     }
  // },
  methods: {
    // 获取单位组织
    getCameraCount() {
      this.unitListLoading = false;
      let data = {
        hasCamera: true,
      };
      this.$api.getCameraCount(data).then((res) => {
        // console.log(res,"23222222")
        if (res.code == 200) {
          this.idArr.push(res.data, res.data[0].organizationId);
          //  console.log("组织树131",res.data,res.data[0].organizationId)
          // this.treeData=res.data[0].childList[0].childList.map(v => ({...v, childList: v.childList?.map?.(o =>  ({...o, childList: []})) || []}))
          // console.log(this.treeData,"treeDatatreeData")
          this.unitList = this.addchildList(res.data);
          this.unitListLoading = true;
          // console.log('组织234',this.addchildList(res.data))
        }
      });
    },
    // 给树节点最后一项加箭头
    addchildList(arr) {
      console.log(arr, "arr");
      // arr.map(item=>{
      //     if(item.childList === undefined){
      //         // item.childList = []
      //         if (item.isControl) {
      //             this.$set(item, 'childList',[{}])
      //             this.$set(item, 'isCamera',true)
      //         }
      //     }else {
      //         if (item.isControl) {
      //             this.$set(item, 'isCamera',true)
      //             this.$set(item, 'defaultCamera',true) //childList中有值
      //             this.$set(item, 'childListData',item.childList)
      //         }
      //         this.addchildList(item.childList)
      //     }
      // })
      return arr;
    },
    nodeDrop() {},
    // 树节点触摸事件
    handleTreenode(item, node, arr) {
      console.log("node", item, node, node.parent.data.organizationId);
      //   let data = {
      //     organizationId: item.organizationId,
      //     // provinceCode: item.provinceCode,
      //     regionCode: item.regionCode,
      //     // road: item.road,
      //     }
      // this.unitList[0].organizationName = 'asdhsuakhdadgu'
      // console.log('lone',item,node,arr,item.cameraNum,item.childList )
      if (item.isCamera) {
        this.$set(item, "loading", true);
        this.$set(item, "childList", [{}, {}, {}, {}]);
        // this.$emit('on-click', item);
        let data = {
          data: {
            organizationId: item.organizationId,
            // provinceCode: item.provinceCode,
            regionCode: item.regionCode,
            // road: item.road,
          },
        };
        console.log("摄像机12", data);
        this.$api.getCameraListForStatis(data).then((res) => {
          if (res.code == 200) {
            console.log("摄像机", res.data, item.childList[0]);
            let childArr = [];
            if (!item.isCamera) {
              childArr = item.childList;
            }
            if (item.defaultCamera) {
              _.each(item.childListData, (n, i) => {
                childArr.push(n);
              });
            }
            console.log("childArr值", childArr);
            _.each(res.data, (k, i) => {
              (k.organizationName = k.khPile), (k.idx = i);
              childArr.push(k);
            });
            this.$set(item, "childList", childArr);
            this.$set(item, "loading", false);
            //    node.expanded = true
          }
        });
      } else {
        if (item.cameraNum !== undefined) {
          // this.$emit('on-click', item, item.idx, node.parent.data.organizationId);
        }
        // this.$emit('on-click', item, item.idx, node.parent.data.organizationId);
      }
      this.$emit("on-click", item, item.idx, item.organizationId);
      console.log("ccooood", item);
    },
  },
};
</script>
<style lang="less" scoped>
.image-tree-container {
  margin-top: 10px;
  margin-bottom: 20px;
  .content-tree .custom-tree-node {
    width: 65%;
    .space-title {
      display: inline-block;
      width: 180px;
      color: #fff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .space-total {
      color: #fff;
      position: absolute;
      right: 4px;
    }
    .space-index {
      display: inline-block;
      width: 20px;
      margin-right: 36px;
    }
    .space-r {
      color: #2bbdc8;
      position: absolute;
      right: 26px;
    }
    .space-red {
      position: absolute;
      right: 26px;
      color: #ff3607;
    }
    .space-grey {
      position: absolute;
      right: 26px;
      color: #8b8f91;
    }
  }
  .custom-tree-node .space-blue {
    // color: #2bbdc8;
  }
  /deep/.el-tree-node__content {
    position: relative;
  }

  .content-tree /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba(45, 159, 255, 0.24);
  }
  .content-tree /deep/ .el-tree-node:hover > .el-tree-node__content {
    background-color: rgba(45, 159, 255, 0.24);
  }

  .content-tree /deep/ .el-tree {
    background-color: #0f1a47 !important;
  }
  /deep/ .map-box .box-wrap .box-wrap-body {
    overflow-y: auto !important;
    // overflow-x: auto !important;
  }

  // // style为true生效
  .third-tree .custom-tree-node {
    width: 65%;
    .space-title {
      display: inline-block;
      width: 180px;
      // color: #fff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .space-total {
      //  color: #fff;
      position: absolute;
      right: 4px;
    }
    .space-index {
      display: inline-block;
      width: 20px;
      margin-right: 36px;
    }
    .space-r {
      color: #2bbdc8;
      position: absolute;
      right: 26px;
    }
    .space-red {
      position: absolute;
      right: 26px;
      color: #ff3607;
    }
    .space-grey {
      position: absolute;
      right: 26px;
      color: #8b8f91;
    }
  }
  /deep/ .map-box .box-wrap .box-wrap-body {
    overflow-y: auto !important;
  }

  .loading {
    // margin-top: 60px;
    position: absolute;
    top: 40px;
    left: 50%;
    margin-right: -50%;
    // left: 0;
  }
}
</style>