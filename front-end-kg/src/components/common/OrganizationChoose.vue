<template>
    <div class="org-choose-wrap search-choose-wrap">
        <el-select
                v-model="filters.provinceCode"
                placeholder="省份"
                clearable
                @change="regionChange"
                :class="filters.provinceCode?'input-selected':''" >
            <el-option v-for="item in provinces" :label="item.regionName" :key="item.id" :value="item.regionCode"></el-option>
        </el-select>
        <!--<el-select v-model="filters.organizationId" placeholder="组织单位"  @change="orgChange" style="width:200px;" v-if="orgTreeList.length">
            <el-option label="全部组织单位" value=""></el-option>
            <el-option  v-for="item in orgTreeList" :label="item.organizationName" :value="item.organizationId"></el-option>
        </el-select> v-if="orgTreeList.length" -->
        <el-cascader
                v-model="organizationRs"
                :class="organizationRs.length?'input-selected':''"
                clearable
                filterable
                :show-all-levels="false"
                :options="orgTreeList"
                :props="orgCodeProps"
                @change="orgChange"
                @clear="orgChange"
                style="width:240px;" ></el-cascader>

        <el-select
                v-if="0 && hasRoad && roadList.length"
                v-model="filters.roadCode"
                :class="filters.roadCode?'input-selected':''"
                placeholder="路线"
                clearable
                @change="roadChange"
                style="width:200px;">
            <el-option label="全部路线" value=""></el-option>
            <el-option v-for="item in roadList" :label="item.roadName" :key="item.index" :value="item.roadCode"></el-option>
        </el-select>
    </div>
</template>

<script>
    import {mapState,mapActions,mapMutations} from 'vuex';
    import api from '@/api'

    export default {
        name:"",
        components:{},
        props:{
            hasRoad:{
                type:Boolean,
                default(){
                    return true;
                }
            }
        },
        data(){
            return {
                organizationRs:[],
                filters: {
                    provinceCode:'',
                    organizationId:'',
                    roadCode:'',
                },
                orgCodeProps: {
                    //lazy: true,
                    expandTrigger: 'hover',
                    value:'organizationId',
                    label:'organizationName',
                    children:'childNode',
                    //lazyLoad:this.propsLazyload
                },
                orgTreeList:[],
                roadList:[],
            };
        },
        computed:{
            ...mapState([
                "provinces",
            ]),
        },
        mounted(){
            this.queryOrgList();
        },
        methods:{
            /**
             * 省份切换
             * @param val
             */
            regionChange(val){

                //this.filters.provinceCode = '';
                this.filters.organizationId = '';
                this.filters.roadCode = '';
                this.organizationRs = [];
                this.orgTreeList = [];
                this.roadList = [];
                console.info('regionChange',val);
                /*if( val ){
                    this.queryOrgList(val);
                }*/

                this.queryOrgList(val);

                this.changeCheck();
            },
            /**
             * 单位切换
             *
             * @param val
             */
            orgChange(val){
                //console.info('orgChange  ',val);
                this.filters.roadCode = '';
                this.roadList = [];
                this.filters.organizationId = '';
                if(val.length){
                    let orgId = val[val.length - 1];
                    this.filters.organizationId = orgId;
                    //console.info('orgChange ',val);
                    //if(this.hasRoad) this.queryRoadList(orgId);
                }
                this.changeCheck();
            },
            /**
             * 路线切换
             *
             * @param val
             */
            roadChange(val){
                this.changeCheck();
            },

            queryOrgList(regionCode){
                let _this = this,params = {};

                if(regionCode) params.regionCode = regionCode;

                api.getOrgTree(params).then((data)=>{
                    if(data.code!==200){
                        return Promise.reject();
                    };
                    let nlist = data.data;
                    /*for(let i = 0,len = nlist.length;i<len;i++){
                        let vo = nlist[i];
                        if(!vo.childNode){
                            nlist[i].isLeaf = true;
                            nlist[i].childNode = [];
                        }
                    }*/
                    console.info('queryOrgList ',nlist);
                    _this.orgTreeList = nlist;
                })
                // .catch((error)=>{
                //     v.$message({
                //         message: '获取组织架构树失败! ['+error.code+']: '+error.message,
                //         type: 'error'
                //     });
                // })
            },
            queryRoadList(orgId){
                let _this = this;
                api.getRoadsByOrgId({organizationId:orgId+''}).then((data)=>{
                    if(data.code!==200){
                        return Promise.reject();
                    };
                    // // console.log("road=>",data);
                    _this.roadList = data.data;
                }).catch((error)=>{

                })
            },
            changeCheck(){
                this.$emit('choose-change',this.filters);
            }

        }

    }
</script>

<style lang="less">
    .org-choose-wrap{
        display:inline-block;

        &.search-choose-wrap{
            .el-cascader{
                margin-right:20px;
                line-height: 33px;
                .el-input__icon{
                    line-height: 33px;
                }
            }

            .el-input{
                width: 100%!important;
                .el-input__inner{
                    width: 100%!important;
                }
            }

            .el-select,.el-input{
                width: 120px;
                height: 33px;
                margin-right: 20px;
                box-sizing: border-box;


                .el-input__inner{
                    border-radius: 16px;
                    border: solid 1px @cd;
                    background-color: @white;
                    width: 120px;
                    height: 33px;
                    line-height: 33px;
                }

                .el-select__caret{
                    line-height: 33px;
                }

                .el-input__inner::-webkit-input-placeholder { /* WebKit browsers */
                    color: #a0adb9 !important;
                }

                .el-input__inner:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                    color: #a0adb9 !important;
                }

                .el-input__inner::-moz-placeholder { /* Mozilla Firefox 19+ */
                    color: #a0adb9 !important;
                }

                .el-input__inner:-ms-input-placeholder { /* Internet Explorer 10+ */
                    color: #a0adb9 !important;
                }
            }

        }

        .el-input--suffix{
            .el-input__suffix{
                top:0;
            }

        }

    }

</style>
