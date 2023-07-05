import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    transcodingList     : [],                                       // 视频上云网关列表
    transcodingTotal    : 1,                                        // 总页数
    transcodingPages    : 1,                                        // 总页码
    transcodingPageSize : 10,                                       // 每页展示数量
    transcodingOperatePageSize : 9,                                 // 每页展示数量

    transcodingCameraList     : [],                                 // 流媒体服务器下的摄像机列表
    transcodingCameraTotal    : 1,                                  // 摄像机总页数
    transcodingCameraPages    : 1,                                  // 摄像机总页码
    transcodingCameraPageSize : 10,                                 // 摄像机每页展示数量

    queryInfo           : {},                                       // 存放流媒体服务器的查询条件
    addFormVisible      : false,                                    // 控制新增、编辑弹窗可见
    centerDialogVisible : false,                                    // 控制删除弹窗可见
    addBatchFormVisible : false,                                    // 控制批量导入弹窗可见

    transcodingImportErrorTitle         : "错误信息:",               // 错误信息弹窗标题
    transcodingImportErrorList          : [],                       // 错误信息数据
    transcodingImportErrorVisible       : false,                    // 错误信息弹窗可见
    transcodingImportErrorDialogVisible : false,                    // 批量导入错误提示

    transcodingSoftVersion:[],
}

const actions = {

    /**
     * 获取流媒体服务器列表
     * @param store
     * @param obj
     */
    getTranscodingList(store,obj){
        store.commit("setQueryInfo",obj);
        api.getTranscodingList(obj).then((data)=>{
            if(data.code!==200){
                // v.$message({
                //     message: '获取流媒体服务器列表失败! ['+data.code+']: '+data.message,
                //     type: 'error'
                // });
                return Promise.reject();
            }
            store.commit("setTranscodingTotal",data.total);
            store.commit("setTranscodingPage",data.pages);
            store.commit("setTranscodingList",data.data==null?[]:data.data);
        })
    },

    /**
     * 获取流媒体服务器下的摄像机列表
     * @param store
     * @param obj
     */
    getTranscodingCameraList(store,obj){
        api.getTranscodingCameraList(obj).then((data)=>{
            if(data.code!==200){
                v.$message({
                    message: '获取摄像机列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            store.commit("setTranscodingCameraTotal",data.data.totalSize);
            store.commit("setTranscodingCameraPages",data.data.totalPages);
            store.commit("setTranscodingCameraList",data.data.content);
        })
    },

    /**
     * 视频上云网关导出
     * @param store
     * @param obj
     */
    exportTranscodingList(store,obj){
        api.exportTranscodingList(obj).then((data)=>{
            var blob = new Blob([data], {type: 'application/vnd.ms-excel'});    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);            // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '视频上云网关信息表.xls';     // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                // 点击下载
            document.body.removeChild(downloadElement);             // 下载完成移除元素
            window.URL.revokeObjectURL(href);                       // 释放掉blob对象
        }).catch((error)=>{
            v.$message({
                message: '视频上云网关导出失败!',
                type: 'error'
            });
        })
    },

    /**
     * 新增视频上云网关
     * @param store
     * @param obj [form表单数据，公钥文件，私钥文件]
     * @returns {Promise<*>}
     */
    addTranscoding(store,obj){

        let donotGetList = obj[0].donotGetList;

        return api.addTranscoding(obj[0]).then((data)=>{
            if(data.code!==200){
                return Promise.reject(data);
            };

            return [obj,data.data.transcodingId];
        }).then((obj)=>{

            // 公钥与私钥同时上传
            if( obj[0][1] != null && obj[0][2] != null ){

                Promise.all([
                    api.uploadPublicKey({id:obj[1],info:obj[0][1]}),
                    api.uploadPrivateKey({id:obj[1],info:obj[0][2]}),
                ]).then((res)=>{
                    if(res[0].code != 200 && res[1].code != 200){
                        return Promise.reject({
                            code : res[0].code != 200 ? res[0].code : res[1].code,
                            message : '上传文件失败'
                        });
                    };
                    store.dispatch('addTranscodingRes',donotGetList);
                }).catch((err)=>{
                    store.dispatch('addTranscodingFail',err);
                })

            }else if(obj[0][1] != null){

                api.uploadPublicKey({id:obj[1],info:obj[0][1]}).then((data)=>{
                    if(data.code != 200 ){
                        return Promise.reject(data);
                    };
                    store.dispatch('addTranscodingRes',donotGetList);
                }).catch((err)=>{
                    store.dispatch('addTranscodingFail',err);
                });

            }else if(obj[0][2] != null){

                api.uploadPrivateKey({id:obj[1],info:obj[0][2]}).then((data)=>{
                    if(data.code != 200 ) {
                        return Promise.reject(data);
                    };
                    store.dispatch('addTranscodingRes',donotGetList);
                }).catch((err)=>{
                    store.dispatch('addTranscodingFail',err);
                });

            }else {
                store.dispatch('addTranscodingRes',donotGetList);
            }

        }).catch((err)=>{
            store.dispatch('addTranscodingFail',err);
        })
    },

    /**
     * 新增视频上云网关成功后调用
     * @param store
     * @param obj
     */
    addTranscodingRes(store,obj){
        v.$message({
            message: '新增视频上云网关成功',
            type: 'success'
        });
        store.commit("setAddFormVisible",false);
        if(!obj) store.dispatch("getTranscodingList",store.state.queryInfo);
    },

    /**
     * 新增视频上云网关失败后调用
     * @param store
     * @param obj
     */
    addTranscodingFail(store,obj){
        v.$message({
            message: '新增视频上云网关失败! ['+obj.code+']: '+obj.message,
            type: 'error'
        });
    },

    /**
     * 修改视频上云网关
     * @param store
     * @param obj
     */
    editTranscoding(store,obj){
        api.editTranscoding(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '修改视频上云网关失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            v.$message({
                message: '修改视频上云网关成功',
                type: 'success'
            });
            store.commit("setAddFormVisible",false);
            store.dispatch("getTranscodingList",store.state.queryInfo)
        })
    },

    /**
     * 删除视频上云网关
     * @param store
     * @param obj
     */
    deleteTranscoding(store,obj){
        api.deleteTranscoding(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '删除视频上云网关失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            v.$message({
                message: '删除视频上云网关成功',
                type: 'success'
            });
            store.commit("setCenterDialogVisible",false);
            store.dispatch("getTranscodingList",store.state.queryInfo)
        })
    },

    /**
     * 视频上云网关批量新增模板
     * @param store
     * @param obj
     */
    downTranscodingTemplate(store,obj){
        api.downTranscodingTemplate().then((data)=>{
            var blob = new Blob([data], {type: 'application/vnd.ms-excel'});    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);                    // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '视频上云网关批量导入模板.xls';        // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                        // 点击下载
            document.body.removeChild(downloadElement);                     // 下载完成移除元素
            window.URL.revokeObjectURL(href);                               // 释放掉blob对象
        }).catch((error)=>{
            v.$message({
                message: '视频上云网关批量导入模板下载失败! ',
                type: 'error'
            });
        })
    },

}

const mutations = {
    setTranscodingList(state,nv){
        state.transcodingList = nv;
    },
    setTranscodingTotal(state,nv){
        state.transcodingTotal = nv;
    },
    setTranscodingPage(state,nv){
        state.transcodingPages = nv;
    },
    setTranscodingPageSize(state,nv){
        state.transcodingPageSize = nv;
    },
    setTranscodingCameraList(state,nv){
        state.transcodingCameraList = nv;
    },
    setTranscodingCameraTotal(state,nv){
        state.transcodingCameraTotal = nv;
    },
    setTranscodingCameraPages(state,nv){
        state.transcodingCameraPages = nv;
    },
    setTranscodingCameraPageSize(state,nv){
        state.transcodingCameraPageSize = nv;
    },
    setQueryInfo(state,nv){
        state.queryInfo = nv;
    },
    setAddFormVisible(state,nv){
        state.addFormVisible = nv;
    },
    setCenterDialogVisible(state,nv){
        state.centerDialogVisible = nv;
    },
    setAddBatchFormVisible(state,nv){
        state.addBatchFormVisible = nv;
    },
    setTranscodingImportErrorDialogVisible(state,nv){
        state.transcodingImportErrorDialogVisible = nv;
    },
    setTranscodingImportErrorTitle(state,nv){
        state.transcodingImportErrorTitle = nv;
    },
    setTranscodingImportErrorVisible(state,nv){
        state.transcodingImportErrorVisible = nv;
    },
    setTranscodingImportErrorList(state,nv){
        state.transcodingImportErrorList = nv;
    },
    setTranscodingSoftVersion(state,nv){
        state.transcodingSoftVersion = nv;
    }
}


export default {
    state, mutations,actions
}
