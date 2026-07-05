import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

const stats = [
  { label: '今日新增客户', value: '126', delta: '+18%' },
  { label: '待处理工单', value: '23', delta: '-6%' },
  { label: '在线服务', value: '8', delta: '稳定' },
  { label: '系统健康度', value: '99.98%', delta: '+0.01%' },
]

const shortcuts = [
  { title: '用户管理', desc: '查看列表、筛选、批量操作和详情。', path: '/users' },
  { title: '系统设置', desc: '主题、布局和基础偏好。', path: '/system/settings' },
  { title: '组件封装', desc: '配置化组件示例集合。', path: '/components/showcase' },
]

export default defineComponent({
  name: 'DashboardView',
  setup() {
    return () => (
      <main class="x-dashboard">
        <section class="x-dashboard__hero">
          <div>
            <p>Control Center</p>
            <h2>CRM 后台框架已切换到全 TSX 架构</h2>
            <span>统一页面风格、组件命名和状态模型，降低后续业务接入成本。</span>
          </div>
        </section>

        <section class="x-dashboard__stats">
          {stats.map((item) => (
            <article key={item.label} class="x-dashboard__stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.delta}</p>
            </article>
          ))}
        </section>

        <section class="x-dashboard__panels">
          <article class="x-dashboard__panel">
            <h3>快捷入口</h3>
            <div class="x-dashboard__links">
              {shortcuts.map((item) => (
                <RouterLink key={item.title} to={item.path} class="x-dashboard__link-item">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </RouterLink>
              ))}
            </div>
          </article>
        </section>
      </main>
    )
  },
})
