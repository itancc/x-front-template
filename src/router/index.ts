import type { Pinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { usePermissionStore } from '../stores/permission'
import { setHttpUnauthorizedHandler } from '../services/http/client'
import { useUiStore } from '../stores/ui'
import { appRoutes } from './routes'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: appRoutes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

export function setupRouterGuards(appRouter = router, pinia: Pinia) {
  setHttpUnauthorizedHandler(async () => {
    const authStore = useAuthStore(pinia)
    const currentPath = appRouter.currentRoute.value.fullPath

    authStore.logout()

    if (currentPath !== '/login') {
      await appRouter.push({ path: '/login', query: { redirect: currentPath } })
    }
  })

  appRouter.beforeEach(async (to) => {
    const authStore = useAuthStore(pinia)
    const permissionStore = usePermissionStore(pinia)
    const uiStore = useUiStore(pinia)

    const documentTitle = to.meta.title ? `${to.meta.title} - X Front Template` : 'X Front Template'
    if (typeof document !== 'undefined') {
      document.title = documentTitle
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return { path: typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard' }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    if (authStore.isAuthenticated && !permissionStore.routesInitialized) {
      await permissionStore.initializeRoutes(appRouter, authStore.user?.permissions ?? [])
      return {
        path: to.fullPath,
        replace: true,
      }
    }

    if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
      return { path: '/403', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresAuth && !to.meta.fullScreen) {
      uiStore.addVisitedView(to)
    }

    return true
  })
}
