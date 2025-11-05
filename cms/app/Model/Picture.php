<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class Picture extends AppModel {
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
                'gpi' => $gpi
            ]
        ]);

    }

    public function setHide($code, $hide) {
        $picture = $this->findByCode($code);
        if (empty($picture)) {
            throw new RuntimeException("Picture: code '${code}' not found");
        }

        $this->id = $picture['Picture']['id'];
        $this->save([
            'hidden' => $hide
        ]);
    }
}
