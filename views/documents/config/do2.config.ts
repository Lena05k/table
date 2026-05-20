import type { DoPageConfig } from './types'
import type { RowClassParams } from 'ag-grid-community'
import { CODE_COLUMN, NUMBER_COLUMN, ACTIONS_COLUMN, dateCol, textCol } from './baseColumns'

export const do2Config: DoPageConfig = {
  id: 'do2',
  code: 2,
  title: 'Убытки КАСКО',
  availableTabs: ['table', 'kanban'],
  pagination: { defaultPageSize: 20, pageSizeOptions: [20, 50, 100] },
  columns: [
    CODE_COLUMN,
    NUMBER_COLUMN,
    textCol('applicantName', 'ФИО Заявителя', 220),
    textCol('applicantPhone', 'Телефон заявителя', 160),
    dateCol('eventDate', 'Дата события', 170),
    textCol('insuranceType', 'Вид страхования', 140),
    textCol('insurerVictimName', 'ФИО страхователя потерпевшего', 250),
    textCol('victimContract', 'Договор потерпевшего', 200),
    textCol('victimGovNumber', 'Гос. номер потерпевшего', 190),
    textCol('eventNumber', '№ события', 130),
    textCol('branch', 'Филиал', 140),
    textCol('branchInternalNumber', 'Внут. номер убытка филиала', 210),
    dateCol('docCreatedDate', 'Дата создания документа', 200),
    textCol('notes', 'Примечания', 180),
    textCol('stageStatus', 'Этап/Стадия УУ', 150),
    textCol('lastMessage', 'Последнее сообщение', 200),
    dateCol('transferDate', 'Дата передачи', 155),
    dateCol('refusalDate', 'Дата отказа', 140),
    textCol('stoaAccount', '№ счёта (для реестра СТОА)', 200),
    dateCol('executorOrderDate', 'Дата заказа исполнителю', 200),
    textCol('diasoftStatus', 'Статус из Диасофт', 160),
    textCol('placementWithoutCert', 'Размещение без справок', 190),
    textCol('lossCurator', 'Куратор по убытку', 160),
    textCol('branchContractLoss', 'Убыток по договору филиала', 210),
    textCol('preliminaryDecision', 'Предварительное решение по делу', 240),
    ACTIONS_COLUMN,
  ],
  defaultSort: { field: 'eventDate', direction: 'desc' },
  filters: [
    { key: 'branchName', label: 'Наименование филиала', type: 'select', options: [] },
    { key: 'damageTypeSed', label: 'Вид вреда СЭД', type: 'select', options: [] },
    { key: 'supplyChannel', label: 'Канал подачи', type: 'select', options: [] },
  ],
  toolbar: [
    { key: 'create', label: 'Создать', icon: 'plus', variant: 'primary', action: 'create' },
    { key: 'export', label: 'Экспорт', icon: 'arrow-up-tray', variant: 'default', action: 'export', hasDropdown: true },
    { key: 'import', label: 'Импорт', icon: 'arrow-down-tray', variant: 'default', action: 'import' },
    { key: 'favorite', label: '', icon: 'star', variant: 'icon', action: 'favorite' },
    { key: 'refresh', label: '', icon: 'arrow-path', variant: 'icon', action: 'refresh' },
    { key: 'more', label: '', icon: 'ellipsis-horizontal', variant: 'icon', action: 'more' },
  ],
  operations: [
    { type: 'accept-queue', label: 'Принятие из очереди', stageId: 'current', routes: [] },
    { type: 'accept-list', label: 'Принятие из списка', stageId: 'current', routes: [] },
    { type: 'send', label: 'Отправка', stageId: 'current', routes: [] },
  ],
  statsBlocks: [
    { key: 'waiting', label: 'Ожидающих на этапе', stageId: 'current' },
    { key: 'on-role', label: 'На роль', roleId: 'current' },
  ],
  rowClassRules: {
    'row-green': (params: RowClassParams<Record<string, unknown>>) =>
      params.data?.highlighted === 'green',
    'row-yellow': (params: RowClassParams<Record<string, unknown>>) =>
      params.data?.highlighted === 'yellow',
    'row-red': (params: RowClassParams<Record<string, unknown>>) =>
      params.data?.highlighted === 'red',
  },
}
