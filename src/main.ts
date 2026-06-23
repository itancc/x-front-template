import { createApp } from 'vue'
import App from './App.vue'

import 'virtual:uno.css'
import '@styles/index.scss'

import { initStore } from "@/stores"
import { initRouter } from "@/router"
import { setupGlobDirectives } from '@/directives'

const app = createApp(App)

initStore(app)
initRouter(app)
setupGlobDirectives(app)

app.mount('#app')


