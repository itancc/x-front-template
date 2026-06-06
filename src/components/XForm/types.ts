import type { FormRules } from 'element-plus'

export type XFormFieldType =
  | 'input'
  | 'textarea'
  | 'input-number'
  | 'date'
  | 'select'
  | 'segmented'
  | 'switch'
  | 'custom'

export interface XFormOption {
  label: string
  value: string | number | boolean
}

export interface XFormField {
  prop: string
  label: string
  type?: XFormFieldType
  span?: number
  placeholder?: string
  options?: XFormOption[]
  visible?: (model: Record<string, unknown>) => boolean
  componentProps?: Record<string, unknown>
  slot?: string
}

export interface XFormSchemaProps {
  modelValue: Record<string, unknown>
  schema: XFormField[]
  rules?: FormRules
  columns?: number
  labelWidth?: string | number
  loading?: boolean
  showActions?: boolean
  submitText?: string
  resetText?: string
}
