<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<?php $this->append('script_load', "require('grid forms', admin_loaded);"); ?>
<script id="DATA-uploadsTable" type="application/json"><?= $uploads; ?></script>
<?= $this->Html->script('heo2_legacy'); ?>
<script>
    <?php include 'script.inc.js'; ?>
    HeO2.ready(() => {admin_loaded();});
</script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>
<?= $this->Html->css('admin_legacy.css'); ?>

<h2><?= __d('admin-uploaddrop', 'TITLE'); ?></h2>

<section id="action-bar" class="action-bar right">
</section>

<section id="upload-grid" class="db-table">
    <table>
        <?php foreach ($sessionsArray as $session): ?>
            <tr>
                <td>
                    <a class="upload-session-link" data-id="<?= $session['Session']['id']; ?>" data-name="<?= $session['Session']['name_locale']; ?>">
                        <?= __('GENERIC_UPLOAD'); ?>
                    </a>
                </td>
                <td>
                    <a href="<?= $this->Admin->dropinUrl('30413b67-7fc4-479d-b9e7-c290d05d6a07', 'view', [$session['Session']['id']]); ?>"><?= __('GENERIC_VIEW'); ?></a>
                </td>
                <td><?= $session['Session']['date']; ?></td>
                <td><?= $session['Category']['name_locale']; ?></td>
                <td><?= $session['Session']['name_locale']; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
</section>

<div id="upload-overlay" class="admin-form" style="display: none">
    <h3><?= __d('admin-uploaddrop', 'UPLOAD'); ?> - <span id="upload-overlay-title"></span></h3>
    <label id="package-filename-label"></label>
    <div class="right">
        <a id="package-browse-trigger-link"><?= __('GENERIC_BROWSE_FILES'); ?></a>
    </div>
    <button id="upload-package-button" class="ui-button float-right group-add"><?= __('GENERIC_UPLOAD'); ?></button>
</div>
<div id="progress"></div>


