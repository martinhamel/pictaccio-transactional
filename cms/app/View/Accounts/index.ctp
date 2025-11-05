<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<div class="my-account">
    <div class="menu-container">
        <label class="item-up"><i class="fas fa-user-circle"></i><?= __('USER_MENU_PROFILE'); ?></label>
        <label class="item-up"><i class="fas fa-database"></i><?= __('USER_MENU_CODE_LIBRARY'); ?></label>
        <label class="item-up"><i class="fas fa-cubes"></i><?= __('USER_MENU_ORDER'); ?></label>
        <label class="item-down"><i class="fas fa-cog"></i><?= __('USER_MENU_SETTINGS'); ?></label>
        <label class="item-down"><i class="fas fa-sign-out-alt"></i><?= __('USER_MENU_LOGOUT'); ?></label>
    </div>
    <div class="sections-container">

        <section id="user-profile-section" class="active">
            <h2><?= __('USER_GREETINGS'); ?> <span><?= !empty($user['info_json']['name']) ? $user['info_json']['name'] : '<missing>'; ?></span></h2>
            <h3><?= __('USER_EMAIL'); ?></h3>
            <span><?= $user['email']; ?></span>
            <h3><?= __('USER_EMAIL_VERIFIED'); ?></h3>
            <span><?= $user['verified'] ? __('GENERIC_YES') : __('GENERIC_NO'); ?> <?= !$user['verified'] ? '<a href="javascript;">[' . __('USER_SEND_VERIFICATION_EMAIL') . ']</a>' : ''; ?></span>
            <div>
                <?= $this->Html->link(__('USER_EDIT_INFO_AND_CHANGE_PASS'), ['controller' => 'accounts', 'action' => 'personal']); ?>
            </div>
        </section>

        <section id="user-codes-section" class="">
            <h2><?= __('USER_MY_MANAGE_STUDENT_CODE'); ?></h2>
            <div>
                <h3><?= __('USER_LASTEST_CLAIMED'); ?></h3>
                <table>

                </table>
            </div>
            <div>
                <?= $this->Html->link(__('USER_CLAIM_STUDENT_CODES'), ['controller' => 'accounts', 'action' => 'claim']); ?>
            </div>
        </section>

        <section id="user-order-section" class="">

        </section>

        <section id="user-settings-section" class="">
            
        </section>
    </div>
</div>
