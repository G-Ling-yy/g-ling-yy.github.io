/*
 * 系统用户信息处理
 */
import api from "../api";
import Vue from "vue";

let v = new Vue(); //新创建一个vue实例

const state = {
  changeUserRolesFormVisible: false, // 权限编辑弹窗是否可见

  sysUserQueryInfo: {}, // 存放摄像机的查询条件
  sysUserTotal: null, // 总页数
  sysUserPages: null, // 总页码
  sysUserSumList: [], // 摄像机总列表
  sysUserList: [], // 用户列表
  sysUserPageSize: 10, // 每页展示数量
  sysUserCurrentPage: 1, // 当前页码
  sysUserInfo: {},
};

const actions = {
  /**
   * 获取用户列表
   * @param store
   * @param obj
   */
  getSysUserList(store, obj) {
    return api.getSysUserByOrg(obj).then((data) => {
      console.log(data, "获取用户列表");
      if (data.code != 200) {
        v.$message({
          message: "获取用户失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      store.commit("setSysUserTotal", data.total);
      store.commit("setSysUserPages", data.pages);
      store.commit("setSysUserList", data.data);
      return data;
    });
  },

  /**
   * 根据用户Id查询角色集合
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  getUserRolesByUserId(store, obj) {
    return api.getUserRolesByUserId(obj);
  },

  /**
   * 用户名重复验证
   * @param store
   * @param account
   * @returns {Q.Promise<any> | Q.Promise<T> | Thenable<any> | * | PromiseLike<T> | Promise<T>}
   */
  userAccountCheckAction(store, account) {
    return api.userAccountCheck(account).then((res) => {
      if (res.code !== 200) {
        v.$message({
          message: "修改角色权限失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      return res;
    });
  },

  /**
   * 新增用户
   * @param store
   * @param obj
   * @returns {Q.Promise<any> | Q.Promise<T> | Thenable<any> | * | PromiseLike<T> | Promise<T>}
   */
  addUserAction(store, obj) {
    //
    return api.userAddRole(obj).then((data) => {
      // // console.log(data);
      if (data.code !== 200) {
        v.$message({
          message: "添加用户失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      // store.commit("setRoleCurrentPage",1);
      /*store.commit("setRoleAddList", false);
            v.$message({
                message: "添加用户成功",
                type: "success",
            });*/
      return data;
    }); /*.catch((error)=>{

            })*/
  },
  /**
   * 修改用户
   * @param store
   * @param obj
   * @returns {Q.Promise<any> | Q.Promise<T> | Thenable<any> | * | PromiseLike<T> | Promise<T>}
   */
  editUserAction(store, obj) {
    return api.editUserById(obj).then((data) => {
      // // console.log(data);
      if (data.code !== 200) {
        v.$message({
          message: "修改个人信息失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }
      /* store.commit("setRoleAddList", false);
            v.$message({
                message: "修改用户成功",
                type: "success",
            });*/
      return data;
    }); /*.catch((error)=>{

            })*/
  },

  /**
   * 修改角色权限
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  editUserRoles(store, obj) {
    let dataIndex = obj.dataIndex;
    delete obj.dataIndex;
    delete obj.userName;

    return api.editUserRole(obj).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "修改角色权限失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }

      let list = state.sysUserList;
      list[dataIndex].userStatus = obj.status;

      store.commit("editUserRoles", list);
      return data;
    });
  },

  changePwdAction(store, obj) {
    return api.changePwd(obj).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "修改密码失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }

      return data;
    });
  },
};

const mutations = {
  setChangeUserRolesFormVisible(state, nv) {
    state.changeUserRolesFormVisible = nv;
  },
  setSysUserTotal(state, nv) {
    state.sysUserTotal = parseInt(nv);
  },
  setSysUserPages(state, nv) {
    state.sysUserPages = parseInt(nv);
  },
  setSysUserList(state, nv) {
    state.sysUserList = nv;
  },
  setSysUserInfo(state, nv) {
    state.sysUserInfo = nv;
  },
  editUserRoles(state, nv) {
    state.sysUserList = nv;
  },
};

export default {
  state,
  mutations,
  actions,
};
