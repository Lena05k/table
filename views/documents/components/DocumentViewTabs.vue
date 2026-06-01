<template>
  <div class="flex items-center justify-between px-5 border-b border-gray-200">
    <div class="flex">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="
          activeTab === tab
            ? 'border-gray-900 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
        @click="emit('change', tab)"
      >
        {{ TAB_LABELS[tab] }}
      </button>
    </div>

    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 mb-1 text-sm text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100"
      @click="emit('download')"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Скачать
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TabView } from '../config/types'
import type { DocumentViewTabsProps } from './types/props'

defineProps<DocumentViewTabsProps>()

const emit = defineEmits<{
  (e: 'change', tab: TabView): void
  (e: 'download'): void
}>()

const TAB_LABELS: Record<TabView, string> = {
  table: 'Таблица',
  kanban: 'Канбан',
}
</script>
