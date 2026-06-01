<template>
  <div class="flex items-center justify-center h-full">
    <input
      type="radio"
      name="row-radio-select"
      :checked="selected"
      class="w-4 h-4 cursor-pointer accent-orange-500"
      @change="onRadioChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'

const props = defineProps<{ params: ICellRendererParams }>()

const selected = ref(props.params.node.isSelected() ?? false)

function updateSelection(): void {
  selected.value = props.params.node.isSelected() ?? false
}

onMounted(() => {
  props.params.api.addEventListener('selectionChanged', updateSelection)
})

onBeforeUnmount(() => {
  props.params.api.removeEventListener('selectionChanged', updateSelection)
})

function onRadioChange(): void {
  props.params.node.setSelected(true, true)
}
</script>
