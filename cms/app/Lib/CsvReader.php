<?php


App::uses('Stream', 'Lib' . DS . 'Streams');

class CsvReader {
    private $_defaults = [
        'hasHeader' => false,
        'separator' => ',',
        'newline' => '/n',
        'delimiter' => '"'
    ];
    private $_header = [];
    private $_options = null;
    //private $_rows = array();
    private $_stream = null;

    public function __destruct() {
        $this->close();
    }

    public static function create($csv = null, $options = []) {
        $reader = new CsvReader();

        if (is_array($csv) || is_object($csv) || is_numeric($csv)) {
            throw new InvalidArgumentException('Input is not csv');
        }
        if (!empty($csv)) {
            $reader->read(Stream::create($csv), $options);
        }

        return $reader;
    }

    public function close() {
        if (!empty($this->_stream)) {
            $this->_stream->close();
        }
    }

    public function parseAll() {
        $all = [];
        while (!$this->_stream->endOfStream()) {
            if ($row = $this->parseRow()) {
                $all[] = $row;
            }
        }

        return $all;
    }

    public function parseRow() {
        $line = null;
        do {
            if ($this->_stream->endOfStream()) {
                return false;
            }

            $line = $this->_stream->readLine();
        } while (empty($line));

        return $this->_parseLine(trim($line));
    }

    public function read(StreamInterface $stream, $options = []) {
        $this->_stream = $stream->cursor(0);
        $this->setOptions($options);
        $this->_prepareHeader();
    }

    public function rows() {
        while ($row = $this->parseRow()) {
            yield $row;
        }
    }

    public function setOptions($options) {
        $this->_options = array_merge($this->_options ?: $this->_defaults, $options);
        /*$this->_stream->setOptions(array(
            'newline' => $this->_options['newline']
        ));*/
    }


    /* PRIVATE */
    private function _parseLine($line) {
        $findingCellBegin = false;
        $adding = false;
        $memory = '';
        $potentialCells = array_reverse(explode($this->_options['separator'], $line));
        $headerPointer = count($potentialCells) - 1;
        $row = [];
        foreach ($potentialCells as $potentialCell) {
            if (!$findingCellBegin) {
                $findingCellBegin = substr($potentialCell, -1) === $this->_options['delimiter'];
                $adding = !$findingCellBegin;
                $memory = $potentialCell;
            } else{
                $memory = $potentialCell . $this->_options['separator'] . $memory;
            }

            if (isset($potentialCell[0]) && $potentialCell[0] === $this->_options['delimiter']) {
                if ($findingCellBegin) {
                    $memory = trim($memory, $this->_options['delimiter']);
                    $adding = true;
                    $findingCellBegin = false;
                } else{
                    throw new ErrorException('CsvReader | Unexpected cell delimiter');
                }
            }

            if ($adding) {
                $adding = false;
                array_unshift($row, $memory);
                --$headerPointer;
            }
        }

        return array_combine(array_merge($this->_header, array_keys(array_pad([], count($row) - count($this->_header), null))), $row);
    }

    private function _prepareHeader() {
        if ($this->_options['hasHeader']) {
            $i = 0;
            foreach ($this->_parseLine($this->_stream->readLine()) as $column) {
                $this->_header[$i++] = $column;
            }
        } else{
            $count = count($this->_parseLine($this->_stream->readLine()));
            for ($i = 0; $i < $count; ++$i) {
                $this->_header[$i] = $i;
            }
            $this->_stream->cursor(0);
        }
    }
}
