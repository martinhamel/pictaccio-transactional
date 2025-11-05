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
        .container {
            page-break-after: always;
        }
        .container:last-child {
            page-break-after: initial;
        }
        .checkbox::after {
            box-shadow: 0 0 0 3px black !important;
        }
    </style>
</head>
<body>

<?php
//var_dump($orders);
?>

<section class="order-print">
    <section class="overview">
        <?php foreach($products as $product): ?>
            <?php $i = 0; while($i < $product['Product']['quantity']): ?>
            <div class="container" style="writing-mode: vertical-rl; margin: 0; padding: 10px; font-size: 250%; line-height: 175%; white-space: nowrap; position: relative; left: 50%; transform: translateX(-50%);">
                <span>REF# <?= $order['Order']['id']; ?></span>
                <div>
                    <section>
                        <table class="contact-table">
                            <tr>
                                <td style="padding-top: 0"><?= $order['Session']['name_locale']; ?></td>
                            </tr>
                            <tr>
                                <?php foreach($product['Subjects'] as $subject): ?>
                                    <td style="padding-top: 0"><?= $subject['display_name']; ?> <?= isset($subject['group']) ? "(Groupe:  {$subject['group']})" : ""; ?></td>
                                <?php endforeach; ?>
                            </tr>
                            <tr>
                                <td style="padding-top: 0">
                                    <?= $product['Product']['name_locale']; ?>
                                </td>
                            </tr>
                            <?php if((isset($product['Product']['theme'][0]) && $product['Product']['theme'][0] !== "")): ?>
                            <?php foreach($product['Product']['theme'] as $theme): ?>
                            <tr>
                                <td style="height: ">
                                    <input type="checkbox" class="checkbox" style="margin-right: 2.5rem;">
                                    <?= $product['Product']['themes_json'][$theme]; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            <?php endif; ?>
                        </table>
                    </section>
                </div>
            </div>
            <?php $i++; ?>
            <?php endwhile; ?>
        <?php endforeach; ?>
    </section>
</section>

<script>
    window.print();
</script>

</body>
</html>
