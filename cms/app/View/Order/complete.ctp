<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

$this->set('title_for_layout', __('PAGE_CHECKOUT'));
?>

<?php $this->Html->script("orderComplete.js?{$buildString}", ['inline' => false, 'fullBase' => true]); ?>
<script id="DATA-orderSubtotal" type="application/json">
    <?= $cashRegister->orderSubtotal ?>
</script>
<script id="DATA-cashregister" type="application/json">
    <?= $cashRegister->serialize(); ?>
</script>
<script id="DATA-taxes" type="application/json">
    <?= json_encode($taxes); ?>
</script>
<script id="DATA-freeShipping" type="application/json">
    <?= json_encode($shippingConfig); ?>
</script>
<script>
    const virtualOnly = <?= $virtualOnly ? 'true' : 'false'; ?>;
    const activeCcProcessor = '<?= "{$activeCcProcessor}"; ?>';
</script>

<section id="complete" class="complete">
    <div id="order-complete-warning" class="order-complete-warning">
    <?= __("ORDER_COMPLETE_REVIEW_INFO"); ?>
    </div>
    <?php if ($shippingConfig['enabled']): ?>
        <?php
            $promoDisplay = $shippingConfig['threshold'];
            if(fmod($promoDisplay, 1) !== 0.00) {
                $promoDisplay = number_format($shippingConfig['threshold'], 2);
            };
        ?>
        <label id="announcement-banner" class="banner section-message visible"><?= __('ORDERAPP_CART_ANNOUNCEMENT', $promoDisplay); ?></label>
    <?php endif; ?>
    <div class="complete-header">
        <div class="complete-header-logo">
            <a href="<?= $this->Html->url(array('controller' => 'order', 'action' => 'index', 'private' => false)); ?>">
                <?php $pub = Configure::read('Directories.transacExtraPub'); ?>
                <?= $this->Html->image("/{$pub}/logo.png", ['class' => 'header-logo']); ?>
            </a>
        </div>
        <div class="complete-header-title">
            <h1 class="order-complete-title accent"><?= __("ORDER_COMPLETE_TITLE"); ?></h1>
        </div>
    </div>
    <div class="complete-container">
        <div class="right-column">
            <div id="cart-review-container" class="cart-review-container">
                <input id="cart-review-title-check" type="checkbox" class="titles-checks" role="button" checked>
                <label id="cart-review-title" for="cart-review-title-check" class="titles">
                    <h2><?= __("ORDER_COMPLETE_CART_TITLE"); ?><i class="fas fa-caret-up"></i></h2>
                </label>
                <div id="cart-review" class="cart-review">
                    <a class="underlined" id="return-to-order" href="<?= $this->Html->url(array('controller' => 'order', 'action' => 'index', 'private' => false), true); ?>">
                        <p><?= __("ORDER_COMPLETE_RETURN_TO_ORDER"); ?> <i class="fas fa-edit"></i></p>
                    </a>
                    <ul class="cart-content-review">
                        <?php
                            $serverUrl = $this->Html->url('/', true);
                            if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' && substr($serverUrl, 0, 5) === 'http:') {
                                $serverUrl = str_replace('http', 'https', $serverUrl);
                            }
                        ?>
                        <?php foreach($cart as $item): ?>
                            <li class="cart-item">
                                <h3>
                                    <span class="product-name">
                                        <?= $item['productName']; ?>
                                    </span>
                                    <span class="product-theme">
                                        <?= !empty($item['theme']) ? ' - ' . $item['themeSet'][CakeSession::read('Config.language')] : ''; ?>
                                    </span>
                                    <span class="qty">
                                        <?= $item['quantity'] > 1 ? 'x ' . $item['quantity'] : ''; ?>
                                    </span>
                                    <span class="extra">
                                        <?php if (isset($item['comment']) && $item['comment'] !== ''): ?>
                                            <div class="product-comment" data-product-comment="<?= $item['comment']; ?>"><i class="fas fa-comment-dots"></i></div>
                                        <?php endif; ?>
                                        <?php
                                            if (isset($item['byopSelection'])) {

                                                if ($extraOptions === '') {
                                                    $extraOptions = 'Options: ' . implode(',  ', $item['byopSelection']);
                                                }
                                                else {
                                                    $extraOptions = $extraOptions . "\n" . 'Options: ' . implode(',  ', $item['byopSelection']);
                                                }
                                            };
                                        ?>
                                    </span>
                                    <span class="item-price"><?= $this->Number->currency($item['itemSubtotal']); ?></span>
                                </h3>
                                <ul class="images-container">
                                    <?php

                                        $themeImageId = '';
                                        if (is_numeric($item['productId']) && $products[$item['productId']]['type'] === 'themed') {
                                            $themeImageId = '';
                                            foreach ($products[$item['productId']]['ProductTypeTheme']['themes_map'] as $key => $value) {
                                                if ($value === $item['theme']) {
                                                    $themeImageId = $key;
                                                    break;
                                                }
                                            }
                                        }

                                        switch ($item['productId']) {
                                        case 'digital':
                                            $imageUrl = 'img/digitals.webp';
                                            break;

                                        case 'touchup':
                                            $imageUrl = 'img/touchups.webp';
                                            break;

                                        default:
                                            $imageUrl = Configure::read('Directories.transacExtraPub') . '/' . $item['productImage'];
                                        }

                                    ?>
                                    <li class="product-image"><img src="<?= $serverUrl . $imageUrl; ?>"></li>

                                    <?php foreach($item['selection'] as $photoId): ?>
                                        <li>
                                            <img src="<?= $serverUrl . Configure::read('Directories.transacExtraPub') . '/' . $photoSelection[$photoId]['image']['url']; ?>" data-background-url="<?= isset($photoSelection[$photoId]['background']) ? $serverUrl . Configure::read('Directories.transacExtraPub') . '/' . $photoSelection[$photoId]['background']['url'] : ''; ?>">
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </li>
                        <?php endforeach; ?>
                    </ul>

                    <ul class="cart-price-review">
                        <li class="order-subtotal">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_ORDER_SUBTOTAL'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="order-subtotal"><?= $this->Number->currency($cashRegister->orderSubtotal); ?></li>
                            </ul>
                        </li>
                        <li class="shipping">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_SHIPPING'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="shipping"><?= $this->Number->currency($cashRegister->shipping); ?></li>
                            </ul>
                        </li>
                        <li id="breakdown-late" class="late">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_LATE'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="late">$0.00</li>
                            </ul>
                        </li>
                        <li id="breakdown-promo" class="promo">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_PROMO'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="promo"><?= $this->Number->currency($cashRegister->promo); ?></li>
                            </ul>
                        </li>
                        <li class="subtotal">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_SUBTOTAL'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="subtotal"><?= $this->Number->currency($cashRegister->subtotal); ?></li>
                            </ul>
                        </li>
                        <?php if (in_array('gst', $taxes)): ?>
                        <li class="gst">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_GST'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="gst"><?= $this->Number->currency($cashRegister->gst); ?></li>
                            </ul>
                        </li>
                        <?php endif; ?>
                        <?php if (in_array('qst', $taxes)): ?>
                        <li class="qst">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_QST'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="qst"><?= $this->Number->currency($cashRegister->qst); ?></li>
                            </ul>
                        </li>
                        <?php endif; ?>
                        <?php if (in_array('pst', $taxes)): ?>
                        <li class="pst">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_PST'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="pst"><?= $this->Number->currency($cashRegister->pst); ?></li>
                            </ul>
                        </li>
                        <?php endif; ?>
                        <?php if (in_array('hst', $taxes)): ?>
                        <li class="hst">
                            <ul>
                                <li><?= __('ORDER_COMPLETE_HST'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="hst"><?= $this->Number->currency($cashRegister->hst); ?></li>
                            </ul>
                        </li>
                        <?php endif; ?>
                        <li class="total">
                            <ul class="payment-cost-bold">
                                <li><?= __('ORDER_COMPLETE_TOTAL'); ?></li>
                                <li data-heo2-ui="label" data-heo2-name="total"><?= $this->Number->currency($cashRegister->total); ?></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="promo-section">
                <input id="promo-section-title-check" type="checkbox" class="titles-checks" role="button" checked>
                <label id="promo-section-title" for="promo-section-title-check" class="titles">
                    <h2><i class="fas fa-exclamation-triangle"></i> <?= __('ORDER_COMPLETE_PROMO'); ?><i class="fas fa-caret-up"></i></h2>
                </label>
                <div class="promo-section">
                    <input type="text" id="promo-code-input" name="promo" data-heo2-attach="@focus:_clearInput_focus">
                    <button id="apply-promo" class="ui-button" data-heo2-attach="@click:_promoApply_click">
                        <?= __('ORDER_COMPLETE_APPLY_PROMO'); ?>
                        <div id="apply-promo-spinner" class="spinner"></div>
                    </button>
                </div>
            </div>
        </div>
        <div class="completion-steps-container">
            <div id="cart-review-step" class="cart-review-step">
                <p><?= __('ORDER_COMPLETE_CART_REVIEW_EXPLAIN'); ?></p>
                <label for="cart-review-checkbox">
                    <input type="checkbox" id="cart-review-checkbox" data-heo2-attach="@click:_cartReview_click">
                    <?= __('ORDER_COMPLETE_CART_REVIEW_CONSENT'); ?>
                </label>
            </div>

            <div id="shipping-info-step" class="shipping-info-step">
                <input id="shipping-info-step-title-check" type="checkbox" class="titles-checks" role="button" checked>
                <label id="shipping-info-step-title" for="shipping-info-step-title-check" class="titles">
                    <h2><i class="fas fa-exclamation-triangle"></i> <?= __("ORDER_COMPLETE_BILLING_ADDRESS_TITLE"); ?><i class="fas fa-caret-up"></i></h2>
                </label>
                <form id="shipping-info">
                    <div class="input-container first-name">
                        <input type="text" name="first-name" autocomplete="shipping given-name" placeholder="<?= __('ORDER_COMPLETE_PH_FIRSTNAME'); ?>" <?= !empty($contact['name']) ? "value=\"{$contact['first-name']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container last-name">
                        <input type="text" name="last-name" autocomplete="shipping family-name" placeholder="<?= __('ORDER_COMPLETE_PH_LASTNAME'); ?>" <?= !empty($contact['name']) ? "value=\"{$contact['last-name']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container address">
                        <input type="text" name="street-address-1" autocomplete="shipping street-address" placeholder="<?= __('ORDER_COMPLETE_PH_ADDRESS'); ?>" <?= (!empty($contact['street'])) ? "value=\"{$contact['street-address-1']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container apartment">
                        <input type="text" name="street-address-2" placeholder="<?= __('ORDER_COMPLETE_PH_APARTMENT'); ?>" <?= !empty($contact['street-address-2']) ? "value=\"{$contact['street-address-2']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container city">
                        <input type="text" name="city" autocomplete="shipping address-level2" placeholder="<?= __('ORDER_COMPLETE_PH_CITY'); ?>" <?= !empty($contact['city']) ? "value=\"{$contact['city']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container state">
                        <select name="region" autocomplete="shipping address-level1" data-heo2-attach="@focus:_clearInput_focus" required disabled>
                            <option value=""><?= __('ORDER_COMPLETE_PICK_STATE'); ?></option>
                            <option value="qc" <?= (!empty($contact['region']) && $contact['region'] === 'Québec') ? 'selected' : ''; ?>>Québec</option>
                            <option value="on" <?= (!empty($contact['region']) && $contact['region'] === 'Ontario') ? 'selected' : ''; ?>>Ontario</option>
                        </select>
                    </div>
                    <div class="input-container postal-code">
                        <input type="text" name="postal-code" autocomplete="shipping postal-code" placeholder="<?= __("ORDER_COMPLETE_PH_POSTALCODE"); ?>" <?= !empty($contact['postal-code']) ? "value=\"{$contact['postal-code']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container country">
                        <input type="text" name="country" autocomplete="shipping country" placeholder="<?= __("ORDER_COMPLETE_PH_COUNTRY"); ?>" <?= !empty($contact['country']) ? "value=\"{$contact['country']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                </form>
            </div>
            <div id="contact-info-step" class="contact-info-step">
                <input id="contact-info-step-title-check" type="checkbox" class="titles-checks" role="button" checked>
                <label id="contact-info-step-title" for="contact-info-step-title-check" class="titles">
                    <h2><i class="fas fa-exclamation-triangle"></i> <?= __("ORDER_COMPLETE_CONTACT_TITLE"); ?><i class="fas fa-caret-up"></i></h2>
                </label>
                <form id="contact-info">
                    <div class="input-container email">
                        <input type="email" name="email" autocomplete="home email" placeholder="<?= __("ORDER_COMPLETE_PH_EMAIL"); ?>" <?= !empty($contact['email']) ? "value=\"{$contact['email']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container phone">
                        <input type="tel" name="phone" autocomplete="home tel" placeholder="<?= __("ORDER_COMPLETE_PH_PHONE"); ?>" <?= !empty($contact['phone']) ? "value=\"{$contact['phone']}\"" : ''; ?> data-heo2-attach="@focus:_clearInput_focus" required disabled>
                    </div>
                    <div class="input-container">
                        <label>
                            <input type="checkbox" name="newsletter" disabled <?= CakeSession::read('Order.newsletter') ? 'checked' : ''; ?>> <span class="newsletter"><?= __('ORDER_COMPLETE_NEWSLETTER'); ?></span>
                        </label>
                    </div>
                    <textarea id="comment" class="comment input-container" placeholder="<?= __('ORDER_COMPLETE_COMMENT'); ?>" maxlength="3000" data-heo2-attach="@change:_comment_change" disabled><?= $comment; ?></textarea>
                </form>
            </div>

            <?php if (!$virtualOnly): ?>
                <div id="shipping-step" class="shipping-step">
                    <input id="shipping-step-title-check" type="checkbox" class="titles-checks" role="button" checked>
                    <label id="shipping-step-title" for="shipping-step-title-check" class="titles">
                        <h2><i class="fas fa-exclamation-triangle"></i> <?= __("ORDER_COMPLETE_SHIPPING_TITLE"); ?><i class="fas fa-caret-up"></i></h2>
                    </label>
                    <div class="shipping-step-container">
                        <button id="calculate-shipping-button" class="btn btn-accent calculate-shipping-button" data-heo2-attach="@click:_calculateShipping_click">
                            <?= __('ORDER_COMPLETE_CALCULATE_SHIPPING'); ?>
                            <div id="calculate-shipping-spinner" class="spinner"></div>
                        </button>
                        <div id="delivery-option-spinner"></div>
                        <ul id="shipping-methods" class="shipping-methods"></ul>
                    </div>
                </div>
            <?php else: ?>
                <div id="shipping-step" class="shipping-step">
                    <button id="calculate-shipping-button" class="btn btn-accent calculate-shipping-button" data-heo2-attach="@click:_calculateShipping_click">
                        <?= __('ORDER_COMPLETE_UPDATE_CONTACT_INFO'); ?>
                        <div id="calculate-shipping-spinner" class="spinner"></div>
                    </button>
                </div>
            <?php endif; ?>

            <div id="proceed-special">
                <button type="button" id="place-order-special" class="btn btn-accent place-order-button" data-heo2-attach="@click:_placeOrderSpecial_click">
                    <?= __('ORDER_COMPLETE_PLACE_ORDER'); ?>
                    <div id="place-order-special-spinner" class="spinner"></div>
                </button>
            </div>

            <div id="payment-step" class="payment-step">
                <input id="payment-step-title-check" type="checkbox" class="titles-checks" role="button" checked>
                <label id="payment-step-title" for="payment-step-title-check" class="titles">
                    <h2><i class="fas fa-exclamation-triangle"></i> <?= __("ORDER_COMPLETE_PAYMENT_TITLE"); ?><i class="fas fa-caret-up"></i></h2>
                </label>
                <div id="payment-methods-container" class="payment-methods-container">
                    <?php if ($activeCcProcessor !== null): ?>
                        <div id="pay-with-cc-section" class="payment-option-section payment-option-section-cc">
                            <input type="radio" id="pay-with-cc-radio" name="payment-method" class="payment-method-radio" value="cc" data-heo2-attach="@click:_paymentMethod_click" disabled>
                            <label for="pay-with-cc-radio" class="payment-method-label">
                                <i class="cc-icon default"></i>
                                <span><?= __('ORDER_COMPLETE_PAY_WITH_CC'); ?></span>
                            </label>
                            <?php if ($activeCcProcessor === 'Stripe'): ?>
                                <div id="pay-with-stripe" class="payment-method-inner credit-cards stripe-credit-cards">
                                    <div class="spinner" id="stripe-spinner"></div>
                                    <form id="stripe-payment-form" data-heo2-attach="@submit:_stripePaymentForm_submit">
                                        <div id="stripe-payment-element"></div>
                                    </form>
                                </div>
                                <script src="https://js.stripe.com/v3/"></script>
                                <script>
                                    const stripePublishableKey = '<?= Configure::read('Stripe.publishableKey'); ?>';
                                </script>
                            <?php endif; ?>
                            <?php if ($activeCcProcessor === 'ConvergeAPI'): ?>
                                <div id="pay-with-cc" class="payment-method-inner credit-cards convergeapi-credit-cards">
                                    <form id="convergeapi-payment-form">
                                        <label>
                                            <input type="text" name="cc-number" autocomplete="cc-number" placeholder="<?= __('ORDER_COMPLETE_PH_CREDITCARD'); ?>" data-heo2-attach="+cc-icon:#cc-icon;@focus:_clearInput_focus" required disabled>
                                            <i id="cc-icon" class="cc-icon default"></i>
                                        </label>
                                        <div class="expiry-and-cvv">
                                            <fieldset>
                                                <div id="expiry-date-container" class="expiry-date-container disabled">
                                                    <input type="text" id="paymentCcMonth" name="expiry-month" maxlength="2" placeholder="<?= __('ORDER_COMPLETE_PH_EXPIRYMONTH'); ?>" data-heo2-attach="@keydown:_paymentExpiryMonth_keydown;@keyup:_paymentExpiryMonth_keyup;@keypress:_paymentOnlyNumbers_keypress;@focus:_clearInput_focus" required disabled>
                                                    <span>/</span>
                                                    <input type="text" id="paymentCcYear" name="expiry-year" maxlength="2" placeholder="<?= __('ORDER_COMPLETE_PH_EXPIRYYEAR'); ?>" data-heo2-attach="@keydown:_paymentExpiryYear_keydown;@keyup:_paymentExpiryYear_keyup;@keypress:_paymentOnlyNumbers_keypress;@focus:_clearInput_focus" required disabled>
                                                </div>
                                            </fieldset>
                                            <input type="text" id="paymentCcCsc" name="csc" autocomplete="cc-csc" placeholder="<?= __('ORDER_COMPLETE_PH_CSC'); ?>" maxlength="4" data-heo2-attach="@keypress:_paymentOnlyNumbers_keypress;@focus:_clearInput_focus" required disabled>
                                        </div>
                                        <label>
                                            <input id="cc-cardholder-name" type="text" name="cardholder-name" autocomplete="name" placeholder="<?= __('ORDER_COMPLETE_PH_NAMEONCARD'); ?>" maxlength="20" <?= !empty($contact['name']) ? "value=\"{$contact['name']}\"" : ''; ?> pattern="(.|\s)*\S(.|\s)*" data-heo2-attach="@keyup:_ccCardHolderName_keyup;@focus:_clearInput_focus" required disabled>
                                        </label>
                                        <div id="bubble-cc-cardholder-name" class="bubble-warning"><?= __('ORDER_COMPLETE_WARNING_NAMEONCARD'); ?></div>
                                    </form>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <?php if (array_search('paypal-ec', Configure::read('Payments.enabled')) !== false) : ?>
                        <div id="pay-with-paypal-section" class="payment-option-section payment-option-section-paypal">
                            <input type="radio" id="pay-with-paypal-radio" name="payment-method" value="paypal" class="payment-method-radio" data-heo2-attach="@click:_paymentMethod_click" disabled>
                            <label for="pay-with-paypal-radio" class="payment-method-label">
                                <span><?= __('ORDER_COMPLETE_PAY_WITH_PAYPAL'); ?></span>
                            </label>
                            <div id="pay-with-paypal" class="payment-method-inner paypal">
                                <div style="display: none">
                                    <?= $paymentLinks['PaypalExpressCheckout']; ?>
                                </div>
                                <?= __('ORDER_COMPLETE_PAY_WITH_PAYPAL_INSTRUCTION'); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
                <button type="button" id="place-order" class="btn btn-accent place-order-button" data-heo2-attach="@click:_placeOrder_click" disabled>
                    <?= __('ORDER_COMPLETE_PLACE_ORDER'); ?>
                    <div id="payment-spinner" class="spinner"></div>
                </button>
            </div>
        </div>
    </div>
</section>
