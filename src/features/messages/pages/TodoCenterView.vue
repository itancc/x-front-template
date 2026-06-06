<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import SearchPanel from '../../../components/SearchPanel'
import { AppEmptyState, AppErrorState, AppSkeletonCard } from '../../../components/states'

interface TodoItem {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  owner: string
  done: boolean
}

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

const visibleTodos = computed(() => {
  return allTodos.value.filter((item) => {
    const matchKeyword = query.keyword.trim()
      ? item.title.includes(query.keyword.trim()) || item.owner.includes(query.keyword.trim())
      : true
    const matchDone = query.onlyUndone ? !item.done : true
    return matchKeyword && matchDone
  })
})

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
</script>

<template>
  <main class="todo-center">
    <section class="todo-center__head">
      <p>Message & Todo</p>
      <h2>消息中心 / 待办页模板</h2>
      <span>演示 SearchPanel + 空态/错误态/骨架屏的组合方式。</span>
    </section>

    <SearchPanel :loading="loading" @search="search" @reset="reset">
      <label class="todo-field">
        <span>关键词</span>
        <input v-model="query.keyword" type="text" placeholder="搜索标题/负责人" />
      </label>
      <label class="todo-field is-inline">
        <input v-model="query.onlyUndone" type="checkbox" />
        仅看未完成
      </label>
      <template #actions>
        <button type="button" class="todo-center__error-btn" @click="triggerError">模拟错误</button>
      </template>
    </SearchPanel>

    <section class="todo-center__card">
      <div v-if="loading" class="todo-center__skeletons">
        <AppSkeletonCard :rows="3" />
        <AppSkeletonCard :rows="3" />
      </div>
      <AppErrorState v-else-if="error" :message="error" @retry="reloadTodos" />
      <AppEmptyState
        v-else-if="visibleTodos.length === 0"
        title="暂无匹配待办"
        description="试试修改筛选条件，或者创建新的任务项。"
        action-text="重置条件"
        @action="reset"
      />
      <div v-else class="todo-center__list">
        <article v-for="item in visibleTodos" :key="item.id" :class="['todo-item', item.done && 'is-done']">
          <div>
            <h3>{{ item.title }}</h3>
            <p>负责人：{{ item.owner }}</p>
          </div>
          <div class="todo-item__meta">
            <span :class="['todo-item__priority', `is-${item.priority}`]">{{ item.priority }}</span>
            <button type="button" class="todo-item__btn" @click="toggleDone(item)">
              {{ item.done ? '标记未完成' : '标记完成' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.todo-center {
  display: grid;
  gap: 18px;
}

.todo-center__head,
.todo-center__card {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.todo-center__head {
  padding: 24px;
}

.todo-center__head p {
  margin: 0 0 8px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.todo-center__head h2 {
  margin: 0;
}

.todo-center__head span {
  display: block;
  margin-top: 8px;
  color: var(--app-text-muted);
}

.todo-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.todo-field input[type='text'] {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--app-border);
  border-radius: 10px;
}

.todo-field.is-inline {
  flex-direction: row;
  align-items: center;
  min-height: 40px;
}

.todo-center__error-btn {
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(248, 113, 113, 0.26);
  border-radius: 999px;
  background: rgba(254, 242, 242, 0.82);
  color: #be123c;
}

.todo-center__card {
  padding: 18px;
}

.todo-center__skeletons {
  display: grid;
  gap: 10px;
}

.todo-center__list {
  display: grid;
  gap: 10px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--app-border);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.76);
}

.todo-item.is-done h3 {
  text-decoration: line-through;
  color: var(--app-text-muted);
}

.todo-item h3,
.todo-item p {
  margin: 0;
}

.todo-item p {
  margin-top: 4px;
  color: var(--app-text-muted);
}

.todo-item__meta {
  display: grid;
  justify-items: end;
  align-content: space-between;
  gap: 8px;
}

.todo-item__priority {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: uppercase;
}

.todo-item__priority.is-high {
  color: #b91c1c;
  background: rgba(254, 226, 226, 0.9);
}

.todo-item__priority.is-medium {
  color: #9a3412;
  background: rgba(254, 243, 199, 0.9);
}

.todo-item__priority.is-low {
  color: #166534;
  background: rgba(220, 252, 231, 0.9);
}

.todo-item__btn {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: #fff;
}

@media (max-width: 640px) {
  .todo-center__head,
  .todo-center__card {
    padding: 14px;
  }

  .todo-item {
    flex-direction: column;
  }

  .todo-item__meta {
    justify-items: start;
  }
}
</style>
