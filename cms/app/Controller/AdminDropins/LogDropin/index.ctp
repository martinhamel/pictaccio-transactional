<section>
    <h2><?= __d('admin-logdrop', 'TITLE'); ?></h2>
    <ul>
        <?php foreach ($logs as $log): ?>
            <li>
                <a href="<?= $this->Admin->dropinUrl('45c45e6b-b763-4802-a403-8392f7d94d83', 'view', [$log]); ?>"><?= $log ?></a>
            </li>
        <?php endforeach; ?>
    </ul>
</section>
