<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */


App::uses('ObjectUtility', 'Lib');

class TableHelper extends AppHelper {
	private $_data = array();
	private $_headerIndex = array();
	private $_header = array();
	private $_options = array(
		'tableCss' => ''
	);

	public function make($header, $data, $options = array()) {
		$this->_header = $header;
		$this->_data = $data;
		$this->_options = $options;

		$this->_index($header);

		return
			'<table class="' . $this->_options['tableCss'] . '">' .
				'<thead><tr>' . $this->_makeHeader() . '</tr></thead>' .
				'<tbody>' . $this->_makeBody() . '</tbody>' .
			'</table>';
	}

	/* PRIVATE */
	private function _index($source) {
		$count = 0;

		foreach ($source as $key => $value) {
			$this->_headerIndex[$count++] = $key;

		}
	}

	private function _makeBody() {
		$trs = '';

		foreach ($this->_data as $row) {
			$tds = '';

			foreach ($this->_headerIndex as $index) {
				$tds .= '<td>' . __(ObjectUtility::parseObject($index, $row)) . '</td>';
			}

			$trs .= '<tr>' . $tds . '</tr>';
		}

		return $trs;
	}

	private function _makeHeader() {
		$ths = '';

		foreach ($this->_header as $text) {
			$ths .= '<th>' . __($text) . '</th>';
		}

		return $ths;
	}
}
