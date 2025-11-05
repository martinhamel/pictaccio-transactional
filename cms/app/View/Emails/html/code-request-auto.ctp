<?php
/*
 * Copyright © 2014-2016, Heliox - All Right Reserved
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
<body style="width: 100% !important;-webkit-text-size-adjust: none;margin: 0;padding: 0;background-color: <?= Configure::read('Customizations.colors.background1'); ?>">
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height: 100% !important;margin: 0;padding: 20px;width: 100% !important;">
    <tr>
        <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="max-width: 600px; background-color: <?= Configure::read('Customizations.colors.background2'); ?>; border-radius: <?= Configure::read('Customizations.decorations.borderRadius'); ?>">
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
                                        <?= __d('emails', 'GREETINGS') . " {$form['parent-name']}"; ?>,
                                    </h3>
                                    <h2 class="h2" style="line-height: 100%;">
                                        <?= __d('emails', 'CODE_REQUESTED'); ?>
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-family: Arial;font-size: 18px;line-height: 100%;min-height: 100px; padding:25px 20px">
                                    <table style="height:100%;width:100%;background-color: <?= Configure::read('Customizations.colors.background3'); ?>;border-radius: <?= Configure::read('Customizations.decorations.borderRadius'); ?>;padding:25px;">
                                        <tr>
                                            <td>
                                                <h2 style="line-height: 100%; width: 100%; text-align: center"><b><?= isset($subjectSearchResult) ? $subjectSearchResult : ''; ?></b></h2>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="width: 100%;border-collapse: collapse;background-color: <?= Configure::read('Customizations.colors.background3'); ?>;font-family: Arial;border-radius: 0 0 <?= Configure::read('Customizations.decorations.borderRadius'); ?> <?= Configure::read('Customizations.decorations.borderRadius'); ?>">
                        <table border="0" cellpadding="0" cellspacing="0" width="700" id="footerContainer" style="margin: 0 auto;">
                            <tr>
                                <td style="font-size: 18px;line-height: 100%;padding: 20px;text-align: center;">
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
                                <td class="copyright" style="border-collapse: collapse;background-color: <?= Configure::read('Customizations.colors.background3'); ?>;color: #202020;font-family: Arial;font-size: 12px;line-height: 100%;padding: 0 20px 20px;text-align: center;">
                                    <?= __d('emails', 'POWERED_BY'); ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
