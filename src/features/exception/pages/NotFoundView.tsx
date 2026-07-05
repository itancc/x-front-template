/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'NotFoundView',
  setup() {
    return () => (
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          padding: '24px',
          background:
            'radial-gradient(circle at top,rgba(164,181,213,.24),transparent 30%),#14101c',
        }}
      >
        <section
          style={{
            display: 'grid',
            justifyItems: 'start',
            gap: '12px',
            maxWidth: '560px',
            padding: '36px',
            border: '1px solid rgba(148,163,184,.2)',
            borderRadius: '28px',
            background: 'rgba(8,15,28,.76)',
            color: '#e2e8f0',
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--app-accent-strong)',
              letterSpacing: '.2em',
            }}
          >
            404
          </p>
          <h1 style={{ margin: 0 }}>页面不见了</h1>
          <p style={{ margin: 0 }}>
            你访问的页面不存在，可能是路由尚未配置，或者链接已经失效。
          </p>
          <RouterLink
            to="/dashboard"
            style={{
              marginTop: '10px',
              minHeight: '42px',
              padding: '0 16px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '999px',
              background: 'var(--app-gradient-primary)',
              color: '#04111f',
              textDecoration: 'none',
            }}
          >
            回到首页
          </RouterLink>
        </section>
      </main>
    )
  },
})
