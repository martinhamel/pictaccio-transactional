<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

const FILE_EXE_PATH = '/usr/bin/file'; //ROOT . 'lib/vendors/file';
const MIME_REGEX = '/^(?:archive|audio|video|document|flash|image|text|script)\/(?:\*|[a-z0-9_\-.+]*)$/i';
const FILE_CAPTURE_REGEX = '/^.*?:(.*?),/i';

class MimeChecker {
    private static $_catalog = [
        'archive' => [
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'exe' => 'application/x-msdownload',
            'msi' => 'application/x-msdownload',
            'cab' => 'application/vnd.ms-cab-compressed'
        ],

        'audio/video' => [
            'mp3' => 'audio/mpeg',
            'qt' => 'video/quicktime',
            'mov' => 'video/quicktime',
            'flv' => 'video/x-flv',
        ],

        'document' => [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'rtf' => 'application/rtf',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',
            'docx' => 'application/msword',
            'xlsx' => 'application/vnd.ms-excel',
            'pptx' => 'application/vnd.ms-powerpoint',
            'odt' => 'application/vnd.oasis.opendocument.text',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        ],

        'flash' => [
            'swf' => 'application/x-shockwave-flash',
        ],

        'image' => [
            'png' => 'image/png',
            'jpe' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'jpg' => 'image/jpeg',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'ico' => 'image/vnd.microsoft.icon',
            'tiff' => 'image/tiff',
            'tif' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'svgz' => 'image/svg+xml',
            'psd' => 'image/vnd.adobe.photoshop',
        ],

        'text' => [
            'txt' => 'text/plain',
            'htm' => 'text/html',
            'html' => 'text/html',
            'php' => 'text/html',
            'css' => 'text/css',
            'js' => 'text/javascript',
            'json' => 'application/json',
            'xml' => 'application/xml',
        ],

        'script' => [
            'js' => 'text/javascript',
            'php' => 'text/html',
        ],
    ];
    private static $_fileTypeOutput = [
        'PNG image data' => ['ext' => 'png', 'type' => 'image', 'mime' => 'image/png'],
        'JPEG image data' => ['ext' => 'jpeg', 'type' => 'image', 'mime' => 'image/jpeg'],
        'GIF image data' => ['ext' => 'gif', 'type' => 'image', 'mime' => 'image/gif'],
        'SVG Scalable Vector Graphics image' => ['ext' => 'svg', 'type' => 'image', 'mime' => 'image/svg+xml']
    ];


    /**
     * Determine whether __$ext__ is is mime type __$mime__
     * @param $ext string The extension to check
     * @param $mime string The mime type to test against
     * @return bool|null Return a bool to indicate if __$ext__ is of __$mime__. Returns **null** is the extension is unknown.
     */
    public static function extIs($ext, $mime) {
        foreach (self::$_catalog as $item) {
            if (isset($item[$ext])) {
                return $item[$ext] === $mime;
            }
        }

        return null;
    }


    /**
     * Autodetect file mime type.
     * @param $file string The file to check
     * @parem $mime string Optional. If set, returns a boolean indicating whether the file match the mime
     * @return bool If $mime is set returns a boolean whether $file matches $mime otherwise returns a mime as a string or null if not found
     */
    public static function fileAutodetect($file, $mime) {
        preg_match(FILE_CAPTURE_REGEX, shell_exec(FILE_EXE_PATH . ' ' . $file), $matches);
        $info = self::$_fileTypeOutput[trim($matches[1])];

        if (!empty($mime)) {
            return self::_compareMime($info['mime'], $mime);
        }
        if (empty($info)) {
            return null;
        }

        return $info['mime'];
    }


    /**
     * Determine if __$mime__ is of type __$type__
     * @param $type string The type to check, where type is [archive, audio/video, document, flash, image, text, script]
     * @param $mime string the mime to test __$type__ against
     * @return bool|null Returns a bool to indicate if __$mime__ is of __$type__ or **null** if __$type__ is unknown.
     */
    public static function is($type, $mime) {
        return isset(self::$_catalog[$type]) ?
            array_search($mime, self::$_catalog[$type]) !== false :
            null;
    }

    /**
     * Check whether __$mime__ is an archive type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isArchive($mime) {
        return self::is('archive', $mime);
    }

    /**
     * Check whether __$mime__ is an audio/video type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isAV($mime) {
        return self::is('audio/video', $mime);
    }

    /**
     * Check whether __$mime__ is an document type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isDocument($mime) {
        return self::is('document', $mime);
    }

    /**
     * Check whether __$mime__ is a flash type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isFlash($mime) {
        return self::is('flash', $mime);
    }

    /**
     * Check whether __$mime__ is an image type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isImage($mime) {
        return substr($mime, 0, 5) === 'image' || self::is('image', $mime);
    }

    /**
     * Check whether __$mime__ is a text type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isText($mime) {
        return self::is('text', $mime);
    }

    /**
     * Check whether __$mime__ is a script type
     * @param $mime string
     * @return bool A bool is indicate if the test is true
     */
    public static function isScript($mime) {
        return self::is('script', $mime);
    }


    /* PRIVATE */
    private static function _compareMime($left, $right) {
        if (preg_match(MIME_REGEX, $left) !== 1 || preg_match(MIME_REGEX, $right) !== 1) {
            return false; //throw new RuntimeException('MimeChecker::_compareMime: Invalid mime');
        }

        $leftParts = explode('/', $left);
        $rightParts = explode('/', $right);

        return $leftParts[0] === $rightParts[0] &&
               $leftParts[1] === '*' || $rightParts[1] === '*' || $leftParts[1] === $rightParts[1];
    }
}
