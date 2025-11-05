<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<p>
	<?= "{$contact['first-name']} "; ?>
	<?= __d('emails', 'NOTIFY_MAIN', $orderId); ?>
	<br>
	<!-- TODO: Make link open GUI-->
	<a href="https://photosf.ca/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/view/<?= $orderId; ?>"><?= __d('emails', 'NOTIFY_ORDER'); ?></a>
</p>
<h4>Information</h4>
<ul>
    <?php foreach ($childrenInfo as $childInfo): ?>
        <?php foreach($childInfo as $name => $info): ?>
            <li><strong><?= $name; ?>:</strong> <?= $info; ?></li>
        <?php endforeach; ?>
    <?php endforeach; ?>
</ul>

