/// <reference types="vue/jsx" />
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

import { getEnabledAppSpaces, getAppSpaceById } from '../../../config/app-spaces'
import { useUiStore } from '../../../stores/ui'

export default defineComponent({
  name: 'AppSwitcher',
  setup() {
    const uiStore = useUiStore()
    const open = ref(false)
    const dropdownRef = ref<HTMLDivElement>()

    const spaces = getEnabledAppSpaces()

    const activeSpace = () => getAppSpaceById(uiStore.activeAppId) ?? spaces[0]

    function toggle() {
      open.value = !open.value
    }

    function selectApp(id: string) {
      uiStore.setActiveApp(id)
      open.value = false
    }

    function handleOutside(e: MouseEvent) {
      if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        open.value = false
      }
    }

    onMounted(() => document.addEventListener('click', handleOutside))
    onBeforeUnmount(() => document.removeEventListener('click', handleOutside))

    return () => {
      const current = activeSpace()

      return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            class="app-switcher"
            style={{ width: '100%', border: 'none', outline: 'none' }}
            onClick={toggle}
          >
            <span class="app-switcher-mark">{current.icon}</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                minWidth: 0,
                flex: 1,
                textAlign: 'left',
              }}
            >
              <strong style={{ fontSize: '15px', letterSpacing: '.03em', lineHeight: 1.2 }}>
                {current.name}
              </strong>
              <span style={{ color: 'rgba(226,232,240,.68)', fontSize: '12px' }}>
                Enterprise Vue 3 + TSX
              </span>
            </div>
            <span
              style={{
                fontSize: '12px',
                color: 'rgba(226,232,240,.6)',
                flexShrink: 0,
                transform: open.value ? 'rotate(180deg)' : 'none',
                transition: 'transform .2s',
              }}
            >
              ▾
            </span>
          </button>

          {open.value && spaces.length > 1 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                zIndex: 100,
                borderRadius: '14px',
                border: '1px solid rgba(148,163,184,.22)',
                background: 'rgba(15,23,42,.96)',
                backdropFilter: 'blur(20px)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(2,6,23,.5)',
              }}
            >
              {spaces.map((space) => (
                <button
                  key={space.id}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background:
                      space.id === uiStore.activeAppId
                        ? 'rgba(255,255,255,.08)'
                        : 'transparent',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background .15s',
                    outline: 'none',
                  }}
                  onClick={() => selectApp(space.id)}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'var(--app-gradient-primary)',
                      color: '#04111f',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    {space.icon}
                  </span>
                  {space.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    }
  },
})
