<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Chronics', 'Lib/Chronics');
App::uses('CakeEvent', 'Event');

class ChronicsTest extends CakeTestCase {
	public function setup() {
	}

	public function test_jobCaching() {
		Chronics::_init();

		$jobsCache = Cache::read('HeO2.Chronics.jobs');
		$this->assertTrue(isset($jobsCache['background-static-resource-updater']));
	}

	public function test_eventTrigger() {
		$jobMock = $this->getMock('MockChronicJob', array('onTest'));
		$jobMock->expects($this->once())->method('onTest');

		Chronics::registerJob('mockEvent', array('jobId' => 'mockEvent', 'triggers' => array('Test.event' => 'onTest'), 'schedule' => 'none'), $jobMock);
		CakeEventManager::instance()->dispatch(new CakeEvent('Test.event'));
	}

	public function test_run() {
		$jobMock = $this->getMock('MockChronicJob', array('execute'));
		$jobMock->expects($this->once())->method('execute');

		Chronics::registerJob('mockRun', array('jobId' => 'mockRun', 'triggers' => ''), $jobMock);
		Chronics::run('mockRun');
	}
}
