import api from '../api';
import Vue from 'vue';

let v = new Vue();


const state = {
    callManagementList  : [],                           // 列表
    callManagementTotal : null,                         // 总页数
    callManagementPages : null,                         // 总页码
    callManagementSize  : 10,                           // 每页数量

};

const actions = {

    /**
     * 获取调用管理列表
     * @param store
     * @param obj
     * @returns {*}
     */
    getcallManagement(store,obj){
        return api.getCallManagement(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            data.data.forEach(v=>{
                v.newStatus = v.status == 0 ? '启用' : '停用'
                v.changeStatus = v.status == 0 ? true : false
                v.newCreateDate = `${new Date(v.createDate).getFullYear()}-${new Date(v.createDate).getMonth() + 1}-${new Date(v.createDate).getDate()}`
                v.newUpdateDate = `${new Date(v.updateDate).getFullYear()}-${new Date(v.updateDate).getMonth() + 1}-${new Date(v.updateDate).getDate()}`
            })
            let nd = data.data;
            store.commit("setCallManagementTotal",Number(data.total));
            store.commit("setCallManagementPages",data.pages);
            store.commit("setCallManagementList",nd||[]);
        }).catch((error)=>{
            v.$message({
                message: '获取调用管理列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 新增调用管理列表
     * @param store
     * @param obj
     * @returns {*}
     */
    addCallManagement(store,obj){
        return api.addCallManagement(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data
        }).catch((error)=>{
            v.$message({
                message: '新增调用管理列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 修改调用管理列表
     * @param store
     * @param obj
     * @returns {*}
     */
    editCallManagement(store,obj){
        return api.editCallManagement(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data
        }).catch((error)=>{
            v.$message({
                message: '修改调用管理列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取授权列表
     * @param store
     * @param obj
     * @returns {*}
     */
    authorizationCallManagement(store,obj) {
        return api.authorizationCallManagement(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取授权列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 授权
     * @param store
     * @param obj
     * @returns {*}
     */
    authorizationCall(store,obj) {
        return api.authorizationCall(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data
        }).catch((error)=>{
            v.$message({
                message: '授权失败',
                type: 'error'
            });
        })
    },

    /**
     * 解除授权
     * @param store
     * @param obj
     * @returns {*}
     */
    relieveCall(store,obj) {
        return api.relieveCall(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data;
        }).catch((error)=>{
            v.$message({
                message: '解除授权失败',
                type: 'error'
            });
        })
    },

    /**
     * 删除
     * @param store
     * @param obj
     * @returns {*}
     */
    deleteCallManage(store,obj) {
        return api.deleteCallManage(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '删除失败',
                type: 'error'
            });
        })
    },

    /**
     * 启用
     * @param store
     * @param obj
     * @returns {*}
     */
    enableApi(store,obj) {
        return api.enableApi(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '启用失败',
                type: 'error'
            });
        })
    },

    /**
     * 停用
     * @param store
     * @param obj
     * @returns {*}
     */
    prohibitApi(store,obj) {
        return api.prohibitApi(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data;
        }).catch((error)=>{
            v.$message({
                message: '停用失败',
                type: 'error'
            });
        })
    }

};

const mutations = {
    setCallManagementList(state,nv){
        state.callManagementList = nv;
    },
    setCallManagementTotal(state,nv){
        state.callManagementTotal = nv;
    },
    setCallManagementPages(state,nv){
        state.callManagementPages = nv;
    },

};


export default {
    state, mutations,actions
};