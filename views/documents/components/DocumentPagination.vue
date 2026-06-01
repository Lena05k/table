<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-3 tw-border-t tw-border-gray-200 tw-bg-white tw-text-sm tw-text-gray-600">
    <!-- Rows per page -->
    <div class="tw-flex tw-items-center tw-gap-2">
      <span>Строк на странице:</span>
      <select
        class="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1 tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-orange-500"
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
    <div class="tw-flex tw-items-center tw-gap-1">
      <button
        class="tw-p-1.5 tw-rounded hover:tw-bg-gray-100 disabled:tw-opacity-40 disabled:tw-cursor-not-allowed"
        :disabled="!paginationState.canGoPrev.value"
        @click="paginationState.prevPage()"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <template v-for="(pg, idx) in paginationState.visiblePages.value" :key="idx">
        <span
          v-if="pg === '...'"
          class="tw-px-2 tw-text-gray-400 tw-select-none"
        >…</span>
        <button
          v-else
          class="tw-min-w-[2rem] tw-h-8 tw-px-2 tw-rounded tw-text-sm tw-font-medium tw-transition-colors"
          :class="
            paginationState.page.value === pg
              ? 'tw-bg-orange-500 tw-text-white'
              : 'hover:tw-bg-gray-100 tw-text-gray-700'
          "
          @click="paginationState.goToPage(pg)"
        >
          {{ pg }}
        </button>
      </template>

      <button
        class="tw-p-1.5 tw-rounded hover:tw-bg-gray-100 disabled:tw-opacity-40 disabled:tw-cursor-not-allowed"
        :disabled="!paginationState.canGoNext.value"
        @click="paginationState.nextPage()"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <!-- Total label + export icon -->
    <div class="tw-flex tw-items-center tw-gap-3">
      <span>{{ paginationState.pageLabel.value }}</span>
      <button
        class="tw-p-1.5 tw-rounded hover:tw-bg-gray-100 tw-text-gray-500 hover:tw-text-gray-700"
        title="Экспорт текущей страницы"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocumentPaginationProps } from './types/props'

defineProps<DocumentPaginationProps>()
</script>