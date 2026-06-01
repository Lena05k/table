<template>
  <div class="text-sm [&_.ag-row]:cursor-pointer">
    <!-- ── Поиск + счётчик ─────────────────────────────────────────── -->
    <div class="flex items-center gap-3 py-2">
      <div class="relative shrink-0 w-[280px]">
        <svg
          class="absolute left-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          class="w-full py-1.5 pr-2.5 pl-[30px] text-[13px] border border-gray-300 rounded outline-none bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
          placeholder="Поиск в таблице..."
          @input="onSearchInput"
        />
      </div>
      <span class="text-xs text-gray-500 whitespace-nowrap">
        {{ rowData.length === allRowData.length
          ? `${allRowData.length} записей`
          : `${rowData.length} из ${allRowData.length}` }}
      </span>
    </div>

    <!-- ── AG-Grid ──────────────────────────────────────────────────── -->
    <AgGridVue
      theme="legacy"
      class="ag-theme-alpine w-full"
      domLayout="autoHeight"
      :columnDefs="colDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :suppressPaginationPanel="true"
      @grid-ready="onGridReady"
      @row-clicked="onRowClicked"
    />

    <!-- ── Пустые состояния ─────────────────────────────────────────── -->
    <div v-if="rowData.length === 0 && allRowData.length > 0" class="p-6 text-center text-gray-400 text-[13px]">
      По запросу «{{ searchQuery }}» ничего не найдено
    </div>
    <div v-else-if="allRowData.length === 0" class="p-6 text-center text-gray-400 text-[13px]">
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

const allRowData = computed<Record<string, unknown>[]>(() =>
    rawRows.value.map((cells, rowIdx) => {
      const row: Record<string, unknown> = {}
      let firstCellValue: string | null = null

      for (const cell of cells) {
        if (!cell?.sys_name) continue
        const display = cell.value_title ?? cell.value ?? ''
        row[cell.sys_name] = display
        if (firstCellValue === null) firstCellValue = String(cell.value ?? '')
      }

      // ID документа: из явного массива docIds, иначе значение первой ячейки
      row['_docId'] = docIds.value[rowIdx] ?? firstCellValue ?? ''
      return row
    }),
)

// ─── Поиск ───────────────────────────────────────────────────────────────────

const searchQuery = ref('')
let _searchTimer: ReturnType<typeof setTimeout>

// Pre-built search index — O(n·m) once when allRowData changes.
// Each entry is a single lowercase string: all searchable field values joined by \0.
// Subsequent searches scan this flat array: O(n) with a single String.includes per row,
// avoiding per-keystroke Object.entries + String() allocations of the naive approach.
const searchIndex = computed<string[]>(() =>
  allRowData.value.map((row) =>
    Object.entries(row)
      .filter(([k]) => !k.startsWith('_'))
      .map(([, v]) => v ?? '')
      .join('\0')
      .toLowerCase(),
  ),
)

const rowData = computed<Record<string, unknown>[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRowData.value
  const idx = searchIndex.value
  return allRowData.value.filter((_, i) => idx[i].includes(q))
})

function onSearchInput(e: Event): void {
  clearTimeout(_searchTimer)
  const val = (e.target as HTMLInputElement).value
  _searchTimer = setTimeout(() => { searchQuery.value = val }, 250)
}

// ─── AG-Grid ──────────────────────────────────────────────────────────────────

const gridApi = ref<GridApi | null>(null)

const colDefs = computed<ColDef[]>(() =>
    Object.entries(fieldAlias.value).map(([sysName, field]) => ({
      colId: sysName,
      field: sysName,
      headerName: field[0],
      sortable: field.CAN_SORTING,
      resizable: true,
      minWidth: 80,
      suppressHeaderMenuButton: !field.CAN_SORTING,
    })),
)

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
