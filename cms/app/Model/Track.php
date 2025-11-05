<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('CakeSession', 'Model/Datasource');

class Track extends AppModel {
    public $useTable = 'tracks';
    public $primaryKey = 'id';
    public $validate = [
        'id' => 'blank'
    ];

    public function findById($id) {
        if (!is_numeric($id)) {
            throw new InvalidArgumentException();
        }
    }

    public function findByPictureId($pictureId) {
        if (!is_numeric($pictureId)) {
            throw new InvalidArgumentException("Non numerical pictureId: {$pictureId}");
        }
        return $this->find('all', ['conditions' => ['Track.id' => $pictureId]]);
    }

    public function location($trackData) {
        $trackId = CakeSession::read('Tracking.id');
        $savedSessionId = CakeSession::read('Tracking.session_id');
        $savedPictureId = CakeSession::read('Tracking.picture_id');
        $trackData['session_id'] = $trackData['session_id'] ?: $savedSessionId;
        $trackData['picture_id'] = $trackData['picture_id'] ?: $savedPictureId;

        if (empty($trackData['session_id'])) {
            return;
        }

        $hits = CakeSession::read('Tracking.hits') ?: [];
        if (empty($trackId) ||
            (!empty($savedSessionId) && $savedSessionId != $trackData['session_id']) ||
            (!empty($savedPictureId) && $savedPictureId != $trackData['picture_id'])) {
            $trackId = $this->_createNewTrackingSession($trackData);
        }

        $hits[] = [
            'timestamp' => time(),
            'location' => $trackData['location'],
            'url' => $trackData['request']->url,
            'postData' => $trackData['request']->data
        ];

        $this->id = $trackId;
        $this->save([
            'end_date' => time(),
            'drop_step' => $trackData['location'],
            'hits_json' => json_encode($hits)
        ]);


        CakeSession::write('Tracking.hits', $hits);
    }


    /* PRIVATE */
    public function _createNewTrackingSession($trackData) {
        $this->create();
        $this->save([
            'session_id' => $trackData['session_id'],
            'picture_id' => $trackData['picture_id'],
            'start_date' => time()
        ]);

        CakeSession::write('Tracking.session_id', $trackData['session_id']);
        CakeSession::write('Tracking.picture_id', $trackData['picture_id']);
        CakeSession::write('Tracking.id', $this->id);

        return $this->id;
    }
}
