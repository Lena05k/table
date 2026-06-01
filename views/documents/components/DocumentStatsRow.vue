<template>
  <div
    v-if="hasContent()"
    class="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-px-5 tw-py-2.5 tw-border-b tw-border-gray-100 tw-bg-gray-50"
  >
    <OperationsBlock
      v-if="operations && operations.length > 0"
      :operations="operations"
      @operate="(p) => emit('operate', p)"
    />

    <StageCountBlock
      v-for="block in statsBlocks"
      :key="block.key"
      :label="block.label"
      :count="stageCounts[block.key] ?? 0"
    />

    <PostalWorkBlock
      v-if="specialBlocks?.includes('postal-work')"
    />
  </div>
</template>

<script setup lang="ts">
import OperationsBlock from './blocks/OperationsBlock.vue'
import StageCountBlock from './blocks/StageCountBlock.vue'
import PostalWorkBlock from './blocks/PostalWorkBlock.vue'
import type { DocumentStatsRowProps } from './types/props'

const props = withDefaults(defineProps<DocumentStatsRowProps>(), {
  statsBlocks: () => [],
  operations: () => [],
  specialBlocks: () => [],
  stageCounts: () => ({}),
})

const emit = defineEmits<{
  (e: 'operate', payload: { type: string; stageId: string; roleId?: string }): void
}>()

const hasContent = () =>
    (props.operations?.length ?? 0) > 0 ||
    (props.statsBlocks?.length ?? 0) > 0 ||
    (props.specialBlocks?.length ?? 0) > 0
</script>
