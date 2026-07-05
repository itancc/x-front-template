import { computed, defineComponent, ref } from 'vue'
import { ElMessage, ElSwitch, ElTag } from 'element-plus'

import XSearchPanel from '@/components/SearchPanel'
import XTable, {
  createActionsColumn,
  createDateTimeColumn,
  createIndexColumn,
  createSelectionColumn,
  createTextColumn,
  type XTableAction,
  type XTableColumn,
} from '@/components/XTable'
import { useTableRequest } from '@/components/XTable/useTableRequest'
import { useAuthStore } from '@/stores/auth'

import type { UserQueryState, UserRow } from '../data/users'
import { batchEnableUsers, deleteUser, fetchUserList, fetchUserStats, toggleUserStatus, type UserStatsCard } from '../services/user.service'

export default defineComponent({
  name: 'UserListView',
  setup() {
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
          await Promise.all([table.reload(), reloadStats()])
        },
      },
      {
        key: 'delete',
        label: '删除',
        type: 'danger',
        permission: () => authStore.hasPermission('user:list:delete'),
        confirm: (row) => `确认删除 ${row.name} 吗？`,
        onClick: async (row) => {
          await deleteUser(row.id)
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
        render: ({ row }) => (
          <div class="x-user-cell">
            <strong>{row.name}</strong>
            <span>ID: {row.id}</span>
          </div>
        ),
      },
      createTextColumn<UserRow>({ key: 'department', prop: 'department', label: '部门' }),
      createTextColumn<UserRow>({ key: 'role', prop: 'role', label: '角色', minWidth: 120 }),
      {
        key: 'status',
        prop: 'status',
        label: '状态',
        width: 110,
        align: 'center',
        render: ({ row }) => <ElTag type={row.status === 'enabled' ? 'success' : 'info'}>{row.status === 'enabled' ? '启用' : '停用'}</ElTag>,
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

    void reloadStats()

    return () => (
      <main class="x-users-page">
        <section class="x-users-hero x-card">
          <div>
            <p class="x-eyebrow">Customers</p>
            <h2>CRM 客户管理列表</h2>
          </div>
          <div class="x-users-metrics">
            {summaryCards.value.map((item) => (
              <article key={item.label} class="x-users-metric">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <XSearchPanel onSearch={applyFilters} onReset={resetFilters}>
          <label class="x-search-field">
            <span>关键词</span>
            <input value={keyword.value} onInput={(event) => (keyword.value = (event.target as HTMLInputElement).value)} placeholder="搜索姓名/部门/角色" />
          </label>
          <label class="x-search-field x-search-field--inline">
            <span>包含停用</span>
            <ElSwitch modelValue={includeDisabled.value} onUpdate:modelValue={(value) => (includeDisabled.value = Boolean(value))} />
          </label>
        </XSearchPanel>

        <XTable
          columns={columns.value as unknown as XTableColumn<Record<string, unknown>>[]}
          data={table.data.value as unknown as Record<string, unknown>[]}
          loading={table.loading.value}
          pagination={table.pagination}
          rowKey="id"
          emptyText="当前筛选条件下没有成员"
          onRefresh={table.reload}
          onPagination-change={table.handlePaginationChange}
          onSort-change={table.handleSortChange}
          onSelection-change={handleSelectionChange}
        >
          {{
            toolbar: ({ selectionCount }: { selectionCount: number }) => (
              <div>
                <h3>客户列表</h3>
                <p>已选 {selectionCount} 项</p>
              </div>
            ),
            extra: () => (
              <button type="button" class="x-btn" onClick={batchEnable}>
                批量启用
              </button>
            ),
          }}
        </XTable>
      </main>
    )
  },
})
