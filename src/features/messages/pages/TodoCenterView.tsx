import { computed, defineComponent, reactive, ref } from 'vue'

import SearchPanel from '@/components/SearchPanel'
import { AppEmptyState, AppErrorState, AppSkeletonCard } from '@/components/states'

interface TodoItem {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  owner: string
  done: boolean
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
    const query = reactive({
      keyword: '',
      onlyUndone: false,
    })

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
        await new Promise((resolve) => window.setTimeout(resolve, 360))
      } catch {
        error.value = '待办列表加载失败'
      } finally {
        loading.value = false
      }
    }

    function triggerError() {
      error.value = '模拟错误状态：网关超时'
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
      <main class="x-todo-center">
        <section class="x-card">
          <p class="x-eyebrow">Message & Todo</p>
          <h2>消息中心 / 待办页模板</h2>
        </section>

        <SearchPanel loading={loading.value} onSearch={reloadTodos} onReset={reset}>
          <label class="x-search-field">
            <span>关键词</span>
            <input value={query.keyword} onInput={(event) => (query.keyword = (event.target as HTMLInputElement).value)} placeholder="搜索标题/负责人" />
          </label>
          <label class="x-search-field x-search-field--inline">
            <input type="checkbox" checked={query.onlyUndone} onChange={(event) => (query.onlyUndone = (event.target as HTMLInputElement).checked)} />
            仅看未完成
          </label>
          {{
            actions: () => (
              <button type="button" class="x-btn" onClick={triggerError}>模拟错误</button>
            ),
          }}
        </SearchPanel>

        <section class="x-card">
          {loading.value ? (
            <div class="x-todo-skeletons">
              <AppSkeletonCard rows={3} />
            </div>
          ) : error.value ? (
            <AppErrorState message={error.value} onRetry={reloadTodos} />
          ) : visibleTodos.value.length === 0 ? (
            <AppEmptyState title="暂无匹配待办" description="试试修改筛选条件" actionText="重置条件" onAction={reset} />
          ) : (
            <div class="x-todo-list">
              {visibleTodos.value.map((item) => (
                <article key={item.id} class={['x-todo-item', item.done && 'is-done']}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>负责人：{item.owner}</p>
                  </div>
                  <div>
                    <span class={['x-todo-priority', `is-${item.priority}`]}>{item.priority}</span>
                    <button type="button" class="x-btn" onClick={() => toggleDone(item)}>
                      {item.done ? '标记未完成' : '标记完成'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    )
  },
})
