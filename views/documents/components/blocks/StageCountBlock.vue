<template>
  <div class="tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-text-sm tw-text-gray-700">
    <span class="tw-font-semibold tw-text-orange-600">{{ count }}</span>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { StageCountBlockProps } from '../types/props'

defineProps<StageCountBlockProps>()
</script>
