<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

$this->Html->script('https://www.google.com/recaptcha/api.js', ['inline' => false]);
$this->Html->script('home.js', ['inline' => false]);
$this->append('script_load', "require('effects home heo2_legacy');");
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
            <h1>Quality and professionalism at your&nbsp;fingertips</h1>

            <div class="student-code-input-container">
                <input id="student-code" name="student-code" data-heo2-name="student-code" data-heo2-attach="@keyup:_studentCode_keyup" placeholder="enter your code here">
                <span class="feedback" data-heo2-ui="label" data-heo2-name="student-name"></span>
            </div>

            <div id="missing-code" class="missing-code">
                <span><?= __('ORDERAPP_MISSING_CODE_TIME'); ?></span>
            </div>

            <button id="student-code-add-button" class="btn-accent" data-heo2-attach="@click:_addStudentCode_click" disabled>Start your order</button>
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
        <h2>Keep unforgettable souvenirs of your&nbsp;students</h2>
        <p>Professional photographers from the PhotoSF team dedicate themselves to provide original photographic memories and quality for each stage of your children’s life, allowing you to cherish amazing moments&nbsp;forever.</p>
        <h3>
            Are you looking for an exceptional photographer service and original&nbsp;shots?<br>
            PhotoSF will not only meet your expectations, we'll go&nbsp;beyond!
        </h3>
    </section>
    <section id="who-we-are" class="who-we-are" data-parallax="scroll" data-bleed="20" data-image-src="./img/backgrounds/who-we-are.jpg">
        <h2>
            Who we are
        </h2>
        <p>
            Specialists in school and sports photography for 16 years now we are here to&nbsp;innovate.
        </p>
        <p>
            Our work with your kids allows you to keep a souvenir of their&nbsp;development.
        </p>
        <p>
            We are portraitist photographers with a flair to put our subjects at ease for natural shots.
            All of our photographers are trained by Simon Faucher, president and photograph with more than 15 years of experience, have extensive experience in the industry and know how to connect with children.
            Our team will work their magic to find your most advantageous shots, optimise the lighting and the creation of new&nbsp;sets.
        </p>
        <p>
            We aim to organize our shooting days as efficiently as possible and in good&nbsp;spirits.
        </p>
        <p>
            We pride ourselves on the quality of our work and our ability to deliver on time. Because of this, we can only accept a limited number of primary&nbsp;schools!
        </p>
        <p class="reserve-with-us-link">
            <a href="<?= $this->Html->url(['controller' => 'pages', 'action' => 'home#contact-us', 'private' => false]); ?>">Reserve with us!</a>
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
