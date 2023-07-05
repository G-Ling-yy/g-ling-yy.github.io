import api from '../api'
import Vue from 'vue'

let v = new Vue()

const state = {
    accesslogByAppList  : [],                         // 列表
    accesslogByAppTotal : null,                       // 总页数
    accesslogByAppPages : null,                       // 总页码
    accesslogByAppSize  : 10                          // 每页数量
}

const actions = {

    /**
     * 获取访问记录
     * @param store
     * @param obj
     * @returns {*}
     */
    getAccesslogByAppList(store, obj) {
       obj.appType = "9";
      return api.getAccesslogByApp(obj)
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject()
          };
          let nd = data.data;

          store.commit('setAccesslogByAppTotal', Number(data.total))
          store.commit('setAccesslogByAppPages', data.pages)
          store.commit('setAccesslogByAppList', nd || [])
        }).catch(error => {
          v.$message({
            message: '获取访问记录失败',
            type: 'error'
          });
        });
    },

}

const mutations = {
  setAccesslogByAppList(state, nv) {
    state.accesslogByAppList = nv
  },
  setAccesslogByAppTotal(state, nv) {
    state.accesslogByAppTotal = nv
  },
  setAccesslogByAppPages(state, nv) {
    state.accesslogByAppPages = nv
  }
}

export default {
  state,
  mutations,
  actions
}
