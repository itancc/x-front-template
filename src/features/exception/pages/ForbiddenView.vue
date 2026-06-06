<template>
  <main class="exception-view">
    <section class="exception-card">
      <p class="eyebrow">403</p>
      <h1>你没有访问这个页面的权限</h1>
      <p>当前账号缺少对应权限。你可以返回工作台，或者使用更高权限账号重新登录。</p>
      <RouterLink to="/dashboard" class="exception-button">返回工作台</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.exception-view {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at top, rgba(234, 188, 221, 0.2), transparent 32%), #16121e;
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
  color: var(--app-accent);
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
