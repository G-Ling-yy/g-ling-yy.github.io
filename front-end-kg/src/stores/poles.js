/* 首页地图 桩 */
export default {
  namespaced: true,

  state: {
    data: {
      all: null,
      hectometer: null,
      kilometer: null
    }
  },

  mutations: {
    setAllData(state, data) { // 桩all 保存数据
      state.data.all = data
    },

    setHectometerData(state, data) { // 桩hectometer 保存数据
      state.data.hectometer = data
    },

    setKilometerData(state, data) { // 桩kilometer 保存数据
      state.data.kilometer = data
    }
  }
}