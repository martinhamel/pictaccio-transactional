<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class PromoCodeCampaign extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $hasAndBelongsToMany = [
        'Session' => [
            'className' => 'Session',
            'joinTable' => 'promo_code_campaigns_sessions_map',
            'foreignKey' => 'promo_code_campaign_id',
            'associationForeignKey' => 'session_id'
        ],
        'Workflow' => [
            'className' => 'Workflow',
            'joinTable' => 'promo_code_campaigns_workflows_map',
            'foreignKey' => 'promo_code_campaign_id',
            'associationForeignKey' => 'workflow_id'
        ]
    ];
    public $validate = [
        'id' => 'blank'
    ];

    public function setCategory($id, $categoryId) {
        $row = $this->findId($id);
        $options = $row['PromoCodeCampaign']['options'];
        $options['category_id'] = $categoryId;

        $this->id = $id;
        $this->save([
            'options' => json_encode($options)
        ]);
    }
}
