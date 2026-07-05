/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUiStore } from '../../../stores/ui'

export default defineComponent({
  name: 'RouteTabs',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const uiStore = useUiStore()

    const tabs = computed(() => uiStore.visitedTabs)

    async function closeTab(path: string) {
      const isActive = route.path === path
      uiStore.removeVisitedView(path)

      if (!isActive) return

      const remaining = uiStore.visitedTabs.filter((tab) => tab.path !== path)
      const nextTab = remaining.at(-1)
      await router.push(nextTab?.path ?? '/dashboard')
    }

    return () => (
      <section
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '14px 22px 0',
          overflowX: 'auto',
          borderBottom: '1px solid var(--app-border)',
        }}
      >
        {tabs.value.map((tab) => (
          <button
            key={tab.path}
            type="button"
            class={['route-tab', route.path === tab.path && 'route-tab-active']}
            onClick={() => router.push(tab.path)}
          >
            <span>{tab.title}</span>
            {!tab.affix && (
              <i
                style={{
                  fontStyle: 'normal',
                  color: 'var(--app-text-muted)',
                  fontSize: '12px',
                  lineHeight: 1,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  void closeTab(tab.path)
                }}
              >
                ×
              </i>
            )}
          </button>
        ))}
      </section>
    )
  },
})
