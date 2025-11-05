<script>var  campaignUrl = '<?= $this->Admin->dropinUrl('5f080cda-d297-11eb-b8bc-0242ac130003', 'campaign'); ?>';</script>
<script><?php include 'script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<section id="admin-promo">
    <h2><?= __d('admin-promodrop', 'TITLE'); ?></h2>

    <div id="action-bar" class="action-bar">

    </div>

    <div class="tab" data-heo2-ui="tab">
        <div>
            <h3><?= __d('admin-promodrop', 'CODES'); ?></h3>

            <div class="promo-code-campaign-table" data-heo2-ui="db-table" data-heo2-name="promo-code-campaign-table"
                 data-heo2-options="url:+=productCodeCampaign_dbTable;hide:themes_json,themes_map_json,options_json;edit:true"
                 data-heo2-attach="@add-row:_productCodeCampaign_addRow;@edit-row:_productCodeCampaign_editRow">
                <script type="application/json"><?= $promoCodeCampaignTable; ?></script>
            </div>
        </div>

        <div>
            <h3><?= __d('admin-promodrop', 'SHIPPING'); ?></h3>

            <form id="promo-shipping-form">
                <label>
                    <?= __d('admin-promodrop', 'ENABLED'); ?>
                    <input type="checkbox" name="enabled" <?= $config['enabled'] ? 'checked' : ''; ?>>
                </label>
                <label>
                    <?= __d('admin-promodrop', 'THRESHOLD_AMOUNT'); ?>
                    <input type="text" name="threshold-amount" value="<?= $config['threshold']; ?>">
                </label>
                <button class="btn btn-primary" data-heo2-attach="@click:_shippingSave_click"><?= __('GENERIC_SAVE'); ?></button>
            </form>
        </div>
    </div>

    <div id="promo-code-campaign-overlay" class="promo-code-campaign-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="promo-code-campaign-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-promodrop', 'ADD_CAMPAIGN'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-promodrop', 'EDIT_CAMPAIGN'); ?></h3>

        <label class="input-group">
            <?= __('GENERIC_INTERNAL_NAME_LABEL'); ?>
            <input type="text" name="internal-name" autofocus>
        </label>

        <label class="input-group">
            <?= __d('admin-promodrop', 'PREFIX'); ?>
            <input type="text" name="code-prefix">
        </label>

        <label class="input-group">
            <?= __d('admin-promodrop', 'AMOUNT'); ?>
            <input type="text" name="amount">
        </label>

        <div class="buttons">
            <button id="add-promo-code-campaign-button" class="ui-button float-right group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-promo-code-campaign-button" class="ui-button float-right group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>
    
</section>
