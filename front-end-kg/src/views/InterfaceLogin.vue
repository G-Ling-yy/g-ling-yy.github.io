<template>
    <div class="my-login-wrapper">
        <loading :message="loadingMsg" :loading-status="loadingSta" style="margin-top: 50vh;transform: translate(0, -50%);" ></loading>
    </div>
</template>

<script>

    import {mapState, mapActions, mapMutations} from 'vuex';
    import loading from '@/components/common/Loading';

    export default {
        name: "interfaceLogin",
        components:{
            loading,
        },
        data(){
            return {
                loadingMsg:'正在登录中',
                loadingSta:'loading',
                domainData:{
                    "bj.zggs.cloud":{"regionName":"北京","regionCode":110000},
                    "tj.zggs.cloud":{"regionName":"天津","regionCode":120000},
                    "hb.zggs.cloud":{"regionName":"河北","regionCode":130000},
                    "jin.zggs.cloud":{"regionName":"山西","regionCode":140000},
                    "nmg.zggs.cloud":{"regionName":"内蒙古","regionCode":150000},
                    "ln.zggs.cloud":{"regionName":"辽宁","regionCode":210000},
                    "jl.zggs.cloud":{"regionName":"吉林","regionCode":220000},
                    "hlj.zggs.cloud":{"regionName":"黑龙江","regionCode":230000},
                    "sh.zggs.cloud":{"regionName":"上海","regionCode":310000},
                    "js.zggs.cloud":{"regionName":"江苏","regionCode":320000},
                    //"js.zggs.cloud":{"regionName":"江苏","regionCode":100000},
                    "zj.zggs.cloud":{"regionName":"浙江","regionCode":330000},
                    "ah.zggs.cloud":{"regionName":"安徽","regionCode":340000},
                    "fj.zggs.cloud":{"regionName":"福建","regionCode":350000},
                    "jx.zggs.cloud":{"regionName":"江西","regionCode":360000},
                    "sd.zggs.cloud":{"regionName":"山东","regionCode":370000},
                    "yu.zggs.cloud":{"regionName":"河南","regionCode":410000},
                    "e.zggs.cloud":{"regionName":"湖北","regionCode":420000},
                    "hn.zggs.cloud":{"regionName":"湖南","regionCode":430000},
                    "gd.zggs.cloud":{"regionName":"广东","regionCode":440000},
                    "gx.zggs.cloud":{"regionName":"广西","regionCode":450000},
                    "qiong.zggs.cloud":{"regionName":"海南","regionCode":460000},
                    "cq.zggs.cloud":{"regionName":"重庆","regionCode":500000},
                    "sc.zggs.cloud":{"regionName":"四川","regionCode":510000},
                    "gz.zggs.cloud":{"regionName":"贵州","regionCode":520000},
                    "yn.zggs.cloud":{"regionName":"云南","regionCode":530000},
                    "xz.zggs.cloud":{"regionName":"西藏","regionCode":540000},
                    "sx.zggs.cloud":{"regionName":"陕西","regionCode":610000},
                    "gs.zggs.cloud":{"regionName":"甘肃","regionCode":620000},
                    "qh.zggs.cloud":{"regionName":"青海","regionCode":630000},
                    "nx.zggs.cloud":{"regionName":"宁夏","regionCode":640000},
                    "xj.zggs.cloud":{"regionName":"新疆","regionCode":650000}
                },
            };
        },

        computed:{
            ...mapState(["login"]),
        },

        mounted() {
            let userId = this.$route.params.code;
            if(userId){
                this.doMyloading(userId);
                return true;
            };

            this.loadingMsg = '请求错误，请联系管理员！';
            this.loadingSta = 'error';
        },
        methods: {
            ...mapActions([
                "dologin"
            ]),

            doMyloading(userId){
                let that = this,parentUrl = document.referrer;//'https://bj.zggs.cloud/?timesmap=1577433333123';//
                that.$http.get('/user/oss/login',{
                    params:{
                        userId:userId,
                    }
                }).then(({ statusText, data }) => {
                    if(data && data.code!==200){
                        that.loadingMsg = '请求错误，请联系管理员！';
                        that.loadingSta = 'error';
                        return Promise.reject();
                    }
                    let uinfo = data.data.userinfo;
                    if(!uinfo || !uinfo.role) {
                        that.loadingMsg = '登录失败，无角色信息！';
                        that.loadingSta = 'error';
                        return false;
                    }

                    let domain      = '',
                        s           = parentUrl.split('\/'),
                        regionInfo  = '';

                    if(s.length){
                        domain = s[2];
                        regionInfo = that.domainData[domain];
                        if(regionInfo && regionInfo.regionCode){
                            data.data.userinfo.regionCode = regionInfo.regionCode;
                            data.data.userinfo.regionName = regionInfo.regionName;
                        }
                        //孙主任
                        if("100000000066" === uinfo.userId){
                            data.data.userinfo.regionCode = 100000;
                        }
                    }
                    that.dologin(data);
                }).catch(()=>{
                    that.loadingMsg = '请求错误，请联系管理员！';
                    that.loadingSta = 'error';
                });
            }
        }
    }
</script>

<style scoped>
    .my-login-wrapper{width:100vw;height:100vh;overflow: hidden;}
</style>
