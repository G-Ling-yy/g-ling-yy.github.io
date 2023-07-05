import api from '../api';
import Vue from 'vue';
let v = new Vue();     // 新创建一个vue实例

const state = {
  roleQueryInfo   : {},                           // 存放摄像机的查询条件
};

const actions = {
  getDashboardCountDataAction(store,obj){
    return api.getDashboardCountData().then((res)=>{
      if(res.code !== 200){
        v.$message({
          message: '获取调取统计信息失败! ['+res.code+']: '+res.message,
          type: 'error'
        });
        return Promise.reject();
      };
      return res
    })
  },
  getDashboardAccessDataAction(store,obj){
    return api.getDashboardAccessData().then((res)=>{
      if(res.code !== 200){
        v.$message({
          message: '获取权限列表失败! ['+res.code+']: '+res.message,
          type: 'error'
        });
        return Promise.reject();
      };
      return res
    })
  },
  playCount(store,obj){
    return api.playCount().then((res)=>{
      if(res.code !== 200){
        v.$message({
          message: '获取权限列表失败! ['+res.code+']: '+res.message,
          type: 'error'
        });
        return Promise.reject();
      };
      return res
    })
  },

};

const mutations = {
  setRoleQueryInfo(state,nv){
    state.roleQueryInfo = nv;
  },

};


export default {
  state, mutations,actions
}
