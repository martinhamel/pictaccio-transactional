<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */
?>

<?php $this->set('title_for_layout', "Admin - {$categoryName} - {$dropinName}"); ?>

<?php if (!$nodash): ?>
<?php $this->Html->css('admin', array('inline' => false)); ?>
<?php $this->extend('default'); ?>

<div id="admin-container" class="container dark">
	<nav id="admin-nav">
        <div class="color-scheme-toggle">
            <a href="javascript:jQuery('#admin-container').toggleClass('dark');">
                <i class="fa fa-lightbulb-o"></i>
            </a>
        </div>
		<ul class="admin-menu">
		<?php foreach ($dropins as $categoryName => $category): ?>
			<li>
				<span class="category-title"><?= $categoryName; ?></span>
				<ul>
					<?php foreach ($category as $dropin): ?>
						<li <?= $dropin['manifest']['uuid'] === $dropinUuid ? 'class="selected"' : ''; ?>>
							<a href="<?= $this->Admin->dropinUrl($dropin['manifest']['uuid']); ?>">
								<?= $dropin['manifest']['name_locale']; ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</li>
		<?php endforeach;?>
		</ul>
        <div style="height: 30vh"></div>
        <footer class="build-info-footer">
            <ul>
                <li><?= $buildInfoString; ?></li>
                <li>Run Mode: <?= Configure::read('BuildInfo.runMode'); ?> | HeO2 debug level: <?= Configure::read('debug'); ?></li>
            </ul>
        </footer>
	</nav>

	<section id="admin-content">
<?php endif; ?>
			<?= empty($dropin_content) ? $this->fetch('content') : $dropin_content; ?>
<?php if (!$nodash): ?>
	</section>
</div>
<?php endif; ?>

<?php if (!$nodash): ?>
<style>
    #content-inner div.container {
        padding: 0;
        max-width: none;
    }
</style>
<?php endif; ?>
