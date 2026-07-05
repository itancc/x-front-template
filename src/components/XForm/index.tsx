import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { FormRules } from 'element-plus'
import { ElButton, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect, ElSwitch } from 'element-plus'

export interface XFormFieldOption {
  label: string
  value: string | number | boolean
}

export interface XFormField {
  prop: string
  label: string
  type: 'input' | 'textarea' | 'input-number' | 'date' | 'switch' | 'segmented' | 'select'
  placeholder?: string
  span?: number
  options?: XFormFieldOption[]
  componentProps?: Record<string, unknown>
}

function buildGridStyle(columns: number) {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: '14px',
  }
}

export default defineComponent({
  name: 'XForm',
  props: {
    modelValue: {
      type: Object as PropType<Record<string, unknown>>,
      required: true,
    },
    schema: {
      type: Array as PropType<XFormField[]>,
      required: true,
    },
    rules: {
      type: Object as PropType<FormRules>,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Number,
      default: 2,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'submit', 'reset'],
  setup(props, { emit }) {
    const localModel = computed({
      get: () => props.modelValue,
      set: (value: Record<string, unknown>) => emit('update:modelValue', value),
    })

    function updateField(prop: string, value: unknown) {
      localModel.value = {
        ...localModel.value,
        [prop]: value,
      }
    }

    function renderField(field: XFormField) {
      const value = localModel.value[field.prop]
      const common = {
        placeholder: field.placeholder,
        ...(field.componentProps ?? {}),
      }

      if (field.type === 'textarea') {
        return <ElInput type="textarea" modelValue={String(value ?? '')} onUpdate:modelValue={(next) => updateField(field.prop, next)} {...common} />
      }

      if (field.type === 'input-number') {
        return <ElInputNumber modelValue={Number(value ?? 0)} onUpdate:modelValue={(next) => updateField(field.prop, next)} {...common} />
      }

      if (field.type === 'date') {
        return <ElDatePicker modelValue={String(value ?? '')} type="date" valueFormat="YYYY-MM-DD" onUpdate:modelValue={(next) => updateField(field.prop, next)} {...common} />
      }

      if (field.type === 'switch') {
        return <ElSwitch modelValue={Boolean(value)} onUpdate:modelValue={(next) => updateField(field.prop, next)} {...common} />
      }

      if (field.type === 'segmented' || field.type === 'select') {
        return (
          <ElSelect modelValue={value as string | number | boolean} onUpdate:modelValue={(next) => updateField(field.prop, next)} {...common}>
            {field.options?.map((option) => (
              <ElOption key={String(option.value)} label={option.label} value={option.value} />
            ))}
          </ElSelect>
        )
      }

      return <ElInput modelValue={String(value ?? '')} onUpdate:modelValue={(next) => updateField(field.prop, next)} {...common} />
    }

    return () => (
      <ElForm class="x-form" model={localModel.value} rules={props.rules} labelPosition="top">
        <div style={buildGridStyle(props.columns)}>
          {props.schema.map((field) => (
            <div key={field.prop} style={{ gridColumn: `span ${field.span ?? 1}` }}>
              <ElFormItem label={field.label} prop={field.prop}>
                {renderField(field)}
              </ElFormItem>
            </div>
          ))}
        </div>

        {props.showActions ? (
          <footer class="x-form__actions">
            <ElButton onClick={() => emit('reset')}>重置</ElButton>
            <ElButton type="primary" loading={props.loading} onClick={() => emit('submit')}>
              提交
            </ElButton>
          </footer>
        ) : null}
      </ElForm>
    )
  },
})
