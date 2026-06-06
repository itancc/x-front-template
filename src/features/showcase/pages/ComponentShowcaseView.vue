<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import type { AsyncComponentLoader, Component } from 'vue'
import { ElMessage } from 'element-plus'
import type { EChartsOption } from 'echarts'

import type { XFormField } from '../../../components/XForm'
import AsyncBlockError from '../components/AsyncBlockError'
import AsyncBlockLoading from '../components/AsyncBlockLoading'

function loadShowcaseComponent(loader: AsyncComponentLoader<Component>) {
  return defineAsyncComponent({
    loader,
    loadingComponent: AsyncBlockLoading,
    errorComponent: AsyncBlockError,
    delay: 120,
    timeout: 10000,
    suspensible: false,
  })
}

const XChart = loadShowcaseComponent(() => import('../../../components/XChart'))
const XForm = loadShowcaseComponent(() => import('../../../components/XForm'))
const XModal = loadShowcaseComponent(() => import('../../../components/XModal'))

const modalVisible = ref(false)
const submitting = ref(false)
const chartLoading = ref(false)

const trendType = ref<'week' | 'month'>('week')

const modalForm = reactive<Record<string, unknown>>({
  name: '',
  owner: '',
  priority: 'medium',
  notify: true,
  remark: '',
})

const modalSchema: XFormField[] = [
  { prop: 'name', label: '任务名称', type: 'input', placeholder: '例如：发布 6 月版本' },
  { prop: 'owner', label: '负责人', type: 'input', placeholder: '例如：王海' },
  {
    prop: 'priority',
    label: '优先级',
    type: 'segmented',
    options: [
      { label: '高', value: 'high' },
      { label: '中', value: 'medium' },
      { label: '低', value: 'low' },
    ],
  },
  { prop: 'notify', label: '通知提醒', type: 'switch' },
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea',
    span: 2,
    placeholder: '补充说明...',
  },
]

const chartOption = computed<EChartsOption>(() => {
  const labels = trendType.value === 'week'
    ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    : ['第1周', '第2周', '第3周', '第4周']

  const values = trendType.value === 'week'
    ? [88, 92, 110, 134, 120, 138, 142]
    : [420, 468, 510, 572]

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 20, right: 20, top: 32, bottom: 16, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: '#cbd5e1' },
      },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: values,
        areaStyle: {
          opacity: 0.2,
        },
        lineStyle: {
          width: 3,
        },
      },
    ],
  }
})

async function refreshChart() {
  chartLoading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 420))
  } finally {
    chartLoading.value = false
  }
}

async function confirmModal() {
  submitting.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    ElMessage.success(`任务 ${String(modalForm.name || '-')} 已创建`)
    modalVisible.value = false
  } finally {
    submitting.value = false
  }
}

function resetModal() {
  modalForm.name = ''
  modalForm.owner = ''
  modalForm.priority = 'medium'
  modalForm.notify = true
  modalForm.remark = ''
}
</script>

<template>
  <main class="showcase-page">
    <section class="showcase-page__head">
      <p>Components Showcase</p>
      <h2>二次封装组件示例</h2>
      <span>XForm + XModal + XChart 均可按 schema/配置扩展，业务页面只需组合。</span>
    </section>

    <section class="showcase-page__cards">
      <article class="showcase-card">
        <div class="showcase-card__title">
          <h3>XChart</h3>
          <div class="showcase-card__actions">
            <button type="button" class="x-btn" @click="trendType = trendType === 'week' ? 'month' : 'week'">切换周期</button>
            <button type="button" class="x-btn is-primary" @click="refreshChart">刷新数据</button>
          </div>
        </div>
        <XChart :option="chartOption" :loading="chartLoading" height="320px" />
      </article>

      <article class="showcase-card">
        <div class="showcase-card__title">
          <h3>XModal + XForm</h3>
          <button type="button" class="x-btn is-primary" @click="modalVisible = true">打开弹窗表单</button>
        </div>
        <XForm :model-value="modalForm" :schema="modalSchema" :show-actions="false" :columns="2" />
      </article>
    </section>

    <XModal v-model="modalVisible" title="创建任务" :loading="submitting" @confirm="confirmModal" @cancel="resetModal">
      <XForm :model-value="modalForm" :schema="modalSchema" :show-actions="false" :columns="2" />
    </XModal>
  </main>
</template>

<style scoped>
.showcase-page {
  display: grid;
  gap: 18px;
}

.showcase-page__head,
.showcase-card {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.showcase-page__head {
  padding: 24px;
}

.showcase-page__head p {
  margin: 0 0 8px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.showcase-page__head h2 {
  margin: 0;
}

.showcase-page__head span {
  display: block;
  margin-top: 8px;
  color: var(--app-text-muted);
}

.showcase-page__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.showcase-card {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.showcase-card__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.showcase-card__title h3 {
  margin: 0;
}

.showcase-card__actions {
  display: flex;
  gap: 8px;
}

.x-btn {
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
}

.x-btn.is-primary {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}

.async-block {
  display: grid;
  place-items: center;
  min-height: 140px;
  padding: 12px;
  border: 1px dashed var(--app-border);
  border-radius: 14px;
  color: var(--app-text-muted);
  background: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}

.async-block--loading {
  animation: async-pulse 1.1s ease-in-out infinite alternate;
}

.async-block--error {
  border-style: solid;
  border-color: rgba(248, 113, 113, 0.45);
  color: #b91c1c;
  background: rgba(254, 242, 242, 0.9);
}

@keyframes async-pulse {
  from {
    opacity: 0.62;
  }

  to {
    opacity: 1;
  }
}

@media (max-width: 960px) {
  .showcase-page__cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .showcase-page__head,
  .showcase-card {
    padding: 14px;
  }
}
</style>
