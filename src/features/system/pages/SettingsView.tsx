/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'
import { ElMessage, ElSwitch } from 'element-plus'

import { useUiStore } from '../../../stores/ui'

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const uiStore = useUiStore()

    function saveSettings() {
      ElMessage.success('设置已保存到本地模板状态')
    }

    return () => (
      <main style={{ display: 'grid' }}>
        <section class="panel" style={{ padding: '26px' }}>
          <p class="eyebrow" style={{ marginBottom: '10px' }}>System</p>
          <h2 style={{ margin: 0 }}>系统设置</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: '14px',
              marginTop: '18px',
            }}
          >
            {[
              {
                label: '夜间主题',
                value: uiStore.colorMode === 'dark',
                onChange: () => uiStore.toggleTheme(),
              },
              {
                label: '侧栏折叠',
                value: uiStore.sidebarCollapsed,
                onChange: () => uiStore.toggleSidebarCollapsed(),
              },
              { label: '固定标签页', value: true, onChange: () => {}, disabled: true },
            ].map((item) => (
              <label
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '16px',
                  borderRadius: '18px',
                  border: '1px solid var(--app-border)',
                  background: 'rgba(255,255,255,.78)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                <ElSwitch
                  modelValue={item.value}
                  disabled={item.disabled}
                  onChange={item.onChange}
                />
              </label>
            ))}
          </div>

          <p
            style={{
              marginTop: '18px',
              color: 'var(--app-text-muted)',
              fontSize: '14px',
            }}
          >
            当前页只做模板级能力示范，后续可以接入用户偏好、组织配置、功能开关和环境参数。
          </p>

          <button
            v-permission="system:setting:edit"
            type="button"
            class="action-btn-primary"
            style={{ marginTop: '18px' }}
            onClick={saveSettings}
          >
            保存设置
          </button>
        </section>
      </main>
    )
  },
})
