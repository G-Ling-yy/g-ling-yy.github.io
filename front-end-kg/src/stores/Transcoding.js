import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例

const state = {
    transcodingList     : [],                       // 视频上云网关列表
    transcodingTotal    : 1,                        // 总页数
    transcodingPages    : 1,                        // 总页码
    transcodingPageSize : 10,                       // 每页展示数量

    transcodingCameraList     : [],                 // 流媒体服务器下的摄像机列表
    transcodingCameraTotal    : 1,                  // 摄像机总页数
    transcodingCameraPages    : 1,                  // 摄像机总页码
    transcodingCameraPageSize : 10,                 // 摄像机每页展示数量

    queryInfo           : {},                       // 存放流媒体服务器的查询条件
    addFormVisible      : false,                    // 控制新增、编辑弹窗可见
    centerDialogVisible : false,                    // 控制删除弹窗可见
    addBatchFormVisible : false,                    // 控制批量导入弹窗可见
}

const actions = {

    /**
     * 获取流媒体服务器列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getTranscodingList(store,obj){
        store.commit("setQueryInfo",obj);
        return api.getTranscodingList(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '获取流媒体服务器列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setTranscodingTotal",data.total);
            store.commit("setTranscodingPage",data.pages);
            store.commit("setTranscodingList",data.data||{});
            return data;
        })
    },

    /**
     * 获取流媒体服务器下的摄像机列表
     * @param store
     * @param obj
     */
    getTranscodingCameraList(store,obj){
        api.getTranscodingCameraList(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '获取摄像机列表失败!['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            store.commit("setTranscodingCameraTotal",data.total);
            store.commit("setTranscodingCameraPages",data.pages);
            store.commit("setTranscodingCameraList",data.data||{});
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
            var href = window.URL.createObjectURL(blob);                // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '视频上云网关信息表.xls';         // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                    // 点击下载
            document.body.removeChild(downloadElement);                 // 下载完成移除元素
            window.URL.revokeObjectURL(href);                           // 释放掉blob对象
        }).catch((error)=>{
            v.$message({
                message: '视频上云网关导出失败! ',
                type: 'error'
            });
        })
    },

    /**
     * 新增视频上云网关
     * @param store
     * @param obj
     */
    addTranscoding(store,obj){
        api.addTranscoding(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '新增视频上云网关失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            v.$message({
                message: '新增视频上云网关成功',
                type: 'success'
            });
            store.commit("setAddFormVisible",false);
            store.dispatch("getTranscodingList",store.state.queryInfo)
        })
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
            }
            v.$message({
                message: '删除视频上云网关成功',
                type: 'success'
            });
            store.commit("setCenterDialogVisible",false);
            store.dispatch("getTranscodingList",store.state.queryInfo)
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
}


export default {
    state, mutations,actions
}
