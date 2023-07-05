import request from '@/utils/request'
import { tokenName } from '@/config'

/* eslint no-unused-vars: off */
const fake = apiStr =>
  new Promise(resolve => {
    const userInfoStr =
        localStorage.getItem('userInfo') || '',
      userInfo = JSON.parse(userInfoStr),
      {
        username,
        userId,
        userSpecificInfo,
        userType,
        orgId
      } = userInfo

    const data = {
      login: {
        code: 200,
        data: null,
        msg: '登录成功！',
        success: true
      },

      userInfo: {
        code: 200,
        data: {
          ability: ['READ'],
          avatar:
            'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
          roles: ['admin'],
          username,
          userId,
          userSpecificInfo,
          userType,
          orgId
        },
        msg: '登录成功！',
        success: true
      },

      logout: {
        code: 200,
        data: null,
        msg: 'success',
        success: true
      }
    }[apiStr]
    setTimeout(() => {
      resolve(data)
    }, 300)
  })

export async function login(data) {
  return request({
    url: '/login/sign',
    method: 'post',
    data
  })
  // return fake('login')
}

export async function socialLogin(data) {
  return request({
    url: '/socialLogin',
    method: 'post',
    data
  })
}

export function getUserInfo(accessToken) {
  // 此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  // return request({
  //   url: '/userInfo',
  //   method: 'post',
  //   data: {
  //     [tokenName]: accessToken
  //   }
  // })
  return fake('userInfo')
}

export function logout() {
  // return request({
  //   url: '/logout',
  //   method: 'post'
  // })
  return fake('logout')
}

export function register() {
  return request({
    url: '/register',
    method: 'post'
  })
}
