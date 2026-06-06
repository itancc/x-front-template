import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    guestOnly?: boolean
    permission?: string
    affix?: boolean
    hidden?: boolean
    fullScreen?: boolean
    routeKey?: string
  }
}