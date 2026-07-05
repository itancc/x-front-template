/// <reference types="vue/jsx" />
import { computed, defineComponent, ref } from 'vue'
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

    const statusText = computed(() =>
      user.value?.status === 'enabled' ? '启用' : '停用',
    )

    return () => (
      <main style={{ display: 'grid', gap: '18px' }}>
        <section class="panel" style={{ padding: '26px' }}>
          <div>
            <p class="eyebrow" style={{ marginBottom: '10px' }}>Profile</p>
            <h2 style={{ margin: 0, fontSize: 'clamp(26px,3vw,38px)' }}>
              {loading.value ? '加载中...' : (user.value?.name ?? '未找到用户')}
            </h2>
            <p style={{ maxWidth: '64ch', color: 'var(--app-text-muted)', marginTop: '8px' }}>
              这是一个用户详情页占位示例，后续可以接入远程查询、编辑抽屉、权限控制和操作记录。
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: '14px',
              marginTop: '18px',
            }}
          >
            {[
              { label: '部门', value: user.value?.department ?? '--' },
              { label: '角色', value: user.value?.role ?? '--' },
              { label: '状态', value: statusText.value },
            ].map((item) => (
              <article
                key={item.label}
                style={{
                  padding: '16px 18px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,.72)',
                  border: '1px solid var(--app-border)',
                }}
              >
                <span style={{ color: 'var(--app-text-muted)', fontSize: '13px' }}>
                  {item.label}
                </span>
                <strong style={{ display: 'block', marginTop: '8px' }}>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section
          class="panel"
          style={{
            padding: '26px',
            background: 'linear-gradient(135deg,rgba(34,211,238,.06),rgba(99,102,241,.04))',
          }}
        >
          <h3 style={{ margin: 0 }}>可扩展内容</h3>
          <ul style={{ margin: '14px 0 0', paddingLeft: '20px', color: 'var(--app-text-muted)' }}>
            <li>基础信息、角色权限、操作日志。</li>
            <li>与列表页共享同一份领域数据结构。</li>
            <li>后续可改造成抽屉、弹窗或者详情路由页。</li>
          </ul>
          <button
            type="button"
            class="toolbar-btn"
            style={{ marginTop: '18px' }}
            onClick={() => router.push('/users')}
          >
            返回列表
          </button>
        </section>
      </main>
    )
  },
})
