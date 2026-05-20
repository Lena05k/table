<script setup lang="ts">
interface Props {
  label: string
  count: number
}
defineProps<Props>()
</script>

<template>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 bg-gray-50 text-sm text-gray-700">
    <span class="font-semibold text-orange-600">{{ count }}</span>
    <span>{{ label }}</span>
  </div>
</template>
