import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'element-plus/dist/index.css'
import 'virtual:uno.css'

import App from './App.vue'
import { setupPermissionDirective } from './directives/permission'
import { router, setupRouterGuards } from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

setupRouterGuards(router, pinia)

app.use(pinia)
app.use(router)
setupPermissionDirective(app)
app.mount('#app')
