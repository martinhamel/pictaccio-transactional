<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->css('app'); ?>
    <?= $this->Html->css('admin'); ?>
    <style type="text/css"><?php include 'style.inc.css'; ?></style>
    <style type="text/css">
        @page {
            size: A4;
        }

        .session-color-box-under {
            position: absolute;
            right: 3rem;
            width: 2rem;
            height: 2rem;
        }
        .session-color-box-under:after {
            content:"";
            position: absolute;
            right: 0;
            width: 6.3rem;
            margin-top: 3rem;
            border-top:1px solid #ccc;
            transform: rotate(25deg) translate(4px, -.5px);
            transform-origin: 0 0;
        }

        .session-color-box {
            position: absolute;
            right: 3rem;
            width: 6rem;
            height: 3rem;
            margin-top: 3rem;
            border: #222 1px solid;
            border-radius: 3px;
        }

        .byopSelection {
            display: inline-flex;
            white-space: pre;
        }

        .bold {
            font-size: 1.8rem;
            font-weight: 900;
        }
    </style>
</head>
<body>

<?php
//var_dump($orders);
?>

<?php
$insertPageBreak = false;
foreach ($orders as $order):
    if ($insertPageBreak) {
        ?>
        <div style="page-break-before: always;"></div><?php
    }
    $insertPageBreak = true;


    ?>

    <section class="order-print">
        <section class="overview">
            <?php $counter = 0; $breakPage = false; ?>
            <?php foreach($order['cartBySubject'] as $subjectCode => $bySubject): ?>
            <?php if ($breakPage): ?>
                <div style="display: block; width: 100%; page-break-before: always;"></div>
            <?php else: $breakPage = true; ?>
            <?php endif; ?>
                <div class="container">
                    <?php $color = '#' . current(array_filter($order['subjects'], function($subject) use ($subjectCode) {return strtolower($subject['subject_code']) === strtolower($subjectCode);}))['session_color'];
                    if ($color === null) $color = 'black'; ?>

                    <h1><?= __d('admin-orderdrop', 'ORDER_ID'); ?>: <?= $order['Order']['id']; ?>
                        - <?= $this->Time->format($order['Order']['modified'], Configure::read('Formats.datetime')); ?> -
                        <?= ++$counter; ?>/<?= count($order['cartBySubject']); ?>
                        - <?= current(array_filter($order['subjects'], function($subject) use ($subjectCode) {return strtolower($subject['subject_code']) === strtolower($subjectCode);}))['session_name']; ?>

                        <span class="session-color-box-under"></span>
                        <span class="session-color-box" style="background-color: <?= $color !== 'black' ? $color : 'transparent' ?>"></span>
                        <div class="logo" style="color: black; position: absolute; right: 0; top: 0; font-size: 2rem;">
                            <span style="height: 3rem; display: flex; align-items: center">
                                <?= $this->Html->image('logo_SF.svg', ['style' => 'height: 100%;']); ?>
                            </span>
                        </div>
                    </h1>
                    <div style="float: left; width: 45%; margin-right: 5px;">
                        <section>
                            <h2><?= __d('admin-orderdrop', 'CONTACT'); ?></h2>
                            <table class="contact-table">
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'NAME'); ?>:</td>
                                    <td><?= $order['Contact']['name']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'PHONE'); ?>:</td>
                                    <td><?= $order['Contact']['phone']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'EMAIL'); ?>:</td>
                                    <td><?= $order['Contact']['email']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'APARTMENT'); ?>:</td>
                                    <td><?= $order['Contact']['apartment']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'CIVIC'); ?>:</td>
                                    <td><?= $order['Contact']['civic_number']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'STREET'); ?>:</td>
                                    <td><?= $order['Contact']['street']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'CITY'); ?>:</td>
                                    <td><?= $order['Contact']['city']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'STATE'); ?>:</td>
                                    <td><?= $order['Contact']['state']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'POSTALCODE'); ?>:</td>
                                    <td><?= $order['Contact']['postal_code']; ?></td>
                                </tr>
                            </table>
                        </section>

                        <hr>

                        <section>
                            <h2><?= __d('admin-orderdrop', 'SUBJECTS'); ?></h2>
                            <?php foreach ($order['subjects'] as $subject): if (strtolower($subject['subject_code']) === strtolower($subjectCode)): ?>
                                <section>
                                    <table class="subject-table">
                                        <tr>
                                            <td><?= __d('admin-orderdrop', 'SESSION'); ?></td>
                                            <td><?= $subject['session_name']; ?></td>
                                        </tr>
                                        <?php foreach ($subject['subject_info'] as $key => $data): ?>
                                            <tr>
                                                <td><?= $key; ?></td>
                                                <td><?= $data; ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </table>
                                </section>
                            <?php endif; endforeach; ?>
                        </section>
                    </div>

                    <div style="margin-left: 46%">
                        <div>
                            <h2><?= __d('admin-orderdrop', 'TRANSACTION'); ?></h2>
                            <table class="transaction-table">
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'PRODUCT_TOTAL'); ?>:</td>
                                    <td><?= $this->Number->currency($order['cashRegister']->orderSubtotal); ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'SHIPPING'); ?>:</td>
                                    <td><?= (!empty($order['Order']['flags_json']) && !empty($order['Order']['flags_json']['free_shipping']) && $order['Order']['flags_json']['free_shipping']) ? __('GENERIC_FREE') : $this->Number->currency($order['cashRegister']->shipping); ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'PROMO'); ?>:</td>
                                    <td><?=  (!empty($order['Order']['flags_json']) && !empty($order['Order']['flags_json']['promo'])) ? $this->Number->currency($order['Order']['flags_json']['promo']['amount']) : '$0.00'; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'GST'); ?>:</td>
                                    <td><?= $this->Number->currency($order['cashRegister']->gst); ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'QST'); ?>:</td>
                                    <td><?= $this->Number->currency($order['cashRegister']->qst); ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'TOTAL'); ?>:</td>
                                    <td><?= $this->Number->currency($order['cashRegister']->total); ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'TRANSACTION_CODE'); ?>:</td>
                                    <td><?= $order['lastTransaction']['transaction_code']; ?></td>
                                </tr>
                                <tr>
                                    <td><?= __d('admin-orderdrop', 'TRANSACTION_TYPE'); ?>:</td>
                                    <td><?= $order['lastTransaction']['payment_module']; ?></td>
                                </tr>
                            </table>
                            <a href="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'transactions', [$order['Order']['id']]); ?>"><?= __d('admin-orderdrop', 'VIEW_ALL_TRANSACTIONS'); ?></a>
                            <div>
                                <hr>

                                <h2><?= __d('admin-orderdrop', 'SHIPPING'); ?></h2>
                                <?= __d('admin-orderdrop', 'DELIVERY_OPTION'); ?>
                                : <?= !empty($order['SelectedDeliveryOption']) ? $order['SelectedDeliveryOption']['DeliveryOption']['name_locale'] : '[none]'; ?>

                                <hr>

                                <h2><?= __d('admin-orderdrop', 'COMMENT'); ?></h2>
                                <div><?= $order['Order']['comment']; ?></div>
                            </div>
                        </div>
                    </div>

                    <hr style="clear: both">

                    <h2><?= __d('admin-orderdrop', 'ORDER'); ?></h2>
                    <div class="cart">
                        <?php $subject = array_filter($order['subjects'], function($subject) use ($subjectCode) {return strtolower($subject['subject_code']) === strtolower($subjectCode) || isset($subject[$subjectCode]['subject_info']['groupe']);}); ?>
                        <?php foreach ($bySubject as $item): ?>
                            <div class="cart-item"  style="page-break-inside: avoid; margin-bottom: 0.125in; display: grid; grid-auto-columns: 1fr; gap: 0 0.125in">
                                <div style="grid-column: 1/2; white-space: normal;">
                                    <h3 style="max-width: 15ch; margin: 0 0 1rem;">
                                        <?= $order['products'][$item['productId']]['name_locale']; ?>
                                        <?php if($item['digitalImage'] || $item['touchups'] !== ''): ?>
                                            <span>
                                                <?= __('GENERIC_WITH') ?>
                                                <?php if($item['digitalImage'] !== ''): ?>
                                                    <?= __('ORDERAPP_ADD_TO_CART_EXTRA_DIGITAL_COPY') ?>
                                                <?php endif; ?>
                                                <?php if($item['digitalImage'] && $item['touchups'] !== ''): ?>
                                                    <?= __('GENERIC_AND') ?>
                                                <?php endif; ?>
                                                <?php if($item['touchups'] !== ''): ?>
                                                    <?= __('ORDERAPP_ADD_TO_CART_EXTRA_TOUCH_UPS') ?>
                                                <?php endif; ?>
                                            </span>
                                        <?php endif; ?>
                                    </h3>
                                    <ul>
                                        <li><?= __d('admin-orderdrop', 'UNIT_SUBTOTAL'); ?>: <?= $this->Number->currency($item['subtotal'], 'CAD'); ?></li>
                                        <li class="<?= $item['quantity'] > 1 ? 'bold' : ''; ?>"><?= __d('admin-orderdrop', 'QUANTITY');?>: <?= $item['quantity']; ?></li>
                                        <li><?= __d('admin-orderdrop', 'THEME'); ?>: <?= $item['theme'] ? $order['products'][$item['productId']]['themes_json'][$item['theme']] : '--' ?> </li>
                                        <li class="product-comment"><?= __d('admin-orderdrop', 'COMMENT'); ?>: <?= isset($item['comment']) ? $item['comment'] : ''; ?> </li>
                                        <?php if (isset($item['digitalImage']) && $item['digitalImage'] === '1'): ?>
                                            <li><?= __d('admin-orderdrop', 'DIGITAL_COPY'); ?>: <span style="font-weight: bold"><?= isset($item['digitalImage']) ? $item['digitalImage'] === '1' ? __('GENERIC_YES') : __('GENERIC_NO') : ''; ?></span> </li>
                                        <?php endif; ?>
                                        <?php if (isset($item['touchups']) && $item['touchups'] === '1'): ?>
                                            <li><?= __d('admin-orderdrop', 'TOUCHUPS'); ?>: <span style="font-weight: bold;"><?= isset($item['touchups']) ? $item['touchups'] === '1' ? __('GENERIC_YES') : __('GENERIC_NO')  : ''; ?></span> </li>
                                        <?php endif; ?>
                                        <li><?= __d('admin-orderdrop', 'BYOP_SELECTION'); ?>: <div class="byopSelection"><b><?= isset($item['byopSelection']) ? join($item['byopSelection'], ",\n") : ''; ?></b></div></li>
                                    </ul>
                                </div>
                                <div style="grid-column: 2/5; display: grid; grid-template-columns: 1fr 1fr 1fr;">

                                    <?php $photoCounter = 1; foreach($item['selection'] as $selection):
                                          if ((isset($order['Order']['photo_selection_json'][$selection]['image']['studentCode']) && strtolower($order['Order']['photo_selection_json'][$selection]['image']['studentCode']) === strtolower($subjectCode)) ||
                                              (isset($order['Order']['photo_selection_json'][$selection]['image']['groups']) && strtolower($order['Order']['photo_selection_json'][$selection]['image']['groups']) === strtolower($subject[$subjectCode]['subject_info']['groupe']))): ?>
                                        <div style="position: relative; display: inline-block;">
                                            <img style="height: unset; width: 1.25in;" src="<?= $order['Order']['photo_selection_json'][$selection]['image']['url']; ?>">
                                            <?php if (!empty($order['Order']['photo_selection_json'][$selection]['background'])): ?>
                                                <span style="position: absolute; top: 0; left: 1.35in; padding: .2rem; color: black"><?= $order['Order']['photo_selection_json'][$selection]['background']['number']; ?></span>
                                                <img style="height: 0.5in; width: 3.5rem; object-fit: cover;" src="<?= $this->Html->url('/') . $order['Order']['photo_selection_json'][$selection]['background']['url']; ?>">
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; endforeach; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>

        </section>
    </section>
<?php endforeach; ?>

<script>
    window.print();
</script>

</body>
</html>
