<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Recurrent', 'Lib/Chronics');

class RecurrentTest extends CakeTestCase {
	public function test_chainable() {
		$recurrentEpoch = new Recurrent();

		$this->assertEquals($recurrentEpoch->singleOccurrence(0), $recurrentEpoch);
	}

	public function test_set_single_date() {
		$dateEpoch = time();
		$dateDateTime = new DateTime();
		$dateDateTime->setTimestamp($dateEpoch);

		$recurrentEpoch = new Recurrent();
		$recurrentEpoch->singleOccurrence($dateEpoch);
		$recurrentDateTime = new Recurrent();
		$recurrentDateTime->singleOccurrence($dateDateTime);

		$this->assertEquals($recurrentEpoch->nextOccurrence(), $dateEpoch);
		$this->assertEquals($recurrentDateTime->nextOccurrence(), $dateEpoch);
	}

	public function test_next_occurrences() {
		$recurrent = new Recurrent();
		$recurrent->singleOccurrence(0)->singleOccurrence(2)->singleOccurrence(1);

		$this->assertEquals($recurrent->nextOccurrence(), 0);
		$this->assertEquals($recurrent->nextOccurrence(), 1);
		$this->assertEquals($recurrent->nextOccurrence(), 2);
	}

	public function test_peek_occurrences() {
		$recurrent = new Recurrent();
		$recurrent->singleOccurrence(0)->singleOccurrence(2)->singleOccurrence(1);

		$this->assertEquals($recurrent->peekOccurrence(), 0);
		$this->assertEquals($recurrent->peekOccurrence(), 0);
	}
}
