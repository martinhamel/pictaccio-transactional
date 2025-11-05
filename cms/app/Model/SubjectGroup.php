<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class SubjectGroup extends AppModel {
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
        $photo = $this->findByCode($group);
        if (empty($photo)) {
            throw new RuntimeException("Subject: code '${group}' not found");
        }

        $this->id = $photo['SubjectGroup']['id'];
        $this->save([
            'hidden' => $hide
        ]);
    }
}
