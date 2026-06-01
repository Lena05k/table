<template>
  <div class="tw-flex tw-items-center tw-gap-2">
    <template v-for="action in actions" :key="action.key">
      <button
          v-if="action.variant === 'primary'"
          class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded tw-bg-orange-500 hover:tw-bg-orange-600 tw-text-white tw-text-sm tw-font-medium tw-transition-colors"
          @click="emit('action', action.key)"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="ICONS[action.icon]" />
        </svg>
        {{ action.label }}
      </button>

      <button
          v-else-if="action.variant === 'default'"
          class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded tw-border tw-border-gray-300 tw-bg-white hover:tw-bg-gray-50 tw-text-sm tw-text-gray-700 tw-transition-colors"
          @click="emit('action', action.key)"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="ICONS[action.icon]" />
        </svg>
        {{ action.label }}
        <svg
            v-if="action.hasDropdown"
            class="tw-w-3 tw-h-3 tw-ml-0.5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <button
          v-else-if="action.variant === 'icon'"
          class="tw-p-1.5 tw-rounded tw-border tw-border-gray-200 tw-bg-white hover:tw-bg-gray-50 tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors"
          :title="action.label || action.key"
          @click="emit('action', action.key)"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="ICONS[action.icon]" />
        </svg>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ToolbarIcon } from '../config/types'
import type { DocumentToolbarProps } from './types/props'

defineProps<DocumentToolbarProps>()

const emit = defineEmits<{
  (e: 'action', key: string): void
}>()

const ICONS: Record<ToolbarIcon, string> = {
  'plus': 'M12 4.5v15m7.5-7.5h-15',
  'arrow-up-tray': 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  'arrow-down-tray': 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  'star': 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  'arrow-path': 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  'ellipsis-horizontal': 'M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
}
</script>
