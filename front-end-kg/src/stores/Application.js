import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    ABTotal         : null,                         // 总页数
    ABPages         : null,                         // 总页码
    ABList          : [],                           // 申请列表
    ABPageSize      : 10,                           // 每页展示数量
    ABDialogVisible : false,                        // 控制新增弹窗可见
    ABWatchVisible  : false,                        // 控制查看弹窗可见
}

const actions = {



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