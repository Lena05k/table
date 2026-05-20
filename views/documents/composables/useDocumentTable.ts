import { ref } from 'vue'
import type { GridApi, ColumnState } from 'ag-grid-community'

export function useDocumentTable(doId: string) {
  const gridApi = ref<GridApi | null>(null)
  const columnPanelOpen = ref(false)
  const storageKey = `col-state-${doId}`

  function onGridReady(api: GridApi): void {
    gridApi.value = api
    _restoreColumnState()
  }

  function _restoreColumnState(): void {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return
    try {
      const state = JSON.parse(saved) as ColumnState[]
      gridApi.value?.applyColumnState({ state, applyOrder: true })
    } catch { /* ignore corrupt data */ }
  }

  function saveColumnState(): void {
    const state = gridApi.value?.getColumnState()
    if (state) {
      localStorage.setItem(storageKey, JSON.stringify(state))
    }
  }

  function resetColumnState(): void {
    localStorage.removeItem(storageKey)
    gridApi.value?.resetColumnState()
  }

  function getColumnStates(): ColumnState[] {
    return gridApi.value?.getColumnState() ?? []
  }

  function setColumnVisible(colId: string, visible: boolean): void {
    gridApi.value?.setColumnsVisible([colId], visible)
    saveColumnState()
  }

  function getAllColumns(): Array<{ colId: string; headerName: string; visible: boolean; pinned: string | null | boolean }> {
    if (!gridApi.value) return []
    return gridApi.value.getColumnState().map((col) => ({
      colId: col.colId,
      headerName: gridApi.value!.getColumn(col.colId)?.getColDef().headerName ?? col.colId,
      visible: !col.hide,
      pinned: col.pinned ?? null,
    }))
  }

  function exportToCsv(): void {
    gridApi.value?.exportDataAsCsv({ fileName: 'export.csv' })
  }

  function sizeColumnsToFit(): void {
    gridApi.value?.sizeColumnsToFit()
  }

  function refreshCells(): void {
    gridApi.value?.refreshCells({ force: true })
  }

  function openColumnPanel(): void {
    columnPanelOpen.value = true
  }

  function closeColumnPanel(): void {
    columnPanelOpen.value = false
  }

  return {
    gridApi,
    columnPanelOpen,
    onGridReady,
    saveColumnState,
    resetColumnState,
    getColumnStates,
    setColumnVisible,
    getAllColumns,
    exportToCsv,
    sizeColumnsToFit,
    refreshCells,
    openColumnPanel,
    closeColumnPanel,
  }
}

export type DocumentTableState = ReturnType<typeof useDocumentTable>
