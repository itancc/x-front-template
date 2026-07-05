import type { RouteRecordRaw } from 'vue-router'
import ClassicLayout from '@/layouts/classic/index'

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'crm-layout',
    component: ClassicLayout,
  },
]
