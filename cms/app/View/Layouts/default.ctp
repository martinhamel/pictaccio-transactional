<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<!DOCTYPE html>
<html>
<head>
    <!-- <?= $buildInfoString; ?> -->
    <?= $this->Html->charset(); ?>
    <title><?= $title_for_layout; ?></title>
    <meta name="description" content="<?= __('GENERIC_META_DESCRIPTION'); ?>">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>

    <script>
        var serverUrl = '<?= $this->Html->url('/'); ?>';
    </script>

    <?= $this->Html->script("jquery.js?{$buildString}");?>
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

    <?= $this->Html->script("heo2.js?{$buildString}"); ?>
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

    <?php
    echo $this->Html->css(["app.css?{$buildString}", "font-awesome5.css?{$buildString}"]);
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
        <nav class="nav-header-desktop">
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'home', 'private' => false)); ?>">
                <?= $this->Html->image('logo_SF.svg', ['class' => 'header-logo']); ?>
            </a>
            <ul>
                <li>
                    <a href="<?= $this->Html->url(array('controller' => 'order', 'action' => 'index', 'private' => false)); ?>">
                        <?= __('NAVIGATION_ORDER'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#services', 'private' => false]); ?>">
                        <?= __('NAVIGATION_OUR_SERVICES'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">
                        <?= __('NAVIGATION_CONTACT_US'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url('https://simonfaucherphoto.com/v1/'); ?>">
                        <?= __('NAVIGATION_RESERVATION'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'faq']); ?>">
                        <?= __('NAVIGATION_FAQ');?>
                    </a>
                </li>
            </ul>
        </nav>

        <nav class="nav-header-mobile">
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'home', 'private' => false)); ?>">
                <?= $this->Html->image('logo_SF.svg', ['class' => 'header-logo']); ?>
            </a>

            <input type="checkbox" id="menu-state" class="menu-state">
            <label for="menu-state" class="mobile-nav-menu">
                <i class="fas fa-bars"></i>
                <i class="fas fa-times"></i>
            </label>
            <ul class="nav-popup-menu">
                <li>
                    <a href="<?= $this->Html->url(array('controller' => 'order', 'action' => 'index', 'private' => false)); ?>">
                        <?= __('NAVIGATION_ORDER'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#services', 'private' => false]); ?>">
                        <?= __('NAVIGATION_OUR_SERVICES'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">
                        <?= __('NAVIGATION_CONTACT_US'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url('https://simonfaucherphoto.com/v1/'); ?>">
                        <?= __('NAVIGATION_RESERVATION'); ?>
                    </a>
                </li>
                <li>
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'faq']); ?>">
                        <?= __('NAVIGATION_FAQ');?>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="lang-link">
            <a rel="nofollow" hreflang="<?= CakeSession::read('Config.language') === 'fra' ? 'fr' : 'en'; ?>" href="?lang=<?= CakeSession::read('Config.language') === 'fra' ? 'eng' : 'fra'; ?>">
                <?= CakeSession::read('Config.language') === 'fra' ? 'English' : 'Fran&ccedil;ais'; ?>
            </a>
        </div>
    </header>

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
                <p class="footer-address-3"><?= Configure::read('Contacts.addressLine3'); ?></p>
                <p class="footer-contact-us-link">
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">
                        <?= __('NAVIGATION_CONTACT_US'); ?>
                    </a>
                </p>
                <p class="footer-social-media">
                    <a href="https://www.facebook.com/photosf.ca">
                        <i class="fab fa-facebook"></i>
                        <?= __('SOCIAL_FACEBOOK'); ?>
                    </a>
                </p>
            </div>
            <div class="footer-our-services">
                <h3><?= __('GENERIC_OUR_SERVICES');?></h3>
                <ul>
                    <li>
                        <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'daycare']); ?>"><?= __('NAVIGATION_SERVICES_KINDERGARTEN'); ?></a>
                    </li>
                    <li>
                        <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'school']); ?>"><?= __('NAVIGATION_SERVICES_SCHOOL'); ?></a>
                    </li>
                    <li>
                        <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'graduation']); ?>"><?= __('NAVIGATION_SERVICES_GRADUATION'); ?></a>
                    </li>
                    <li>
                        <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'sport']); ?>"><?= __('NAVIGATION_SERVICES_SPORTS'); ?></a>
                    </li>
                </ul>
            </div>
            <div class="footer-our-other-services">
                <h3><?= __('GENERIC_OTHER_SERVICES');?></h3>
                <ul>
                    <li><a href="http://www.simonfaucherphoto.com/">Simon Faucher Photo</a></li>
                </ul>
                <br>
                <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'faq']); ?>">
                    <?= __('NAVIGATION_FAQ');?>
                </a>
            </div>
        </div>
        <div id="copyright" class="copyright">
            <p><?= __('GENERIC_COPYRIGHT', date('Y')); ?></p>
            <p><?= __('ORDERAPP_TERMS_AND_CONDITIONS', $this->Html->url(['controller' => 'pages', 'action' => 'terms_and_conditions'])); ?></p>
            <?php if (Configure::read('BuildInfo.runMode') === 'debug'): ?>
                <p class="build"><?= $buildInfoString; ?></p>
            <?php endif; ?>
        </div>
    </footer>
</div>
<div id="__breakpoint-observer"></div>
<!-- Google tag (gtag.js) -->             <script async src=https://www.googletagmanager.com/gtag/js?id=G-K36N7VZ46V></script>             <script>               window.dataLayer = window.dataLayer || [];               function gtag(){dataLayer.push(arguments);}               gtag('js', new Date());               gtag('config', 'G-K36N7VZ46V');             </script>
</body>
</html>
