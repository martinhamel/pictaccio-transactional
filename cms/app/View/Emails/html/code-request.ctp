<?php
/*
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */
?>

<div>
	<h1 class="accent"><?= __d('emails', 'CODE_REQUEST_TITLE'); ?></h1>
	<ul>
		<li><?= __d('emails', 'CODE_REQUEST_CUSTOMER'); ?><span class="fine">&nbsp;</span>: <?= isset($form['parent-name']) ? $form['parent-name'] : ''; ?></li>
		<li><?= __d('emails', 'CODE_REQUEST_SUBJECT'); ?><span class="fine">&nbsp;</span>: <?= isset($form['subject-name']) ? $form['subject-name'] : ''; ?></li>
		<li><?= __d('emails', 'CODE_REQUEST_EMAIL'); ?><span class="fine">&nbsp;</span>: <?= isset($form['email']) ? $form['email'] : ''; ?></li>
		<li><?= __d('emails', 'CODE_REQUEST_PHONE'); ?><span class="fine">&nbsp;</span>: <?= isset($form['phone']) ? $form['phone'] : ''; ?></li>
		<li><?= __d('emails', 'CODE_REQUEST_SESSION'); ?><span class="fine">&nbsp;</span>: <?= isset($form['school']) ? $session : ''; ?></li>
        <li><?= __d('emails', 'CODE_REQUEST_GROUP'); ?><span class="fine">&nbsp;</span>: <?= isset($form['group']) ? $form['group'] : ''; ?></li>
	</ul>
</div>

