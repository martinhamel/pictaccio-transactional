<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Workflow extends AppModel {
    public $hasAndBelongsToMany = [
        'PromoCodeCampaign' => [
            'className' => 'PromoCodeCampaign',
            'joinTable' => 'promo_code_campaigns_workflows_map',
            'foreignKey' => 'workflow_id',
            'associationForeignKey' => 'promo_code_campaign_id'
        ]
    ];
    public $validate = [
        'id' => 'blank'
    ];
}
