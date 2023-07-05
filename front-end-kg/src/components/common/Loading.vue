<template>
    <div class="loading-wrap">
        <div v-if="loadingStatus === 'loading'">
            <i class="el-icon-loading"></i>
            <span>{{message}}</span>
        </div>
        <div v-else-if="loadingStatus === 'error'">
            <i class="iconkulian1 iconfont"></i>
            <span>{{message}}</span>
        </div>
        <div class="loading-empty" v-else-if="loadingStatus === 'empty'">
            <i class="el-icon-coffee-cup"></i>
            <span>{{message}}</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .loading-wrap {
        text-align: center;
        font-size: 1rem;
        padding: 30px;
        height: 100%;
        position: relative;

        > div {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            transform: translate(-50%, -50%);
        }

    }
    /*.loading-wrap{text-align: center;font-size: 1rem;padding:30px;}*/
    .loading-wrap i{font-size: 5rem;color: #2f9eff;}
    .loading-wrap span{display:block;line-height: 30px;    font-size: 1.5rem;color: #2f9eff;}
    .temp-loading-wrap a{color: #333;}
    .loading-empty i{font-size: 5rem;}
    .loading-empty span{font-size: 1.2rem;line-height: 50px;}
</style>

<script>
    export default {
        name: 'Loading',
        props: {
            message:{
                type:String,
                default(){
                    return '数据加载中...';
                }
            },
            loadingStatus:{
                type:String,
                default(){
                    return 'loading';
                }
            }
        },
        methods : {
        }
        ,mounted(){
            //console.log(this.message,this.loadingStatus);
        }
    }
</script>
