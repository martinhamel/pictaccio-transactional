<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface StreamInterface {
    public static function create($ref = '', $options = []);

    public static function canBind($ref);

    public function bound();

    public function consume($callable, $ref = null, $options = []);

    public function close();

    public function cursor($offset = null, $relative = false);

    public function endOfStream();

    public function lines();

    public function open($ref, $options = []);

    public function read($bytes = null);

    public function readLine();

    public function setOptions($options);
}
