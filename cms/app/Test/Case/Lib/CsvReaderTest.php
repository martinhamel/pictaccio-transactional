<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::Uses('CsvReader', 'Lib');

class CsvReaderTest extends CakeTestCase  {
	private $_sampleCsvNoHeader = "pomme,cerise,poire\npatate,navet,carotte";
	private $_sampleCsvWithHeader = "vegetable,fruit\npatate,pomme\nnavet,cerise\ncarotte,poire";
	private $_sampleSsv = "brocoli;concombre;salade\norange;banane;peche";
	private $_sampleCsvWin = "brocoli,cerise\n\rnavet,carotte";
	private $_sampleCsvMacClassic = "brocoli,cerise\rnavet,carotte";
	private $_sampleCsvWithComma = "\"this sentence, has a comma\",\"this one, has another one\"\n\"just a normal cell\",\"no comma here!\"";
	private $_sampleCsvWithCommaMalformed = "\"this sentence, has a comma\",\"this one, has another one\n\"just a normal cell\",\"no comma here!\"";
	private $_sampleCsvNoHeaderExpected = array(array('pomme', 'cerise', 'poire'), array('patate', 'navet', 'carotte'));
	private $_sampleCsvWithHeaderExpected = array(array('vegetable' => 'patate', 'fruit' => 'pomme'), array('vegetable' => 'navet', 'fruit' => 'cerise'), array('vegetable' => 'carotte', 'fruit' => 'poire'));
	private $_sampleSsvExpected = array(array('brocoli', 'concombre', 'salade'), array('orange', 'banane', 'peche'));
	private $_sampleCsvWinExpected = array(array('brocoli', 'cerise'), array('navet', 'carotte'));
	private $_sampleCsvMacClassicExpected = array(array('brocoli', 'cerise'), array('navet', 'carotte'));
	private $_sampleCsvWithCommaExpected = array(array('this sentence, has a comma', 'this one, has another one'), array('just a normal cell', 'no comma here!'));

	function test_createEmpty() {
		$reader = CsvReader::create();
		$this->assertEquals('CsvReader', get_class($reader));

		$reader = CsvReader::create('');
		$this->assertEquals('CsvReader', get_class($reader));
	}

	function test_createWithCsv() {
		$reader = CsvReader::create($this->_sampleCsvNoHeader);
		$this->assertEquals('CsvReader', get_class($reader));
	}

	function test_createInvalidInputArray() {
		$this->setExpectedException('InvalidArgumentException');
		$reader = CsvReader::create(array());
	}

	function test_createInvalidInputObject() {
		$this->setExpectedException('InvalidArgumentException');
		$reader = CsvReader::create($this);
	}

	function test_createInvalidInputNumber() {
		$this->setExpectedException('InvalidArgumentException');
		$reader = CsvReader::create(1);
	}

	function test_readParseLineNoHeader() {
		$reader = CsvReader::create($this->_sampleCsvNoHeader);
		$this->assertEquals(array('pomme', 'cerise', 'poire'), $reader->parseRow());
		$this->assertEquals(array('patate', 'navet', 'carotte'), $reader->parseRow());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvNoHeader));
		$this->assertEquals(array('pomme', 'cerise', 'poire'), $reader->parseRow());
		$this->assertEquals(array('patate', 'navet', 'carotte'), $reader->parseRow());
	}

	function test_readParseLineWithHeader() {
		$reader = CsvReader::create($this->_sampleCsvWithHeader, array('hasHeader' => true));
		$this->assertEquals(array('vegetable' => 'patate', 'fruit' => 'pomme'), $reader->parseRow());
		$this->assertEquals(array('vegetable' => 'navet', 'fruit' => 'cerise'), $reader->parseRow());
		$this->assertEquals(array('vegetable' => 'carotte', 'fruit' => 'poire'), $reader->parseRow());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvWithHeader), array('hasHeader' => true));
		$this->assertEquals(array('vegetable' => 'patate', 'fruit' => 'pomme'), $reader->parseRow());
		$this->assertEquals(array('vegetable' => 'navet', 'fruit' => 'cerise'), $reader->parseRow());
		$this->assertEquals(array('vegetable' => 'carotte', 'fruit' => 'poire'), $reader->parseRow());
	}

	function test_readParse() {
		$reader = CsvReader::create($this->_sampleCsvNoHeader);
		$this->assertEquals($this->_sampleCsvNoHeaderExpected, $reader->parseAll());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvNoHeader));
		$this->assertEquals($this->_sampleCsvNoHeaderExpected, $reader->parseAll());
	}

	function test_readParseWithHeader() {
		$reader = CsvReader::create($this->_sampleCsvWithHeader, array('hasHeader' => true));
		$this->assertEquals($this->_sampleCsvWithHeaderExpected, $reader->parseAll());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvWithHeader), array('hasHeader' => true));
		$this->assertEquals($this->_sampleCsvWithHeaderExpected, $reader->parseAll());
	}

	function test_readParseSsv() {
		$reader = CsvReader::create($this->_sampleSsv, array('separator' => ';'));
		$this->assertEquals($this->_sampleSsvExpected, $reader->parseAll());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleSsv), array('separator' => ';'));
		$this->assertEquals($this->_sampleSsvExpected, $reader->parseAll());
	}

	function test_readParseWindowsNewline() {
		$reader = CsvReader::create($this->_sampleCsvWin, array('newline' => "\n\r"));
		$this->assertEquals($this->_sampleCsvWinExpected, $reader->parseAll());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvWin), array('newline' => "\n\r"));
		$this->assertEquals($this->_sampleCsvWinExpected, $reader->parseAll());
	}

	function test_readParseMacClassicStyleNewline() {
		$this->skipIf(true);
		$reader = CsvReader::create($this->_sampleCsvMacClassic, array('newline' => "\r"));
		$this->assertEquals($this->_sampleCsvMacClassicExpected, $reader->parseAll());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvMacClassic), array('newline' => "\r"));
		$this->assertEquals($this->_sampleCsvMacClassicExpected, $reader->parseAll());
	}

	function test_readParseWithComma() {
		$reader = CsvReader::create($this->_sampleCsvWithComma);
		$this->assertEquals($this->_sampleCsvWithCommaExpected, $reader->parseAll());

		$reader = CsvReader::create();
		$reader->read(Stream::create($this->_sampleCsvWithComma));
		$this->assertEquals($this->_sampleCsvWithCommaExpected, $reader->parseAll());
	}

	function test_readParseNewlineMalformed() {
		$this->setExpectedException('ErrorException', 'CsvReader | Unexpected cell delimiter');
		CsvReader::create($this->_sampleCsvWithCommaMalformed);
	}

	function test_emptyCell() {
		$reader = CsvReader::create("cell1,cell2,cell3\ncell1,,cell3\n,cell2,\n,,,\n");
		$this->assertEquals(array(array('cell1', 'cell2', 'cell3'), array('cell1', '', 'cell3'), array('', 'cell2', ''), array('', '', '')), $reader->parseAll());
	}

	function test_parseGenerator() {
		$reader = CsvReader::create($this->_sampleCsvWithHeader, array('hasHeader' => true));
		$i = 0;
		foreach ($reader->rows() as $row) {
			$this->assertEquals($this->_sampleCsvWithHeaderExpected[$i++], $row);
		}

	}
}

