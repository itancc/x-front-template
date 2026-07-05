import { createRouter, createWebHashHistory } from 'vue-router'
import { App } from 'vue'
import { setupBeforeEachGuard } from './guards/beforeEach'
import { setupAfterEachGuard } from './guards/afterEach'
import { baseRoutes } from './routes/base-route'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: baseRoutes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

export function initRouter(app: App<Element>) {
  setupBeforeEachGuard(router)
  setupAfterEachGuard(router)
  app.use(router)
}
