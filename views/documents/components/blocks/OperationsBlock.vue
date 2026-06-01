<template>
  <div class="tw-relative tw-inline-block">
    <button
        class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded tw-border tw-border-gray-300 tw-bg-white tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
        @click="open = !open"
    >
      Операции
      <svg class="tw-w-3.5 tw-h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
        v-if="open"
        class="tw-absolute tw-left-0 tw-top-full tw-mt-1 tw-z-20 tw-min-w-56 tw-rounded-md tw-border tw-border-gray-200 tw-bg-white tw-shadow-lg"
    >
      <template v-for="op in operations" :key="op.type">
        <div class="tw-px-3 tw-py-1.5 tw-text-xs tw-font-semibold tw-text-gray-400 tw-uppercase tw-tracking-wide tw-border-b tw-border-gray-100">
          {{ op.label }}
        </div>
        <button
            v-for="route in op.routes"
            :key="route.stageId"
            class="tw-block tw-w-full tw-px-4 tw-py-2 tw-text-left tw-text-sm tw-text-gray-700 hover:tw-bg-gray-50"
            @click="select(op, route)"
        >
          {{ route.label }}
        </button>
        <div v-if="op.routes.length === 0" class="tw-px-4 tw-py-2 tw-text-sm tw-text-gray-400 tw-italic">
          Нет доступных маршрутов
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { OperationConfig } from '../../config/types'
import type { OperationsBlockProps } from '../types/props'

const props = defineProps<OperationsBlockProps>()

const emit = defineEmits<{
  (e: 'operate', payload: { type: string; stageId: string; roleId?: string }): void
}>()

const open = ref(false)

function select(op: OperationConfig, route: { stageId: string; roleId?: string }): void {
  emit('operate', { type: op.type, stageId: route.stageId, roleId: route.roleId })
  open.value = false
}
</script>
