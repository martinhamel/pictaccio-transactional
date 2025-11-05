Nom, Address, Appartement, Ville, Province, Code Postal, Téléphone, Courriel, Promo
<?php foreach ($orders as $order): ?>
"<?= str_replace('"', '\"', $order['Contact']['name']); ?>", "<?= str_replace('"', '\"', $order['Contact']['civic_number']); ?> <?= str_replace('"', '\"', $order['Contact']['street']); ?>", "<?= str_replace('"', '\"', $order['Contact']['apartment']); ?>", "<?= str_replace('"', '\"', $order['Contact']['city']); ?>", "<?= str_replace('"', '\"', $order['Contact']['state']); ?>", "<?= str_replace('"', '\"', $order['Contact']['postal_code']); ?>", "<?= str_replace('"', '\"', $order['Contact']['phone']); ?>", "<?= str_replace('"', '\"', $order['Contact']['email']); ?>", "<?= str_replace('"', '\"', $order['Contact']['newsletter']); ?>"

<?php endforeach; ?>
