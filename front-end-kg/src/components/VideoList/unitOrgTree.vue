<template>
  <div class="image-tree-con" ref="treeWrap">
    <div
      class="text item"
      :class="{
        'third-tree': third,
        'content-tree': !third
      }"
      v-if="unitList.length > 0 && !unitListLoading"
    >
      <!-- 组织树渲染 -->
      <el-tree
        ref="tree"
        :data="unitList"
        :props="{
          children: 'children',
          label: 'organizationName',
          isLeaf: 'leaf'
        }"
        node-key="id"
        accordion
        :default-expanded-keys="['9901']"
        @node-click="isTreeNode"
        @node-expand="expandTreenode"
      >
        <span
          class="custom-tree-node organize-box"
          slot-scope="{ node, data }"
        >
          <!-- 加载摄像机数据loading -->
          <div class="loading" v-show="data.loading">
            <loading message=""></loading>
          </div>
          <!-- 树节点lable值渲染 -->
          <div class="custom-style-s">
            <el-tooltip
              class="tooltip"
              effect="dark"
              :content="node.label"
              placement="right-start"
            >
              <span
                v-show="!data.cameraNum"
                class="space-title"
                >{{ node.label }}</span
              >
            </el-tooltip>
            <!-- label第一层级带() -->
            <div v-if="data.total" class="space-total">
              (
              <span class="space-total-bright">{{
                data.online
              }}</span
              >/{{ data.total }} )
            </div>
          </div>

          <!-- 摄像机数据 -->

          <div
            v-show="data.cameraNum"
            class="custom-tree-cameraNum"
          >
            <div class="custom-tree-circle">
              <div
                :class="cameraColor[data.onlineStatus]"
                v-if="
                  data.onlineStatus === '0' ||
                    data.onlineStatus === '1'
                "
              >
                HD
                <!-- <p style="padding-left: 75px">
                    {{ data.cameraName }}
                  </p> -->
              </div>
            </div>
            <el-tooltip
              class="tooltip"
              effect="dark"
              placement="right-start"
            >
              <div slot="content">
                <span>{{ node.label }}</span>
                <i
                  v-show="
                    data.derection === '0' ||
                      data.derection === '2'
                  "
                  class="el-icon-top color-E4FFFF"
                ></i>
                <i
                  v-show="
                    data.derection === '1' ||
                      data.derection === '2'
                  "
                  class="el-icon-bottom color-E4FFFF"
                ></i>
              </div>

              <div class="custom-tree-main">
                <span class="space-blue"
                  >{{ data.cameraName }}
                </span>

                <!-- 0上行  1下行 2上下行 -->
                <i
                  v-show="
                    data.derection === '0' ||
                      data.derection === '2'
                  "
                  class="el-icon-top color-E4FFFF"
                ></i>
                <i
                  v-show="
                    data.derection === '1' ||
                      data.derection === '2'
                  "
                  class="el-icon-bottom color-E4FFFF"
                ></i>
              </div>
            </el-tooltip>
          </div>
        </span>
      </el-tree>
    </div>

    <!-- 数据加载... -->
    <div v-else>
      <!-- v-show="!(unitList.length > 0 && !unitListLoading)" -->
      <loading
        message=""
        class="traffic-map-empty"
      ></loading>
    </div>
  </div>
</template>
<script>
import loading from './Loading.vue'
export default {
  name: 'SaasUnitorgtree',
  components: {
    loading
  },
  props: {
    third: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      unitList: [], // 组织树数据
      unitListLoading: false, //加载数据
      cameraColor: {
        // 摄像机在线状态
        2: 'grey',
        1: 'normal',
        0: 'red'
      },
      flag: false,
      treeList: '',
      areaCode: null,
      loading: false,
      lastExpandNode: null, //最后一次展开节点
      rootNode: null //根节点
    }
  },
  created() {
    process.env.NODE_ENV === 'development' &&
      (window.unitOrgTree = this)
    //监听返回首页按钮所有数据

    //监听获取所选区域编码并执行筛选组织树
    this.$root.$on('clickAreaMap', adcode => {
      this.areaCode = adcode
      console.log(adcode, this.areaCode, 'featurefeature')
      // this.getNode(this.areaCode).expand()
      if (this.$refs.tree) {
        const currentExpandNode = this.$refs.tree.getNode(
          this.areaCode
        )
        if (currentExpandNode !== this.lastExpandNode) {
          !this.rootNode.expanded && this.rootNode.expand()
          currentExpandNode.expand()
          this.lastExpandNode?.collapse()
          this.lastExpandNode = currentExpandNode
        }
      }

      // console.log(this.areaCode,"123")
      // this.getCountUserOrganization();
    })
  },
  mounted() {
    this.getCountUserOrganization()
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
    getCountUserOrganization() {
      this.unitListLoading = true
      let data = {
        // hasCamera: trues
        // regionCode: this.areaCode,
      }
      this.$api.getCountUserOrganization(data).then(res => {
        if (res.code == 200) {
          this.unitListLoading = false
          this.watchTreeDom()
          this.unitList = this.addchildren(res.data)
          console.log('组织234', this.unitList)
        }
      })
    },

    // 监听树渲染
    watchTreeDom() {
      const _this = this
      const config = {
        childList: true
      }

      const callback = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            // console.log(
            //   "11111111111111111111111111111111111111111111111",
            //   _this.$refs.tree.getNode("320000")
            // );
            // console.log(
            //   "_this.$refs.tree",
            //   _this.$refs.tree.$el.querySelector(".el-tree-node__content")
            // );
            if (_this.$refs.tree) {
              //如果DOM渲染完成
              getNode()
            } else {
              setTimeout(() => {
                getNode()
              }, 1000)
            }
            observer.disconnect()
          }
        }
      }
      const observer = new MutationObserver(callback)
      observer.observe(this.$refs.treeWrap, config)

      function getNode() {
        if (!_this.rootNode) {
          //给根节点赋值
          _this.rootNode = _this.$refs.tree.getNode('9901')
        }
        if (!_this.lastExpandNode) {
          //给最后一个展开节点赋初始值
          _this.lastExpandNode = _this.$refs.tree.getNode(
            '320000'
          )
          _this.lastExpandNode?.expand()
        }
        _this.$root.$on('homeLeftTreeData', () => {
          _this.lastExpandNode?.collapse()
          _this.lastExpandNode = null
          // 遍历全部数据
        })
      }
    },
    //获取所有组织树信息
    getAllCountUserOrganization() {
      this.unitListLoading = true
      this.$api.getCountUserOrganization().then(res => {
        if (res.code == 200) {
          this.unitListLoading = false
          this.unitList = this.addchildren(res.data)
        }
      })
    },
    // extendUnitData(d) {
    //   this.unitList = this.extendchildren(this.unitList, d);
    // },
    // // 给树节点最后一项加箭头
    // extendchildren(tar, source) {
    //   console.log(tar, source);
    //   if (tar != undefined && source != undefined) {
    //     for (var i = 0; i < tar.length; i++) {
    //       var titem = tar[i];
    //       var sitem = source[i];
    //       if (titem && sitem) {
    //         this.$set(titem, "inerror", sitem.inerror);
    //         // this.$set(titem, 'offline', sitem.offline);
    //         // this.$set(titem, 'rate', sitem.rate);
    //         this.$set(titem, "total", sitem.total);
    //         this.$set(titem, "online", sitem.online);
    //         console.log(titem.children, sitem.children, i);
    //         if (titem.children != undefined) {
    //           this.extendchildren(titem.children, sitem.children);
    //         }
    //       }
    //     }
    //   }
    //   return tar;
    // },
    // 给树节点最后一项加箭头
    addchildren(arr) {
      arr.map(item => {
        //设置key值
        // if (item.children && item.children.length > 0) {
        //   item.children = item.children.map((item, index) => {
        //     item.organizationId = `${item.organizationId}-${index}`;
        //     return item;
        //   });
        // }
        if (
          item.children === undefined ||
          item.children?.length === 0
        ) {
          // item.children = []
          // if (item.isControl) {
          this.$set(item, 'children', [{}])
          this.$set(item, 'isCamera', true)
          // }
        } else {
          // if (item.isControl) {
          this.$set(item, 'isCamera', true)
          this.$set(item, 'defaultCamera', true) //children中有值
          this.$set(item, 'childrenData', item.children)
          // }
          this.addchildren(item.children)
        }
      })
      return arr
    },
    // 展开树节点
    expandTreenode(item, node) {
      console.log(' 展开树节点 item', item, 'node', node)

      if (
        item.parentId == '9901' &&
        node !== this.lastExpandNode
      ) {
        /* 触发地图选择对应省区 */
        this.lastExpandNode = node
        this.$root.$emit('clickTheTreeNode', item)
      }
      if (!item.isGetedCameras) {
        this.$set(item, 'loading', true)
        let data = {
          data: {
            organizationId: item.id
          }
        }
        this.$api.getCameraListForStatis(data).then(res => {
          if (res.code == 200) {
            let childArr = []

            if (!item.isCamera) {
              childArr = item.children
            }
            if (item) {
              _.each(item.childrenData, (n, i) => {
                childArr.push(n)
              })
            }
            _.each(res.data, (k, i) => {
              ;(k.organizationName = `${k?.cameraName}`),
                childArr.push(k)
            })
            try {
              this.$set(item, 'children', childArr)
            } catch (e) {}

            this.$set(item, 'loading', false)

            //标记该节点已获取摄像机
            item.isGetedCameras = true
            //    node.expanded = true
          }
        })

        this.$emit('on-click', item.queryorganizationId)
        console.log(
          'handleTreenode',
          item.queryorganizationId
        )
      }
    },
    // 是否为点击节点事件
    isTreeNode(item, node) {
      console.log('点击节点 item', item, 'node', node)

      if (
        item.parentId == '9901' &&
        node !== this.lastExpandNode &&
        node.isLeaf
      ) {
        /* 触发地图选择对应省区 */
        this.lastExpandNode = node
        this.$root.$emit('clickTheTreeNode', item)
      }

      // 判断是否为监控模式,判断是否根据cameraI对摄像机进行操作
      if (!item.cameraId) return false
      let isMonitor = this.$parent.$parent.monitorActive
      if (isMonitor) {
        this.$parent.$parent.monitorTreeNode(item)
      } else {
        this.$root.$emit('clickVideoDialog', item)
      }
      // if (item?.cameraNum) {
      //   console.log(item?.cameraNum,"22")
      //   // this.handleTreenode(item, node);
      // }
    },
    // 树节点触摸事件
    handleTreenode(item, node) {}
  }
}
</script>
<style lang="less" scoped>
.image-tree-con {
  // overflow: auto;
  margin-top: 10px;
  margin-bottom: 20px;
  .custom-tree-cameraNum {
    display: flex;
    align-items: center;
    padding-right: 10px;
  }
  .custom-tree-circle {
    display: inline-block;
    margin-right: 5px;
    // line-height: 20px;
    div {
      width: 34px;
      height: 14px;
      border-radius: 3px;
      font-size: 14px;
      text-align: center;
      color: #e4ffff;
      line-height: 14px;
      &.red {
        // border: 1px solid #ff3607;
        background-color: #7d7d7d;
      }
      &.grey {
        // border: 1px solid #8b8f91;
      }
      &.normal {
        // border: 1px solid #1ae57a;
        background-color: #00c0ff;
      }
    }
  }
  .custom-tree-main {
    display: inline-block;
    max-width: 160px;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
  }
}
.content-tree .custom-tree-node {
  // width: 96%;
  .space-title {
    display: inline-block;
    max-width: 140px;
    font-size: 16px;
    color: #e4ffff;
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .space-title-bright {
    // font-size: 20px;
    color: #4ffefc;
    font-weight: 500;
  }
  .space-total {
    display: flex;
    align-items: center;
    font-size: 16px;
    display: inline-block;
    color: #4ffefc;
    /*  position: absolute;
    right: 4px; */
    // margin-left: 20px;
    .space-total-bright {
      color: #00c0ff;
    }
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
  color: #e4ffff;
}
.color-E4FFFF {
  color: #e4ffff;
}
::v-deep .el-tree-node__content {
  position: relative;
}

::v-deep
  .content-tree
  .el-tree-node:focus
  > .el-tree-node__content {
  background-color: rgba(45, 159, 255, 0.24);
}
::v-deep
  .content-tree
  .el-tree-node:hover
  > .el-tree-node__content {
  background-color: rgba(45, 159, 255, 0.24);
}

::v-deep .content-tree .el-tree {
  // background-color: #0f1a47 !important;
  background-color: transparent !important;
}
::v-deep .map-box .box-wrap .box-wrap-body {
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
    /* position: absolute;
    right: 4px;  */
    margin-left: 20px;
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

::v-deep
  .third-tree
  .el-tree-node:focus
  > .el-tree-node__content {
  // background-color: rgba(45, 159, 255, 0.24);
}
::v-deep
  .third-tree
  .el-tree-node:hover
  > .el-tree-node__content {
  // background-color: rgba(45, 159, 255, 0.24) ;
}

::v-deep .third-tree .el-tree {
  // background-color: #0F1A47 !important;
}
::v-deep .map-box .box-wrap .box-wrap-body {
  overflow-y: auto !important;
  // overflow-x: auto !important;
}

::v-deep .loading {
  // margin-top: 60px;
  position: absolute;
  top: -16px;
  left: -4%;
  // margin-right: -50%;
  // left: 0;
  .loading-wrap i {
    font-size: 1rem;
    color: #fff;
  }
}
.custom-style-s {
  display: flex;
  justify-content: space-between;
}
</style>
