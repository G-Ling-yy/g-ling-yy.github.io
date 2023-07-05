import api from "../api";
import Vue from "vue";

let v = new Vue(); // 新创建一个vue实例

const state = {
  roleQueryInfo: {}, // 存放摄像机的查询条件
  roleTotal: null, // 总页数
  rolePages: null, // 总页码
  roleSumList: [], // 摄像机总列表
  roleBaseList: [], // 权限基础数据，用于查询比对
  roleList: [], // 摄像机展示列表
  rolePageSize: 10, // 每页展示数量
  roleCurrentPage: 1, // 当前页码
  roleName: "", // 模糊查询角色名称
  status: null, // 模糊查询角色状态
  updateDate: "", // 模糊查询创建日期

  roleAddFormVisible: false, // 控制新增角色弹窗
  roleBindPowerVisible: false, // 控制角色绑定权限弹窗
  rolePowerTreeList: [], // 角色绑定接口列表
  rolePowerCheckTree: [], // 角色已绑定接口列表
};

const actions = {
  /**
   * 获取权限列表
   * @param store
   * @param obj
   */
  getPowerList(store, obj) {
    api.getPowerList().then((data) => {
      if (data.code != 200) {
        v.$message({
          message: "获取权限列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });

        return Promise.reject();
      }
      store.commit("setRolePowerTreeList", data.data);
    });
  },

  /**
   * 获取角色绑定列表
   * @param store
   * @param obj
   */
  getRoleList(store, obj) {
    return api.getRoleList(obj).then((data) => {
      console.log("data=>", data);
      if (data.code != 200) {
        v.$message({
          message: "获取角色列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setRoleSumList", data.data || {});
      store.commit("setRoleBaseList", data.data || {});
      store.dispatch("queryRoleList", "");

      store.commit(
        "setRolePages",
        Math.ceil(data.data.length / store.state.rolePageSize)
      );
      store.commit("setRoleTotal", data.data.length);
      return data;
    });
  },

  /**
   * 新增/编辑角色列表
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  addOrEditRole(store, obj) {
    let titleType = obj.title;
    delete obj.title;
    if (titleType == "修改") {
      return api.editRole(obj).then((data) => {
        if (data.code !== 200) {
          v.$message({
            message:
              titleType + "角色失败! [" + data.code + "]: " + data.message,
            type: "error",
          });
          return Promise.reject();
        }

        //store.commit("setRoleAddFormVisible",false);
        //store.dispatch("getRoleList",store.state.DGQueryInfo);
        // v.$message({
        //     message: titleType + '角色成功',
        //     type: 'success'
        // });
        return data;
      });
    } else {
      return api.addRole(obj).then((data) => {
        if (data.code !== 200) {
          v.$message({
            message:
              titleType + "角色失败! [" + data.code + "]: " + data.message,
            type: "error",
          });
          return Promise.reject();
        }
        return data;
      });
    }
  },

  /**
   * 角色已绑定权限接口查询
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getChoseList(store, obj) {
    return api.getChoseListByAllRole(obj).then((data) => {
      // console.log(data, "已绑定的权限");
      if (data.code != 200) {
        v.$message({
          message: "获取用户权限列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setRolePowerCheckTree", data.data[obj.roleCode] || []);
    });
  },

  /**
   * 筛选数据
   * @param store
   */
  queryRoleList(store) {
    let newData = [];
    newData = store.state.roleBaseList.filter((val) => {
      let date = new Date(val.createDate).getTime();
      if (
        (!store.state.roleName ||
          (val.roleName + "").indexOf(store.state.roleName) >= 0) &&
        (!store.state.status || val.status === store.state.status) &&
        (!store.state.updateDate ||
          (date >= store.state.updateDate[0] &&
            date <= store.state.updateDate[1]))
      ) {
        return val;
      }
    });

    store.commit(
      "setRolePages",
      Math.ceil(newData.length / store.state.rolePageSize)
    );
    store.commit("setRoleTotal", newData.length);
    store.commit("setRoleSumList", newData);

    let end = store.state.rolePageSize * store.state.roleCurrentPage;
    let start = end - store.state.rolePageSize;
    let list = newData.slice(start, end);
    store.commit("setRoleList", list);
    //store.commit("setRoleList",newData);
  },

  /**
   * 角色绑定/解绑权限接口
   * @param store
   * @param obj
   */
  roleAddPower(store, obj) {
    api.roleAddPower(obj).then((data) => {
      if (data.code != 200) {
        v.$message({
          message: "角色绑定权限失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }

      store.commit("setRoleBindPowerVisible", false);
      v.$message({
        message: "角色绑定权限成功",
        type: "success",
      });
    });
  },

  changeRoleStateMore(store, obj) {
    let a = api;
    return a.editRoleStateMore(obj).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "角色状态修改失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },

  deleteRoleAction(store, obj) {
    return api.deleteRole(obj).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "角色删除失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },
  
  deleteUnbindGroups(store, obj) {
    return api.deleteUnbindGroups(obj).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "角色删除失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return data;
    });
  },
};

const mutations = {
  setRoleQueryInfo(state, nv) {
    state.roleQueryInfo = nv;
  },
  setRoleTotal(state, nv) {
    state.roleTotal = nv;
  },
  setRolePages(state, nv) {
    state.rolePages = nv;
  },
  setRoleSumList(state, nv) {
    state.roleSumList = nv;
  },
  setRoleBaseList(state, nv) {
    state.roleBaseList = nv;
  },
  setRoleList(state, nv) {
    state.roleList = nv;
  },
  setRoleFullList(state, nv) {
    state.roleFullList = nv;
  },
  setRolePageSize(state, nv) {
    state.rolePageSize = nv;
  },
  setRoleCurrentPage(state, nv) {
    state.roleCurrentPage = nv;
  },
  setRoleAddFormVisible(state, nv) {
    state.roleAddFormVisible = nv;
  },
  setRoleBindPowerVisible(state, nv) {
    state.roleBindPowerVisible = nv;
  },
  setRolePowerTreeList(state, nv) {
    state.rolePowerTreeList = nv;
  },
  setRolePowerCheckTree(state, nv) {
    state.rolePowerCheckTree = nv;
  },
};

export default {
  state,
  mutations,
  actions,
};
