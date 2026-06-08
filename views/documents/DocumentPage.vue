<template>
    <div class="tw-h-screen tw-overflow-hidden tw-bg-gray-100 tw-flex tw-justify-center">
        <div class="tw-w-full tw-max-w-[1700px] tw-h-full tw-bg-white tw-shadow-sm tw-flex tw-flex-col tw-text-gray-900">
            <!-- Title + global search -->
            <DocumentHeader :title="props.title ?? ''" @search="onSearch" @favorite="() => {}" />

            <!-- Sub-header: record count + action buttons -->
            <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-2 tw-border-b tw-border-gray-200 tw-bg-white tw-shrink-0">
                <span class="tw-text-xs tw-text-gray-500">
                    {{ countLabel }}
                </span>
                <div class="tw-flex tw-items-center tw-gap-1">
                    <button
                        class="tw-p-1.5 tw-rounded hover:tw-bg-gray-100 tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors"
                        title="Экспорт CSV"
                        @click="table.exportToCsv()"
                    >
                        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </button>
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
                    @grid-ready="table.onGridReady"
                    @sort-changed="onSortChanged"
                    @row-clicked="onRowClicked"
                    @column-state-changed="table.saveColumnState()"
                    @view="onRowClicked"
                    @enable-select="() => {}"
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
import DocumentHeader from '@/views/documents/crm/documentTables/components/DocumentHeader.vue';
import DocumentTable from '@/views/documents/crm/documentTables/components/DocumentTable.vue';
import DocumentPagination from '@/views/documents/crm/documentTables/components/DocumentPagination.vue';
import ColumnConfigPanel from '@/views/documents/crm/documentTables/components/ColumnConfigPanel.vue';
import { usePagination } from '@/views/documents/crm/documentTables/composable/usePagination';
import { useDocumentTable } from '@/views/documents/crm/documentTables/composable/useDocumentTable';
import type { DataCell, FieldDef } from './types/widget';

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

// ─── Column definitions ───────────────────────────────────────────────────────

const colDefs = computed<ColDef[]>(() =>
    Object.entries(columns.value)
        .filter(([, field]) => field != null)
        .map(([sysName, field]) => ({
            colId: sysName,
            field: sysName,
            headerName: (field as FieldDef)[0] ?? sysName,
            sortable: (field as FieldDef).CAN_SORTING ?? false,
            resizable: true,
            minWidth: 80,
            suppressHeaderMenuButton: !(field as FieldDef).CAN_SORTING,
        }))
);

// ─── Row data ─────────────────────────────────────────────────────────────────

const allRowData = computed<Record<string, unknown>[]>(() =>
    rows.value.map((cells, rowIdx) => {
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
        return row;
    })
);

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
