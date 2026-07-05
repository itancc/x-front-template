import { computed, defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { EChartsOption } from 'echarts'

import type { XFormField } from '@/components/XForm'
import XChart from '@/components/XChart'
import XForm from '@/components/XForm'
import XModal from '@/components/XModal'

export default defineComponent({
  name: 'ComponentShowcaseView',
  setup() {
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
      { prop: 'remark', label: '备注', type: 'textarea', span: 2, placeholder: '补充说明...' },
    ]

    const chartOption = computed<EChartsOption>(() => {
      const labels = trendType.value === 'week' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] : ['第1周', '第2周', '第3周', '第4周']
      const values = trendType.value === 'week' ? [88, 92, 110, 134, 120, 138, 142] : [420, 468, 510, 572]
      return {
        tooltip: { trigger: 'axis' },
        grid: { left: 20, right: 20, top: 32, bottom: 16, containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', smooth: true, data: values, areaStyle: { opacity: 0.2 }, lineStyle: { width: 3 } }],
      }
    })

    async function refreshChart() {
      chartLoading.value = true
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 380))
      } finally {
        chartLoading.value = false
      }
    }

    async function confirmModal() {
      submitting.value = true
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 480))
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

    return () => (
      <main class="x-showcase-page">
        <section class="x-card">
          <p class="x-eyebrow">Components Showcase</p>
          <h2>二次封装组件示例</h2>
        </section>

        <section class="x-showcase-grid">
          <article class="x-card">
            <div class="x-showcase-head">
              <h3>XChart</h3>
              <div>
                <button type="button" class="x-btn" onClick={() => (trendType.value = trendType.value === 'week' ? 'month' : 'week')}>切换周期</button>
                <button type="button" class="x-btn x-btn--primary" onClick={refreshChart}>刷新数据</button>
              </div>
            </div>
            <XChart option={chartOption.value} loading={chartLoading.value} height="320px" />
          </article>

          <article class="x-card">
            <div class="x-showcase-head">
              <h3>XModal + XForm</h3>
              <button type="button" class="x-btn x-btn--primary" onClick={() => (modalVisible.value = true)}>打开弹窗表单</button>
            </div>
            <XForm modelValue={modalForm} schema={modalSchema} showActions={false} columns={2} />
          </article>
        </section>

        <XModal modelValue={modalVisible.value} title="创建任务" loading={submitting.value} onUpdate:modelValue={(value: boolean) => (modalVisible.value = value)} onConfirm={confirmModal} onCancel={resetModal}>
          <XForm modelValue={modalForm} schema={modalSchema} showActions={false} columns={2} />
        </XModal>
      </main>
    )
  },
})
