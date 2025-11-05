<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<p>
    Timeout: <?= isset($timeout) ? 'true' : 'false'; ?>
</p>

<ol>
    <?php
    foreach ($codes as $code) {
        ?>
        <li><?= $code; ?></li><?php
    } ?>
</ol>
