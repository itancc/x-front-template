import { type ConfigEnv, type ProxyOptions } from "vite";

/**
 * 创建代理配置
 */
export function createViteProxy({
  mode,
}: ConfigEnv): Record<string, string | ProxyOptions> {
  if (mode !== "development") return {};
  return {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  };
}
