<template>
  <div class="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-white text-sm text-gray-600">
    <!-- Rows per page -->
    <div class="flex items-center gap-2">
      <span>Строк на странице:</span>
      <select
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        :value="paginationState.pageSize.value"
        @change="(e) => paginationState.setPageSize(Number((e.target as HTMLSelectElement).value))"
      >
        <option
          v-for="size in paginationState.pageSizeOptions"
          :key="size"
          :value="size"
        >
          {{ size }}
        </option>
      </select>
    </div>

    <!-- Page navigation -->
    <div class="flex items-center gap-1">
      <button
        class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!paginationState.canGoPrev.value"
        @click="paginationState.prevPage()"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <template v-for="(pg, idx) in paginationState.visiblePages.value" :key="idx">
        <span
          v-if="pg === '...'"
          class="px-2 text-gray-400 select-none"
        >…</span>
        <button
          v-else
          class="min-w-[2rem] h-8 px-2 rounded text-sm font-medium transition-colors"
          :class="
            paginationState.page.value === pg
              ? 'bg-orange-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          "
          @click="paginationState.goToPage(pg)"
        >
          {{ pg }}
        </button>
      </template>

      <button
        class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!paginationState.canGoNext.value"
        @click="paginationState.nextPage()"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <!-- Total label + export icon -->
    <div class="flex items-center gap-3">
      <span>{{ paginationState.pageLabel.value }}</span>
      <button
        class="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        title="Экспорт текущей страницы"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginationState } from '../composables/usePagination'

interface Props {
  paginationState: PaginationState
}
defineProps<Props>()
</script>