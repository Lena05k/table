{*
  Пример замены старой таблицы на Vue-виджет vue-dp-documents-table.

  Шаги:
  1. Подключите собранный JS в layout или в этом шаблоне:
       <script src="/assets/vue-dp-documents-table.js"></script>
  2. Зарегистрируйте компонент один раз при инициализации Vue-системы:
       registerCustomComponent('vue-dp-documents-table', window.VueDpDocumentsTable)
  3. Замените старый блок таблицы на тег ниже.

  Пропы:
    columns-json      — $fieldAlias в виде JSON
    rows-json         — $dataTable в виде JSON
    doc-ids-json      — массив ID документов (из $tableRow.ID), тот же порядок что rows
    class-id          — $classId (progectId)
    parent-document-id — $documentData.OBJ_ID если таблица внутри документа
    window-height     — высота всплывающего окна (если parent-document-id задан)
    window-width      — ширина всплывающего окна
    table-height      — высота таблицы в px, или 'auto'
*}

{* ── Собираем массив ID документов в нужном порядке ──────────────────────── *}
{capture assign='docIdsArr'}[{foreach from=$dataTable item=tableRow name=loop}{$tableRow.ID}{if !$smarty.foreach.loop.last},{/if}{/foreach}]{/capture}

{if is_array($dataTable) and count($dataTable) > 0}

    {* ── Основной вариант: таблица НЕ внутри документа ────────────────────── *}
    {if !$documentData}
    <vue-dp-documents-table
        id="vue-dp-documents-table-{$classId}"
        columns-json="{$fieldAlias|json_encode|escape:'html'}"
        rows-json="{$dataTable|json_encode|escape:'html'}"
        doc-ids-json="{$docIdsArr|escape:'html'}"
        class-id="{$classId}"
        table-height="auto"
    ></vue-dp-documents-table>
    {/if}

    {* ── Вариант: таблица внутри документа (ссылки открывают popup) ─────── *}
    {if $documentData}
        {if $classId == 15}
            {assign var='wH' value=335}
            {assign var='wW' value=850}
        {else}
            {assign var='wH' value=710}
            {assign var='wW' value=1100}
        {/if}

    <vue-dp-documents-table
        id="vue-dp-documents-table-{$classId}-{$documentData.OBJ_ID}"
        columns-json="{$fieldAlias|json_encode|escape:'html'}"
        rows-json="{$dataTable|json_encode|escape:'html'}"
        doc-ids-json="{$docIdsArr|escape:'html'}"
        class-id="{$classId}"
        parent-document-id="{$documentData.OBJ_ID}"
        window-height="{$wH}"
        window-width="{$wW}"
        table-height="auto"
    ></vue-dp-documents-table>
    {/if}

{else}
    <div class="empty_do_list">
        <p>Поиск не дал результатов</p>
    </div>
{/if}


{*
  ── Если $dataTable НЕ содержит .ID на уровне строки ──────────────────────────

  В некоторых конфигурациях $tableRow.ID недоступен в foreach.
  В таком случае можно опустить doc-ids-json — виджет автоматически
  использует значение первой колонки (обычно это «Код» документа).

  <vue-dp-documents-table
      columns-json="{$fieldAlias|json_encode|escape:'html'}"
      rows-json="{$dataTable|json_encode|escape:'html'}"
      class-id="{$classId}"
      table-height="auto"
  ></vue-dp-documents-table>

  ── Структура данных, которую ожидает компонент ────────────────────────────────

  columns-json пример:
  {
    "FIELD_104000": {"0": "Код",   "ID": "104000", "CAN_SORTING": false, "FIELD_TYPE": "SQL_QUERY"},
    "FIELD_10403":  {"0": "ФИО",   "ID": "10403",  "CAN_SORTING": true,  "FIELD_TYPE": "SQL_QUERY"},
    "FIELD_104059": {"0": "Дата",  "ID": "104059", "CAN_SORTING": true,  "FIELD_TYPE": "DATE2"}
  }

  rows-json пример (dataTable|json_encode):
  [
    [
      {"id":"104000","sys_name":"FIELD_104000","title":"Код","type":"SQL_QUERY","value":"96544959","value_title":"96544959"},
      {"id":"10403", "sys_name":"FIELD_10403", "title":"ФИО","type":"SQL_QUERY","value":"Иванов И.И.","value_title":"Иванов И.И."},
      ...
    ],
    ...
  ]

  doc-ids-json пример:
  [12345, 12346, 12347, ...]    ← это $tableRow.ID каждой строки
*}
