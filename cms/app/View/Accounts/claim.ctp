<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<?php $this->Html->script('accountsClaim.js', ['inline' => false]); ?>

<section id="accounts-claim" class="accounts-claim">
    <div class="container">
        <div class="claim-center">
            <div class="actions">
                <button class="ui-button" data-heo2-attach="@click:_openClaim_click"><i class="fa fa-plus"></i> <?= __('USER_CLAIM_STUDENT_CODE_ACTION'); ?></button>
            </div>
            <div class="no-claim <?= $noClaim === false ? 'not-displayed' : ''; ?>">
                <h2><?= __('USER_NO_CLAIM_HEADER'); ?></h2>
                <p><?= __('USER_NO_CLAIM_EXPLAIN'); ?></p>
            </div>
            <table id="claimed-codes" class="claimed-codes">
                <tr>
                    <th class="student-code-column-header"><?= __('USER_STUDENT_CODE'); ?></th>
                    <th class="student-name-column-header"><?= __('USER_STUDENT_NAME'); ?></th>
                    <th class="hide-column-header"><?= __('USER_STUDENT_CODE_HIDE'); ?></th>
                </tr>
                <?php foreach ($claimed as $studentCode): ?>
                <tr>
                    <td><?= $studentCode['code']; ?></td>
                    <td><?= $studentCode['name']; ?></td>
                    <td class="hide-column"><input type="checkbox" data-code="<?= $studentCode['code']; ?>" <?= $studentCode['hide'] ? 'checked' : ''; ?>></td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>

    <div id="accounts-claim-overlay" class="overlay overlay-default accounts-claim-overlay" data-heo2-ui="overlay" data-heo2-name="claim-overlay" data-heo2-options="close:true">
        <h3><?= __('USER_CLAIM_STUDENT_CODE_HEADER'); ?></h3>
        <div>
            <label>
                <span><?= __('USER_STUDENT_CODE'); ?></span>:
                <input type="text" name="student-code" class="student-code" data-heo2-attach="@keyup:_studentCode_keyup">
                <span class="feedback"><?= __('USER_STUDENT_NAME'); ?>: <span data-heo2-ui="label" data-heo2-name="student-name"></span></span>
            </label>
            <label>
                <input type="checkbox" name="hide">
                <span><?= __('USER_CLAIM_HIDE_PUBLIC'); ?></span>
                <p class="explain">
                    <?= __('USER_CLAIM_HIDE_PUBLIC_EXPLAIN'); ?>
                </p>
            </label>
            <div class="middle">
                <button id="claim" class="ui-button disabled" disabled><?= __('USER_CLAIM_STUDENT_CODE_ACTION'); ?></button>
            </div>
        </div>
    </div>
</section>
