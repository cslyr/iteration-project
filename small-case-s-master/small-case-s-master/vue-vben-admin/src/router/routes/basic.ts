import type { AppRouteRecordRaw } from '/@/router/types'
import { REDIRECT_NAME, LAYOUT, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

// 工作台
export const WORKPLACE_ROUTE: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/workbench',
  meta: {
    orderNo: 10,
    icon: 'ant-design:home-outlined',
    title: '首页',
  },
  children: [
    {
      path: 'workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {
        title: '工作台',
      },
    },
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        // affix: true,
        title: '分析页',
      },
    },
  ],
}

// 工作台 （无子菜单）
// export const WORKPLACE_ROUTE: AppRouteRecordRaw = {
//   path: '/dashboard',
//   name: 'Dashboard',
//   // component: ()=>import('/@/views/dashboard/dashboard.vue'),
//   component: LAYOUT,
//   redirect: '/dashboard/workbench',
//   meta: {
//     orderNo: 10,
//     icon: 'ion:grid-outline',
//     title: t('routes.dashboard.workbench'),
//     hideChildrenInMenu: true,
//     currentActiveMenu: '/dashboard',
//     hideBreadcrumb: true,
//   },
//   children: [
//     {
//       path: 'workbench',
//       name: 'Workbench',
//       component: () => import('/@/views/dashboard/workbench/index.vue'),
//       meta: {
//         title: t('routes.dashboard.workbench'),
//         hideBreadcrumb: true,
//         hideMenu: true,
//       },
//     },
//   ],
// }

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}

// 需要新开窗口的配置
// export const NEW_WINDOW_ROUTE: AppRouteRecordRaw = {
//   path: '/update',
//   component: LAYOUT,
//   name: 'Update',
//   meta: {
//     title: '更新',
//     hideMenu: true,
//   },
//   children: [
//     {
//       path: 'updateTest',
//       name: '更新页面',
//       component: () => import('/@/views/test/test1/test1.vue'),
//       meta: {
//         title: '更新',
//         hideBreadcrumb: true,
//       },
//     },
//   ],
// }

// 重定向页面（用户刷新）
export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('/@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
}
