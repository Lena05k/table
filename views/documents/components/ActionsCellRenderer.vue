<template>
  <div class="flex items-center justify-center gap-1 h-full">
    <!-- Eye: open document card -->
    <button
      class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      title="Просмотр"
      @click.stop="handleView"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <!-- Three dots: context menu -->
    <button
      class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      title="Действия"
      @click.stop="openMenu"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    </button>
  </div>

  <!-- Dropdown via Teleport to avoid grid clipping -->
  <Teleport to="body">
    <!-- backdrop closes menu -->
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-40"
      @click="menuOpen = false"
    />

    <Transition name="menu-drop">
      <div
        v-if="menuOpen"
        class="fixed z-50 w-44 rounded-lg border border-gray-200 bg-white shadow-xl py-1 text-sm"
        :style="menuStyle"
      >
        <button
          class="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
          @click="handleView"
        >
          <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Просмотр
        </button>

        <button
          class="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
          @click="handleSelect"
        >
          <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Выбрать
        </button>

        <button
          class="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
          @click="handleEdit"
        >
          <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Редактировать
        </button>

        <div class="my-1 h-px bg-gray-100" />

        <button
          class="flex items-center gap-2.5 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
          @click="handleDelete"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Удалить
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { ActionContext } from '../types/widget'

type ActionParams = ICellRendererParams<Record<string, unknown>, unknown, ActionContext>

const props = defineProps<{ params: ActionParams }>()

const menuOpen = ref(false)
const menuStyle = ref({ top: '0px', left: '0px' })

function openMenu(event: MouseEvent): void {
  const btn = event.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  // open below the button, right-aligned
  menuStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.right - 160}px`,
  }
  menuOpen.value = true
}

function handleView(): void {
  props.params.context?.onView?.(props.params.data ?? {})
  menuOpen.value = false
}

function handleSelect(): void {
  props.params.context?.onEnableSelect?.(props.params.data ?? {})
  props.params.node.setSelected(true, true)
  menuOpen.value = false
}

function handleEdit(): void {
  props.params.context?.onEdit?.(props.params.data ?? {})
  menuOpen.value = false
}

function handleDelete(): void {
  props.params.context?.onDelete?.(props.params.data ?? {})
  menuOpen.value = false
}
</script>

<style scoped>
.menu-drop-enter-active,
.menu-drop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.menu-drop-enter-from,
.menu-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

