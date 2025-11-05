<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<!-- Facebook sharing information tags -->
	<meta property="og:title" content="*|MC:SUBJECT|*"/>
	<title>*|MC:SUBJECT|*</title>
</head>
<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="width: 100% !important;-webkit-text-size-adjust: none;margin: 0;padding: 0;background-color: <?= Configure::read('Customizations.colors.background1'); ?>">
<center>
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height: 100% !important;margin: 0;padding: 0;width: 100% !important;background-color: <?= Configure::read('Customizations.colors.background2'); ?>; border-radius: <?= Configure::read('Customizations.decorations.borderRadius'); ?>">
    <tr>
        <td align="left" valign="top" style="border-collapse: collapse;padding:20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="700" id="templateContainer" style="margin: 0 auto;">
                <tr>
                    <td class="headerContent" style="border-collapse: collapse;height: 120px;font-family: Arial;font-size: 34px;font-weight: bold;line-height: 100%;padding: 0;display: flex;align-items: center;">
                        <div class="logo" style="display:flex; flex-direction:column;justify-content:center;margin: 0 auto 0 0;font-size: 60px;text-align: center;font-family: Arial;">
                            <?php $pub = Configure::read('Directories.transacExtraPub'); ?>
                            <?= $this->Html->image("/{$pub}/logo.png", ['class' => 'header-logo', 'fullBase' => true]); ?>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="contenttop" style="border-collapse: collapse;font-family: Arial;font-size: 18px;line-height: 100%;padding: 5px 20px 20px;">
						<h3 class="h3" style="display: block;font-family: Arial;font-size: 26px;font-weight: bold;line-height: 100%;margin-top: 0;margin-right: 0;margin-bottom: 10px;margin-left: 0;text-align: left">
							<?= __d('emails', 'GREETINGS') . " {$contact['first-name']}"; ?>,
						</h3>
						<h2 class="h2" style="line-height: 100%;">
							<?= __d('emails', 'CONFIRM_ORDER'); ?>
						</h2>
                    </td>
                </tr>
                <tr>
                    <td class="shippinginfo" style="line-height: 30px;border-collapse: collapse;font-family: Arial;font-size: 18px;line-height: 100%;text-align: center; padding:0 20px">
                        <div class="info" style="width: 100%;line-height: 14px;border-collapse: collapse;font-family: Arial;font-size: 18px;line-height: 100%;text-align: left;float: left;">
							<h3 class="h3" style="display: block;font-family: Arial;font-size: 26px;font-weight: bold;line-height: 100%;margin-top: 0;margin-right: 0;margin-bottom: 10px;margin-left: 0;text-align: left">
								<?= __d('emails', 'ORDER_DELIVERY_ADDRESS'); ?>
							</h3>
							<?= (empty($contact['street-address-2']) ? '' : "{$contact['street-address-2']} - ") . "{$contact['street-address-1']}"; ?><br/>
							<?= $contact['city']; ?>, <?= $contact['region']; ?>  <?= $contact['postal-code']; ?><br/><br/>
							<?= $contact['phone']; ?><br/>
							<?= $contact['email']; ?><br/>
							<div class="ordernumber" style="width: 100%; text-align: center;vertical-align: bottom;line-height: 100%;border-collapse: collapse;font-family: Arial;font-size: 24px;margin: -10px 0 0 0;">
								<?= __d('emails', 'ORDER_ID', $orderId); ?>
							</div>
						</div>
                    </td>
                </tr>
				<tr>
					<td style="font-family: Arial;font-size: 18px;line-height: 100%;min-height: 100px; padding:25px 20px;">
						<table style="height:100%;width:100%;background-color: <?= Configure::read('Customizations.colors.background3'); ?>;border-radius:30px;padding:25px;">
							<tr>
								<td>
									<h2 style="margin-top: 0;"><?= __d('emails', 'CONFIRM_CART_TITLE'); ?></h2>
								</td>
							</tr>
							<tr>
								<td>
									<div style="float: left;">
										<h3><?= __d('emails', 'CONFIRM_CART_ITEMS'); ?></h3>
									</div>
									<div style="float: right;">
										<h3><?= __d('emails', 'CONFIRM_CART_PRICE'); ?></h3>
									</div>
								</td>
							</tr>
							<?php foreach ($cart as $item): ?>
								<tr>
									<td style="width: 100%;padding:25px 0 0 0;">
										<div style="float: left;">
											<?= $item['productName']; ?>
											<?php if (!empty($item['themeLocale'])): ?>
                                                 &nbsp;-&nbsp;<?= $item['themeLocale'][CakeSession::read('Config.language')]; ?>
                                            <?php endif; ?>
										</div>
										<div style="float: right;">
											<?= $this->Number->currency($item['itemSubtotal']); ?>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<table>
											<tr>
												<td style="width: 120px;">
													<?php $urlProduct = $this->Html->url('/' . ltrim($item['productImage'], '/'), true); ?>
													<img style="height: 100px;" src="<?= $urlProduct; ?>">
												</td>
												<td style="width: auto; margin:15px 15px 0 0;">
													<table>
														<tr>
															<td>
																<?php foreach(array_slice($item['selection'], 0, 4) as $selectionId): ?>
																	<div style="display: inline-block; margin-right: 13px;">
																		<?php
																		$urlImage = $this->Html->url('/' . ltrim($selection[$selectionId]['image']['url'], '/'), true);
																		$urlBackground = !empty($selection[$selectionId]['background']) ? $this->Html->url('/' . ltrim($selection[$selectionId]['background']['url'], '/'), true) : '';
																		if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' && substr($urlImage, 0, 5) !== 'https') {
																			$urlImage = preg_replace('/$http/i', 'https', $urlImage);
																			$urlBackground = preg_replace('/$http/i', 'https', $urlBackground);
																		}
																		?>
																		<img style="height: 100px" src="<?= $urlImage; ?>">
																		<?php if (!empty($selection[$selectionId]['background'])): ?>
																			<img style="height: 80px; position: relative; left: -10px; top: 10px;" src="<?= $urlBackground; ?>" >
																		<?php endif; ?>
																	</div>
																<?php endforeach; ?>
															</td>
														</tr>
													</table>
												</td>
												<td style="width: 50px;">
													<?php if (count($item['selection']) > 4): ?>
														<table>
															<tr>
																<td><div style="display: inline-block; width: 18px; height: 18px; padding: 10px; font-size: 16px; text-align: center; background-color: <?= Configure::read('Customizations.colors.background2'); ?>; border-radius: 100px; transform: translateY(-30px); white-space:nowrap;">+<?= count($item['selection']) - 4; ?></div></td>
															</tr>
														</table>
													<?php endif; ?>
												</td>

											</tr>
										</table>
									</td>
								</tr>

							<?php endforeach; ?>
							<tr>
								<td style="border-collapse: collapse;;font-family: arial;font-size: 18px;line-height: 100%;padding: 20px 20px 5px;">
									<hr>
								</td>
							</tr>
							<tr>
								<td>
									<div style="float: left;">
										<h3 style="margin: 0;"><?= __d('emails', 'CONFIRM_CART_PRODUCT_TOTAL'); ?></h3>
										<h4 style="margin: 0;"><?= __d('emails', 'CONFIRM_CART_SHIPPING'); ?></h4>
										<h4 style="margin: 0;"><?= __d('emails', 'CONFIRM_CART_PROMO'); ?></h4><br/>
										<?php if (substr(Configure::read('Taxes.locality'), 0, 2) === 'ca'): ?>
                                            <?php if (isset($cashRegister->gst)): ?>
                                                <h4 style="margin: 0;"><?= __('TAXES_GST'); ?>
                                                <span style="font-size:12px;font-weight: light;">(<?= Configure::read('Taxes.gstId'); ?>):</span></h4>
                                            <?php endif; ?>
                                            <?php if (isset($cashRegister->qst)): ?>
                                                <h4 style="margin: 0;"><?= __('TAXES_QST'); ?>
                                                <span style="font-size:12px;font-weight: light;">(<?= Configure::read('Taxes.qstId'); ?>):</span></h4>
                                            <?php endif; ?>
                                            <?php if (isset($cashRegister->hst)): ?>
                                                <h4 style="margin: 0;"><?= __('TAXES_HST'); ?>
                                                <span style="font-size:12px;font-weight: light;">(<?= Configure::read('Taxes.hstId'); ?>):</span></h4>
                                            <?php endif; ?>
                                            <?php if (isset($cashRegister->pst)): ?>
                                                <h4 style="margin: 0;"><?= __('TAXES_PST'); ?>
                                                <span style="font-size:12px;font-weight: light;">(<?= Configure::read('Taxes.pstId'); ?>):</span></h4>
                                            <?php endif; ?>
                                        <?php endif; ?>
										<h3 style="color: <?= Configure::read('Customizations.colors.accent'); ?>;margin:10px 0;"><?= __d('emails', 'CONFIRM_CART_TOTAL'); ?></h3>
									</div>
									<div style="float: right;text-align:right;">
										<h3 style="margin: 0;"><?= $this->Number->currency($cashRegister->orderSubtotal); ?></h3>
										<h4 style="margin: 0;"><?= $this->Number->currency($cashRegister->shipping); ?></h4>
										<h4 style="margin: 0;"><?= $this->Number->currency($cashRegister->promo); ?></h4><br/>
										<?php if (substr(Configure::read('Taxes.locality'), 0, 2) === 'ca'): ?>
                                            <?php if (isset($cashRegister->gst)): ?>
                                                <h4 style="margin: 0;"><?= $this->Number->currency($cashRegister->gst); ?></h4>
                                            <?php endif; ?>
                                            <?php if (isset($cashRegister->qst)): ?>
                                                <h4 style="margin: 0;"><?= $this->Number->currency($cashRegister->qst); ?></h4>
                                            <?php endif; ?>
                                            <?php if (isset($cashRegister->hst)): ?>
                                                <h4 style="margin: 0;"><?= $this->Number->currency($cashRegister->hst); ?></h4>
                                            <?php endif; ?>
                                            <?php if (isset($cashRegister->pst)): ?>
                                                <h4 style="margin: 0;"><?= $this->Number->currency($cashRegister->pst); ?></h4>
                                            <?php endif; ?>
                                        <?php endif; ?>
										<h3 style="color: <?= Configure::read('Customizations.colors.accent'); ?>;font-size:26px;margin:10px 0;"><?= $this->Number->currency($cashRegister->total); ?></h3>
									</div>
								</td>
							</tr>
						</table>
					</td>
                </tr>
            </table>
        </td>
    </tr>
	<tr>
		<td style="width: 100%;border-collapse: collapse;background-color: <?= Configure::read('Customizations.colors.background3'); ?>;color: #202020;font-family: Arial;border-radius: 0 0 <?= Configure::read('Customizations.decorations.borderRadius'); ?> <?= Configure::read('Customizations.decorations.borderRadius'); ?>">
			<table border="0" cellpadding="0" cellspacing="0" width="700" id="footerContainer" style="margin: 0 auto;">
				<tr>
					<td style="font-size: 18px;line-height: 100%;padding: 20px 20px 20px;text-align: center;">
						<?= Configure::read('Contacts.addressLine1'); ?><br/>
                        <?php if (Configure::read('Contacts.addressLine2')): ?>
                            <?= Configure::read('Contacts.addressLine2'); ?><br/>
                        <?php endif; ?>
                        <span style="text-transform: capitalize"><?= Configure::read('Contacts.city'); ?></span>,
                        <span style="text-transform: uppercase"><?= Configure::read('Contacts.region'); ?></span>,
                        <span style="text-transform: uppercase"><?= Configure::read('Contacts.postalCode'); ?></span><br/>
                        <span style="text-transform: capitalize"><?= Configure::read('Contacts.country'); ?></span><br/><br/>
                        <?= Configure::read('Contacts.phoneNumber'); ?><br/><br/>
                        <a href="<?= Configure::read('URL.contactUs'); ?>" target="_blank"><?= __d('emails', 'CONTACT_US'); ?></a>
					</td>
				</tr>
				<tr>
					<td style="border-collapse: collapse;background-color: <?= Configure::read('Customizations.colors.background3'); ?>;font-family: Arial;font-size: 16px;line-height: 100%;padding: 20px 20px 20px;text-align: center;">
                        <?= __d('emails', 'POWERED_BY'); ?>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
</center>
</body>
</html>
