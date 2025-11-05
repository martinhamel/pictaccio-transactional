<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeEventManager', 'Events');

class Event {
    public static function emit($eventName, $params = null) {
        $event = new CakeEvent($eventName, null, $params);
        CakeEventManager::instance()->dispatch($event);
        return $event->result;
    }
}
