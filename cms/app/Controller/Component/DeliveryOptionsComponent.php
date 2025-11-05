<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');
App::uses('Shipping', 'Lib' . DS . 'Shipping');
App::uses('UnitConverter', 'Lib');
App::uses('DeliveryOptions', 'Lib' . DS . 'DeliveryOptions');
App::uses('Properties', 'Lib');

class DeliveryOptionsComponent extends AppComponent {
    public function initialize(Controller $controller) {
        parent::initialize($controller);
        $this->_initializeModels();
    }

    public function calculatePrice($id, $weight, $destination) {
        $deliveryOptionRecord = $this->DeliveryOption->findId($id);

        if (empty($deliveryOptionRecord)) {
            throw new NotFoundException("DeliveryOptionComponent::calculateShipping: DeliveryOption id '{$id}' not found'");
        }

        $deliveryOption = DeliveryOptions::create([
            'id' => $deliveryOptionRecord['DeliveryOption']['id'],
            'friendlyId' => $deliveryOptionRecord['DeliveryOption']['method'],
            'leadtime' => $deliveryOptionRecord['DeliveryOption']['lead_time'],
            'base_price' => $deliveryOptionRecord['DeliveryOption']['base_price'],
            'name' => $deliveryOptionRecord['DeliveryOption']['name_locale'],
            'properties' => $deliveryOptionRecord['DeliveryOption']['options']
        ]);
        $deliveryOption->setDestination($destination);
        $deliveryOption->setWeight($weight);

        return $deliveryOption->price() + ($deliveryOption->hasLateFees() ? $deliveryOption->priceLate() : 0);
    }

    /**
     * @param $sessionId
     * @param array $receipt {items: {...}, subtotal: <number>, weight: <string>}
     * @param array $destination {appartment_number: <string>, civic_number: <number>, street: <string>, city: <string>, state: <string>, country: <string>, code: <string>}
     * @return mixed DeliveryOptions available in the current session
     */
    public function getOptions($sessionId, $weight, $destination) {
        return $this->_createDeliveryOptionHandlers($sessionId, $weight, $destination);
    }


    /* PRIVATE */
    private function _initializeModels() {
        $this->Session = ClassRegistry::init('Session');
        $this->DeliveryOption = ClassRegistry::init('DeliveryOption');
    }

    private function _createDeliveryOptionHandlers($sessionId, $weight, $destination) {
        $sessionDeliveryOptions = $this->Session->findDeliveryOptions($sessionId);
        if (empty($sessionDeliveryOptions)) {
            throw new FatalErrorException('Unknown delivery options');
        }

        return array_reduce($sessionDeliveryOptions,
            function ($carry, $deliveryOptionRecord) use ($weight, $destination) {
                $deliveryOption = DeliveryOptions::create([
                    'id' => $deliveryOptionRecord['id'],
                    'friendlyId' => $deliveryOptionRecord['method'],
                    'leadtime' => $deliveryOptionRecord['lead_time'],
                    'base_price' => $deliveryOptionRecord['base_price'],
                    'name' => $deliveryOptionRecord['name_locale'][CakeSession::read('Config.language')],
                    'properties' => $deliveryOptionRecord['options']
                ]);

                if ($deliveryOption instanceof DeliveryOptionSourceInterface) {
                    $deliveryOption->setDestination($destination);
                    $deliveryOption->setWeight($weight);

                    if (!empty($deliveryOption)) {
                        $carry[] = $deliveryOption;
                    }
                }
                return $carry;
            }, []);
    }
}
