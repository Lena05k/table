<script setup lang="ts">
import type { DocumentFiltersState } from '../composables/useDocumentFilters'

interface Props {
  filtersState: DocumentFiltersState
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'open-filter-panel'): void
  (e: 'configure-columns'): void
}>()

const ROLE_OPTIONS = [
  { label: 'Все', value: 'all' },
]
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Filters badge button -->
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
      @click="emit('open-filter-panel')"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
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
      class="text-sm text-orange-600 hover:text-orange-700 underline whitespace-nowrap"
      @click="() => { filtersState.resetAll(); emit('apply') }"
    >
      Сбросить
    </button>

    <!-- Configure columns button -->
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 transition-colors whitespace-nowrap"
      @click="emit('configure-columns')"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Настроить таблицу
    </button>
  </div>
</template>
