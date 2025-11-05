<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<script id="DATA-deliveryOptionsTable" type="application/json"><?= json_encode($deliveryOptionsArray); ?></script>
<script id="DATA-groupTable" type="application/json"><?= $groups ?></script>
<script id="DATA-deliveryOptionProps" type="application/json"><?= $deliveryOptionProps; ?></script>
<?= $this->Html->script('heo2_legacy'); ?>
<script>
    <?php include 'script.inc.js'; ?>
    HeO2.ready(() => {admin_loaded();});
</script>
<?= $this->Html->css('admin_legacy.css'); ?>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<h2><?= __d('admin-deliverydrop', 'TITLE'); ?></h2>

<section id="action-bar" class="action-bar right">
    <button id="open-add-delivery-options-overlay-button"
            class="ui-button"><?= __d('admin-deliverydrop', 'ADD_DELIVERY_OPTIONS'); ?></button>
    <button id="open-add-group-overlay-button"
            class="ui-button"><?= __d('admin-deliverydrop', 'CREATE_GROUP_DELIVERY_OPTIONS'); ?></button>
</section>

<section id="delivery-options-grid" class="db-table"></section>

<hr class="section-separator"/>

<section id="group-grid" class="db-table"></section>

<div id="delivery-options-overlay" class="admin-form" style="display: none">
    <h3 class="group-add"><?= __d('admin-deliverydrop', 'ADD_DELIVERY_OPTIONS'); ?></h3>
    <h3 class="group-edit"><?= __d('admin-deliverydrop', 'EDIT_DELIVERY_OPTIONS'); ?></h3>
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
        <label><?= __d('admin-deliverydrop', 'LEAD_TIME'); ?></label>
        <input type="text" id="lead-time"/>
    </div>
    <div>
        <label><?= __d('admin-deliverydrop', 'BASE_PRICE'); ?></label>
        <input type="text" id="base-price"/>
    </div>
    <div>
        <label><?= __d('admin-deliverydrop', 'METHOD'); ?></label>
        <select type="text" id="method"></select>
    </div>
    <div>
        <label><?= __d('admin-deliverydrop', 'PROPERTIES'); ?></label>
        <div id="delivery-option-properties"></div>
    </div>
    <button id="add-delivery-options-button" class="ui-button float-right group-add"><?= __('GENERIC_ADD'); ?></button>
    <button id="edit-delivery-options-button"
            class="ui-button float-right group-edit"><?= __('GENERIC_CHANGE'); ?></button>
</div>

<div id="group-overlay" class="admin-form" style="display:none">
    <h3 class="group-add"><?= __d('admin-deliverydrop', 'CREATE_GROUP_DELIVERY_OPTIONS'); ?></h3>
    <h3 class="group-edit"><?= __d('admin-deliverydrop', 'EDIT_GROUP_DELIVERY'); ?></h3>

    <div>
        <label><?= __('GENERIC_NAME_LABEL'); ?></label>
        <div class="float-50">
            <label for="name-fra"><?= __('LANG_FRENCH'); ?></label>
            <input type="text" id="group-name-fra"/>
        </div>
        <div class="float-50">
            <label for="name-eng"><?= __('LANG_ENGLISH'); ?></label>
            <input type="text" id="group-name-eng"/>
        </div>
    </div>

    <div>
        <label for="delivery-options"><?= __d('admin-deliverydrop', 'DELIVERY_OPTIONS'); ?></label>
        <select id="delivery-options" multiple="multiple" data-valformat="array">
            <?php foreach ($deliveryOptionsArray as $option): ?>
                <option value="<?= $option['DeliveryOption']['id'] ?>"><?= $option['DeliveryOption']['name_locale']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>

    <button id="add-group-button" class="ui-button float-right group-add"><?= __('GENERIC_ADD'); ?></button>
    <button id="edit-group-button" class="ui-button float-right group-edit"><?= __('GENERIC_CHANGE'); ?></button>
</div>
