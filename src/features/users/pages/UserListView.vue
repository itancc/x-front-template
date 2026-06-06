<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { ElMessage, ElSwitch, ElTag } from 'element-plus'

import XTable from '../../../components/XTable'
import {
  createActionsColumn,
  createDateTimeColumn,
  createIndexColumn,
  createSelectionColumn,
  createTextColumn,
  type XTableAction,
  type XTableColumn,
} from '../../../components/XTable'
import SearchPanel from '../../../components/SearchPanel'
import { useTableRequest } from '../../../components/XTable/useTableRequest'
import { useAuthStore } from '../../../stores/auth'
import type { UserQueryState, UserRow } from '../data/users'
import {
  batchEnableUsers,
  deleteUser,
  fetchUserList,
  fetchUserStats,
  toggleUserStatus,
  type UserStatsCard,
} from '../services/user.service'

const authStore = useAuthStore()

const keyword = ref('')
const includeDisabled = ref(false)
const selectedRows = ref<UserRow[]>([])
const summaryCards = ref<UserStatsCard[]>([])

const table = useTableRequest<UserRow, UserQueryState>({
  initialPageSize: 10,
  initialParams: {
    keyword: '',
    includeDisabled: false,
  },
  request: ({ page, pageSize, params, sort }) => fetchUserList({ page, pageSize, params, sort }),
})

const canBatchEnable = computed(() => authStore.hasPermission('user:list:edit'))

async function reloadStats() {
  summaryCards.value = await fetchUserStats()
}

void reloadStats()

const actionDefinitions: XTableAction<UserRow>[] = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    permission: () => authStore.hasPermission('user:list:edit'),
    onClick: async (row) => {
      ElMessage.success(`已进入 ${row.name} 的编辑流程`)
    },
  },
  {
    key: 'toggle-status',
    label: '切换状态',
    type: 'warning',
    disabled: (row) => row.role === '审计',
    confirm: (row) => `确认切换 ${row.name} 的启用状态？`,
    onClick: async (row) => {
      await toggleUserStatus(row.id)
      ElMessage.success(`${row.name} 当前状态：${row.status === 'enabled' ? '启用' : '停用'}`)
      await Promise.all([table.reload(), reloadStats()])
    },
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    permission: () => authStore.hasPermission('user:list:delete'),
    confirm: (row) => `确认删除 ${row.name} 吗？该操作不可恢复。`,
    onClick: async (row) => {
      await deleteUser(row.id)
      ElMessage.success(`模拟删除 ${row.name}`)
      await Promise.all([table.reload(), reloadStats()])
    },
  },
]

const columns = computed<XTableColumn<UserRow>[]>(() => [
  createSelectionColumn<UserRow>(),
  createIndexColumn<UserRow>(),
  {
    key: 'name',
    prop: 'name',
    label: '成员名称',
    minWidth: 180,
    showOverflowTooltip: true,
    render: ({ row }) => h('div', { class: 'user-cell' }, [
      h('strong', row.name),
      h('span', `ID: ${row.id}`),
    ]),
  },
  createTextColumn<UserRow>({ key: 'department', prop: 'department', label: '部门' }),
  createTextColumn<UserRow>({ key: 'role', prop: 'role', label: '角色', minWidth: 120 }),
  {
    key: 'status',
    prop: 'status',
    label: '状态',
    width: 110,
    align: 'center',
    render: ({ row }) => h(
      ElTag,
      { type: row.status === 'enabled' ? 'success' : 'info' },
      () => (row.status === 'enabled' ? '启用' : '停用'),
    ),
  },
  createDateTimeColumn<UserRow>({ key: 'createdAt', prop: 'createdAt', label: '创建时间' }),
  createActionsColumn<UserRow>({ key: 'actions', minWidth: 240, actions: actionDefinitions }),
])

async function applyFilters() {
  await table.updateParams({
    keyword: keyword.value.trim(),
    includeDisabled: includeDisabled.value,
  })
}

async function resetFilters() {
  keyword.value = ''
  includeDisabled.value = false
  await table.reset()
}

async function batchEnable() {
  if (!canBatchEnable.value) {
    ElMessage.warning('当前账号没有批量操作权限')
    return
  }

  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择需要处理的成员')
    return
  }

  await batchEnableUsers(selectedRows.value.map((row) => row.id))
  ElMessage.success(`已批量启用 ${selectedRows.value.length} 名成员`)
  await Promise.all([table.reload(), reloadStats()])
}

function handleSelectionChange(value: UserRow[]) {
  selectedRows.value = value
}
</script>

<template>
  <main class="users-page">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">XTable Showcase</p>
        <h2>企业级配置化列表页示例</h2>
        <p class="hero-copy">
          这一页把筛选区、远程请求、分页排序、多选、操作列和列显隐组合在一起，后续业务列表可以直接沿用这个模式。
        </p>
      </div>
      <div class="hero-metrics">
        <article v-for="item in summaryCards" :key="item.label" :class="['metric-card', `is-${item.tone}`]">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
    </section>

    <SearchPanel @search="applyFilters" @reset="resetFilters">
      <label class="search-field">
        <span>关键词</span>
        <input v-model="keyword" type="text" placeholder="搜索姓名/部门/角色" @keyup.enter="applyFilters" />
      </label>
      <label class="search-field switch-field">
        <span>包含停用</span>
        <ElSwitch v-model="includeDisabled" />
      </label>
    </SearchPanel>

    <XTable
      :columns="columns"
      :data="table.data.value"
      :loading="table.loading.value"
      :pagination="table.pagination"
      row-key="id"
      storage-key="x-front-template:users:x-table"
      empty-text="当前筛选条件下没有成员"
      @refresh="table.reload"
      @pagination-change="table.handlePaginationChange"
      @sort-change="table.handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar="{ selectionCount }">
        <div class="toolbar-summary">
          <h3>成员列表</h3>
          <p>已选 {{ selectionCount }} 项，可批量启用，也可继续扩展更多批处理动作。</p>
        </div>
      </template>

      <template #extra>
        <button v-permission="'user:list:edit'" type="button" class="ghost-button" @click="batchEnable">批量启用</button>
      </template>
    </XTable>
  </main>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-panel,
.x-table {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 22px;
  padding: 26px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-panel h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.hero-copy {
  max-width: 64ch;
  margin: 12px 0 0;
  color: var(--app-text-muted);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-width: 360px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid var(--app-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(240, 253, 250, 0.96));
}

.metric-card.is-success {
  background: linear-gradient(180deg, rgba(220, 252, 231, 0.9), rgba(240, 253, 250, 0.96));
}

.metric-card.is-warning {
  background: linear-gradient(180deg, rgba(254, 243, 199, 0.96), rgba(255, 251, 235, 0.96));
}

.metric-card span {
  color: var(--app-text-muted);
}

.metric-card strong {
  margin-top: 8px;
  font-size: 28px;
  line-height: 1;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--app-text-muted);
  font-size: 14px;
}

.search-field input {
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--app-text-main);
}

.switch-field {
  min-width: 140px;
}

.solid-button,
.ghost-button {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.solid-button {
  color: #fffdf8;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  box-shadow: 0 12px 24px rgba(20, 184, 166, 0.24);
}

.solid-button:hover {
  transform: translateY(-1px);
}

.ghost-button {
  color: var(--app-text-main);
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--app-border);
}

.ghost-button:hover {
  border-color: rgba(20, 184, 166, 0.3);
  color: var(--app-accent-strong);
  background: rgba(20, 184, 166, 0.08);
}

.toolbar-summary h3 {
  margin: 0;
  font-size: 24px;
}

.toolbar-summary p {
  margin: 4px 0 0;
  color: var(--app-text-muted);
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-cell strong {
  font-size: 14px;
}

.user-cell span {
  color: var(--app-text-muted);
  font-size: 12px;
}

@media (max-width: 960px) {
  .hero-panel {
    flex-direction: column;
  }

  .hero-metrics {
    min-width: 0;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-panel,
  .x-table {
    padding-inline: 14px;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
