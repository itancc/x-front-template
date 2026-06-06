/// <reference types="vue/jsx" />

import { defineComponent } from 'vue'

import './states.css'

export default defineComponent({
  name: 'AppEmptyState',
  props: {
    title: {
      type: String,
      default: '暂无数据',
    },
    description: {
      type: String,
      default: '当前条件下没有可展示的数据。',
    },
    actionText: {
      type: String,
      default: '',
    },
  },
  emits: {
    action: () => true,
  },
  setup(props, { emit }) {
    return () => (
      <section class="app-empty-state">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        {props.actionText ? (
          <button type="button" class="app-empty-state__btn" onClick={() => emit('action')}>
            {props.actionText}
          </button>
        ) : null}
      </section>
    )
  },
})
