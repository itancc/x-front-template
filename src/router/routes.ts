import type { RouteRecordRaw } from 'vue-router'

const AppLayout = () => import('../layouts/default/DefaultLayout')
const LoginView = () => import('../features/auth/pages/LoginView')
const DashboardView = () => import('../features/dashboard/pages/DashboardView')
const ForbiddenView = () => import('../features/exception/pages/ForbiddenView')
const NotFoundView = () => import('../features/exception/pages/NotFoundView')

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: '登录',
      fullScreen: true,
      guestOnly: true,
    },
  },
  {
    path: '/',
    name: 'root',
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: { name: 'dashboard' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
          title: '工作台',
          requiresAuth: true,
          permission: 'dashboard:read',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/403',
    name: 'forbidden',
    component: ForbiddenView,
    meta: {
      title: '无权限',
      fullScreen: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: '页面不存在',
      fullScreen: true,
    },
  },
]