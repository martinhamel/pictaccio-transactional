<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

$this->Html->script('https://www.google.com/recaptcha/api.js?hl=fr', ['inline' => false]);
$this->Html->script('home.js', ['inline' => false]);
$this->append('script_load', "require('effects home');");
$this->set('title_for_layout', 'Photo SF');
?>
<section id="home">
    <?php if ($promoShipping['enabled']): ?>
        <?php
            $promoDisplay = $promoShipping['amount'];
            if(fmod($promoDisplay, 1) !== 0.00) {
                $promoDisplay = number_format($promoShipping['amount'], 2);
            };
        ?>
        <label id="announcement-banner" class="banner middle-overlay visible"><?= __('ORDERAPP_CART_ANNOUNCEMENT', $promoDisplay); ?></label>
    <?php endif; ?>
    <section id="carousel" class="carousel">
        <div class="enter-internet-code">
            <h1>Qualité et professionnalisme à portée de&nbsp;main</h1>

            <div class="student-code-input-container">
                <input id="student-code" name="student-code" data-heo2-name="student-code" data-heo2-attach="@keyup:_studentCode_keyup" placeholder="entrez votre code ici">
                <span class="feedback" data-heo2-ui="label" data-heo2-name="student-name"></span>
            </div>

            <div id="missing-code" class="missing-code">
                <span><?= __('ORDERAPP_MISSING_CODE_TIME'); ?></span>
            </div>

            <button id="student-code-add-button" class="btn-accent" data-heo2-attach="@click:_addStudentCode_click" disabled>Commencer votre commande<span class="fine">&nbsp;</span>!</button>
            <div class="missing-code-link">
                <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'code_request']); ?>"><?= __('ORDERAPP_CODE_REQUEST'); ?></a>
            </div>
            <div class="faq-link">
                    <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'faq']); ?>">
                        <?= __('GENERIC_FAQ_QUESTIONS'); ?>
                    </a>
            </div>
        </div>
        <div class="terms">
            <span><?= __('ORDERAPP_TERMS_AND_CONDITIONS', $this->Html->url(['controller' => 'pages', 'action' => 'terms_and_conditions'])); ?></span>
        </div>
        <div class="gradient"></div>
        <div class="arrow-down" data-heo2-attach="@click:_downArrow_click">
            <i class="fad fa-angle-double-down"></i>
        </div>
    </section>
    <section id="hero-line" class="hero-line">
        <h2>Gardez des souvenirs extraordinaires de vos&nbsp;enfants</h2>
        <p>Les photographes professionnels de l’équipe de PhotoSF se donnent pour mission d’offrir des souvenirs photographiques originaux et de qualité pour chaque étape de la vie de vos enfants, vous permettant ainsi de chérir des moments extraordinaires à tout&nbsp;jamais.</p>
        <h3>
            Vous cherchez un service exceptionnel, des poses et des présentations&nbsp;originales<span class="fine">&nbsp;</span>?<br>
            PhotoSF saura répondre à vos attentes et même&nbsp;plus<span class="fine">&nbsp;</span>!
        </h3>
    </section>
    <section id="who-we-are" class="who-we-are" data-parallax="scroll" data-position="top" data-bleed="20" data-naturalWidth="2667" data-naturalHeight="2000" data-iosFix="true" data-image-src="./img/backgrounds/who-we-are.jpg">
        <h2>
            Qui sommes-nous<span class="fine">&nbsp;</span>?
        </h2>
        <p>
            Spécialisés en photographie scolaire et sportive depuis maintenant 16 ans nous sommes toujours là pour&nbsp;innover.
        </p>
        <p>
            Notre travail avec les jeunes vous permet de garder des souvenirs extraordinaires de toutes leurs étapes de&nbsp;développement.
        </p>
        <p>
            Nous sommes des photographes portraitistes et savons mettre les gens à l’aise pour la prise de photo pour des photos&nbsp;naturelles.
            Tous nos photographes reçoivent une formation, ont une grande expérience de la photographie et un bon contact avec les enfants. Ils sont aussi personnellement formés par Simon Faucher, président et photographe depuis plus de 15 ans, et travaillent notamment en équipe afin de déterminer les poses les plus avantageuses, l’optimisation de l’éclairage et la création de nouveaux&nbsp;décors.
        </p>
        <p>
            Les journées sont bien organisées et se déroulent sans encombre et dans la bonne&nbsp;humeur.
        </p>
        <p>
            Nous portons une attention toute particulière à la qualité et la ponctualité des livraisons. Ainsi, nous acceptons un nombre limité d’écoles primaires pour les photos de la&nbsp;rentrée<span class="fine">&nbsp;</span>!
        </p>
        <p class="reserve-with-us-link">
            <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">Réservez tôt avec nous<span class="fine">&nbsp;</span>!</a>
        </p>
        </p>
    </section>
    <section id="services" class="our-services">
        <h2><?= __('GENERIC_OUR_SERVICES'); ?></h2>
        <div class="our-services-links">
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'school')); ?>" class="info">
                <div>
                    <?= $this->Html->image('info_school.jpg'); ?>
                    <h3><?= __('HOME_SCHOOL_PHOTOS'); ?></h3>
                    <p><?= __('HOME_SCHOOL_PHOTOS_TAGLINE'); ?></p>
                </div>
            </a>
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'graduation')); ?>" class="info">
                <div>
                    <?= $this->Html->image('info_graduates.jpg'); ?>
                    <h3><?= __('HOME_GRADUATES_PHOTOS'); ?></h3>
                    <p><?= __('HOME_GRADUATES_PHOTOS_TAGLINE'); ?></p>
                </div>
            </a>
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'daycare')); ?>" class="info">
                <div>
                    <?= $this->Html->image('info_daycare.jpg'); ?>
                    <h3><?= __('HOME_DAYCARE_PHOTOS'); ?></h3>
                    <p><?= __('HOME_DAYCARE_PHOTOS_TAGLINE'); ?></p>
                </div>
            </a>
            <a href="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'sport')); ?>" class="info">
                <div>
                    <?= $this->Html->image('info_sport.jpg'); ?>
                    <h3><?= __('HOME_SPORT_PHOTOS'); ?></h3>
                    <p><?= __('HOME_SPORT_PHOTOS_TAGLINE'); ?></p>
                </div>
            </a>
        </div>
    </section>
    <section id="contact-us" class="contact-us">
        <i class="phone-icon fad fa-phone"></i>
        <h2><?= __('GENERIC_CONTACT_US'); ?></h2>
        <div class="contact-us-form">
            <div class="info">
                <h3><?= __('GENERIC_BY_PHONE'); ?></h3>
                <h4><?= __('GENERIC_MONTREAL'); ?>: <?= Configure::read('Contacts.localNumber'); ?></h4>
                <h4><?= __('GENERIC_TOLLFREE'); ?>: <?= Configure::read('Contacts.phoneNumber'); ?></h4>
                <p><?= __('GENERIC_MSG_CONTACT_US'); ?></p>
            </div>
            <div class="form-fields">
                <form action="<?= $this->Html->url(array('controller' => 'pages', 'action' => 'contact_us')) ?>" method="post">
                    <div>
                        <label for="parent-name"><?= __('GENERIC_PARENT_NAME_LABEL'); ?> *</label>
                        <input type="text" id="first-name" name="parent-name" required>
                    </div>
                    <div>
                        <label for="child-name"><?= __('GENERIC_CHILD_NAME_LABEL'); ?> *</label>
                        <input type="text" id="last-name" name="child-name" required>
                    </div>
                    <div>
                        <label for="email"><?= __('GENERIC_EMAIL_LABEL'); ?> *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div>
                        <label for="phone"><?= __('GENERIC_TEL_LABEL'); ?></label>
                        <input type="text" id="phone" name="phone">
                    </div>
                    <div>
                        <label for="school"><?= __('FORM_SCHOOL'); ?></label>
                        <input type="text" id="school" name="school">
                    </div>
                    <div>
                        <label for="group"><?= __('FORM_GROUP'); ?></label>
                        <input type="text" id="group" name="group">
                    </div>
                    <div>
                        <label for="group"><?= __('FORM_ORDER_ID'); ?></label>
                        <input type="text" id="order-id" name="order-id">
                    </div>
                    <div>
                        <label for="group"><?= __('FORM_INTERNET_CODE'); ?></label>
                        <input type="text" id="internet-code" name="internet-code">
                    </div>
                    <div>
                        <label for="message"><?= __('GENERIC_MESSAGE_LABEL'); ?> *</label>
                        <textarea cols="24" id="message" name="message" rows="5"></textarea>
                    </div>
                    <div>
                    <span>
                        <label><input id="promo" name="promo" type="checkbox" value="promo"/><?= __('FORM_NEWSLETTER'); ?></label>
                    </span>
                    </div>
                    <div class="g-recaptcha" data-sitekey="6LcgCB4UAAAAAG19ImK-lThWJJdkYbAsBIpJWofA"></div>
                    <button class="submit send-your-message" type="submit"><?= __('GENERIC_SEND_YOUR_MESSAGE'); ?></button>
                </form>
            </div>
        </div>
    </section>
</section>

<style>
    body {
        background-color: #2c2b29;
    }

    #content {
        padding-bottom: 0;
    }

    .footer {
        bottom: unset;
    }

    #home .carousel {
        background-image: url('../img/backgrounds/carousel_<?= rand(1, 6); ?>.jpg');
    }

    #content {
        background-color: unset;
    }
</style>
