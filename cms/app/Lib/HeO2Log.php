<?php

App::uses('CakeSession', 'Model/Datasource');

class HeO2Log {
    private static $s_SCOPES = ['info', 'debug', 'warning', 'error'];
    private static $s_DEFAULT_SCOPE = 'info';

    public static function __callStatic($stream, $args) {
        $indentation = self::_prepareStream($stream);
        $level = self::$s_DEFAULT_SCOPE;

        if (array_search($args[0], self::$s_SCOPES) !== false) {
            $level = $args[0];
            unset($args[0]);
        }
        CakeLog::write(
            $level,
            str_repeat(' ', $indentation) . self::_getTrackId() . call_user_func_array('sprintf', $args),
            $stream);
    }

    public static function write($stream, $level, $message = null) {
        $indentation = self::_prepareStream($stream);

        $args = func_get_args();
        unset($args[0]);
        unset($args[1]);
        if (array_search($level, self::$s_SCOPES) === false) {
            $message = $level;
            $level = self::$s_DEFAULT_SCOPE;
        } else{
            unset($args[2]);
        }

        CakeLog::write(
            $level,
            str_repeat(' ', $indentation) . self::_getTrackId() . vsprintf($message, $args),
            $stream);
    }

    public static function dump($stream, $obj, $preventNewline = false) {
        self::_prepareStream($stream);
        CakeLog::write(
            $stream,
            self::_formatDump($obj),
            $stream,
            ['skipPrepend' => true, 'skipNewline' => $preventNewline]);
    }


    /* PRIVATE */
    private static function _formatDump($obj) {
        if (is_scalar($obj)) {
            return $obj;
        }

        return json_encode($obj);
    }

    private static function _getTrackId() {
        $trackId = CakeSession::read('Tracking.id');
        return empty($trackId) ? '' :
            "[{$trackId}] ";
    }

    private static function _prepareStream(&$stream) {
        $level = 0;

        if (($pos = strpos($stream, '-')) !== false || ($pos = strpos($stream, '_')) !== false) {
            $level = (int)substr($stream, $pos + 1);
            $stream = substr($stream, 0, $pos);
        }

        if (array_search($stream, CakeLog::levels()) === false) {
            CakeLog::config($stream, [
                'engine' => 'File',
                'types' => self::$s_SCOPES,
                'file' => $stream,
                'scopes' => $stream

            ]);
            CakeLog::levels([$stream], true);
        }

        return $level;
    }
}
