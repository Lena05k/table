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
