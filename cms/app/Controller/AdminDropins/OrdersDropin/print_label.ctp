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
    </style>
</head>
<body>

<?php
//var_dump($orders);
?>

 <section class="order-print">
    <section class="overview">
        <?php $counter = 0; $breakPage = false; ?>
            <div class="container" style="writing-mode: vertical-rl; margin: 0; padding: 10px; font-size: 250%; line-height: 175%; white-space: nowrap; position: relative; left: 50%; transform: translateX(-50%)">
                <span>REF# <?= $order['Order']['id']; ?></span>

                <div>
                    <section>
                        <table class="contact-table">
                            <tr>
                                <td style="padding-top: 0"><?= $order['Contact']['name']; ?></td>
                            </tr>
                            <tr>
                                <td style="padding-top: 0"><?= $order['Contact']['civic_number']; ?> <?= $order['Contact']['street']; ?> <?= !empty($order['Contact']['apartment']) ? "#{$order['Contact']['apartment']}" : ''; ?> </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 0"><?= $order['Contact']['city']; ?>, <?= $order['Contact']['state']; ?></td>
                            </tr>
                            <tr>
                                <td style="padding-top: 0"><?= $order['Contact']['postal_code']; ?></td>
                            </tr>
                        </table>
                    </section>
                </div>
            </div>
    </section>
</section>

<script>
    window.print();
</script>

</body>
</html>
