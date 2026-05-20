<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  data: Record<string, unknown>
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'view', data: Record<string, unknown>): void
  (e: 'menu', data: Record<string, unknown>): void
}>()

const menuOpen = ref(false)
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      class="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
      title="Просмотр"
      @click.stop="emit('view', data)"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
    <button
      class="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
      title="Действия"
      @click.stop="menuOpen = !menuOpen"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>
    </button>
  </div>
</template>
