<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');

class TrackerComponent extends Component {
    private $_LOCATION_MAP = [
        'order/choose' => 'pick-photo',
        'order/packages' => 'pick-packages',
        'order/store' => 'at-store',
        'order/overview' => 'review-order'
    ];

    public function shutdown(Controller $controller) {
        $trackData = [
            'session_id' => null,
            'picture_id' => null,
            'request' => $controller->request,
            'location' => $this->_makeLocationString($controller)
        ];

        if (isset($controller->requestTrack) && get_class($controller->requestTrack) === 'Closure') {
            $trackData = $controller->requestTrack->__invoke($trackData);
        } else if (method_exists($controller, 'requestTrack')) {
            $trackData = $controller->requestTrack($trackData);
        }
        if (!empty($trackData)) {
            $controller->loadModel('Track');
            $controller->Track->location($trackData);
        }
    }


    /* PRIVATE */
    private function _makeLocationString($controller) {
        return isset($this->_LOCATION_MAP[$controller->request->url]) ?
            $this->_LOCATION_MAP[$controller->request->url] :
            $controller->request->url;
    }
}
