import { defineComponent } from 'vue'
import SidebarMenu from './SidebarMenu'
import GlobalComponent from './GlobalComponent'
import HeaderBar from './HeaderBar'
import PageContent from './PageContent'

export default defineComponent({
  name: 'ClassicLayout',
  setup() {
    return () => (
      <div class="w-screen h-screen">
        <aside id="app-sidebar">
          <SidebarMenu />
        </aside>

        <main id="app-main">
          <div id="app-header">
            <HeaderBar />
          </div>
          <div id="app-content">
            <PageContent />
          </div>
        </main>

        <div id="app-global">
          <GlobalComponent />
        </div>
      </div>
    )
  },
})
