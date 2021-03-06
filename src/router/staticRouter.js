/* 静态页面路由 */
const staticRouter = [
  {
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/AppLogin')
  }, {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/AppRegister')
  }, {
    path: '/',
    menu: true,
    name: 'layout',
    component: () => import('@/views/layout/TheLayout'),
    children: [
      {
        path: '/index',
        name: 'index',
        title: '首页',
        icon: 'el-icon-s-home',
        component: () => import('@/views/pages/PageHome')
      }, {
        path: '/interface',
        name: 'interface',
        title: '接口测试',
        icon: 'el-icon-cpu',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/interface/interface',
            name: 'interface',
            title: '接口管理',
            component: () => import('@/views/pages/interface/PageInterface')
          },
          {
            path: '/interface/ifcase',
            name: 'ifcase',
            title: '用例管理',
            component: () => import('@/views/pages/interface/PageIfcase')
          }
        ]
      }, {
        path: '/level1',
        name: 'level1',
        title: 'WEB测试',
        icon: 'el-icon-eleme',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/level1/level2',
            name: 'level2',
            title: '二级目录',
            component: () => import('@/views/layout/TheLayoutEmpty'),
            children: [
              {
                path: '/level1/level2/level3',
                name: 'level3',
                title: '三级目录',
                component: () => import('@/views/layout/TheLayoutEmpty'),
                children: [
                  {
                    path: '/level1/level2/level3/level4',
                    name: 'level4',
                    title: '四级目录',
                    component: () => import('@/views/pages/PageLevel4')
                  }, {
                    path: '/level1/level2/level3/level4/:id',
                    name: 'level4Detail',
                    title: '四级目录详情',
                    component: () => import('@/views/pages/PageLevel4Detail'),
                    noMenu: true,
                    meta: {
                      menuPath: '/level1/level2/level3/level4'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }, {
        path: '/setting',
        name: 'setting',
        title: '系统设置',
        icon: 'el-icon-setting',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/setting/project',
            name: 'project',
            title: '项目管理',
            component: () => import('@/views/pages/setting/PageProject')
          },
          {
            path: '/setting/system',
            name: 'system',
            title: '子系统管理',
            component: () => import('@/views/pages/setting/PageSystem')
          },
          {
            path: '/setting/eve',
            name: 'env',
            title: '环境配置',
            component: () => import('@/views/pages/setting/PageEnv')
          }
        ]
      }, {
        path: '/schedule',
        name: 'Schedule',
        title: '定时任务',
        icon: 'el-icon-alarm-clock',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/schedule/jobmgr',
            name: 'jobmgr',
            title: '定时任务',
            component: () => import('@/views/pages/schedule/PageSchedule')
          },
          {
            path: '/schedule/result',
            name: 'result',
            title: '测试结果',
            component: () => import('@/views/pages/schedule/PageResult')
          }
        ]
      }, {
        path: '/user',
        name: 'user',
        title: '个人设置',
        icon: 'el-icon-s-custom',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/user/password',
            name: 'userPassword',
            title: '修改密码',
            component: () => import('@/views/pages/user/PageUserPassword')
          }
        ]
      }, {
        path: '/factory',
        name: 'factory',
        title: '资源管理',
        icon: 'el-icon-files',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/user/password',
            name: 'userPassword',
            title: '数据工厂',
            component: () => import('@/views/pages/user/PageUserPassword')
          }, {
            path: '/user/password',
            name: 'userPassword',
            title: '文件上传',
            component: () => import('@/views/pages/user/PageUserPassword')
          }
        ]
      }
    ]
  }, {
    path: '/error/403',
    name: 'error403',
    component: () => import('@/views/error/AppError403')
  }, {
    path: '/error/500',
    name: 'error500',
    component: () => import('@/views/error/AppError500')
  }, {
    path: '*',
    name: 'error404',
    component: () => import('@/views/error/AppError404')
  }
]

export default staticRouter
