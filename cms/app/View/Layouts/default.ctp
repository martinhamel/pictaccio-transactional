<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset(); ?>
    <title><?= $title_for_layout; ?></title>
    <meta name="description" content="<?= __('GENERIC_META_DESCRIPTION'); ?>">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>

    <script>
        var serverUrl = '<?= substr($this->Html->url('/', true), -2) === '//' ? substr($this->Html->url('/', true), 0, -1) : $this->Html->url('/', true); ?>';
    </script>

    <?= $this->Html->script("jquery.js?{$buildString}", ['fullBase' => true]);?>
    <script>
        jQuery(function() {
            // Check for safari 9 and under
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                if (/constructor/i.test(window.HTMLElement)) {
                    var element = document.querySelector('.layout-browser-warning-safari-9');
                    element.classList.add('show');
                }
            }
        });
    </script>

    <?= $this->Html->script("heo2.js?{$buildString}", ['fullBase' => true]); ?>
    <script>
        jQuery(function() {
            // Check for safari 9 and under
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                if (/constructor/i.test(window.HTMLElement)) {
                    var element = document.querySelector('.layout-browser-warning-safari-9');
                    element.classList.add('show');
                    alert('test');
                }
            }

            HeO2.config.load(serverUrl + 'exports/config.json').success(() => {
                jQuery.i18n().load(
                        serverUrl + 'exports/locale/' +
                        HeO2.config.read('Config.language') +
                        '<?php echo $this->fetch('include_admin_strings') ?>' + '.json', 'en')
                    .done(() => {
                        HeO2.__sendReady();
                    });
                //HeO2.config.read('Config.language').substr(0, 2));

            })
        });
    </script>

    <link href="/favicon.ico?<?= $buildString; ?>" type="image/x-icon" rel="icon" />
    <link href="/favicon.ico?<?= $buildString; ?>" type="image/x-icon" rel="shortcut icon" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <style>
        :root {
            --customization-color-accent: <?= Configure::read('Customizations.colors.accent'); ?>;
        }
    </style>

    <?php
    echo $this->Html->css(["app.css?{$buildString}", "font-awesome5.css?{$buildString}"], ['fullBase' => true]);
    echo $this->fetch('css');
    echo $this->fetch('script');
    ?>
</head>
<body>

<?php if (isset($siteShutdown) && $siteShutdown): ?>
    <div style="display: inline-block; position: fixed; top: 0; left: 0; width: 82px; height: 25px; background: red; opacity: .6; z-index: 100000000; padding: 5px; color: white">
        Shutdown
    </div>
<?php endif; ?>

<div class="layout-browser-warning-safari-9">
    <?= __('MESSAGE_SAFARI_9'); ?>
</div>

<div class="page-container">
    <header class="header-nav">
        <nav class="nav-header-mobile">
            <?php $pub = Configure::read('Directories.transacExtraPub'); ?>
            <?= $this->Html->image("/{$pub}/logo.png", ['class' => 'header-logo', 'fullBase' => true]); ?>
        </nav>
    </header>

    <?php if ($hadNoLanguage): ?>
        <dialog id="dialog-locale-selection">
            <div class="dialog-locale-selection-title">
                <h2><?= __('GENERIC_SELECT_LANGUAGE'); ?></h2>
            </div>
            <form class="dialog-locale-selection-content" method="GET">
                <button class="small-btn" value="en" name="lang" <?php if (CakeSession::read('Config.language') === 'en'): ?> formmethod="dialog" <?php endif; ?>>English (Canada)</button>
                <button class="small-btn" value="fr" name="lang" <?php if (CakeSession::read('Config.language') === 'fr'): ?> formmethod="dialog" <?php endif; ?>>Fran&ccedil;ais (Canada)</button>
            </form>
        </dialog>
        <script>
            document.getElementById('dialog-locale-selection').showModal();
        </script>
    <?php endif; ?>

    <section id="content">
        <div id="flash">
            <?= $this->Session->flash(); ?>
        </div>
        <div id="content-inner">
            <?= $this->fetch('content'); ?>
        </div>
    </section>

    <footer id="footer" class="footer">
        <div class="footer-columns">
            <div class="footer-contact-us">
                <h3><?= __('GENERIC_CONTACT_US');?></h3>
                <p class="footer-phone"><?= Configure::read('Contacts.phoneNumber'); ?></p>
                <p class="footer-address-1"><?= Configure::read('Contacts.addressLine1'); ?></p>
                <p class="footer-address-2"><?= Configure::read('Contacts.addressLine2'); ?></p>
                <p class="footer-address-3"><?= Configure::read('Contacts.city'); ?>&nbsp;&nbsp;<?= strtoupper(Configure::read('Contacts.region')); ?>&nbsp;&nbsp;<?= Configure::read('Contacts.postalCode'); ?></p>
                <p class="footer-address-3"><?= ucwords(Configure::read('Contacts.country')); ?></p>
                <p class="footer-contact-us-link">
                    <a href="<?= $this->Html->url(Configure::read('URL.contactUs')); ?>">
                        <?= __('GENERIC_CONTACT_US');?>
                    </a>
                </p>
            </div>
            <div class="footer-terms-and-conditions">
                <a href="<?= $this->Html->url(Configure::read('URL.termsAndConditions')); ?>">
                    <?= __('NAVIGATION_TERMS_AND_CONDITIONS');?>
                </a>
            </div>
            <div class="footer-accessibility">
                <h3><?= __('GENERIC_SELECT_LANGUAGE'); ?></h3>
                <div class="lang-link">
                    <a rel="nofollow" hreflang="<?= CakeSession::read('Config.language') === 'fr' ? 'fr' : 'en'; ?>" href="?lang=<?= CakeSession::read('Config.language') === 'fr' ? 'en' : 'fr'; ?>">
                        <?= CakeSession::read('Config.language') === 'fr' ? 'English' : 'Fran&ccedil;ais'; ?>
                    </a>
                </div>
            </div>
        </div>
        <div id="copyright" class="copyright">
            <p><?= __('GENERIC_COPYRIGHT', date('Y')); ?></p>
        </div>
    </footer>
</div>
<div id="__breakpoint-observer"></div>
</body>
</html>
