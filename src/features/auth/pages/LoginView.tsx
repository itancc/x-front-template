/// <reference types="vue/jsx" />
import { defineComponent, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'

import { useAuthStore } from '../../../stores/auth'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const loading = ref(false)
    const form = reactive({ username: 'admin', password: '123456' })

    async function handleLogin() {
      loading.value = true
      try {
        await authStore.login(form)
        ElMessage.success('登录成功')
        const redirect =
          typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
        await router.push(redirect)
      } finally {
        loading.value = false
      }
    }

    const features = [
      { title: '权限控制', desc: '路由级 + 按钮级' },
      { title: '目录结构', desc: 'Feature-first 拆分' },
      { title: '主题系统', desc: '日间 / 夜间 + 色板' },
      { title: '请求层', desc: 'Mock 与真实接口预留' },
    ]

    return () => (
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.2fr) minmax(360px,420px)',
          minHeight: '100vh',
          padding: '24px',
          gap: '24px',
          background:
            'radial-gradient(circle at top left,rgba(234,188,221,.24),transparent 30%),' +
            'radial-gradient(circle at bottom right,rgba(164,181,213,.2),transparent 26%),' +
            'linear-gradient(180deg,#20192b 0%,#171320 100%)',
        }}
      >
        {/* Visual panel */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '42px',
            border: '1px solid rgba(148,163,184,.2)',
            borderRadius: '28px',
            background: 'rgba(8,15,28,.66)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 36px 80px rgba(2,6,23,.42)',
            color: '#e2e8f0',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 12px',
                color: 'var(--app-accent)',
                fontSize: '13px',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
              }}
            >
              Enterprise Dashboard Template
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(34px,4.2vw,54px)',
                lineHeight: 1.02,
                letterSpacing: '-0.05em',
              }}
            >
              面向企业场景的 Vue 3 + TSX 后台骨架
            </h1>
            <span
              style={{
                display: 'block',
                maxWidth: '52ch',
                marginTop: '16px',
                color: 'rgba(226,232,240,.72)',
              }}
            >
              登录、布局、权限、路由、主题、示例 CRUD 和可复用表格能力都已预留成独立模块，后续只需要把业务替换进去。
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            {features.map((f) => (
              <article
                key={f.title}
                style={{
                  padding: '18px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(148,163,184,.18)',
                }}
              >
                <strong style={{ display: 'block', marginBottom: '8px' }}>{f.title}</strong>
                <span style={{ color: 'rgba(226,232,240,.68)', fontSize: '13px' }}>{f.desc}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Login card */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '34px',
            border: '1px solid rgba(148,163,184,.2)',
            borderRadius: '28px',
            background: 'rgba(8,15,28,.66)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 36px 80px rgba(2,6,23,.42)',
            color: '#e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '18px',
                background: 'var(--app-gradient-primary)',
                color: '#04111f',
                fontSize: '22px',
                fontWeight: 800,
              }}
            >
              X
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  color: 'var(--app-accent)',
                  fontSize: '13px',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                }}
              >
                欢迎回来
              </p>
              <h2 style={{ margin: '4px 0 0', fontSize: '28px' }}>登录到模板控制台</h2>
            </div>
          </div>

          <ElForm model={form}>
            <ElFormItem label="账号">
              <ElInput
                v-model={form.username}
                placeholder="admin / viewer"
                style={{ '--el-input-bg-color': 'rgba(15,23,42,.72)' }}
              />
            </ElFormItem>
            <ElFormItem label="密码">
              <ElInput
                v-model={form.password}
                type="password"
                placeholder="请输入密码"
                showPassword
              />
            </ElFormItem>
            <ElButton
              type="primary"
              loading={loading.value}
              style={{ width: '100%', marginTop: '10px' }}
              onClick={handleLogin}
            >
              进入系统
            </ElButton>
          </ElForm>

          <div
            style={{
              marginTop: '18px',
              color: 'rgba(226,232,240,.68)',
              fontSize: '13px',
            }}
          >
            试试输入 viewer 账号，可以看到权限差异。
          </div>
        </section>
      </main>
    )
  },
})
