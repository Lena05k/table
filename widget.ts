/**
 * Entry point для подключения DocumentsTable как кастомного компонента
 * в легаси-системе.
 *
 * Сборка:
 *   npx vite build --config vite.widget.config.ts
 *
 * Подключение в PHP-шаблоне:
 *   <script src="/assets/vue-dp-documents-table.js"></script>
 *
 * Регистрация (в вашем JS-инициализаторе):
 *   import { registerWidget } from './vue-dp-documents-table.js'
 *   registerWidget(registerCustomComponent)
 *
 * Или напрямую:
 *   registerCustomComponent('vue-dp-documents-table', window.VueDpDocumentsTable)
 */

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import DocumentsTable from './views/documents/DocumentsTable.vue'
import './scss/main.scss'

// AG-Grid требует явной регистрации модулей
ModuleRegistry.registerModules([AllCommunityModule])

/**
 * Регистрирует виджет через вашу функцию registerCustomComponent.
 *
 * @example
 *   registerWidget(registerCustomComponent)
 *   // эквивалентно:
 *   registerCustomComponent('vue-dp-documents-table', DocumentsTable)
 */
export function registerWidget(
  registerFn: (name: string, component: unknown) => void,
): void {
  registerFn('vue-dp-documents-table', DocumentsTable)
}

export { DocumentsTable }

// Для подключения через глобальный window (UMD/IIFE-сборка)
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>)['VueDpDocumentsTable'] = DocumentsTable
}
