<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>


<script id="DATA-sessionsTable" type="application/json"><?= $sessions; ?></script>

<?= $this->Html->script('heo2_legacy'); ?>
<script>
    <?php include 'script.inc.js'; ?>
    HeO2.ready(() => {admin_loaded();});
</script>
<?= $this->Html->css('admin_legacy.css'); ?>

<script><?php include 'script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<h2><?= __d('admin-sessionsdrop', 'TITLE'); ?></h2>

<section id="action-bar" class="action-bar right">
    <button id="open-add-session-overlay-button"
            class="ui-button"><?= __d('admin-sessionsdrop', 'ADD_SESSION'); ?></button>
</section>

<section id="session-grid" class="db-table"></section>

<div id="session-overlay" class="admin-form" style="display: none">
    <h3 class="group-add"><?= __d('admin-sessionsdrop', 'ADD_SESSION'); ?></h3>
    <h3 class="group-edit"><?= __d('admin-sessionsdrop', 'EDIT_SESSION'); ?></h3>
    <div>
        <label><?= __('GENERIC_NAME_LABEL'); ?></label>
        <div class="float-50">
            <label for="name-fra"><?= __('LANG_FRENCH'); ?></label>
            <input type="text" id="name-fra"/>
        </div>
        <div class="float-50">
            <label for="name-eng"><?= __('LANG_ENGLISH'); ?></label>
            <input type="text" id="name-eng"/>
        </div>
    </div>
    <div>
        <label><?= __('GENERIC_DATE'); ?></label>
        <input type="date" id="date" class="date-no-spinner"/>
        <label><?= __('GENERIC_EXPIRATION_DATE'); ?></label>
        <input type="date" id="expiration-date" class="date-no-spinner"/>
    </div>
    <div>
        <label><?= __d('admin-sessionsdrop', 'CATEGORIES'); ?></label>
        <select id="categories">
            <?php foreach ($categoriesArray as $category): ?>
                <option value="<?= $category['Category']['id']; ?>"
                        data-values='<?= str_replace("'", "\\'", json_encode($category['Category']['apply_json'])); ?>'><?= $category['Category']['name_locale']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <label><?= __d('admin-sessionsdrop', 'CROSS_SELL'); ?></label>
        <select id="cross-sell">
            <option value="null"></option>
            <?php foreach ($productCrossSellArray as $crossSell): ?>
                <option value="<?= $crossSell['ProductCrossSell']['id']; ?>"><?= $crossSell['ProductCrossSell']['internal_name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <label><?= __d('admin-sessionsdrop', 'PRODUCT_GROUPS'); ?></label>
        <select id="product-groups" multiple="multiple" data-valformat="object">
            <?php foreach ($productGroupsArray as $productGroup): ?>
                <option value="<?= $productGroup['ProductGroup']['id'] ?>"><?= $productGroup['ProductGroup']['name_locale']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <label><?= __d('admin-sessionsdrop', 'DELIVERY_OPTION_GROUPS'); ?></label>
        <select id="delivery-option-groups" multiple="multiple" data-valformat="object">
            <?php foreach ($deliveryOptionGroupsArray as $deliveryOptionGroup): ?>
                <option value="<?= $deliveryOptionGroup['DeliveryOptionGroup']['id'] ?>"><?= $deliveryOptionGroup['DeliveryOptionGroup']['name_locale']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <label>
            <input type="checkbox" id="allow-digital-group-picture">
            <?= __d('admin-sessionsdrop', 'GROUP_PICTURES_OPTION'); ?>
        </label>
    </div>
    <div style="position: relative;">
        <label><?= __d('admin-sessiondrop', 'SESSION_COLOR'); ?></label>
        <span id="session-color" class="session-color"></span><input id="color" type="text" class="session-color-text" maxlength="7">
    </div>
    <button id="add-session-button" class="ui-button float-right group-add"><?= __('GENERIC_ADD'); ?></button>
    <button id="edit-session-button" class="ui-button float-right group-edit"><?= __('GENERIC_CHANGE'); ?></button>
</div>


