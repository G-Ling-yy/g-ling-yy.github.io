import api from '../api';
import Vue from 'vue';
import $http from "../filters/http";
let v = new Vue();                          //新创建一个vue实例


const state = {
    messageTotal        : 0,                // 总页数
    messageList         : [],               // 摄像机列表
    provinceTableData   : [],
    countryTotalData    : [],
    roadTableData       : [],

}

const actions = {

    /**
     * 消息中心分页查询
     * @param store
     * @param params
     * @returns {Promise<*>}
     */
    getMessageTotal(store,params){
        return api.getMessagePages(params).then((res)=>{
            return res
        });
    },

    /**
     * 消息中心分页查询
     * @param store
     * @param params
     * @returns {Promise<*>}
     */
    getMessagePages(store,params){
        return api.getMessagePages(params).then((res)=>{
            if(res.code === 200){
                store.commit('setMessageList',res.data);
                store.commit('setMessageTotal',res.total);
            };
            return res
        });
    },

    getReportDailyInfo(store,url){
        return $http.get(url).then(({ statusText, data }) => {
                return data;
            });
    },

    /**
     * 批量更新消息查看状态
     * @param store
     * @param params
     * @returns {Promise<*>}
     */
    putMessageStatus(store,params){
        return api.putMessageStatus(params).then((res)=>{
            return res
        });
    },



}

const mutations = {
    setMessageTotal(state,val){
        state.messageTotal = val;
    },
    setMessageList(state,val){
        state.messageList = val;
    },
    setProvinceTableData(state,val){
        state.provinceTableData = val;
    },
    setRoadTableData(state,val){
        state.roadTableData = val;
    },
}


export default {
    state, mutations,actions
}
