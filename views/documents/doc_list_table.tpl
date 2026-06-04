<!-- Таблица со списком документов -->
{if is_array($dataTable) and count($dataTable)>0}

    {* Собираем массив ID документов в том же порядке что строки *}
    {capture assign="docIdsArr"}[{foreach from=$dataTable item=tableRow name=docIdLoop}{$tableRow.ID}{if !$smarty.foreach.docIdLoop.last},{/if}{/foreach}]{/capture}

    {* Параметры попап-окна для classId=15 *}
    {if $classId == 15}
        {assign var='windowHeight' value=335}
        {assign var='windowWidth' value=850}
    {else}
        {assign var='windowHeight' value=710}
        {assign var='windowWidth' value=1100}
    {/if}

    <!-- Враппер блока навигации по таблице -->
    <div id="tablewrapper" class="doc-list-table">
        {if $kanbanPlugin}
            <button id="showTableBtn" type="button" disabled>Таблица</button>
            <button id="showKanbanBtn" type="button">Канбан</button>
        {/if}

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

{* ── ВРЕМЕННАЯ ДИАГНОСТИКА — удалить после проверки ─────────────────────── *}
<pre style="background:#f5f5f5;padding:10px;font-size:11px;overflow:auto;max-height:200px">
classId:    {if $classId}{$classId}{else}НЕ ПЕРЕДАН{/if}
dataTable:  {if $dataTable}{$dataTable|@count} строк{else}НЕ ПЕРЕДАН{/if}
fieldAlias: {if $fieldAlias}{$fieldAlias|@count} колонок{else}НЕ ПЕРЕДАН{/if}
docIdsArr:  {$docIdsArr}
</pre>
{* ── конец диагностики ── *}

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
