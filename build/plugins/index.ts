import { type PluginOption, type ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { configVisualizerPlugin } from "./visualizer"; // 🔴 引入刚写好的配置
import vueDevTools from "vite-plugin-vue-devtools";
import viteAutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import unpluginViteComponents from "unplugin-vue-components/vite";
import unoCSS from "unocss/vite";
import { createCDNPluginOptions } from "./cdn";
import { config } from "../config";

function basePluginOptions(): PluginOption[] {
  return [
    // 核心插件
    vue(),
    vueJsx(),
    viteAutoImport({
      eslintrc: {
        enabled: true,
        filepath: "./unplugin/.eslintrc-auto-import.json",
      },
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: "./unplugin/auto-imports.d.ts",
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver()],
    }),
    unpluginViteComponents({
      dts: "./unplugin/components.d.ts",
      resolvers: [ElementPlusResolver()],
    }),
    unoCSS(),
  ];
}

function reportPluginOptions(): PluginOption[] {
  return [configVisualizerPlugin()];
}

function productionPluginOptions(): PluginOption[] {
  const { enableCDN } = config;
  const cdnPluginOptions = enableCDN ? createCDNPluginOptions() : [];
  return [...cdnPluginOptions];
}

export function createVitePlugins({ mode }: ConfigEnv): PluginOption[] {
  const envVitePluginsMap: Record<string, PluginOption[]> = {
    report: reportPluginOptions(),
    development: [vueDevTools()],
    production: productionPluginOptions(),
  };

  const envVitePlugins: PluginOption[] = envVitePluginsMap?.[mode] || [];

  return [...basePluginOptions(), ...envVitePlugins];
}
