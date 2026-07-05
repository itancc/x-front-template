/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../../../stores/auth'
import { usePermissionStore } from '../../../stores/permission'
import { useUiStore } from '../../../stores/ui'

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()
    const uiStore = useUiStore()

    const breadcrumbs = computed(() =>
      route.matched
        .filter((record) => record.meta.title)
        .map((record) => ({ title: String(record.meta.title), path: record.path })),
    )

    async function handleLogout() {
      permissionStore.reset(router)
      authStore.logout()
      await router.push('/login')
    }

    return () => (
      <header class="app-header">
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              color: 'var(--app-text-muted)',
              fontSize: '13px',
            }}
          >
            <RouterLink
              to="/dashboard"
              style={{ color: 'var(--app-accent-strong)', textDecoration: 'none' }}
            >
              工作台
            </RouterLink>
            {breadcrumbs.value.map((item) => (
              <span key={item.path}>/ {item.title}</span>
            ))}
          </div>
          <h1
            style={{
              margin: '6px 0 0',
              fontSize: '24px',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
            }}
          >
            {String(route.meta.title ?? '后台模板')}
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            class="toolbar-btn"
            onClick={() => uiStore.themeDrawerVisible = true}
          >
            主题
          </button>
          <button
            type="button"
            class="toolbar-btn"
            onClick={() => uiStore.toggleSidebarCollapsed()}
          >
            {uiStore.sidebarCollapsed ? '展开侧栏' : '收起侧栏'}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px 6px 6px',
              borderRadius: '999px',
              background: 'rgba(15,23,42,.04)',
            }}
          >
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--app-accent),#38bdf8)',
                color: '#04111f',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              {authStore.user?.avatar ?? 'U'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <strong style={{ fontSize: '13px' }}>
                {authStore.user?.name ?? '访客'}
              </strong>
              <span style={{ color: 'var(--app-text-muted)', fontSize: '12px' }}>
                {authStore.user?.role ?? '未登录'}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="toolbar-btn toolbar-btn-danger"
            onClick={handleLogout}
          >
            退出
          </button>
        </div>
      </header>
    )
  },
})
