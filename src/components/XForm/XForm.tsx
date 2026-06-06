/// <reference types="vue/jsx" />

import {
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSegmented,
  ElSwitch,
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'

import type { XFormField } from './types'
import './x-form.css'

export default defineComponent({
  name: 'XForm',
  props: {
    modelValue: {
      type: Object as () => Record<string, unknown>,
      required: true,
    },
    schema: {
      type: Array as () => XFormField[],
      required: true,
    },
    rules: {
      type: Object as () => FormRules,
      default: () => ({}),
    },
    columns: {
      type: Number,
      default: 2,
    },
    labelWidth: {
      type: [String, Number],
      default: 104,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: '提交',
    },
    resetText: {
      type: String,
      default: '重置',
    },
  },
  emits: ['update:modelValue', 'submit', 'reset'],
  setup(props, { emit, expose, slots }) {
    const formRef = ref<FormInstance>()

    const visibleSchema = computed(() => {
      return props.schema.filter((field) => (field.visible ? field.visible(props.modelValue) : true))
    })

    function updateField(prop: string, value: unknown) {
      emit('update:modelValue', {
        ...props.modelValue,
        [prop]: value,
      })
    }

    async function validate() {
      const result = await formRef.value?.validate().catch(() => false)
      return Boolean(result)
    }

    async function submit() {
      const valid = await validate()
      if (!valid) {
        return
      }

      emit('submit', props.modelValue)
    }

    function reset() {
      formRef.value?.resetFields()
      emit('reset')
    }

    function renderField(field: XFormField) {
      const modelValue = props.modelValue[field.prop]
      const commonProps = {
        placeholder: field.placeholder,
        ...(field.componentProps ?? {}),
      }

      if (field.type === 'custom' || field.slot) {
        const slotName = field.slot ?? field.prop
        return slots[slotName]?.({
          field,
          model: props.modelValue,
          update: (value: unknown) => updateField(field.prop, value),
        })
      }

      if (!field.type || field.type === 'input') {
        return (
          <ElInput
            modelValue={modelValue as any}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          />
        )
      }

      if (field.type === 'textarea') {
        return (
          <ElInput
            type="textarea"
            rows={4}
            modelValue={modelValue as any}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          />
        )
      }

      if (field.type === 'input-number') {
        return (
          <ElInputNumber
            modelValue={Number(modelValue ?? 0)}
            style={{ width: '100%' }}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          />
        )
      }

      if (field.type === 'date') {
        return (
          <ElDatePicker
            type="date"
            valueFormat="YYYY-MM-DD"
            modelValue={modelValue as any}
            style={{ width: '100%' }}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          />
        )
      }

      if (field.type === 'select') {
        return (
          <ElSelect
            modelValue={modelValue as any}
            style={{ width: '100%' }}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          >
            {(field.options ?? []).map((option) => (
              <ElOption key={String(option.value)} label={option.label} value={option.value} />
            ))}
          </ElSelect>
        )
      }

      if (field.type === 'segmented') {
        return (
          <ElSegmented
            modelValue={modelValue as any}
            options={field.options ?? []}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          />
        )
      }

      if (field.type === 'switch') {
        return (
          <ElSwitch
            modelValue={Boolean(modelValue)}
            {...commonProps}
            {...{ 'onUpdate:modelValue': (value: unknown) => updateField(field.prop, value) }}
          />
        )
      }

      return null
    }

    expose({
      formInstance: formRef,
      reset,
      validate,
    })

    return () => (
      <ElForm ref={formRef} model={props.modelValue} rules={props.rules} labelWidth={props.labelWidth} class="x-form">
        <div class="x-form__grid" style={{ '--x-form-columns': String(props.columns) } as Record<string, string>}>
          {visibleSchema.value.map((field) => (
            <ElFormItem
              key={field.prop}
              label={field.label}
              prop={field.prop}
              style={{
                '--x-form-span': String(Math.max(1, Math.min(props.columns, field.span ?? 1))),
              } as Record<string, string>}
            >
              {renderField(field)}
            </ElFormItem>
          ))}
        </div>

        {props.showActions ? (
          <div class="x-form__actions">
            <button type="button" class="x-form__btn is-primary" disabled={props.loading} onClick={submit}>
              {props.submitText}
            </button>
            <button type="button" class="x-form__btn" disabled={props.loading} onClick={reset}>
              {props.resetText}
            </button>
          </div>
        ) : null}
      </ElForm>
    )
  },
})
