<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'favorite'): void
}>()

const searchQuery = ref('')

function onInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value
  searchQuery.value = value
  emit('search', value)
}
</script>

<template>
  <div class="flex items-center justify-between px-5 pt-5 pb-3">
    <div class="flex items-center gap-2">
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <button
        class="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
        title="В избранное"
        @click="emit('favorite')"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
    </div>

    <div class="relative w-72">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        :value="searchQuery"
        placeholder="Поиск по таблице..."
        class="w-full pl-9 pr-3 py-2 text-sm rounded border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
        @input="onInput"
      />
    </div>
  </div>
</template>
