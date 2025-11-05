<?php $keys = array_keys($output[0]);
foreach ($keys as $key) {
    if (is_numeric($key) && !empty($products[$key])) {
        echo "\"",$products[$key]['name_locale'],"\"",',';
    } else {
        echo $key, ',';
    }
}

echo "\n";

foreach ($output as $line) {
    foreach ($line as $cell) {
        echo "\"",$cell,"\"", ',';
    }
    echo "\n";
}