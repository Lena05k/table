<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-border-b tw-border-gray-200">
    <div class="tw-flex">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tw-px-4 tw-py-2.5 tw-text-sm tw-font-medium tw-border-b-2 -tw-mb-px tw-transition-colors"
        :class="
          activeTab === tab
            ? 'tw-border-gray-900 tw-text-gray-900'
            : 'tw-border-transparent tw-text-gray-500 hover:tw-text-gray-700'
        "
        @click="emit('change', tab)"
      >
        {{ TAB_LABELS[tab] }}
      </button>
    </div>

    <button
      class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-mb-1 tw-text-sm tw-text-gray-600 hover:tw-text-gray-800 tw-rounded hover:tw-bg-gray-100"
      @click="emit('download')"
    >
      <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
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
