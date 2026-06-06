<script setup lang="ts">
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
</script>

<template>
  <main class="detail-template">
    <section class="detail-template__hero">
      <div>
        <p>Detail Template</p>
        <h2>标准详情页模板</h2>
        <span>按“信息块 + 操作区”组织，适配绝大多数后台详情场景。</span>
      </div>
      <div class="detail-template__ops">
        <button type="button" class="op-btn is-primary">编辑</button>
        <button type="button" class="op-btn">导出</button>
        <button type="button" class="op-btn is-danger">终止项目</button>
      </div>
    </section>

    <section class="detail-template__grid">
      <article v-for="group in infoGroups" :key="group.title" class="detail-block">
        <h3>{{ group.title }}</h3>
        <dl>
          <div v-for="item in group.items" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </article>
    </section>
  </main>
</template>

<style scoped>
.detail-template {
  display: grid;
  gap: 18px;
}

.detail-template__hero,
.detail-block {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.detail-template__hero {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
}

.detail-template__hero p {
  margin: 0 0 8px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.detail-template__hero h2 {
  margin: 0;
}

.detail-template__hero span {
  display: block;
  margin-top: 8px;
  color: var(--app-text-muted);
}

.detail-template__ops {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.op-btn {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
}

.op-btn.is-primary {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}

.op-btn.is-danger {
  border-color: rgba(248, 113, 113, 0.3);
  color: #be123c;
}

.detail-template__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.detail-block {
  padding: 20px;
}

.detail-block h3 {
  margin: 0;
}

.detail-block dl {
  margin: 14px 0 0;
  display: grid;
  gap: 10px;
}

.detail-block dl > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.74);
}

.detail-block dt {
  color: var(--app-text-muted);
}

.detail-block dd {
  margin: 0;
  font-weight: 600;
}

@media (max-width: 960px) {
  .detail-template__hero,
  .detail-template__grid {
    grid-template-columns: 1fr;
  }

  .detail-template__hero {
    flex-direction: column;
  }
}
</style>
