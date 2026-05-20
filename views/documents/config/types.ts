import type { ColDef, ColGroupDef, RowClassParams } from 'ag-grid-community'

export type TabView = 'table' | 'kanban'
export type SortDirection = 'asc' | 'desc'
export type SpecialBlockKey =
  | 'postal-work'
  | 'telegram-upload'
  | 'puu-tasks'
  | 'sign-letter'
  | 'mass-update'
  | 'print-forms'

export type FilterType = 'select' | 'multiselect' | 'daterange' | 'text'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[]
  defaultValue?: string | string[] | null
}

export interface ToolbarAction {
  key: string
  label: string
  icon: ToolbarIcon
  variant: 'primary' | 'default' | 'icon'
  action: string
  hasDropdown?: boolean
}

export type ToolbarIcon =
  | 'plus'
  | 'arrow-up-tray'
  | 'arrow-down-tray'
  | 'star'
  | 'arrow-path'
  | 'ellipsis-horizontal'

export interface OperationRoute {
  label: string
  stageId: string
  roleId?: string
}

export type OperationType = 'accept-queue' | 'accept-list' | 'send'

export interface OperationConfig {
  type: OperationType
  label: string
  stageId: string
  routes: OperationRoute[]
}

export interface StatsBlockConfig {
  key: string
  label: string
  stageId?: string
  roleId?: string
}

export interface NavigationTab {
  key: string
  label: string
  stageId: string
}

export interface NavigationConfig {
  tabs: NavigationTab[]
}

export interface PaginationConfig {
  defaultPageSize: number
  pageSizeOptions: number[]
}

export interface DoPageConfig {
  id: string
  code: number
  title: string
  columns: (ColDef | ColGroupDef)[]
  defaultSort?: { field: string; direction: SortDirection }
  availableTabs: TabView[]
  filters: FilterConfig[]
  toolbar: ToolbarAction[]
  operations?: OperationConfig[]
  statsBlocks?: StatsBlockConfig[]
  specialBlocks?: SpecialBlockKey[]
  rowClassRules?: Record<string, (params: RowClassParams<Record<string, unknown>>) => boolean>
  navigation?: NavigationConfig
  pagination: PaginationConfig
}

export type DoConfigMap = Record<string, DoPageConfig>
