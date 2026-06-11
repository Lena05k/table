<template>
  <div class="tw-relative tw-shrink-0" ref="rootRef">
    <button
      type="button"
      class="tw-flex tw-items-center tw-gap-2 tw-px-2 tw-py-1 tw-rounded tw-transition-colors hover:tw-bg-white/20"
      :class="{ 'tw-bg-white/20': open }"
      @click="open = !open"
    >
      <span class="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-bg-white tw-rounded-full tw-text-primary-600 tw-font-bold tw-text-sm tw-shrink-0 tw-select-none">
        {{ initials }}
      </span>
      <span class="tw-text-white tw-text-xs tw-leading-tight tw-text-left tw-max-w-[110px]">{{ name }}</span>
      <svg
        class="tw-w-3.5 tw-h-3.5 tw-text-white/70 tw-transition-transform tw-duration-150 tw-shrink-0"
        :class="{ 'tw-rotate-180': open }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <Transition
      enter-active-class="tw-transition tw-duration-100 tw-ease-out"
      enter-from-class="tw-opacity-0 tw-scale-95"
      enter-to-class="tw-opacity-100 tw-scale-100"
      leave-active-class="tw-transition tw-duration-75 tw-ease-in"
      leave-from-class="tw-opacity-100 tw-scale-100"
      leave-to-class="tw-opacity-0 tw-scale-95"
    >
      <div
        v-if="open"
        class="tw-absolute tw-top-full tw-right-0 tw-mt-1 tw-bg-white tw-rounded-lg tw-shadow-xl tw-z-[9999] tw-min-w-[160px] tw-py-1 tw-border tw-border-gray-100 tw-origin-top-right"
      >
        <div class="tw-px-4 tw-py-2 tw-border-b tw-border-gray-100">
          <p class="tw-text-xs tw-text-gray-400 tw-leading-tight">{{ name }}</p>
        </div>
        <a href="#" class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-50 tw-no-underline">
          <svg class="tw-w-4 tw-h-4 tw-text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
          Настройки
        </a>
        <hr class="tw-border-gray-100 tw-my-1"/>
        <a href="/logout/" class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-red-50 hover:tw-text-red-600 tw-no-underline">
          <svg class="tw-w-4 tw-h-4 tw-text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
          </svg>
          Выйти
        </a>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ name: string; initials: string }>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function onOutsideClick(e: MouseEvent): void {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick))
</script>
