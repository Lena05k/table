<script setup lang="ts">
import { computed, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community'

// ─── Типы, соответствующие структуре данных бэкенда ──────────────────────────

interface FieldDef {
  0: string           // заголовок колонки
  1?: string | null   // опциональный стиль
  FIELD_TYPE: string
  ID: string
  CAN_SORTING: boolean
}

interface DataCell {
  id: string
  sys_name: string
  title: string
  type: string
  value: string | null
  value_title: string | null
}

// ─── Пропы (все строки, т.к. приходят из HTML-атрибутов) ─────────────────────

interface Props {
  /** JSON: Record<sysName, FieldDef> — передать как {{ fieldAlias|json_encode }} */
  columnsJson: string
  /** JSON: DataCell[][] — передать как {{ dataTable|json_encode }} */
  rowsJson: string
  /**
   * JSON: string[] — ID документов в том же порядке что и строки.
   * Если не передан — используется значение первой колонки.
   * Пример Smarty: {$docIds|json_encode} где $docIds = array_column($rows, 'ID')
   */
  docIdsJson?: string
  /** progectId для ссылок на документ */
  classId?: string
  /** parentDocumentId — если таблица внутри документа (откроет popup) */
  parentDocumentId?: string
  windowHeight?: string
  windowWidth?: string
  /** Высота таблицы в px, или 'auto' для autoHeight */
  tableHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  docIdsJson: '[]',
  classId: '',
  parentDocumentId: '',
  windowHeight: '710',
  windowWidth: '1100',
  tableHeight: '520',
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

const rowData = computed<Record<string, unknown>[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRowData.value
  return allRowData.value.filter((row) =>
    Object.entries(row)
      .filter(([k]) => !k.startsWith('_'))
      .some(([, v]) => String(v ?? '').toLowerCase().includes(q)),
  )
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

const gridStyle = computed(() =>
  props.tableHeight === 'auto' ? undefined : { height: `${props.tableHeight}px` },
)

const domLayout = computed<'autoHeight' | undefined>(() =>
  props.tableHeight === 'auto' ? 'autoHeight' : undefined,
)

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
    // Используем глобальный openWindow если он есть (из легаси-кода)
    const openWindow = (window as unknown as Record<string, unknown>)['openWindow']
    if (typeof openWindow === 'function') {
      ;(openWindow as (u: string, w: number, h: number) => void)(
        url,
        Number(props.windowWidth),
        Number(props.windowHeight),
      )
    } else {
      window.open(url, '_blank', `width=${props.windowWidth},height=${props.windowHeight}`)
    }
  } else {
    window.location.href = `?progectId=${props.classId}&documentId=${docId}`
  }
}
</script>

<template>
  <div class="vdw">
    <!-- ── Поиск + счётчик ─────────────────────────────────────────── -->
    <div class="vdw__toolbar">
      <div class="vdw__search-wrap">
        <svg class="vdw__search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          class="vdw__search-input"
          placeholder="Поиск в таблице..."
          @input="onSearchInput"
        />
      </div>
      <span class="vdw__count">
        {{ rowData.length === allRowData.length
          ? `${allRowData.length} записей`
          : `${rowData.length} из ${allRowData.length}` }}
      </span>
    </div>

    <!-- ── AG-Grid ──────────────────────────────────────────────────── -->
    <AgGridVue
      theme="legacy"
      class="ag-theme-alpine vdw__grid"
      :style="gridStyle"
      :domLayout="domLayout"
      :columnDefs="colDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :suppressPaginationPanel="true"
      @grid-ready="onGridReady"
      @row-clicked="onRowClicked"
    />

    <!-- ── Пустые состояния ─────────────────────────────────────────── -->
    <div v-if="rowData.length === 0 && allRowData.length > 0" class="vdw__empty">
      По запросу «{{ searchQuery }}» ничего не найдено
    </div>
    <div v-else-if="allRowData.length === 0" class="vdw__empty">
      Поиск не дал результатов
    </div>
  </div>
</template>

<style>
/* Не scoped — иначе AG-Grid не видит стили для своих порталов */
.vdw {
  font-family: inherit;
  font-size: 14px;
}

.vdw__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.vdw__search-wrap {
  position: relative;
  flex: 0 0 280px;
}

.vdw__search-icon {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9ca3af;
  pointer-events: none;
}

.vdw__search-input {
  width: 100%;
  padding: 6px 10px 6px 30px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  outline: none;
  background: #fff;
  box-sizing: border-box;
}

.vdw__search-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15);
}

.vdw__count {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.vdw__grid {
  width: 100%;
}

.vdw__empty {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

/* Строки кликабельны */
.vdw .ag-row {
  cursor: pointer;
}
</style>
