/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import {
  asyncRoutes,
  constantRoutes,
  corpAsyncRoutes, // 厂商专属路由
  roadCorpAsyncRoutes, // 路公司专属路由（原 宿淮盐专属路由）
  shyRoadCorpAsyncRoutes // 现宿淮盐专属路由
} from '@/router'
import { getRouterList } from '@/api/router'
import { convertRouter, filterRoutes } from '@/utils/routes'
import { userConfig } from '@/config'

const state = () => ({
  routes: [],
  partialRoutes: [],
  removeRoutes: []
})
const getters = {
  routes: state => state.routes,
  partialRoutes: state => state.partialRoutes
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = routes
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes
  },

  // 记录添加路由的删除
  setRemoveRoutes(state, removeRoutes) {
    state.removeRoutes = removeRoutes
  },

  // 重置routes
  resetRoutes(state) {
    state.removeRoutes.forEach(removeRoute =>
      removeRoute?.()
    )
  }
}
const actions = {
  /**
   * @description intelligence模式设置路由
   * @param {*} { commit }
   * @returns
   */
  async setRoutes({ commit, rootState }) {
    // 满足shy用户指定菜单需求，根据用户userType 1 or 2判断
    // 新增厂商判断 userType: 1 admin , 2 roadCorp, 3 corp
    let finallyRoutes
    switch (true) {
      // 超管路由
      case rootState.user.userType ==
        userConfig.userType.admin:
        finallyRoutes = filterRoutes([
          ...constantRoutes,
          ...asyncRoutes
        ])
        break
      // 路公司路由
      case rootState.user.userType ==
        userConfig.userType.roadCorp:
        finallyRoutes = filterRoutes([
          ...constantRoutes,
          ...roadCorpAsyncRoutes
        ])
        break
      // 宿淮盐路公司路由
      case rootState.user.userType ==
        userConfig.userType.shyRoadCorp:
        finallyRoutes = filterRoutes([
          ...constantRoutes,
          ...shyRoadCorpAsyncRoutes
        ])
        break
      // 厂商路由
      case rootState.user.userType ==
        userConfig.userType.corp:
        finallyRoutes = filterRoutes([
          ...constantRoutes,
          ...corpAsyncRoutes
        ])
        break
      default:
        break
    }

    commit('setRoutes', finallyRoutes)
    return [...finallyRoutes]
  },
  /**
   * @description all模式设置路由
   * @param {*} { commit }
   * @returns
   */
  async setAllRoutes({ commit }) {
    const { data } = await getRouterList()
    if (data[data.length - 1].path !== '/:pathMatch(.*)') {
      data.push({
        path: '/:pathMatch(.*)',
        redirect: '/404',
        hidden: true
      })
    }
    const asyncRoutes = convertRouter(data)
    const finallyRoutes = filterRoutes([
      ...constantRoutes,
      ...asyncRoutes
    ])
    commit('setRoutes', finallyRoutes)
    return [...asyncRoutes]
  },
  /**
   * @description 画廊布局、综合布局设置路由
   * @param {*} { commit }
   * @param accessedRoutes 画廊布局、综合布局设置路由
   */
  setPartialRoutes({ commit }, accessedRoutes) {
    commit('setPartialRoutes', accessedRoutes)
  }
}
export default { state, getters, mutations, actions }
