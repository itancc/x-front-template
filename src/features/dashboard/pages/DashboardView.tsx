/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const stats = [
      { label: '今日新增用户', value: '126', delta: '+18%' },
      { label: '待处理工单', value: '23', delta: '-6%' },
      { label: '在线服务', value: '8', delta: '稳定' },
      { label: '系统健康度', value: '99.98%', delta: '+0.01%' },
    ]

    const shortcuts = [
      { title: '用户管理', desc: '查看列表、搜索、批量操作、详情页。', path: '/users' },
      { title: '系统设置', desc: '主题、布局和模板级偏好。', path: '/system/settings' },
      { title: '登录状态', desc: '演示权限守卫与访客登录流程。', path: '/login' },
    ]

    const timeline = [
      '完成路由壳、权限守卫和登录流程。',
      '拆分示例用户页，保留 XTable 作为复用核心。',
      '接入主题、标签页和基础菜单结构。',
    ]

    return () => (
      <main style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Hero card */}
        <section
          class="panel"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '24px',
            padding: '28px',
          }}
        >
          <div>
            <p class="eyebrow" style={{ marginBottom: '10px' }}>
              Control Center
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(30px,4vw,44px)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
              }}
            >
              现代企业后台模板的第一版骨架
            </h2>
            <p
              style={{
                maxWidth: '64ch',
                margin: '14px 0 0',
                color: 'var(--app-text-muted)',
              }}
            >
              现在的目标不是堆页面，而是把登录、布局、权限、菜单、标签页、请求层和功能模块拆清楚，后续业务页直接接入即可。
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              alignContent: 'center',
              justifyItems: 'center',
              gap: '8px',
              minWidth: '240px',
              padding: '22px',
              borderRadius: '22px',
              background:
                'linear-gradient(180deg,rgba(8,15,28,.94),rgba(15,23,42,.88))',
              color: '#e2e8f0',
            }}
          >
            <span style={{ fontSize: '13px' }}>Feature-first</span>
            <strong style={{ fontSize: '24px' }}>Vue 3 + TSX</strong>
            <span style={{ fontSize: '13px' }}>可直接作为项目起点</span>
          </div>
        </section>

        {/* Stats */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
            gap: '16px',
          }}
        >
          {stats.map((stat) => (
            <article
              key={stat.label}
              class="panel state-card"
              style={{ flexDirection: 'column', gap: 0 }}
            >
              <span style={{ color: 'var(--app-text-muted)', fontSize: '14px' }}>
                {stat.label}
              </span>
              <strong
                style={{
                  display: 'block',
                  marginTop: '10px',
                  fontSize: '34px',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </strong>
              <p style={{ margin: '10px 0 0', color: 'var(--app-accent-strong)' }}>
                {stat.delta}
              </p>
            </article>
          ))}
        </section>

        {/* Content grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
            gap: '18px',
          }}
        >
          <article class="panel" style={{ padding: '22px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>快捷入口</h3>
            <span
              style={{
                display: 'block',
                marginTop: '4px',
                color: 'var(--app-text-muted)',
              }}
            >
              直接跳转到核心模块
            </span>
            <div
              style={{
                display: 'grid',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              {shortcuts.map((item) => (
                <RouterLink
                  key={item.title}
                  to={item.path}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '16px',
                    borderRadius: '18px',
                    background:
                      'linear-gradient(135deg,var(--app-accent-soft),var(--app-accent-soft-strong))',
                    border: '1px solid rgba(148,163,184,.18)',
                    color: 'var(--app-text-main)',
                    textDecoration: 'none',
                  }}
                >
                  <strong>{item.title}</strong>
                  <span style={{ color: 'var(--app-text-muted)', fontSize: '13px' }}>
                    {item.desc}
                  </span>
                </RouterLink>
              ))}
            </div>
          </article>

          <article class="panel" style={{ padding: '22px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>接下来建议推进</h3>
            <span
              style={{
                display: 'block',
                marginTop: '4px',
                color: 'var(--app-text-muted)',
              }}
            >
              从结构到业务逐步补齐
            </span>
            <ol
              style={{
                margin: '16px 0 0',
                paddingLeft: '20px',
                display: 'grid',
                gap: '12px',
              }}
            >
              {timeline.map((item) => (
                <li key={item} style={{ color: 'var(--app-text-muted)' }}>
                  {item}
                </li>
              ))}
            </ol>
          </article>
        </section>
      </main>
    )
  },
})
