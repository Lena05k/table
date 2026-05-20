<script setup lang="ts">
import type { ToolbarAction, ToolbarIcon } from '../config/types'

interface Props {
  actions: ToolbarAction[]
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'action', key: string): void
  (e: 'configure-columns'): void
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

<template>
  <div class="flex items-center justify-between px-5 py-2.5 gap-3 border-b border-gray-100">
    <!-- Left: action buttons -->
    <div class="flex items-center gap-2">
      <template v-for="action in actions" :key="action.key">
        <!-- Primary button -->
        <button
          v-if="action.variant === 'primary'"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          @click="emit('action', action.key)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" :d="ICONS[action.icon]" />
          </svg>
          {{ action.label }}
        </button>

        <!-- Default button -->
        <button
          v-else-if="action.variant === 'default'"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm text-gray-700 transition-colors"
          @click="emit('action', action.key)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" :d="ICONS[action.icon]" />
          </svg>
          {{ action.label }}
          <svg
            v-if="action.hasDropdown"
            class="w-3 h-3 ml-0.5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Icon-only button -->
        <button
          v-else-if="action.variant === 'icon'"
          class="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
          :title="action.label || action.key"
          @click="emit('action', action.key)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" :d="ICONS[action.icon]" />
          </svg>
        </button>
      </template>
    </div>

    <!-- Right: configure columns button -->
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 transition-colors"
      @click="emit('configure-columns')"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Настроить таблицу
    </button>
  </div>
</template>
