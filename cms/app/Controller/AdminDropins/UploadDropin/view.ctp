<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<style type="text/css"><?php include 'style.inc.css'; ?></style>

<?php foreach ($groups as $group): ?>
    <div class="group">
        <div class="float-left subject-info">
            <span class="label">Picture Id:</span> #<?= $group['GroupPicture']['id']; ?><br/>
            <span class="label">Session Id:</span> #<?= $group['GroupPicture']['session_id']; ?> <br/>
            <span class="label">Group:</span> <?= $group['GroupPicture']['group']; ?>
        </div>
        <div class="float-left subject-pictures">
            <?php foreach ($group['GroupPicture']['pictures_json'] as $picture): ?>
                <?= $this->Html->image('/' . $picture, ['class' => 'picture']); ?>
            <?php endforeach; ?>
        </div>
    </div>
<?php endforeach; ?>

<?php foreach ($subjects as $subject): ?>
    <div class="subject">
        <div class="float-left subject-info">
            <span class="label">Picture Id:</span> #<?= $subject['Picture']['id']; ?><br/>
            <span class="label">Session Id:</span> #<?= $subject['Picture']['session_id']; ?> <br/>
            <span class="label">Code:</span> <?= $subject['Picture']['code']; ?><br/>
            <?php if (!empty($subject['Picture']['subject_json'])): ?>
                <?php foreach ($subject['Picture']['subject_json'] as $header => $info): ?>
                    <?= "<span class='label'>{$header}:</span> {$info}"; ?><br/>
                <?php endforeach; ?>
            <?php endif; ?>
            <a href="<?= $this->Admin->dropinUrl('30413b67-7fc4-479d-b9e7-c290d05d6a07', 'track', [$subject['Picture']['id']]); ?>"><?= __d('admin-uploaddrop', 'TRACK'); ?></a>
        </div>
        <div class="float-left subject-pictures">
            <?php foreach ($subject['Picture']['pictures_json'] as $picture): ?>
                <?= $this->Html->image('/' . $picture, ['class' => 'picture']); ?>
            <?php endforeach; ?>
        </div>
    </div>
<?php endforeach; ?>

<script>
    function admin_loaded() {
    }
</script>
