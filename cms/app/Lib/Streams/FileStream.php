<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('StreamInterface', 'Lib' . DS . 'Streams');
App::uses('Stream', 'Lib' . DS . 'Streams');
App::uses('Path', 'Lib');
App::uses('CakeLog', 'Log');

class FileStream extends Stream implements StreamInterface {
    const _URL_REGEX = '/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i';
    private $_file = null;
    private $_stats = null;

    public function __destruct() {
        $this->close();
    }

    public static function canBind($ref) {
        return is_string($ref) ? Path::exist($ref) : false;
    }

    public static function create($ref = '', $options = []) {
        $stream = new FileStream();
        if (!empty($ref)) {
            if (!$stream->open($ref, $options)) {
                throw new IoException('Cannot open file stream.' . (!Path::exist($ref) ? " File '{$ref}' cannot be found.'" : ''));
            }
        }
        return $stream;
    }

    public function bound() {
        return $this->_file !== null;
    }

    public function close() {
        if (is_resource($this->_file)) {
            fclose($this->_file);
        }
        $this->_file = null;
        return $this;
    }

    public function cursor($offset = null, $relative = false) {
        if ($offset !== null) {
            fseek($this->_file, $offset, $relative ? SEEK_CUR : ($offset < 0 ? SEEK_END : SEEK_SET));
        } else{
            return ftell($this->_file);
        }
        return $this;
    }

    public function endOfStream() {
        return feof($this->_file) || ftell($this->_file) > $this->_stats['size'];
    }

    public function lines() {
        $this->_assessStreamAndThrow();

        while ($line = fgets($this->_file)) {
            yield trim($line);
        }
    }

    public function open($ref, $options = []) {
        $this->close();

        if (is_string($ref) && !$this->_isUrl($ref)) {
            $this->setOptions($options);
            $this->_file = @fopen($ref, $this->_makeOpenModeString());

            if ($this->_file) {
                $this->_stats = fstat($this->_file);
            }
        }
        return !empty($this->_file);
    }

    public function read($bytes = null) {
        $this->_assessStreamAndThrow();
        return fread($this->_file, $bytes ?: $this->_stats['size'] - $this->cursor() + 1);
    }

    public function readLine() {
        $this->_assessStreamAndThrow();

        $line = utf8_encode(fgets($this->_file));
        $this->_cursor = ftell($this->_file);
        return $line ? trim($line) : null;
    }


    /* PRIVATE */
    private function _isUrl($ref) {
        return preg_match(self::_URL_REGEX, $ref) === 1;
    }

    private function _makeOpenModeString() {
        $map = ['r' => 'r', 'rw' => 'r+', 'w' => 'w', 'wt' => 'w+', 'a' => 'a', 'rwa' => 'a+'];
        $mode = (!empty($this->_openOptions['read']) ? 'r' : '') . (!empty($this->_openOptions['write']) ? 'w' : '') .
            (!empty($this->_openOptions['append'] ? 'a' : '')) . (!empty($this->_openOptions['truncate'] ? 't' : ''));
        if (!isset($map[$mode])) {
            throw new IoException("Invalid open mode '${mode}''");
        }
        return $map[$mode];
    }
}
