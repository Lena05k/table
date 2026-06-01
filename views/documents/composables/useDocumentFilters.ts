import { ref, computed } from 'vue'
import type { FilterConfig } from '../config/types'

export function useDocumentFilters(filterConfigs: FilterConfig[]) {
  // ── helpers ──────────────────────────────────────────────────────────────

  function _buildDefaults(): Record<string, unknown> {
    const defaults: Record<string, unknown> = {}
    for (let i = 0; i < filterConfigs.length; i++) {
      defaults[filterConfigs[i].key] = filterConfigs[i].defaultValue ?? null
    }
    return defaults
  }

  // ── state ─────────────────────────────────────────────────────────────────

  const activeFilters = ref<Record<string, unknown>>(_buildDefaults())

  const dateRange = ref<{ from: string | null; to: string | null }>({
    from: null,
    to:   null,
  })

  const selectedRole = ref<string>('all')

  // ── computed ──────────────────────────────────────────────────────────────

  const activeCount = computed(() => {
    const vals = Object.values(activeFilters.value)
    let count  = 0
    for (let i = 0; i < vals.length; i++) {
      const v = vals[i]
      if (v !== null && v !== undefined && v !== '') count++
    }
    return count + (dateRange.value.from || dateRange.value.to ? 1 : 0)
  })

  // ── mutations ─────────────────────────────────────────────────────────────

  function setFilter(key: string, value: unknown): void {
    activeFilters.value = { ...activeFilters.value, [key]: value }
  }

  function setDateRange(from: string | null, to: string | null): void {
    dateRange.value = { from, to }
  }

  function setRole(role: string): void {
    selectedRole.value = role
  }

  function resetAll(): void {
    activeFilters.value = _buildDefaults()
    dateRange.value     = { from: null, to: null }
    selectedRole.value  = 'all'
  }

  function toQueryParams(): Record<string, unknown> {
    const result  = {} as Record<string, unknown>
    const entries = Object.entries(activeFilters.value)
    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i]
      if (v !== null && v !== undefined && v !== '') result[k] = v
    }
    if (dateRange.value.from)         result['dateFrom'] = dateRange.value.from
    if (dateRange.value.to)           result['dateTo']   = dateRange.value.to
    if (selectedRole.value !== 'all') result['role']     = selectedRole.value
    return result
  }

  return {
    activeFilters,
    dateRange,
    selectedRole,
    activeCount,
    filterConfigs,
    setFilter,
    setDateRange,
    setRole,
    resetAll,
    toQueryParams,
  }
}

export type DocumentFiltersState = ReturnType<typeof useDocumentFilters>
