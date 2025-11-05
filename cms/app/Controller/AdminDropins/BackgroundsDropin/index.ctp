<?php
/*
* HeO2 - Proprietary RAD Web Framework
* Copyright © 2015-2019, Heliox - All Right Reserved
*/
?>

<?php $this->append('script_load', "require('grid forms', admin_loaded);"); ?>
<script id="DATA-backgroundsTable" type="application/json"><?= $backgrounds; ?></script>
<script><?php include 'script.inc.js'; ?></script>
<script>var assetUploadUrl = '<?= $this->Admin->dropinUrl('7e77a972-a968-4ccb-8bb2-f416cc9623a8', 'upload'); ?>';</script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<section id="admin-backgrounds">
    <h2><?= __d('admin-backdrop', 'TITLE'); ?></h2>

    <div id="action-bar" class="action-bar">
        <button class="ui-button" data-heo2-attach="@click:_updateBackgroundStaticButton_click"><?= __d('admin-backdrop', 'UPDATE_BACKGROUND_STATIC'); ?></button>
    </div>

    <div class="tab" data-heo2-ui="tab">
        <div>
            <h3><?= __d('admin-backdrop', 'CATEGORIES'); ?></h3>
            <div class="background-category-table" data-heo2-ui="db-table" data-heo2-name="background-category-table"
                        data-heo2-options="url:+=backgroundCategory_dbTable;edit:true"
                        data-heo2-attach="@add-row:_backgroundCategories_addRow;@edit-row:_backgroundCategories_editRow">
                <script type="application/json"><?= $backgroundCategoriesTable; ?></script>
            </div>
        </div>

        <div>
            <h3><?= __d('admin-backdrop', 'BACKGROUNDS'); ?></h3>
            <div class="background-table" data-heo2-ui="db-table" data-heo2-name="background-table"
                        data-heo2-options="url:+=background_dbTable;edit:true"
                        data-heo2-attach="@add-row:_background_addRow;@edit-row:_background_editRow">
                <script type="application/json"><?= $backgroundTable; ?></script>
            </div>
        </div>
    </div>

    <div id="background-category-overlay" class="background-category-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="background-category-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-backdrop', 'ADD_BACKGROUND_CATEGORY'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-backdrop', 'EDIT_BACKGROUND_CATEGORY'); ?></h3>

        <label><?= __('GENERIC_NAME_LABEL'); ?>
            <div class="columns-2">
                <div>
                    <label for="fra"><?= __('LANG_FRENCH'); ?></label>
                    <input type="text" name="fra" autofocus>
                </div>
                <div>
                    <label for="eng"><?= __('LANG_ENGLISH'); ?></label>
                    <input type="text" name="eng">
                </div>
            </div>
        </label>

        <div class="buttons">
            <button id="add-background-button" class="ui-button group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-background-button" class="ui-button group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>

    <div id="background-overlay" class="background-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="background-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-backdrop', 'ADD_BACKGROUND'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-backdrop', 'EDIT_BACKGROUND'); ?></h3>

        <label>
            <?= __d('admin-backdrop', 'NUMBER'); ?>
            <input type="text" name="number" autofocus>
        </label>

        <label><?= __('GENERIC_NAME_LABEL'); ?>
            <div class="columns-2">
                <div>
                    <label for="name-fra"><?= __('LANG_FRENCH'); ?></label>
                    <input type="text" id="fra"/>
                </div>
                <div>
                    <label for="name-eng"><?= __('LANG_ENGLISH'); ?></label>
                    <input type="text" id="eng"/>
                </div>
            </div>
        </label>

        <label><?= __d('admin-backdrop', 'CATEGORIES'); ?></label>
        <div data-heo2-ui="tags" data-heo2-name="categories"></div>

        <div class="background-images-dropzone">
            <div id="background-img-container"></div>
            <a id="background-browse-trigger" href="javascript:;"><?= __('GENERIC_BROWSE'); ?></a>
        </div>

        <div class="buttons">
            <button id="add-background-button" class="ui-button group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-background-button" class="ui-button group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>
</section>

