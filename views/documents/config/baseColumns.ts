import type { ColDef } from 'ag-grid-community'
import LinkCellRenderer from '../components/LinkCellRenderer.vue'
import ActionsCellRenderer from '../components/ActionsCellRenderer.vue'

export const CODE_COLUMN: ColDef = {
  field: 'code',
  headerName: 'Код',
  width: 110,
  pinned: 'left',
  cellRenderer: LinkCellRenderer,
  sortable: true,
  filter: false,
  resizable: true,
  suppressMovable: true,
}

export const NUMBER_COLUMN: ColDef = {
  field: 'number',
  headerName: 'Номер',
  width: 120,
  sortable: true,
  resizable: true,
}

export const ACTIONS_COLUMN: ColDef = {
  field: 'actions',
  headerName: 'Действия',
  width: 90,
  pinned: 'right',
  sortable: false,
  filter: false,
  resizable: false,
  suppressMovable: true,
  cellRenderer: ActionsCellRenderer,
}

export function dateCol(field: string, headerName: string, width = 160): ColDef {
  return { field, headerName, width, sortable: true, resizable: true }
}

export function textCol(field: string, headerName: string, width = 160): ColDef {
  return { field, headerName, width, sortable: true, resizable: true }
}
