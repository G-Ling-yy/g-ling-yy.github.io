import api from "../api";
import Vue from "vue";

let v = new Vue(); //新创建一个vue实例

const state = {
  DGQueryInfo: {}, // 存放摄像机的查询条件
  DGTotal: null, // 总页数
  DGPages: null, // 总页码
  DGList: [], // 摄像机列表
  DGPageSize: 10, // 每页展示数量

  DGAddFormVisible: false, // 控制新增摄像机组、编辑弹窗可见
  DGSelectDialogVisible: false, // 控制选择设备弹窗可见
  DGSelectTotal: 1, // 选择设备总页数
  DGSelectPages: 10, // 选择设备总页码
  DGSelectPageSize: 10, // 选择设备每页展示数量
  DGSelectList: [], // 选择设备列表

  DGADDialogVisible: false, // 控制选择人员弹窗可见
  DGAddUserTotal: 1, // 选择人员总页数
  DGAddUserPages: 10, // 选择人员总页码
  DGAddUserPageSize: 10, // 选择人员每页展示数量
  DGAddUserList: [], // 选择人员列表

  DGCheckDevDialogVisible: false, // 控制已选择设备弹窗可见
  DGCheckDevList: [], // 查看已选择设备设备列表
  DGCheckDevTotal: null, // 查看已选择设备总页数
  DGCheckDevPages: null, // 查看已选择设备总页码
  DGCheckDevPageSize: 10, // 查看已选择设备每页展示数量

  DGCheckUserDialogVisible: false, // 控制已选择人员弹窗可见
  DGCheckUserList: [], // 查看已选择人员列表
  DGCheckUserTotal: null, // 查看已选择人员总页数
  DGCheckUserPages: null, // 查看已选择人员总页码
  DGCheckUserPageSize: 10, // 查看已选择人员每页展示数量
  DGDelDialogVisible: false, // 控制删除用户组弹窗可见
};

const actions = {
  /**
   * 获取摄像机组列表
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getDeviceGroupList(store, obj) {
    store.commit("setDGQueryInfo", obj);
    return api.getDeviceGroupList(obj).then((data) => {
      console.log(data);
      if (data.code != 200) {
        v.$message({
          message: "获取摄像机组列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGTotal", data.total);
      store.commit("setDGPages", data.totalPages);
      store.commit("setDGList", data.data);
      return data;
    });
  },

  /**
   * 获取选择设备列表
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getGroupCameraList(store, obj) {
    return api.getGroupCameraList(obj).then((data) => {
      console.log(data);
      if (data.code != 200) {
        v.$message({
          message: "获取设备列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGSelectTotal", data.total);
      store.commit("setDGSelectPages", data.pages);
      store.commit("setDGSelectList", data.data);
      return data;
    });
  },

  /**
   * 获取选择人员列表
   * @param store
   * @param obj
   */
  getGroupUserList(store, obj) {
    api.getGroupUserList(obj).then((data) => {
      console.log(data);
      if (data.code != 200) {
        v.$message({
          message: "获取人员列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGAddUserTotal", data.total);
      store.commit("setDGAddUserPages", data.pages);
      store.commit("setDGAddUserList", data.data);
    });
  },

  /**
   * 新建/编辑摄像机组
   * @param store
   * @param obj
   */
  addDeviceGroup(store, obj) {
    api.addDeviceGroup(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        v.$message({
          message: "编辑摄像机组失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGAddFormVisible", false);
      store.dispatch("getDeviceGroupList", store.state.DGQueryInfo);
    });
  },

  /**
   * 删除摄像机组
   * @param store
   * @param obj
   */
  deleteDeviceGroup(store, obj) {
    api.deleteDeviceGroup(obj).then((data) => {
      if (data.code != 2000) {
        v.$message({
          message: "删除摄像机组失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      v.$message({
        message: "删除摄像机组成功",
        type: "success",
      });
      store.commit("setDGDelDialogVisible", false);
      store.dispatch("getDeviceGroupList", store.state.DGQueryInfo);
    });
  },

  /**
   * 查看设备
   * @param store
   * @param obj
   */
  checkDev(store, obj) {
    api.checkDev(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        v.$message({
          message: "获取设备列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGCheckDevTotal", data.data.totalSize);
      store.commit("setDGCheckDevPages", data.data.totalPages);
      store.commit("setDGCheckDevList", data.data.content);
    });
  },

  /**
   * 选择设备
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  addDev(store, obj) {
    return api.addDev(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        v.$message({
          message: "添加设备失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGSelectDialogVisible", false);
      store.dispatch("getDeviceGroupList", store.state.DGQueryInfo);
      v.$message({
        message: "添加设备成功",
        type: "success",
      });
    });
  },

  /**
   * 获取人员列表
   * @param store
   * @param obj
   */
  checkUser(store, obj) {
    api.checkUser(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        v.$message({
          message: "获取人员列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGCheckUserTotal", data.data.totalSize);
      store.commit("setDGCheckUserPages", data.data.totalPages);
      store.commit("setDGCheckUserList", data.data.content);
    });
  },

  /**
   * 删除组设备
   * @param store
   * @param obj
   */
  delGroupDev(store, obj) {
    api.delGroupDev(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        v.$message({
          message: "删除设备失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGCheckDevDialogVisible", false);
      store.dispatch("getDeviceGroupList", store.state.DGQueryInfo);
      v.$message({
        message: "删除设备成功",
        type: "success",
      });
    });
  },

  /**
   * 删除人员
   * @param store
   * @param obj
   */
  delGroupUser(store, obj) {
    api.delGroupUser(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        vconsole.$message({
          message: "修改人员列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGCheckUserDialogVisible", false);
      store.dispatch("getDeviceGroupList", store.state.DGQueryInfo);
      v.$message({
        message: "修改人员列表成功",
        type: "success",
      });
    });
  },

  /**
   * 添加人员
   * @param store
   * @param obj
   */
  addUser(store, obj) {
    api.addUser(obj).then((data) => {
      console.log(data);
      if (data.code != 2000) {
        v.$message({
          message: "添加人员失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setDGADDialogVisible", false);
      store.dispatch("getDeviceGroupList", store.state.DGQueryInfo);
      v.$message({
        message: "添加人员成功",
        type: "success",
      });
    });
  },

  /**
   * 摄像机组导出
   * @param store
   * @param obj
   */
  exportGroupList(store, obj) {
    api
      .exportGroupList(obj)
      .then((data) => {
        var blob = new Blob([data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "摄像机组管理信息表.xls"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      })
      .catch((error) => {
        v.$message({
          message: "表格导出失败! ",
          type: "error",
        });
      });
  },
};

const mutations = {
  setDGQueryInfo(state, nv) {
    state.DGQueryInfo = nv;
  },
  setDGTotal(state, nv) {
    state.DGTotal = nv;
  },
  setDGPages(state, nv) {
    state.DGPages = nv;
  },
  setDGList(state, nv) {
    state.DGList = nv;
  },
  setDGPageSize(state, nv) {
    state.DGPageSize = nv;
  },
  setDGAddFormVisible(state, nv) {
    state.DGAddFormVisible = nv;
  },
  setDGSelectDialogVisible(state, nv) {
    state.DGSelectDialogVisible = nv;
  },
  setDGADDialogVisible(state, nv) {
    state.DGADDialogVisible = nv;
  },
  setDGAddUserTotal(state, nv) {
    state.DGAddUserTotal = nv;
  },
  setDGAddUserPages(state, nv) {
    state.DGAddUserPages = nv;
  },
  setDGAddUserPageSize(state, nv) {
    state.DGAddUserPageSize = nv;
  },
  setDGAddUserList(state, nv) {
    state.DGAddUserList = nv;
  },
  setDGDelDialogVisible(state, nv) {
    state.DGDelDialogVisible = nv;
  },
  setDGSelectList(state, nv) {
    state.DGSelectList = nv;
  },
  setDGSelectTotal(state, nv) {
    state.DGSelectTotal = nv;
  },
  setDGSelectPages(state, nv) {
    state.DGSelectPages = nv;
  },
  setDGCheckDevDialogVisible(state, nv) {
    state.DGCheckDevDialogVisible = nv;
  },
  setDGCheckDevList(state, nv) {
    state.DGCheckDevList = nv;
  },
  setDGCheckDevTotal(state, nv) {
    state.DGCheckDevTotal = nv;
  },
  setDGCheckDevPages(state, nv) {
    state.DGCheckDevPages = nv;
  },
  setDGCheckDevPageSize(state, nv) {
    state.DGCheckDevPageSize = nv;
  },
  setDGCheckUserDialogVisible(state, nv) {
    state.DGCheckUserDialogVisible = nv;
  },
  setDGCheckUserList(state, nv) {
    state.DGCheckUserList = nv;
  },
  setDGCheckUserTotal(state, nv) {
    state.DGCheckUserTotal = nv;
  },
  setDGCheckUserPages(state, nv) {
    state.DGCheckUserPages = nv;
  },
  setDGCheckUserPageSize(state, nv) {
    state.DGCheckUserPageSize = nv;
  },
};

export default {
  state,
  mutations,
  actions,
};
