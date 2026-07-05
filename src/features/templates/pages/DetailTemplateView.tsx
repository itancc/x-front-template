import { defineComponent } from 'vue'

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

export default defineComponent({
  name: 'DetailTemplateView',
  setup() {
    return () => (
      <main class="x-detail-template">
        <section class="x-card">
          <p class="x-eyebrow">Detail Template</p>
          <h2>标准详情页模板</h2>
        </section>

        <section class="x-detail-template__grid">
          {infoGroups.map((group) => (
            <article key={group.title} class="x-card">
              <h3>{group.title}</h3>
              <dl class="x-preview-list">
                {group.items.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>
      </main>
    )
  },
})
