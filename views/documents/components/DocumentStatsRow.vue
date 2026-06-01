<template>
  <div
    v-if="hasContent()"
    class="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-gray-100 bg-gray-50"
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
import type { StatsBlockConfig, OperationConfig, SpecialBlockKey } from '../config/types'
import OperationsBlock from './blocks/OperationsBlock.vue'
import StageCountBlock from './blocks/StageCountBlock.vue'
import PostalWorkBlock from './blocks/PostalWorkBlock.vue'

interface Props {
  statsBlocks?: StatsBlockConfig[]
  operations?: OperationConfig[]
  specialBlocks?: SpecialBlockKey[]
  stageCounts?: Record<string, number>
}

const props = withDefaults(defineProps<Props>(), {
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
