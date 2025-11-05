<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<?php foreach ($track as $visit): ?>
    <div style="margin-bottom: 3em;">
        <h3>From: <?= $visit['Track']['created']; ?> To: <?= $visit['Track']['modified']; ?></h3>
        Drop step: <?= $visit['Track']['drop_step']; ?><br/>
        Hits:
        <ul style="margin-left: 10px;">
            <?php foreach ($visit['Track']['hits_json'] as $hits): ?>
                <li>At:
                    <ul style="margin-left: 10px;">
                        <?php foreach ($hits as $key => $hit): ?>
                            <?php if ($key === 'postData'): ?>
                                <?php foreach ($hit as $postName => $postVar): ?>
                                    <li>
                                        <strong><?= $postName; ?></strong>: <?= is_array($postVar) ? json_encode($postVar) : $postVar; ?>
                                    </li>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <li>
                                    <strong><?= $key; ?></strong>: <?= $key === 'timestamp' ? $this->Time->format('F jS, Y h:i A', $hit) : $hit; ?>
                                </li>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    </ul>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endforeach; ?>
