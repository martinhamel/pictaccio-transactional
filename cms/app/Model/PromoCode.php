<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class PromoCode extends AppModel {
    public $actsAs = ['Locale'];
    public $belongsTo = ['PromoCodeCampaign' => ['foreignKey' => 'campaign_id']];
    public $validate = [
        'id' => 'blank',
    ];

    public function check($code) {
        return $this->find('count', [
            'conditions' => [
                'PromoCode.code' => $code
            ]
        ]) > 0;
    }

    public function findByCampaignId($campaignId) {
        return $this->find('all', [
            'conditions' => [
                'PromoCode.campaign_id' => $campaignId
            ]
        ]);
    }

    public function findByCode($code) {
        return $this->find('first', [
            'conditions' => [
                'PromoCode.code' => $code
            ]
        ]);
    }

    public function setUsed($id, $orderId) {
        $this->id = $id;
        $this->save([
            'PromoCode' => [
                'used' => true,
                'order_id' => $orderId
            ]
        ]);
    }
}
