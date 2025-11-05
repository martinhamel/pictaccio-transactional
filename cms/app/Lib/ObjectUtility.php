<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeLog', 'Cake/Log');

class ObjectUtility {
    /**
     * Map keys from one array to different keys in another array
     *
     * **rules format**
     * * **makeArray: <bool>** If true the output is a numerical array. Matched value from the original array are simply pushed on the destination array.
     * * **{key: <string>, becomes: <string>}** __key__ represent the value that needs to be fetched in the original array that will be mapped to __becomes__ in the destination array. If __makeArray__ is true, __becomes__ is ignored. As such, it is possible to simply specify the key only (e.g. array('makeArray' => true, 'Users.id') would push all user ids in a numerical array)
     *
     * @param $obj array The source array
     * @param $rules array The transformation rules
     * @return array The new array
     */
    public static function map($obj, $rules) {
        $options = self::_processOptions($rules); // _processOptions will modify $rules
        $mapper = $options['makeArray'] ?
            create_function('$current', '$current[\'mappedObjects\'][] = $current[\'src\'];')
            /*function(&$current) {$current['mappedObjects'][] = $current['src'];}*/ :
            create_function('$current', 'if (!isset($current[\'mappedObjects\'][$current[\'index\']])) $current[\'mappedObjects\'][$current[\'index\']] = array(); $current[\'mappedObjects\'][$current[\'index\']][$current[\'value\']] = $current[\'src\'];');/*function(&$current) {
				if (!isset($current['mappedObjects'][$current['index']]))
					$current['mappedObjects'][$current['index']] = array();
				$current['mappedObjects'][$current['index']][$current['value']] = $current['src'];
			}*/;

        if (!isset($obj[0])) {
            $obj = [$obj];
        }

        $mappedObjects = [];
        $objLength = count($obj);
        for ($i = 0; $i < $objLength; ++$i) {
            foreach ($rules as $prop => $value) {
                if (is_numeric($prop)) {
                    if ($options['makeArray']) {
                        $prop = $value;
                        $value = '';
                    } else{
                        $prop = $value['key'];
                        $value = $value['becomes'];
                    }
                }

                $src = self::parseObject($prop, $obj[$i]);
                if (!empty($src)) {
                    $ref = [
                        'mappedObjects' => &$mappedObjects,
                        'index' => $i,
                        'src' => $src,
                        'prop' => $prop,
                        'value' => $value
                    ];
                    $mapper($ref);
                } else{
                    CakeLog::warning('WARNING: Cannot find ' . $value . ' in:', $obj[$i]);
                }
            }
        }

        return count($mappedObjects) === 1 ? $mappedObjects[0] : $mappedObjects;
    }

    /**
     * Return the value of a deep array item denoted by key.
     * @param $key string The key of the value to retrieve in the dot format (e.g. key1.key2.key3)
     * @param $obj array The array to search
     * @return mixed The value or null if the key wasn't found
     */
    public static function parseObject($key, $obj) {
        $keySplit = explode('.', $key);
        $keySplitLength = count($keySplit);
        $value = $obj;

        for ($i = 0; $i < $keySplitLength; ++$i) {
            if (!isset($value[$keySplit[$i]])) {
                return null;
            }

            $value = $value[$keySplit[$i]];
        }

        return $value;
    }

    /**
     * Find the array that contains __$value__ at __$key__ in an array of array
     * @param $value mixed The value to search for
     * @param $key string The key of the value to search in the dot format @see ObjectUtility::parseObject
     * @param $obj array The array to search
     * @return bool The array the contains __$value__ at __$key__
     */
    public static function arraySearch($value, $key, $obj) {
        foreach ($obj as $item) {
            if ((string)self::parseObject($key, $item) === (string)$value) {
                return $item;
            }
        }

        return false;
    }

    public static function check(array &$obj, array $keys) {
        $missing = [];
        foreach ($keys as $key) {
            if (!isset($obj[$key])) {
                $missing[] = $key;
            }
        }

        return empty($missing) ? false : $missing;
    }


    /* PRIVATE */
    // Modifies argument $rules
    private static function _processOptions(&$rules) {
        $options = [];

        if (isset($rules['makeArray'])) {
            $options['makeArray'] = $rules['makeArray'];
            unset($rules['makeArray']);
        } else{
            $options['makeArray'] = false;
        }

        return $options;
    }
}
