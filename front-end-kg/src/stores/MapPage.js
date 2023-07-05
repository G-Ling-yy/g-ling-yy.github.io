import api from '../api';
import Vue from 'vue';
import $http from "../filters/http";

let v = new Vue();       // 新创建一个vue实例


const state = {


}

const actions = {

    /**
     * 路段图层初始化
     * @param store
     * @param params
     * @returns {Promise<*>}
     */
    maplevelInitialize(store,params){
        return api.maplevelInitialize(params).then((res)=>{
            return res
        });
    },

}

const mutations = {

}


export default {
    state, mutations,actions
}
