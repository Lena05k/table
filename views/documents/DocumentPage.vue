<template>
    <div class="tw-h-screen tw-overflow-hidden tw-bg-gray-100 tw-flex tw-justify-center">
        <div class="tw-w-full tw-max-w-[1700px] tw-h-full tw-bg-white tw-shadow-sm tw-flex tw-flex-col tw-text-gray-900">

            <!-- Title + global search -->
            <DocumentHeader :title="props.title ?? ''" @search="onSearch" @favorite="() => {}" />

            <!-- Toolbar: action buttons -->
            <div v-if="toolbarActions.length" class="tw-flex tw-items-center tw-px-5 tw-py-2 tw-border-b tw-border-gray-200 tw-bg-white tw-shrink-0">
                <DocumentToolbar :actions="toolbarActions" @action="onToolbarAction" />
            </div>

            <!-- Stats + operations row -->
            <DocumentStatsRow v-if="statsBlocks.length || operations.length" :stats-blocks="statsBlocks" :operations="operations" />

            <!-- Sub-header: record count + column settings -->
            <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-2 tw-border-b tw-border-gray-200 tw-bg-white tw-shrink-0">
                <span class="tw-text-xs tw-text-gray-500">{{ countLabel }}</span>
                <button
                    class="tw-p-1.5 tw-rounded hover:tw-bg-gray-100 tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors"
                    title="Настройка колонок"
                    @click="table.openColumnPanel()"
                >
                    <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15M3 9h18M3 15h18" />
                    </svg>
                </button>
            </div>

            <!-- Empty states -->
            <div v-if="filteredRows.length === 0 && allRowData.length > 0" class="tw-p-10 tw-text-center tw-text-gray-400 tw-text-sm">
                По запросу «{{ searchQuery }}» ничего не найдено
            </div>
            <div v-else-if="allRowData.length === 0" class="tw-p-10 tw-text-center tw-text-gray-400 tw-text-sm">
                Нет данных для отображения
            </div>

            <!-- AG-Grid table -->
            <div v-if="allRowData.length > 0 && filteredRows.length > 0" class="tw-flex-1 tw-min-h-0 tw-overflow-hidden">
                <DocumentTable
                    :column-defs="colDefs"
                    :row-data="pageRows"
                    :loading="false"
                    :selection-mode="table.selectionMode.value"
                    @grid-ready="table.onGridReady"
                    @sort-changed="onSortChanged"
                    @row-clicked="onRowClicked"
                    @column-state-changed="table.saveColumnState()"
                    @view="onRowClicked"
                    @enable-select="table.enableSelection"
                    @edit="() => {}"
                    @delete="() => {}"
                />
            </div>

            <!-- Pagination bar -->
            <DocumentPagination v-if="allRowData.length > 0" :pagination-state="pagination" />

            <!-- Column visibility slide-out panel -->
            <ColumnConfigPanel :table-state="table" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ColDef } from 'ag-grid-community';
import DocumentHeader from './components/DocumentHeader.vue';
import DocumentTable from './components/DocumentTable.vue';
import DocumentPagination from './components/DocumentPagination.vue';
import DocumentToolbar from './components/DocumentToolbar.vue';
import DocumentStatsRow from './components/DocumentStatsRow.vue';
import ColumnConfigPanel from './components/ColumnConfigPanel.vue';
import { usePagination } from './composables/usePagination';
import { useDocumentTable } from './composables/useDocumentTable';
import type { FieldDef } from './types/widget';
import type { ToolbarAction, StatsBlockConfig, OperationConfig } from './config/types';

function safeJson<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

const props = defineProps({
    fieldAlias:       { type: String, default: '{}' },
    rowsJson:         { type: String, default: '[]' },
    docIdsJson:       { type: String, default: '[]' },
    toolbarJson:      { type: String, default: '[]' },
    statsBlocksJson:  { type: String, default: '[]' },
    operationsJson:   { type: String, default: '[]' },
    project:          { type: String, default: '' },
    classId:          { type: String, default: '' },
    parentDocumentId: { type: String, default: '' },
    title:            { type: String, default: '' },
});

const projectId = computed(() => props.project || props.classId || '');

// ─── Parse props ──────────────────────────────────────────────────────────────

const columns = computed<Record<string, FieldDef>>(() => {
    const v = safeJson(props.fieldAlias, {});
    return v && typeof v === 'object' ? v : {};
});
const rows = computed<unknown[][]>(() => {
    const v = safeJson(props.rowsJson, []);
    return Array.isArray(v) ? v : [];
});
const docIds = computed<string[]>(() => {
    const v = safeJson(props.docIdsJson ?? '[]', []);
    return Array.isArray(v) ? v : [];
});
const toolbarActions = computed<ToolbarAction[]>(() => {
    const v = safeJson(props.toolbarJson, []);
    return Array.isArray(v) ? v : [];
});
const statsBlocks = computed<StatsBlockConfig[]>(() => {
    const v = safeJson(props.statsBlocksJson, []);
    return Array.isArray(v) ? v : [];
});
const operations = computed<OperationConfig[]>(() => {
    const v = safeJson(props.operationsJson, []);
    return Array.isArray(v) ? v : [];
});

// ─── Column definitions ───────────────────────────────────────────────────────

const colDefs = computed<ColDef[]>(() => {
    const cols = Object.entries(columns.value)
        .filter(([, field]) => field != null)
        .map(([sysName, field]) => ({
            colId: sysName,
            field: sysName,
            headerName: (field as FieldDef)[0] ?? sysName,
            sortable: (field as FieldDef).CAN_SORTING ?? false,
            resizable: true,
            minWidth: 80,
            suppressHeaderMenuButton: !(field as FieldDef).CAN_SORTING,
        }));
    console.log('[colDefs] колонок:', cols.length, '| первая:', cols[0]);
    return cols;
});

// ─── Row data ─────────────────────────────────────────────────────────────────

const allRowData = computed<Record<string, unknown>[]>(() => {
    console.log('[allRowData] rows длина:', rows.value.length, '| docIds длина:', docIds.value.length);

    const result = rows.value.map((cells, rowIdx) => {
        const row: Record<string, unknown> = {};
        const cellsArr = Array.isArray(cells)
            ? cells
            : Object.values(cells && typeof cells === 'object' ? cells as Record<string, unknown> : {});

        for (const rawCell of cellsArr) {
            const cell = rawCell as Record<string, unknown>;
            if (!cell || typeof cell !== 'object') continue;
            const key = (cell.sys_name as string) || (cell.id ? `FIELD_${cell.id}` : '');
            if (!key) continue;
            row[key] = cell.value_title ?? cell.value ?? '';
        }

        row._docId = docIds.value[rowIdx] ?? Object.values(row)[0] ?? '';

        if (rowIdx === 0) {
            console.log('[allRowData] row[0] ячеек в cellsArr:', cellsArr.length, '| isArray:', Array.isArray(cells));
            console.log('[allRowData] row[0] результат:', row);
        }

        return row;
    });

    console.log('[allRowData] итого строк:', result.length);
    return result;
});

// ─── Search ───────────────────────────────────────────────────────────────────

const searchQuery = ref('');
let _searchTimer: ReturnType<typeof setTimeout>;

const searchIndex = computed<string[]>(() => {
    const data = allRowData.value;
    const n = data.length;
    const idx = new Array<string>(n);
    for (let i = 0; i < n; i++) {
        const row = data[i];
        const keys = Object.keys(row);
        const kLen = keys.length;
        let str = '';
        for (let j = 0; j < kLen; j++) {
            const k = keys[j];
            if (k.charCodeAt(0) === 95) continue;
            if (str.length > 0) str += '\0';
            const v = row[k];
            if (v !== null && v !== undefined) str += v;
        }
        idx[i] = str.toLowerCase();
    }
    return idx;
});

const filteredRows = computed<Record<string, unknown>[]>(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return allRowData.value;
    const data = allRowData.value;
    const idx = searchIndex.value;
    const n = data.length;
    const result: Record<string, unknown>[] = [];
    for (let i = 0; i < n; i++) {
        if (idx[i].includes(q)) result.push(data[i]);
    }
    return result;
});

function onSearch(query: string): void {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
        searchQuery.value = query;
        pagination.reset();
    }, 250);
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

const sortModel = ref<{ colId: string; sort: string }[]>([]);

const sortedRows = computed<Record<string, unknown>[]>(() => {
    if (!sortModel.value.length) return filteredRows.value;
    const sorted = filteredRows.value.slice();
    const { colId, sort } = sortModel.value[0];
    const dir = sort === 'asc' ? 1 : -1;
    const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });
    sorted.sort((a, b) => dir * collator.compare(String(a[colId] ?? ''), String(b[colId] ?? '')));
    return sorted;
});

function onSortChanged(model: { colId: string; sort: string }[]): void {
    sortModel.value = model;
    pagination.reset();
}

// ─── Pagination ───────────────────────────────────────────────────────────────

const pagination = usePagination(50, [25, 50, 100, 200]);

watch(sortedRows, r => { pagination.setTotal(r.length); }, { immediate: true });

const pageRows = computed<Record<string, unknown>[]>(() => {
    const from = (pagination.page.value - 1) * pagination.pageSize.value;
    const to = from + pagination.pageSize.value;
    return sortedRows.value.slice(from, to);
});

const countLabel = computed(() => {
    const total = allRowData.value.length;
    const filtered = filteredRows.value.length;
    if (total === 0) return '0 записей';
    return filtered === total ? `${total} записей` : `${filtered} из ${total}`;
});

// ─── AG-Grid table state ──────────────────────────────────────────────────────

const table = useDocumentTable(projectId.value || 'doc');

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function onToolbarAction(key: string): void {
    switch (key) {
        case 'export':
            table.exportToCsv();
            break;
        case 'refresh':
            table.refreshCells();
            break;
        case 'columns':
            table.openColumnPanel();
            break;
        case 'reset-columns':
            table.resetColumnState();
            break;
        case 'select':
            table.enableSelection();
            break;
        case 'create':
            window.location.href = `?progectId=${projectId.value}&action=create`;
            break;
        default:
            console.log('[toolbar] action не обработан:', key);
    }
}

// ─── Row navigation ───────────────────────────────────────────────────────────

function onRowClicked(data: Record<string, unknown>): void {
    const docId = data._docId;
    const pid = projectId.value;
    if (!docId || !pid) return;

    if (props.parentDocumentId) {
        const url = `/documents/?progectId=${pid}&parentDocumentId=${props.parentDocumentId}&documentId=${docId}`;
        const openWindow = (window as unknown as Record<string, unknown>)['openWindow'];
        if (typeof openWindow === 'function') {
            (openWindow as (u: string, w: number, h: number) => void)(url, 1100, 710);
        } else {
            window.open(url, '_blank', 'width=1100,height=710');
        }
    } else {
        window.location.href = `?progectId=${pid}&documentId=${docId}`;
    }
}
</script>
