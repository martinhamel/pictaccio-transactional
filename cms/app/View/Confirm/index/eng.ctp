<?php

?>

<section>
	<div class="container">
		<div class="confirmation-msg">
			<div class="confirmation-header">
				<span>Status: <i class="fa fa-check"></i></span>
			</div>
			<?php $apartment = $this->Session->read('Order.contact.apartment') ? '#' . $this->Session->read('Order.contact.apartment') : ''; ?>
			<div class="confirmation-body">
				<h2>Your order number <?= $this->Session->read('Order.id'); ?> is confirmed!</h2>
				<h4>
					Would you like to make a donation to the Charles-Bruneau Foundation? Help research in pediatric hemato-oncology (cancer afflicting kids)
					<br>
					Click on the below link if you wish to participate. For each donation of 20$, we will provide you a tax receipt.
					<br>
					PHOTOSF will double that amount up to a concurrency of 3000$!
					<br>
					<a href="https://dons.charlesbruneau.qc.ca/fr/encouragez/detail/campagne-de-simon-faucher-photographe-inc-photosf-2024-25/4793#don-details" target="_blank">Fondation Charles Bruneau</a>
					<br>
				</h4>
                <?php switch (!empty($deliveryOption['DeliveryOption']) ? $deliveryOption['DeliveryOption']['method'] : ''):
					case 'school': ?>
						<p><b>Hi <?= $this->Session->read('Order.contact.name'); ?>,</b><br>
							We have received your order. We will return it to your child's school. If you ordered digital copies, you will receive an email with the instructions to download your photos when they are ready.
                            If you have questions, do not hesitate to contact us <em><a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">using our online form</a></em> or by phone at&nbsp;<em><?= Configure::read('Contacts.phoneNumber'); ?>.</em><br><br>
							Thank you for your business.
						</p>
						<?php break; ?>
					<?php
					default: ?>
						<p><b>Hi <?= $this->Session->read('Order.contact.name'); ?>,</b><br>
							We have received your order.<br><br>
                            If you ordered digital copies, you will receive an email with the instructions to download your photos when they are ready.
							If you have questions, do not hesitate to contact us either <em><a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">using our online form</a></em> or by phone at&nbsp;<em><?= Configure::read('Contacts.phoneNumber'); ?>.</em><br><br>
							Thank you for your business.
						</p>
				<?php endswitch; ?>
			</div>
		</div>
	</div>

	<script>
		let _hash = "!";
		let noBackPlease = function() {
			window.location.href += "#";

			window.setTimeout(function() {
				window.location.href += "!";
			}, 50);
		};

		window.onhashchange = function() {
			if (window.location.hash !== _hash) {
				window.location.hash = _hash;
			}
		};

		window.onload = function() {
            const ORDERAPP_LOCAL_STORAGE_KEY = 'order'; // Also defined in order_app.js
            localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = null;
			noBackPlease();

			document.body.onkeydown = function(e) {
				let element = e.target.nodeName.toLowerCase();
				if (e.which === 8 && (element !== 'input' && element !== 'textarea')) {
					e.preventDefault();
				}
				e.stopPropagation();
			};
		}
	</script>
</section>
