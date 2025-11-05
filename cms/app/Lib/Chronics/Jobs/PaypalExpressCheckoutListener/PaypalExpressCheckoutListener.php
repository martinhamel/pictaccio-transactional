<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CashRegister', 'Lib');
App::uses('Payment', 'Lib' . DS . 'Payment');

class PaypalExpressCheckoutListener implements ChronicJobInterface {
    public function execute() {
        return null;
    }

    public function onComplete($event) {
        CakeSession::write('Order.processed', true);

        if (empty($event->data['response']['status'])) {
            throw new ErrorException('PaypalExpressCheckoutListener::onComplete was triggered but the response is missing a status');
        }

        if ($event->data['response'][PaymentProcessorInterface::RESPONSE_STATUS_KEY] === PaymentProcessorInterface::STATUS_APPROVED) {
            $order = ClassRegistry::init('Order');
            $transaction = ClassRegistry::init('Transaction');
            $promoCode = ClassRegistry::init('PromoCode');
            $orderId = CakeSession::read('Order.id');

            if (CakeSession::check('Order.promoCode')) {
                $promo = $promoCode->findByCode(CakeSession::read('Order.promoCode'));
                if (empty($promo)) {
                    throw new NotFoundException();
                }
                if ($promo['PromoCode']['used']) {
                    throw new NotFoundException();
                }
                if (!empty($campaign['PromoCodeCampaign']['options']['workflowIds']) &&
                    !in_array($session['Session']['workflow_id'], $campaign['PromoCodeCampaign']['options']['workflowIds'])) {
                    throw new NotFoundException();
                }

                $promoCode->setUsed($promo['PromoCode']['id'], $orderId);
                $order->setPromoCode(
                    $orderId,
                    CakeSession::read('Order.promoCode'),
                    $promo['PromoCodeCampaign']['amount']);
            }

            $order->completeOrder($orderId, CakeSession::read('Order.contactId'), CakeSession::read('Order.cashShipping'), CakeSession::read('Order.taxes'), CakeSession::read('Order.cashTotal'));
            $transaction->saveTransaction($orderId, 'PaypalExpressCheckout', $event->data['response']['transactionId'], $event->data['response']);

            CakeSession::write('Order.processed', true);
            CakeSession::write('Order.emailed', true);

            header('Location: ' . Router::url(Configure::read('URL.confirmPaymentSuccessPaypal')));
        } else {
            $transaction = ClassRegistry::init('Transaction');
            $orderId = CakeSession::read('Order.id');
            $transaction->saveTransactionFail($orderId, 'PaypalExpressCheckout', $event->data['response']['transactionId'], $event->data['response']);

            header('Location: ' . Router::url(Configure::read('URL.confirmPaymentFailPaypal')));
        }
        exit();
    }

    public function onGetInfo($event) {
        $cashRegister = CashRegister::create();
        $cashRegister->orderSubtotal = CakeSession::read('Order.subtotal');
        $cashRegister->shipping = CakeSession::read('Order.shipping_cost');

        $event->data['payment'] = [
            PaymentProcessorInterface::REQUEST_SUBTOTAL => $cashRegister->subtotalPromo,
            PaymentProcessorInterface::REQUEST_TAXES => CakeSession::read('Order.taxesTotal'),
            PaymentProcessorInterface::REQUEST_SHIPPING => $cashRegister->shipping,
            PaymentProcessorInterface::REQUEST_TOTAL => $cashRegister->total,
            PaymentProcessorInterface::REQUEST_CURRENCY => 'CAD',
            PaymentProcessorInterface::REQUEST_ITEMS => [
                0 => [
                    'name' => __('PAYMENT_ITEM_NAME_ORDER', CakeSession::read('Order.order_id')),
                    'quantity' => 1
                ]
            ]
        ];

        return $event->data;
    }


}
