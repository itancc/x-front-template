/// <reference types="vue/jsx" />

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AsyncBlockError',
  setup() {
    return () => <div class="async-block async-block--error">组件加载失败，请刷新后重试。</div>
  },
})
