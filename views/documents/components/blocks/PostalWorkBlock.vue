<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
      @click="emit('work-with-lists')"
    >
      Работа со списками
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
      @click="emit('work-with-return')"
    >
      Работа с возвратом
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
      @click="emit('send-xml')"
    >
      <!-- envelope icon -->
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
      Выбрать файл XML / Отправить
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
      @click="emit('print-outgoing')"
    >
      Печать исходящих документов по фильтру
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
      @click="emit('ops-directory')"
    >
      Справочник индексов ОПС
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'work-with-lists'): void
  (e: 'work-with-return'): void
  (e: 'send-xml'): void
  (e: 'print-outgoing'): void
  (e: 'ops-directory'): void
}>()
</script>
