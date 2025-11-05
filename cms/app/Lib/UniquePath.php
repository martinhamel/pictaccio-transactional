<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

/**
 * Class UniquePath
 * @deprecated
 */
class UniquePath {
    const _DIRECTORY_COMPONENT_LENGTH = 8;
    const _DIRECTORY_COMPONENT_CHARACTERS = '0123456789';
    const _DIRECTORY_COMPONENT_MODE = 0777;
    const _FILE_SEED_LENGTH = 3;
    const _FILE_SEED_CHARACTERS = '0123456789';
    const _FILE_SEED_SEPARATOR = '-';

    private $_basePath = null;
    private $_directoryComponent = null;

    public function __construct($basePath) {
        $this->_basePath = $basePath;
    }

    /**
     * Create the directory on the filesytem
     */
    public function createDirectoryComponent() {
        mkdir($this->_directoryComponent, self::_DIRECTORY_COMPONENT_MODE, false);
    }

    /**
     * Generate an unused directory name
     */
    public function makeDirectoryComponent() {
        $tentativeFilename = '';

        do {
            $tentativeFilename = $this->_basePath . DS .
                $this->_randomString(self::_DIRECTORY_COMPONENT_LENGTH, self::_DIRECTORY_COMPONENT_CHARACTERS);
        } while (file_exists($tentativeFilename));

        $this->_directoryComponent = $tentativeFilename;
    }

    /**
     * Create a unique filename
     * @param $filename string The file name
     * @param $extension string The extension
     * @return string The unique filename
     */
    public function makeSeededFilename($filename, $extension) {
        $tentativeFilename = '';

        if (empty($this->_directoryComponent)) {
            $this->makeDirectoryComponent();
            $this->createDirectoryComponent();
        }

        do {
            $tentativeFilename = $this->_directoryComponent . DS . $filename . self::_FILE_SEED_SEPARATOR .
                $this->_randomString(self::_FILE_SEED_LENGTH, self::_FILE_SEED_CHARACTERS) . '.' . $extension;
        } while (file_exists($tentativeFilename));

        return $tentativeFilename;
    }


    /* PRIVATE */
    private function _randomString($length, $allowedCharacters) {
        $str = '';
        $allowedCharactersLength = strlen($allowedCharacters) - 1;
        while ($length--) {
            $str .= $allowedCharacters[rand(0, $allowedCharactersLength)];
        }

        return $str;
    }
}
