<template>
  <button
    class="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
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
