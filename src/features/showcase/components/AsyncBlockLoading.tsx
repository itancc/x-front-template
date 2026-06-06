/// <reference types="vue/jsx" />

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AsyncBlockLoading',
  setup() {
    return () => <div class="async-block async-block--loading">组件加载中...</div>
  },
})
