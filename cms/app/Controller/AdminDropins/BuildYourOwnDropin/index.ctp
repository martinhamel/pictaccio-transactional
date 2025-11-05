<?php
/*
* HeO2 - Proprietary RAD Web Framework
* Copyright © 2015-2019, Heliox - All Right Reserved
*/
?>

<?php $this->append('script_load', "require('grid forms', admin_loaded);"); ?>

<script><?php include 'script.inc.js'; ?></script>
<script>var assetUploadUrl = '<?= $this->Admin->dropinUrl('7e77a972-a968-4ccb-8bb2-f416cc9623a8', 'upload'); ?>';</script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<section id="admin-build-your-own">
    <h2><?= __d('admin-buildyourowndrop', 'TITLE'); ?></h2>

    <div class="build-your-own-table" data-heo2-ui="db-table" data-heo2-name="build-your-own-table"
         data-heo2-options="url:+=buildYourOwn_dbTable;edit:true;hide:options_json"
         data-heo2-attach="@add-row:_buildYourOwn_addRow;@edit-row:_buildYourOwn_editRow">
        <script type="application/json"><?= $buildYourOwnTable; ?></script>
    </div>

    <div id="build-your-own-overlay" class="build-your-own-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="build-your-own-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-buildyourowndrop', 'ADD_BYOP'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-buildyourowndrop', 'EDIT_BYOP'); ?></h3>

        <label>
            <?= __('GENERIC_INTERNAL_NAME_LABEL'); ?>
            <input type="text" id="internal-name">
        </label>

        <label>
            <?= __d('admin-buildyourowndrop', 'CHOICES'); ?><br>
            <span><?= __d('admin-buildyourowndrop', 'CHOICES_EXPLAIN'); ?></span>
            <textarea name="choices"></textarea>
        </label>

        <label>
            <?= __d('admin-buildyourowndrop', 'CHOICES_COUNT'); ?>
            <input type="number" id="choices-count">
        </label>

        <div class="buttons">
            <button id="add-background-button" class="ui-button group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-background-button" class="ui-button group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>
</section>

