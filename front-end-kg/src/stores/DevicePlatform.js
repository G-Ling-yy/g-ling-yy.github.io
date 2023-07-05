import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    DPQueryInfo  : {},                              // 存放平台的查询条件
    DPTotal      : null,                            // 总页数
    DPPages      : null,                            // 总页码
    DPList       : [],                              // 平台列表
    DPPageSize   : 9,                               // 每页展示数量
    platformDialogVisible : false,
    platformInfo : {}
}

const actions = {

    /**
     * 获取平台列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getDevicePlatformList(store,obj){
        store.commit("setDPQueryInfo",obj);
        return api.getDevicePlatformList(obj).then((data)=>{
            if(data.code!=200){
                v.$message.error('获取平台列表失败! ['+data.code+']: '+data.message);
                return Promise.reject();
            };
            store.commit("setDPTotal",data.total);
            store.commit("setDPPages",data.pages);
            store.commit("setDPList",data.data);
        })
    },

    /**ssss
     * 新增平台信息
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    addDevicePlatform(store, obj) {
        return api.addDevicePlatform(obj).then((data)=>{
            if(data.code!=200){
                return Promise.reject(data);
            }
            return data;
        })
    },

    /**
     * 修改平台信息
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    updateDevicePlatform(store, obj) {
        return api.updateDevicePlatform(obj).then((data)=>{
            if(data.code !== 200){
                return Promise.reject(data);
            };
            return data;
        })
    },

    /**
     * 删除平台信息
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    delDevicePlatform(store, obj) {
        return api.delDevicePlatform(obj).then((data)=>{
            if(data.code!=200){
                v.$message.error('删除平台信息失败! ['+data.code+']: '+data.message);
                return Promise.reject();
            };
            return data;
        })
    },

    /**
     * 修改平台状态
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    statusPlatform(store,obj){
        return api.checkDevicePlatformStatus(obj).then((data)=>{
            if(data.code!=200){
                v.$message.error('修改平台状态失败! ['+data.code+']: '+data.message);
                return Promise.reject();
            };
            return data;
        })
    },

    /**
     * 导出Token
     * @param store
     * @param obj
     */
    exportPlatformToken(store,obj){
        api.exportPlatformToken(obj).then((data)=>{
            let blob = new Blob([data], {type: 'text/plain'});      // type这里表示xlsx类型
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob);            // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = obj.appCode + '-token.txt';  // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                // 点击下载
            document.body.removeChild(downloadElement);             // 下载完成移除元素
            window.URL.revokeObjectURL(href);                       // 释放掉blob对象
        }).catch((error)=>{
            v.$message.error('导出Token失败! ');
        })
    },

    /**
     * 导出Key
     * @param store
     * @param obj
     */
    exportPlatformKey(store,obj){
        api.exportPlatformKey(obj).then((data)=>{
            let blob = new Blob([data], {type: 'text/plain'});   // type这里表示xlsx类型
            let href = window.URL.createObjectURL(blob);                            // 创建下载的链接
            let downloadElement = document.createElement('a');
            downloadElement.href = href;
            downloadElement.download = obj.appCode + '-key.txt';                    // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                                // 点击下载
            document.body.removeChild(downloadElement);                             // 下载完成移除元素
            window.URL.revokeObjectURL(href);                                       // 释放掉blob对象
        }).catch((error)=>{
            v.$message.error('导出Key失败! ');
        })
    },

    /**
     * 重置签名密钥
     * @param store
     * @param obj
     */
    resetDevicePlatform(store,obj){
        api.resetDevicePlatform(obj).then((data)=>{
            if(data.code !== 200){
                v.$message.error('重置签名密钥失败! ['+data.code+']: '+data.message);
                return Promise.reject();
            }
            return data;
        });
    },


  
}

const mutations = {
    setDPList(state,nv){
        state.DPList = nv;
    },
    setDPQueryInfo(state,nv){
        state.DPQueryInfo = nv;
    },
    setDPTotal(state,nv){
        state.DPTotal = nv;
    },
    setDPPages(state,nv){
        state.DPPages = nv;
    },
    setPlatformDialogVisible(state,nv){
        state.platformDialogVisible = nv;
    },
    setPlatformInfo(state,nv){
        state.platformInfo = nv;
    }
}
export default {
    state, mutations,actions
}
