// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import { createVitePlugins } from "./build/plugins";
import { createViteProxy } from "./build/proxy";
import { createViteDefine } from "./build/define";

export default defineConfig((config) => {
  return {
    base: "/",
    define: createViteDefine(config),
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@api": resolve(__dirname, "./src/api"),
        "@assets": resolve(__dirname, "./src/assets"),
        "#": resolve(__dirname, "./types"),
      },
    },

    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "@vueuse/core",
        "dayjs",
        "echarts",
        "axios",
      ],
    },

    plugins: createVitePlugins(config),

    server: {
      host: "0.0.0.0",
      port: 5678,
      open: false,
      proxy: createViteProxy(config),
    },
  };
});
