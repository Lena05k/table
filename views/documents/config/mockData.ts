import type { DoConfigMap } from './types'

// ─── Vocabulary ───────────────────────────────────────────────────────────────

const BRANCHES = ['Тюменский', 'Уральский', 'Московский', 'Сибирский', 'Поволжский', 'Южный']
const STAGES   = ['Рассмотрение', 'Проверка', 'Оплата', 'Назначен', 'Закрыто']
const MESSAGES = ['', 'Ожидает документы', 'Запрошены документы', 'Платёж проведён', 'Ожидает звонка', 'Новое сообщение', '']
const TYPES    = ['КАСКО', 'ОСАГО', 'Имущество', 'Жизнь']
const COLORS   = ['', '', '', 'green', 'yellow', '', '']
const LAST     = ['Андреев', 'Беаусенко', 'Фёдорова', 'Громов', 'Сорокина', 'Никитин', 'Власова', 'Павлов', 'Зайцева', 'Белов', 'Козлова', 'Морозов', 'Балдин', 'Борисова', 'Карпов']
const FIRST    = ['Михаил', 'Татьяна', 'Светлана', 'Дмитрий', 'Мария', 'Алексей', 'Екатерина', 'Игорь', 'Ольга', 'Константин', 'Наталья', 'Андрей', 'Иван', 'Анна', 'Павел']
const MIDDLE   = ['Алексеевич', 'Юрьевна', 'Игоревна', 'Олегович', 'Павловна', 'Сергеевич', 'Андреевна', 'Викторович', 'Николаевна', 'Михайлович', 'Дмитриевна', 'Александрович', 'Петрович', 'Ивановна', 'Владимирович']
const PLATES   = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т']
const REGIONS  = ['159', '161', '777', '196', '98', '750', '774', '799', '197', '163']
const SUFFIXES = ['АА', 'АВ', 'АЕ', 'ВА', 'ВВ', 'КА', 'МА', 'НА', 'ОА', 'РА']

const pick  = <T>(arr: T[], i: number): T => arr[i % arr.length]
const pad   = (n: number, len = 2) => String(n).padStart(len, '0')
const datef = (i: number) =>
  pad(1 + (i % 28)) + '.' + pad(1 + (i % 12)) + '.' + (i % 5 === 0 ? '2024' : '2026') +
  ' ' + pad(i % 24) + ':' + pad(i % 60)

// ─── Generators — O(n), run once at module load ───────────────────────────────
// new Array(count) pre-allocates — V8 uses a fixed-size backing store
// instead of growing the array incrementally as .push() would require.

function generateDo2(count: number): Record<string, unknown>[] {
  const result = new Array<Record<string, unknown>>(count)
  for (let i = 0; i < count; i++) {
    const hasName = i % 3 !== 0
    const name    = pick(LAST, i) + ' ' + pick(FIRST, i + 3) + ' ' + pick(MIDDLE, i + 7)
    const plate   = pick(PLATES, i) + pad(100 + (i % 900), 3) + pick(SUFFIXES, i + 2) + pick(REGIONS, i)
    const closed  = pick(STAGES, i) === 'Закрыто'
    result[i] = {
      code:              String(95_000_000 + i),
      number:            (90_000 + i) + '/26',
      applicantName:     hasName ? name : '',
      applicantPhone:    i % 4 !== 0 ? '9' + pad(10 + (i % 90)) + ' ' + pad(100 + (i % 900), 3) + ' ' + pad(i % 90) + ' ' + pad(i % 90) : '',
      eventDate:         datef(i),
      insuranceType:     pick(TYPES, i),
      insurerVictimName: i % 5 === 0 ? name : '',
      victimContract:    (1000 + (i % 9000)) + '-' + (1_000_000 + i) + '/25ТФ',
      victimGovNumber:   plate,
      branch:            pick(BRANCHES, i),
      stageStatus:       pick(STAGES, i),
      lastMessage:       pick(MESSAGES, i),
      transferDate:      closed ? datef(i).slice(0, 10) : '',
      highlighted:       pick(COLORS, i),
    }
  }
  return result
}

function generateDo1(count: number): Record<string, unknown>[] {
  const DAMAGE  = ['Ущерб ТС', 'Вред жизни', 'Утрата ТС', 'Ущерб имущества']
  const CHANNEL = ['Онлайн', 'Офис', 'Агент', 'Телефон']
  const LOSS    = ['Тотал', 'Частичный', 'Угон']
  const PREF    = ['ТФ', 'МФ', 'УФ', 'СФ']
  const result  = new Array<Record<string, unknown>>(count)
  for (let i = 0; i < count; i++) {
    const d = pad(1 + (i % 28))
    const m = pad(1 + (i % 12))
    result[i] = {
      code:             String(12_000_000 + i),
      number:           (10_000 + i) + '/26',
      eventNumber:      'С-' + pad(i + 1, 3) + '-2026',
      branchLossNumber: pick(PREF, i) + '-' + (1000 + i),
      damageTypeSed:    pick(DAMAGE, i),
      supplyChannel:    pick(CHANNEL, i),
      lossTypeDiasoft:  pick(LOSS, i),
      arrivedAtStage:   d + '.' + m + '.2026',
      dtpDate:          pad(Math.max(1, (i % 28) - 5)) + '.' + m + '.2026',
      applicationDate:  pad(Math.max(1, (i % 28) - 3)) + '.' + m + '.2026',
      paymentDate:      i % 3 === 0 ? pad(Math.min(28, (i % 28) + 2)) + '.' + m + '.2026' : '',
      closureDate:      i % 5 === 0 ? pad(Math.min(28, (i % 28) + 4)) + '.' + m + '.2026' : '',
      claimDate:        i % 7 === 0 ? d + '.' + m + '.2026' : '',
    }
  }
  return result
}

// Stable module-level references — required for WeakMap/Map cache keys
export const mockData: Record<keyof DoConfigMap, Record<string, unknown>[]> = {
  do2: generateDo2(10_000),
  do1: generateDo1(2_000),
}

// ─── Mock данные в PHP-формате (для тестирования DocumentPage.vue) ────────────

import type { FieldDef } from '../types/widget'

export const mockFieldAlias: Record<string, FieldDef> = {
  FIELD_104000: { 0: 'Код',                      1: null, FIELD_TYPE: 'SQL_QUERY',      ID: '104000', CAN_SORTING: true  },
  FIELD_991:    { 0: 'Название',                 1: null, FIELD_TYPE: 'SELECT_COMPLEX', ID: '991',    CAN_SORTING: true  },
  FIELD_9963:   { 0: 'Добавлен по городу',       1: null, FIELD_TYPE: 'PLUGIN',         ID: '9963',   CAN_SORTING: false },
  FIELD_10051:  { 0: 'Контактный e-mail',        1: null, FIELD_TYPE: 'STRING',         ID: '10051',  CAN_SORTING: false },
  FIELD_104001: { 0: 'Наименование организации', 1: null, FIELD_TYPE: 'STRING',         ID: '104001', CAN_SORTING: false },
  FIELD_104002: { 0: 'ИНН',                      1: null, FIELD_TYPE: 'STRING',         ID: '104002', CAN_SORTING: true  },
  FIELD_104003: { 0: 'Телефон',                  1: null, FIELD_TYPE: 'STRING',         ID: '104003', CAN_SORTING: false },
  FIELD_104004: { 0: 'Дата создания',            1: null, FIELD_TYPE: 'STRING',         ID: '104004', CAN_SORTING: true  },
}

const _CITIES    = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Нижний Новгород', 'Самара', 'Омск', 'Челябинск', 'Ростов-на-Дону']
const _COMPANIES = ['ООО Ромашка', 'ООО Лютик', 'ИП Иванов', 'ООО ТехноСервис', 'Альфа Групп', 'Бета Компани', 'Гамма Лтд', 'Дельта Инвест', 'Омега Сервис', 'Сигма Корп']

function _cell(id: string, title: string, type: string, value: string | null) {
  return { value_title: value, value, type, id, title, sys_name: `FIELD_${id}` }
}

function _phoneNum(i: number) {
  return `+7 (${900 + (i % 99)}) ${String(100 + (i % 899)).padStart(3, '0')}-${String(10 + (i % 89)).padStart(2, '0')}-${String(10 + (i % 89)).padStart(2, '0')}`
}

function _date(i: number) {
  const m = String(1 + (i % 12)).padStart(2, '0')
  const d = String(1 + (i % 28)).padStart(2, '0')
  return `2024-${m}-${d}`
}

function generatePhpRows(count: number): Record<string, unknown>[] {
  const result = new Array<Record<string, unknown>>(count)
  for (let i = 0; i < count; i++) {
    const company = _COMPANIES[i % _COMPANIES.length]
    result[i] = {
      '0': _cell('104000', 'Код',                      'SQL_QUERY',      String(96756300 + i)),
      '1': _cell('991',    'Название',                 'SELECT_COMPLEX', company),
      '2': _cell('9963',   'Добавлен по городу',       'PLUGIN',         _CITIES[i % _CITIES.length]),
      '3': _cell('10051',  'Контактный e-mail',        'STRING',         `info${i}@example.ru`),
      '4': _cell('104001', 'Наименование организации', 'STRING',         company),
      '5': _cell('104002', 'ИНН',                      'STRING',         `7701${String(23456 + i).slice(-4)}`),
      '6': _cell('104003', 'Телефон',                  'STRING',         _phoneNum(i)),
      '7': _cell('104004', 'Дата создания',            'STRING',         _date(i)),
    }
  }
  // Первые 3 строки с красивыми данными для наглядности
  result[0]['0'] = _cell('104000', 'Код', 'SQL_QUERY', '96756365')
  result[0]['1'] = _cell('991', 'Название', 'SELECT_COMPLEX', 'ООО Ромашка')
  result[0]['2'] = _cell('9963', 'Добавлен по городу', 'PLUGIN', 'Москва')
  result[0]['3'] = _cell('10051', 'Контактный e-mail', 'STRING', 'info@romashka.ru')
  result[0]['5'] = _cell('104002', 'ИНН', 'STRING', '7701123456')
  result[0]['6'] = _cell('104003', 'Телефон', 'STRING', '+7 (495) 123-45-67')
  result[0]['7'] = _cell('104004', 'Дата создания', 'STRING', '2024-01-15')

  result[1]['0'] = _cell('104000', 'Код', 'SQL_QUERY', '96756366')
  result[1]['1'] = _cell('991', 'Название', 'SELECT_COMPLEX', 'ООО Лютик')
  result[1]['2'] = _cell('9963', 'Добавлен по городу', 'PLUGIN', 'Санкт-Петербург')
  result[1]['3'] = _cell('10051', 'Контактный e-mail', 'STRING', 'info@lutyk.ru')
  result[1]['5'] = _cell('104002', 'ИНН', 'STRING', '7701234568')
  result[1]['6'] = _cell('104003', 'Телефон', 'STRING', '+7 (812) 123-45-67')
  result[1]['7'] = _cell('104004', 'Дата создания', 'STRING', '2024-02-20')

  result[2]['0'] = _cell('104000', 'Код', 'SQL_QUERY', '96756367')
  result[2]['1'] = _cell('991', 'Название', 'SELECT_COMPLEX', 'ИП Иванов')
  result[2]['2'] = _cell('9963', 'Добавлен по городу', 'PLUGIN', 'Казань')
  result[2]['3'] = _cell('10051', 'Контактный e-mail', 'STRING', 'ivanov@mail.ru')
  result[2]['5'] = _cell('104002', 'ИНН', 'STRING', '7701234569')
  result[2]['6'] = _cell('104003', 'Телефон', 'STRING', '+7 (843) 123-45-67')
  result[2]['7'] = _cell('104004', 'Дата создания', 'STRING', '2024-03-10')

  return result
}

export const mockRows = generatePhpRows(50)
export const mockDocIds: string[] = Array.from({ length: 50 }, (_, i) => String(1001 + i))

export const mockPageProps = {
  fieldAlias:  JSON.stringify(mockFieldAlias),
  rowsJson:    JSON.stringify(mockRows),
  docIdsJson:  JSON.stringify(mockDocIds),
  classId:     '1004',
  title:       'Тестовые документы (50 строк)',
}
