<?php
/*
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */

$lang = substr(Configure::read('Config.language'), 0, 2);
$this->set('title_for_layout', __('PAGE_CODE_REQUEST'));
$this->Html->script("https://www.google.com/recaptcha/api.js?hl={$lang}", ['inline' => false]);
$this->Html->script('codeRequest', ['inline' => false]);

?>

<section id="code-request" class="code-request show-header">
	<div class="container">
		<h1 class="accent"><?= __('CODE_REQUEST_TITLE'); ?></h1>
		<p class="hidden"><?= __('CODE_REQUEST_EXPLAIN'); ?></p>
		<form action="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'code_request')); ?>" method="post">
			<div class="input-block">
				<label for="parent-name" class="input-label"><?= __('CODE_REQUEST_PARENT_NAME'); ?> *</label>
				<input id="parent-name" name="parent-name" type="text" data-heo2-attach="@change:_input_change" required/>
			</div>
            <div class="input-block">
                <label for="email" class="input-label"><?= __('CODE_REQUEST_EMAIL'); ?> *</label>
                <input id="email" name="email" type="email" data-heo2-attach="@change:_input_change" required/>
            </div>
            <div class="input-block">
                <label for="phone" class="input-label"><?= __('CODE_REQUEST_PHONE'); ?> *</label>
                <input id="phone" name="phone" type="text" data-heo2-attach="@change:_input_change" required/>
            </div>
			<div class="input-block">
				<label for="subject-name" class="input-label"><?= __('CODE_REQUEST_SUBJECT_NAME'); ?> *</label>
				<input id="subject-name" name="subject-name" type="text" data-heo2-attach="@change:_input_change" required/>
			</div>
            <div class="input-block">
                <label for="school" class="input-label">
                    <?= __('CODE_REQUEST_ESTABLISHMENT'); ?>
                    <span class="help-mark"><sup>?</sup>
                        <div class=help-bubble><?= __('CODE_REQUEST_ESTABLISHMENT_HELP'); ?></div>
                    </span>
                    &nbsp;*
                </label>
                <select id="school" name="school" data-heo2-attach="@change:_input_change" required>
                    <?php foreach ($sessions as $session): ?>
                    <option value="<?= $session['Session']['id'];?>"><?= $session['Session']['internal_name'];?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="input-block">
                <label for="gpi" class="input-label">
                    <?= __('CODE_REQUEST_GPI'); ?>
                    <span class="help-mark help-mark-last"><sup>?</sup>
                        <div class=help-bubble><?= __('CODE_REQUEST_GPI_HELP'); ?></div>
                    </span>
                </label>
                <input id="gpi" name="gpi" type="text" data-heo2-attach="@change:_input_change"/>
            </div>
            <div class="input-block">
                <label for="group" class="input-label"><?= __('CODE_REQUEST_GROUP'); ?></label>
                <input id="group" name="group" type="text" data-heo2-attach="@change:_input_change"/>
            </div>
			<div class="control-ui">
                <div class="g-recaptcha" data-sitekey="6LcgCB4UAAAAAG19ImK-lThWJJdkYbAsBIpJWofA" data-callback="recaptcha_success"></div>
				<input id="code-submit" type="submit" class="btn-accent" value="<?= __('CODE_REQUEST_SUBMIT'); ?>" disabled/>
			</div>
		</form>
	</div>
</section>
