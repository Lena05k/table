<template>
  <div class="tw-relative" ref="rootRef">
    <a
      v-if="!hasDropdown && href"
      :href="href"
      class="tw-flex tw-items-center tw-px-3 tw-py-1.5 tw-text-white tw-text-sm tw-font-medium hover:tw-bg-white/20 tw-rounded tw-transition-colors tw-whitespace-nowrap tw-no-underline"
    >
      {{ label }}
    </a>
    <button
      v-else
      type="button"
      class="tw-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1.5 tw-text-white tw-text-sm tw-font-medium hover:tw-bg-white/20 tw-rounded tw-transition-colors tw-whitespace-nowrap"
      :class="{ 'tw-bg-white/20': open }"
      @click="hasDropdown ? (open = !open) : $emit('click')"
    >
      {{ label }}
      <svg
        v-if="hasDropdown"
        class="tw-w-3.5 tw-h-3.5 tw-opacity-70 tw-transition-transform tw-duration-150"
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
        class="tw-absolute tw-top-full tw-left-0 tw-mt-1 tw-bg-white tw-rounded-lg tw-shadow-xl tw-z-[9999] tw-min-w-[180px] tw-py-1 tw-border tw-border-gray-100 tw-origin-top-left tw-max-h-72 tw-overflow-y-auto"
      >
        <slot name="dropdown" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ label: string; href?: string; hasDropdown?: boolean }>()
defineEmits<{ click: [] }>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function onOutsideClick(e: MouseEvent): void {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick))
</script>
