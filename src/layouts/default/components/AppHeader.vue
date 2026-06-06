<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../../../stores/auth'
import { usePermissionStore } from '../../../stores/permission'
import { useUiStore } from '../../../stores/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const uiStore = useUiStore()

const breadcrumbs = computed(() =>
  route.matched.filter((record) => record.meta.title).map((record) => ({
    title: String(record.meta.title),
    path: record.path,
  })),
)

async function handleLogout() {
  permissionStore.reset(router)
  authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__title">
      <div class="crumbs">
        <RouterLink to="/dashboard">工作台</RouterLink>
        <span v-for="item in breadcrumbs" :key="item.path">/ {{ item.title }}</span>
      </div>
      <h1>{{ route.meta.title ?? '后台模板' }}</h1>
    </div>

    <div class="app-header__actions">
      <button type="button" class="tool-button" @click="uiStore.toggleTheme()">
        {{ uiStore.theme === 'aurora' ? '夜间' : '日间' }}
      </button>
      <button type="button" class="tool-button" @click="uiStore.toggleSidebarCollapsed()">
        {{ uiStore.sidebarCollapsed ? '展开侧栏' : '收起侧栏' }}
      </button>
      <div class="user-chip">
        <span class="user-chip__avatar">{{ authStore.user?.avatar ?? 'U' }}</span>
        <div class="user-chip__info">
          <strong>{{ authStore.user?.name ?? '访客' }}</strong>
          <span>{{ authStore.user?.role ?? '未登录' }}</span>
        </div>
      </div>
      <button type="button" class="tool-button tool-button--danger" @click="handleLogout">退出</button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--app-border);
  background: rgba(247, 250, 252, 0.72);
  backdrop-filter: blur(16px);
}

.app-header__title {
  min-width: 0;
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--app-text-muted);
  font-size: 13px;
}

.crumbs a {
  color: var(--app-accent-strong);
  text-decoration: none;
}

.app-header h1 {
  margin: 6px 0 0;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tool-button {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: rgba(255, 255, 255, 0.78);
  color: var(--app-text-main);
}

.tool-button--danger {
  border-color: rgba(248, 113, 113, 0.24);
  color: #be123c;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.04);
}

.user-chip__avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--app-accent), #38bdf8);
  color: #04111f;
  font-weight: 700;
}

.user-chip__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-chip__info strong {
  font-size: 13px;
}

.user-chip__info span {
  color: var(--app-text-muted);
  font-size: 12px;
}

@media (max-width: 640px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    padding-inline: 14px;
  }

  .app-header__actions {
    justify-content: flex-start;
  }
}
</style>
