/**
 * Entry point для подключения DocumentTableWidget как кастомного компонента
 * в легаси-системе.
 *
 * Сборка:
 *   npx vite build --config vite.widget.config.ts
 *
 * Подключение в PHP-шаблоне:
 *   <script src="/assets/vue-dp-auto-table.js"></script>
 *
 * Регистрация (в вашем JS-инициализаторе):
 *   import { registerWidget } from './vue-dp-auto-table.js'
 *   registerWidget(registerCustomComponent)
 *
 * Или напрямую:
 *   registerCustomComponent('vue-dp-auto-table', window.VueDpAutoTable)
 */

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import DocumentTableWidget from './views/documents/DocumentTableWidget.vue'
import './scss/main.scss'

// AG-Grid требует явной регистрации модулей
ModuleRegistry.registerModules([AllCommunityModule])

/**
 * Регистрирует виджет через вашу функцию registerCustomComponent.
 *
 * @example
 *   registerWidget(registerCustomComponent)
 *   // эквивалентно:
 *   registerCustomComponent('vue-dp-auto-table', DocumentTableWidget)
 */
export function registerWidget(
  registerFn: (name: string, component: unknown) => void,
): void {
  registerFn('vue-dp-auto-table', DocumentTableWidget)
}

export { DocumentTableWidget }

// Для подключения через глобальный window (UMD/IIFE-сборка)
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>)['VueDpAutoTable'] = DocumentTableWidget
}
