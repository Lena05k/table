import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import DocumentPage from '@/views/documents/DocumentPage.vue'
import { doConfigs } from '@/views/documents/config'
import { mockData } from '@/views/documents/config/mockData'

function configToProps(route: RouteLocationNormalized): Record<string, unknown> {
  const configId = route.params.configId as string
  const cfg = doConfigs[configId]
  if (!cfg) return { project: configId }

  // ColDef[] → fieldAlias (PHP-формат, который читает DocumentPage.vue)
  const fieldAlias: Record<string, Record<string | number, unknown>> = {}
  cfg.columns.forEach((col, idx) => {
    if ('field' in col && col.field) {
      fieldAlias[col.field] = {
        0: col.headerName ?? col.field,
        ID: String(idx + 1),
        FIELD_TYPE: 'TEXT',
        CAN_SORTING: col.sortable !== false,
      }
    }
  })

  // flat rows → DataCell[][] (формат, который парсит DocumentPage.vue)
  const allRows = (mockData as Record<string, Record<string, unknown>[]>)[configId] ?? []
  const docIds: unknown[] = []
  const rowsArr = allRows.map((row, i) => {
    docIds.push(row.code ?? i + 1)
    return Object.entries(row)
      .filter(([k]) => k !== 'highlighted')
      .map(([k, v]) => ({
        sys_name: k,
        value: v !== null && v !== undefined ? String(v) : null,
        value_title: v !== null && v !== undefined ? String(v) : null,
        id: k,
        title: fieldAlias[k]?.[0] ?? k,
        type: 'TEXT',
      }))
  })

  return {
    project: configId,
    title: cfg.title,
    fieldAlias: JSON.stringify(fieldAlias),
    rowsJson: JSON.stringify(rowsArr),
    docIdsJson: JSON.stringify(docIds),
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/do/do2',
  },
  {
    path: '/do/:configId',
    name: 'document-list',
    component: DocumentPage,
    props: configToProps,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
