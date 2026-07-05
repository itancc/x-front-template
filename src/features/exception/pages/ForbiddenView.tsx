import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'ForbiddenView',
  setup() {
    return () => (
      <main class="x-exception">
        <section class="x-exception__card">
          <p class="x-eyebrow">403</p>
          <h1>你没有访问这个页面的权限</h1>
          <p>当前账号缺少对应权限。你可以返回工作台，或者使用更高权限账号重新登录。</p>
          <RouterLink to="/dashboard" class="x-btn x-btn--primary">返回工作台</RouterLink>
        </section>
      </main>
    )
  },
})
