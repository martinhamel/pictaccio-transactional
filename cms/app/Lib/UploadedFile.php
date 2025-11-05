<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('MimeChecker', 'Lib');

class UploadedFile {
    private $_file = null;

    public function __construct($file) {
        $this->_file = $file;
        $this->_file['saved'] = false;
    }

    public function is($type) {
        return MimeChecker::is($type, $this->_file['type']);
    }

    public function get() {
        return $this->_file;
    }

    public function mimeIs($mime) {
        if (is_array($mime)) {
            return array_search($this->_file['type'], $mime);
        } else if (strpos($mime, '*')) {
            $mime = str_replace('*', '.*?', $mime);
            $mime = str_replace('/', '\/', $mime);
            return preg_match("/$mime/", $this->_file['type']) !== false;
        } else {
            return $mime === $this->_file['type'];
        }
    }

    public function mimeType() {
        return $this->_file['type'];
    }

    public function move($path) {
        $this->_file['path'] = $path;
        $this->_file['saved'] = true;
        if (!move_uploaded_file($this->_file['tmp_name'], $path) && empty($this->_file['unittest'])) {
            throw new ForbiddenException();
        }

        return true;
    }

    public function name() {
        return $this->_file['name'];
    }
}
