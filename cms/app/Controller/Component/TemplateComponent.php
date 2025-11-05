<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');

class TemplateComponent extends AppComponent {
    private static $_CATEGORY_TEXT_REGEX = null;

    private $_categories = null;

    public function initialize(Controller $controller) {
        parent::initialize($controller);

        self::$_CATEGORY_TEXT_REGEX = '/(?!.*' . (DS === '\\' ? '\\\\' : DS) . ').+$/';

        $this->_loadTemplates();
    }

    public function getCategories() {
        $categories = [];

        foreach ($this->_categories as $key => $category) {
            $categories[$key] = $category['text'];
        }

        return $categories;
    }

    public function getTemplates() {
        return $this->_categories;
    }

    /* PRIVATE */
    private function _loadColors($path) {
        $colors = [];
        $colorDirectories = glob($path . DS . '*', GLOB_ONLYDIR);

        foreach ($colorDirectories as $color) {
            $colors[] = [
                'color' => substr(basename($color), 0, 6),
                'text' => __(substr(basename($color), 6)),
                'designs' => $this->_getDesigns($color)
            ];
        }

        return $colors;
    }

    private function _getDesigns($path) {
        $designs = glob($path . DS . '*');

        foreach ($designs as &$design) {
            $design = strstr($design, Configure::read('Templates.baseUrl'));
        }

        return $designs;
    }

    private function _loadTemplates() {
        $categories = glob(Configure::read('Templates.path') . DS . '*', GLOB_ONLYDIR);
        foreach ($categories as $category) {
            $this->_categories[basename($category)] = [
                'text' => __(basename($category)),
                'colors' => $this->_loadColors($category)
            ];
        }
    }
}
