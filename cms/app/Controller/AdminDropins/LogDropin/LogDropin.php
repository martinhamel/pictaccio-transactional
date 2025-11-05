<?php

App::uses('Path', 'Lib');
App::uses('Stream', 'Lib' . DS . 'Streams');

class LogDropin extends AdminDropin {
    public function index() {
        $logs = [];

        $logFolderHandle = opendir(Path::join(APP, 'tmp', 'logs'));
        while ($file = readdir($logFolderHandle)) {
            if ($file !== '.' && $file !== '..' && $file !== 'empty') {
                $logs[] = $file;
            }
        }

        $this->_set('logs', $logs);
    }

    public function view($logFile) {
        $logPath = Path::join(APP, 'tmp', 'logs', $logFile);
        if (!Path::exist($logPath)) {
            throw new NotFoundException("Can't find log file {$logFile}");
        }

        $log = $this->_parseLog($logPath);

        $this->_set('logFile', $logFile);
        $this->_set('raw', $log['raw']);
        $this->_set('parsed', $log['parsed']);
    }


    /* PRIVATE */
    private function _isStartWithDate($line) {
        return preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/', $line, $matches) ?
            $matches[0] :
            false;
    }

    private function _parseClass($line) {
        return preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w*: *\[*\d*\]* \[(\w+)\]/', $line, $matches) ?
            (int)$matches[1] :
            null;
    }

    private function _parseLog($logFile) {
        $raw = '';
        $parsed = [];
        Stream::create($logFile)->consume(function ($file) use (&$raw, &$parsed) {
            foreach ($file->lines() as $line) {
                $raw .= "{$line}\n";
                $item = ['raw' => $line];

                $date = $this->_isStartWithDate($line);
                if ($date) {
                    $item['content'] = 'line';
                    $item['date'] = $date;
                    $item['type'] = $this->_parseType($line);
                    $item['trackId'] = $this->_parseTrackId($line);
                    $item['class'] = $this->_parseClass($line);
                    $item['note'] = $this->_parseNote($line);
                } else{
                    $item['content'] = 'continuation';
                }

                $parsed[] = $item;
            }
        });

        return [
            'raw' => $raw,
            'parsed' => $parsed
        ];
    }

    private function _parseNote($line) {
        return preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w*: *\[\d*\]* *\[*\w*\]* {0,1}(.+)$/', $line, $matches) ?
            $matches[1] :
            (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w*: {0,1}(.+)/', $line, $matches) ?
                $matches[1] :
                null);
    }

    private function _parseType($line) {
        preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (\w*):/', $line, $matches);
        return $matches[1];
    }

    private function _parseTrackId($line) {
        return preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w*: *\[(\d+)]/', $line, $matches) ?
            (int)$matches[1] :
            null;
    }
}
