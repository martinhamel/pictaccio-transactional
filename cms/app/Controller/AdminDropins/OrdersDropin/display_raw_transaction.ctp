<style type="text/css"><?php include 'style.inc.css'; ?></style>

<?php
function recurseRawFields($rawFields) {
    ?>
    <ul><?php
    foreach ($rawFields as $name => $value) {
        if (is_array($value)) { ?>
            <li><b><?= $name; ?>: </b><?php
            recurseRawFields($value); ?>
            </li><?php
        } else{ ?>
            <li><b><?= $name; ?>: </b><?= is_bool($value) ? ($value ? 'true' : 'false') : $value; ?></li><?php
        }
    }
    ?></ul><?php
}

recurseRawFields($rawFields);

