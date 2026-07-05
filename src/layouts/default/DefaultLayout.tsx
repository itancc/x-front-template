/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader'
import AppSidebar from './components/AppSidebar'
import RouteTabs from './components/RouteTabs'
import ThemeDrawer from './components/ThemeDrawer'

export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    return () => (
      <div class="app-shell">
        <AppSidebar />
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'auto auto minmax(0,1fr)',
            minWidth: 0,
          }}
        >
          <AppHeader />
          <RouteTabs />
          <main
            style={{
              minWidth: 0,
              padding: '20px 22px 28px',
              overflowY: 'auto',
            }}
          >
            <RouterView />
          </main>
        </div>
        <ThemeDrawer />
      </div>
    )
  },
})
