<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<script id="DATA-categoriesTable" type="application/json"><?= $categories; ?></script>
<script><?php include 'script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<?= $this->Html->script('heo2_legacy'); ?>
<script>
    <?php include 'script.inc.js'; ?>
    HeO2.ready(() => {admin_loaded();});
</script>
<?= $this->Html->css(['admin_legacy.css']); ?>

<h2><?= __d('admin-catdrop', 'TITLE'); ?></h2>

<section id="action-bar" class="action-bar right">
    <button id="open-add-category-overlay-button"
            class="ui-button"><?= __d('admin-catdrop', 'ADD_CATEGORY'); ?></button>
</section>

<section id="categories-grid" class="db-table"></section>

<div id="category-overlay" class="admin-form" style="display: none">
    <h3 class="group-add"><?= __d('admin-catdrop', 'ADD_CATEGORY'); ?></h3>
    <h3 class="group-edit"><?= __d('admin-catdrop', 'EDIT_CATEGORY'); ?></h3>
    <div>
        <label><?= __('GENERIC_NAME_LABEL'); ?></label>
        <div class="float-50">
            <label for="name-fra"><?= __('LANG_FRENCH'); ?></label>
            <input type="text" id="fra"/>
        </div>
        <div class="float-50">
            <label for="name-eng"><?= __('LANG_ENGLISH'); ?></label>
            <input type="text" id="eng"/>
        </div>
    </div>
    <div>
        <label><?= __d('admin-catdrop', 'PRODUCT_GROUPS'); ?></label>
        <select id="product-groups" multiple="multiple" data-valformat="object">
            <?php foreach ($productGroupsArray as $productGroup): ?>
                <option value="<?= $productGroup['ProductGroup']['id'] ?>"><?= $productGroup['ProductGroup']['name_locale']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <label><?= __d('admin-catdrop', 'DELIVERY_OPTION_GROUPS'); ?></label>
        <select id="delivery-option-groups" multiple="multiple" data-valformat="object">
            <?php foreach ($deliveryOptionGroupsArray as $deliveryOptionGroup): ?>
                <option value="<?= $deliveryOptionGroup['DeliveryOptionGroup']['id'] ?>"><?= $deliveryOptionGroup['DeliveryOptionGroup']['name_locale']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <button id="add-category-button" class="ui-button float-right group-add"><?= __('GENERIC_ADD'); ?></button>
    <button id="edit-category-button" class="ui-button float-right group-edit"><?= __('GENERIC_CHANGE'); ?></button>
</div>


