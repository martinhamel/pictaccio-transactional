<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<?php $this->Html->script("orderApp.js?{$buildString}", ['inline' => false, 'fullBase' => true]); ?>

<script>
    var orderCompleteUrl = '<?= $this->Html->url(['controller' => 'order', 'action' => 'complete'], true); ?>';
</script>
<div id="loading-screen">
    <div class="loading-overlay">
        <div class="spinner"></div>
        <span><?= __('GENERIC_LOADING'); ?></span>
    </div>
</div>
<section id="order-app">
    <div class="sticky-header" data-heo2-sticky="viewport-x:0,-">
        <nav class="nav-header">
            <?php $pub = Configure::read('Directories.transacExtraPub'); ?>
            <?= $this->Html->image("/{$pub}/logo.png", ['class' => 'header-logo', 'fullBase' => true]); ?>
        </nav>
        <div class="photo-tray">
            <div class="add-photo-container">
                <button class="add-photos btn-accent" data-heo2-attach="@click:_addPhotoButton_click">
                    <span class="add-photo-icon">
                        <i class="far fa-portrait"></i>
                        <i class="fas fa-plus"></i>
                    </span>
                </button>
            </div>
            <div id="selected-photos" class="selected-photos">

            </div>
        </div>
        <div class="cart-container">
            <button class="clear-btn" data-heo2-attach="@click:_cartButton_click"><span
                    class="cart-container-text"><?= __('ORDERAPP_COMPLETE_ORDER'); ?></span> <i
                    class="fa fa-shopping-cart"></i>
            </button>
            <div id="cart-counter" class="cart-counter"></div>
        </div>
    </div>
    <div class="items-container">
        <div class="item-options">

        </div>
        <div class="items">

        </div>
        <div class="item-footer">

        </div>
    </div>

    <div id="products" class="products">
        <div class="get-started">
            <h1 class="accent"><?= __('ORDERAPP_GET_STARTED'); ?></h1>

            <label class="subject-code-add-box">
                <span><?= __('ORDERAPP_INTERNET_CODE'); ?>:</span>
                <div>
                    <input type="text" id="subject-code-add-input-home" name="subject-code-home"
                        data-heo2-attach="@keyup:_subjectCode_keyup" autofocus autocomplete="off">
                    <span class="feedback" data-heo2-ui="label" data-heo2-name="subject-name-home"></span>
                    <div id="subject-code-add-input-home-spinner" class="spinner"></div>
                </div>
                <button id="subject-code-add-button-home" class="ui-button"
                    data-heo2-attach="@click:_subjectCodeAdd_click" ok disabled>
                    <?= __('GENERIC_ADD'); ?>
                </button>
            </label>

            <div class="order-app-code-request">
                <a class="underlined"
                    href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'code_request'], true); ?>"><?= __('ORDERAPP_CODE_REQUEST'); ?></a>
            </div>
        </div>
    </div>

    <!-- OVERLAYS -->
    <div id="add-photo-overlay" class="add-photo-overlay overlay" data-heo2-ui="overlay"
        data-heo2-name="add-photo-overlay" data-heo2-options="dismissable:true;close:true;modal:true"
        style="display: none">
        <div id="bubble-add-photo" class="bubble-add-photo show" data-heo2-attach="@click:_addPhotoHelpDismiss_click">
            <?= __('ORDERAPP_MESSAGE_BUBBLE_ADD_PHOTO'); ?>
        </div>

        <i id="add-photo-help" data-heo2-attach="@click:_addPhotoHelp_click" class="fas fa-question"></i>
        <h2 class="title"><?= __('ORDERAPP_ADD_PHOTO_HEADER'); ?></h2>
        <div id="missing-code" class="missing-code">
            <span><?= __('ORDERAPP_MISSING_CODE_TIME'); ?></span>
        </div>
        <div class="internet-code">
            <label>
                <span><?= __('ORDERAPP_INTERNET_CODE'); ?>:</span>
                <div>
                    <input type="text" name="subject-code" data-heo2-attach="@keyup:_subjectCode_keyup" autofocus
                        autocomplete="off">
                    <span class="feedback" data-heo2-ui="label" data-heo2-name="subject-name"></span>
                    <div id="subject-code-add-input-spinner" class="spinner"></div>
                </div>
            </label>
            <button id="subject-code-add-button" class="ui-button" data-heo2-attach="@click:_subjectCodeAdd_click" ok
                disabled>
                <?= __('GENERIC_ADD'); ?>
            </button>
        </div>
        <div class="bottom">
            <div class="add-photo-code-request">
                <a class="underlined"
                    href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'code_request']); ?>"><?= __('ORDERAPP_CODE_REQUEST'); ?></a>
            </div>

            <div>
                <div class="clear-session">
                    <a class="underlined" href="javascript:"
                        data-heo2-attach="@click:_uniqueSessionClearSession_click"><?= __('ORDERAPP_CLEAR_SESSION'); ?></a>
                </div>
            </div>
        </div>

        <h3 class="explain"><?= __('ORDERAPP_ADD_PHOTO_EXPLAIN'); ?></h3>
        <div id="photo-group-container" class="photo-group-container">
        </div>
        <div class="buttons">
            <button class="btn-accent"
                data-heo2-attach="@click:_addPhotoOverlayNext_click"><?= __('GENERIC_NEXT'); ?></button>
        </div>
    </div>

    <div id="choose-green-screen-overlay" class="choose-green-screen-overlay overlay" data-heo2-ui="overlay"
        data-heo2-name="choose-green-screen-overlay" data-heo2-options="dismissable:true;close:true;modal:true">
        <h2><?= __('ORDERAPP_CHOOSE_GREEN_SCREEN'); ?></h2>
        <div class="content-area">
            <div class="preview-and-categories">
                <div class="preview">
                    <img id="green-screen-preview">
                    <div id="greenscreen-warning" class="warning">
                        <i class="close" data-heo2-attach="@click:_greenScreenWarningClose_click"></i>
                        <i class="fa fa-warning"></i>
                        <span><?= __('ORDERAPP_GREENSCREEN_PREVIEW_WARNING'); ?></span>
                    </div>
                </div>
                <div class="categories">
                    <ul id="background-categories-sel" class="background-categories-sel">
                        <li id="featured-item" class="featured-item"
                            data-heo2-attach="@click:_backgroundCategoryFeatured_click"><i
                                class="fad fa-bullhorn"></i><?= __('ORDERAPP_BACKGROUND_CATEGORY_FEATURED'); ?></li>
                        <li id="recent-item" class="recent-item"
                            data-heo2-attach="@click:_backgroundCategoryRecent_click"><i
                                class="fa fa-clock-o"></i><?= __('ORDERAPP_BACKGROUND_CATEGORY_RECENT'); ?></li>
                        <li id="fav-item" class="fav-item selected"
                            data-heo2-attach="@click:_backgroundCategoryFavorites_click"><i
                                class="fa fa-heart"></i><?= __('ORDERAPP_BACKGROUND_CATEGORY_FAVORITES'); ?></li>
                        <ul id="background-categories" class="background-categories">

                        </ul>
                    </ul>
                </div>
            </div>
            <div id="backgrounds" class="backgrounds">

            </div>
            <div class="buttons">
                <button id="greenscreen-ok" class="btn-accent" data-heo2-attach="@click:_backgroundOk_click"
                    ok><?= __('GENERIC_OK'); ?></button>
            </div>
        </div>
    </div>

    <div id="add-to-cart-overlay" class="add-to-cart-overlay overlay product-overlay" data-heo2-ui="overlay"
        data-heo2-name="add-to-cart-overlay" data-heo2-options="dismissable:true;close:true;modal:true">
        <h2 class="product-name" data-heo2-ui="label" data-heo2-name="add-to-cart-product-name"></h2>
        <div class="inner">
            <div class="top">
                <div id="selected-photos-container" class="selected-photos-container">
                    <div id="add-to-cart-selected-photos"></div>
                </div>
            </div>
            <div class="middle">
                <div class="img-container">
                    <img id="add-to-cart-product-img" data-heo2-attach="@click:_addToCartProductImg_click">
                    <div class="description-section">
                        <h4><?= __('ORDERAPP_ADD_TO_CART_DESCRIPTION'); ?></h4>
                        <p class="description" data-heo2-ui="label" data-heo2-name="add-to-cart-desc"></p>
                    </div>
                </div>
                <div class="details">
                    <div class="price">
                        <?= __('ORDERAPP_ADD_TO_CART_PRICE'); ?>:
                        <span data-heo2-ui="label" class="price-number"
                            data-heo2-name="add-to-cart-product-price"></span>
                        <span>&#215;</span>
                        <span data-heo2-ui="label" class="photo-number"
                            data-heo2-name="add-to-cart-selection-quantity"></span>
                        <span>&#215;</span>
                        <span>
                            <select name="quantity" data-heo2-attach="@change:_addToCartQuantity_change">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                            </select>
                        </span>
                        <span>&#61;</span>
                        <span data-heo2-ui="label" class="price-number" data-heo2-name="add-to-cart-total-price"></span>
                    </div>
                    <div id="themes-container">
                        <h4 class="themes-header"><?= __('ORDERAPP_ADD_TO_CART_THEMES'); ?></h4>
                        <div id="themes-message" class="warning">
                            <i class="close" data-heo2-attach="@click:_addToCartThemesWarningClose_click"></i>
                            <span><?= __('ORDERAPP_THEMES_MESSAGE'); ?></span>
                        </div>
                        <select name="themes" class="theme-select"
                            data-heo2-attach="@change:_addToCartThemes_change"></select>
                    </div>
                    <div id="digital-discount">
                        <h4><?= __('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT'); ?></h4>
                        <span id="add-to-cart-digital-discount-no-overlap">
                            <?= __('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_NO_OVERLAP'); ?>
                        </span>
                        <span id="add-to-cart-digital-discount-overlap">
                            <?= __('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_OVERLAP'); ?>
                        </span>
                        <span id="add-to-cart-digital-discount-full-overlap">
                            <?= __('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_FULL_OVERLAP'); ?>
                        </span>
                        <div id="add-to-cart-eligible-for-discount" class="add-to-cart-eligible-for-discount">
                        </div>
                        <div id="add-to-cart-digital-discount-count" class="discount-add-photo-count">
                        </div>
                        <label id="add-to-cart-digital-discount-add-checkbox">
                            <input type="checkbox" id="add-to-cart-digital-discount" name="digital-discount">
                            <span id="add-to-cart-digital-discount-amount" class="add-digital-copy-discount">
                            </span>
                        </label>
                    </div>
                    <div class="comment">
                        <h4><?= __('ORDERAPP_ADD_TO_CART_COMMENT'); ?></h4>
                        <textarea name="comment" maxlength="150"></textarea>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <button id="add-to-cart-next" class="btn-accent" disabled
                    data-heo2-attach="@click:_addToCartNext_click"><?= __('GENERIC_NEXT'); ?></button>
                <button id="add-to-cart-button" class="btn-accent"
                    data-heo2-attach="@click:_addToCartButton_click"><?= __('ORDERAPP_ADD_TO_CART'); ?></button>
                <button id="add-to-cart-edit" class="btn-accent"
                    data-heo2-attach="@click:_addToCartEditButton_click"><?= __('ORDERAPP_ADD_TO_CART_EDIT'); ?></button>
            </div>
        </div>
        <div id="add-to-cart-selected-photos-pre" class="selected-photos add-to-cart-selected-photos"
            data-text-after="<?= __('ORDERAPP_ADD_TO_CART_TITLE'); ?>"></div>
    </div>

    <div id="add-to-cart-digitals" class="add-to-cart-digitals overlay product-overlay" data-heo2-ui="overlay"
        data-heo2-name="add-to-cart-digitals" data-heo2-options="dismissable:true;close:true;modal:true">
        <h2><?= __('ORDERAPP_ADD_TO_CART_DIGITALS_TITLE'); ?></h2>
        <div class="inner">
            <div class="top">
                <div id="digitals-selected-photos-container" class="selected-photos-container">
                    <div id="digitals-add-to-cart-selected-photos"></div>
                </div>
            </div>
            <div class="middle">
                <div class="description">
                    <h4><?= __('ORDERAPP_ADD_TO_CART_DESCRIPTION'); ?></h4>
                    <p><?= __('ORDERAPP_ADD_TO_CART_DIGITALS_DESCRIPTION'); ?></p>
                </div>
                <div class="details">
                    <div class="price">
                        <?= __('ORDERAPP_ADD_TO_CART_PRICE'); ?>:
                        <span data-heo2-ui="label" class="price-number"
                            data-heo2-name="digitals-add-to-cart-price"></span>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <button id="add-to-cart-digitals-button" class="btn-accent"
                    data-heo2-attach="@click:_addToCartDigitalButton_click"><?= __('ORDERAPP_ADD_TO_CART'); ?></button>
                <button id="add-to-cart-digitals-edit" class="btn-accent"
                    data-heo2-attach="@click:_addToCartEditDigitalButton_click"><?= __('ORDERAPP_ADD_TO_CART_EDIT'); ?></button>
            </div>
        </div>
        <div id="digitals-selected-photos" class="selected-photos digitals-selected-photos"
            data-text-after="<?= __('ORDERAPP_DIGITAL'); ?>">

        </div>
    </div>

    <div id="add-to-cart-touchups" class="add-to-cart-touchups overlay product-overlay" data-heo2-ui="overlay"
        data-heo2-name="add-to-cart-touchups" data-heo2-options="dismissable:true;close:true;modal:true">
        <h2><?= __('ORDERAPP_ADD_TO_CART_TOUCHUPS_TITLE'); ?></h2>
        <div class="inner" id="touchup-container">
            <div class="top">
                <div class="selected-photo-container">
                    <img id="touchup-selection" class="selection">
                </div>
            </div>
            <div class="middle">
                <div class="details">
                    <div class="description">
                        <h4><?= __('ORDERAPP_ADD_TO_CART_DESCRIPTION'); ?></h4>
                        <p><?= __('ORDERAPP_ADD_TO_CART_TOUCHUPS_DESCRIPTION'); ?></p>
                    </div>
                    <div class="price">
                        <?= __('ORDERAPP_ADD_TO_CART_PRICE'); ?>:
                        <span class="price-number" data-heo2-ui="label" data-heo2-name="add-to-cart-touchup-price">
                    </div>
                </div>
                <div class="comment">
                    <div id="touchups-message" class="warning">
                        <i class="close" data-heo2-attach="@click:_addToCartTouchupsWarningClose_click"></i>
                        <span><?= __('ORDERAPP_TOUCHUPS_COMMENT_MESSAGE'); ?></span>
                    </div>
                    <h4><?= __('ORDERAPP_ADD_TO_CART_COMMENT'); ?></h4>
                    <textarea name="comment" maxlength="150"
                        data-heo2-attach="@keydown:_addToCartTouchupsComment_keydown"></textarea>
                </div>
            </div>
            <div class="bottom">
                <button id="add-to-cart-touchups-button" class="btn-accent"
                    data-heo2-attach="@click:_addToCartTouchupButton_click"><?= __('ORDERAPP_ADD_TO_CART'); ?></button>
                <button id="add-to-cart-touchups-edit" class="btn-accent"
                    data-heo2-attach="@click:_addToCartEditTouchupButton_click"><?= __('ORDERAPP_ADD_TO_CART_EDIT'); ?></button>
            </div>
        </div>
        <div id="touchups-selected-photos" class="selected-photos touchups-selected-photos"
            data-text-after="<?= __('ORDERAPP_TOUCHUP'); ?>">

        </div>
    </div>

    <div id="cart-overlay" class="cart-overlay overlay"
        style="display: none; --banner-height: <?= $promoConfig['enabled'] ? '4rem' : ''; ?>" data-heo2-ui="overlay"
        data-heo2-name="cart-overlay" data-heo2-options="dismissable:true;close:true;modal:true">
        <h2><?= __('ORDERAPP_CART_TITLE'); ?></h2>
        <?php if ($promoConfig['enabled']): ?>
            <?php
            $promoDisplay = $promoConfig['threshold'];
            if (fmod($promoDisplay, 1) !== 0.00) {
                $promoDisplay = number_format($promoConfig['threshold'], 2);
            }
            ;
            ?>
            <label id="announcement-banner"
                class="banner middle-overlay visible"><?= __('ORDERAPP_CART_ANNOUNCEMENT', $promoDisplay); ?></label>
        <?php endif; ?>
        <ul id="cart-items" class="cart-items"></ul>
        <div class="cart-controls">
            <div class="cart-info"><span><?= __('ORDERAPP_CART_SUBTOTAL'); ?>: </span><span data-heo2-ui="label"
                    data-heo2-name="cart-subtotal" class="cart-subtotal">0</span></div>
            <button id="complete-order" class="btn-accent" data-heo2-attach="@click:_cartCompleteOrder_click" disabled>
                <?= __('ORDERAPP_COMPLETE_ORDER'); ?>
            </button>
        </div>
    </div>

    <div id="cross-sell-overlay" class="cross-sell-overlay overlay" style="" data-heo2-ui="overlay"
        data-heo2-name="cross-sell-overlay" data-heo2-options="dismissable:true;close:true">
        <div class="cross-sell-overlay-container">
            <h3><?= __('ORDERAPP_CROSS_SELL_TITLE'); ?></h3>
            <ul id="cross-sell-items" class="cross-sell-items"></ul>
        </div>
        <div class="bottom">
            <button id="cross-sell-complete-order" data-heo2-attach="@click:_crosssellCompleteOrder_click">
                <?= __('ORDERAPP_CROSS_SELL_NO_THANKS'); ?>
            </button>
        </div>
    </div>

    <div id="build-your-own-overlay" class="build-your-own-overlay overlay product-overlay add-to-cart-overlay"
        data-heo2-ui="overlay" data-heo2-name="build-your-own-overlay" data-heo2-options="close:true;modal:false">
        <h2 id="build-your-own-title" data-heo2-ui="label" data-heo2-name="build-your-own-title"></h2>
        <div class="inner">
            <div class="top">
                <div id="build-your-own-selected-photos-container" class="selected-photos-container">
                    <div id="build-your-own-selected-photos"></div>
                </div>
            </div>
            <div class="middle">
                <div class="img-container">
                    <img id="build-your-own-product-img" data-heo2-attach="@click:_addToCartProductImg_click">
                </div>
                <div class="description-section">
                    <h4><?= __('ORDERAPP_ADD_TO_CART_DESCRIPTION'); ?></h4>
                    <p class="description" data-heo2-ui="label" data-heo2-name="add-to-cart-byop-description"></p>
                </div>
                <div class="byop-price">
                    <?= __('ORDERAPP_ADD_TO_CART_PRICE'); ?>: $<span data-heo2-ui="label"
                        data-heo2-name="add-to-cart-byop-price">
                </div>
                <div class="selection-section" id="build-your-own-selection-section">
                    <table id="build-your-own-choices" class="byop-choices-table"
                        data-choice-title="<?= __('ORDERAPP_BUILD_YOUR_OWN_CHOICE'); ?>">
                        <thead id="build-your-own-choices-head">
                            <tr id="build-your-own-choices-head-tr">
                                <th class="choices-header"><?= __('ORDERAPP_BYOP_CHOICES_HEADER'); ?></th>
                            </tr>
                        </thead>
                        <tbody id="build-your-own-choices-body"></tbody>
                    </table>
                </div>
                <div class="comment">
                    <h4><?= __('ORDERAPP_ADD_TO_CART_COMMENT'); ?></h4>
                    <textarea name="comment" maxlength="150"></textarea>
                    <div id="byop-choices-remaining-warning" class="warning">
                        <i class="close"></i>
                        <?= __('ORDERAPP_SELECT_MORE_CHOICES_MESSAGE'); ?>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <button id="add-to-cart-byop-next" class="btn-accent" disabled
                    data-heo2-attach="@click:_addToCartByopNext_click"><?= __('GENERIC_NEXT'); ?></button>
                <button id="add-to-cart-byop-button" class="btn-accent" disabled
                    data-heo2-attach="@click:_addToCartBYOPButton_click"><?= __('ORDERAPP_ADD_TO_CART'); ?></button>
                <button id="add-to-cart-byop-edit" class="btn-accent" disabled
                    data-heo2-attach="@click:_addToCartEditBYOPButton_click"><?= __('ORDERAPP_ADD_TO_CART_EDIT'); ?></button>
            </div>
        </div>
        <div id="build-your-own-selected-photos-pre" class="selected-photos selected-photos-hidden"
            data-text-after="<?= __('ORDERAPP_BUILD_YOUR_OWN_SELECT_PHOTO'); ?>"></div>
    </div>

    <div id="unique-session-overlay" class="unique-session-overlay overlay light-overlay" data-heo2-ui="overlay"
        data-heo2-name="unique-session-overlay" data-heo2-options="dismissable:true;close:true;dismissable:true">
        <div class="unique-session-overlay-container">
            <div class="message">
                <span><?= __('ORDERAPP_MESSAGE_UNIQUE_SESSION'); ?></span>
            </div>
            <div class="bottom">
                <button class="btn-accent"
                    data-heo2-attach="@click:_uniqueSessionClearSession_click"><?= __('ORDERAPP_CLEAR_SESSION'); ?></button>
                <button class="btn-accent"
                    data-heo2-attach="@click:_uniqueSessionOk_click"><?= __('GENERIC_OK'); ?></button>
            </div>
        </div>
    </div>

</section>