<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { useUiStore } from '../../../stores/ui'

const uiStore = useUiStore()

function saveSettings() {
  ElMessage.success('设置已保存到本地模板状态')
}
</script>

<template>
  <main class="settings-page">
    <section class="settings-card">
      <div class="panel-head">
        <p class="eyebrow">System</p>
        <h2>系统设置</h2>
      </div>

      <div class="settings-grid">
        <label>
          <span>夜间主题</span>
          <ElSwitch :model-value="uiStore.theme === 'midnight'" @change="uiStore.toggleTheme()" />
        </label>
        <label>
          <span>侧栏折叠</span>
          <ElSwitch :model-value="uiStore.sidebarCollapsed" @change="uiStore.toggleSidebarCollapsed()" />
        </label>
        <label>
          <span>固定标签页</span>
          <ElSwitch :model-value="true" disabled />
        </label>
      </div>

      <div class="settings-note">
        当前页只做模板级能力示范，后续可以接入用户偏好、组织配置、功能开关和环境参数。
      </div>

      <button v-permission="'system:setting:edit'" type="button" class="save-button" @click="saveSettings">保存设置</button>
    </section>
  </main>
</template>

<style scoped>
.settings-page {
  display: grid;
}

.settings-card {
  padding: 26px;
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.panel-head h2,
.eyebrow {
  margin: 0;
}

.eyebrow {
  margin-bottom: 10px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.settings-grid label {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--app-border);
  background: rgba(255, 255, 255, 0.78);
}

.settings-note {
  margin-top: 18px;
  color: var(--app-text-muted);
}

.save-button {
  margin-top: 18px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: #fff;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}

@media (max-width: 960px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .settings-card {
    padding: 18px;
  }
}
</style>
