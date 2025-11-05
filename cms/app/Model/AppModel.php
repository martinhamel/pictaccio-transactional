<?php
/**
 * Application model for CakePHP.
 *
 * This file is application-wide model file. You can put all
 * application-wide model-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Model
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Model', 'Model');

/**
 * Application model for Cake.
 *
 * Add your application-wide methods in the class below, your models
 * will inherit them.
 *
 * @package       app.Model
 */
class AppModel extends Model {
    public function afterFind($results, $primary = false) {
        // TODO: Looks brittle... test edge cases
        if (isset($results[0])) {
            foreach ($results as &$models) {
                foreach ($models as &$fieldSet) {
                    $this->_loopFieldSet($fieldSet);
                }
            }
        } else {
            // Will modify $results
            $this->_loopFieldSet($results);
        }

        return $results;
    }

    public function exist($id) {
        return !empty($this->findId($id));
    }

    public function findDbTable($type, $options = []) {
        $results = $this->find($type, $options);
        $cleanResults = [];

        foreach ($results as $result) {
            $cleanResults[] = $result[$this->name];
        }

        return [
                'columns' => $this->getColumnTypes(),
                'rows' => $cleanResults,
                'friendlyNames' => $this->friendlyColumnNames ?: []
            ];
    }

    public function findId($id) {
        return $this->find('first', ['conditions' => ["{$this->name}.id" => $id]]);
    }

    public function findRange($start = null, $stop = null, $type = null, $extraParameters = []) {
        $type = empty($type) ? 'all' : $type;
        $conditions = [];
        if ($start && !$stop) {
            $conditions[$this->name . '.' . $this->primaryKey] = $start;
        } else if ($start) {
            $conditions[$this->name . '.' . $this->primaryKey . ' >='] = $start;
        }
        if ($stop) {
            $conditions[$this->name . '.' . $this->primaryKey . ' <='] = $stop;
        }

        if (isset($extraParameters['conditions'])) {
            $extraParameters['conditions'] = array_merge($extraParameters['conditions'], $conditions);
        } else{
            $extraParameters['conditions'] = $conditions;
        }

        return $this->find($type, $extraParameters);
    }

    public function getLastId() {
        return $this->find('first', [
            'fields' => [
                'MAX(id) as max_id'
            ],
            'recursive' => -1
        ])[0]['max_id'];
    }

    /* PROTECTED */
    protected function _filterModelNameFromResults($results, $modelName = null) {
        $modelName = empty($modelName) ? $this->name : $modelName;
        $postFilter = [];

        foreach ($results as $result) {
            $postFilter[] = $result[$modelName];
        }

        return $postFilter;
    }

    // Modifies argument $fieldSet
    private function _loopFieldSet(&$fieldSet) {
        foreach ($fieldSet as $columnName => &$field) {
            if (isset($this->_schema[$columnName]) && $this->_schema[$columnName]['type'] === 'text' && $this->_schema[$columnName]['length'] === null && is_string($field) && ($field[0] === '{' || $field[0] === '[')) {
                $field = json_decode($field, true);
            }
        }
    }
}
