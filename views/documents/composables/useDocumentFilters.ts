import { ref, computed } from 'vue'
import type { FilterConfig } from '../config/types'

export function useDocumentFilters(filterConfigs: FilterConfig[]) {
  const activeFilters = ref<Record<string, unknown>>(
    Object.fromEntries(
      filterConfigs.map((f) => [f.key, f.defaultValue ?? null]),
    ),
  )

  const dateRange = ref<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  })

  const selectedRole = ref<string>('all')

  const activeCount = computed(() => {
    const filtersCount = Object.values(activeFilters.value).filter(
      (v) => v !== null && v !== undefined && v !== '',
    ).length
    const dateCount = dateRange.value.from || dateRange.value.to ? 1 : 0
    return filtersCount + dateCount
  })

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
    activeFilters.value = Object.fromEntries(
      filterConfigs.map((f) => [f.key, f.defaultValue ?? null]),
    )
    dateRange.value = { from: null, to: null }
    selectedRole.value = 'all'
  }

  function toQueryParams(): Record<string, unknown> {
    return {
      ...Object.fromEntries(
        Object.entries(activeFilters.value).filter(([, v]) => v !== null && v !== undefined && v !== ''),
      ),
      ...(dateRange.value.from ? { dateFrom: dateRange.value.from } : {}),
      ...(dateRange.value.to ? { dateTo: dateRange.value.to } : {}),
      ...(selectedRole.value !== 'all' ? { role: selectedRole.value } : {}),
    }
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
