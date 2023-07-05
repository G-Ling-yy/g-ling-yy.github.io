import apis from '@/api'

export default {
  state: () => ({
    // 归属路线
    belongingRoute: {
      api: 'getBelongingRoute',
      data: undefined
    },

    // 归属路线（指定传参 宿淮盐 orgId: ff80818159af9032015a1258ae5f001a）
    belongingRoute_shy: {
      api: 'getBelongingRoute',
      data: undefined
    },

    // 管辖单位
    jurisdictionUnit: {
      api: 'xx2',
      data: undefined
    }
  }),

  mutations: {
    setKeyData(state, payload) {
      state[payload.key].data = payload.data
    }
  },

  actions: {
    // 通过key获取常量数据
    getDataByKey: ({ commit, state }, key) => {
      const api = state[key].api

      /* 若 宿淮盐 的归属路线 单独处理 */
      if (key === 'belongingRoute_shy') {
        return apis.constData[api]({
          orgId: 'ff80818159af9032015a1258ae5f001a'
        }).then(res => {
          commit('setKeyData', {
            key,
            data: res.data.map(e => ({
              key: e.roadAttr,
              value: e.roadCode
            }))
          })
        })
      }

      return apis.constData[api]().then(res => {
        console.log('通过key获取常量数据 res', res, key)

        switch (key) {
          case 'belongingRoute':
            commit('setKeyData', {
              key,
              data: res.data.map(e => ({
                key: e.roadAttr,
                value: e.roadCode
              }))
            })
            break
          default:
            break
        }
      })
    },

    // 通过key检查常量 （无则自动请求获取数据）
    checkDataByKey: ({ dispatch, state }, key) => {
      if (state[key].data)
        return Promise.resolve(state[key].data)
      return dispatch('getDataByKey', key)
    }
  }
}
