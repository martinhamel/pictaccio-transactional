<?php
/*
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */

$this->set('title_for_layout', __('PAGE_CODE_REQUEST'));
?>

<section class="code-request show-header">
	<div class="container feedback-message">
        <div class="confirmation-msg">
            <div class="confirmation-header">
                <span class="error">Status: <i class="fa fa-exclamation"></i></span>
            </div>
            <div class="confirmation-body">
                <h1 class="error"><?= __('CODE_REQUEST_TITLE'); ?></h1>
                <p><?= __('CODE_REQUEST_NOT_SENT', Configure::read('Contacts.phoneNumber')); ?></p>
                <br>
                <a class="underlined" href="/" onclick="window.history.go(-1); return false;"><?= __('CODE_REQUEST_FAIL_RETURN');?></a><br>
                <a class="underlined" href="<?= Configure::read('URL.root'); ?>"><?= __('CODE_REQUEST_RETURN');?></a>
            </div>
        </div>
    </div>
</section>
