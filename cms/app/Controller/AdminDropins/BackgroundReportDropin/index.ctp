<?php
/*
* HeO2 - Proprietary RAD Web Framework
* Copyright © 2015-2019, Heliox - All Right Reserved
*/
?>

<script><?php include 'script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<section id="admin-backgrounds-reports">
    <h1><?= __d('admin-backreportdrop', 'BACKGROUND_REPORT'); ?></h1>
    <table>

    <?php foreach($stats as $month => $monthStats): ?>
        <tr>
            <th class="date" colspan="3"><?= $month; ?></th>
        </tr>
        <tr>
            <th>
                <?= __d('admin-backreportdrop', 'ID_NUMBER'); ?>
            </th>
            <th>
                <?= __d('admin-backreportdrop', 'BACKGROUND_IMAGE'); ?>
            </th>
            <th>
                <?= __d('admin-backreportdrop', 'USED'); ?>
            </th>
        </tr>
        <?php foreach ($monthStats as $asset => $stat): ?>
            <tr>
                <td><?= !empty($assetIds[$asset]) ? $assetIds[$asset] : '--'; ?></td>
                <td>
                    <img src="<?= $this->Html->url('/', true) . $asset; ?>">
                </td>
                <td>
                    <?= $stat ?>
                </td>
            </tr>
        <?php endforeach; ?>
    <?php endforeach; ?>
    </table>
</section>

