import api from "../api";
import Vue from "vue";

let v = new Vue();

const state = {
  streamMediaTypeArr: [],
  streamMediaList: [], // 列表
  streamMediaTranscodingList: [],
  streamMediaTotal: null, // 总页数
  streamMediaPages: null, // 总页码
  streamMediaPageSize: 10, // 每页数量
  streamMediaDialogVisible: false,
  streamMediaBindDialogVisible: false,
};

const actions = {
  /**
   * 获取流媒体列表
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getStreamMediaList(store, obj) {
    return api.getStreamMediaList(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message: "获取流媒体列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      let nd = data;
      store.commit("setStreamMediaTotal", nd.total);
      store.commit("setStreamMediaPages", nd.pages);
      store.commit("setStreamMediaList", nd.data || []);
    });
  },

  /**
   * 获取流媒体信息
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getStreamMediaInfo(store, obj) {
    return api.getStreamMediaInfo(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message: "获取流媒体信息失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },

  /**
   * 获取流媒体绑定的视频上云网关
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getStreamMediaTranscodingList(store, obj) {
    return api.getStreamMediaTranscodingList(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message:
            "获取流媒体绑定的视频上云网关失败! [" +
            data.code +
            "]: " +
            data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },

  /**
   * 新增流媒体
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  addStreamMedia(store, obj) {
    return api.addStreamMedia(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message: "新增流媒体失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },

  /**
   * 更新流媒体
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  updateStreamMedia(store, obj) {
    return api.updateStreamMedia(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message: "更新流媒体失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },

  /**
   * 删除流媒体
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  deleteStreamMedia(store, obj) {
    return api.deleteStreamMedia(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message: "删除流媒体失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },

  /**
   * 绑定/解绑视频上云网关
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  bindStreamMedia(store, obj) {
    return api.bindStreamMedia(obj).then((data) => {
      if (data && data.code !== 200) {
        v.$message({
          message:
            "绑定/解绑视频上云网关失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },
};

const mutations = {
  setStreamMediaList(state, nv) {
    state.streamMediaList = nv;
  },
  setStreamMediaTranscodingList(state, nv) {
    state.streamMediaTranscodingList = nv;
  },
  setStreamMediaTotal(state, nv) {
    state.streamMediaTotal = nv;
  },
  setStreamMediaPages(state, nv) {
    state.streamMediaPages = nv;
  },

  setStreamMediaDialogVisible(state, nv) {
    state.streamMediaDialogVisible = nv;
  },

  setStreamMediaBindDialogVisible(state, nv) {
    state.streamMediaBindDialogVisible = nv;
  },

  setStreamMediaTypeArr(state, nv) {
    state.streamMediaTypeArr = nv;
  },
};

export default {
  state,
  mutations,
  actions,
};
