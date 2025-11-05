<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('DbTable', 'Lib');

class PromoDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('PromoCodeCampaign');
        $this->_loadModel('PromoShipping');
        $this->_set('config', $this->PromoShipping->config());
        $this->_set('promoCodeCampaignTable', json_encode($this->PromoCodeCampaign->findDbTable('all')));
    }

    public function campaign($campaignId, $hide = '') {
        $this->_loadModel('PromoCodeCampaign');
        $this->_loadModel('PromoCode');
        $this->_loadModel('Category');

        $hide = $hide === 'hide';

        $promoCodeCampaignRow = $this->PromoCodeCampaign->findId($campaignId);
        if (empty($promoCodeCampaignRow)) {
            throw new NotFoundException();
        }

        $promoCodeRows = $this->PromoCode->findByCampaignId($campaignId);

        $this->_set('promoCodeCampaignRow', $promoCodeCampaignRow);
        $this->_set('promoCodeRows', $promoCodeRows);
        $this->_set('hide', $hide);
        $this->_set('categories', $this->Category->find('all'));
    }

    public function createSeries() {
        $this->_loadModel('PromoCodeCampaign');
        $this->_loadModel('PromoCode');

        $promoCodeCampaignRow = $this->PromoCodeCampaign->findId($this->_request->data['campaign_id']);
        if (empty($promoCodeCampaignRow)) {
            throw new NotFoundException();
        }

        for ($i = 0; $i < intval($this->_request->data['count']); ++$i) {
            $code = $promoCodeCampaignRow['PromoCodeCampaign']['code_prefix'] . '-' . strtoupper(self::_randomString(5));
            if ($this->PromoCode->check($code)) {
                continue;
            }

            $this->PromoCode->create();
            $this->PromoCode->save([
                'campaign_id' => $this->_request->data['campaign_id'],
                'code' => $code
            ]);
        }

        $this->_host->renderJson(['status' => 'ok']);
    }

    public function setCategory() {
        $this->_loadModel('PromoCodeCampaign');

        $id = $this->_request->data['id'];
        $categoryId = $this->_request->data['category-id'];
        $this->PromoCodeCampaign->setCategory($id, $categoryId);

        $this->_host->renderJson(['status' => 'ok']);
    }

    public function shipping_save() {
        $this->_loadModel('PromoShipping');

        if ($this->_request->data['enabled']) {
            $this->PromoShipping->enabled($this->_request->data['enabled'] === 'true');
        }

        if ($this->_request->data['threshold_amount']) {
            $this->PromoShipping->threshold(floatval($this->_request->data['threshold_amount']));
        }

        $this->_host->renderJson(['status' => 'ok']);
    }

    public function productCodeCampaign_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('PromoCodeCampaign');
            $dbTable = new DbTable($this->PromoCodeCampaign);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else{
            throw new BadRequestException();
        }
    }


    /* PRIVATE */
    private static function _randomString($length) {
        return substr(str_replace('+', '', str_replace('/', '', base64_encode(openssl_random_pseudo_bytes($length * 2)))), 0, $length);
    }
}
