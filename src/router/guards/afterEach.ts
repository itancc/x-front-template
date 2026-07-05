import type { Router } from 'vue-router'
import { store } from '@/stores'
import { useUiStore } from '@/stores/ui'

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  router.afterEach((to) => {
    const uiStore = useUiStore(store)
    uiStore.addVisitedView(to)
  })
}
