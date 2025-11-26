<?php
App::uses('BaseLog', 'Log/Engine');

class ConsoleLog extends BaseLog
{
    public function write($type, $message)
    {
        echo '[' . strtoupper($type) . '] ' . $message . PHP_EOL;
    }
}