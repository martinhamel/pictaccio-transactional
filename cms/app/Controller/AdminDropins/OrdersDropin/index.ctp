<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<script type="application/json" id="DATA-delivery-options">
    <?= json_encode($deliveryOptions); ?>
</script>
<script type="application/json" id="DATA-sessions">
    <?= json_encode($sessions); ?>
</script>
<script><?php include 'script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<h2><?= __d('admin-orderdrop', 'ORDERS'); ?></h2>
<section id="admin-orders">
    <section id="filters" class="filters">
        <h3><?= __d('admin-orderdrop', 'FILTERS'); ?></h3>
        <div class="criteria">
            <label>
                <span><?= __d('admin-orderdrop', 'STATUS'); ?></span>
                <select name="status">
                    <option value="complete"><?= __d('admin-orderdrop', 'STATUS_COMPLETE'); ?></option>
                    <option value="incomplete"><?= __d('admin-orderdrop', 'STATUS_INCOMPLETE'); ?></option>
                    <option value="both"><?= __d('admin-orderdrop', 'STATUS_COMPLETE_INCOMPLETE'); ?></option>
                </select>
            </label>
            <input type="checkbox" name="id-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'ID'); ?><sup class="help-balloon">?<div>Ex:<br>10<br>10-20<br>-10<br>10-<br>10,20,30<br>-10,20-<br>10-20,100-200<br>-10,20-30,40-</div></sup></span>
                <input type="text" name="id" autocomplete="off" style="width: 8rem">
            </label>
            <input type="checkbox" name="name-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'NAME'); ?></span>
                <input type="text" name="name" autocomplete="off" style="width: 16rem">
            </label>
            <input type="checkbox" name="subject-name-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'SUBJECT_NAME'); ?></span>
                <input type="text" name="subject-name" autocomplete="off" style="width: 16rem">
            </label>
            <input type="checkbox" name="phone-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'PHONE'); ?></span>
                <input type="text" name="phone" autocomplete="off" style="width: 16rem">
            </label>
            <input type="checkbox" name="date-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'DATE'); ?><sup class="help-balloon">?<div>Ex:<br>dd/mm/yy<br>dd/mm/yy-dd/mm/yy</div></sup></span>
                <input type="text" name="date" autocomplete="off" style="width: 16rem">
            </label>
            <input type="checkbox" name="delivery-option-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'DELIVERY_OPTION'); ?></span>
                <div data-heo2-ui="tags" data-heo2-name="delivery-options" data-heo2-options="dropdown:true;valId:true" style="width:20rem;"></div>
            </label>
            <input type="checkbox" name="session-exclude">
            <label>
                <span><?= __d('admin-orderdrop', 'SESSION'); ?></span>
                <div data-heo2-ui="tags" data-heo2-name="sessions" data-heo2-options="dropdown:true;valId:true" style="width: 20rem"></div>
            </label>
            <input type="hidden" name="sort-column" id="sort-column" value="order-id">
            <input type="hidden" name="sort-direction" id="sort-direction" value="asc">
        </div>
        <button id="apply-filter" class="btn" data-heo2-attach="@click:_applyFilter_click"><?= __d('admin-orderdrop', 'APPLY'); ?></button>
        <button id="print-selection" class="btn" data-heo2-attach="@click:_printSelection_click"><?= __d('admin-orderdrop', 'PRINT_SELECTION'); ?></button>
        <button id="print-labels" class="btn" data-heo2-attach="@click:_printLabels_click"><?= __d('admin-orderdrop', 'PRINT_LABELS'); ?></button>
        <button id="export-contacts" class="btn" data-heo2-attach="@click:_exportContacts_click"><?= __d('admin-orderdrop', 'EXPORT_CONTACTS'); ?></button>
        <span data-heo2-name="result-count" data-heo2-ui="label">0</span> <span><?= __d('admin-orderdrop', 'RESULT_COUNT'); ?></span>
        <form action="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'print_selection'); ?>" method="post" id="print-selection-form">
            <input type="hidden" name="selection">
        </form>
        <form action="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'print_labels'); ?>" method="post" id="print-labels-form">
            <input type="hidden" name="selection">
        </form>
        <form action="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'export_contacts'); ?>" method="post" id="export-contacts-form">
            <input type="hidden" name="selection">
        </form>
    </section>
    <section class="orders-table-section">
        <div id="loading-spinner" class="admin-spinner"></div>
        <table id="orders-table" class="orders-table">
            <thead>
            <tr>
                <th id="order-check" class="order-check"><input type="checkbox" id="check-all" data-heo2-attach="@click:_checkAll_change"></th>
                <th id="order-id" class="order-id"><?= __d('admin-orderdrop', 'ID'); ?><i class="fa fa-chevron-up"></i></th>
                <th id="order-name" class="order-name"><?= __d('admin-orderdrop', 'NAME'); ?><i class="fa fa-chevron-up"></th>
                <th id="order-total" class="order-total"><?= __d('admin-orderdrop', 'TOTAL'); ?><i class="fa fa-chevron-up"></th>
                <th id="order-date" class="order-date"><?= __d('admin-orderdrop', 'DATE'); ?><i class="fa fa-chevron-up"></th>
                <th id="order-session" class="order-session"><?= __d('admin-orderdrop', 'SESSION'); ?><i class="fa fa-chevron-up"></th>
                <th id="order-delivery-option" class="order-delivery-option"><?= __d('admin-orderdrop', 'DELIVERY_OPTION'); ?><i class="fa fa-chevron-up"></th>
                <th id="order-transaction-code" class="order-transaction-code"><?= __d('admin-orderdrop', 'TRANSACTION_CODE'); ?><i class="fa fa-chevron-up"></th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </section>
</section>
