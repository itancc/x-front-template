import type { App } from 'vue'
import { setupRippleDirective, type RippleDirective } from './ripple'

export function setupGlobDirectives(app: App<Element>) {
  setupRippleDirective(app) // 水波纹指令
}

export type { RippleDirective }
