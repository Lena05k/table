<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import type {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
  RowClassParams,
} from 'ag-grid-community'

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
}>()

const defaultColDef: ColDef = {
  resizable: true,
  sortable: true,
  filter: false,
  minWidth: 80,
  suppressMovable: false,
}

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
</script>

<template>
  <div class="relative w-full">
    <!-- Loading overlay -->
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
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :rowClassRules="rowClassRules"
      :rowSelection="'multiple'"
      :suppressPaginationPanel="true"
      :domLayout="'autoHeight'"
      @grid-ready="onGridReady"
      @sort-changed="onSortChanged"
      @row-clicked="(e) => e.data && emit('row-clicked', e.data)"
    />
  </div>
</template>
