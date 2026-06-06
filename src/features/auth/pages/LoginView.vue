<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useAuthStore } from '../../../stores/auth'

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
</script>

<template>
  <main class="login-view">
    <section class="login-view__visual">
      <div class="hero-copy">
        <p>Enterprise Dashboard Template</p>
        <h1>面向企业场景的 Vue 3 + TSX 后台骨架</h1>
        <span>
          登录、布局、权限、路由、主题、示例 CRUD 和可复用表格能力都已预留成独立模块，后续只需要把业务替换进去。
        </span>
      </div>

      <div class="feature-grid">
        <article>
          <strong>权限控制</strong>
          <span>路由级 + 按钮级</span>
        </article>
        <article>
          <strong>目录结构</strong>
          <span>Feature-first 拆分</span>
        </article>
        <article>
          <strong>主题系统</strong>
          <span>日间 / 夜间切换</span>
        </article>
        <article>
          <strong>请求层</strong>
          <span>Mock 与真实接口预留</span>
        </article>
      </div>
    </section>

    <section class="login-view__card">
      <div class="card-head">
        <div class="logo">X</div>
        <div>
          <p>欢迎回来</p>
          <h2>登录到模板控制台</h2>
        </div>
      </div>

      <el-form class="login-form" :model="form" @submit.prevent>
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="admin / viewer" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">进入系统</el-button>
      </el-form>

      <div class="login-footer">
        <span>试试输入 viewer 账号，可以看到权限差异。</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-view {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 420px);
  min-height: 100vh;
  padding: 24px;
  gap: 24px;
  background:
    radial-gradient(circle at top left, rgba(234, 188, 221, 0.24), transparent 30%),
    radial-gradient(circle at bottom right, rgba(164, 181, 213, 0.2), transparent 26%),
    linear-gradient(180deg, #20192b 0%, #171320 100%);
}

.login-view__visual,
.login-view__card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 28px;
  background: rgba(8, 15, 28, 0.66);
  backdrop-filter: blur(20px);
  box-shadow: 0 36px 80px rgba(2, 6, 23, 0.42);
}

.login-view__visual {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 42px;
  color: #e2e8f0;
}

.hero-copy p {
  margin: 0 0 12px;
  color: var(--app-accent);
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.hero-copy span {
  display: block;
  max-width: 52ch;
  margin-top: 16px;
  color: rgba(226, 232, 240, 0.72);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.feature-grid article {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.feature-grid strong {
  display: block;
  margin-bottom: 8px;
}

.feature-grid span {
  color: rgba(226, 232, 240, 0.68);
  font-size: 13px;
}

.login-view__card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  color: #e2e8f0;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.logo {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: var(--app-gradient-primary);
  color: #04111f;
  font-size: 22px;
  font-weight: 800;
}

.card-head p,
.card-head h2 {
  margin: 0;
}

.card-head p {
  color: var(--app-accent);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.card-head h2 {
  margin-top: 4px;
  font-size: 28px;
}

.login-form :deep(.el-form-item__label) {
  color: rgba(226, 232, 240, 0.82);
}

.login-form :deep(.el-input__wrapper) {
  background: rgba(15, 23, 42, 0.72);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.18);
}

.login-form :deep(.el-input__inner) {
  color: #f8fafc;
}

.login-button {
  width: 100%;
  margin-top: 10px;
}

.login-footer {
  margin-top: 18px;
  color: rgba(226, 232, 240, 0.68);
  font-size: 13px;
}

@media (max-width: 960px) {
  .login-view {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .login-view {
    padding: 12px;
  }

  .login-view__visual,
  .login-view__card {
    padding: 20px;
    border-radius: 22px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
