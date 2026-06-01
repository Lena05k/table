import { shallowRef, ref, watch, onMounted } from 'vue'
import type { DoPageConfig, TabView, SortDirection } from '../config/types'
import { usePagination } from './usePagination'
import { useDocumentFilters } from './useDocumentFilters'
import { useDocumentTable } from './useDocumentTable'
import { fetchDocuments } from '@/api/documents.api'
import { mockData } from '../config/mockData'

// ─── Search index cache ───────────────────────────────────────────────────────
// WeakMap<array, string[]>: key = stable array ref, value = per-row flat string.
// Build: O(n·m) once. Lookup per keystroke: O(n) — one String.includes per row.
const _searchIndex = new WeakMap<Record<string, unknown>[], string[]>()

function _getSearchIndex(rows: Record<string, unknown>[]): string[] {
  let idx = _searchIndex.get(rows)
  if (idx) return idx
  const n = rows.length
  idx = new Array<string>(n)
  for (let i = 0; i < n; i++) {
    const row  = rows[i]
    const keys = Object.keys(row)
    const kLen = keys.length
    let str    = ''
    for (let j = 0; j < kLen; j++) {
      const k = keys[j]
      // charCode 95 = '_'; skip private fields and the highlighted marker
      if (k === 'highlighted' || k.charCodeAt(0) === 95) continue
      if (str.length > 0) str += '\0'
      const v = row[k]
      if (v !== null && v !== undefined) str += v
    }
    idx[i] = str.toLowerCase()
  }
  _searchIndex.set(rows, idx)
  return idx
}

// ─── Sort cache ───────────────────────────────────────────────────────────────
// Map<"configId:field:dir", sorted[]>
// Build: O(n log n) once. Hit: O(1).
// Intl.Collator pre-compiled at module level — avoids allocating the options
// object `{ numeric, sensitivity }` on every comparator call (O(n log n) saves).
const _collator  = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' })
const _sortCache = new Map<string, Record<string, unknown>[]>()

function _getSorted(
  all: Record<string, unknown>[],
  configId: string,
  field: string,
  dir: 'asc' | 'desc',
): Record<string, unknown>[] {
  const key    = configId + ':' + field + ':' + dir
  let   sorted = _sortCache.get(key)
  if (sorted) return sorted
  const sign = dir === 'asc' ? 1 : -1
  // .slice() copies without iterator overhead; sort is in-place on the copy
  sorted = all.slice().sort((a, b) =>
    sign * _collator.compare(String(a[field] ?? ''), String(b[field] ?? '')),
  )
  _sortCache.set(key, sorted)
  return sorted
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useDocumentPage(config: DoPageConfig) {
  const activeTab     = ref<TabView>(config.availableTabs[0])
  // shallowRef: rows are read-only in the grid — deep Vue proxy is wasteful
  const rows          = shallowRef<Record<string, unknown>[]>([])
  const loading       = ref(false)
  const sortField     = ref<string | undefined>(config.defaultSort?.field)
  const sortDirection = ref<SortDirection | undefined>(config.defaultSort?.direction)

  const pagination = usePagination(config.pagination.defaultPageSize, config.pagination.pageSizeOptions)
  const filters    = useDocumentFilters(config.filters)
  const table      = useDocumentTable(config.id)

  let _controller: AbortController | null = null

  // ── Mock (DEV / fallback) ─────────────────────────────────────────────────

  function _sliceMock(): void {
    const all = (mockData as Record<string, Record<string, unknown>[]>)[config.id] ?? []

    // 1. Sort — O(n log n) first call, O(1) on cache hit
    const source = sortField.value && sortDirection.value
      ? _getSorted(all, config.id, sortField.value, sortDirection.value)
      : all

    // 2. Filter — index built O(n·m) once, each search O(n)
    const query = ((filters.activeFilters.value['_search'] as string) ?? '').trim().toLowerCase()
    let filtered: Record<string, unknown>[]
    if (query) {
      const idx = _getSearchIndex(source)
      const sLen = source.length
      filtered = []
      for (let i = 0; i < sLen; i++) {
        if (idx[i].includes(query)) filtered.push(source[i])
      }
    } else {
      filtered = source
    }

    // 3. Slice — O(pageSize)
    const start = (pagination.page.value - 1) * pagination.pageSize.value
    rows.value  = filtered.slice(start, start + pagination.pageSize.value)
    pagination.setTotal(filtered.length)
  }

  // ── Load ──────────────────────────────────────────────────────────────────

  async function load(): Promise<void> {
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
