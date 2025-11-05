<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<div>
	<h1 class="accent">Demande d'information</h1>
	<ul>
		<li>Nom du parent<span class="fine">&nbsp;</span>: <?= isset($form['parent-name']) ? $form['parent-name'] : ''; ?></li>
		<li>Nom de l'enfant<span class="fine">&nbsp;</span>: <?= isset($form['child-name']) ? $form['child-name'] : ''; ?></li>
		<li>Courriel<span class="fine">&nbsp;</span>: <?= isset($form['email']) ? $form['email'] : ''; ?></li>
		<li>Téléphone<span class="fine">&nbsp;</span>: <?= isset($form['phone']) ? $form['phone'] : ''; ?></li>
		<li>École<span class="fine">&nbsp;</span>: <?= isset($form['school']) ? $form['school'] : ''; ?></li>
		<li>Groupe<span class="fine">&nbsp;</span>: <?= isset($form['group']) ? $form['group'] : ''; ?></li>
        <li>No. de commande<span class="fine">&nbsp;</span>: <?= isset($form['order-id']) ? $form['order-id']: ''; ?></li>
        <li>Code Internet<span class="fine">&nbsp;</span>: <?= isset($form['internet-code']) ? $form['internet-code']: ''; ?></li>
        <li>Promo<span class="fine">&nbsp;</span>: <?= isset($form['promo']) ? 'Oui' : 'Non'; ?></li>
	</ul>

	<p>
		<?= $form['message']; ?>
	</p>
</div>

