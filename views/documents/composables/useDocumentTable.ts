import { ref } from 'vue'
import type { GridApi, ColumnState } from 'ag-grid-community'

export function useDocumentTable() {
  const gridApi = ref<GridApi | null>(null)
  const columnPanelOpen = ref(false)

  function onGridReady(api: GridApi): void {
    gridApi.value = api
  }

  function getColumnStates(): ColumnState[] {
    return gridApi.value?.getColumnState() ?? []
  }

  function setColumnVisible(colId: string, visible: boolean): void {
    gridApi.value?.setColumnsVisible([colId], visible)
  }

  function getAllColumns(): Array<{ colId: string; headerName: string; visible: boolean }> {
    if (!gridApi.value) return []
    return gridApi.value.getColumnState().map((col) => ({
      colId: col.colId,
      headerName: gridApi.value!.getColumn(col.colId)?.getColDef().headerName ?? col.colId,
      visible: !col.hide,
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
