/**
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */
import { getUserInfo, login, logout } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken
} from '@/utils/accessToken'
import { title, tokenName } from '@/config'
import { message, notification } from 'ant-design-vue'

const state = () => ({
  accessToken: getAccessToken(),
  avatar: '',
  username: '',
  userId: '',
  userSpecificInfo: null, // 用户特定信息数据
  userType: ''
})
const getters = {
  accessToken: state => state.accessToken,
  avatar: state => state.avatar,
  username: state => state.username,
  userId: state => state.userId,
  userSpecificInfo: state => state.userSpecificInfo,
  userType: state => state.userType
}
const mutations = {
  /**
   * @description 设置accessToken
   * @param {*} state
   * @param {*} accessToken
   */
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
  },
  /**
   * @description 设置id
   * @param {*} state
   * @param {*} userId
   */
  setUserId(state, userId) {
    state.userId = userId
  },
  /**
   * @description 设置特殊信息
   * @param {*} state
   * @param {*} userSpecificInfo
   */
  setUserSpecificInfo(state, userSpecificInfo) {
    state.userSpecificInfo = userSpecificInfo
  },
  /**
   * @description 设置type
   * @param {*} state
   * @param {*} userType
   */
  setUserType(state, userType) {
    state.userType = userType
  }
}
const actions = {
  /**
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setAvatar', '') // 设置头像图片
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    const data = await login(userInfo)

    // console.log('login data', data)

    if (!data.userSpecificInfo?.orgId) {
      message.error('用户异常，请联系管理员')
      return
    }

    // 处理qsId数据格式
    const qsIdObj = {
      ff80818159af9032015a12573ad50016: '宁杭',
      ff80818159af9032015a1258ae5f001a: '宿淮盐',
      ff80818159af9032015a12582dc50019: '东部',
      ff80818159af9032015a125267ee000e: '宁沪',
      ff80818169e0cdb2016a09f8f05600df: '南部通道'
    }
    data.userSpecificInfo.orgId =
      data.userSpecificInfo.orgId.split(',').map(e => {
        const value = e.trim(),
          key = qsIdObj[value]
        return {
          key,
          value
        }
      })

    // 本地设置一个字符串token
    const accessToken =
      data?.tokenName ||
      'src/store/modules/user.js-tokenStr'

    // 满足当前 前端框架逻辑可走通基础上 后端 登录接口顺带用户信息
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        ...data,
        username: data?.userName || 'username'
      })
    )

    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      notification.open({
        message: `欢迎登录${title}`,
        description: `${thisTime}！`
      })
    } else {
      message.error(
        `登录接口异常，未正确返回${tokenName}...`
      )
    }
  },
  /**
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch, state }) {
    const { data } = await getUserInfo(state.accessToken)
    if (!data) {
      message.error(`验证失败，请重新登录...`)
      return false
    }
    const {
      username,
      userId,
      userType,
      avatar,
      roles,
      ability,
      userSpecificInfo
    } = data

    if (username && roles && Array.isArray(roles)) {
      dispatch('acl/setRole', roles, { root: true })
      if (ability && ability.length > 0) {
        dispatch('acl/setAbility', ability, { root: true })
      }
      commit('setUsername', username)
      commit('setAvatar', avatar)
      commit('setUserId', userId)
      commit('setUserType', userType)
      commit('setUserSpecificInfo', userSpecificInfo)

      return true
    } else {
      message.error('用户信息接口异常')
    }
  },

  /**
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    const logoutResult = await logout(state.accessToken)
    console.log('logout logoutResult', logoutResult)
    await dispatch('resetAll')
  },
  /**
   * @description 重置accessToken、roles、ability、router等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ commit, dispatch }) {
    commit('routes/resetRoutes', '', { root: true })
    await dispatch('setAccessToken', '')
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setAbility', [], { root: true })
    removeAccessToken()
  },
  /**
   * @description 设置token
   */
  setAccessToken({ commit }, accessToken) {
    commit('setAccessToken', accessToken)
  }
}
export default { state, getters, mutations, actions }
