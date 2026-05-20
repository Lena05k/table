import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30_000,
})

export interface FetchDocumentsParams {
  doId: string
  page: number
  pageSize: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

export interface FetchDocumentsResult {
  items: Record<string, unknown>[]
  total: number
}

export async function fetchDocuments(params: FetchDocumentsParams): Promise<FetchDocumentsResult> {
  const { doId, page, pageSize, sortField, sortDirection, filters } = params
  const response = await http.get<FetchDocumentsResult>(`/do/${doId}/list`, {
    params: {
      page,
      pageSize,
      sortField,
      sortDirection,
      ...filters,
    },
  })
  return response.data
}

export async function fetchStageCount(doId: string, stageId: string): Promise<number> {
  const response = await http.get<{ count: number }>(`/do/${doId}/stages/${stageId}/count`)
  return response.data.count
}
