/**
 * Entry point для кастомного элемента <vue-app-navbar>.
 *
 * Сборка:
 *   npx vite build --config vite.navbar.config.ts
 *
 * Подключение в PHP-шаблоне:
 *   <script src="/assets/vue-app-navbar.js"></script>
 *   <vue-app-navbar user-json='...' menu-json='...'></vue-app-navbar>
 */

import { defineCustomElement } from 'vue'
import AppNavbar from './views/navbar/AppNavbar.vue'

const AppNavbarElement = defineCustomElement(AppNavbar, { shadowRoot: false })

export function registerNavbar(): void {
  if (!customElements.get('vue-app-navbar')) {
    customElements.define('vue-app-navbar', AppNavbarElement)
  }
}

export { AppNavbarElement }

if (typeof window !== 'undefined') {
  registerNavbar()
  ;(window as unknown as Record<string, unknown>)['VueAppNavbar'] = AppNavbarElement
}
