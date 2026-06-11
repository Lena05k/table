<template>
  <button
    :title="title"
    type="button"
    class="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded tw-text-white tw-opacity-80 hover:tw-opacity-100 hover:tw-bg-white/20 tw-transition-all tw-shrink-0"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
defineEmits<{ click: [] }>()
</script>
