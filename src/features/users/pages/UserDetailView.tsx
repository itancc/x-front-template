import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { UserRow } from '../data/users'
import { fetchUserById } from '../services/user.service'

export default defineComponent({
  name: 'UserDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const user = ref<UserRow | null>(null)

    const statusText = computed(() => (user.value?.status === 'enabled' ? '启用' : '停用'))

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

    watch(
      () => route.params.id,
      () => {
        void loadUser()
      },
      { immediate: true },
    )

    return () => (
      <main class="x-detail-page">
        <section class="x-card">
          <p class="x-eyebrow">Profile</p>
          <h2>{loading.value ? '加载中...' : user.value?.name ?? '未找到用户'}</h2>
          <div class="x-detail-grid">
            <article><span>部门</span><strong>{user.value?.department ?? '--'}</strong></article>
            <article><span>角色</span><strong>{user.value?.role ?? '--'}</strong></article>
            <article><span>状态</span><strong>{statusText.value}</strong></article>
          </div>
          <button type="button" class="x-btn" onClick={() => router.push('/users')}>返回列表</button>
        </section>
      </main>
    )
  },
})
