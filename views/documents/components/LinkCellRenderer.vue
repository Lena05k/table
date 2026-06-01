<template>
  <button
    class="tw-text-blue-600 hover:tw-text-blue-800 hover:tw-underline tw-font-medium tw-text-sm"
    @click.stop="emit('navigate', value)"
  >
    {{ value }}
  </button>
</template>

<script setup lang="ts">
import type { LinkCellRendererProps } from './types/props'

defineProps<LinkCellRendererProps>()

const emit = defineEmits<{
  (e: 'navigate', value: string | number): void
}>()
</script>
