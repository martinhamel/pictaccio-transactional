<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require_once ROOT . DS . 'lib' . DS . 'vendors' . DS . 'stripe' . DS . 'init.php';

\Stripe\Stripe::setEnableTelemetry(false);

class Stripe implements PaymentProcessorInterface {
    private $_paymentIntent = null;
    private $_stripe = null;

    public function __construct() {
        $this->_stripe = new \Stripe\StripeClient(Configure::read('Stripe.secretKey'));
    }

    public function callback($method, &$params) {
        switch ($method) {
        case 'SetParams':
            HeO2Log::stripe('SetParams callback invoked');
            $this->_setParams($params);
            break;

        case 'ProcessResult':
            HeO2Log::stripe('Result callback invoked');
            $this->_processResult($params);
            break;
        }
    }

    public function getLink() {
        return !empty($this->_paymentIntent)
            ? $this->_paymentIntent->client_secret
            : null;
    }

    /* PRIVATE */
    private function _processResult($params) {
        $orderModel = ClassRegistry::init('Order');
        $transactionModel = ClassRegistry::init('Transaction');
        $promoCodeModel = ClassRegistry::init('PromoCode');
        $orderId = CakeSession::read('Order.id');

        try {
            $paymentIntent = $this->_stripe->paymentIntents->retrieve($params['payment_intent']);
            if ($paymentIntent->status !== 'succeeded' || $paymentIntent->last_payment_error) {
                $transactionModel->saveTransactionFail(
                    $orderId,
                    'Stripe',
                    $paymentIntent->latest_charge,
                    []
                );

               HeO2Log::stripe("The transaction failed (order id: '{$orderId}'); Status: {$paymentIntent->status}, Context: {$paymentIntent->last_payment_error}");
               header('Location: ' . Router::url(['controller' => 'confirm', 'action' => 'fail']));
            } else {
                HeO2Log::stripe("Payment intent for order id '{$orderId}' confirmed");

                $orderModel->completeOrder($orderId,
                    CakeSession::read('Order.contactId'),
                    CakeSession::read('Order.cashShipping'),
                    CakeSession::read('Order.taxes'),
                    CakeSession::read('Order.cashTotal')
                );
                $transactionModel->saveTransaction(
                    $orderId,
                    'Stripe',
                    $paymentIntent->latest_charge,
                    []
                );

                if (CakeSession::check('Order.promoCode')) {
                    $promo = $promoCodeModel->findByCode(CakeSession::read('Order.promoCode'));
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

                    $promoCodeModel->setUsed($promo['PromoCode']['id'], $orderId);
                    $orderModel->setPromoCode(
                        $orderId,
                        CakeSession::read('Order.promoCode'),
                        $promo['PromoCodeCampaign']['amount']);
                }

                $cashRegister = CashRegister::create();
                $cashRegister->orderSubtotal = CakeSession::read('Order.cashSubtotal');
                $cashRegister->shipping = CakeSession::read('Order.cashShipping');
                $cashRegister->promo = CakeSession::read('Order.cashPromo');

                Event::emit('Order.complete', [
                    'cash' => $cashRegister,
                    'order_id' => $orderId,
                    'order' => CakeSession::read('Order'),
                    'products' => json_decode(CakeSession::read('Order.products'), true),
                    'shipping_id' => null
                ]);

                CakeSession::write('Order.processed', true);
                header('Location: ' . Router::url(['controller' => 'confirm']));
            }
        } catch (\Exception $e) {
            HeO2Log::stripe("Error (order id: '{$orderId}'): " . $e->getMessage());

            header('Location: ' . Router::url(['controller' => 'confirm', 'action' => 'fail']));
        }
    }

    private function _setParams($params) {
        $orderId = CakeSession::read('Order.id');

        try {
            $params = [
                'amount' => $params['amount'] * 100,
                'currency' => 'cad',
                'payment_method_types' => [
                    'card'
                ],
                'metadata' => [
                    'order_id' => $orderId
                ],
            ];

            HeO2Log::stripe("Creating payment intent for order id '{$orderId}' with params: " . json_encode($params));
            $this->_paymentIntent = $this->_stripe->paymentIntents->create($params);
        } catch (\Exception $e) {
            HeO2Log::stripe("Error (order id: '{$orderId}'): " . $e->getMessage());
            throw new FatalErrorException("Error processing payment");
        }
    }
}
