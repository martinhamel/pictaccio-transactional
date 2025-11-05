<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('StreamInterface', 'Lib' . DS . 'Streams');
App::uses('Stream', 'Lib' . DS . 'Streams');
App::uses('CakeLog', 'Log');

class StringStream extends Stream implements StreamInterface {
    private $_cursor = 0;
    private $_string = null;
    private $_stringLength = 0;

    public function __destruct() {
        $this->close();
    }

    public static function create($ref = null, $options = []) {
        $stream = new StringStream();
        $stream->open($ref, $options);
        return $stream;
    }

    public static function canBind($ref) {
        return true;
    }

    public function bound() {
        return $this->_string !== null;
    }

    public function close() {
        $this->_string = null;
        $this->_cursor = 0;
        return $this;
    }

    public function cursor($distance = null, $relative = false) {
        if ($distance !== null) {
            if ($relative) {
                $this->_cursor += $distance;
            } else{
                if ($distance < 0) {
                    $this->_cursor = $this->_stringLength + $distance;
                } else{
                    $this->_cursor = $distance;
                }
            }
            if ($this->_cursor < 0) {
                $this->_cursor = 0;
            } else if ($this->_cursor > $this->_stringLength) {
                $this->_cursor = $this->_stringLength;
            }
        } else{
            return $this->_cursor;
        }

        return $this;
    }

    public function endOfStream() {
        return $this->_cursor === $this->_stringLength;
    }

    public function lines() {
        while (!$this->endOfStream()) {
            yield $this->readLine();
        }
    }

    public function open($ref, $options = []) {
        $this->close();
        $this->setOptions($options);

        if ($ref) {
            $this->_string = $this->_toString($ref);
            $this->_stringLength = strlen($this->_string);
        }

        return true;
    }

    public function read($bytes = null) {
        $this->_assessStreamAndThrow();

        $chunk = $bytes || $this->_cursor ?
            substr($this->_string, $this->_cursor, $bytes) :
            $this->_string;
        $this->_cursor += $bytes ?: $this->_stringLength - $bytes;
        return $chunk;
    }

    public function readLine() {
        $this->_assessStreamAndThrow();

        $start = $this->_cursor;
        $strpos = strpos($this->_string, $this->_openOptions['newline'], $this->_cursor);
        $length = $strpos - $start;
        if ($strpos === false) {
            $this->_cursor = $this->_stringLength;
            $length = $this->_stringLength - $start;
        } else{
            $this->_cursor += $length + 1;
        }
        return substr($this->_string, $start, $length ?: $this->_stringLength - $start);
    }


    /* PRIVATE */
    private function _toString($ref) {
        return is_array($ref) ? json_encode($ref) : (string)$ref;
    }
}
