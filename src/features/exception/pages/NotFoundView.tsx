import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'NotFoundView',
  setup() {
    return () => (
      <main class="x-exception">
        <section class="x-exception__card">
          <p class="x-eyebrow">404</p>
          <h1>页面不见了</h1>
          <p>你访问的页面不存在，可能是路由尚未配置，或者链接已经失效。</p>
          <RouterLink to="/dashboard" class="x-btn x-btn--primary">回到首页</RouterLink>
        </section>
      </main>
    )
  },
})
