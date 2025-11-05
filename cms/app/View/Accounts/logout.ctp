<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<div class="accounts-logout">
    <div class="logout-message">
        <h2><?= __('USER_LOGOUT_MESSAGE'); ?></h2>
        <div class="redirect">
            <a href="<?= $this->Html->url(array('controller' => 'accounts', 'action' => 'login')); ?>"><?= __('USER_LOGIN'); ?></a><br/>
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'home', 'private' => false)); ?>"><?= __('USER_RETURN_HOME'); ?></a>
        </div>
    </div>
</div>
