/// <reference types="vue/jsx" />
import { defineComponent, reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import XForm from '../../../components/XForm'
import type { XFormField } from '../../../components/XForm'
import XModal from '../../../components/XModal'

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
      {
        prop: 'projectName',
        label: '项目名称',
        type: 'input',
        placeholder: '例如：供应链协同平台',
      },
      { prop: 'owner', label: '负责人', type: 'input', placeholder: '例如：王海' },
      {
        prop: 'budget',
        label: '预算(万)',
        type: 'input-number',
        componentProps: { min: 1, step: 10 },
      },
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
        await new Promise((resolve) => window.setTimeout(resolve, 600))
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
      <main style={{ display: 'grid', gap: '18px' }}>
        <section class="panel" style={{ padding: '24px' }}>
          <p class="eyebrow" style={{ marginBottom: '8px' }}>Form Template</p>
          <h2 style={{ margin: 0 }}>标准表单页模板</h2>
          <span style={{ display: 'block', marginTop: '8px', color: 'var(--app-text-muted)' }}>
            包含校验、提交态、重置能力，后续业务只需要替换字段和规则。
          </span>
        </section>

        <section class="panel" style={{ padding: '24px' }}>
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

        <XModal
          modelValue={previewVisible.value}
          title="提交预览"
          loading={submitting.value}
          onUpdate:modelValue={(v: boolean) => (previewVisible.value = v)}
          onConfirm={() => (previewVisible.value = false)}
        >
          {{
            default: () => (
              <dl style={{ display: 'grid', gap: '8px', margin: 0 }}>
                {[
                  { dt: '项目名称', dd: form.projectName },
                  { dt: '负责人', dd: form.owner },
                  { dt: '预算(万)', dd: form.budget },
                  { dt: '开始日期', dd: form.startDate },
                  { dt: '状态', dd: form.status },
                ].map((row) => (
                  <div
                    key={row.dt}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,.72)',
                    }}
                  >
                    <dt style={{ color: 'var(--app-text-muted)' }}>{row.dt}</dt>
                    <dd style={{ margin: 0, fontWeight: 600 }}>
                      {String(row.dd || '-')}
                    </dd>
                  </div>
                ))}
              </dl>
            ),
          }}
        </XModal>
      </main>
    )
  },
})
