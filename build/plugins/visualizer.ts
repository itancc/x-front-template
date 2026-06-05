// build/plugins/visualizer.ts
import { analyzer } from "vite-bundle-analyzer";
import type { PluginOption } from "vite";

/**
 * 打包体积分析插件
 * 官方文档: https://github.com/btd/rollup-plugin-visualizer
 */
export function configVisualizerPlugin(): PluginOption {
  return analyzer({
    analyzerMode:"server",
    openAnalyzer: true,
  }) as PluginOption;
}
