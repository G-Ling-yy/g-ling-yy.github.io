import api from '../api';
import Vue from 'vue';

let v = new Vue();

const state = {
    gatewayList     : [],
    gatewayTotal    : null,                                     //总页数
    gatewayPages    : null,                                     //总页码
    gatewaySize     : 10,                                       //每页数量
    eventDeviceInfo : null,                                     //当前点击设备信息，用于跳转页面取数据
    provinceStatus  : [                                         // 查询省份选项
                          {value: '1',label: '省份一'},
                          {value: '2',label: '省份二'},
                      ],
    companyStatus   : [                                         // 查询单位选项
                          {value: '1',label: '单位一'},
                          {value: '2',label: '单位二'},
                      ],
    lineStatus      : [                                         // 查询路线选项
                          {value: '1',label: '路线一'},
                          {value: '2',label: '路线二'},
                      ],
    networkData     : [],                                       // 配置视频上云网关网络设置节点选项
    setupItemData   : [                                         // 配置视频上云网关网络设置项选项
                          {value: '1',label: '节点设置'},
                          {value: '2',label: '网卡一设置'},
                      ],
    programData     : [                                         // 配置视频程序设置程序选项
                          {value: '1',label: '转码程序一'},
                          {value: '2',label: '转码程序二'},
                          {value: '3',label: '转码程序三'},
                      ],
    switchData      : [                                         // 配置视频程序设置开关选项
                          {value: '1',label: '打开'},
                          {value: '2',label: '关闭'},
                      ],
    qualityData     : [                                         // 配置视频程序设置视频质量选项
                          {value: '1',label: '高'},
                          {value: '2',label: '中'},
                          {value: '3',label: '低'}
                      ],
    typeData        : [                                         // 配置视频程序设置平台类型选项
                          {value: '1',label: 'WOWZA'},
                      ],
    highwayTypeData : [                                         // 配置视频程序设置公路平台类型选项
                          {value: '1',label: '苏交控'},
                      ],
    highDefinitionData: [                                       // 配置视频程序设置是否高清选项
                            {value: '1',label: '是'},
                            {value: '2',label: '否'},
                        ],
    agreementData   : [                                         // 配置视频程序设置选择协议选项
                          {value: '1',label: 'RTSP协议'},
                      ],
    netList         : [],
    eventTAuthInfo  : {                                         // 获取新的TAuth使用参数
                           ip          : '',
                           port        : '',
                           deviceCode  : '',
                           user        : '',
                           token       : '',                    // 上云网关头部携带
                      },

};

const actions = {

    /**
     * 获取视频上云网关表格数据
     * @param store
     * @param obj
     * @returns {*}
     */
    getTranscoding(store,obj){
        return api.getTranscoding(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            }
            store.commit("setgatewayTotal", data.total*1);
            store.commit("setgatewayPages", data.pages);
            store.commit("setgatewayList", data.data||[]);
        }).catch((error)=>{
            v.$message({
                message: '获取调用管理列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取校时服务器信息
     * @returns {*}
     */
    getTimeAdjustInfo(store,obj){
        return api.getTimeAdjustInfo(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            }
            console.log("getTimeAdjustInfo=>",data);
            return data.data;
        }).catch((error)=>{
            v.$message({
                message: '获取校时服务器信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 获取校时服务器信息 更改接口
     * @returns {*}
     */
    editTimeAdjustInfo(store,obj){
        return api.editTimeAdjustInfo(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            };

            v.$message({
                message: '更改校时服务器信息成功',
                type: 'success'
            });

        }).catch((error)=>{
            v.$message({
                message: '更改校时服务器信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 获取上云网关服务的网络设置信息
     * @returns {*}
     */
    getNetInfo(store,obj){
        store.commit('setNetworkData', []);
        store.commit('setNetList', []);
        return api.getNetInfo(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };

            // 增加oldNodeIp字段
            for(var i=0;i<data.data.length;i++){
                for(var j=0;j<data.data[i].length;j++){
                    data.data[i][j].oldNodeIp = data.data[i][j].nodeIp;
                };
            };

            store.commit('setNetworkData', data.data);
            store.commit('setNetList', data.data);

            return data;
        }).catch((error)=>{
            v.$message({
                message: '获取网络设置信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 上云网关网络   设置
     * @returns {*}
     */
    editNetInfo(store,obj){
        return api.editNetInfo(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            };

            v.$message({
                message: '更改上云网关网络信息成功',
                type: 'success'
            });

        }).catch((error)=>{
            v.$message({
                message: '更改上云网关网络信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 静态路由设置信息获取
     * @returns {*}
     */
    getRoutingInfo(store,obj){
        return api.getRoutingInfo(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            }
            return data.data;
        }).catch((error)=>{
            v.$message({
                message: '获取静态路由信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 静态路由设置新增接口
     * @returns {*}
     */
    addRoutingInfo(store,obj){
        return api.addRoutingInfo(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            };

            v.$message({
                message: '新增静态路由信息成功',
                type: 'success'
            });
            return true;
        }).catch((error)=>{
            v.$message({
                message: '新增静态路由信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 静态路由设置删除接口
     * @returns {*}
     */
    delRoutingInfo(store,obj){
        return api.delRoutingInfo(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            };

        }).catch((error)=>{
            v.$message({
                message: '删除静态路由信息失败',
                type: 'error'
            });
        });
    },

    /**
     * 系统重启
     * @param store
     * @param obj
     */
    sysRestart(store,obj){
        return api.sysRestart(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            };
            v.$message({
                message: '重启节点成功',
                type: 'success'
            });

        }).catch((error)=>{
            v.$message({
                message: '重启节点失败',
                type: 'error'
            });
        });
    },

    /**
     * TAuth获取
     * @param store
     * @param obj
     */
    // getTokenInfo(store,obj){
    //     console.log("getTokenInfo=>",store.state.eventTAuthInfo);
    //     api.getTokenInfo(store.state.eventTAuthInfo).then((data)=>{
    //         if(data.code!==200){
    //             return Promise.reject();
    //         };
    //         let newObj = store.state.eventTAuthInfo;
    //         newObj.token = data.token.token;
    //         // TAuth更新入库
    //         api.updateAuthToken({
    //             url       : `userId=${store.state.eventTAuthInfo.user}`,
    //             formData  : {
    //                             "transcodingCode" : store.state.eventTAuthInfo.deviceCode,
    //                             "authToken"       : data.token.token
    //                         }
    //         }).then((res)=>{
    //             if(res.code!==200){
    //                 return Promise.reject();
    //             };

    //             // 修改vuex内部数据
    //             store.commit("seteventTAuthInfo",newObj);
    //         }).catch(()=>{
    //             v.$message({
    //                 message: 'token更新失败',
    //                 type: 'error'
    //             });
    //         });
    //     }).catch((error)=>{
    //         v.$message({
    //             message: 'token获取失败',
    //             type: 'error'
    //         });
    //     });
    // }

};

const mutations = {
    setgatewayTotal(state,nv){
        state.gatewayTotal = nv;
    },
    setgatewayPages(state,nv){
        state.gatewayPages = nv;
    },
    setgatewayList(state,nv){
        state.gatewayList = nv;
    },
    seteventDeviceInfo(state,nv){
        state.eventDeviceInfo = nv;
    },
    setNetworkData(state,nv){
        state.networkData = nv;
    },
    setNetList(state,nv){
        state.netList = nv;
    },
    seteventTAuthInfo(state,nv){
        state.eventTAuthInfo = nv;
    },
    setgatewaySize(state,nv){
        state.gatewaySize = nv;
    },

};


export default {
    state, mutations,actions
};