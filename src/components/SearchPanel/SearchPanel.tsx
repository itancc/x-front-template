/// <reference types="vue/jsx" />

import { defineComponent } from 'vue'

import './search-panel.css'

export default defineComponent({
  name: 'SearchPanel',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    searchText: {
      type: String,
      default: '查询',
    },
    resetText: {
      type: String,
      default: '重置',
    },
  },
  emits: {
    search: () => true,
    reset: () => true,
  },
  setup(props, { emit, slots }) {
    return () => (
      <section class="search-panel">
        <div class="search-panel__fields">{slots.default?.()}</div>
        <div class="search-panel__actions">
          {slots.actions?.()}
          <button
            type="button"
            class="search-panel__btn is-primary"
            disabled={props.loading}
            onClick={() => emit('search')}
          >
            {props.searchText}
          </button>
          <button
            type="button"
            class="search-panel__btn"
            disabled={props.loading}
            onClick={() => emit('reset')}
          >
            {props.resetText}
          </button>
        </div>
      </section>
    )
  },
})
