<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import XForm from '../../../components/XForm'
import type { XFormField } from '../../../components/XForm'
import XModal from '../../../components/XModal'

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
</script>

<template>
  <main class="template-page">
    <section class="template-page__head">
      <p>Form Template</p>
      <h2>标准表单页模板</h2>
      <span>包含校验、提交态、重置能力，后续业务只需要替换字段和规则。</span>
    </section>

    <section class="template-page__card">
      <XForm
        :model-value="form"
        :schema="schema"
        :rules="rules"
        :loading="submitting"
        @update:model-value="(value) => Object.assign(form, value)"
        @submit="submitForm"
        @reset="resetForm"
      />
    </section>

    <XModal v-model="previewVisible" title="提交预览" :loading="submitting" @confirm="previewVisible = false">
      <dl class="template-page__preview">
        <div><dt>项目名称</dt><dd>{{ form.projectName || '-' }}</dd></div>
        <div><dt>负责人</dt><dd>{{ form.owner || '-' }}</dd></div>
        <div><dt>预算(万)</dt><dd>{{ form.budget || '-' }}</dd></div>
        <div><dt>开始日期</dt><dd>{{ form.startDate || '-' }}</dd></div>
        <div><dt>状态</dt><dd>{{ form.status || '-' }}</dd></div>
      </dl>
    </XModal>
  </main>
</template>

<style scoped>
.template-page {
  display: grid;
  gap: 18px;
}

.template-page__head,
.template-page__card {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
}

.template-page__head {
  padding: 24px;
}

.template-page__head p {
  margin: 0 0 8px;
  color: var(--app-accent-strong);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.template-page__head h2 {
  margin: 0;
}

.template-page__head span {
  display: block;
  margin-top: 8px;
  color: var(--app-text-muted);
}

.template-page__card {
  padding: 24px;
}

.template-page__preview {
  display: grid;
  gap: 8px;
  margin: 0;
}

.template-page__preview > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
}

.template-page__preview dt {
  color: var(--app-text-muted);
}

.template-page__preview dd {
  margin: 0;
  font-weight: 600;
}

@media (max-width: 640px) {
  .template-page__head,
  .template-page__card {
    padding: 16px;
  }
}
</style>
