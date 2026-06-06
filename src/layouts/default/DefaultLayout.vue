<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import RouteTabs from './components/RouteTabs.vue'
</script>

<template>
  <div class="default-layout">
    <AppSidebar />
    <div class="default-layout__main">
      <AppHeader />
      <RouteTabs />
      <main class="default-layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.default-layout {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  min-height: 100vh;
}

.default-layout__main {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  min-width: 0;
}

.default-layout__content {
  min-width: 0;
  padding: 20px 22px 28px;
}

@media (max-width: 1024px) {
  .default-layout {
    grid-template-columns: 1fr;
  }

  .default-layout__main {
    grid-template-rows: auto auto minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .default-layout__content {
    padding: 14px 12px 20px;
  }
}
</style>
