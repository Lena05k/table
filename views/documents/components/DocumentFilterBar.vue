<script setup lang="ts">
import type { DocumentFiltersState } from '../composables/useDocumentFilters'

interface Props {
  filtersState: DocumentFiltersState
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'open-filter-panel'): void
}>()

const ROLE_OPTIONS = [
  { label: 'Все', value: 'all' },
]
</script>

<template>
  <div class="flex items-center gap-3 px-5 py-2 border-b border-gray-100 bg-white flex-wrap">
    <!-- Filters badge button -->
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
      @click="emit('open-filter-panel')"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
      Фильтры
      <span
        v-if="filtersState.activeCount.value > 0"
        class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-semibold"
      >
        {{ filtersState.activeCount.value }}
      </span>
    </button>

    <!-- Date range -->
    <div class="flex items-center gap-1">
      <input
        type="date"
        class="text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
        :value="filtersState.dateRange.value.from ?? ''"
        @change="(e) => filtersState.setDateRange((e.target as HTMLInputElement).value || null, filtersState.dateRange.value.to)"
      />
      <span class="text-gray-400">—</span>
      <input
        type="date"
        class="text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
        :value="filtersState.dateRange.value.to ?? ''"
        @change="(e) => filtersState.setDateRange(filtersState.dateRange.value.from, (e.target as HTMLInputElement).value || null)"
      />
    </div>

    <!-- Role selector -->
    <select
      class="text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-700"
      :value="filtersState.selectedRole.value"
      @change="(e) => filtersState.setRole((e.target as HTMLSelectElement).value)"
    >
      <option
        v-for="opt in ROLE_OPTIONS"
        :key="opt.value"
        :value="opt.value"
      >
        На роль: {{ opt.label }}
      </option>
    </select>

    <button
      v-if="filtersState.activeCount.value > 0"
      class="text-sm text-orange-600 hover:text-orange-700 underline"
      @click="() => { filtersState.resetAll(); emit('apply') }"
    >
      Сбросить
    </button>
  </div>
</template>
