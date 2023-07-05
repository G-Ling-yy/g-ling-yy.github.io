import api from '../api';
import Vue from 'vue';

let v = new Vue();     //新创建一个vue实例


const state = {
    PBQueryInfo     : {},                           // 存放播放管理的查询条件
    PBTotal         : null,                         // 总页数
    PBPages         : null,                         // 总页码
    PBList          : [],                           // 播放管理机列表
    PBPageSize      : 10,                           // 每页展示数量
    PBDialogVisible : false,                        // 控制停止关闭弹窗可见

}

const actions = {



}

const mutations = {
    setPBQueryInfo(state,nv){
        state.PBQueryInfo = nv;
    },
    setPBTotal(state,nv){
        state.PBTotal = nv;
    },
    setPBPages(state,nv){
        state.PBPages = nv;
    },
    setPBList(state,nv){
        state.PBList = nv;
    },
    setPBPageSize(state,nv){
        state.PBPageSize = nv;
    },
    setPBDialogVisible(state,nv){
        state.PBDialogVisible = nv;
    },
}


export default {
    state, mutations,actions
}