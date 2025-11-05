<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Event', 'Lib');

class ChronicsController extends AppController {
    public function beforeFilter() {
        if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1') {
            throw new FatalErrorException('Invalid address');
        }

        $this->autoLayout = false;
        $this->layout = false;
        $this->render(false);
    }

    /* PUBLIC ACTIONS */
    public function emit($eventName) {
        Event::emit($eventName);
    }
}
