<template>
  <main class="exception-view">
    <section class="exception-card">
      <p class="eyebrow">404</p>
      <h1>页面不见了</h1>
      <p>你访问的页面不存在，可能是路由尚未配置，或者链接已经失效。</p>
      <RouterLink to="/dashboard" class="exception-button">回到首页</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.exception-view {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at top, rgba(164, 181, 213, 0.24), transparent 30%), #14101c;
}

.exception-card {
  display: grid;
  justify-items: start;
  gap: 12px;
  max-width: 560px;
  padding: 36px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 28px;
  background: rgba(8, 15, 28, 0.76);
  color: #e2e8f0;
}

.eyebrow {
  margin: 0;
  color: var(--app-accent-strong);
  letter-spacing: 0.2em;
}

.exception-card h1,
.exception-card p {
  margin: 0;
}

.exception-button {
  margin-top: 10px;
  min-height: 42px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: var(--app-gradient-primary);
  color: #04111f;
  text-decoration: none;
}
</style>
