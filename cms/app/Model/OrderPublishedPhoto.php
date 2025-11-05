<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Path', 'Lib');

class OrderPublishedPhoto extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank'
    ];

    public function check($id) {
        return $this->find('count', ['conditions' => ['OrderPublishedPhoto.order_id' => $id]]) > 0;
    }

    public function deleteByOrderId($id) {
        $orderUpload = $this->findByOrderId($id);

        foreach ($orderUpload['OrderPublishedPhoto']['images'] as $image) {
            Path::delete(Path::join(APP, WEBROOT_DIR, $image['path']));
        }

        $this->deleteAll(['OrderPublishedPhoto.order_id' => $id]);
    }

    public function findAllByOrderId($id) {
        return $this->find('all', ['conditions' => ['OrderPublishedPhoto.order_id' => $id]]);
    }

    public function findByOrderId($id) {
        return $this->find('first', ['conditions' => ['OrderPublishedPhoto.order_id' => $id]]);
    }

    public function findByToken($token) {
        return $this->find('first', ['conditions' => ['OrderPublishedPhoto.token' => $token]]);
    }

    public function findDatesByOrderId($id) {
        $orderUploadInstances = $this->find('all', ['conditions' => ['OrderPublishedPhoto.order_id' => $id]]);
        $orderUploadResult = [];

        foreach ($orderUploadInstances as $orderUploadInstance) {
            $temp['image_count'] = count($orderUploadInstance['OrderPublishedPhoto']['images']);
            $temp['date'] = $orderUploadInstance['OrderPublishedPhoto']['created'];
            $orderUploadResult[] = $temp;
        }

        return $orderUploadResult;
    }
}
