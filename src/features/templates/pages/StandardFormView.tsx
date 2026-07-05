import { defineComponent, reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import XForm from '@/components/XForm'
import type { XFormField } from '@/components/XForm'
import XModal from '@/components/XModal'

export default defineComponent({
  name: 'StandardFormView',
  setup() {
    const submitting = ref(false)
    const previewVisible = ref(false)

    const form = reactive<Record<string, unknown>>({
      projectName: '',
      owner: '',
      budget: null,
      startDate: '',
      status: 'draft',
      remark: '',
    })

    const schema: XFormField[] = [
      { prop: 'projectName', label: '项目名称', type: 'input', placeholder: '例如：供应链协同平台' },
      { prop: 'owner', label: '负责人', type: 'input', placeholder: '例如：王海' },
      { prop: 'budget', label: '预算(万)', type: 'input-number', componentProps: { min: 1, step: 10 } },
      { prop: 'startDate', label: '开始日期', type: 'date' },
      {
        prop: 'status',
        label: '状态',
        type: 'segmented',
        options: [
          { label: '草稿', value: 'draft' },
          { label: '进行中', value: 'active' },
          { label: '暂停', value: 'paused' },
        ],
      },
      { prop: 'remark', label: '备注', type: 'textarea', span: 2, placeholder: '填写补充说明' },
    ]

    const rules: FormRules = {
      projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
      budget: [{ required: true, message: '请输入预算', trigger: 'blur' }],
      startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
    }

    async function submitForm() {
      submitting.value = true
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 560))
        ElMessage.success('提交成功，已进入待审核状态')
        previewVisible.value = true
      } finally {
        submitting.value = false
      }
    }

    function resetForm() {
      form.projectName = ''
      form.owner = ''
      form.budget = null
      form.startDate = ''
      form.status = 'draft'
      form.remark = ''
    }

    return () => (
      <main class="x-template-page">
        <section class="x-card">
          <p class="x-eyebrow">Form Template</p>
          <h2>标准表单页模板</h2>
        </section>

        <section class="x-card">
          <XForm
            modelValue={form}
            schema={schema}
            rules={rules}
            loading={submitting.value}
            onUpdate:modelValue={(value: Record<string, unknown>) => Object.assign(form, value)}
            onSubmit={submitForm}
            onReset={resetForm}
          />
        </section>

        <XModal modelValue={previewVisible.value} title="提交预览" loading={submitting.value} onUpdate:modelValue={(value: boolean) => (previewVisible.value = value)} onConfirm={() => (previewVisible.value = false)}>
          <dl class="x-preview-list">
            <div><dt>项目名称</dt><dd>{String(form.projectName || '-')}</dd></div>
            <div><dt>负责人</dt><dd>{String(form.owner || '-')}</dd></div>
            <div><dt>预算(万)</dt><dd>{String(form.budget || '-')}</dd></div>
            <div><dt>开始日期</dt><dd>{String(form.startDate || '-')}</dd></div>
            <div><dt>状态</dt><dd>{String(form.status || '-')}</dd></div>
          </dl>
        </XModal>
      </main>
    )
  },
})
