/* eslint-disable */
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  }
]
const asyncRoutes = [
    {
      path: '/',
      redirect: '/home/index',
      meta: {
        icon: '',
        title: ''
      },
      hidden: true
    },

    // home
    {
      path: '/home',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      // hidden: true,
      children: [
        {
          path: 'index',
          name: 'home',
          component: () => import('@/views/home'),
          meta: {
            title: '实时路况',
            icon: 'road-map-line'
          }
        }
      ]
    },

    // 实时标定
    {
      path: '/realtimecalibrate',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      // hidden: true,
      children: [
        {
          path: 'index',
          name: 'realtimeCalibrate',
          component: () =>
            import('@/views/realtimecalibrate'),
          meta: {
            title: '实时标定',
            icon: 'pencil-ruler-line'
          }
        }
      ]
    },

    // 历史数据
    {
      path: '/historydata',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      children: [
        {
          path: 'index',
          name: 'historyData',
          component: () => import('@/views/historydata'),
          meta: {
            title: '历史数据',
            icon: 'history-line'
          }
        }
      ]
    },

    // 自然报警
    {
      path: '/alertorigin',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      children: [
        {
          path: 'index',
          name: 'alertOrigin',
          component: () => import('@/views/alertorigin'),
          meta: {
            title: '自然报警',
            icon: 'alarm-warning-line'
          }
        }
      ]
    },

    // 样本库
    {
      path: '/sample',
      component: Layout,
      meta: {
        title: '样本库',
        icon: 'test-tube-line'
      },
      alwaysShow: true,
      children: [
        // 样本标注
        {
          path: 'picturemark',
          name: 'pictureMark',
          component: () =>
            import('@/views/sample/picturemark'),
          meta: {
            title: '样本标注',
            icon: 'focus-3-line'
          }
        },
        // 样本管理
        {
          path: 'aialgorithm',
          name: 'aiAlgorithm',
          component: () =>
            import('@/views/sample/aialgorithm'),
          meta: {
            title: '样本管理',
            icon: 'image-line'
          }
        }
      ]
    },

    // 统计分析
    {
      path: '/statisticsanalysis',
      component: Layout,
      meta: {
        title: '统计分析',
        icon: 'bubble-chart-line'
      },
      alwaysShow: true,
      children: [
        // 宿淮盐6月poc图表
        {
          path: 'chart4(June)',
          name: 'statisticsAnalysisChart4June',
          component: () =>
            import(
              '@/views/statisticsanalysis/chart4(June)'
            ),
          meta: {
            title: '宿淮盐6月poc图表',
            icon: 'bar-chart-line'
            // icon: 'line-chart-line'
          }
        },

        // 自然报警分析图表
        {
          path: 'chart4',
          name: 'statisticsAnalysisChart4',
          component: () =>
            import('@/views/statisticsanalysis/chart4'),
          meta: {
            title: '自然报警分析图表',
            icon: 'bar-chart-line'
          }
        },

        // 路段报警分析
        {
          path: 'roadalarm',
          name: 'roadAlarm',
          component: () =>
            import('@/views/statisticsanalysis/roadalarm'),
          meta: {
            title: '路段报警分析',
            icon: 'barricade-line'
          }
        },

        // 业务检出分析
        {
          path: 'dataexport',
          name: 'dataExport',
          component: () =>
            import('@/views/statisticsanalysis/dataexport'),
          meta: {
            title: '业务检出分析',
            icon: 'file-excel-2-line'
          }
        },

        // 业务报警溯源
        {
          path: 'tracealarmsource',
          name: 'traceAlarmsource',
          component: () =>
            import(
              '@/views/statisticsanalysis/tracealarmsource'
            ),
          meta: {
            title: '业务报警溯源',
            icon: 'open-source-line'
          }
        },

        // 人工治理数据统计
        {
          path: 'calibratedata',
          name: 'calibrateData',
          component: () =>
            import(
              '@/views/statisticsanalysis/calibratedata'
            ),
          meta: {
            title: '人工治理数据统计',
            icon: 'contrast-2-line'
          }
        }
      ]
    },

    // 系统信息
    {
      path: '/system',
      component: Layout,
      meta: {
        title: '系统信息',
        icon: 'dashboard-fill'
      },
      alwaysShow: true,
      children: [
        // 摄像机管理
        {
          path: 'cameramanagement',
          name: 'cameraManagement',
          component: () =>
            import(
              '@/views/devicemanagement/cameramanagement'
            ),
          meta: {
            title: '摄像机管理',
            icon: 'vidicon-2-line'
          }
        },

        // 数据字典
        {
          path: 'datadictionary',
          name: 'dataDictionary',
          component: () => import('@/views/datadictionary'),
          meta: {
            title: '数据字典',
            icon: 'book-mark-line'
          }
        },

        // 操作日志
        {
          path: 'operationslog',
          name: 'operationsLog',
          component: () => import('@/views/operationslog'),
          meta: {
            title: '操作日志',
            icon: 'file-paper-2-line'
          }
        },

        //报警报表
        {
          path: 'reportform',
          name: 'reportForm',
          component: () => import('@/views/reportform'),
          meta: {
            title: '报警报表',
            icon: 'file-chart-line'
          }
        }
      ]
    }
  ],
  // 路公司专属路由（原 宿淮盐专属路由）
  roadCorpAsyncRoutes = [
    {
      path: '/',
      redirect: '/realtimecalibrate/index',
      meta: {
        icon: '',
        title: ''
      },
      hidden: true
    },

    {
      path: '/realtimecalibrate',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      // hidden: true,
      children: [
        {
          path: 'index',
          name: 'realtimeCalibrate',
          component: () =>
            import('@/views/realtimecalibrate'),
          meta: {
            title: '实时标定',
            icon: 'timer-flash-line'
          }
        }
      ]
    },

    {
      path: '/historydata',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      children: [
        {
          path: 'index',
          name: 'historyData',
          component: () => import('@/views/historydata'),
          meta: {
            title: '历史数据',
            icon: 'history-line'
          }
        }
      ]
    },

    {
      path: '/statisticsanalysis',
      component: Layout,
      meta: {
        title: '统计分析',
        icon: 'bubble-chart-line'
      },
      alwaysShow: true,
      children: [
        // 业务检出分析
        {
          path: 'dataexport',
          name: 'dataExport',
          component: () =>
            import('@/views/statisticsanalysis/dataexport'),
          meta: {
            title: '业务检出分析',
            icon: 'file-excel-2-line'
          }
        }
      ]
    }
  ],
  // 现宿淮盐专属路由
  shyRoadCorpAsyncRoutes = [
    {
      path: '/',
      redirect: '/realtimecalibrate/index',
      meta: {
        icon: '',
        title: ''
      },
      hidden: true
    },

    {
      path: '/realtimecalibrate',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      // hidden: true,
      children: [
        {
          path: 'index',
          name: 'realtimeCalibrate',
          component: () =>
            import('@/views/realtimecalibrate'),
          meta: {
            title: '实时标定',
            icon: 'timer-flash-line'
          }
        }
      ]
    },

    {
      path: '/historydata',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      children: [
        {
          path: 'index',
          name: 'historyData',
          component: () => import('@/views/historydata'),
          meta: {
            title: '历史数据',
            icon: 'history-line'
          }
        }
      ]
    }
  ],
  // 厂商专属路由
  corpAsyncRoutes = [
    {
      path: '/',
      redirect: '/alertorigin/index',
      meta: {
        icon: '',
        title: ''
      },
      hidden: true
    },

    {
      path: '/alertorigin',
      redirect: '/alertorigin/index',
      component: Layout,
      meta: {
        title: '',
        icon: ''
      },
      children: [
        {
          path: 'index',
          name: 'alertOrigin',
          component: () => import('@/views/alertorigin'),
          meta: {
            title: '自然报警',
            icon: 'database-2-line'
          }
        }
      ]
    }
  ],
  // 公司框架自带demo演示路由
  demoAsyncRoutes = [
    {
      path: '/index',
      component: Layout,
      meta: {
        title: '首页',
        icon: 'home-4-line'
        // affix: true
      },
      children: [
        {
          path: '',
          name: 'Index',
          component: () => import('@/views/index'),
          meta: {
            title: '首页',
            icon: 'home-4-line'
            // affix: true
          }
        }
      ]
    },

    {
      path: '/map',
      name: 'map',
      component: () =>
        import('@/views/domo/microvideo/map/Demo'),
      meta: {
        title: '地图',
        icon: 'remixicon-line'
      }
    },

    {
      path: '/domo',
      component: Layout,
      redirect: '/domo/table',
      alwaysShow: true,
      meta: {
        title: '组件',
        icon: 'apps-line'
      },
      children: [
        {
          path: 'table',
          name: 'Table',
          component: () => import('@/views/domo/table'),
          meta: {
            title: '表格',
            icon: 'table-2'
          }
        },
        {
          path: 'modal',
          name: 'Modal',
          component: () => import('@/views/domo/modal'),
          meta: {
            title: '弹窗',
            icon: 'table-2'
          }
        },
        {
          path: 'form',
          name: 'form',
          component: () => import('@/views/domo/form'),
          meta: {
            title: '表单',
            icon: 'remixicon-line'
          }
        },
        {
          path: 'upload',
          name: 'upload',
          component: () => import('@/views/domo/upload'),
          meta: {
            title: '上传',
            icon: 'remixicon-line'
          }
        },
        {
          path: 'im',
          name: 'im',
          component: () =>
            import('@/views/domo/microvideo/im/Demo.vue'),
          meta: {
            title: '即时通讯',
            icon: 'remixicon-line'
          }
        }
      ]
    },

    {
      path: '/test',
      component: Layout,
      redirect: '/test/test',
      meta: {
        title: '入职测试',
        icon: 'test-tube-line'
      },
      children: [
        {
          path: 'test',
          name: 'Test',
          component: () => import('@/views/test'),
          meta: {
            title: '入职DEMO',
            icon: 'test-tube-line'
          }
        }
      ]
    },

    {
      path: '/error',
      name: 'Error',
      component: Layout,
      redirect: '/error/403',
      meta: {
        title: '错误页',
        icon: 'error-warning-line'
      },
      children: [
        {
          path: '403',
          name: 'Error403',
          component: () => import('@/views/403'),
          meta: {
            title: '403',
            icon: 'error-warning-line'
          }
        },
        {
          path: '404',
          name: 'Error404',
          component: () => import('@/views/404'),
          meta: {
            title: '404',
            icon: 'error-warning-line'
          }
        }
      ]
    }
  ]

// 仅开发时加入demo示例,
if (process.env.NODE_ENV === 'development' && 1 > 2) {
  asyncRoutes.push(...demoAsyncRoutes)
}

/* eslint-disable */
// 兜底路由
;[
  asyncRoutes,
  roadCorpAsyncRoutes,
  shyRoadCorpAsyncRoutes,
  corpAsyncRoutes
].forEach(routes => {
  routes.push({
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
  })
})
/* eslint-enable */

export {
  asyncRoutes,
  roadCorpAsyncRoutes,
  shyRoadCorpAsyncRoutes,
  corpAsyncRoutes
}
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
