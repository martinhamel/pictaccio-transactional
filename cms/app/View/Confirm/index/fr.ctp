<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>
<section class="show-header">
	<div class="container">
		<div class="confirmation-msg">
			<div class="confirmation-header">
				<span>Status<span class="fine">&nbsp;</span>: <i class="fa fa-check"></i></span>
			</div>
			<div class="confirmation-body">
				<h2>Votre commande numéro <?= $this->Session->read('Order.id'); ?> est confirmée<span class="fine">&nbsp;</span>!</h2>
				<?php switch (!empty($deliveryOption['DeliveryOption']) ? $deliveryOption['DeliveryOption']['method'] : ''):
					case 'establishment': ?>
						<p><b>Bonjour <?= $this->Session->read('Order.contact.first-name'); ?>,</b><br>
							Nous avons bien enregistré votre commande. Elle sera retournée à l'établissement. Si vous avez commandé des copies digitales, vous recevrez un courriel contenant les instructions pour télécharger vos photos lorsqu'elles seront prêtes.
							Si vous avez des questions, vous pouvez nous contacter <a class="underlined" href="<?= Configure::read('URL.contact'); ?>">avec notre formulaire en-ligne</a> ou par téléphone au&nbsp;<b><?php echo Configure::read('Contacts.phoneNumber'); ?>.</b><br><br>
							Merci d'avoir pris le temps d'acheter chez&nbsp;nous.
						</p>
						<?php break; ?>
					<?php default: ?>
						<p><b>Bonjour <?= $this->Session->read('Order.contact.first-name'); ?>,</b><br>
							Nous avons bien enregistré votre commande.<br><br>
                            Si vous avez commandé des copies digitales, vous receverez un courriel contenant les instructions pour télécharger vos photos lorsqu'elles seront prêtes.
							Si vous avez des questions, vous pouvez nous contacter <a class="underlined" href="<?= Configure::read('URL.contact'); ?>">avec notre formulaire en-ligne</a> ou par téléphone au&nbsp;<b><?= Configure::read('Contacts.phoneNumber'); ?>.</b><br><br>
							Merci d'avoir pris le temps d'acheter chez&nbsp;nous.
						</p>
					<?php endswitch; ?>
			</div>
		</div>
	</div>

    <script>
        let _hash = "!";
        let noBackPlease = function () {
            window.location.href += "#";

            window.setTimeout(function () {
                window.location.href += "!";
            }, 50);
        };

        window.onhashchange = function () {
            if (window.location.hash !== _hash) {
                window.location.hash = _hash;
            }
        };

        window.onload = function () {
            const ORDERAPP_LOCAL_STORAGE_KEY = 'order'; // Also defined in order_app.js
            localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = null;
            noBackPlease();

            document.body.onkeydown = function (e) {
                let element = e.target.nodeName.toLowerCase();
                if (e.which === 8 && (element !== 'input' && element  !== 'textarea')) {
                    e.preventDefault();
                }
                e.stopPropagation();
            };
        }
    </script>
</section>
