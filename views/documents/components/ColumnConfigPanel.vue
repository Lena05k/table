<template>
  <Transition name="slide">
    <div
      v-if="tableState.columnPanelOpen.value"
      class="tw-fixed tw-inset-y-0 tw-right-0 tw-z-30 tw-w-80 tw-bg-white tw-shadow-2xl tw-border-l tw-border-gray-200 tw-flex tw-flex-col"
    >
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
        <h2 class="tw-text-sm tw-font-semibold tw-text-gray-900">Настройка колонок</h2>
        <div class="tw-flex tw-items-center tw-gap-2">
          <button
            class="tw-text-xs tw-text-orange-600 hover:tw-text-orange-700 tw-underline"
            title="Сбросить все изменения"
            @click="resetAll"
          >
            Сбросить
          </button>
          <button
            class="tw-p-1 tw-rounded hover:tw-bg-gray-100 tw-text-gray-500"
            @click="tableState.closeColumnPanel()"
          >
            <svg class="tw-w-5 tw-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="tw-px-5 tw-py-2 tw-text-xs tw-text-gray-400 tw-border-b tw-border-gray-100 tw-flex tw-items-center tw-gap-4">
        <span>☑ видимость</span>
        <span>← закрепить слева</span>
        <span>→ закрепить справа</span>
      </div>

      <!-- Column list -->
      <div class="tw-flex-1 tw-overflow-y-auto tw-py-1">
        <div
          v-for="col in columns"
          :key="col.colId"
          class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 hover:tw-bg-gray-50"
          :class="{ 'tw-opacity-40': col.colId === 'row-select' }"
        >
          <!-- Visibility checkbox -->
          <input
            type="checkbox"
            class="tw-w-4 tw-h-4 tw-shrink-0 tw-rounded tw-border-gray-300 tw-accent-orange-500 tw-cursor-pointer"
            :checked="col.visible"
            :disabled="col.colId === 'row-select'"
            @change="toggle(col.colId)"
          />

          <!-- Column name -->
          <span class="tw-flex-1 tw-text-sm tw-text-gray-700 tw-truncate">
            {{ col.headerName || '—' }}
          </span>

          <!-- Pin buttons (skip for system columns) -->
          <template v-if="col.colId !== 'row-select' && col.colId !== 'actions'">
            <button
              class="tw-p-1 tw-rounded tw-text-xs tw-transition-colors"
              :class="col.pinned === 'left' ? 'tw-text-orange-500 tw-bg-orange-50' : 'tw-text-gray-400 hover:tw-text-gray-600 hover:tw-bg-gray-100'"
              title="Закрепить слева"
              @click="pin(col.colId, col.pinned === 'left' ? null : 'left')"
            >
              ←
            </button>
            <button
              class="tw-p-1 tw-rounded tw-text-xs tw-transition-colors"
              :class="col.pinned === 'right' ? 'tw-text-orange-500 tw-bg-orange-50' : 'tw-text-gray-400 hover:tw-text-gray-600 hover:tw-bg-gray-100'"
              title="Закрепить справа"
              @click="pin(col.colId, col.pinned === 'right' ? null : 'right')"
            >
              →
            </button>
          </template>
        </div>
      </div>

      <!-- Footer: save confirmation -->
      <div class="tw-px-5 tw-py-3 tw-border-t tw-border-gray-200 tw-text-xs tw-text-gray-400">
        Изменения сохраняются автоматически
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div
      v-if="tableState.columnPanelOpen.value"
      class="tw-fixed tw-inset-0 tw-z-20 tw-bg-black/20"
      @click="tableState.closeColumnPanel()"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ColumnConfigPanelProps } from './types/props'

const props = defineProps<ColumnConfigPanelProps>()

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
