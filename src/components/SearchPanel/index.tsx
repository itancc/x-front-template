import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ElButton } from 'element-plus'

export default defineComponent({
  name: 'XSearchPanel',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    searchText: {
      type: String,
      default: '搜索',
    },
    resetText: {
      type: String,
      default: '重置',
    },
  },
  emits: ['search', 'reset'],
  setup(props, { slots, emit }) {
    return () => (
      <section class="x-search-panel">
        <div class="x-search-panel__fields">{slots.default?.()}</div>
        <div class="x-search-panel__actions">
          {slots.actions?.()}
          <ElButton onClick={() => emit('reset')}>{props.resetText}</ElButton>
          <ElButton type="primary" loading={props.loading} onClick={() => emit('search')}>
            {props.searchText}
          </ElButton>
        </div>
      </section>
    )
  },
})
