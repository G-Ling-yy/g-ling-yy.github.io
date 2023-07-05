/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'
import getPageTitle from '@/utils/pageTitle'
import {
  authentication,
  loginInterception,
  recordRoute,
  routesWhiteList
} from '@/config'

router.beforeEach(async (to, from, next) => {
  console.log('router.beforeEach to, from', to, from)

  let hasToken = store.getters['user/accessToken']

  // loginInterception: 是否开启登录拦截
  if (!loginInterception) hasToken = true

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles =
        store.getters['acl/admin'] ||
        store.getters['acl/role'].length > 0 ||
        store.getters['acl/ability'].length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          let loginResult
          if (loginInterception) {
            loginResult = await store.dispatch(
              'user/getUserInfo'
            )
          } else {
            // loginInterception为false（关闭登录拦截时）时，创建虚拟角色
            loginResult = await store.dispatch(
              'user/setVirtualRoles'
            )
          }

          let accessRoutes = []
          const removeRoutes = []
          if (authentication === 'intelligence') {
            accessRoutes = await store.dispatch(
              'routes/setRoutes'
            )
          } else if (authentication === 'all') {
            accessRoutes = await store.dispatch(
              'routes/setAllRoutes'
            )
          }
          accessRoutes.forEach(item => {
            removeRoutes.push(router.addRoute(item))
          })

          store.commit(
            'routes/setRemoveRoutes',
            removeRoutes
          )

          if (loginResult) {
            next({ ...to, replace: true })
          } else {
            store.commit('setAccessToken')
            next({ path: '/login', replace: true })
          }
        } catch {
          await store.dispatch('user/resetAll')
          if (recordRoute) {
            next({
              path: '/login',
              query: { redirect: to.path },
              replace: true
            })
          } else next({ path: '/login', replace: true })
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (recordRoute) {
        next({
          path: '/login',
          query: { redirect: to.path },
          replace: true
        })
      } else next({ path: '/login', replace: true })
    }
  }
})
router.afterEach(to => {
  document.title = getPageTitle(to.meta.title)
})
