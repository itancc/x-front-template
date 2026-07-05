import { defineComponent } from 'vue'
import { ElButton, ElDialog } from 'element-plus'

export default defineComponent({
  name: 'XModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '680px',
    },
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  setup(props, { emit, slots }) {
    function close() {
      emit('update:modelValue', false)
      emit('cancel')
    }

    return () => (
      <ElDialog
        modelValue={props.modelValue}
        title={props.title}
        width={props.width}
        onClose={close}
        onUpdate:modelValue={(value) => emit('update:modelValue', value)}
        v-slots={{
          footer: () => (
            <div class="x-modal__footer">
              <ElButton onClick={close}>取消</ElButton>
              <ElButton type="primary" loading={props.loading} onClick={() => emit('confirm')}>确认</ElButton>
            </div>
          ),
        }}
      >
        {slots.default?.()}
      </ElDialog>
    )
  },
})
