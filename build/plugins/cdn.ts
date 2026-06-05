import { type PluginOption } from "vite";
import importToCDN from "vite-plugin-cdn-import";

export function createCDNPluginOptions(): PluginOption[] {
  return importToCDN({
    modules: [
      "vue",
      "vue-router",
      "axios",
      "dayjs",
      {
        name: "pinia",
        var: "Pinia",
        path: "dist/pinia.iife.min.js",
      },

      {
        name: "echarts",
        var: "echarts",
        path: "dist/echarts.min.js",
      },
    ],
  });
}
