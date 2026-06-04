<!-- Таблица со списком документов -->
{if is_array($dataTable) and count($dataTable)>0}
    {* Собираем параметры, разные, - для разных проектов *}
    {if $classId == 15}  <!-- Услуги по каско в маленьком окошке чтобы всплывали -->
        {assign var='windowHeight' value=335}
        {assign var='windowWidth' value=850}
    {else}
        {assign var='windowHeight' value=710}
        {assign var='windowWidth' value=1100}
    {/if}
    <script type="text/javascript">
        function setSorting(field, type) {
            let url = new URL(location.href);
            url.searchParams.set('sort_field', field);
            url.searchParams.set('sort_type', type);
            location.href = url.href;
        }
    </script>
    <!-- Враппер блока навигации по таблице -->
    <div id="tablewrapper" class="doc-list-table">
        {if $kanbanPlugin}
            <button id="showTableBtn" type="button" disabled>Таблица</button>
            <button id="showKanbanBtn" type="button">Канбан</button>
        {/if}

        <a id="resetColumnsLink" onClick="$('#tinysorter_0table').trigger('clearColsPosition');">Сбросить положение столбцов</a>
        <a id="tableNavigatorLink" onClick="$('#tinysorter_0_filter').toggle();">Навигатор по таблице</a>

        <div class="ui-widget-content tinytable_filter" id='tinysorter_0_filter'>
            <div class="ui-widget-header" style="margin:5px">Поиск в таблице</div>
            <select id="columns" onchange="tinysorter_0sorter.search('query')"></select>
            <input type="text" id="query" onkeyup="tinysorter_0sorter.search('query')"/>
            Страница:<select id="tinysorter_0pagedropdown"></select>
            Строк:<select onchange="tinysorter_0sorter.size(this.value)">
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
            </select>
            <a href="javascript:tinysorter_0sorter.showall()">Показать&nbsp;все</a><br/>

            <div class="container__displayed-fields-list">
                <!-- Скрыть или показать колонки -->
                Отображение таблицы документов:
                [<a class="container__tooltip container__tooltip-delete">
                    <span onclick="documentTableVisibility('delete')">удалить</span>
                    <span class="right container__displayed-wrapper container__displayed-wrapper-delete"
                          id="displayed-fields-list">
                	    {foreach from=$fieldAlias item=field key=sysName}
                            <p class="tooltip-link" name="{$sysName}"
                               onclick="hideTableColumn('{$sysName}');">{$field[0]}</p>
                        {/foreach}
                	</span>
                </a> /
                <a class="container__tooltip container__tooltip-add">
                    <span onclick="documentTableVisibility('add')">добавить</span>
                    <span class="right container__displayed-wrapper container__displayed-wrapper-add"
                          id="hidden-fields-list">
                	    {foreach from=$hiddenFields item=fieldTitle key=fieldId}
                            <p class="tooltip-link" name="FIELD_{$fieldId}"
                               onclick="showTableColumn('FIELD_{$fieldId}');">{$fieldTitle}</p>
                        {/foreach}
                	</span>
                </a> колонку]
            </div>
        </div>
        {if $hasPagination}
            <div class="pagination pagination__top">
                {call name=paginate pages=$paginationPages}
            </div>
        {/if}

        {if $kanbanPlugin}
            {assign var='displayTableView' value='none'}
        {else}
            {assign var='displayTableView' value='block'}
        {/if}

        <div id="tableView" style="display:{$displayTableView}">

            {* ── ЭКСПЕРИМЕНТ: Vue-таблица (vue-dp-documents-table) ──────────── *}
            {* Удалить этот блок если не нужен                                   *}
            {capture assign="docIdsArr"}[{foreach from=$dataTable item=tableRow name=docIdLoop}{$tableRow.ID}{if !$smarty.foreach.docIdLoop.last},{/if}{/foreach}]{/capture}
            {if $documentData}
                <vue-dp-documents-table
                    id="vue-dp-documents-table-{$classId}-{$documentData.OBJ_ID}"
                    columns-json="{$fieldAlias|@json_encode|escape:'html'}"
                    rows-json="{$dataTable|@json_encode|escape:'html'}"
                    doc-ids-json="{$docIdsArr}"
                    class-id="{$classId}"
                    parent-document-id="{$documentData.OBJ_ID}"
                ></vue-dp-documents-table>
            {else}
                <vue-dp-documents-table
                    id="vue-dp-documents-table-{$classId}"
                    columns-json="{$fieldAlias|@json_encode|escape:'html'}"
                    rows-json="{$dataTable|@json_encode|escape:'html'}"
                    doc-ids-json="{$docIdsArr}"
                    class-id="{$classId}"
                ></vue-dp-documents-table>
            {/if}
            {* ── конец эксперимента ─────────────────────────────────────────── *}

            <!-- Таблица документов -->
            {assign var="colspan" value={count($fieldAlias)}}
            {if $isShowCheckbox}{assign var="colspan" value={$colspan + 1}}{/if}
            <table id="tinysorter_0table" class="tinytable doctable">
                <thead>
                <tr>
                    {if $isShowCheckbox}
                        <th class="nosort"><h3></h3><input id=SelectAll type=checkbox></th>
                    {/if}
                    {foreach from=$fieldAlias item=field key=sysName}
                        <th class="head draggable {$sysName}" field_name="{$sysName}" field_id="{$field['ID']}"
                            {if isset($field[1])}style='{$field[1]}'{/if}><h3>{$field[0]}</h3>{if $field['CAN_SORTING']}
                            <button title="отсортировать"
                                    onclick="setSorting({$field['ID']}, {if $field['ID'] == $sorting['field'] and $sorting['type']=='ASC'}'DESC'{else}'ASC'{/if})">
                                <i class="fa fa-sort{if $field['ID'] == $sorting['field']}-{strtolower($sorting['type'])}{/if}"
                                   aria-hidden="true"></i></button>{/if}</th>
                    {/foreach}
                </tr>
                </thead>
                <tbody>
                {foreach from=$dataTable item=tableRow}
                    <tr bgcolor="{$tableRow.SYS_COLOR}" data-document-id="{$tableRow.ID}">
                        {if $isShowCheckbox}
                            <td><input class=documentIdSelected name=documentIdSelected[] value="{$tableRow.ID}"
                                       type=checkbox></td>
                        {/if}

                        {* Перебираем столбцы таблицы *}
                        {foreach from=$tableRow item=tableCell name=tableRowCells}
                            {if is_array($tableCell) and count($tableCell)>1}
                                <td field_type="TYPE_{$tableCell.type}"
                                        {if isset($tableCell.showClassData)} data-showclassdata="{$tableCell.showClassData|escape}"{/if}
                                        {if $tableCell.id|default:null !== null} fieldId="{$tableCell.id}"{/if}
                                        {if !$isWrapCellValue}nowrap{/if}
                                        {if strlen($tableCell.value_title) > 50}title='{$tableCell.value_title}'{/if}
                                >
                                    {if $smarty.foreach.tableRowCells.first}
                                        {* Если таблица показыватеся в документе *}
                                        {if $documentData}
                                            <a onclick="openWindow('/documents/?progectId={$classId}&parentDocumentId={$documentData.OBJ_ID}&documentId={$tableRow.ID}', {$windowWidth}, {$windowHeight})">{$tableCell.value}</a>
                                        {else}
                                            <a href="?progectId={$classId}&documentId={$tableRow.ID}{$presetURI}">{$tableCell.value}</a>
                                        {/if}

                                    {else}
                                        {if isset($isTruncateCellValue) and $isTruncateCellValue and mb_strlen(strip_tags($tableCell.value)) > 50}
                                            {mb_substr($tableCell.value, 0, 50)}...
                                        {else}
                                            {$tableCell.value}
                                        {/if}
                                    {/if}
                                </td>
                            {/if}
                        {/foreach}

                    </tr>
                {/foreach}
                </tbody>
                {if $hasPagination}
                    <tfoot>
                    <tr>
                        <td class="pagination" colspan="{$colspan}">
                            {call name=paginate pages=$paginationPages}
                        </td>
                    </tr>
                    </tfoot>
                {/if}
            </table>
        </div>
    </div>

    <div id="kanbanView" style="display: none">
        <div class="kanban-wrapper">
            {$kanbanPlugin}
        </div>
    </div>

{else}
    <div class="empty_do_list">
        <p>Поиск не дал результатов</p>
    </div>
{/if}
{function name=paginate}
    Навигация:
    <ul class="pagination--list">
        {foreach from=$pages item=page}
            {if $page.page}
                <li class="pagination--item pagination--item__link">{if $page.link}<a href="{$page.link}"
                                                                                      title="Перейти на страницу {$page.page}">{$page.page}</a>{else}
                        <span>{$page.page}</span>{/if}</li>
            {else}
                <li class="pagination--item pagination--item__gap">...</li>
            {/if}
        {/foreach}
    </ul>
    (всего
    <strong class="pagination--stat">{$paginationTotal}</strong>
    {$formatter->morph($paginationTotal, 'карточка', 'карточки', 'карточек')})
{/function}
