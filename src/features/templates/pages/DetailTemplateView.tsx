/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DetailTemplateView',
  setup() {
    const infoGroups = [
      {
        title: '基础信息',
        items: [
          { label: '项目编号', value: 'PRJ-2026-081' },
          { label: '项目名称', value: '供应链协同平台升级' },
          { label: '负责人', value: '王海' },
          { label: '状态', value: '进行中' },
        ],
      },
      {
        title: '进度信息',
        items: [
          { label: '当前阶段', value: '联调测试' },
          { label: '里程碑完成', value: '4/6' },
          { label: '预算使用', value: '65%' },
          { label: '风险等级', value: '中' },
        ],
      },
    ]

    return () => (
      <main style={{ display: 'grid', gap: '18px' }}>
        {/* Hero */}
        <section
          class="panel"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '18px',
            padding: '24px',
          }}
        >
          <div>
            <p class="eyebrow" style={{ marginBottom: '8px' }}>Detail Template</p>
            <h2 style={{ margin: 0 }}>标准详情页模板</h2>
            <span style={{ display: 'block', marginTop: '8px', color: 'var(--app-text-muted)' }}>
              按"信息块 + 操作区"组织，适配绝大多数后台详情场景。
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: '编辑', cls: 'action-btn-primary' },
              { label: '导出', cls: 'toolbar-btn' },
              {
                label: '终止项目',
                cls: 'toolbar-btn toolbar-btn-danger',
              },
            ].map((btn) => (
              <button key={btn.label} type="button" class={btn.cls}>
                {btn.label}
              </button>
            ))}
          </div>
        </section>

        {/* Info grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
            gap: '16px',
          }}
        >
          {infoGroups.map((group) => (
            <article key={group.title} class="panel" style={{ padding: '20px' }}>
              <h3 style={{ margin: 0 }}>{group.title}</h3>
              <dl style={{ margin: '14px 0 0', display: 'grid', gap: '10px' }}>
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,.74)',
                    }}
                  >
                    <dt style={{ color: 'var(--app-text-muted)' }}>{item.label}</dt>
                    <dd style={{ margin: 0, fontWeight: 600 }}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </main>
    )
  },
})
