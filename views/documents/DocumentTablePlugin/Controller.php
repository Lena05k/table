<?php
/**
 * Плагин-контроллер Vue-таблицы документов.
 * Аналог KanbanPlugin\Controller — рендерит шаблон в строку,
 * которую главный шаблон вставляет как {{ documentTablePlugin|raw }}.
 *
 * Использование в PHP:
 *   $plugin = \documents\Plugins\DocumentTablePlugin\Controller::getInstance(
 *       $dataTable, $fieldAlias, (int)$classId, $documentData ?? null
 *   );
 *   $smarty->assign('documentTablePlugin', $plugin?->getContent());
 *   // или для Twig:
 *   $twig->render('doc_list_table.twig', [
 *       'documentTablePlugin' => $plugin?->getContent(),
 *       ...
 *   ]);
 */

namespace documents\Plugins\DocumentTablePlugin;

class Controller
{
    /** @var string */
    private string $content = '';

    private function __construct() {}

    /**
     * @param array      $dataTable    Строки таблицы ($dataTable из шаблона)
     * @param array      $fieldAlias   Описание колонок ($fieldAlias из шаблона)
     * @param int        $classId      ID класса / проекта
     * @param array|null $documentData Данные родительского документа (для popup-режима)
     * @param string|null $presetUri   Пресет URI-параметров
     */
    public static function getInstance(
        array  $dataTable,
        array  $fieldAlias,
        int    $classId,
        ?array $documentData = null,
        ?string $presetUri = null
    ): ?self {
        if (empty($dataTable)) {
            return null;
        }

        $inst = new self();

        // Собираем массив ID документов в том же порядке что строки
        $ids = [];
        foreach ($dataTable as $row) {
            $ids[] = $row['ID'] ?? '';
        }
        $docIdsJson = '[' . implode(',', $ids) . ']';

        $inst->content = $inst->render([
            'classId'      => $classId,
            'fieldAlias'   => $fieldAlias,
            'dataTable'    => $dataTable,
            'docIdsJson'   => $docIdsJson,
            'documentData' => $documentData,
            'presetUri'    => $presetUri,
        ]);

        return $inst;
    }

    /**
     * Возвращает готовый HTML для вставки в шаблон.
     */
    public function getContent(): string
    {
        return $this->content;
    }

    /**
     * Рендерит шаблон плагина в строку.
     */
    private function render(array $data): string
    {
        $classId      = (int)   $data['classId'];
        $columnsJson  = htmlspecialchars(json_encode($data['fieldAlias'],  JSON_UNESCAPED_UNICODE), ENT_QUOTES);
        $rowsJson     = htmlspecialchars(json_encode($data['dataTable'],   JSON_UNESCAPED_UNICODE), ENT_QUOTES);
        $docIdsJson   = htmlspecialchars($data['docIdsJson'],              ENT_QUOTES);
        $parentAttr   = '';

        if (!empty($data['documentData']['OBJ_ID'])) {
            $parentId  = (int) $data['documentData']['OBJ_ID'];
            $parentAttr = " parent-document-id=\"{$parentId}\"";
        }

        return <<<HTML
<vue-dp-documents-table
    id="vue-dp-documents-table-{$classId}"
    columns-json="{$columnsJson}"
    rows-json="{$rowsJson}"
    doc-ids-json="{$docIdsJson}"
    class-id="{$classId}"{$parentAttr}
></vue-dp-documents-table>
HTML;
    }
}
