/// <reference types="vue/jsx" />
import { computed, defineComponent, h, ref } from 'vue'
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
      initialParams: { keyword: '', includeDisabled: false },
      request: ({ page, pageSize, params, sort }) =>
        fetchUserList({ page, pageSize, params, sort }),
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
          ElMessage.success(
            `${row.name} 当前状态：${row.status === 'enabled' ? '启用' : '停用'}`,
          )
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
        render: ({ row }) =>
          h('div', { style: 'display:flex;flex-direction:column;gap:2px' }, [
            h('strong', { style: 'font-size:14px' }, row.name),
            h(
              'span',
              { style: 'color:var(--app-text-muted);font-size:12px' },
              `ID: ${row.id}`,
            ),
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
        render: ({ row }) =>
          h(
            ElTag,
            { type: row.status === 'enabled' ? 'success' : 'info' },
            () => (row.status === 'enabled' ? '启用' : '停用'),
          ),
      },
      createDateTimeColumn<UserRow>({
        key: 'createdAt',
        prop: 'createdAt',
        label: '创建时间',
      }),
      createActionsColumn<UserRow>({
        key: 'actions',
        minWidth: 240,
        actions: actionDefinitions,
      }),
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

    return () => (
      <main style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Hero panel */}
        <section
          class="panel"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '22px',
            padding: '26px',
          }}
        >
          <div>
            <p class="eyebrow" style={{ marginBottom: '10px' }}>XTable Showcase</p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(28px,4vw,42px)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
              }}
            >
              企业级配置化列表页示例
            </h2>
            <p style={{ maxWidth: '64ch', margin: '12px 0 0', color: 'var(--app-text-muted)' }}>
              这一页把筛选区、远程请求、分页排序、多选、操作列和列显隐组合在一起，后续业务列表可以直接沿用这个模式。
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: '12px',
              minWidth: '360px',
            }}
          >
            {summaryCards.value.map((item) => (
              <article
                key={item.label}
                class={['state-card', item.tone === 'success' && 'state-card-success', item.tone === 'warning' && 'state-card-warning']}
              >
                <span style={{ color: 'var(--app-text-muted)', fontSize: '13px' }}>
                  {item.label}
                </span>
                <strong style={{ marginTop: '8px', fontSize: '28px', lineHeight: 1 }}>
                  {item.value}
                </strong>
              </article>
            ))}
          </div>
        </section>

        {/* Search panel */}
        <SearchPanel onSearch={applyFilters} onReset={resetFilters}>
          {{
            default: () => (
              <>
                <label class="field-label">
                  <span>关键词</span>
                  <input
                    class="field-input"
                    type="text"
                    placeholder="搜索姓名/部门/角色"
                    value={keyword.value}
                    onInput={(e) => (keyword.value = (e.target as HTMLInputElement).value)}
                    onKeyup={(e) => e.key === 'Enter' && void applyFilters()}
                  />
                </label>
                <label
                  class="field-label"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', minWidth: '140px' }}
                >
                  <span>包含停用</span>
                  <ElSwitch
                    modelValue={includeDisabled.value}
                    onChange={(v) => (includeDisabled.value = v as boolean)}
                  />
                </label>
              </>
            ),
          }}
        </SearchPanel>

        {/* Table */}
        <XTable
          columns={columns.value}
          data={table.data.value as Record<string, unknown>[]}
          loading={table.loading.value}
          pagination={table.pagination}
          rowKey="id"
          storageKey="x-front-template:users:x-table"
          emptyText="当前筛选条件下没有成员"
          {...{
            onRefresh: table.reload,
            'onPagination-change': table.handlePaginationChange,
            'onSort-change': table.handleSortChange,
            'onSelection-change': handleSelectionChange,
          } as Record<string, unknown>}
        >
          {{
            toolbar: ({ selectionCount }: { selectionCount: number }) => (
              <div>
                <h3 style={{ margin: 0, fontSize: '24px' }}>成员列表</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--app-text-muted)' }}>
                  已选 {selectionCount} 项，可批量启用，也可继续扩展更多批处理动作。
                </p>
              </div>
            ),
            extra: () => (
              <button
                v-permission="user:list:edit"
                type="button"
                class="action-btn-ghost"
                onClick={batchEnable}
              >
                批量启用
              </button>
            ),
          }}
        </XTable>
      </main>
    )
  },
})
