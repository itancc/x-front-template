import { createPinia } from "pinia";
import type { App } from "vue";


export const store = createPinia()

export function initStore(app: App<Element>): void {
  app.use(store)
}
