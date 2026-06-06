<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { UserRow } from '../data/users'
import { fetchUserById } from '../services/user.service'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const user = ref<UserRow | null>(null)

async function loadUser() {
  const userId = Number(route.params.id)

  if (!Number.isFinite(userId)) {
    user.value = null
    return
  }

  loading.value = true
  try {
    user.value = await fetchUserById(userId)
  } finally {
    loading.value = false
  }
}

void loadUser()

const statusText = computed(() => (user.value?.status === 'enabled' ? '启用' : '停用'))
</script>

<template>
  <main class="detail-page">
    <section class="detail-card">
      <div>
        <p class="eyebrow">Profile</p>
        <h2>{{ loading ? '加载中...' : (user?.name ?? '未找到用户') }}</h2>
        <p class="detail-copy">
          这是一个用户详情页占位示例，后续可以接入远程查询、编辑抽屉、权限控制和操作记录。
        </p>
      </div>

      <div class="detail-stats">
        <article>
          <span>部门</span>
          <strong>{{ user?.department ?? '--' }}</strong>
        </article>
        <article>
          <span>角色</span>
          <strong>{{ user?.role ?? '--' }}</strong>
        </article>
        <article>
          <span>状态</span>
          <strong>{{ statusText }}</strong>
        </article>
      </div>
    </section>

    <section class="detail-card detail-card--soft">
      <h3>可扩展内容</h3>
      <ul>
        <li>基础信息、角色权限、操作日志。</li>
        <li>与列表页共享同一份领域数据结构。</li>
        <li>后续可改造成抽屉、弹窗或者详情路由页。</li>
      </ul>
      <button type="button" class="detail-button" @click="router.push('/users')">返回列表</button>
    </section>
  </main>
</template>

<style scoped>
.detail-page {
  display: grid;
  gap: 18px;
}

.detail-card {
  padding: 26px;
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.detail-card--soft {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.06), rgba(99, 102, 241, 0.04));
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.detail-card h2,
.detail-card h3 {
  margin: 0;
}

.detail-copy {
  max-width: 64ch;
  color: var(--app-text-muted);
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.detail-stats article {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--app-border);
}

.detail-stats span {
  color: var(--app-text-muted);
  font-size: 13px;
}

.detail-stats strong {
  display: block;
  margin-top: 8px;
}

.detail-card ul {
  margin: 14px 0 0;
  padding-left: 20px;
  color: var(--app-text-muted);
}

.detail-button {
  margin-top: 18px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: rgba(255, 255, 255, 0.82);
}

@media (max-width: 640px) {
  .detail-card {
    padding: 18px;
  }

  .detail-stats {
    grid-template-columns: 1fr;
  }
}
</style>
