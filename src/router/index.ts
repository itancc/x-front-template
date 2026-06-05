import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [] as unknown as RouteRecordRaw[],
});
