<?php
/*
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */

$this->set('title_for_layout', __('PAGE_SESSION_NOT_AVAILABLE'));
?>

<section id="no-session" class="confirmation-msg no-session show-header">
	<div class="container feedback-message">
            <div class="confirmation-body">
                <h1 class="accent"><?= __('SESSION_NOT_AVAILABLE_TITLE'); ?></h1>
                <p><?= __('SESSION_NOT_AVAILABLE_MESSAGE'); ?></p>
                <br>
                <a class="underlined" href="<?= Configure::read('URL.root'); ?>"><?= __('SESSION_NOT_AVAILABLE_RETURN');?></a>
            </div>
        </div>
	</div>
</section>
