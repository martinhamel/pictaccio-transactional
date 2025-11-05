<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('UploadedFile', 'Lib');

class TempFiles {
    private $_files = [];

    public function __construct() {
        $this->_createWrappers();
    }

    public function get() {
        return $this->_files;
    }

    /* PRIVATE */
    private function _checkIntegrity($file) {
        if (!is_uploaded_file($file['tmp_name']) && empty($file['unittest'])) {
            throw new ForbiddenException();
        }
    }

    private function _createWrappers() {
        foreach ($_FILES as $key => $file) {
            if ($file['size']) {
                $this->_checkIntegrity($file);
                $this->_files[$key] = new UploadedFile($file);
            }
        }
    }
}
