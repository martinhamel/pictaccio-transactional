<?php
/*
 * Copyright Â© 2014-2016, Heliox - All Right Reserved
 */

$this->set('title_for_layout', __('PAGE_DIGITALS'));
?>

<section id="digitals-landing" class="show-header">
    <div class="container feedback-message">
        <div class="confirmation-msg">
            <div class="confirmation-body">
                <h1 class="digitals-thanks accent"><?= __('DIGITAL_THANKS'); ?></h1>
                <p class="digitals-sent"><?= __('DIGITAL_SENT'); ?></p>
                <br>
                <a href="<?= $this->Html->url('/', true) . 'api/downloadDigitalsBundle?token=' . $token ?>" download="bundle.zip">
                    <button id="download" class="btn-accent"><?= __('DIGITAL_DOWNLOAD'); ?></button>
                </a>
            </div>
        </div>
    </div>
</section>
