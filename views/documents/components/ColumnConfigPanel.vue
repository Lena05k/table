<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DocumentTableState } from '../composables/useDocumentTable'

interface Props {
  tableState: DocumentTableState
}
const props = defineProps<Props>()

const columns = ref<Array<{ colId: string; headerName: string; visible: boolean }>>([])

watch(
  () => props.tableState.columnPanelOpen.value,
  (open) => {
    if (open) {
      columns.value = props.tableState.getAllColumns()
    }
  },
)

function toggle(colId: string): void {
  const col = columns.value.find((c) => c.colId === colId)
  if (!col) return
  col.visible = !col.visible
  props.tableState.setColumnVisible(colId, col.visible)
}
</script>

<template>
  <Transition name="slide">
    <div
      v-if="tableState.columnPanelOpen.value"
      class="fixed inset-y-0 right-0 z-30 w-72 bg-white shadow-2xl border-l border-gray-200 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 class="text-sm font-semibold text-gray-900">Настройка колонок</h2>
        <button
          class="p-1 rounded hover:bg-gray-100 text-gray-500"
          @click="tableState.closeColumnPanel()"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Column list -->
      <div class="flex-1 overflow-y-auto py-2">
        <label
          v-for="col in columns"
          :key="col.colId"
          class="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            :checked="col.visible"
            @change="toggle(col.colId)"
          />
          <span class="text-sm text-gray-700">{{ col.headerName }}</span>
        </label>
      </div>
    </div>
  </Transition>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="tableState.columnPanelOpen.value"
      class="fixed inset-0 z-20 bg-black/20"
      @click="tableState.closeColumnPanel()"
    />
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
