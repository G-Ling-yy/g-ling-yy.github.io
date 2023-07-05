import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    EBTotal         : null,                       // 总页数
    EBPages         : null,                       // 总页码
    EBList          : [],                         // 申请列表
    EBPageSize      : 10,                         // 每页展示数量
    EBWatchVisible  : false,                      // 控制查看弹窗可见

}

const actions = {



}

const mutations = {
    setEBTotal(state,nv){
        state.EBTotal = nv;
    },
    setEBPages(state,nv){
        state.EBPages = nv;
    },
    setEBList(state,nv){
        state.EBList = nv;
    },
    setEBPageSize(state,nv){
        state.EBPageSize = nv;
    },
    setEBWatchVisible(state,nv){
        state.EBWatchVisible = nv;
    },
}


export default {
    state, mutations,actions
}