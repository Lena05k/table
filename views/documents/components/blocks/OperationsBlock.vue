<template>
  <div class="relative inline-block">
    <button
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="open = !open"
    >
      Операции
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
        v-if="open"
        class="absolute left-0 top-full mt-1 z-20 min-w-56 rounded-md border border-gray-200 bg-white shadow-lg"
    >
      <template v-for="op in operations" :key="op.type">
        <div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          {{ op.label }}
        </div>
        <button
            v-for="route in op.routes"
            :key="route.stageId"
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            @click="select(op, route)"
        >
          {{ route.label }}
        </button>
        <div v-if="op.routes.length === 0" class="px-4 py-2 text-sm text-gray-400 italic">
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
