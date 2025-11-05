<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Background extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank'
    ];
    public $fileUploads = [
        'image' => [
            'allow' => true,
            'mime' => 'image/*'
        ]
    ];

    public function findById($id) {
        return $this->find('first', [
            'conditions' => [
                'Background.id' => $id
            ]
        ]);
    }

    public function updateFeaturedStatus($id, $status) {
        $this->id = $id;
        $this->save(['Background' => ['featured' => $status]]);
    }
}
