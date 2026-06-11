<template>
  <a :href="href" class="tw-flex tw-items-center tw-gap-2 tw-shrink-0 tw-text-white hover:tw-opacity-90 tw-transition-opacity tw-no-underline">
    <svg class="tw-w-7 tw-h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="22" rx="2" fill="white" fill-opacity="0.95"/>
      <path d="M8 9h9M8 13h9M8 17h5" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="17" y="10" width="7" height="14" rx="1.5" fill="white" fill-opacity="0.2" stroke="white" stroke-opacity="0.5" stroke-width="1"/>
    </svg>
    <span class="tw-font-bold tw-text-lg tw-tracking-wide tw-leading-none">СЭД</span>
  </a>
</template>

<script setup lang="ts">
defineProps<{ href?: string }>()
</script>
