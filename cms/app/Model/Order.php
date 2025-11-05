<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeSession', 'Model/Datasource');

class Order extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $belongsTo = ['Contact', 'Session', 'DeliveryOption'];
    public $hasMany = ['Transaction'];
    public $hasAndBelongsToMany = [
        'Subject' => [
            'className' => 'Subject',
            'joinTable' => 'orders_subjects_map',
            'foreignKey' => 'order_id',
            'associationForeignKey' => 'subject_id'
        ],
        'SubjectGroup' => [
            'className' => 'SubjectGroup',
            'joinTable' => 'orders_subject_groups_map',
            'foreignKey' => 'order_id',
            'associationForeignKey' => 'subject_group_id'
        ]
    ];

    public function completeOrder($orderId, $contactId, $shippingCost, $taxes, $totalCost) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setContactId: ${orderId} not found");
        }

        $this->id = $orderId;
        $this->save([
            'contact_id' => $contactId,
            'paid' => true,
            'sale_delivery_price' => $shippingCost,
            'sale_taxes' => $taxes,
            'sale_total' => $totalCost
        ]);
    }

    public function savePreCompleteStage($sessionId, $photoSelection, $cart, $orderTotal, $comment, $id) {
        if (!empty($id)) {
            $this->id = $id;
        } else {
            $this->create();
        }

        $subjectIds = [];
        foreach ($photoSelection as $subject) {
            if (empty($subject['image']['subjectId']) || in_array($subject['image']['subjectId'], $subjectIds)) {
                continue;
            }
            $subjectIds[] = $subject['image']['subjectId'];
        }

        $subjectGroupIds = [];
        foreach ($photoSelection as $group) {
            if (empty($group['image']['groupId']) || in_array($group['image']['groupId'], $subjectGroupIds)) {
                continue;
            }
            $subjectGroupIds[] = $group['image']['groupId'];
        }

        $this->save([
            'Order' => [
                'session_id' => $sessionId,
                'photo_selection' => json_encode($photoSelection),
                'cart' => json_encode($cart),
                'sale_subtotal' => $orderTotal,
                'comment' => $comment,
                'completed' => false,
                'flags' => json_encode(['customerLocale' => CakeSession::read('Config.language')]),
            ],
            'Subject' => [
                'Subject' => $subjectIds
            ],
            'SubjectGroup' => [
                'SubjectGroup' => $subjectGroupIds
            ],
        ]);

        return $this->id;
    }

    public function saveContactId($orderId, $contactId) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setContactId: ${orderId} not found");
        }

        $this->id = $orderId;
        $this->save([
            'contact_id' => $contactId
        ]);
    }

    public function saveComment($orderId, $comment) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setContactId: ${orderId} not found");
        }

        $this->id = $orderId;
        $this->save([
            'comment' => $comment
        ]);
    }

    public function saveDeliveryId($orderId, $deliveryId, $deliveryOption) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setComplete: ${orderId} not found");
        }

        $row = $this->findId($orderId);

        $this->id = $orderId;
        $this->save([
            'delivery_option_id' => $deliveryId,
            'flags' => json_encode(array_merge(is_array($row['Order']['flags'])
                ? $row['Order']['flags']
                : [],
                ['snapshot' => ['deliveryOption' => [
                    'id' => $deliveryId,
                    'internalName' => $deliveryOption['internal_name'],
                    'nameLocale' => $deliveryOption['name_locale'],
                    'basePrice' => $deliveryOption['base_price'],
                    'leadTime' => $deliveryOption['lead_time'],
                    'method' => $deliveryOption['method'],
                    'options' => $deliveryOption['options']
                ]]]
            ))
        ]);
    }

    public function setComplete($orderId) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setComplete: ${orderId} not found");
        }

        $this->id = $orderId;
        $this->save([
            'paid' => true
        ]);
    }

    public function setFreeShipping($orderId) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setFreeShipping: ${orderId} not found");
        }

        $row = $this->findId($orderId);

        $this->id = $orderId;
        $this->save([
            'Order' => ['flags' => json_encode(array_merge(is_array($row['Order']['flags'])
                ? $row['Order']['flags']
                : [],
                ['freeShipping' => true]))
            ]
        ]);
    }

    public function setPromoCode($orderId, $promoCode, $amount) {
        if (!$this->exist($orderId)) {
            throw new NotFoundException("Order::setFreeShipping: ${orderId} not found");
        }

        $row = $this->findId($orderId);

        $this->id = $orderId;
        $this->save([
            'Order' => ['flags' =>
                json_encode(
                    array_merge(is_array($row['Order']['flags'])
                        ? $row['Order']['flags']
                        : [],
                        ['promo' => ['code' => $promoCode, 'amount' => $amount]]))]
        ]);
    }

    public function rows($conditions = null) {
        $i = 0;
        while (true) {
            $rows = $this->find('all', [
                'conditions' => $conditions,
                'limit' => 50,
                'offset' => $i++ * 50
            ]);

            if (empty($rows)) {
                break;
            }

            foreach ($rows as $row) {
                yield $row;
            }
        }
    }
}
