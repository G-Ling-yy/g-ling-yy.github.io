/* 首页地图 区域类型对应点 */
export default {
  namespaced: true,

  state: {
    serviceArea: {}, // 服务区点数据
    tollStation: {}, // 收费站点数据
  },

  mutations: {
    setServiceArea(state, data) { /* 服务区 保存数据 */
      state.serviceArea[data.regionCode] = data.data
    },

    setTollStation(state, data) { /* 收费站 保存数据 */
      state.tollStation[data.regionCode] = data.data
    }
  }
}