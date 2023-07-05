import api from '../api';
import Vue from 'vue';

let v = new Vue();

const state = {
    borrowingList   : [],                                   // 列表
    borrowingStatus : [                                     // 状态选择列表
                          { value : '9', label : '申请中' },
                          { value : '0', label : '已通过' },
                          { value : '1', label : '未通过' },
                          { value : '3', label : '已过期' }
                      ],
    borrowingTotal  : null,                                 // 总页数
    borrowingPages  : null,                                 // 总页码
    borrowingSize   : 10,                                   // 每页数量
    statusAggregate : {                                     // 状态枚举
                          0 : '已通过',
                          1 : '未通过',
                          3 : '已过期',
                          9 : '申请中'
                      }
};

const actions = {

    /**
     * 获取调用管理列表
     * @param store
     * @param obj
     * @returns {*}
     */
    getBorrowing(store,obj){
        return api.getBorrowing(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            store.commit("setBorrowingTotal",Number(data.total));
            store.commit("setBorrowingPages",data.pages);
            store.commit("setBorrowingList",data.data||[]);
        }).catch((error)=>{
            v.$message({
                message: '获取调用管理列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取组织架构
     * @param store
     * @param obj
     * @returns {*}
     */
    getBorrowTree(store,obj) {
        return api.getBorrowTree(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取组织架构失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取摄像机列表数据
     * @param store
     * @param obj
     * @returns {*}
     */
    getCameraData(store,obj) {
        return api.getCameraData(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取摄像机列表数据失败',
                type: 'error'
            });
        })
    },

    /**
     * 申请调阅
     * @param store
     * @param obj
     * @returns {*}
     */
    applyBrowse(store,obj) {
        return api.applyBrowse(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '申请调阅失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取调阅摄像机信息
     * @param store
     * @param obj
     * @returns {*}
     */
    seeCameraMsg(store,obj){
        return api.seeCameraMsg(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            store.commit("seeCameraData", data.data||[]);
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取调阅摄像机信息失败',
                type: 'error'
            });
        })
    },

    /**
     * 审批
     * @param store
     * @param obj
     * @returns {*}
     */
    approvalVerify(store,obj) {
        return api.approvalVerify(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '审批失败',
                type: 'error'
            });
        })
    },

};

const mutations = {
    setBorrowingList(state,nv){
        state.borrowingList = nv;
    },
    setBorrowingTotal(state,nv){
        state.borrowingTotal = nv;
    },
    setBorrowingPages(state,nv){
        state.borrowingPages = nv;
    },
    seeCameraData(state,nv){
        state.seeCameraDatas = nv;
    }

};


export default {
    state, mutations,actions
};