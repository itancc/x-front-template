/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'ForbiddenView',
  setup() {
    return () => (
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          padding: '24px',
          background:
            'radial-gradient(circle at top,rgba(234,188,221,.2),transparent 32%),#16121e',
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
              color: 'var(--app-accent)',
              letterSpacing: '.2em',
            }}
          >
            403
          </p>
          <h1 style={{ margin: 0 }}>你没有访问这个页面的权限</h1>
          <p style={{ margin: 0 }}>
            当前账号缺少对应权限。你可以返回工作台，或者使用更高权限账号重新登录。
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
            返回工作台
          </RouterLink>
        </section>
      </main>
    )
  },
})
