<script setup lang="ts">
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
</script>

<template>
  <main class="dashboard-page">
    <section class="hero-card">
      <div>
        <p class="eyebrow">Control Center</p>
        <h2>现代企业后台模板的第一版骨架</h2>
        <p class="hero-copy">
          现在的目标不是堆页面，而是把登录、布局、权限、菜单、标签页、请求层和功能模块拆清楚，后续业务页直接接入即可。
        </p>
      </div>
      <div class="hero-orbit">
        <span>Feature-first</span>
        <strong>Vue 3 + TSX</strong>
        <span>可直接作为项目起点</span>
      </div>
    </section>

    <section class="stat-grid">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <span>{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.delta }}</p>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel-card">
        <div class="panel-head">
          <h3>快捷入口</h3>
          <span>直接跳转到核心模块</span>
        </div>
        <div class="shortcut-list">
          <RouterLink v-for="item in shortcuts" :key="item.title" :to="item.path" class="shortcut-item">
            <strong>{{ item.title }}</strong>
            <span>{{ item.desc }}</span>
          </RouterLink>
        </div>
      </article>

      <article class="panel-card">
        <div class="panel-head">
          <h3>接下来建议推进</h3>
          <span>从结构到业务逐步补齐</span>
        </div>
        <ol class="timeline-list">
          <li v-for="item in timeline" :key="item">{{ item }}</li>
        </ol>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-card,
.stat-card,
.panel-card {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-card h2 {
  margin: 0;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.hero-copy {
  max-width: 64ch;
  margin: 14px 0 0;
  color: var(--app-text-muted);
}

.hero-orbit {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 8px;
  min-width: 240px;
  padding: 22px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(8, 15, 28, 0.94), rgba(15, 23, 42, 0.88));
  color: #e2e8f0;
}

.hero-orbit strong {
  font-size: 24px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 18px 20px;
}

.stat-card span,
.panel-head span,
.shortcut-item span,
.timeline-list li {
  color: var(--app-text-muted);
}

.stat-card strong {
  display: block;
  margin-top: 10px;
  font-size: 34px;
  line-height: 1;
}

.stat-card p {
  margin: 10px 0 0;
  color: var(--app-accent-strong);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel-card {
  padding: 22px;
}

.panel-head h3 {
  margin: 0;
  font-size: 20px;
}

.panel-head span {
  display: block;
  margin-top: 4px;
}

.shortcut-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.shortcut-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--app-accent-soft), var(--app-accent-soft-strong));
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: var(--app-text-main);
  text-decoration: none;
}

.timeline-list {
  margin: 16px 0 0;
  padding-left: 20px;
  display: grid;
  gap: 12px;
}

@media (max-width: 960px) {
  .hero-card,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    flex-direction: column;
  }

  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .hero-card,
  .panel-card {
    padding: 18px;
  }
}
</style>
