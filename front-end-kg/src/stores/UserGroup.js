import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    UGQueryInfo           : {},                             // 存放摄像机的查询条件
    UGTotal               : null,                           // 总页数
    UGPages               : null,                           // 总页码
    UGList                : [],                             // 摄像机列表
    UGPageSize            : 10,                             // 每页展示数量
    UGAddFormVisible      : false,                          // 控制新增摄像机组、编辑弹窗可见
    UGSelectDialogVisible : false,                          // 控制选择设备弹窗可见
    UGSelectTotal         : 1,                              // 选择设备总页数
    UGSelectPages         : 10,                             // 选择设备总页码
    UGSelectPageSize      : 10,                             // 选择设备每页展示数量
    UGSelectList          : [],                             // 选择设备列表
    UGADDialogVisible     : false,                          // 控制选择人员弹窗可见
    UGAddUserTotal        : 1,                              // 选择人员总页数
    UGAddUserPages        : 10,                             // 选择人员总页码
    UGAddUserPageSize     : 10,                             // 选择人员每页展示数量
    UGAddUserList         : [],                             // 选择人员列表
    UGDelDialogVisible    : false,                          // 控制删除用户组弹窗可见
    allUserList           : [],                             //用户列表
    allRoleList           : [],                             //
}

const actions = {

    /**
     * 获取摄像机列表
     * @param store
     * @param obj
     */
    getUserGroupList(store,obj){
        store.commit("setUGQueryInfo",obj);
        api.getUserGroupList(obj).then((data)=>{
            console.log(data);
            if(data && data.code!=200){
                v.$message({
                    message: '获取摄像机组列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setUGTotal",data.total);
            store.commit("setUGPages",data.pages);
            store.commit("setUGList",data.data||{});
        })
    },

    /**
     * 获取选择设备列表
     * @param store
     * @param obj
     */
    addDev(store,obj){
        api.addDev(obj).then((data)=>{
            console.log(data);
            if(data && data.code!=200){
                v.$message({
                    message: '获取设备列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
        })
    },
    /**
     * 获取用户列表
     */
    getAllUserList(store,obj){
        api.getAllGroupList(obj).then((res)=>{
            if(res && res.code!=200){
                v.$message({
                    message: '获取用户列表失败! ['+res.code+']: '+res.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            store.commit("setUserList",res.data||{});
        })
    },
    /**
     * 获取角色列表
     * 
     */
    getAllRoleList(store,obj){
        api.getRoleList(obj).then((res)=>{
            if(res && res.code!=200){
                v.$message({
                    message: '获取用户列表失败! ['+res.code+']: '+res.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            store.commit("setRoleList",res.data||{});
            console.log(res.data)
        })
    },
}

const mutations = {
    setUGQueryInfo(state,nv){
        state.UGQueryInfo = nv;
    },
    setUGTotal(state,nv){
        state.UGTotal = nv;
    },
    setUGPages(state,nv){
        state.UGPages = nv;
    },
    setUGList(state,nv){
        state.UGList = nv;
    },
    setUGPageSize(state,nv){
        state.UGPageSize = nv;
    },
    setUGAddFormVisible(state,nv){
        state.UGAddFormVisible = nv;
    },
    setUGSelectDialogVisible(state,nv){
        state.UGSelectDialogVisible = nv;
    },
    setUGADDialogVisible(state,nv){
        state.UGADDialogVisible = nv;
    },
    setUGDelDialogVisible(state,nv){
        state.UGDelDialogVisible = nv;
    },
    setUserList(state,nv){
        state.allUserList=nv
    },
    setRoleList(state,nv){
        state.allRoleList = nv;
    }
}


export default {
    state, mutations,actions
}
