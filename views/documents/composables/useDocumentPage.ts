import { ref, watch, onMounted } from 'vue'
import type { DoPageConfig, TabView, SortDirection } from '../config/types'
import { usePagination } from './usePagination'
import { useDocumentFilters } from './useDocumentFilters'
import { useDocumentTable } from './useDocumentTable'
import { fetchDocuments } from '@/api/documents.api'
import { mockData } from '../config/mockData'

export function useDocumentPage(config: DoPageConfig) {
  const activeTab = ref<TabView>(config.availableTabs[0])
  const rows = ref<Record<string, unknown>[]>([])
  const loading = ref(false)
  const sortField = ref<string | undefined>(config.defaultSort?.field)
  const sortDirection = ref<SortDirection | undefined>(config.defaultSort?.direction)

  const pagination = usePagination(
    config.pagination.defaultPageSize,
    config.pagination.pageSizeOptions,
  )
  const filters = useDocumentFilters(config.filters)
  const table = useDocumentTable(config.id)

  function _sliceMock(): void {
    const all = (mockData as Record<string, Record<string, unknown>[]>)[config.id] ?? []
    const query = ((filters.activeFilters.value['_search'] as string) ?? '').trim().toLowerCase()
    const filtered = query
      ? all.filter((row) =>
          Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(query)),
        )
      : all
    const start = (pagination.page.value - 1) * pagination.pageSize.value
    rows.value = filtered.slice(start, start + pagination.pageSize.value)
    pagination.setTotal(filtered.length)
  }

  async function load(): Promise<void> {
    loading.value = true
    try {
      if (import.meta.env.DEV) {
        _sliceMock()
        return
      }
      const result = await fetchDocuments({
        doId: config.id,
        page: pagination.page.value,
        pageSize: pagination.pageSize.value,
        sortField: sortField.value,
        sortDirection: sortDirection.value,
        filters: filters.toQueryParams(),
      })
      if (!Array.isArray(result?.items)) throw new Error('invalid response')
      rows.value = result.items
      pagination.setTotal(result.total ?? 0)
    } catch {
      _sliceMock()
    } finally {
      loading.value = false
    }
  }

  function onSortChanged(sortModel: { colId: string; sort: string }[]): void {
    if (sortModel.length === 0) {
      sortField.value = undefined
      sortDirection.value = undefined
    } else {
      sortField.value = sortModel[0].colId
      sortDirection.value = sortModel[0].sort as SortDirection
    }
    pagination.reset()
    load()
  }

  function onFiltersApplied(): void {
    pagination.reset()
    load()
  }

  function onPageChange(): void {
    load()
  }

  function onPageSizeChange(): void {
    load()
  }

  function setTab(tab: TabView): void {
    activeTab.value = tab
  }

  watch(
    () => pagination.page.value,
    () => onPageChange(),
  )

  watch(
    () => pagination.pageSize.value,
    () => onPageSizeChange(),
  )

  onMounted(() => {
    load()
  })

  return {
    activeTab,
    rows,
    loading,
    sortField,
    sortDirection,
    pagination,
    filters,
    table,
    load,
    onSortChanged,
    onFiltersApplied,
    setTab,
  }
}
