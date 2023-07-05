import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    ABTotal         : null,                         // 总页数
    ABPages         : null,                         // 总页码
    ABList          : [],                           // 申请列表
    ABPageSize      : 10,                           // 每页展示数量
    ABStatusCheck   : ['<span class="text-success">审批通过</span>','<span class="text-error">审批未通过</span>','','','','','','','','<span class="text-primary">待审批</span>'],

    ABDialogVisible : false,                        // 控制新增弹窗可见
    ABWatchVisible  : false,                        // 控制查看/审核弹窗可见

}

const actions = {

    /**
     * 我的申请列表查询
     * @param state
     * @param params
     * @returns {Promise<T>}
     */
    getCameraBrowsePages(state,params){
        return api.getCameraBrowsePages(params).then((res)=>{
            if(res && res.code !== 200){
                v.$message.error('查询我的申请列表失败，请稍后再试！ ['+res.code+']: '+res.message);
                return Promise.reject();
            };
            state.commit('setABList',res.data);
            state.commit("setABTotal",res.total);
            state.commit("setABPages",res.pages);
        })
    },

    /**
     * 审核列表
     * @param state
     * @param params
     * @returns {Promise<T>}
     */
    getCameraApplyPages(state,params){
        return api.getCameraApplyPages(params).then((res)=>{
            if(res && res.code !== 200){
                v.$message.error('查询列表数据失败，请稍后再试！ ['+res.code+']: '+res.message);
                return Promise.reject();
            };
            state.commit('setABList',res.data);
            state.commit("setABTotal",res.total);
            state.commit("setABPages",res.pages);
        })
    },

    /**
     * 申请
     * @param state
     * @param params
     * @returns {Promise<T>}
     */
    postCameraBrowseApply(state,params){
        return api.postCameraBrowseApply(params).then((res)=>{
            if(res && res.code !== 200){
                v.$message.error('新增申请失败，请稍后再试! ['+res.code+']: '+res.message);
                return Promise.reject();
            };
            return res;
        })
    },

    /**
     * 审核
     * @param state
     * @param params
     * @returns {Promise<T>}
     */
    postCameraBrowseVerify(state,params){
        return api.postCameraBrowseVerify(params).then((res)=>{
            if(res && res.code !== 200){
                v.$message.error('审核处理失败，请稍后再试！! ['+res.code+']: '+res.message);
                return Promise.reject();
            };
            return res;
        })
    },

}

const mutations = {
    setABTotal(state,nv){
        state.ABTotal = nv;
    },
    setABPages(state,nv){
        state.ABPages = nv;
    },
    setABList(state,nv){
        state.ABList = nv;
    },
    setABPageSize(state,nv){
        state.ABPageSize = nv;
    },
    setABDialogVisible(state,nv){
        state.ABDialogVisible = nv;
    },
    setABWatchVisible(state,nv){
        state.ABWatchVisible = nv;
    },
}


export default {
    state, mutations,actions
}
