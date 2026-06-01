import { shallowRef, ref, watch, onMounted } from 'vue'
import type { DoPageConfig, TabView, SortDirection } from '../config/types'
import { usePagination } from './usePagination'
import { useDocumentFilters } from './useDocumentFilters'
import { useDocumentTable } from './useDocumentTable'
import { fetchDocuments } from '@/api/documents.api'
import { mockData } from '../config/mockData'

// ─── Module-level caches (shared across all page instances) ──────────────────
//
// Search index: WeakMap<dataArray, string[]>
//   key   = original or sorted array reference (stable for mock data)
//   value = per-row lowercase concatenation of all searchable fields
//   Build complexity: O(n·m) once per array reference
//   Lookup complexity: O(n) — single String.includes per row
//
const _searchIndex = new WeakMap<Record<string, unknown>[], string[]>()

function _getSearchIndex(rows: Record<string, unknown>[]): string[] {
  let idx = _searchIndex.get(rows)
  if (idx) return idx
  idx = rows.map((row) =>
    Object.entries(row)
      .filter(([k]) => k !== 'highlighted' && !k.startsWith('_'))
      .map(([, v]) => v ?? '')
      .join('\0')
      .toLowerCase(),
  )
  _searchIndex.set(rows, idx)
  return idx
}

// Sort cache: Map<"configId:field:dir", sorted array>
//   Build complexity: O(n log n) once per (config, field, dir) triple
//   Hit complexity: O(1)
//
const _sortCache = new Map<string, Record<string, unknown>[]>()

function _getSorted(
  all: Record<string, unknown>[],
  configId: string,
  field: string,
  dir: 'asc' | 'desc',
): Record<string, unknown>[] {
  const key = `${configId}:${field}:${dir}`
  let sorted = _sortCache.get(key)
  if (sorted) return sorted
  sorted = [...all].sort((a, b) => {
    const av = String(a[field] ?? '')
    const bv = String(b[field] ?? '')
    const cmp = av.localeCompare(bv, 'ru', { numeric: true, sensitivity: 'base' })
    return dir === 'asc' ? cmp : -cmp
  })
  _sortCache.set(key, sorted)
  return sorted
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useDocumentPage(config: DoPageConfig) {
  const activeTab = ref<TabView>(config.availableTabs[0])
  // shallowRef: row objects are read-only in the grid — no need to deep-track
  const rows = shallowRef<Record<string, unknown>[]>([])
  const loading = ref(false)
  const sortField = ref<string | undefined>(config.defaultSort?.field)
  const sortDirection = ref<SortDirection | undefined>(config.defaultSort?.direction)

  const pagination = usePagination(config.pagination.defaultPageSize, config.pagination.pageSizeOptions)
  const filters    = useDocumentFilters(config.filters)
  const table      = useDocumentTable(config.id)

  // In-flight request controller — abort previous fetch on every new load()
  let _controller: AbortController | null = null

  // ── Mock (DEV / fallback) ─────────────────────────────────────────────────

  function _sliceMock(): void {
    const all = (mockData as Record<string, Record<string, unknown>[]>)[config.id] ?? []

    // 1. Sort — O(n log n) first call, O(1) on cache hit
    const source =
      sortField.value && sortDirection.value
        ? _getSorted(all, config.id, sortField.value, sortDirection.value)
        : all

    // 2. Filter — O(n·m) index built once, O(n) per search afterwards
    const query = ((filters.activeFilters.value['_search'] as string) ?? '').trim().toLowerCase()
    const filtered = query
      ? (() => {
          const idx = _getSearchIndex(source)
          return source.filter((_, i) => idx[i].includes(query))
        })()
      : source

    // 3. Slice — O(pageSize)
    const start = (pagination.page.value - 1) * pagination.pageSize.value
    rows.value  = filtered.slice(start, start + pagination.pageSize.value)
    pagination.setTotal(filtered.length)
  }

  // ── Load ──────────────────────────────────────────────────────────────────

  async function load(): Promise<void> {
    // Cancel any in-flight request to avoid stale responses overwriting new data
    _controller?.abort()
    const controller = new AbortController()
    _controller = controller

    loading.value = true
    try {
      if (import.meta.env.DEV) {
        _sliceMock()
        return
      }
      const result = await fetchDocuments(
        {
          doId:          config.id,
          page:          pagination.page.value,
          pageSize:      pagination.pageSize.value,
          sortField:     sortField.value,
          sortDirection: sortDirection.value,
          filters:       filters.toQueryParams(),
        },
        controller.signal,
      )
      // Guard: discard if a newer request already started
      if (controller.signal.aborted) return
      if (!Array.isArray(result?.items)) throw new Error('invalid response')
      rows.value = result.items
      pagination.setTotal(result.total ?? 0)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      _sliceMock()
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  function onSortChanged(sortModel: { colId: string; sort: string }[]): void {
    if (sortModel.length === 0) {
      sortField.value     = undefined
      sortDirection.value = undefined
    } else {
      sortField.value     = sortModel[0].colId
      sortDirection.value = sortModel[0].sort as SortDirection
    }
    pagination.reset()
    load()
  }

  function onFiltersApplied(): void {
    pagination.reset()
    load()
  }

  function setTab(tab: TabView): void {
    activeTab.value = tab
  }

  watch(() => pagination.page.value,     () => load())
  watch(() => pagination.pageSize.value, () => { pagination.reset(); load() })

  onMounted(() => load())

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
