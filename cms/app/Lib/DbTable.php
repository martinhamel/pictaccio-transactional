<?php


App::uses('Path', 'Lib');
App::uses('MimeChecker', 'Lib');

const WEBROOT_PATH = APP . DS . WEBROOT_DIR;
const UPLOADED_FILE_PATH = WEBROOT_PATH . DS . 'assets' . DS;
const ALLOWED_FILE_NAME_REGEX = '/^(?=.{2,30})(?!\.\.)[a-z0-9_\-. +\[\]]*$/i';
const DEFAULT_OPTIONS = [
    'allowAdd' => true,
    'allowEdit' => true,
    'allowRemove' => false
];

class DbTable {
    public function __construct($table, $options = []) {
        $this->_table = $table;
        $this->_options = array_merge(DEFAULT_OPTIONS, $options);
    }

    public function process($request) {
        if (!empty($request['__operation'])) {
            if ($request['__operation'] === 'add' && $this->_options['allowAdd']) {
                return $this->_insert($this->_decodeJsonFields($request['fields']));
            } else if ($request['__operation'] === 'edit' && $this->_options['allowEdit'] && !empty($request['fields']['id'])) {
                return $this->_edit($this->_decodeJsonFields($request['fields']));
            }
        }
    }


    /* PRIVATE */
    private function _decodeJsonFields($fields) {
        foreach ($fields as $name => &$field) {
            if (is_string($field) && substr($name, -5) === '_json' ) {
                $field = htmlspecialchars_decode($field);
            }
        }

        return $fields;
    }

    private function _edit($data) {
        $previous = $this->_table->findId($data['id']);

        $this->_table->id = $data['id'];
        unset($data['id']);
        $results = $this->_table->save($this->_sanitizeData($data, $previous));

        return !empty($results) ? $this->_reorderFields($results[$this->_table->name]) : null;
    }

    private function _insert($data) {
        $results = $this->_table->save($this->_sanitizeData($data, null));

        return !empty($results) ? $this->_reorderFields($results[$this->_table->name]) : null;
    }

    private function _reorderFields($row) {
        $orderedRow = [];
        foreach (array_keys($this->_table->getColumnTypes()) as $column) {
            if (isset($row[$column])) {
                $orderedRow[$column] = $row[$column];
            }
        }

        return $orderedRow;
    }

    private function _sanitizeData($data, $previous) {
        $cleanData = [];

        foreach ($this->_table->getColumnTypes() as $column => $type) {
            if (!empty($data[$column])) {
                if (in_array($type, ['integer', 'biginteger'])) {
                    $cleanData[$column] = intval($data[$column]);
                }  else if (isset($this->_table->fileUploads) && array_search($column, array_keys($this->_table->fileUploads)) !== false) {
                    if (is_string($data[$column]) && substr($data[$column], 0, 10) === '___file___') {
                        $filepath = $this->_saveUploadedFile($column);
                        $cleanData[$column] = $filepath ? $filepath : $previous[$this->_table->name][$column];
                    } else if (is_array($data[$column]) && substr($data[$column][0], 0, 10) === '___file___') {
                        $files = [];
                        foreach ($data[$column] as $index => $tagAndId) {
                            $id = substr($tagAndId, 11);
                            $filepath = $this->_saveUploadedFile($column, $index);
                            if ($filepath) {
                                $files[$id] = $filepath;
                            } else {
                                $files[$id] = $previous[$this->_table->name][$column][$id];
                            }
                        }
                        $cleanData[$column] = json_encode($files);
                    }
                } else if (in_array($type, ['float', 'decimal'])) {
                    $cleanData[$column] = floatval($data[$column]);
                } else if ($type === 'text' && substr($column, -5) === '_json') {
                    $cleanData[$column] = is_string($data[$column]) ? $data[$column] : json_encode($data[$column]);
                } else {
                    $cleanData[$column] = $data[$column];
                }
            }
        }

        return $cleanData;
    }

    private function _saveUploadedFile($column, $index = null) {
        $fileIndex = "{$column}_file" . ($index !== null ? "_{$index}" : '');

        if (filesize($_FILES[$fileIndex]['tmp_name']) === 0) { // Edit operation, existing file, do not modify
            return false;
        }

        if (empty($this->_table->fileUploads[$column]) || $this->_table->fileUploads[$column]['allow'] !== true) {
            throw new RuntimeException("DbTable: Attempt to upload file to {$column} and file uploads weren't allowed for that column");
        }
        if (empty($_FILES[$fileIndex])) {
            throw new BadRequestException("DbTable: Expected file upload missing");
        }
        if (!MimeChecker::fileAutodetect($_FILES[$fileIndex]['tmp_name'], $this->_table->fileUploads[$column]['mime'] ?: '*')) {
            throw new RuntimeException('DbTable: Invalid format');
        }
        if (!is_uploaded_file($_FILES[$fileIndex]['tmp_name'])) {
            throw new RuntimeException('DbTable: Something funny happened');
        }
        if (preg_match(ALLOWED_FILE_NAME_REGEX, $_FILES[$fileIndex]['name']) !== 1) {
            throw new RuntimeException('DbTable: Invalid filename chars');
        }

        $persistFilePath = Path::uniqueFilename(UPLOADED_FILE_PATH, '__' . $_FILES[$fileIndex]['name']);
        if (!move_uploaded_file($_FILES[$fileIndex]['tmp_name'], $persistFilePath)) {
            throw new RuntimeException('DbTable: Unable to move uploaded file');
        }

        return ltrim(substr($persistFilePath, strlen(APP . DS . WEBROOT_DIR)), DS);
    }
}
