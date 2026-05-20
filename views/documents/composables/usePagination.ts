import { ref, computed } from 'vue'

export function usePagination(defaultPageSize: number, pageSizeOptions: number[]) {
  const page = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  const pageCount = computed(() =>
    total.value === 0 ? 1 : Math.ceil(total.value / pageSize.value),
  )

  const pageLabel = computed(() => {
    if (total.value === 0) return '0 из 0'
    const from = (page.value - 1) * pageSize.value + 1
    const to = Math.min(page.value * pageSize.value, total.value)
    return `${from}–${to} из ${total.value}`
  })

  const canGoPrev = computed(() => page.value > 1)
  const canGoNext = computed(() => page.value < pageCount.value)

  function goToPage(n: number): void {
    if (n < 1 || n > pageCount.value) return
    page.value = n
  }

  function prevPage(): void {
    goToPage(page.value - 1)
  }

  function nextPage(): void {
    goToPage(page.value + 1)
  }

  function setPageSize(size: number): void {
    pageSize.value = size
    page.value = 1
  }

  function setTotal(count: number): void {
    total.value = count
    if (page.value > pageCount.value) {
      page.value = Math.max(1, pageCount.value)
    }
  }

  function reset(): void {
    page.value = 1
  }

  const visiblePages = computed<(number | '...')[]>(() => {
    const count = pageCount.value
    if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
    const current = page.value
    const pages: (number | '...')[] = [1]
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(count - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < count - 2) pages.push('...')
    pages.push(count)
    return pages
  })

  return {
    page,
    pageSize,
    total,
    pageCount,
    pageLabel,
    canGoPrev,
    canGoNext,
    pageSizeOptions,
    visiblePages,
    goToPage,
    prevPage,
    nextPage,
    setPageSize,
    setTotal,
    reset,
  }
}

export type PaginationState = ReturnType<typeof usePagination>
