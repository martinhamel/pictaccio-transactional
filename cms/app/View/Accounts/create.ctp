<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<?php $this->Html->script('accountsCreate.js', ['inline' => false]); ?>

<section class="accounts-create">
    <h2><?= __('USER_CREATE_LOCAL_HEADER'); ?></h2>
    <?php if (!empty($error)): ?>
    <div class="error">
        <?= $error; ?>
    </div>
    <?php endif; ?>
    <div class="container">
        <div class="signup-form-container">
            <div class="signup-form">
                <form id="create-local" method="post">
                    <label>
                        <span><?= __('USER_NAME'); ?></span>
                        <input type="text" name="name" required>
                    </label>
                    <label>
                        <span><?= __('USER_EMAIL'); ?></span>
                        <input type="email" name="email" required>
                    </label>
                    <div class="password">
                        <label>
                            <span><?= __('USER_PASSWORD'); ?></span>
                            <input type="password" name="pass" required>
                        </label>
                        <label>
                            <span><?= __('USER_CONFIRM_PASSWORD'); ?></span>
                            <input type="password" name="confirm-pass" required>
                        </label>
                    </div>
                    <?= $this->CSRF->makeCSRFTokenField() ?>
                    <input type="submit" class="btn-blue" value="<?= __('USER_CREATE_LOCAL_ACCOUNT_BUTTON'); ?>">
                </form>
            </div>

            <hr class="auth-type-separator">

            <div class="oauth-auth">
                <h3><?= __('USER_CREATE_OAUTH'); ?></h3>
                <div class="g-signin2" data-onsuccess="onSignIn"><?= $this->Html->image('icons8-logo-google.svg'); ?>Google</div>
                <div class="apple-singin"><?= $this->Html->image('Apple_logo_white.svg'); ?>Apple</div>
                <div class="fb-login-button" data-width="" data-size="large" data-button-type="" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"><?= $this->Html->image('f_logo_RGB-White_1024.svg'); ?>Facebook</div>
            </div>
        </div>
    </div>
</section>
