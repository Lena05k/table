<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-pt-5 tw-pb-3">
    <div class="tw-flex tw-items-center tw-gap-2">
      <h1 class="tw-text-xl tw-font-semibold tw-text-gray-900">{{ title }}</h1>
      <button
        class="tw-p-1 tw-text-gray-400 hover:tw-text-yellow-500 tw-transition-colors"
        title="В избранное"
        @click="emit('favorite')"
      >
        <svg class="tw-w-5 tw-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
    </div>

    <div class="tw-relative tw-w-72">
      <svg
        class="tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-w-4 tw-h-4 tw-text-gray-400 tw-pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        :value="searchQuery"
        placeholder="Поиск по таблице..."
        class="tw-w-full tw-pl-9 tw-pr-3 tw-py-2 tw-text-sm tw-rounded tw-border tw-border-gray-300 tw-bg-white tw-placeholder-gray-400 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-orange-500 focus:tw-border-orange-500"
        @input="onInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DocumentHeaderProps } from './types/props'

defineProps<DocumentHeaderProps>()

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
