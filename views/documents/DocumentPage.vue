<template>
  <div v-if="isUnknown" class="tw-flex tw-items-center tw-justify-center tw-h-64 tw-text-gray-500 tw-text-sm">
    Неизвестный тип ДО: <code class="tw-ml-2 tw-font-mono tw-text-red-500">{{ configId }}</code>
  </div>

  <div v-else class="tw-h-screen tw-overflow-hidden tw-bg-gray-100 tw-flex tw-justify-center">
    <div class="tw-w-full tw-max-w-[1700px] tw-h-full tw-bg-white tw-shadow-sm tw-flex tw-flex-col tw-text-gray-900">
      <!-- Title + global search -->
      <DocumentHeader
        :title="config.title"
        @search="onSearch"
        @favorite="() => {}"
      />

      <!-- Table / Kanban tabs + download -->
      <DocumentViewTabs
        :tabs="config.availableTabs"
        :active-tab="activeTab"
        @change="setTab"
        @download="table.exportToCsv()"
      />

      <!-- Single action+filter row: [Create][Export][Import][★][↻][...] ··· [Filters][Date][Role][Configure] -->
      <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-2.5 tw-gap-4 tw-border-b tw-border-gray-200 tw-bg-white tw-shrink-0">
        <DocumentToolbar
          :actions="config.toolbar"
          @action="onToolbarAction"
        />
        <DocumentFilterBar
          :filters-state="filters"
          @apply="onFiltersApplied"
          @open-filter-panel="() => {}"
          @configure-columns="table.openColumnPanel()"
        />
      </div>

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
        class="tw-px-5 tw-py-2 tw-text-xs tw-text-gray-500 tw-bg-blue-50 tw-border-b tw-border-blue-100 tw-shrink-0"
      >
        Показаны первые {{ pagination.pageSize.value }} документов. Чтобы сократить выборку, воспользуйтесь поиском.
      </div>

      <!-- Kanban placeholder -->
      <div
        v-if="activeTab === 'kanban'"
        class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-text-sm"
      >
        Канбан-вид в разработке
      </div>

      <!-- AG-Grid table — flex-1 min-h-0 so it fills remaining space and scrolls internally -->
      <template v-if="activeTab === 'table'">
        <div class="tw-flex-1 tw-min-h-0 tw-overflow-hidden">
          <DocumentTable
            :column-defs="config.columns"
            :row-data="rows"
            :loading="loading"
            :selection-mode="table.selectionMode.value"
            :row-class-rules="config.rowClassRules"
            @grid-ready="table.onGridReady"
            @sort-changed="onSortChanged"
            @row-clicked="onRowClicked"
            @column-state-changed="table.saveColumnState()"
            @view="onView"
            @enable-select="onEnableSelect"
            @edit="onEdit"
            @delete="onDelete"
          />
        </div>

        <!-- Pagination bar -->
        <DocumentPagination :pagination-state="pagination" />
      </template>

      <!-- Column visibility slide-out panel -->
      <ColumnConfigPanel :table-state="table" />
    </div>
  </div>
</template>

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
import type { DocumentPageProps } from './types/props'

const props = defineProps<DocumentPageProps>()
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

let _searchTimer: ReturnType<typeof setTimeout>
function onSearch(query: string): void {
  clearTimeout(_searchTimer)
  filters.setFilter('_search', query)
  _searchTimer = setTimeout(() => {
    pagination.reset()
    load()
  }, 300)
}

function onRowClicked(data: Record<string, unknown>): void {
  const code = data['code']
  if (code !== undefined) {
    router.push(`/do/${props.configId}/${code}`)
  }
}

function onEnableSelect(_data: Record<string, unknown>): void {
  table.enableSelection()
}

function onView(data: Record<string, unknown>): void {
  onRowClicked(data)
}

function onEdit(_data: Record<string, unknown>): void {
  // TODO: open edit modal
}

function onDelete(_data: Record<string, unknown>): void {
  // TODO: confirm + delete
}
</script>
