<template>
  <div class="tw-text-sm [&_.ag-row]:tw-cursor-pointer">
    <!-- ── Поиск + счётчик ─────────────────────────────────────────── -->
    <div class="tw-flex tw-items-center tw-gap-3 tw-py-2">
      <div class="tw-relative tw-shrink-0 tw-w-[280px]">
        <svg
          class="tw-absolute tw-left-[9px] tw-top-1/2 -tw-translate-y-1/2 tw-w-3.5 tw-h-3.5 tw-text-gray-400 tw-pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          class="tw-w-full tw-py-1.5 tw-pr-2.5 tw-pl-[30px] tw-text-[13px] tw-border tw-border-gray-300 tw-rounded tw-outline-none tw-bg-white focus:tw-border-orange-500 focus:tw-ring-2 focus:tw-ring-orange-500/15"
          placeholder="Поиск в таблице..."
          @input="onSearchInput"
        />
      </div>
      <span class="tw-text-xs tw-text-gray-500 tw-whitespace-nowrap">
        {{ rowData.length === allRowData.length
          ? `${allRowData.length} записей`
          : `${rowData.length} из ${allRowData.length}` }}
      </span>
    </div>

    <!-- ── AG-Grid ──────────────────────────────────────────────────── -->
    <AgGridVue
      theme="legacy"
      class="ag-theme-alpine tw-w-full"
      domLayout="autoHeight"
      :columnDefs="colDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :suppressPaginationPanel="true"
      @grid-ready="onGridReady"
      @row-clicked="onRowClicked"
    />

    <!-- ── Пустые состояния ─────────────────────────────────────────── -->
    <div v-if="rowData.length === 0 && allRowData.length > 0" class="tw-p-6 tw-text-center tw-text-gray-400 tw-text-[13px]">
      По запросу «{{ searchQuery }}» ничего не найдено
    </div>
    <div v-else-if="allRowData.length === 0" class="tw-p-6 tw-text-center tw-text-gray-400 tw-text-[13px]">
      Поиск не дал результатов
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community'
import type { FieldDef, DataCell, DocumentsTableProps } from './types/widget'

const props = withDefaults(defineProps<DocumentsTableProps>(), {
  docIdsJson: '[]',
  classId: '',
  parentDocumentId: '',
})

// ─── Парсинг JSON ─────────────────────────────────────────────────────────────

function safeJson<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) } catch { return fallback }
}

const fieldAlias = computed<Record<string, FieldDef>>(() =>
    safeJson(props.columnsJson, {}),
)

const rawRows = computed<DataCell[][]>(() =>
    safeJson(props.rowsJson, []),
)

const docIds = computed<string[]>(() =>
    safeJson(props.docIdsJson ?? '[]', []),
)

// ─── Преобразование строк ─────────────────────────────────────────────────────

const allRowData = computed<Record<string, unknown>[]>(() => {
  const raw  = rawRows.value
  const ids  = docIds.value
  const n    = raw.length
  const result = new Array<Record<string, unknown>>(n)
  for (let rowIdx = 0; rowIdx < n; rowIdx++) {
    const cells = raw[rowIdx]
    const cLen  = cells.length
    const row: Record<string, unknown> = {}
    let firstCellValue: string | null  = null
    for (let j = 0; j < cLen; j++) {
      const cell = cells[j]
      if (!cell?.sys_name) continue
      const display = cell.value_title ?? cell.value ?? ''
      row[cell.sys_name] = display
      if (firstCellValue === null) firstCellValue = String(cell.value ?? '')
    }
    row['_docId']   = ids[rowIdx] ?? firstCellValue ?? ''
    result[rowIdx]  = row
  }
  return result
})

// ─── Поиск ───────────────────────────────────────────────────────────────────

const searchQuery = ref('')
let _searchTimer: ReturnType<typeof setTimeout>

// Search index — built O(n·m) once per allRowData change.
// Per keystroke: O(n), one String.includes per row.
const searchIndex = computed<string[]>(() => {
  const data = allRowData.value
  const n    = data.length
  const idx  = new Array<string>(n)
  for (let i = 0; i < n; i++) {
    const row  = data[i]
    const keys = Object.keys(row)
    const kLen = keys.length
    let str    = ''
    for (let j = 0; j < kLen; j++) {
      const k = keys[j]
      if (k.charCodeAt(0) === 95) continue // skip '_' prefix fields
      if (str.length > 0) str += '\0'
      const v = row[k]
      if (v !== null && v !== undefined) str += v
    }
    idx[i] = str.toLowerCase()
  }
  return idx
})

const rowData = computed<Record<string, unknown>[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRowData.value
  const data   = allRowData.value
  const idx    = searchIndex.value
  const n      = data.length
  const result: Record<string, unknown>[] = []
  for (let i = 0; i < n; i++) {
    if (idx[i].includes(q)) result.push(data[i])
  }
  return result
})

function onSearchInput(e: Event): void {
  clearTimeout(_searchTimer)
  const val = (e.target as HTMLInputElement).value
  _searchTimer = setTimeout(() => { searchQuery.value = val }, 250)
}

// ─── AG-Grid ──────────────────────────────────────────────────────────────────

const gridApi = ref<GridApi | null>(null)

const colDefs = computed<ColDef[]>(() => {
  const entries = Object.entries(fieldAlias.value)
  const n       = entries.length
  const result  = new Array<ColDef>(n)
  for (let i = 0; i < n; i++) {
    const [sysName, field] = entries[i]
    result[i] = {
      colId:                    sysName,
      field:                    sysName,
      headerName:               field[0],
      sortable:                 field.CAN_SORTING,
      resizable:                true,
      minWidth:                 80,
      suppressHeaderMenuButton: !field.CAN_SORTING,
    }
  }
  return result
})

const defaultColDef: ColDef = {
  resizable: true,
  sortable: false,
  filter: false,
  minWidth: 80,
}

function onGridReady(params: GridReadyEvent): void {
  gridApi.value = params.api
}

// ─── Навигация по клику на строку ─────────────────────────────────────────────

function onRowClicked(e: RowClickedEvent<Record<string, unknown>>): void {
  if (!e.data) return
  const docId = e.data['_docId']
  if (!docId || !props.classId) return

  if (props.parentDocumentId) {
    const url = `/documents/?progectId=${props.classId}&parentDocumentId=${props.parentDocumentId}&documentId=${docId}`
    const openWindow = (window as unknown as Record<string, unknown>)['openWindow']
    if (typeof openWindow === 'function') {
      ;(openWindow as (u: string, w: number, h: number) => void)(url, 1100, 710)
    } else {
      window.open(url, '_blank', 'width=1100,height=710')
    }
  } else {
    window.location.href = `?progectId=${props.classId}&documentId=${docId}`
  }
}
</script>
