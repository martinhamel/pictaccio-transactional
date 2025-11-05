<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('CakeEmail', 'Network/Email');
App::uses('CashRegister', 'Lib');
App::uses('Path', 'Lib');
App::uses('TempFiles', 'Lib');

class OrdersDropin extends AdminDropin {
    const _UNPACK_DIRECTORY = 'digitals';
    private $_CONSTRUCT_LABEL_MAP = [
        '8x10' => '1-8x10',
        '5x7' => '2-5x7',
        '4x6' => '3-4x6',
        '4x5' => '4-4x5',
        '2x3' => '8-2&frac12;x3&frac12;',
        '1x2' => '16-1&frac34;x2&frac12;'
    ];

    public function index() {
        $this->_loadModel('DeliveryOption');
        $this->_loadModel('Session');

        $this->_set('deliveryOptions',
            array_reduce($this->DeliveryOption->find('all'), function($deliveryOptions, $row) {
                $deliveryOptions[] = [
                        'id' => $row['DeliveryOption']['id'],
                        'text' => $row['DeliveryOption']['name_locale']
                    ];
                return $deliveryOptions;
            }, []));

        $this->_set('sessions',
            array_reduce($this->Session->find('all'), function($sessions, $row) {
                $sessions[] = [
                    'id' => $row['Session']['id'],
                    'text' => $row['Session']['name_locale']
                ];
                return $sessions;
            }, []));
    }

    public function comment() {
        $this->_loadModel('Order');

        $this->Order->commentOnOrder(
            $this->_request->data['id'],
            $this->_request->data['name'],
            $this->_request->data['text']);

        if (filter_var($this->_request->data['to'], FILTER_VALIDATE_EMAIL)) {
            $email = new CakeEmail('message');

            $email->emailFormat('html');
            $email->from(['sender@photosfmail.com' => $this->_request->data['name']]);
            $email->to($this->_request->data['to']);
            $email->subject('Vous avez un nouveau message!');
            $email->send("Vous avez un nouveau message sur la commande <a href=\"https://photosf.ca/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/view/{$this->_request->data['id']}\">#{$this->_request->data['id']}</a><br><br>" .
                str_replace("\n", '<br>', $this->_request->data['text']));
        }

        $this->_host->renderJson([
            'status' => 'ok'
        ]);
    }

    public function displayRawTransaction($transactionId) {
        $this->_loadModel('Transaction');

        $transaction = $this->Transaction->findById($transactionId);
        if (empty($transaction)) {
            throw new NotFoundException("Transaction id {$transactionId} not found");
        }

        $this->_set('rawFields', $transaction['Transaction']['processor_response_json']);
    }

    public function export_contacts() {
        $this->_host->disableHeO2Dash();

        $orderIds = json_decode(html_entity_decode($this->_request->data['selection']), true);
        if (empty($orderIds)) {
            throw new BadRequestException("Missing orders");
        }

        $this->_loadModel('Order');

        $orders = $this->Order->find('all', [
            'conditions' => [
                'Order.id' => $orderIds
            ]
        ]);

        $this->_set('orders', $orders);

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="stats.csv"');
        //$this->_host->silence();
    }

    public function filter() {
        $this->_loadModel('Order');
        $this->_loadModel('Picture');

        switch ($this->_request->data['status']) {
        case 'complete':
            $completed = 1;
            break;

        case 'incomplete':
            $completed = 0;
            break;

        case 'both':
        default:
            $completed = [0, 1];
        }

        $orderConditions = [
            'Order.completed' => $completed
        ];

        if (!empty($this->_request->data['id'])) {
            $orderConditions['Order.id' . ($this->_request->data['id-exclude'] === 'true' ? ' !=' : '')] =
                $this->_parseIdString($this->_request->data['id']);
        }

        if (!empty($this->_request->data['name'])) {
            $orderConditions['Contact.name ' . ($this->_request->data['name-exclude'] === 'true' ? 'NOT LIKE' : 'LIKE')] =
                "%{$this->_request->data['name']}%";
        }

        if (!empty($this->_request->data['phone'])) {
            $likePhone = join('%', str_split($this->_request->data['phone']));
            $orderConditions['Contact.phone ' . ($this->_request->data['phone-exclude'] === 'true' ? 'NOT LIKE' : 'LIKE')] =
                "%{$likePhone}%";
        }

        if (!empty($this->_request->data['date'])) {
            $exclude = $this->_request->data['date-exclude'] === 'true';
            $date = $this->_parseDate($this->_request->data['date']);
            $orderConditions[$exclude ? 'or' : 'and'] = [
                'Order.modified ' . ($exclude ? '<' : '>=') => $date['begin'],
                'Order.modified ' . ($exclude ? '>' : '<=') => $date['end']
            ];
        }

        if (!empty($this->_request->data['delivery-options'])) {
            $orderConditions['Order.delivery_option_id' .
                ($this->_request->data['delivery-option-exclude'] === 'true' ? ' !=' : '')] =
                $this->_request->data['delivery-options'];
        }

        if (!empty($this->_request->data['sessions'])) {
            $orderConditions['Session.id' .
            ($this->_request->data['session-exclude'] === 'true' ? ' !=' : '')] =
                $this->_request->data['sessions'];
        }

        $map = [
            'order-id' => 'Order.id',
            'order-name' => 'Contact.name',
            'order-total' => 'Order.total_cost',
            'order-date' => 'Order.modified',
            'order-session' => 'Session.name_locale_json',
            'order-delivery-option' => 'DeliveryOption.name_locale_json',
            'order-transaction-code' => 'Transaction.transaction_code'
        ];

        $orders = $this->Order->find('all', [
            'conditions' => $orderConditions,
            'order' => [$map[$this->_request->data['sort-column']] . ' ' . $this->_request->data['sort-direction']],
            'contain' => [
                'Transaction' => [
                    'order' => ['Transaction.id DESC'],
                    'limit' => 1
                ]
            ]
        ]);

        $pictureConditions = [];

        if (!empty($this->_request->data['subject-name'])) {
            $pictureConditions['Picture.display_name ' . ($this->_request->data['subject-name-exclude'] === 'true' ? 'NOT LIKE' : 'LIKE')] =
                "%{$this->_request->data['subject-name']}%";
        }

        if (count($pictureConditions)) {
            $pictures = $this->Picture->find('all', [
                'conditions' => $pictureConditions
            ]);

            $searchCode = array_map(function ($item) {
                return $item['Picture']['code'];
            }, $pictures);

            $ordersTmp = [];
            foreach ($orders as $order) {
                $intersect = array_intersect($searchCode, array_map(function ($item) use ($order) {
                    return $item['image']['studentCode'];
                }, array_filter($order['Order']['photo_selection_json'],
                    function ($item) {return isset($item['image']['studentCode']);}
                )));

                if (count($intersect) > 0) {
                    $ordersTmp[] = $order;
                }
            }

            $orders = $ordersTmp;
        }

        $this->_host->renderJson([
                'status' => 'ok',
                'orders' => $orders
            ]
        );
    }

    public function print_labels() {
        $this->_host->disableHeO2Dash();

        $orderIds = json_decode(html_entity_decode($this->_request->data['selection']), true);
        if (empty($orderIds)) {
            throw new BadRequestException("Missing orders");
        }

        $this->_loadModel('Order');

        $orders = $this->Order->find('all', [
            'conditions' => [
                'Order.id' => $orderIds
            ]
        ]);

        $this->_set('orders', $orders);
    }

    public function print_label($orderId) {
        $this->_host->disableHeO2Dash();

        $this->_loadModel('Order');

        $order = $this->Order->findById($orderId);

        $this->_set('order', $order);
    }

    public function print_order($orderId) {
        $this->_host->disableHeO2Dash();

        $this->_loadModel('Order');
        $this->_loadModel('DeliveryOption');
        $this->_loadModel('Session');
        $this->_loadModel('Transaction');
        $this->_loadModel('Picture');
        $this->_loadModel('Product');

        $order = $this->Order->findById($orderId);
        $lastTransaction = $this->Transaction->find('first', [
            'conditions' => ['Transaction.order_id' => $orderId],
            'order' => ['Transaction.id DESC']
        ]);

        $subjects = array_reduce(array_chunk($order['Order']['photo_selection_json'], 1, true),
            function($subjects, $photoSelection) {
                if (isset(current($photoSelection)['image']['studentCode']) && empty($subjects[strtolower(current($photoSelection)['image']['studentCode'])])) {
                    $picture = $this->Picture->findByCode(current($photoSelection)['image']['studentCode']);
                    $session = $this->Session->findId($picture['Picture']['session_id']);
                    $subjects[strtolower(current($photoSelection)['image']['studentCode'])] = [
                        'subject_code' => $picture['Picture']['code'],
                        'session_id' => $picture['Picture']['session_id'],
                        'session_name' => $session['Session']['name_locale'],
                        'session_color' => isset($session['Session']['apply_json']['color']) ? $session['Session']['apply_json']['color'] : null,
                        'display_name' => $picture['Picture']['display_name'],
                        'subject_info' => $picture['Picture']['subject_json']
                    ];
                }

                return $subjects;
            }, []);


        $products = array_reduce($order['Order']['cart_json'],
            function($products, $cartItem) {
                $productRow = $this->Product->findId($cartItem['productId']);
                if (empty($productRow)) {
                    throw new NotFoundException("OrdersDropin::view: Product id '{$cartItem['productId']}' not found.");
                }

                $products[$cartItem['productId']] = $productRow['Product'];
                return $products;
            }, []);
        $cartBySubject = array_reduce(array_chunk($order['Order']['cart_json'], 1, true),
            function($cartBySubject, $item) use ($products, $order, $subjects) {
                $itemId = key($item);
                $item = current($item);

                foreach ($item['selection'] as $selection) {
                    $item['subtotal'] = $item['item_subtotal'];

                    if (isset($order['Order']['photo_selection_json'][$selection]['image']['studentCode']) && empty($cartBySubject[strtolower($order['Order']['photo_selection_json'][$selection]['image']['studentCode'])][key($item)])) {
                        $cartBySubject[strtolower($order['Order']['photo_selection_json'][$selection]['image']['studentCode'])][$itemId] = $item;
                    } else if (isset($order['Order']['photo_selection_json'][$selection]['image']['groups']) && empty($cartBySubject[strtolower($order['Order']['photo_selection_json'][$selection]['image']['groups'])][key($item)])) {
                        $subjectCodeAssociatedGroup = strtolower(array_values(array_filter($subjects, function ($subject) use ($order, $selection) {
                            return $subject['subject_info']['groupe'] === $order['Order']['photo_selection_json'][$selection]['image']['groups'];
                        }))[0]['subject_code']);
                        $cartBySubject[$subjectCodeAssociatedGroup][$itemId] = $item;
                    }
                }
                return $cartBySubject;
            }, []);
        $deliveryOption = $this->DeliveryOption->findById($order['Order']['delivery_option_id']);

        $cash = CashRegister::create(Configure::read('CashRegister.quebec'));
        $cash->orderSubtotal = $order['Order']['order_total_cost'];
        $cash->shipping = $order['Order']['shipping_cost'];
        if (!empty($order['Order']['flags_json']['promo'])) {
            $cash->promo = $order['Order']['flags_json']['promo']['amount'];
        }

        $this->_set('cashRegister', $cash);
        $this->_set('order', $order);
        $this->_set('lastTransaction', $lastTransaction);
        $this->_set('subjects', $subjects);
        $this->_set('products', $products);
        $this->_set('cartBySubject', $cartBySubject);
        $this->_set('deliveryOption', $deliveryOption);
    }

    public function print_product_label($orderId, $productIds) {
        $this->_host->disableHeO2Dash();

        $this->_loadModel('Order');
        $this->_loadModel('Product');
        $this->_loadModel('Picture');

        $order = $this->Order->findById($orderId);
        $products = [];
        foreach (explode(',', $productIds) as $productId) {
            $productRow = $this->Product->findById($productId);

            if (empty($productRow)) {
                throw new NotFoundException();
            }

            $cartProducts = array_filter($order['Order']['cart_json'], function($item) use($productId) {return $item['productId'] === $productId;});

            $subjectCodes = [];
            $cartProductIndex = 0;
            foreach ($cartProducts as $cartProduct) {
                foreach ($cartProduct['selection'] as $selection) {
                    $studentCode = $order['Order']['photo_selection_json'][$selection]['image']['studentCode'];
                    if (!in_array($studentCode, $subjectCodes)) {
                        $subjectCodes[] = $studentCode;
                    }
                }
                $productRow['Product']['theme'][$cartProductIndex] = $cartProduct['theme'];
                $productRow['Product']['quantity'] = $cartProduct['quantity'];
                $cartProductIndex++;
            }

            $subjects = [];
            foreach ($subjectCodes as $subjectCode) {
                $subjects[$subjectCode] = $this->Picture->findByCode($subjectCode);
            }

            $productRow['Subjects'] = array_map(function($item) {
                $groupStringMap = ['group', 'groupe', 'classe'];
                $groupString = '';

                foreach ($groupStringMap as $groupStringMapItem) {
                    $groupString = isset($item['Picture']['subject_json'][$groupStringMapItem])
                        ? $groupStringMapItem
                        : $groupString;
                }

                return ['display_name' => $item['Picture']['display_name'],
                    'group' => $item['Picture']['subject_json'][$groupString]];
            }, $subjects);
            $products[] = $productRow;
        }

        $this->_set('order', $order);
        $this->_set('products', $products);
    }

    public function print_product_labels() {

    }

    public function print_selection() {
        $this->_host->disableHeO2Dash();

        $orderIds = json_decode(html_entity_decode($this->_request->data['selection']), true);
        if (empty($orderIds)) {
            throw new BadRequestException("Missing orders");
        }

        $this->_loadModel('Order');
        $this->_loadModel('DeliveryOption');
        $this->_loadModel('Session');
        $this->_loadModel('Transaction');
        $this->_loadModel('Picture');
        $this->_loadModel('Product');

        $orders = $this->Order->find('all', [
            'conditions' => [
                'Order.id' => $orderIds
            ]
        ]);

        foreach ($orders as &$order) {
            $order['subjects'] = array_reduce(array_chunk($order['Order']['photo_selection_json'], 1, true),
                function($subjects, $photoSelection) {
                    if (isset(current($photoSelection)['image']['studentCode']) && empty($subjects[strtolower(current($photoSelection)['image']['studentCode'])])) {
                        $picture = $this->Picture->findByCode(current($photoSelection)['image']['studentCode']);
                        $session = $this->Session->findId($picture['Picture']['session_id']);
                        $subjects[strtolower(current($photoSelection)['image']['studentCode'])] = [
                            'subject_code' => $picture['Picture']['code'],
                            'session_id' => $picture['Picture']['session_id'],
                            'session_name' => $session['Session']['name_locale'],
                            'session_color' => isset($session['Session']['apply_json']['color']) ? $session['Session']['apply_json']['color'] : null,
                            'display_name' => $picture['Picture']['display_name'],
                            'subject_info' => $picture['Picture']['subject_json']
                        ];
                    }

                    return $subjects;
                }, []);
            $order['products'] = array_reduce($order['Order']['cart_json'],
                function($products, $cartItem) {
                    $productRow = $this->Product->findId($cartItem['productId']);
                    if (empty($productRow)) {
                        throw new NotFoundException("OrdersDropin::view: Product id '{$cartItem['productId']}' not found.");
                    }

                    $products[$cartItem['productId']] = $productRow['Product'];
                    return $products;
                }, []);

            $order['cartBySubject'] = array_reduce(array_chunk($order['Order']['cart_json'], 1, true),
                function($cartBySubject, $item) use ($order) {
                    $itemId = key($item);
                    $item = current($item);

                    foreach ($item['selection'] as $selection) {
                        $item['subtotal'] = $item['item_subtotal'];

                        if (isset($order['Order']['photo_selection_json'][$selection]['image']['studentCode']) && empty($cartBySubject[strtolower($order['Order']['photo_selection_json'][$selection]['image']['studentCode'])][key($item)])) {
                            $cartBySubject[strtolower($order['Order']['photo_selection_json'][$selection]['image']['studentCode'])][$itemId] = $item;
                        } elseif (isset($order['Order']['photo_selection_json'][$selection]['image']['groups']) && empty($cartBySubject[strtolower($order['Order']['photo_selection_json'][$selection]['image']['groups'])][key($item)])) {
                            $subjectCodeAssociatedGroup = strtolower(array_values(array_filter($order['subjects'], function ($subject) use ($order, $selection) {
                                return $subject['subject_info']['groupe'] === $order['Order']['photo_selection_json'][$selection]['image']['groups'];
                            }))[0]['subject_code']);
                            $cartBySubject[$subjectCodeAssociatedGroup][$itemId] = $item;
                        }
                    }
                    return $cartBySubject;
                }, []);

            $findTransaction = $this->Transaction->find('first', [
                'conditions' => ['Transaction.order_id' => $order['Order']['id']],
                'order' => ['Transaction.id DESC']
            ]);

            if (isset($findTransaction['Transaction'])) {
                $order['lastTransaction'] = $findTransaction['Transaction'];
            } else {
                $order['lastTransaction'] = ['transaction_code' => '', 'payment_module' => ''];
            }

            $order['SelectedDeliveryOption'] = $this->DeliveryOption->findById($order['Order']['delivery_option_id']);
            $order['SelectedSession'] = $this->Session->findById($order['Order']['session_id']);

            $order['cashRegister'] = CashRegister::create(Configure::read('CashRegister.quebec'));
            $order['cashRegister']->orderSubtotal = $order['Order']['order_total_cost'];
            $order['cashRegister']->shipping = $order['Order']['shipping_cost'];
            if (!empty($order['Order']['flags_json']['promo'])) {
                $order['cashRegister']->promo = $order['Order']['flags_json']['promo']['amount'];
            }
        }

        $reorderedOrders = [];
        foreach ($orderIds as $id) {
            reset($orders);
            $test = array_filter($orders, function($item) use ($id) {return $item['Order']['id'] == $id;});
            $reorderedOrders[] = array_values($test)[0];
        }

        $this->_set('orders', $reorderedOrders);
    }

    public function view($orderId) {
        $this->_loadModel('Order');
        $this->_loadModel('DeliveryOption');
        $this->_loadModel('Session');
        $this->_loadModel('Transaction');
        $this->_loadModel('Picture');
        $this->_loadModel('Product');
        $this->_loadModel('OrderUpload');

        $order = $this->Order->findById($orderId);
        $lastTransaction = $this->Transaction->find('first', [
            'conditions' => ['Transaction.order_id' => $orderId],
            'order' => ['Transaction.id DESC']
        ]);

        $subjects = array_reduce($order['Order']['photo_selection_json'],
            function($subjects, $photoSelection) {
                if (isset($photoSelection['image']['studentCode']) && empty($subjects[strtolower($photoSelection['image']['studentCode'])])) {
                    $picture = $this->Picture->findByCode($photoSelection['image']['studentCode']);
                    $session = $this->Session->findId($picture['Picture']['session_id']);
                    $subjects[strtolower($photoSelection['image']['studentCode'])] = [
                        'studentCode' => $picture['Picture']['code'],
                        'session_id' => $picture['Picture']['session_id'],
                        'session_name' => $session['Session']['name_locale'],
                        'display_name' => $picture['Picture']['display_name'],
                        'subject_info' => $picture['Picture']['subject_json']
                    ];
                }

                return $subjects;
            }, []);
        $products = array_reduce($order['Order']['cart_json'],
            function($products, $cartItem) {
                $productRow = $this->Product->findId($cartItem['productId']);
                if (empty($productRow)) {
                    throw new NotFoundException("OrdersDropin::view: Product id '{$cartItem['productId']}' not found.");
                }

                $products[$cartItem['productId']] = $productRow['Product'];
                return $products;
            }, []);
        $cart = array_reduce($order['Order']['cart_json'],
            function($cart, $item) use ($products) {
                $item['subtotal'] = $item['item_subtotal'];
                $cart[] = $item;
                return $cart;
            }, []);
        $deliveryOption = $this->DeliveryOption->findById($order['Order']['delivery_option_id']);

        $cash = CashRegister::create(Configure::read('CashRegister.quebec'));
        $cash->orderSubtotal = $order['Order']['order_total_cost'];
        $cash->shipping = $order['Order']['shipping_cost'];
        if (!empty($order['Order']['flags_json']['promo'])) {
            $cash->promo = $order['Order']['flags_json']['promo']['amount'];
        }

        $this->_set('cashRegister', $cash);
        $this->_set('order', $order);
        $this->_set('lastTransaction', $lastTransaction);
        $this->_set('subjects', $subjects);
        $this->_set('products', $products);
        $this->_set('cart', $cart);
        $this->_set('deliveryOption', $deliveryOption);
        $this->_set('hasUploads', $this->OrderUpload->check($orderId));
        $this->_set('uploads', $this->OrderUpload->findAllByOrderId($orderId));
        $this->_set('digitalEmailDate', $this->OrderUpload->findDatesByOrderId($orderId));
    }

    public function track($pictureId) {
        $this->_loadModel('Track');
        $this->_set('visit', $this->Track->findById($pictureId));
    }

    public function transactions($orderId) {
        $this->_loadModel('Transaction');

        $transactions = $this->Transaction->findByOrderId($orderId);
        if (empty($transactions)) {
            throw new NotFoundException("Order id {$orderId} not found.");
        }

        $this->_set('transactions', $transactions);
    }

    public function upload() {
        $this->_host->checkPost(['order_id']);

        $this->_loadModel('OrderUpload');

        $tokenSeed = time();
        $digitals = [];
        $tempFiles = new TempFiles();
        foreach ($tempFiles->get() as $file) {
            if (!$file->mimeIs('image/*')) {
                continue;
            }

            $path = Path::uniqueFilename(Path::join(APP, WEBROOT_DIR, self::_UNPACK_DIRECTORY)) . '.jpg';
            $file->move($path);

            $digitals[] = [
                'path' => Path::relative($path, Path::join(APP, WEBROOT_DIR)),
                'name' => $file->name()
            ];

            $tokenSeed .= $file->name();
        }

        $this->OrderUpload->save([
            'order_id' => $this->_request->data['order_id'],
            'token' => hash('sha256', $tokenSeed),
            'images_json' => json_encode($digitals),
        ]);

        $this->_host->renderJson(['status' => 'ok']);
    }

    public function uploads_confirm() {
        $this->_host->checkPost(['order_id']);

        $this->_loadModel('Order');
        $this->_loadModel('OrderUpload');

        $order = $this->Order->findById($this->_request->data['order_id']);
        $orderUpload = $this->OrderUpload->findByOrderId($this->_request->data['order_id']);
        $this->Order->setDigitalEmailSentDate($this->_request->data['order_id']);

        try {
            $email = new CakeEmail('digitals');
            $email->subject( __d('emails', 'DIGITAL_READY'));
            $email->viewVars([
                'orderId' => $this->_request->data['order_id'],
                'token' => $orderUpload['OrderUpload']['token']
            ]);
            $email->to($order['Contact']['email']);
            $email->send();
        } catch (Exception $e) {
            $orderId = $this->_request->data['order_id'];
            $contact = $order['Contact']['email'];
            AdminMailer::send("Failed to send digitals email regarding order {$orderId}. Email: {$order['Contact']['email']}");
            HeO2Log::error('OrderDropin | Failed to send digitals email to ' . $order['Contact']['email'] . '. ' . $e->getMessage());
        }

        $this->_host->renderJson(['status' => 'ok']);
    }

    public function uploads_delete() {
        $this->_host->checkPost(['order_id']);

        $this->_loadModel('OrderUpload');

        $orderId = $this->_request->data['order_id'];
        if ($this->OrderUpload->check($orderId)) {
            $this->OrderUpload->deleteByOrderId($orderId);
        }

        $this->_host->renderJson(['status' => 'ok']);
    }


    /* PRIVATE */
    private function _calculateItemSubtotal($product, $selectionCount, $quantity) {
        $price = 0;

        if (isset($product['options_json']['use_price_scale']) && $product['options_json']['use_price_scale']) {
            $totalProductCount = $selectionCount * $quantity;

            $price =
                array_reduce(($totalProductCount <= count($product['options_json']['price_scale']) ?
                    array_slice($product['options_json']['price_scale'], 0, $totalProductCount) :
                    array_merge(
                        $product['options_json']['price_scale'],
                        array_fill(0, $totalProductCount - count($product['options_json']['price_scale']),
                            array_values(array_slice($product['options_json']['price_scale'], -1))[0]))
                ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);
        } else {
            $price = round($product['price'] * $selectionCount * $quantity, 2);

            if (isset($product['options_json']['digitalImage']) &&
                isset($cartItem['digitalImage']) && $cartItem['digitalImage'] === '1') {

                $price += (float) $product['options_json']['digitalImage'] * $selectionCount;
            }
        }

        if (isset($product['options_json']['touchups']) && isset($cartItem['touchups']) && $cartItem['touchups'] === '1') {
            $price += (float) $product['options_json']['touchups'] * $selectionCount;
        }

        return $price;
    }

    private function _getPicturesData($pictureCodes) {
        $this->_loadModel('Picture');

        $pictureData = [];
        foreach ($pictureCodes as $code) {
            $picture = $this->Picture->findByCode($code);

            $pictureData[] = [
                'code' => $picture['Picture']['code'],
                'display_name' => $picture['Picture']['display_name'],
                'subject' => $picture['Picture']['subject_json']
            ];
        }

        return $pictureData;
    }

    private function _getPictureIds($pictures) {
        $ids = [];
        foreach ($pictures as $picture) {
            $filename = Path::baseFilename($picture['image']['url']);
            if (($underscore = strpos($filename, '_')) !== false) {
                $filename = substr($filename, 0, $underscore);
            }
            if (array_search($filename, $ids) === false) {
                $ids[] = $filename;
            }
        }

        return $ids;
    }

    private function _parseDate($dateString) {
        if (strpos($dateString, '-')) {
            $parts = explode('-', $dateString);
            $begin = date_create_from_format('d/m/y', $parts[0]);
            $end = date_create_from_format('d/m/y', $parts[1]);

            if ($begin === false) {
                $begin = date_create_from_format('d/m/yy', $parts[0]);
            }

            if ($end === false) {
                $end = date_create_from_format('d/m/yy', $parts[1]);
            }

            return ['begin' => date_format($begin, 'Y/m/d') . ' 00:00:00',
                'end' => date_format($end, 'Y/m/d') . ' 23:59:59'];
        } else {
            $date = date_create_from_format('d/m/y', $dateString);

            if ($date === false) {
                $date = date_create_from_format('d/m/yy', $dateString);
            }

            return ['begin' => date_format($date, 'Y/m/d') . ' 00:00:00',
                'end' => date_format($date, 'Y/m/d') . ' 23:59:59'];
        }
    }

    private function _parseIdString($idString) {
        $ids = [];
        $parts = explode(',', $idString);

        foreach ($parts as $part) {
            if (strpos($part, '-') !== false) {
                if ($part[0] === '-') {
                    $start = 0;
                } else{
                    $start = (int)substr($part, 0, strpos($part, '-'));
                }

                if (substr($part, -1) === '-') {
                    $end = $this->Order->getLastId();
                } else{
                    $end = (int)substr($part, strrpos($part, '-') + 1);
                }

                for ($i = $start; $i <= $end; ++$i) {
                    if (!in_array($i, $ids, true)) {
                        $ids[] = $i;
                    }
                }
            } else{
                if (!in_array((int)$part, $ids, true)) {
                    $ids[] = (int)$part;
                }
            }
        }

        return $ids;
    }
}
