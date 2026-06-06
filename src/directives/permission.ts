import type { App, Directive, DirectiveBinding } from 'vue'

import { useAuthStore } from '../stores/auth'

type PermissionBinding = string | string[]

function hasPermission(binding: DirectiveBinding<PermissionBinding>) {
  const authStore = useAuthStore()
  const value = binding.value

  if (!value) {
    return true
  }

  if (typeof value === 'string') {
    return authStore.hasPermission(value)
  }

  if (Array.isArray(value)) {
    return value.some((permission) => authStore.hasPermission(permission))
  }

  return false
}

function updatePermission(el: HTMLElement, binding: DirectiveBinding<PermissionBinding>) {
  const visible = hasPermission(binding)

  if (visible) {
    el.style.display = ''
    return
  }

  el.style.display = 'none'
}

export const permissionDirective: Directive<HTMLElement, PermissionBinding> = {
  mounted(el, binding) {
    updatePermission(el, binding)
  },
  updated(el, binding) {
    updatePermission(el, binding)
  },
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
}
