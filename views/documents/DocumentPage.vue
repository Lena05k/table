<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doConfigs } from './config/index'
import { useDocumentPage } from './composables/useDocumentPage'
import DocumentHeader from './components/DocumentHeader.vue'
import DocumentViewTabs from './components/DocumentViewTabs.vue'
import DocumentToolbar from './components/DocumentToolbar.vue'
import DocumentFilterBar from './components/DocumentFilterBar.vue'
import DocumentStatsRow from './components/DocumentStatsRow.vue'
import DocumentTable from './components/DocumentTable.vue'
import DocumentPagination from './components/DocumentPagination.vue'
import ColumnConfigPanel from './components/ColumnConfigPanel.vue'

interface Props {
  configId: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()

const config = computed(() => doConfigs[props.configId])

// Guard: unknown DO config
const isUnknown = computed(() => !config.value)

const {
  activeTab,
  rows,
  loading,
  pagination,
  filters,
  table,
  load,
  onSortChanged,
  onFiltersApplied,
  setTab,
} = useDocumentPage(config.value ?? doConfigs['do2'])

function onToolbarAction(key: string): void {
  if (key === 'refresh') { load(); return }
  if (key === 'export') { table.exportToCsv(); return }
}

function onRowClicked(data: Record<string, unknown>): void {
  const code = data['code']
  if (code !== undefined) {
    router.push(`/do/${props.configId}/${code}`)
  }
}
</script>

<template>
  <div v-if="isUnknown" class="flex items-center justify-center h-64 text-gray-500 text-sm">
    Неизвестный тип ДО: <code class="ml-2 font-mono text-red-500">{{ configId }}</code>
  </div>

  <div v-else class="flex flex-col bg-white min-h-screen text-gray-900">
    <!-- Title + global search -->
    <DocumentHeader
      :title="config.title"
      @search="(q) => filters.setFilter('_search', q)"
      @favorite="() => {}"
    />

    <!-- Table / Kanban tabs + download -->
    <DocumentViewTabs
      :tabs="config.availableTabs"
      :active-tab="activeTab"
      @change="setTab"
      @download="table.exportToCsv()"
    />

    <!-- Toolbar: create, export, import, refresh, more + configure columns -->
    <DocumentToolbar
      :actions="config.toolbar"
      @action="onToolbarAction"
      @configure-columns="table.openColumnPanel()"
    />

    <!-- Filter bar: active filters badge, date range, role selector -->
    <DocumentFilterBar
      :filters-state="filters"
      @apply="onFiltersApplied"
      @open-filter-panel="() => {}"
    />

    <!-- Optional stats row: operations dropdown + stage counts + special blocks -->
    <DocumentStatsRow
      :operations="config.operations"
      :stats-blocks="config.statsBlocks"
      :special-blocks="config.specialBlocks"
      :stage-counts="{}"
      @operate="() => {}"
    />

    <!-- Pagination hint message when on first page with many results -->
    <div
      v-if="pagination.page.value === 1 && pagination.total.value > pagination.pageSize.value"
      class="px-5 py-2 text-xs text-gray-500 bg-blue-50 border-b border-blue-100"
    >
      Показаны первые {{ pagination.pageSize.value }} документов. Чтобы сократить выборку, воспользуйтесь поиском.
    </div>

    <!-- Kanban placeholder -->
    <div
      v-if="activeTab === 'kanban'"
      class="flex-1 flex items-center justify-center text-gray-400 text-sm py-20"
    >
      Канбан-вид в разработке
    </div>

    <!-- AG-Grid table -->
    <template v-if="activeTab === 'table'">
      <div class="flex-1 overflow-hidden">
        <DocumentTable
          :column-defs="config.columns"
          :row-data="rows"
          :loading="loading"
          :row-class-rules="config.rowClassRules"
          @grid-ready="table.onGridReady"
          @sort-changed="onSortChanged"
          @row-clicked="onRowClicked"
        />
      </div>

      <!-- Pagination bar -->
      <DocumentPagination :pagination-state="pagination" />
    </template>

    <!-- Column visibility slide-out panel -->
    <ColumnConfigPanel :table-state="table" />
  </div>
</template>
