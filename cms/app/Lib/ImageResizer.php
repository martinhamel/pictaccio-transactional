<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ImageResizer {
    const _JPEG_QUALITY = 100;
    const _PNG_COMPRESSION = 0;

    /**
     * Resize an image
     * @param $sourceFilename string
     * @param $destinationFilename string
     * @param $destinationWidth integer
     * @param $destinationHeight integer
     * @param $keepAspectRatio bool
     * @param null $format Accept a GD image format type (e.g. IMAGETYPE_*). Only GIF, JPEG and PNG are supported
     * @return bool
     */
    public static function resize($sourceFilename, $destinationFilename, $destinationWidth, $destinationHeight, $keepAspectRatio, $format = null) {
        $source = self::_getImage($sourceFilename);

        if (empty($source)) {
            return false;
        }

        if ($keepAspectRatio) {
            $aspectRatio = $source['width'] / $source['height'];
            $destinationHeight = $destinationWidth / $aspectRatio;
        }

        $destination = self::_createResized($source, $destinationWidth, $destinationHeight);
        self::_save($destination, $destinationFilename, !empty($format) ? $format : $source['format']);

        return true;
    }

    /* PRIVATE */
    private static function _getImage($filename) {
        list($width, $height, $format) = getimagesize($filename);
        $image = null;

        switch ($format) {
        case IMAGETYPE_GIF:
            $image = imagecreatefromgif($filename);
            break;
        case IMAGETYPE_JPEG:
            $image = imagecreatefromjpeg($filename);
            break;
        case IMAGETYPE_PNG:
            $image = imagecreatefrompng($filename);
            break;
        }

        return $image ?
            [
                'width' => $width,
                'height' => $height,
                'format' => $format,
                'image' => $image
            ] :
            null;
    }

    private static function _createResized($source, $destinationWidth, $destinationHeight) {
        $destinationImage = imagecreatetruecolor($destinationWidth, $destinationHeight);
        imagecopyresampled($destinationImage, $source['image'], 0, 0, 0, 0, $destinationWidth, $destinationHeight, $source['width'], $source['height']);
        return $destinationImage;
    }

    private static function _save($image, $destinationFilename, $format) {
        switch ($format) {
        case IMAGETYPE_GIF:
            imagegif($image, $destinationFilename);
            break;
        case IMAGETYPE_JPEG:
            imagejpeg($image, $destinationFilename, self::_JPEG_QUALITY);
            break;
        case IMAGETYPE_PNG:
            imagepng($image, $destinationFilename, self::_PNG_COMPRESSION);
            break;
        }
    }
}
