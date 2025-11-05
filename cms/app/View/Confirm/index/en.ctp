<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<section class="show-header">
	<div class="container">
		<div class="confirmation-msg">
			<div class="confirmation-header">
				<span>Status: <i class="fa fa-check"></i></span>
			</div>
			<div class="confirmation-body">
				<h2>Your order number <?= $this->Session->read('Order.id'); ?> is confirmed!</h2>
                <?php switch (!empty($deliveryOption['DeliveryOption']) ? $deliveryOption['DeliveryOption']['method'] : ''):
					case 'establishment': ?>
						<p><b>Hi <?= $this->Session->read('Order.contact.first-name'); ?>,</b><br>
							We have received your order. We will return it to the establishment. If you ordered digital copies, you will receive an email with the instructions to download your photos when they are ready.
                            If you have questions, do not hesitate to contact us <a class="underlined" href="<?= Configure::read('URL.contact'); ?>">using our online form</a> or by phone at&nbsp;<b><?= Configure::read('Contacts.phoneNumber'); ?><b>.<br><br>
							Thank you for your business.
						</p>
						<?php break; ?>
					<?php
					default: ?>
						<p><b>Hi <?= $this->Session->read('Order.contact.first-name'); ?>,</b><br>
							We have received your order.<br><br>
                            If you ordered digital copies, you will receive an email with the instructions to download your photos when they are ready.
							If you have questions, do not hesitate to contact us either <a class="underlined" href="<?= Configure::read('URL.contact'); ?>">using our online form</a> or by phone at&nbsp;<b><?= Configure::read('Contacts.phoneNumber'); ?><b>.<br><br>
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
