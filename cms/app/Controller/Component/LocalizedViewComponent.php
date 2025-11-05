<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');
App::uses('LanguageFallback', 'Lib');
App::uses('Inflector', 'Cake' . DS . 'Utilities');

class LocalizedViewComponent extends AppComponent {
    protected $_controller = null;

    public function initialize(Controller $controller) {
        $this->_controller = $controller;
    }

    public function getMostAppropriateView($controller = null, $action = null) {
        if (empty($controller)) {
            $controller = $this->_controller->params['controller'];
        }
        if (empty($action)) {
            $action = $this->_controller->params['action'];
        }
        $pathToLocalizedViews = APP . 'View' . DS . Inflector::camelize($controller) . DS . Inflector::underscore($action);
        if (file_exists($pathToLocalizedViews)) {
            $availableViews = $this->_getAvailableViews($pathToLocalizedViews);
            return $action . DS .
                str_replace('-', '_',
                    LanguageFallback::findAppropriateStatic(
                        LanguageFallback::getFallbackPriorityArray(),
                        $availableViews
                    ));
        }

        $this->log('WARNING: Cannot find ' . $pathToLocalizedViews, 'warning');
        return null;
    }

    /* PRIVATE */
    private function _getAvailableViews($pathToLocalizedViews) {
        $availableViews = [];

        $viewFiles = scandir($pathToLocalizedViews);
        foreach ($viewFiles as $viewFile) {
            if (substr_compare($viewFile, '.ctp', -4) === 0) {
                $availableViews[] = substr($viewFile, 0, -4);
            }
        }

        return $availableViews;
    }
}
