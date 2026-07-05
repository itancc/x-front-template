import { defineComponent, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'

import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const form = reactive({
      username: 'admin',
      password: '123456',
    })

    async function handleLogin() {
      loading.value = true
      try {
        await authStore.login(form)
        ElMessage.success('登录成功')
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
        await router.push(redirect)
      } finally {
        loading.value = false
      }
    }

    return () => (
      <main class="x-login-view">
        <section class="x-login-view__visual">
          <div class="x-login-view__copy">
            <p>Enterprise Dashboard Template</p>
            <h1>面向 CRM 业务风格的 TSX 后台骨架</h1>
            <span>统一 TSX、主题 token、配置驱动组件和 feature-first 目录，便于后续持续扩展。</span>
          </div>
        </section>

        <section class="x-login-view__card">
          <div class="x-login-view__title">
            <div class="x-login-view__logo">X</div>
            <div>
              <p>欢迎回来</p>
              <h2>登录到控制台</h2>
            </div>
          </div>

          <ElForm model={form} labelPosition="top">
            <ElFormItem label="账号">
              <ElInput modelValue={form.username} onUpdate:modelValue={(value) => (form.username = value)} placeholder="admin / viewer" />
            </ElFormItem>
            <ElFormItem label="密码">
              <ElInput
                modelValue={form.password}
                onUpdate:modelValue={(value) => (form.password = value)}
                type="password"
                showPassword
                placeholder="请输入密码"
              />
            </ElFormItem>
            <ElButton class="x-login-view__submit" type="primary" loading={loading.value} onClick={handleLogin}>
              进入系统
            </ElButton>
          </ElForm>
        </section>
      </main>
    )
  },
})
