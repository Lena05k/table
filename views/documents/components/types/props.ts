import type { ColDef, ColGroupDef, RowClassParams } from 'ag-grid-community'
import type { DocumentTableState } from '../../composables/useDocumentTable'
import type { DocumentFiltersState } from '../../composables/useDocumentFilters'
import type { PaginationState } from '../../composables/usePagination'
import type {
  StatsBlockConfig,
  OperationConfig,
  SpecialBlockKey,
  TabView,
  ToolbarAction,
} from '../../config/types'

export interface ColumnConfigPanelProps {
  tableState: DocumentTableState
}

export interface DocumentFilterBarProps {
  filtersState: DocumentFiltersState
}

export interface DocumentHeaderProps {
  title: string
}

export interface DocumentPaginationProps {
  paginationState: PaginationState
}

export interface DocumentStatsRowProps {
  statsBlocks?: StatsBlockConfig[]
  operations?: OperationConfig[]
  specialBlocks?: SpecialBlockKey[]
  stageCounts?: Record<string, number>
}

export interface DocumentTableProps {
  columnDefs: (ColDef | ColGroupDef)[]
  rowData: Record<string, unknown>[]
  loading?: boolean
  selectionMode?: boolean
  rowClassRules?: Record<string, (params: RowClassParams<Record<string, unknown>>) => boolean>
}

export interface DocumentToolbarProps {
  actions: ToolbarAction[]
}

export interface DocumentViewTabsProps {
  tabs: TabView[]
  activeTab: TabView
}

export interface LinkCellRendererProps {
  value: string | number
}

export interface OperationsBlockProps {
  operations: OperationConfig[]
}

export interface StageCountBlockProps {
  label: string
  count: number
}
