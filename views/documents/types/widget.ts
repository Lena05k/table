export interface FieldDef {
  0: string
  1?: string | null
  FIELD_TYPE: string
  ID: string
  CAN_SORTING: boolean
}

export interface DataCell {
  id: string
  sys_name: string
  title: string
  type: string
  value: string | null
  value_title: string | null
}
