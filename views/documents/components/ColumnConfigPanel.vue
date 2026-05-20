<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DocumentTableState } from '../composables/useDocumentTable'

interface Props {
  tableState: DocumentTableState
}
const props = defineProps<Props>()

const columns = ref<Array<{ colId: string; headerName: string; visible: boolean; pinned: string | null | boolean }>>([])

watch(
  () => props.tableState.columnPanelOpen.value,
  (open) => {
    if (open) columns.value = props.tableState.getAllColumns()
  },
)

function toggle(colId: string): void {
  const col = columns.value.find((c) => c.colId === colId)
  if (!col) return
  col.visible = !col.visible
  props.tableState.setColumnVisible(colId, col.visible)
}

function pin(colId: string, side: 'left' | 'right' | null): void {
  props.tableState.gridApi.value?.setColumnsPinned([colId], side)
  props.tableState.saveColumnState()
  columns.value = props.tableState.getAllColumns()
}

function resetAll(): void {
  props.tableState.resetColumnState()
  columns.value = props.tableState.getAllColumns()
}
</script>

<template>
  <Transition name="slide">
    <div
      v-if="tableState.columnPanelOpen.value"
      class="fixed inset-y-0 right-0 z-30 w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 class="text-sm font-semibold text-gray-900">Настройка колонок</h2>
        <div class="flex items-center gap-2">
          <button
            class="text-xs text-orange-600 hover:text-orange-700 underline"
            title="Сбросить все изменения"
            @click="resetAll"
          >
            Сбросить
          </button>
          <button
            class="p-1 rounded hover:bg-gray-100 text-gray-500"
            @click="tableState.closeColumnPanel()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="px-5 py-2 text-xs text-gray-400 border-b border-gray-100 flex items-center gap-4">
        <span>☑ видимость</span>
        <span>← закрепить слева</span>
        <span>→ закрепить справа</span>
      </div>

      <!-- Column list -->
      <div class="flex-1 overflow-y-auto py-1">
        <div
          v-for="col in columns"
          :key="col.colId"
          class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
          :class="{ 'opacity-40': col.colId === 'row-select' }"
        >
          <!-- Visibility checkbox -->
          <input
            type="checkbox"
            class="w-4 h-4 shrink-0 rounded border-gray-300 accent-orange-500 cursor-pointer"
            :checked="col.visible"
            :disabled="col.colId === 'row-select'"
            @change="toggle(col.colId)"
          />

          <!-- Column name -->
          <span class="flex-1 text-sm text-gray-700 truncate">
            {{ col.headerName || '—' }}
          </span>

          <!-- Pin buttons (skip for system columns) -->
          <template v-if="col.colId !== 'row-select' && col.colId !== 'actions'">
            <button
              class="p-1 rounded text-xs transition-colors"
              :class="col.pinned === 'left' ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
              title="Закрепить слева"
              @click="pin(col.colId, col.pinned === 'left' ? null : 'left')"
            >
              ←
            </button>
            <button
              class="p-1 rounded text-xs transition-colors"
              :class="col.pinned === 'right' ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
              title="Закрепить справа"
              @click="pin(col.colId, col.pinned === 'right' ? null : 'right')"
            >
              →
            </button>
          </template>
        </div>
      </div>

      <!-- Footer: save confirmation -->
      <div class="px-5 py-3 border-t border-gray-200 text-xs text-gray-400">
        Изменения сохраняются автоматически
      </div>
    </div>
  </Transition>

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
