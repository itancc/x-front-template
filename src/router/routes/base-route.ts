import type { RouteRecordRaw } from 'vue-router'
import ClassicLayout from '@/layouts/index'

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: ClassicLayout,
    meta: {
      guestOnly: true,
    },
    children: [

    ]
  },
]
