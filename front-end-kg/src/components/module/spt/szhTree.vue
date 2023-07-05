<template>
<div class="image-tree-con">
     <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="路线" name="first">
              <div class="text item content-tree">
                <el-tree
                    :data="roadList"
                    node-key="id"
                    :props="{
                        children: 'childList',
                        label: 'name',
                        isLeaf: 'leaf'
                    }"
                    :default-expanded-keys="idArr"
                    @node-click="handleTreenode"
                    :load="(node, resolve) => loadNode(node, resolve, 1)"
                    lazy
                    :draggable="drag"
                    @node-drag-start="nodeDrop"
                    >
                    <span class="custom-tree-node organize-box" slot-scope="{ node, data }">
                        <div v-if="data.leaf" class="custom-tree-circle">
                            <div :class="cameraColor[data.onlineStatus]"></div>
                        </div>
                        <span class="space-l">{{ node.label }}</span>
                        <span>{{data.total ? (data.online + '/' + data.total) : ''}}</span>
                    </span>
                </el-tree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="单位" name="third">
                 <div class="text item content-tree">
                    <el-tree
                        :data="provinceList"
                        node-key="id"
                        :props="{
                            children: 'childList',
                            label: 'name',
                            isLeaf: 'leaf'
                        }"
                        :default-expanded-keys="idArr"
                        @node-click="handleTreenode"
                        :load="(node, resolve) => loadNode(node, resolve, 2)"
                        lazy
                        :draggable="drag"
                        @node-drag-start="nodeDrop"
                        >
                        <span class="custom-tree-node organize-box" slot-scope="{ node, data }">
                            <div v-if="data.leaf" class="custom-tree-circle">
                                <div :class="cameraColor[data.onlineStatus]"></div>
                            </div>
                            <span class="space-l">{{ node.label }}</span>
                            <span>{{data.total ? (data.online + '/' + data.total) : ''}}</span>
                        </span>
                    </el-tree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="区域" name="second">
                 
            </el-tab-pane>
            <el-tab-pane label="摄像机组" name="fourth">
                 
            </el-tab-pane>
          </el-tabs>
</div>    
</template>
<script>
import {mapActions, mapState} from 'vuex';
export default {
    props: {
        drag: Boolean
    },
    data(){
        return {
            idArr:[],
            activeName: 'first',
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
                2:  [
                    {code:'province',name:'', regionCode: "", provinceCode: "" },
                    { code: "road", name: "", road: "" },
                    { code: "camera", name: "", value: "" },
                ],
                3: [
                    { code: "province", regionCode: "", provinceCode: "" },
                    { code: "organization", name: "", organizationId: "" },
                    { code: "organization", name: "", organizationId: "" },
                    { code: "road", name: "", road: "" },
                    { code: "camera", name: "", value: "" },
                ]
            },
            // 查找摄像头所选路径
            cameraCategoryRoute: 2, // 默认是路线
            // 当前路径所显示位置
            currCategoryPathIndex: 0,
            cameraColor: {
                '4': 'grey',
                '1': 'normal',
                '3': 'red'
            }
        }
    },
    computed: {
        ...mapState([
            "userInfo",
        ]),
    },
    created(){
    },
    methods: {
        ...mapActions(["getDeviceStatistics", "getCameraListForStatis"]),
        handleClick(){},
        queryStaticDataList(data) {
            let _this = this;
            this.$api.queryHomeLeftList({
                type: data.type
            }).then(res => {
                if(data.type === 1){
                    this.roadList = res.data.list;
                }else {
                    this.provinceList = res.data.list;
                }
            })
        },

        handleTreenode(item){
            if(item.cameraNum){
                this.$emit('on-click', item);
            }
        },
        loadNode(node, resolve, type){
            if(node.level === 0){
                this.queryStaticDataList({
                    type: type
                });
            }else {
                this.loadChildren(node, type, resolve);
            }
        },
        loadChildren(node, type, resolve){
            let that = this;
            let params = {};
            //是否还有下一级，更新当前列表
            //TODO: 刷新当前列表显示数据
            if(type === 1){
                params.roadId = node.key;
            }else {
                params.orgId = node.key;
            }
            this.$api.queryReginHomeCamera(params).then((res) => {
                let data = _.map(res.data, it => {
                    return {
                        ...it,
                        id: it.cameraId,
                        name: it.khPile + '(' + it.poiName + ')',
                        leaf: true,
                        childList: []
                    }
                })
                resolve(data);
            })
        },
        nodeDrop(node, i, event){
            this.$emit('after-drop', node.data);
        },
        allowDrop(draggingNode, dropNode, type){
            // return type !== 'inner' && type !== 'prev' && type !== 'next';
            return true;
        }
    }
}
</script>
<style lang="less">
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
            //     border: 1px solid #ff3607;
            // }
            // &.grey {
            //     border: 1px solid #8b8f91;
            // }
            // &.normal {
            //     border: 1px solid #1ae57a;
            // }
        }
    }
    .custom-tree-node .space-l {
        width: 90%;
    }
}

</style>