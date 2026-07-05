/// <reference types="vue/jsx" />
import { computed, defineComponent, reactive, ref } from 'vue'

import SearchPanel from '../../../components/SearchPanel'
import { AppEmptyState, AppErrorState, AppSkeletonCard } from '../../../components/states'

interface TodoItem {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  owner: string
  done: boolean
}

const PRIORITY_STYLE: Record<TodoItem['priority'], { color: string; bg: string }> = {
  high: { color: '#b91c1c', bg: 'rgba(254,226,226,.9)' },
  medium: { color: '#9a3412', bg: 'rgba(254,243,199,.9)' },
  low: { color: '#166534', bg: 'rgba(220,252,231,.9)' },
}

export default defineComponent({
  name: 'TodoCenterView',
  setup() {
    const allTodos = ref<TodoItem[]>([
      { id: 1, title: '完成用户页操作审计字段补充', priority: 'high', owner: '王海', done: false },
      { id: 2, title: '推进动态路由后端配置协议', priority: 'high', owner: '刘洋', done: false },
      { id: 3, title: '整理系统设置页权限矩阵', priority: 'medium', owner: '李安', done: true },
      { id: 4, title: '补充表格列工厂使用文档', priority: 'low', owner: '张晴', done: false },
    ])

    const loading = ref(false)
    const error = ref('')
    const query = reactive({ keyword: '', onlyUndone: false })

    const visibleTodos = computed(() =>
      allTodos.value.filter((item) => {
        const matchKeyword = query.keyword.trim()
          ? item.title.includes(query.keyword.trim()) || item.owner.includes(query.keyword.trim())
          : true
        const matchDone = query.onlyUndone ? !item.done : true
        return matchKeyword && matchDone
      }),
    )

    async function reloadTodos() {
      loading.value = true
      error.value = ''
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 450))
      } catch {
        error.value = '待办列表加载失败'
      } finally {
        loading.value = false
      }
    }

    function triggerError() {
      error.value = '模拟错误状态：网关超时'
    }

    function search() {
      void reloadTodos()
    }

    function reset() {
      query.keyword = ''
      query.onlyUndone = false
      void reloadTodos()
    }

    function toggleDone(item: TodoItem) {
      item.done = !item.done
    }

    void reloadTodos()

    return () => (
      <main style={{ display: 'grid', gap: '18px' }}>
        {/* Header */}
        <section class="panel" style={{ padding: '24px' }}>
          <p class="eyebrow" style={{ marginBottom: '8px' }}>Message &amp; Todo</p>
          <h2 style={{ margin: 0 }}>消息中心 / 待办页模板</h2>
          <span style={{ display: 'block', marginTop: '8px', color: 'var(--app-text-muted)' }}>
            演示 SearchPanel + 空态/错误态/骨架屏的组合方式。
          </span>
        </section>

        {/* Search */}
        <SearchPanel loading={loading.value} onSearch={search} onReset={reset}>
          {{
            default: () => (
              <>
                <label class="field-label">
                  <span>关键词</span>
                  <input
                    class="field-input"
                    type="text"
                    placeholder="搜索标题/负责人"
                    value={query.keyword}
                    onInput={(e) => (query.keyword = (e.target as HTMLInputElement).value)}
                  />
                </label>
                <label
                  class="field-label"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}
                >
                  <input
                    type="checkbox"
                    checked={query.onlyUndone}
                    onChange={(e) =>
                      (query.onlyUndone = (e.target as HTMLInputElement).checked)
                    }
                  />
                  仅看未完成
                </label>
              </>
            ),
            actions: () => (
              <button
                type="button"
                style={{
                  minHeight: '38px',
                  padding: '0 12px',
                  border: '1px solid rgba(248,113,113,.26)',
                  borderRadius: '999px',
                  background: 'rgba(254,242,242,.82)',
                  color: '#be123c',
                  cursor: 'pointer',
                }}
                onClick={triggerError}
              >
                模拟错误
              </button>
            ),
          }}
        </SearchPanel>

        {/* Content */}
        <section class="panel" style={{ padding: '18px' }}>
          {loading.value ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              <AppSkeletonCard rows={3} />
              <AppSkeletonCard rows={3} />
            </div>
          ) : error.value ? (
            <AppErrorState message={error.value} onRetry={reloadTodos} />
          ) : visibleTodos.value.length === 0 ? (
            <AppEmptyState
              title="暂无匹配待办"
              description="试试修改筛选条件，或者创建新的任务项。"
              actionText="重置条件"
              onAction={reset}
            />
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {visibleTodos.value.map((item) => {
                const ps = PRIORITY_STYLE[item.priority]
                return (
                  <article
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '14px',
                      padding: '14px',
                      border: '1px solid var(--app-border)',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,.76)',
                      opacity: item.done ? 0.7 : 1,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          textDecoration: item.done ? 'line-through' : 'none',
                          color: item.done ? 'var(--app-text-muted)' : 'var(--app-text-main)',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ margin: '4px 0 0', color: 'var(--app-text-muted)' }}>
                        负责人：{item.owner}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        justifyItems: 'end',
                        alignContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          minHeight: '26px',
                          padding: '0 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          color: ps.color,
                          background: ps.bg,
                        }}
                      >
                        {item.priority}
                      </span>
                      <button
                        type="button"
                        class="toolbar-btn"
                        style={{ minHeight: '34px', padding: '0 12px', fontSize: '13px' }}
                        onClick={() => toggleDone(item)}
                      >
                        {item.done ? '标记未完成' : '标记完成'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    )
  },
})
