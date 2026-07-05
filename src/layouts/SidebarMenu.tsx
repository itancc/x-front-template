import { defineComponent, ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import './SidebarMenu.scss'

// --- Nav data ---------------------------------------------------------------
const starredItems: Array<{ key: string; label: string; icon: string; active?: boolean }> = [
  { key: 'ecommerce',   label: 'E-commerce',    icon: 'E' },
  { key: 'opps',        label: 'Opportunities', icon: 'O' },
  { key: 'contacts',    label: 'Contacts',      icon: 'C' },
  { key: 'customers',   label: 'Customers',     icon: 'K' },
  { key: 'users',       label: 'Users',         icon: 'U', active: true },
]

const userViews: Array<{ key: string; label: string; icon: string; create?: boolean }> = [
  { key: 'create',    label: 'Create View',                  icon: '+', create: true },
  { key: 'all',       label: 'All Users',                    icon: '-' },
  { key: 'paid',      label: 'Paid Users',                   icon: '$' },
  { key: 'sorted',    label: 'Sorted - by orders placed',    icon: '#' },
  { key: 'flagged',   label: 'Flagged Users',                icon: '!' },
  { key: 'cards',     label: 'User Profile Cards',           icon: '*' },
  { key: 'subtype',   label: 'Users - by subscription type', icon: '~' },
  { key: 'onboarded', label: 'Onboarded on',                 icon: '@' },
  { key: 'form',      label: 'Onboarding Form',              icon: '>' },
]

const activitiesItems: Array<{ key: string; label: string; icon: string }> = [
  { key: 'support',      label: 'Support Tickets', icon: 'S' },
  { key: 'orders',       label: 'Orders',          icon: 'O' },
  { key: 'products',     label: 'Products',        icon: 'P' },
  { key: 'interactions', label: 'Interactions',    icon: 'I' },
  { key: 'tasks',        label: 'Tasks',           icon: 'T' },
  { key: 'employees',    label: 'Employees',       icon: 'M' },
]

const basesItems: Array<{ key: string; label: string; icon: string }> = [
  { key: 'getting-started', label: 'Getting Started', icon: '>' },
]

export default defineComponent({
  name: 'SidebarMenu',
  setup() {
    const uiStore     = useUiStore()
    const starredOpen = ref(true)
    const usersOpen   = ref(true)
    const activOpen   = ref(true)
    const basesOpen   = ref(true)

    return () => {
      const collapsed = uiStore.sidebarCollapsed

      return (
        <aside class={['crm-sidebar', 'flex flex-col h-screen', collapsed && 'is-collapsed']}>

          {/* Brand */}
          <div class="flex items-center gap-2 px-3 py-3 flex-shrink-0">
            <div class="crm-sidebar__logo">C</div>
            {!collapsed && (
              <>
                <span class="crm-sidebar__brand-name">The CRM Company</span>
                <span class="crm-sidebar__brand-caret">v</span>
              </>
            )}
          </div>

          {/* Search */}
          {!collapsed && (
            <div class="px-2 mb-1">
              <div class="crm-sidebar__search">
                <span class="crm-sidebar__search-icon">Q</span>
                <span class="crm-sidebar__search-label">Search</span>
                <kbd class="crm-sidebar__search-kbd">Cmd K</kbd>
              </div>
            </div>
          )}

          {/* Quick links */}

          {/* Quick links */}
          {!collapsed && (
            <div class="px-2 flex flex-col gap-0.5 mb-1">
              {[
                { icon: 'N', label: 'Notifications' },
                { icon: 'T', label: 'Team & Settings' },
                { icon: '+', label: 'New Base' },
              ].map((q) => (
                <button key={q.label} type="button" class="crm-sidebar__quick-btn">
                  <span class="crm-sidebar__quick-icon">{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <nav class="crm-sidebar__nav flex-1 px-2 pb-2">

            {/* Starred section */}
            <div class="mb-1">
              {!collapsed && (
                <button
                  type="button"
                  class="crm-sidebar__section-btn"
                  onClick={() => (starredOpen.value = !starredOpen.value)}
                >
                  <span class="crm-sidebar__section-title">Starred</span>
                  <span class="crm-sidebar__caret">{starredOpen.value ? 'v' : '>'}</span>
                </button>
              )}
              {starredOpen.value && starredItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  class={['crm-sidebar__item', item.active && 'is-active']}
                >
                  <span class="crm-sidebar__item-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span class="crm-sidebar__item-label">{item.label}</span>
                      {item.active && <span class="crm-sidebar__item-caret">v</span>}
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Users sub-views */}
            {!collapsed && usersOpen.value && (
              <div class="crm-sidebar__subitems mb-1">
                {userViews.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    class={['crm-sidebar__subitem', v.create && 'is-create']}
                  >
                    <span class="crm-sidebar__subitem-icon">{v.icon}</span>
                    <span class="truncate">{v.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div class="crm-sidebar__divider" />

            {/* Activities section */}
            <div class="mb-1">
              {!collapsed && (
                <button
                  type="button"
                  class="crm-sidebar__section-btn"
                  onClick={() => (activOpen.value = !activOpen.value)}
                >
                  <span class="crm-sidebar__section-title">Activities</span>
                  <span class="crm-sidebar__caret">{activOpen.value ? 'v' : '>'}</span>
                </button>
              )}
              {activOpen.value && activitiesItems.map((item) => (
                <button key={item.key} type="button" class="crm-sidebar__item">
                  <span class="crm-sidebar__item-icon">{item.icon}</span>
                  {!collapsed && <span class="crm-sidebar__item-label">{item.label}</span>}
                </button>
              ))}
            </div>

            <div class="crm-sidebar__divider" />

            {/* Bases section */}
            <div class="mb-1">
              {!collapsed && (
                <button
                  type="button"
                  class="crm-sidebar__section-btn"
                  onClick={() => (basesOpen.value = !basesOpen.value)}
                >
                  <span class="crm-sidebar__section-title">Bases</span>
                  <span class="crm-sidebar__caret">{basesOpen.value ? 'v' : '>'}</span>
                </button>
              )}
              {basesOpen.value && basesItems.map((item) => (
                <button key={item.key} type="button" class="crm-sidebar__item">
                  <span class="crm-sidebar__item-icon">{item.icon}</span>
                  {!collapsed && <span class="crm-sidebar__item-label">{item.label}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div class="crm-sidebar__footer" onClick={() => uiStore.toggleSidebarCollapsed()}>
            <div class="crm-sidebar__avatar">R</div>
            {!collapsed && (
              <>
                <span class="crm-sidebar__user-name">Ryan George</span>
                <span class="crm-sidebar__footer-caret">v</span>
              </>
            )}
          </div>

        </aside>
      )
    }
  },
})
