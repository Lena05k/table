import type { DoPageConfig } from './types'
import { CODE_COLUMN, NUMBER_COLUMN, ACTIONS_COLUMN, dateCol, textCol } from './baseColumns'

export const do1Config: DoPageConfig = {
  id: 'do1',
  code: 1,
  title: 'Убытки ОСАГО',
  availableTabs: ['table', 'kanban'],
  pagination: { defaultPageSize: 20, pageSizeOptions: [20, 50, 100] },
  columns: [
    CODE_COLUMN,
    NUMBER_COLUMN,
    textCol('eventNumber', '№ события', 120),
    textCol('branchLossNumber', 'Вн. № убытка филиала', 180),
    textCol('damageTypeSed', 'Вид вреда СЭД', 150),
    textCol('supplyChannel', 'Канал подачи', 140),
    textCol('lossTypeDiasoft', 'Тип убытка DiaSoft', 160),
    dateCol('arrivedAtStage', 'Пришёл на этап', 160),
    dateCol('dtpDate', 'Дата ДТП', 140),
    dateCol('applicationDate', 'Дата заявления', 150),
    dateCol('docRequestDate', 'Дата запроса документов', 190),
    dateCol('closureDate', 'Дата закрытия', 150),
    dateCol('paymentDate', 'Дата выплаты', 150),
    dateCol('claimDate', 'Дата претензии', 155),
    ACTIONS_COLUMN,
  ],
  defaultSort: { field: 'arrivedAtStage', direction: 'desc' },
  filters: [
    {
      key: 'lossRegulationDivision',
      label: 'Подразделение урегулирования убытков',
      type: 'select',
      options: [],
    },
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
    {
      type: 'accept-queue',
      label: 'Принятие из очереди',
      stageId: 'current',
      routes: [],
    },
    {
      type: 'accept-list',
      label: 'Принятие из списка',
      stageId: 'current',
      routes: [],
    },
    {
      type: 'send',
      label: 'Отправка',
      stageId: 'current',
      routes: [],
    },
  ],
  statsBlocks: [
    { key: 'operations', label: 'Операция' },
    { key: 'waiting', label: 'Ожидающих на этапе', stageId: 'current' },
    { key: 'on-role', label: 'На роль', roleId: 'current' },
    { key: 'priority', label: 'Приоритизация убытков ОСАГО' },
  ],
}
