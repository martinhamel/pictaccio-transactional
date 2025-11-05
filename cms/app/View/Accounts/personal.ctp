<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<section class="accounts-personal">
    <div class="container">
        <form method="post">
            <label>
                <span><?= __('USER_NAME'); ?></span>
                <input type="text" name="name" value="<?= !empty($user['info_json']['name']) ? $user['info_json']['name'] : '<missing>'; ?>">
            </label>
            <label>
                <span><?= __('USER_EMAIL'); ?></span>
                <input type="email" value="<?= $user['email']; ?>" disabled>
            </label>
            <label>
                <span><?= __('USER_CURRENT_PASSWORD'); ?></span>
                <input type="password" name="current-pass" value="">
            </label>
            <label>
                <span><?= __('USER_PASSWORD'); ?></span>
                <input type="password" name="pass" value="">
            </label>
            <input type="hidden" name="email" value="<?= $user['email']; ?>">
            <?= $this->CSRF->makeCSRFTokenField() ?>
            <input type="submit" class="btn-blue" value="<?= __('GENERIC_EDIT'); ?>">
        </form>
    </div>
</section>
