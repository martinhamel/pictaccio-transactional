<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class AppComponent extends Component {
    protected $_controller = null;

    public function initialize(Controller $controller) {
        $this->_controller = $controller;
    }

    /* PROTECTED */
    protected function loadLibrary($name, $path = '') {
        App::uses($name, 'Lib' . DS . $path);
        $this->{$name} = new $name;
    }
}
