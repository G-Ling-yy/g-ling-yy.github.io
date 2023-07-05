import api from '../api'
import Vue from 'vue'

let v = new Vue()

const state = {
    accesslogByUrlList    : [],                         // 列表
    accesslogByUrlTotal   : null,                       // 总页数
    accesslogByUrlPages   : null,                       // 总页码
    accesslogByUrlSize    : 10                          // 每页数量
}

const actions = {

    /**
     * 获取访问记录
     * @param store
     * @param obj
     * @returns {*}
     */
    getAccesslogByUrlList(store, obj) {
      return api
        .getAccesslogByUrl(obj)
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject()
          }
          let nd = data.data;
          store.commit('setaccesslogByUrlTotal', Number(data.total))
          store.commit('setaccesslogByUrlPages', data.pages)
          store.commit('setaccesslogByUrlList', nd || [])
        })
        .catch(error => {
          v.$message({
            message: '获取访问记录失败',
            type: 'error'
          })
        })
    },

    /**
     * 视频上云网关导出
     * @param store
     * @param obj
     */
    exportAccesslogList(store, obj) {
      api.exportAccesslog(obj)
        .then(data => {
          var blob = new Blob([data], { type: 'application/vnd.ms-excel' });     //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob);           // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '调用日志信息.csv';          // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click();                               // 点击下载
          document.body.removeChild(downloadElement);            // 下载完成移除元素
          window.URL.revokeObjectURL(href);                      // 释放掉blob对象
        })
        .catch(error => {
          v.$message({
            message: '调用日志信息导出失败!',
            type: 'error'
          });
        })
    },
}

const mutations = {
  setaccesslogByUrlList(state, nv) {
    state.accesslogByUrlList = nv
  },
  setaccesslogByUrlTotal(state, nv) {
    state.accesslogByUrlTotal = nv
  },
  setaccesslogByUrlPages(state, nv) {
    state.accesslogByUrlPages = nv
  }
}

export default {
  state,
  mutations,
  actions
}
