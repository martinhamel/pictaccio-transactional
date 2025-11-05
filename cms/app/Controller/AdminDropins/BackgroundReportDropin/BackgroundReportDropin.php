<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */

App::uses('CashRegister', 'Lib');

class BackgroundReportDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('Background');
        $this->_loadModel('BackgroundPopularityIndex');

        $assetIds = [];
        foreach ($this->Background->find('all') as $background) {
            $assetIds[$background['Background']['image']] = $background['Background']['id'];
        }

        $rows = $this->BackgroundPopularityIndex->find('all');

        $stats = [];
        foreach ($rows as $row) {
            $monthYear = __d('admin-backreportdrop', date('F Y', strtotime($row['BackgroundPopularityIndex']['day'])));

            foreach ($row['BackgroundPopularityIndex']['stats_json'] as $asset => $stat) {
                if (empty($stats[$monthYear][$asset])) {
                    $stats[$monthYear][$asset] = 0;
                }

                $stats[$monthYear][$asset] += $stat;
            }
        }

        $this->_set('assetIds', $assetIds);
        $this->_set('stats', $stats);
    }

    public function run() {

    }
}
