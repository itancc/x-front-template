<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUiStore } from '../../../stores/ui'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const tabs = computed(() => uiStore.visitedTabs)

async function closeTab(path: string) {
  const isActive = route.path === path
  uiStore.removeVisitedView(path)

  if (!isActive) {
    return
  }

  const remaining = uiStore.visitedTabs.filter((tab) => tab.path !== path)
  const nextTab = remaining.at(-1)

  await router.push(nextTab?.path ?? '/dashboard')
}
</script>

<template>
  <section class="route-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.path"
      type="button"
      :class="['route-tab', route.path === tab.path && 'is-active']"
      @click="router.push(tab.path)"
    >
      <span>{{ tab.title }}</span>
      <i v-if="!tab.affix" class="route-tab__close" @click.stop="closeTab(tab.path)">x</i>
    </button>
  </section>
</template>

<style scoped>
.route-tabs {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px 22px 0;
  overflow-x: auto;
}

.route-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--app-text-main);
  white-space: nowrap;
}

.route-tab.is-active {
  border-color: var(--app-accent-ring);
  background: linear-gradient(135deg, var(--app-accent-soft), var(--app-accent-soft-strong));
  color: var(--app-accent-strong);
}

.route-tab__close {
  font-style: normal;
  color: var(--app-text-muted);
}
</style>
