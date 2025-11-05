<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<?php $this->Html->script('accountsLogin.js', ['inline' => false]); ?>

<section id="accounts-login" class="accounts-login">
    <div class="container">
        <input type="radio" id="selection-section-login" name="section" value="login" checked>
        <label class="selection-section-login" for="selection-section-login"><?= __('USER_LOGIN'); ?></label>

        <input type="radio" id="selection-section-signup" name="section" value="signup">
        <label class="selection-section-signup" for="selection-section-signup"><?= __('USER_SIGNUP'); ?></label>

        <section class="section-login">
            <div class="local-auth">
                <form method="post">
                    <label>
                        <span><?= __('USER_EMAIL'); ?></span>
                        <input type="email" name="email">
                    </label>
                    <label>
                        <span><?= __('USER_PASSWORD'); ?></span>
                        <input type="password" name="pass">
                        <a style="display: none;"><?= __('USER_FORGOT_PASSWORD'); ?></a>
                    </label>
                    <?= $this->CSRF->makeCSRFTokenField() ?>
                    <input type="submit" class="btn-secondary" value="<?= __('USER_LOGIN'); ?>">
                    <a href="<?= $this->Html->url(['controller' => 'accounts', 'action' => 'create']); ?>"><?= __('USER_CREATE_LOCAL_ACCOUNT_LINK'); ?></a>
                </form>
            </div>

            <hr class="auth-type-separator">

            <div class="oauth-auth">
                <h3><?= __('USER_LOGIN_OAUTH'); ?></h3>
                <div class="g-signin2" data-onsuccess="onSignIn"><?= $this->Html->image('icons8-logo-google.svg'); ?>Google</div>
                <div class="apple-singin"><?= $this->Html->image('Apple_logo_white.svg'); ?>Apple</div>
                <div class="fb-login-button" data-width="" data-size="large" data-button-type="" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"><?= $this->Html->image('f_logo_RGB-White_1024.svg'); ?>Facebook</div>
            </div>
        </section>

        <section class="section-signup">
            <h3><?= __('USER_DONT_HAVE_AN_ACCOUNT'); ?></h3>
            <h4 class="suggest-oauth"><?= __('USER_DONT_HAVE_AN_ACCOUNT_USE_OAUTH'); ?></h4>
            <h4 class="suggest-local"><?= __('USER_CREATE_LOCAL_ACCOUNT'); ?></h4>
            <a href="<?= $this->Html->url(['controller' => 'accounts', 'action' => 'create']); ?>">
                <button class="btn-primary signup-invite">
                    <?= __('USER_CREATE_LOCAL_ACCOUNT_BUTTON'); ?>
                </button>
            </a>
        </section>
    </div>
        
    <dialog id="accounts-reload-needed" class="accounts-reload-needed">
        <h3><?= __('USER_LOGIN_RELOAD_TITLE'); ?></h3>
        <p><?= __('USER_LOGIN_RELOAD_TEXT'); ?></p>
        <div class="bottom">
            <a href="login"><button><?= __('USER_LOGIN_RELOAD_LINK'); ?></button></a>
        </div>
    </dialog>
</section>
