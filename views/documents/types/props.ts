import type { FieldDef, DataCell } from './widget'

export interface DocumentPageProps {
  fieldAlias: Record<string, FieldDef>
  dataTable: DataCell[][]
  docIdsJson?: string
  project?: string
  classId?: string
  parentDocumentId?: string
  title?: string
}
