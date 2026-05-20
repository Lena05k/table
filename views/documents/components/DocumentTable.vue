<script setup lang="ts">
import { computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
  RowClassParams,
} from 'ag-grid-community'
import RadioCellRenderer from './RadioCellRenderer.vue'

interface Props {
  columnDefs: (ColDef | ColGroupDef)[]
  rowData: Record<string, unknown>[]
  loading?: boolean
  rowClassRules?: Record<string, (params: RowClassParams<Record<string, unknown>>) => boolean>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowClassRules: () => ({}),
})

const emit = defineEmits<{
  (e: 'grid-ready', api: GridApi): void
  (e: 'sort-changed', sortModel: { colId: string; sort: string }[]): void
  (e: 'row-clicked', data: Record<string, unknown>): void
  (e: 'column-state-changed'): void
}>()

// Radio selection column prepended to every table
const RADIO_COL: ColDef = {
  colId: 'row-select',
  headerName: '',
  width: 44,
  minWidth: 44,
  maxWidth: 44,
  pinned: 'left',
  sortable: false,
  filter: false,
  resizable: false,
  suppressMovable: true,
  suppressHeaderMenuButton: true,
  cellRenderer: RadioCellRenderer,
}

const allColumnDefs = computed<(ColDef | ColGroupDef)[]>(() => [
  RADIO_COL,
  ...props.columnDefs,
])

// Default col def: menu enabled so users can right-click → Pin Column
const defaultColDef: ColDef = {
  resizable: true,
  sortable: true,
  filter: false,
  minWidth: 80,
  suppressMovable: false,
  menuTabs: ['generalMenuTab'],
}

const rowSelection = { mode: 'singleRow', checkboxes: false, enableClickSelection: true }

function onGridReady(params: GridReadyEvent): void {
  emit('grid-ready', params.api)
}

function onSortChanged(event: SortChangedEvent): void {
  const sortModel = event.api
    .getColumnState()
    .filter((col) => col.sort !== null && col.sort !== undefined)
    .map((col) => ({ colId: col.colId, sort: col.sort! }))
  emit('sort-changed', sortModel)
}

function onColumnStateChanged(): void {
  emit('column-state-changed')
}
</script>

<template>
  <div class="relative w-full">
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-white/60"
    >
      <div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <AgGridVue
      theme="legacy"
      class="ag-theme-alpine w-full"
      style="min-height: 400px;"
      :columnDefs="allColumnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :rowClassRules="rowClassRules"
      :rowSelection="rowSelection"
      :suppressPaginationPanel="true"
      :domLayout="'autoHeight'"
      @grid-ready="onGridReady"
      @sort-changed="onSortChanged"
      @row-clicked="(e) => e.data && emit('row-clicked', e.data)"
      @column-moved="onColumnStateChanged"
      @column-pinned="onColumnStateChanged"
      @column-visible="onColumnStateChanged"
      @drag-stopped="onColumnStateChanged"
    />
  </div>
</template>
