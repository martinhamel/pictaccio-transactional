<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class GroupPicture extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank'
    ];

    public function groupExist($group) {
        return $this->find('count', [
                'conditions' => [
                    'group' => $group
                ]
            ]) !== 0;
    }

    public function findByGroup($sessionId, $group) {
        return $this->find('first', [
            'conditions' => [
                'session_id' => $sessionId,
                'group' => $group
            ]
        ]);
    }

    public function findBySessionId($sessionId) {
        if (!is_numeric($sessionId)) {
            throw new InvalidArgumentException("Non numerical id: {$sessionId}");
        }
        return $this->find('all', [
            'conditions' => [
                'session_id' => $sessionId
            ]
        ]);
    }

    public function setHide($group, $hide) {
        $picture = $this->findByCode($group);
        if (empty($picture)) {
            throw new RuntimeException("Picture: code '${group}' not found");
        }

        $this->id = $picture['GroupPicture']['id'];
        $this->save([
            'hidden' => $hide
        ]);
    }
}
