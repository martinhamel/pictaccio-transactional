<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require_once 'DeliveryOptionSourceInterface.php';

App::uses('Path', 'Lib');
App::uses('ObjectUtility', 'Lib');

class DeliveryOptions {
    private static $s_sources = [];

    public static function create($options) {
        self::_loadSources();
        $handler = self::_findSource($options);
        if (!empty($handler)) {
            $handler = new $handler();
            $handler->configure(self::_preparePropertiesArray($options));
        }
        return $handler;
    }

    public static function enum() {
        self::_loadSources();
        return self::$s_sources;
    }

    /* PRIVATE */

    private static function _findSource($option) {
        $name = $option;
        if (isset($option['friendlyId'])) {
            $name = $option['friendlyId'];
        }
        if (isset($option['class']) && (!is_string($name) || !isset(self::$s_sources[$name]))) {
            return ObjectUtility::arraySearch($option['class'], 'class', self::$s_sources) ? $option['class'] : null;
        }

        return isset(self::$s_sources[$name]) ? self::$s_sources[$name]['class'] : null;
    }

    private static function _loadSources() {
        if (empty(self::$s_sources)) {
            $sources = scandir(Path::join([APP, 'Lib', 'DeliveryOptions', 'Sources']));
            foreach ($sources as $source) {
                $sourcePath = Path::join([APP, 'Lib', 'DeliveryOptions', 'Sources', $source]);
                if (Path::isFile($sourcePath)) {
                    require_once $sourcePath;
                    $className = Path::baseFilename($source);
                    $friendlyId = $className::friendlyId();
                    self::$s_sources[$friendlyId] = [
                        'class' => $className,
                        'friendlyId' => $friendlyId
                    ];
                }
            }
        }
    }

    private static function _preparePropertiesArray($options) {
        return array_merge(
            isset($options['properties']) ? $options['properties'] : [],
            [
                'general' => [
                    'id' => ['type' => 'number', 'value' => !empty($options['id']) ? $options['id'] : null],
                    'name' => ['type' => 'text', 'value' => !empty($options['name']) ? $options['name'] : null],
                    'leadTime' => ['type' => 'number', 'value' => !empty($options['leadtime']) ? $options['leadtime'] : null],
                    'basePrice' => ['type' => 'number', 'value' => !empty($options['base_price']) ? $options['base_price'] : null]
                ]
            ]
        );
    }
}
