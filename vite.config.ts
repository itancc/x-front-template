import { resolve } from 'path'
import { defineConfig } from 'vite'

import { createViteDefine } from './build/define'
import { createVitePlugins } from './build/plugins'
import { createViteProxy } from './build/proxy'

const NODE_MODULES = 'node_modules'
const ECHARTS_PACKAGE = `${NODE_MODULES}/echarts`
const ELEMENT_PLUS_PACKAGE = `${NODE_MODULES}/element-plus`

function resolveManualChunk(id: string) {
  if (id.includes(ECHARTS_PACKAGE)) {
    return 'vendor-echarts'
  }

  if (id.includes(ELEMENT_PLUS_PACKAGE)) {
    return 'vendor-element-plus'
  }

  if (id.includes(NODE_MODULES)) {
    return 'vendor'
  }

  return undefined
}

export default defineConfig((config) => {
  return {
    base: '/',
    envDir: 'env',
    define: createViteDefine(config),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@api': resolve(__dirname, './src/api'),
        '@assets': resolve(__dirname, './src/assets'),
        '@styles': resolve(__dirname, './src/styles'),
        '#': resolve(__dirname, './types'),
      },
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'dayjs',
        'echarts',
        'axios',
      ],
    },

    plugins: createVitePlugins(config),

    build: {
      rollupOptions: {
        output: {
          manualChunks: resolveManualChunk,
        },
      },
    },

    server: {
      host: '0.0.0.0',
      port: 5678,
      open: false,
      proxy: createViteProxy(config),
    },
  }
})
