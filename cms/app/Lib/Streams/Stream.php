<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('StreamInterface', 'Lib' . DS . 'Streams');
App::uses('FileStream', 'Lib' . DS . 'Streams');
App::uses('StringStream', 'Lib' . DS . 'Streams');

abstract class Stream {
    protected $_defaults = [
        'read' => true,
        'write' => false,
        'append' => false,
        'truncate' => false,
        'newline' => "\n"
    ];
    protected $_openOptions = null;

    public function consume($callable, $ref = null, $options = []) {
        if ($this->bound() || $ref && $this->open($ref, $options)) {
            try {
                $callable($this);
            } catch (Exception $e) {
                CakeLog::write(get_class($e), $e->getMessage());
            } finally {
                $this->close();
            }
        }

        return $this;
    }

    public static function create($ref, $options = []) {
        if (FileStream::canBind($ref)) {
            return FileStream::create($ref, $options);
        }

        return StringStream::create($ref, $options);
    }

    public function setOptions($options) {
        $this->_openOptions = array_merge($this->_openOptions ?: $this->_defaults, $options);
    }

    /* PROTECTED */
    protected function _assessStreamAndThrow() {
        if (!$this->bound()) {
            throw new IoException('Attempting to access an unbound stream');
        }
    }
}
