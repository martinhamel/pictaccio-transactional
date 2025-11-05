<script>var campaignId = <?= $promoCodeCampaignRow['PromoCodeCampaign']['id']; ?></script>
<script><?php include 'campaign.script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<section id="admin-promo-codes">
    <a href="javascript:history.back()"><i class="fas fa-arrow-left"></i> <?= __d('admin-promodrop', 'BACK'); ?></a>
    <h1><?= __d('admin-promodrop', 'CAMPAIGN'); ?></h1>
    <ul>
        <li><?= __d('admin-promodrop', 'INTERNAL_NAME'); ?>: <?= $promoCodeCampaignRow['PromoCodeCampaign']['internal_name']; ?></li>
        <li><?= __d('admin-promodrop', 'PREFIX'); ?>: <?= $promoCodeCampaignRow['PromoCodeCampaign']['code_prefix']; ?></li>
        <li><?= __d('admin-promodrop', 'CATEGORY'); ?>:
            <select class="categories-select" data-heo2-attach="@change:_categories_change">
                <option value="none"<?= __d('admin-promodrop', 'NONE'); ?>></option>
                <?php foreach($categories as $category): ?>
                    <option value="<?= $category['Category']['id']; ?>"
                        <?= !empty($promoCodeCampaignRow['PromoCodeCampaign']['options_json']['category_id']) && $promoCodeCampaignRow['PromoCodeCampaign']['options_json']['category_id'] ===
                            $category['Category']['id'] ? 'selected' : ''; ?>><?= $category['Category']['name_locale']; ?></option>
                <?php endforeach; ?>
            </select>
        </li>
    </ul>
    <div class="buttons">
        <button class="ui-button" data-heo2-attach="@click:_createSeries_click">
            <?= __d('admin-promodrop', 'CREATE_SERIES'); ?>...
        </button>
        <input type="checkbox" id="hide-used" data-heo2-attach="@change:_hideUsed_change">
        <label for="hide-used"><?= __d('admin-promodrop', 'HIDE_USED'); ?></label>
    </div>

    <div class="promo-campaign-table">
            <div class="promo-campaign-title">
               <p><?= __d('admin-promodrop', 'CODES'); ?></p>
               <p><?= __d('admin-promodrop', 'USED'); ?></p>
               <p><?= __d('admin-promodrop', 'ORDER_ID'); ?></p>
            </div>
            <div class="promo-campaign-rows">
                <?php
                $codesContent = '';
                $usedContent = '';
                $orderIdContent = '';

                foreach ($promoCodeRows as $row) {
                    if (($hide && $row['PromoCode']['used'] == '') || !$hide) {
                        $codesContent .= "<p>{$row['PromoCode']['code']}</p>";
                        $usedContent .= '<p>' . ($row['PromoCode']['used'] == '' ? 'No' : 'Yes') . '</p>';
                        $orderIdContent .= '<p>' . ($row['PromoCode']['order_id'] === '0' ? 'N/A' : $row['PromoCode']['order_id']) . '</p>';
                    }
                } ?>

                <div class="promo-campaign-cols-code">
                    <?= $codesContent; ?>
                </div>
                <div class="promo-campaign-cols-used">
                    <?= $usedContent; ?>
                </div>
                <div class="promo-campaign-cols-id">
                    <?= $orderIdContent; ?>
                </div>
            </div>
    </div>

    <div id="create-series-overlay" class="create-series-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="create-series-overlay" data-heo2-options="close:true">
        <h3><?= __d('admin-promodrop', 'ADD_SERIES'); ?></h3>

        <label>
            <?= __d('admin-promodrop', 'COUNT'); ?>
            <input type="number" name="count">
        </label>

        <div class="buttons">
            <button class="ui-button" data-heo2-attach="@click:_createSeriesOk_click" ok><?= __('GENERIC_OK'); ?></button>
        </div>
    </div>
</section>
