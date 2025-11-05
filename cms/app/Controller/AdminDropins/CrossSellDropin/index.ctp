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

<section id="admin-cross-sell">
    <h2><?= __d('admin-crossselldrop', 'TITLE'); ?></h2>

    <div class="cross-sell-table" data-heo2-ui="db-table" data-heo2-name="cross-sell-table"
         data-heo2-options="url:+=productCrossSell_dbTable;hide:themes_json,themes_map_json,options_json;edit:true"
         data-heo2-attach="@add-row:_crossSell_addRow;@edit-row:_crossSell_editRow">
        <script type="application/json"><?= $productCrossSellTable; ?></script>
    </div>


    <div id="cross-sell-overlay" class="cross-sell-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="cross-sell-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-crossselldrop', 'ADD_CROSS_SELL'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-crossselldrop', 'EDIT_CROSS_SELL'); ?></h3>

        <label class="input-group">
            <?= __('GENERIC_INTERNAL_NAME_LABEL'); ?>
            <input type="text" name="internal-name" autofocus>
        </label>

        <label class="products input-group">
            <?= __d('admin-crossselldrop', 'PRODUCT_PRODUCTS'); ?>
            <span><?= __d('admin-crossselldrop', 'PRODUCT_EXPLAIN'); ?></span>
            <div class="columns-2">
                <div>
                    <label><?= __d('admin-crossselldrop', 'PRODUCT_SELECTED'); ?></label>
                    <div class="drag-hint-wrapper">
                        <div id="drag-hint" class="drag-hint"></div>
                    </div>
                    <select id="products-selected" name="products-selected" data-heo2-attach="@dblclick:_productSelected_dblclick" multiple>

                    </select>
                </div>
                <div>
                    <label><?= __d('admin-crossselldrop', 'PRODUCT_AVAILABLE'); ?></label>
                    <select id="products-available" name="products-available" data-heo2-attach="@dblclick:_productAvailable_dblclick" multiple>

                    </select>
                </div>
            </div>
        </label>

        <div class="buttons">
            <input type="hidden" name="themes-map">
            <button id="add-product-group-button" class="ui-button float-right group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-product-group-button" class="ui-button float-right group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>
</section>

