<style type="text/css"><?php include 'style.inc.css'; ?></style>
<script>
    const orderId = '<?= $order['Order']['id']; ?>';

    <?php include 'view.script.inc.js'; ?></script>

<div id="admin-orders-view">
    <section id="action-bar" class="action-bar right">
        <a href="#upload">
            <button class="ui-button"><?= __('GENERIC_UPLOAD'); ?></button>
        </a>
        <a href="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'print_order', [$order['Order']['id']]); ?>">
            <button class="ui-button"><?= __('GENERIC_PRINT'); ?></button>
        </a>
        <a href="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'print_label', [$order['Order']['id']]); ?>">
            <button class="ui-button"><?= __d('admin-orderdrop', 'PRINT_LABEL'); ?></button>
        </a>
        <button class="ui-button" data-heo2-attach="@click:_showPrintTags_click"><?= __d('admin-orderdrop', 'PRINT_TAGS'); ?>...</button>
    </section>
    <section class="overview">
        <h1><?= __d('admin-orderdrop', 'ORDER_ID'); ?>: <?= $order['Order']['id']; ?>
            - <?= $this->Time->format($order['Order']['modified'], Configure::read('Formats.datetime')); ?></h1>
        <div class="container">
            <div class="left-section-column">
                <section>
                    <h2><?= __d('admin-orderdrop', 'CONTACT'); ?></h2>
                    <div class="order-contacts">
                        <div class="left-column">
                            <?= __d('admin-orderdrop', 'NAME'); ?>:<br>
                            <?= __d('admin-orderdrop', 'PHONE'); ?>:<br>
                            <?= __d('admin-orderdrop', 'EMAIL'); ?>:<br>
                            <?= __d('admin-orderdrop', 'APARTMENT'); ?>:<br>
                            <?= __d('admin-orderdrop', 'CIVIC'); ?>:<br>
                            <?= __d('admin-orderdrop', 'STREET'); ?>:<br>
                            <?= __d('admin-orderdrop', 'CITY'); ?>:<br>
                            <?= __d('admin-orderdrop', 'STATE'); ?>:<br>
                            <?= __d('admin-orderdrop', 'POSTALCODE'); ?>:
                        </div>
                        <div class="right-column">
                            <?= $order['Contact']['name']; ?><br>
                            <?= $order['Contact']['phone']; ?><br>
                            <?= $order['Contact']['email']; ?><br>
                            <?= $order['Contact']['apartment']; ?><br>
                            <?= $order['Contact']['civic_number']; ?><br>
                            <?= $order['Contact']['street']; ?><br>
                            <?= $order['Contact']['city']; ?><br>
                            <?= $order['Contact']['state']; ?><br>
                            <?= $order['Contact']['postal_code']; ?>
                        </div>
                    </div>
                </section>

                <hr>

                <section>
                    <h2><?= __d('admin-orderdrop', 'SUBJECTS'); ?></h2>
                    <?php $letter = 'A'; $testSubjects = [];
                    foreach ($subjects as $subject): if (!isset($testSubjects[strtolower($subject['studentCode'])])):
                        $testSubjects[strtolower($subject['studentCode'])] = true; ?>

                        <section>
                            <h4><?= $letter++; ?></h4>
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

            <div class="right-section-column">
                <section>
                    <h2><?= __d('admin-orderdrop', 'TRANSACTION'); ?></h2>
                    <table class="transaction-table">
                        <tr>
                            <td><?= __d('admin-orderdrop', 'PRODUCT_TOTAL'); ?>:</td>
                            <td><?= $this->Number->currency($cashRegister->orderSubtotal); ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'SHIPPING'); ?>:</td>
                            <td><?= (!empty($order['Order']['flags_json']) && !empty($order['Order']['flags_json']['free_shipping']) && $order['Order']['flags_json']['free_shipping']) ? __('GENERIC_FREE') : $this->Number->currency($cashRegister->shipping); ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'PROMO'); ?>:</td>
                            <td><?=  (!empty($order['Order']['flags_json']) && !empty($order['Order']['flags_json']['promo'])) ? $this->Number->currency($order['Order']['flags_json']['promo']['amount']) : '$0.00'; ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'GST'); ?>:</td>
                            <td><?= $this->Number->currency($cashRegister->gst); ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'QST'); ?>:</td>
                            <td><?= $this->Number->currency($cashRegister->qst); ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'TOTAL'); ?>:</td>
                            <td><?= $this->Number->currency($cashRegister->total); ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'TRANSACTION_CODE'); ?>:</td>
                            <td><?= isset($lastTransaction['Transaction']) ? $lastTransaction['Transaction']['transaction_code'] : '--'; ?></td>
                        </tr>
                        <tr>
                            <td><?= __d('admin-orderdrop', 'TRANSACTION_TYPE'); ?>:</td>
                            <td><?= isset($lastTransaction['Transaction']) ? $lastTransaction['Transaction']['payment_module'] : '--'; ?></td>
                        </tr>
                    </table>
                    <a href="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'transactions', [$order['Order']['id']]); ?>"><?= __d('admin-orderdrop', 'VIEW_ALL_TRANSACTIONS'); ?></a>
                </section>
                <section>
                    <hr>

                    <h2><?= __d('admin-orderdrop', 'SHIPPING'); ?></h2>
                    <?= __d('admin-orderdrop', 'DELIVERY_OPTION'); ?>
                        : <?= !empty($deliveryOption['DeliveryOption']) ? $deliveryOption['DeliveryOption']['name_locale'] : '[none]'; ?>

                    <hr>

                    <h2><?= __d('admin-orderdrop', 'COMMENT'); ?></h2>
                    <div class="product-comment"><?= $order['Order']['comment']; ?></div>
                </section>
            </div>

            <hr style="clear: both">

            <h2><?= __d('admin-orderdrop', 'ORDER'); ?></h2>
            <div class="cart">
                <?php foreach($cart as $item): ?>
                <div class="cart-item">
                    <div>
                        <h3><?= $products[$item['productId']]['name_locale']; ?>
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
                            <li><?= __d('admin-orderdrop', 'QUANTITY');?>: <?= $item['quantity']; ?></li>
                            <li><?= __d('admin-orderdrop', 'THEME'); ?>: <?= $item['theme'] ? $products[$item['productId']]['themes_json'][$item['theme']] : '--' ?> </li>
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
                    <div>
                        <?php $counter = 1; foreach($item['selection'] as $selection): ?>
                            <div style="position: relative; display: inline-block;">
                                <img src="<?= $order['Order']['photo_selection_json'][$selection]['image']['url']; ?>">
                                <?php if (!empty($order['Order']['photo_selection_json'][$selection]['background'])): ?>
                                    <span style="position:absolute; top: 0; left: 25%; padding: .2rem; background: black;"><?= $order['Order']['photo_selection_json'][$selection]['background']['number']; ?></span>
                                    <img style="height: 7.5rem;" src="<?= $this->Html->url('/') . $order['Order']['photo_selection_json'][$selection]['background']['url']; ?>">
                                <?php endif; ?>
                            </div>
                        <?php
                            if (++$counter > 3) {
                                $counter = 1;
                                echo '<br>';
                            }
                            endforeach; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

        </div>
    </section>

    <hr>

    <section id="upload" class="upload <?= $hasUploads ? 'state-has-uploads' : ''; ?>">
        <h2><?= __d('admin-orderdrop', 'UPLOAD_TITLE'); ?></h2>
        <button id="order-browse-trigger" class="ui-button browse-button"><?= __('GENERIC_BROWSE'); ?></button>
        <button id="order-upload-trigger" class="upload-button" data-heo2-attach="@click:_upload_click"><?= __('GENERIC_UPLOAD'); ?></button>
        <button class="ui-button delete-button" data-heo2-attach="@click:_delete_click"><?= __('GENERIC_DELETE'); ?></button>
        <button class="ui-button send-confirmation-button" data-heo2-attach="@click:_sendConfirmation_click"><?= __d('admin-orderdrop', 'SEND_CONFIRMATION'); ?></button>
        <span>
            <div>
                <?php if(count($digitalEmailDate) > 0):foreach ($digitalEmailDate as $emailSent): ?>
                    <span>
                        <?= $emailSent['image_count']; ?> photos <?= __d('admin-orderdrop', 'SENT_ON'); ?>:
                        <?= $this->Time->nice($emailSent['date']); ?>
                    </span><br>
                <?php endforeach; ?>
                <?php else: ?>
                    <span><?= __d('admin-orderdrop', 'NOT_SENT'); ?></span>
                <?php endif; ?>
            </div>
        <hr style="opacity: 0;">
        <div id="upload-images" class="images">
            <?php if ($hasUploads):foreach($uploads as $upload):foreach ($upload['OrderUpload']['images_json'] as $image): ?>
                <img src="<?= $this->Html->url('/') . $image['path']; ?>">
            <?php endforeach;endforeach;endif; ?>
        </div>
    </section>

    <hr>

    <section class="comments">
        <?php if (isset($order['Order']['flags_json']['comments'])):foreach($order['Order']['flags_json']['comments'] as $comment): ?>
        <div class="comment">
            <span><?= $comment['name']; ?> - <?= $this->Time->nice($comment['time']); ?></span>
            <p>
                <?= str_replace("\n", '<br>', $comment['text']); ?>
            </p>
        </div>
        <?php endforeach;endif; ?>

        <div id="new-comment" class="new-comment">
            <h3><?= __d('admin-orderdrop', 'NEW_COMMENT'); ?></h3>
            <label><?= __('GENERIC_NAME_LABEL'); ?>: <input name="name"></label>
            <textarea name="text"></textarea>
            <label><?= __d('admin-orderdrop', 'TO'); ?>: <input name="to" type="email"></label>
            <select id="predefined-to">
                <option value=""></option>
                <option value="simon@photosf.ca">Simon &lt;simon@photosf.ca&gt;</option>
                <option value="infographie@photosf.ca">Micheline, Sonia &lt;infographie@photosf.ca&gt;</option>
                <option value="service@photosf.ca">Patricia &lt;service@photosf.ca&gt;</option>
            </select>
            <button class="btn-blue" data-heo2-attach="@click:_comment_click"><?= __('GENERIC_SUBMIT'); ?></button>
        </div>
    </section>

    <ul id="print-tags-product-selector" class="print-tags-product-selector">
        <div>
            <?php foreach($cart as $item): ?>
                <li><label><input type="checkbox" name="<?= $item['productId']; ?>"><?= $products[$item['productId']]['name_locale']; ?></label></li>
            <?php endforeach; ?>
        </div>
        <div>
            <button class="ui-button" data-heo2-attach="@click:_printTags"><?= __('GENERIC_PRINT'); ?></button>
        </div>
    </ul>
</div>
