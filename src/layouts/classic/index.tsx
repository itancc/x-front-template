import { defineComponent } from 'vue'
import { useUiStore } from '@/stores/ui'
import SidebarMenu from './SidebarMenu'
import GlobalComponent from './GlobalComponent'
import HeaderBar from './HeaderBar'
import PageContent from './PageContent'

export default defineComponent({
  name: 'XClassicLayout',
  setup() {
    const uiStore = useUiStore()

    return () => (
      <div class={['x-layout', uiStore.sidebarCollapsed && 'is-collapsed']}>
        <aside id="app-sidebar" class="x-layout__sidebar">
          <SidebarMenu />
        </aside>

        <main id="app-main" class="x-layout__main">
          <div id="app-header" class="x-layout__header">
            <HeaderBar />
          </div>
          <div id="app-content" class="x-layout__content">
            <PageContent />
          </div>
        </main>

        <div id="app-global" class="x-layout__global">
          <GlobalComponent />
        </div>
      </div>
    )
  },
})
