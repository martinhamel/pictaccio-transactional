<?php

App::uses('Path', 'Lib');
App::uses('SpecialItemBase', 'Lib' . DS . 'SpecialItems');

class SpecialItems {
    private static $s_items = [];

    /**
     * @return array Array of all implemented special items
     */
    public static function enum() {
        self::_loadItems();
        return self::$s_items;
    }


    /**
     * @param $name string Internal name of special item to retrieve
     * @return mixed If found, returns an instance of the special item, null otherwise
     */
    public static function get($name) {
        self::_loadItems();
        if (empty(self::$s_items[$name])) {
            return null;
        }

        return new self::$s_items[$name]['class']();
    }


    /* PRIVATE */
    private static function _loadItems() {
        if (empty(self::$s_items)) {
            $items = scandir(Path::join([APP, 'Lib', 'SpecialItems', 'Items']));
            foreach ($items as $itemFilename) {
                $itemPath = Path::join(APP, 'Lib', 'SpecialItems', 'Items', $itemFilename);
                if (Path::isFile($itemPath)) {
                    require $itemPath;
                    $className = Path::baseFilename($itemFilename);
                    $itemName = $className::name();
                    self::$s_items[$itemName] = [
                        'name' => $itemName,
                        'class' => $className
                    ];
                }
            }
        }
    }
}
