<template>
  <div class="tw-relative tw-flex-1 tw-max-w-[500px] tw-min-w-[180px]">
    <label class="tw-flex tw-items-center tw-bg-white/20 hover:tw-bg-white/25 focus-within:tw-bg-white/30 tw-rounded-full tw-px-4 tw-py-1.5 tw-gap-2 tw-cursor-text tw-transition-colors">
      <svg class="tw-w-4 tw-h-4 tw-text-white/70 tw-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path stroke-linecap="round" d="m21 21-4.35-4.35"/>
      </svg>
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        :placeholder="placeholder || 'Поиск...'"
        class="tw-bg-transparent tw-flex-1 tw-text-white tw-text-sm tw-placeholder-white/60 focus:tw-outline-none tw-min-w-0"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown.meta.k.prevent="inputRef?.focus()"
        @keydown.ctrl.k.prevent="inputRef?.focus()"
      />
      <kbd class="tw-shrink-0 tw-text-white/50 tw-text-xs tw-bg-white/15 tw-rounded tw-px-1.5 tw-py-0.5 tw-font-mono tw-leading-none">⌘K</kbd>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ placeholder?: string; modelValue?: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({ focus: () => inputRef.value?.focus() })
</script>
