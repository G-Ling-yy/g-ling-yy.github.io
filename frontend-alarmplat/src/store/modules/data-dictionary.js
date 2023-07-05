import apis from '@/api'

export default {
  state: () => ({}),

  mutations: {
    setKeyDic(state, payload) {
      state[payload.key] = payload.dic
    }
  },

  actions: {
    // 通过key获取字典数据
    getDicByKey: ({ commit }, key) =>
      apis.dataDictionary
        .getInnerData({
          type: key
        })
        .then(res => {
          const dic = res.map(e => ({
            key: e.value,
            value: e.key
          }))
          commit('setKeyDic', {
            key,
            dic
          })
        }),

    // 通过key检查字典 （无则自动请求获取数据）
    checkDicByKey: ({ dispatch, state }, key) => {
      if (state[key]) return Promise.resolve(state[key])
      return dispatch('getDicByKey', key)
    }
  }
}
