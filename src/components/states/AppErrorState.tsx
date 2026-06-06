/// <reference types="vue/jsx" />

import { defineComponent } from 'vue'

import './states.css'

export default defineComponent({
  name: 'AppErrorState',
  props: {
    title: {
      type: String,
      default: '加载失败',
    },
    message: {
      type: String,
      default: '请求未成功完成，请稍后重试。',
    },
    retryText: {
      type: String,
      default: '重试',
    },
  },
  emits: {
    retry: () => true,
  },
  setup(props, { emit }) {
    return () => (
      <section class="app-error-state">
        <h3>{props.title}</h3>
        <p>{props.message}</p>
        <button type="button" class="app-error-state__btn" onClick={() => emit('retry')}>
          {props.retryText}
        </button>
      </section>
    )
  },
})
