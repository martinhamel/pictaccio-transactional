<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>
<section>
	<div class="container">
		<div class="confirmation-msg">
			<div class="confirmation-header">
				<span>Status<span class="fine">&nbsp;</span>: <i class="fa fa-check"></i></span>
			</div>
            <?php $apartment = $this->Session->read('Order.contact.apartment') ? '#' . $this->Session->read('Order.contact.apartment') : ''; ?>
			<div class="confirmation-body">
				<h2>Votre commande numéro <?= $this->Session->read('Order.id'); ?> est confirmée<span class="fine">&nbsp;</span>!</h2>
                <h4>
                    Voulez-vous faire un don à la Fondation Charles-Bruneau? Aidez la recherche en hémato-oncologie pédiatrique (Cancer chez les enfants).
                    <br>
                    Cliquez sur le lien ci-dessous. Pour chaque don de plus de 20$, un reçu d’impôt vous sera automatiquement émis.
                    <br>
                    PHOTOSF doublera ce montant jusqu’à concurrence de 3000$!
                    <br>
                    <a href="https://dons.charlesbruneau.qc.ca/fr/encouragez/detail/campagne-de-simon-faucher-photographe-inc-photosf-2024-25/4793#don-details" target="_blank">Fondation Charles Bruneau</a>
                    <br>
                </h4>
				<?php switch (!empty($deliveryOption['DeliveryOption']) ? $deliveryOption['DeliveryOption']['method'] : ''):
					case 'school': ?>
						<p><b>Bonjour <?= $this->Session->read('Order.contact.name'); ?>,</b><br>
							Nous avons bien enregistré votre commande. Elle sera retournée à l'école de votre enfant. Si vous avez commandé des copies digitales, vous recevrez un courriel contenant les instructions pour télécharger vos photos lorsqu'elles seront prêtes.
							Si vous avez des questions, vous pouvez nous contacter <em><a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">avec notre formulaire en-ligne</a></em> ou par téléphone au&nbsp;<em><?php echo Configure::read('Contacts.phoneNumber'); ?>.</em><br><br>
							Merci d'avoir pris le temps d'acheter chez&nbsp;nous.
						</p>
						<?php break; ?>
					<?php default: ?>
						<p><b>Bonjour <?= $this->Session->read('Order.contact.name'); ?>,</b><br>
							Nous avons bien enregistré votre commande.<br><br>
                            Si vous avez commandé des copies digitales, vous receverez un courriel contenant les instructions pour télécharger vos photos lorsqu'elles seront prêtes.
							Si vous avez des questions, vous pouvez nous contacter <em><a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">avec notre formulaire en-ligne</a></em> ou par téléphone au&nbsp;<em><?= Configure::read('Contacts.phoneNumber'); ?>.</em><br><br>
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
