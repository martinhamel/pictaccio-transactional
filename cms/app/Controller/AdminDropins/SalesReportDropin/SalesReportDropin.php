<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */

App::uses('CashRegister', 'Lib');

class SalesReportDropin extends AdminDropin {
    public function index() {

    }

    public function run() {
        if (empty($this->_request->query['start']) || empty($this->_request->query['end'])) {
            $this->_host->throwBadRequest();
        }

        $this->_loadModel('Order');
        $this->_loadModel('Picture');
        $this->_loadModel('Product');

        $products = $this->Product->find('all');
        $productsById = array_reduce($products, function($productsById, $product) {
            $productsById[$product['Product']['id']] = $product['Product'];
            return $productsById;
        }, []);

        $goodsTable = [];
        foreach ($products as $product) {
            $goodsTable[$product['Product']['id']] = 0;
        }

        $cash = CashRegister::create(Configure::read('CashRegister.quebec'));
        $output = [];
        $orders = $this->Order->find('all',
            ['conditions' => ['Order.created >=' => $this->_request->query['start'], 'Order.created <=' => $this->_request->query['end'],
                'Order.completed' => 1]]);

        foreach ($orders as $order) {
            $cash->orderSubtotal = $order['Order']['order_total_cost'];
            $cash->shipping = $order['Order']['shipping_cost'];

            $subjectsCount = count(array_reduce(array_chunk($order['Order']['photo_selection_json'], 1, true),
                function($subjects, $photoSelection) {
                    $current = current($photoSelection);
                    if (!isset($current['image']['studentCode'])) {
                        return $subjects;
                    }

                    $studentCode = strtolower($current['image']['studentCode']);
                    if (empty($subjects[$studentCode])) {
                        $subjects[$studentCode] = true;
                    }

                    return $subjects;
                }, []));

            $goodsTableLocal = $goodsTable;
            if (!empty($order['Order']['cart_json'])) {
                foreach ($order['Order']['cart_json'] as $cartItem) {
                    $goodsTableLocal[$cartItem['productId']] += $cartItem['quantity'];
                }
            }

            $output[] = array_replace([
                    'date' => $order['Order']['created'],
                    'order_id' => $order['Order']['id'],
                    'session_id' => $order['Order']['session_id'],
                    'school_name' => $order['Session']['name_locale'],
                    'subject_count' => $subjectsCount,
                    'subtotal' => $order['Order']['order_total_cost'],
                    'shipping' => $order['Order']['shipping_cost'],
                    'gst' => $cash->gst,
                    'pst' => $cash->qst,
                    'total' => $cash->total
                ],
                $goodsTableLocal);
        }

        $this->_set('output', $output);
        $this->_set('products', $productsById);
        $this->_host->disableHeO2Dash();
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="stats.csv"');

    }
}
