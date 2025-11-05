<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CurrencyConverter', 'Lib/CurrencyConverter');

class CurrencyConverterTest extends CakeTestCase {
	public function test_create() {
		$this->assertEquals('GoogleRateSource', get_class(CurrencyConverter::create('Google')));
		$this->assertEquals('YahooApiRateSource', get_class(CurrencyConverter::create('YahooApi')));
		$this->assertEquals('YahooFinanceRateSource', get_class(CurrencyConverter::create('YahooFinance')));
	}

	/*public function test_convertGoogle() {
		Google service is no longer active

		$value = CurrencyConverter::convert(100, 'CAD', 'USD', 'Google');
		$this->assertTrue($value > 0);
		$this->assertEquals('double', gettype($value));
	}*/

	public function test_convertYahooApi() {
		$value = CurrencyConverter::convert(100, 'CAD', 'USD', 'YahooApi');
		$this->assertTrue($value > 0);
		$this->assertEquals('double', gettype($value));
	}

	public function test_convertYahooFinance() {
		$value = CurrencyConverter::convert(100, 'CAD', 'USD', 'YahooFinance');
		$this->assertTrue($value > 0);
		$this->assertEquals('double', gettype($value));
	}
}
