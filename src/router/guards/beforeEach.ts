import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import { store } from '@/stores'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

export function setupBeforeEachGuard(router: Router): void {
  router.beforeEach(
    async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const authStore = useAuthStore(store)
      const permissionStore = usePermissionStore(store)
      console.log(to.meta,'itancc')
      if (to.meta.guestOnly) {
        next()
        return
      }

      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({
          path: '/',
          query: {
            redirect: to.fullPath,
          },
        })
        return
      }

      if (authStore.isAuthenticated && !permissionStore.routesInitialized) {
        await permissionStore.initializeRoutes(router, authStore.user?.permissions ?? [])
        next({
          ...to,
          replace: true,
        })
        return
      }

      if (to.meta.permission && !authStore.hasPermission(String(to.meta.permission))) {
        next('/403')
        return
      }

      next()
    },
  )
}
