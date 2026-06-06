/// <reference types="vue/jsx" />

import { ElDialog } from 'element-plus'
import { defineComponent } from 'vue'

import './x-modal.css'

export default defineComponent({
  name: 'XModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '提示',
    },
    width: {
      type: [String, Number],
      default: 560,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: '确认',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'confirm', 'cancel', 'closed'],
  setup(props, { emit, slots }) {
    function updateVisible(value: boolean) {
      emit('update:modelValue', value)
    }

    function handleConfirm() {
      emit('confirm')
    }

    function handleCancel() {
      emit('cancel')
      updateVisible(false)
    }

    return () => (
      <ElDialog
        modelValue={props.modelValue}
        title={props.title}
        width={props.width}
        closeOnClickModal={props.closeOnClickModal}
        destroyOnClose={props.destroyOnClose}
        {...{
          'onUpdate:modelValue': updateVisible,
          onClosed: () => emit('closed'),
        }}
      >
        {{
          default: () => slots.default?.(),
          footer: () =>
            slots.footer?.() ?? (
              <div class="x-modal__footer">
                <button type="button" class="x-modal__btn" disabled={props.loading} onClick={handleCancel}>
                  {props.cancelText}
                </button>
                <button type="button" class="x-modal__btn is-primary" disabled={props.loading} onClick={handleConfirm}>
                  {props.confirmText}
                </button>
              </div>
            ),
        }}
      </ElDialog>
    )
  },
})
