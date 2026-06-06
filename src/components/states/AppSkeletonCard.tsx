/// <reference types="vue/jsx" />

import { defineComponent } from 'vue'

import './states.css'

export default defineComponent({
  name: 'AppSkeletonCard',
  props: {
    rows: {
      type: Number,
      default: 4,
    },
  },
  setup(props) {
    return () => (
      <section class="app-skeleton-card">
        <div class="app-skeleton-card__head" />
        {Array.from({ length: props.rows }, (_, index) => (
          <div key={index} class="app-skeleton-card__line" />
        ))}
      </section>
    )
  },
})
