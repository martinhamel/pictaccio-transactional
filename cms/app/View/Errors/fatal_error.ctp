<h2><?= __d('cake_dev', 'Fatal Error'); ?></h2>
<p class="error">
        <strong><?= __d('cake_dev', 'Error'); ?>: </strong>
        <?= h($error->getMessage()); ?>
        <br>

        <strong><?= __d('cake_dev', 'File'); ?>: </strong>
        <?= h($error->getFile()); ?>
        <br>

        <strong><?= __d('cake_dev', 'Line'); ?>: </strong>
        <?= h($error->getLine()); ?>
</p>
