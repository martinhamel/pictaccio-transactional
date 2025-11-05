<?php
$colors = [
    'Debug' => '#8A9B0F',
    'Info' => '#0B486B',
    'Warning' => '#F6BA0E',
    'Error' => '#FA2A00',
    'placeholder' => '#E97F02' // orange
]
?>

<section>
    <h2><?= $logFile; ?></h2>
    <div>
        <?php foreach ($parsed as $line): ?>
            <?php if ($line['content'] === 'line'): ?>
                <p style="margin: 5px 0 0 0; padding: 0; white-space: nowrap; color: <?= isset($colors[$line['type']]) ? $colors[$line['type']] : $colors['placeholder']; ?>">
                    <span style="display: inline-block; min-width: 155px;"><?= $line['date']; ?></span>
                    <span style="display: inline-block; min-width: 100px;"><?= $line['type']; ?></span>
                    <span style="display: inline-block; min-width: 30px;"><?= $line['trackId']; ?></span>
                    <span style="display: inline-block; min-width: 80px;"><?= $line['class']; ?></span>
                    <span style="white-space: nowrap;"><?=
                        str_replace(' ', '&nbsp;', (
                            str_replace(' ', '&nbsp;&nbsp;&nbsp;&nbsp;', substr($line['note'], 0, strlen($line['note']) - strlen(ltrim($line['note'])))) .
                            ltrim($line['note']))); ?></span>
                </p>
            <?php else: ?>
                <p style="margin: 0 0 0 160px; padding: 0; color: #91908D">
                    <?= $line['raw']; ?>
                </p>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
    <h3 style="margin-top: 50px;">Raw:</h3>
    <pre id="raw" style="font-family: consolas, courier, monospace;"><?= $raw ?></pre>
</section>
