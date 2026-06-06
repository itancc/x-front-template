import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'

import { fetchUserRouteConfig } from '../features/navigation/services/menu.service'
import type { DynamicMenuGroup } from '../router/async-routes'
import { prefetchAsyncRoutes, resolveAsyncRoute, type AsyncRouteKey } from '../router/async-routes'
import { runWhenIdle } from '../utils/runtime'

function collectPrefetchRouteKeys(menuGroups: DynamicMenuGroup[]): AsyncRouteKey[] {
  const keys = menuGroups
    .flatMap((group) => group.items)
    .sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER))
    .map((item) => item.routeKey)

  return [...new Set(keys)].filter((key) => key !== 'component-showcase').slice(0, 3)
}

function schedulePrefetch(routeKeys: AsyncRouteKey[]) {
  if (routeKeys.length === 0) {
    return
  }

  runWhenIdle(() => prefetchAsyncRoutes(routeKeys), {
    timeout: 1200,
    fallbackDelay: 300,
  })
}

export const usePermissionStore = defineStore('permission', () => {
  const routesInitialized = ref(false)
  const menuGroups = ref<DynamicMenuGroup[]>([])
  const dynamicRouteKeys = ref<AsyncRouteKey[]>([])

  function reset(router?: Router) {
    if (router) {
      dynamicRouteKeys.value.forEach((routeKey) => {
        const routeName = resolveAsyncRoute(routeKey).name
        if (typeof routeName === 'string' && router.hasRoute(routeName)) {
          router.removeRoute(routeName)
        }
      })
    }

    routesInitialized.value = false
    menuGroups.value = []
    dynamicRouteKeys.value = []
  }

  async function initializeRoutes(router: Router, permissions: string[]) {
    if (routesInitialized.value) {
      return
    }

    const { menuGroups: nextMenuGroups, routeKeys } = await fetchUserRouteConfig(permissions)

    routeKeys.forEach((routeKey) => {
      const route = resolveAsyncRoute(routeKey)
      const routeName = typeof route.name === 'string' ? route.name : undefined

      if (!routeName || router.hasRoute(routeName)) {
        return
      }

      router.addRoute('root', route)
    })

    menuGroups.value = nextMenuGroups
    dynamicRouteKeys.value = routeKeys
    routesInitialized.value = true

    schedulePrefetch(collectPrefetchRouteKeys(nextMenuGroups))
  }

  return {
    dynamicRouteKeys,
    initializeRoutes,
    menuGroups,
    reset,
    routesInitialized,
  }
})
