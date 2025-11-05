<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Path {
    const _DS = '/';
    const _DIRECTORY_COMPONENT_LENGTH = 8;
    const _DIRECTORY_COMPONENT_CHARACTERS = 'abcdefghijklmnipqrstuvwyz0123456789';
    const _DIRECTORY_COMPONENT_MODE = 0777;
    const _FILE_SEED_LENGTH = 18;
    const _FILE_SEED_CHARACTERS = 'abcdefghijklmnipqrstuvwyz0123456789';
    const _FILE_SEED_SEPARATOR = '-';

    /**
     * Resolve a relative path
     * @param $relativePath
     * @return string
     */
    public static function absolute($relativePath) {
        return realpath($relativePath);
    }

    /**
     * Return the folder that contains the file
     * @param $path
     * @return string
     */
    public static function base($path) {
        return mb_substr($path, 0, strrpos($path, DS) + 1);
    }

    /**
     * Return the filename without the extension
     * @param $path
     * @return string
     */
    public static function baseFilename($path) {
        //$path = self::_normalizeSlashes($path);
        $fileName = self::filename($path);
        $dotPosition = strrpos($fileName, '.');
        return mb_substr($fileName, 0, $dotPosition ? $dotPosition : null);
    }

    /** Delete
     * @param $path string Path to delete
     * @param bool $force Whether directory with files should be deleted anyway
     * @return bool Indicate whether the operation was successful
     * @throws ErrorException
     */
    public static function delete($path, $force = false) {
        if (Path::isDirectory($path)) {
            return Path::_deleteDirectory($path, $force);
        } else if (Path::isFile($path)) {
            return unlink($path);
        }
    }

    public static function directoryHasChildren($path) {
        if (Path::isReadable($path)) {
            $handle = opendir($path);
            while (($entry = readdir($handle)) !== false) {
                if ($entry !== "." && $entry !== "..") {
                    return true;
                }
            }
            return false;
        }

        return null;
    }

    /**
     * Check if the path exist
     * @param $path
     * @return bool
     */
    public static function exist($path) {
        return file_exists($path);
    }

    /**
     * Return the extension
     * @param $path
     * @return string
     */
    public static function extension($path) {
        $dotPosition = strrpos($path, '.');
        return $dotPosition ? mb_substr($path, $dotPosition + 1) : '';
    }

    /**
     * Return the filename with the extension
     * @param $path
     * @return string
     */
    public static function filename($path) {
        $slash = strrpos($path, self::_detectSlash($path));
        return mb_substr($path, $slash ? $slash + 1 : 0);
    }

    /** Return all files from a directory that match $pattern
     * @param $pattern string Pattern to match
     * @param $path string Path to search
     * @return array
     */
    public static function filter($pattern, $path = null) {
        return glob(empty($path) ? $pattern : Path::join($path, $pattern));
    }

    /**
     * Return the path of the file the symlink points to
     * @param $link
     * @return string
     */
    public static function follow($link) {
        return readline($link);
    }

    /**
     * Return whether __$path__ is a directory
     * @param $path
     * @return bool
     */
    public static function isDirectory($path, $rejectCurrentParent = false) {
        if ($rejectCurrentParent && (strlen($path) > 2 ? (substr($path, strrpos($path, '/'), 2) === (DS . '.')) : ($path === '.' || $path === '..'))) {
            return false;
        }
        return is_dir($path);
    }

    /**
     * Return whether __$path__ is a file
     * @param $path
     * @return bool
     */
    public static function isFile($path) {
        return !(is_dir($path) || is_link($path));
        return is_file($path);
    }

    /**
     * Return whether __$path__ is a symlink
     * @param $path
     * @return bool
     */
    public static function isLink($path) {
        return is_link($path);
    }

    public static function isReadable($path) {
        return is_readable($path);
    }

    /**
     * Return whether __$path__ is a relative path
     * @param $path
     * @return bool
     */
    public static function isRelative($path) {
        return self::absolute($path) !== $path;
    }

    /**
     * Join directory components to form a proper path
     *
     * Note:
     * The function accepts both an array or a variable number of arguments
     *
     * @param array|string $directories
     * @return string
     */
    public static function join($directories) {
        if (func_num_args() > 1) {
            $directories = func_get_args();
        }

        $path = '';
        foreach ($directories as $directory) {
            if ($directory && $directory[0] === '.' && $directory !== '.' && $directory !== '..') {
                $path = substr($path, 0, -1);
            }
            $path .= (empty($path) ? rtrim($directory, DS) : trim($directory, DS)) . DS;
        }

        return rtrim($path, DS);
    }

    /** Create a directory path
     * @param $directory string Path to create
     * @return string Path to the create directory
     */
    public static function makeDirectory($directory) {
        $components = explode(DS, $directory);
        $path = '';
        foreach ($components as $component) {
            $path .= $component . DS;
            if (!Path::exist($path)) {
                mkdir($path);
            }
        }

        return $path;
    }

    /**
     * Create a unique directory
     * @param $parent string Directory to create a a unique directory into
     * @return string The path to the newly created directory
     */
    public static function makeUniqueDirectory($parent) {
        $tentativeFilename = null;

        do {
            $tentativeFilename = $parent . DS .
                self::_randomString(self::_DIRECTORY_COMPONENT_LENGTH, self::_DIRECTORY_COMPONENT_CHARACTERS);
        } while (Path::exist($tentativeFilename));

        return Path::makeDirectory($tentativeFilename);
    }

    /** Move a file or directory
     * @param $source string Source path
     * @param $destination string Destination path
     * @return bool Indicate whether the operation was successful
     */
    public static function move($source, $destination) {
        try {
            rename($source, $destination);
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * Calculate a relative path to another path
     * @param $to string Target path
     * @param $from Path that __$to__ needs to be relative to. The current working directory is used if **null**
     * @return string The relative path
     */
    public static function relative($to, $from = null) {
        $to = self::_normalizeSlashes($to);
        $from = self::_normalizeSlashes($from);

        $toEndSlash = substr($to, -1, 1) === '\\' || substr($to, -1, 1) === '/';
        if (empty($from)) {
            $from = getcwd();
        }

        if (substr($to, -1, 1) !== '\\' && substr($to, -1, 1) !== '/') {
            $to .= self::_DS;
        }
        if (substr($from, -1, 1) !== '\\' && substr($from, -1, 1) !== '/') {
            $from .= self::_DS;
        }

        $commonParent = self::_findCommonParent($to, $from);

        $to = str_replace($commonParent, '', $to);
        $from = str_replace($commonParent, '', $from);

        return ltrim(self::join(str_repeat('..' . self::_DS, substr_count($from, self::_DS) - 1), $to), self::_DS) . ($toEndSlash ? self::_DS : '');
    }

    public static function uniqueFilename($parent, $postfix = '') {
        $tentativeFilename = null;

        do {
            $tentativeFilename = Path::join($parent, self::_randomString(self::_FILE_SEED_LENGTH) . $postfix);
        } while (Path::exist($tentativeFilename));

        return $tentativeFilename;
    }


    /* PRIVATE */
    private static function _deleteDirectory($path, $force) {
        if (Path::directoryHasChildren($path)) {
            if (!$force) {
                return false;
            }
            Path::_emptyDirectory($path);
        }

        rmdir($path);
        return true;
    }

    private static function _detectSlash($path) {
        if (strpos($path, '/') !== false) {
            return '/';
        }

        return '\\';
    }

    private static function _emptyDirectory($path) {
        $handle = opendir($path);
        while (($entry = readdir($handle)) !== false) {
            if ($entry !== "." && $entry !== "..") {
                $entryPath = Path::join($path, $entry);
                if (Path::isDirectory($entryPath)) {
                    Path::_emptyDirectory($entryPath);
                } else{
                    if (unlink($entryPath) === false) {
                        throw new ErrorException("Path::_emptyDirectory | Cannot delete '{$entryPath}'");
                    }
                }
            }
        }
    }

    private static function _normalizeSlashes($path) {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $path = strtolower($path);
        }
        return str_replace('\\', '/', $path);
    }

    private static function _findCommonParent($path1, $path2) {
        $path2Separators = self::_getDirectorySeparatorPositions($path2);
        $index = count($path2Separators);

        while (isset($path2Separators[--$index])) {
            if (substr($path1, 0, $path2Separators[$index] + 1) == substr($path2, 0, $path2Separators[$index] + 1)) {
                return substr($path2, 0, $path2Separators[$index]);
            }
        }

        return null;
    }

    private static function _getDirectorySeparatorPositions($path) {
        $positions = [];
        $position = 0;
        while (($position = strpos($path, self::_DS, $position + 1)) !== false) {
            $positions[] = $position;
        }

        return $positions;
    }

    private static function _randomString($length) {
        return substr(str_replace('/', '', base64_encode(openssl_random_pseudo_bytes($length * 2))), 0, $length);
    }

}


