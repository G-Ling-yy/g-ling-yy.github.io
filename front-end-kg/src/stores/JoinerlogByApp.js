import api from '../api'
import Vue from 'vue'

let v = new Vue()

const state = {
  joinerlogByAppList  : [],                       // 列表
  joinerlogByAppTotal : null,                     // 总页数
  joinerlogByAppPages : null,                     // 总页码
  joinerlogByAppSize  : 10                        // 每页数量
}

const actions = {

  /**
   * 获取访问记录
   * @param store
   * @param obj
   * @returns {*}
   */
  getJoinerlogByAppList(store, obj) {
    obj.appType = "2"; 
    return api.getJoinerlogByApp(obj)
      .then(data => {
        if (data.code !== 200) {
          return Promise.reject()
        }
        let nd = data.data
        store.commit('setJoinerlogByAppTotal', Number(data.total))
        store.commit('setJoinerlogByAppPages', data.pages)
        store.commit('setJoinerlogByAppList', nd || [])
      })
      .catch(error => {
        v.$message({
          message: '获取访问记录失败',
          type: 'error'
        })
      })
  },


}

const mutations = {
  setJoinerlogByAppList(state, nv) {
    state.joinerlogByAppList = nv
  },
  setJoinerlogByAppTotal(state, nv) {
    state.joinerlogByAppTotal = nv
  },
  setJoinerlogByAppPages(state, nv) {
    state.joinerlogByAppPages = nv
  }
}

export default {
  state,
  mutations,
  actions
}
