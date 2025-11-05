<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Subject extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank'
    ];

    public function codeExist($code) {
        return $this->find('count', [
                'conditions' => [
                    'code' => $code
                ]
            ]) !== 0;
    }

    public function findByCode($code) {
        return $this->find('first', [
            'conditions' => [
                'code' => $code
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

    public function findByGpiInSession($sessionId, $gpi) {
        if (!is_numeric($sessionId)) {
            throw new InvalidArgumentException("Non numerical id: {$sessionId}");
        }
        return $this->find('all', [
            'conditions' => [
                'session_id' => $sessionId,
                'unique_id' => $gpi
            ]
        ]);

    }

    public function setHide($code, $hide) {
        $subject = $this->findByCode($code);
        if (empty($subject)) {
            throw new RuntimeException("Subject: code '${code}' not found");
        }

        $this->id = $subject['Subject']['id'];
        $this->save([
            'hidden' => $hide
        ]);
    }
}
