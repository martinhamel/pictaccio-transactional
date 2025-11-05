<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('Path', 'Lib');

class OrderUpload extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank'
    ];

    public function check($id) {
        return $this->find('count', ['conditions' => ['OrderUpload.order_id' => $id]]) > 0;
    }

    public function deleteByOrderId($id) {
        $orderUpload = $this->findByOrderId($id);

        foreach ($orderUpload['OrderUpload']['images_json'] as $image) {
            Path::delete(Path::join(APP, WEBROOT_DIR, $image['path']));
        }

        $this->deleteAll(['OrderUpload.order_id' => $id]);
    }

    public function findAllByOrderId($id) {
        return $this->find('all', ['conditions' => ['OrderUpload.order_id' => $id]]);
    }

    public function findByOrderId($id) {
        return $this->find('first', ['conditions' => ['OrderUpload.order_id' => $id]]);
    }

    public function findByToken($token) {
        return $this->find('first', ['conditions' => ['OrderUpload.token' => $token]]);
    }

    public function findDatesByOrderId($id) {
        $orderUploadInstances = $this->find('all', ['conditions' => ['OrderUpload.order_id' => $id]]);
        $orderUploadResult = [];

        foreach ($orderUploadInstances as $orderUploadInstance) {
            $temp['image_count'] = count($orderUploadInstance['OrderUpload']['images_json']);
            $temp['date'] = $orderUploadInstance['OrderUpload']['created'];
            $orderUploadResult[] = $temp;
        }

        return $orderUploadResult;
    }
}
