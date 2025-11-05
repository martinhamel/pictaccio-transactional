<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */
?>

<style type="text/css"><?php include 'style.inc.css'; ?></style>
<div class="container">
    <form method="get" action="<?= $this->Admin->dropinUrl('37b42d3e-4f49-4255-8709-0f6bcb3fc9fd', 'generate'); ?>">
        <label>chars: <input type="text" name="chars" value="ABCDEGHJKPRTUVWXYZ23465789"></label>
        <label>length: <input type="number" name="length" value="7"></label>
        <label>how-many: <input type="number" name="how-many"></label>
        <label><input type="submit" class="btn-blue"></label>
    </form>
</div>
