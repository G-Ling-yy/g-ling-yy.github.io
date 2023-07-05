import api from '../api';
import Vue from 'vue';


let v = new Vue();     //新创建一个vue实例

const successCode = 200;

const state = {
    organizationList: [],
    organizationTreeData: [],
    organizationBindRoadsList: [],
    changeOrganizationFormVisible: false,
    roadBindVisible: false,
};

const actions = {

    /**
     * 获取组织架构列表
     * @param store
     * @param params
     * @returns {Promise<*>}
     */
    getOrganizationList(store, params) {
        return api.getOrg(params).then((data) => {
            if (data.code !== successCode) {
                v.$message({
                    message: '获取组织架构树失败222! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setOrganizationList", data.data);
            return data;
        })
    },

    /**
     * 获取组织架构列表
     * @param store
     * @param params
     * @returns {Promise<*>}
     */
    getOrganizationTopList(store, params) {
        return api.getOrgTop(params).then((data) => {
            if (data.code !== successCode) {
                v.$message({
                    message: '获取组织架构树失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setOrganizationTopList", data.data);
            return data;
        })
    },

    /**
     * 获取组织架构树
     * @param store
     * @param data
     * @returns {Promise<*>}
     */
    getOrganizationTreeData(store, data) {
        return api.getOrgTree(data).then((res) => {
            if (res.code !== successCode) {
                v.$message({
                    message: '获取组织架构树失败! [' + res.code + ']: ' + res.message,
                    type: 'error'
                });
                return Promise.reject();
            };

            store.commit("setOrganizationTreeData", res.data);
            return res;
        })
    },

    /**
     * 添加组织架构信息
     * @param store
     * @param data
     * @returns {Promise<*>}
     */
    addOrganization(store, data) {
        return api.addOrganization(data).then((res) => {
            if (res.code !== successCode) {
                v.$message({
                    message: '添加组织架构信息失败! [' + res.code + ']: ' + res.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return res;
        })
    },
    updateOrganization(store, data) {
        return api.updateOrganization(data).then((res) => {
            if (res.code !== successCode) {
                v.$message({
                    message: '编辑组织架构信息失败! [' + res.code + ']: ' + res.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return res;
        })
    },
    delOrganization(store, data) {
        return api.delOrganization(data).then((res) => {
            if (res.code !== successCode) {
                v.$message({
                    message: '删除组织架构信息失败! [' + res.code + ']: ' + res.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return res;
        })
    },

    /**
     * 组织架构绑定路线
     * @param store
     * @param data
     * @returns {Promise<*>}
     */
    bindRoadToOrganizationAction(store, data) {
        return api.bindRoadToOrganization(data).then((res) => {
            if (res.code !== successCode) {
                v.$message({
                    message: '组织架构绑定路线失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return res;
        })
    },

    /**
     * 获取组织架构绑定的路线
     * @param store
     * @param data
     * @returns {Promise<*>}
     */
    getBindRoadsByOrganizationAction(store, data) {
        return api.getBindRoadsByOrganization(data).then((result) => {
            if (result.code !== successCode) {
                v.$message({
                    message: '获取组织架构绑定的路线失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit('setOrganizationBindRoadsList', result.data);
            return result;
        })
    },

};

const mutations = {
    setOrganizationList(state, nv) {
        state.organizationList = nv;
    },
    setOrganizationTopList(state, nv) {
        console.log(state, nv)
        // state.organizationList = nv;
    },
    setOrganizationTreeData(state, nv) {
        state.organizationTreeData = nv;
    },
    setOrganizationFormVisible(state, nv) {
        state.changeOrganizationFormVisible = nv;
    },
    setRoadBindVisible(state, nv) {
        state.roadBindVisible = nv;
    },
    setOrganizationBindRoadsList(state, nv) {
        state.organizationBindRoadsList = nv;
    },

};


export default {
    state, mutations, actions
}
