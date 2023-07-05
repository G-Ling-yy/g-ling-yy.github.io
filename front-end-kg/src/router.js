import Vue from 'vue'
import Router from 'vue-router'
//import store from './store'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const isNbtd = process.env.VUE_APP_TARGET === 'nbtd' // 南部通道(开发兼生产环境)

const router = new Router({
  //mode: 'history',
  // base: process.env.BASE_URL,
  linkActiveClass: 'active', //激活路由样式名
  routes: [
    {
      path: '/',
      redirect: 'auto-login'
    },
    {
      path: '/index', //正式版
      name: 'index',
      meta: {},
      component: () => import('./views/TrafficMap.vue')
    },
    {
      path: '/404',
      component: resolve =>
        require(['@/views/404.vue'], resolve),
      name: '',
      hidden: true
    },
    {
      path: '/403',
      component: resolve =>
        require(['@/views/403.vue'], resolve),
      name: '',
      hidden: true
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: resolve =>
        require(['@/views/redirect.vue'], resolve),
      meta: {}
    },
    {
      path: "/InspectionDialog",
      component: resolve => (require(["@/views/InspectionDialog.vue"], resolve)),
      name: "",
      hidden: true
    },
    {
      path: "/tongji",
      component: resolve => (require(["@/views/tongji.vue"], resolve)),
      name: "",
      hidden: true
    },
    // {
    //   path: "/screenshotStatistics",
    //   component: resolve => (require(["@/views/screenshotStatistics.vue"], resolve)),
    //   name: "截图统计",
    //   hidden: true
    // },

    {
      path: '/Examine',
      component: resolve =>
        require(['@/views/Examine.vue'], resolve),
      name: '',
      hidden: true
    },

    {
      path: '/U8GHjZl6qItE5f0/:code/',
      component: resolve =>
        require(['@/views/InterfaceLogin.vue'], resolve),
      name: '',
      hidden: true
    },
    // {
    //   path: "/szhIndex", //正式版
    //   name: "szhIndex",
    //   meta: {},
    //   component: resolve => (require(["@/views/szhTrafficMap.vue"], resolve))
    // },
    // {
    //   path: "/index", //苏交控版本
    //   name: "index",
    //   meta: {},
    //   component: resolve=>(require(["@/views/sjk/SJKMap"],resolve)),
    //   redirect: "/singleIndex",
    // },
    //////////////////////////////////////////////////////////////////////////
    ///////////        TODO: 宁沪三块屏
    //////////////////////////////////////////////////////////////////////////
    // {
    //   path: "/singleIndex", //宁沪三块屏
    //   name: "singleIndex",
    //   meta: {},
    //   component: resolve=>(require(["@/views/SingleMap.vue"],resolve)),
    // },
    // {
    //   path: "/cameraPlayer", //左屏
    //   name: "cameraPlayer",
    //   meta: {},
    //   component: resolve => (require(["@/components/screen/CameraPlayerSingle.vue"], resolve))
    // },
    // {
    //   path: "/cameraPlayerRight", //右屏
    //   name: "cameraPlayerRight",
    //   meta: {},
    //   component: resolve => (require(["@/components/screen/CameraPlayerSingleRight.vue"], resolve))
    // },
    //////////////////////////////////////////////////////////////////////////////////////////
    {
      path: '/main',
      name: '',
      meta: {},
      component: resolve =>
        require(['@/views/Main.vue'], resolve),
      children: [
        {
          path: '/dashboard',
          name: '控制台',
          meta: {},
          component: resolve =>
            require(['@/views/Dashboard'], resolve)
        },
        // {
        //   path: "/tableDemo",
        //   name: "表格示例",
        //   meta: {},
        //   component: resolve => (require(["@/views/TableDemo"], resolve))
        // },
        {
          path: '/StreamMediaDialog',
          name: '流媒体',
          component: resolve =>
            require([
              '@/components/module/StreamMedia/StreamMediaDialog.vue'
            ], resolve)
        },
        {
          path: '/deviceCameraManage',
          name: '摄像机管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/CameraManage/CameraManage.vue'
            ], resolve)
        },
        {
          path: '/styme',
          name: '个人信息（修改密码）',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/styme.vue'
            ], resolve)
        },
        {
          path: '/deviceGroupManage',
          name: '摄像机组管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/equipment/Index.vue'
            ], resolve)
        },
        // {
        //   path: "/borrow",
        //   name: "借阅审核",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/Borrow/borrow.vue"], resolve))
        // },
        {
          path: '/cameraAccess',
          name: '摄像机接入',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Access/cameraAccess.vue'
            ], resolve)
        },
        {
          path: '/systemCameraBox',
          name: '摄像机审核',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemCameraBox.vue'
            ], resolve)
        },
        {
          path: '/systemCameraBoxDetail',
          name: '设备组未通过详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemCameraBoxDetail.vue'
            ], resolve)
        },
        {
          path: '/systemCameraPassDetail',
          name: '设备组未通过详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemCameraPassDetail.vue'
            ], resolve)
        },
        {
          path: '/roadManager',
          name: '路线管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/line_management.vue'
            ], resolve)
        },
        {
          path: '/devicePlatformManage',
          name: '省平台管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Platform-manager/index.vue'
            ], resolve)
        },
        {
          path: '/openManage',
          name: '开放管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Open/OpenManager.vue'
            ], resolve)
        },
        {
          path: '/streamMediaManage',
          name: '流媒体管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/StreamMedia/StreamMediaManage.vue'
            ], resolve)
        },
        {
          path: '/systemUserRoleBind',
          name: '用户管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/styme.vue'
            ], resolve)
        },
        {
          //流媒体详情
          path: '/streamMediaManageDetail/:id',
          name: '流媒体详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/StreamMedia/StreamMediaManageDetail.vue'
            ], resolve)
        },
        {
          path: '/organizationManager',
          name: '组织机构管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/controlPlatform/OrganizationManager.vue'
            ], resolve)
        },
        {
          path: '/streamMediaManageDetail',
          name: '流媒体详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/StreamMedia/StreamMediaManageDetail.vue'
            ], resolve)
        },
        {
          path: '/cameraStatusDetection',
          name: '摄像机质量检测查询',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemCameraView'
            ], resolve)
        },
        {
          path: '/deviceTranscodingManage',
          name: '对接管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/controlPlatform/accessCenter.vue'
            ], resolve)
        },
        {
          path: '/systemUserOrganize',
          name: '组织与用户',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemUserOrganize.vue'
            ], resolve)
        },
        {
          path: '/systemOrgainUserDetail',
          name: '组织用户详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemOrgainUserDetail.vue'
            ], resolve)
        },
        {
          path: '/systemSetting',
          name: '系统设置',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/styme.vue'
            ], resolve)
        },
        {
          path: '/systemUserListDetail',
          name: '用户详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemUserListDetail'
            ], resolve)
        },
        {
          path: '/systemUserList',
          name: '用户列表',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemUserList.vue'
            ], resolve)
        },
        {
          path: '/systemPowerList',
          name: '权限列表',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemPowerList'
            ], resolve)
        },
        {
          path: '/systemRoleList',
          name: '角色列表',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemRoleList.vue'
            ], resolve)
        },
        {
          path: '/systemRoleListDetail',
          name: '角色详情',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemRoleListDetail'
            ], resolve)
        },
        {
          path: '/systemCameraView',
          name: '摄像机审核',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Detection/cameraStatusDetection'
            ], resolve)
        },
        {
          path: '/systemReportList',
          name: '运行日报',
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemReportList'
            ], resolve)
        },
        {
          path: '/systemReportDetail',
          name: '日报详情',
          component: resolve =>
            require([
              '@/components/module/SystemRole/systemReportDetail'
            ], resolve)
        },
        {
          path: '/openStatistics',
          name: '开放统计',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Statistics/Open'
            ], resolve)
        },
        {
          path: '/abnormalStatistics',
          name: '故障统计',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Statistics/Abnormal'
            ], resolve)
        },
        {
          path: '/cameraStatistics',
          name: '摄像机统计',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Statistics/Camera'
            ], resolve)
        },
        {
          path: '/transferStatistics',
          name: '调取统计',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/Statistics/Transfer'
            ], resolve)
        },
        /**
         * 日志管理
         * 操作日志和接口日志
         */
        {
          path: '/operationLog',
          name: '操作日志',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/logManage/operationLog'
            ], resolve)
        },
        {
          path: '/interfaceLog',
          name: '接口日志',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/logManage/interfaceLog'
            ], resolve)
        },
        {
          path: '/behaviorAudit',
          name: '行为审计',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/logManage/behaviorAudit'
            ], resolve)
        },
        {
          path: '/streamLog',
          name: '视频流状态日志',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/logManage/streamLog'
            ], resolve)
        },
        {
          path: '/eventAnalysis',
          name: '事件处理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/imageManage/eventAnalysis'
            ], resolve)
        },
        {
          path: '/screenshotManagement',
          name: '截图管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/imageManage/screenshotManagement'
            ], resolve)
        },

        // {
        //   path: "/videoManagement",
        //   name: "录像管理",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/imageManage/videoManagement"], resolve))
        // },
        {
          path: '/imageDetection',
          name: '图像质量管理',
          meta: {},
          component: resolve =>
            require([
              '@/components/module/imageManage/imageDetection'
            ], resolve)
        }
        // {
        //   path: "/sptCameraManage",
        //   name: "省平台摄像机管理",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptCameraManage"], resolve))
        // },
        // {
        //   path: "/sptCameraBox",
        //   name: "省平台摄像机审核",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptCameraBox"], resolve))
        // },
        // {
        //   path: "/sptGatewayManage",
        //   name: "网关管理",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptGatewayManage"], resolve))
        // },
        // {
        //   path: "/sptMonitorManage",
        //   name: "监控画面",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptMonitorManage"], resolve))
        // },
        // {
        //   path: "/sptLoanApplication",
        //   name: "借阅申请",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptLoanApplication"], resolve))
        // },
        // {
        //   path: "/sptFailureReport",
        //   name: "故障填报",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptFailureReport"], resolve))
        // },
        // {
        //   path: "/sptOrganizationManagement",
        //   name: "组织机构管理",
        //   meta: {},
        //   component: resolve => (require(["@/components/module/spt/sptOrganizationManagement"], resolve))
        // }
      ]
    },
    {
      path: '/index', //
      name: '首页',
      meta: {
        hideNav: true
      },
      component: resolve =>
        require(['@/views/TrafficMap.vue'], resolve)
      // component: () => import('./views/HW-LoginPage.vue')
    },
    {
      path: '/login', //登录页
      name: '登录',
      meta: {
        hideNav: true
      },
      component: () => import('./views/Login.vue')
      // component: () => import('./views/HW-LoginPage.vue') // 华为严选登录页
    },
    {
      path: '/auto-login', //判断跳转页
      name: 'judgeTo',
      meta: {
        hideNav: true
      },
      component: resolve =>
        require(['@/views/autoLogin.vue'], resolve)
      // component: () => import('./views/HW-LoginPage.vue') // 华为严选登录页
    },
    {
      path: '*',
      hidden: true,
      redirect: {
        path: '/index'
      }
    }
  ]
})
export default router
