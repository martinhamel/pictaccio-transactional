<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Transaction extends AppModel {
    public function findByOrderId($orderId) {
        return $this->find('all', [
            'conditions' => [
                'Transaction.order_id' => $orderId
            ],
            'order' => ['Transaction.id']
        ]);
    }

    public function orderHasSuccessful($orderId) {
        return $this->find('count', [
                'conditions' => [
                    'Transaction.order_id' => $orderId,
                    'Transaction.successful' => true
                ]
            ]) !== 0;
    }

    public function saveTransaction($orderId, $paymentModule, $transactionCode, $processorResponse) {
        $this->create();
        $this->save([
            'order_id' => $orderId,
            'successful' => true,
            'payment_module' => $paymentModule,
            'transaction_code' => $transactionCode,
            'processor_response' => json_encode($processorResponse)
        ]);
    }

    public function saveTransactionFail($orderId, $paymentModule, $transactionCode, $processorResponse) {
        $this->create();
        $this->save([
            'order_id' => $orderId,
            'successful' => false,
            'payment_module' => $paymentModule,
            'transaction_code' => $transactionCode,
            'processor_response' => json_encode($processorResponse)
        ]);
    }
}
