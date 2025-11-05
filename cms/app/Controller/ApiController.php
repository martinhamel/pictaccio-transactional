<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Address', 'Lib');
App::uses('Path', 'Lib');
App::uses('PhoneNumber', 'Lib');
App::uses('CashRegister', 'Lib');
App::uses('Taxes', 'Lib');

class ApiController extends AppController {
    const _EMAIL_REGEX = '/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD';

    private $_beforeTrackImplementation = null;

    /* LIFECYCLE */
    public function beforeFilter() {
        parent::beforeFilter();
        $this->_sendJsonHeaders();
    }

    /* PUBLIC REMOTE METHODS ENDPOINTS */
    public function calculateShipping() {
        $this->_expectSession(['Order.sessionId', 'Order.weight', 'Order.contact']);
        $sessionModel = $AnotherModel = ClassRegistry::init('Session'); // To prevent the model from clobbering Session
        $session = $sessionModel->findById(CakeSession::read('Order.sessionId'));

        if (empty($session)) {
            $this->_renderJson([
                'status' => 'not-found'
            ]);
            return;
        }

        $this->loadModel('StoreConfig');
        $configFreeShipping = $this->StoreConfig->configFreeShipping();
        $eligibleFreeShipping = $configFreeShipping['enabled'] && $configFreeShipping['threshold'] < CakeSession::read('Order.subtotal');

        $deliveryOptionsComponent = $this->Components->load('DeliveryOptions');
        $deliveryOptionSources =
            $deliveryOptionsComponent->getOptions(CakeSession::read('Order.sessionId'), CakeSession::read('Order.weight'), CakeSession::read('Order.contact'));
        $deliveryOptions = [];

        foreach ($deliveryOptionSources as $source) {
            if ($source->visible()) {
                $deliveryOptions[] = [
                    'id' => $source->id(),
                    'name' => $source->name(),
                    'price' => $eligibleFreeShipping ? __('GENERIC_FREE') : $source->price(),
                    'eta' => $source->eta(),
                    'label' => $source->label(),
                    'isLate' => $source->hasLateFees(),
                    'priceLate' => $source->priceLate()
                ];
            }
        }

        $this->_renderJson([
            'status' => 'ok',
            'deliveryOptions' => $deliveryOptions]);
    }

    public function downloadDigitalsBundle() {
        $this->_expectGet(['token']);

        $this->loadModel('OrderPublishedPhoto');
        $orderUploadTemp = $this->OrderPublishedPhoto->findByToken($this->request->query['token']);
        $orderUploads = $this->OrderPublishedPhoto->findAllByOrderId($orderUploadTemp['OrderPublishedPhoto']['order_id']);

        if (!empty($orderUploadTemp['OrderPublishedPhoto']['images'])) {
            $zipFilename = ROOT . DS . APP_DIR . DS . 'tmp' . DS . $this->request->query['token'] . '.zip';

            $zip = new ZipArchive();
            $zip->open($zipFilename, ZipArchive::CREATE);
            foreach ($orderUploads as $orderUpload) {
                foreach ($orderUpload['OrderPublishedPhoto']['images'] as $image) {
                    $zip->addFile(WWW_ROOT . Configure::read('Directories.transacExtraPub') . DS . $image['path'], Path::filename($image['name']));
                }
            }

            $zip->close();

            header('Content-Type: application/zip');
            header("Content-Transfer-Encoding: Binary");
            header("Content-disposition: attachment; filename=\"bundle.zip\"");
            readfile($zipFilename);
        }
    }

    public function listSession() {
        $this->_expectGet(['sessionId']);
        $sessionId = $this->request->query['sessionId'];

        $this->loadModel('Session');
        $this->loadModel('ProductCatalog');
        $this->loadModel('Product');
        $this->loadModel('ProductCategory');
        $this->loadModel('ProductCrosssell');
        $this->loadModel('ProductCustomTemplate');
        $this->loadModel('ProductThemeSet');

        $categories = array_map(function($row) {
                return $row['ProductCategory'];
            }, $this->ProductCategory->find('all'));

        $session = $this->Session->findById($sessionId, false);
        if (empty($session)) {
            throw new NotFoundException("API::listSessionProducts: Session '$sessionId' not found");
        }

        $productCrosssell = [];
        if (!empty($session['Session']['product_crosssell_id']) && $session['Session']['product_crosssell_id'] !== 'null') {
            $productCrosssell = $this->ProductCrosssell->findId($session['Session']['product_crosssell_id']);
            $productCrosssell['ProductCrosssell']['products'] = array_map(function($product) {return $product['id'];}, $productCrosssell['Product']);
        }

        $buildYourOwns = [];
        $buildYourOwnRows = $this->ProductCustomTemplate->find('all');
        foreach ($buildYourOwnRows as $row) {
            $buildYourOwns[$row['ProductCustomTemplate']['id']] = $row['ProductCustomTemplate'];
        }

        $productIds = [];
        foreach ($session['ProductCatalog'] as $productCatalog) {
            $tmpProductIds = $this->ProductCatalog->findProductsById($productCatalog['id']);
            if (empty($tmpProductIds)) {
                continue;
            }
            $productIds = array_reduce($tmpProductIds, function ($carry, $item) {
                if (array_reduce($carry, function ($carry, $innerItem) use ($item) { return $carry && $innerItem !== $item; }, true)) {
                    $carry[] = $item;
                }
                return $carry;
            }, $productIds);
        }

        $productsRaw = $this->Product->findIds($productIds);

        if (!empty($session['Session']['options']['discountEnable'])) {
            $discountProductIds = $this->ProductCatalog->findProducts($session['Session']['options']['discountCatalogId']);
        } else {
            $discountProductIds = [];
        }

        $themeIds = array_map(function ($productRaw) {
                return $productRaw['ProductTypeTheme']['theme_set_id'];
            },
            array_filter($productsRaw, function($productRaw) {
                return !empty($productRaw['ProductTypeTheme']['theme_set_id']);
            }));
        $themeIds = array_unique($themeIds);
        $themesRaw = $this->ProductThemeSet->findIds($themeIds);
        $themes = [];
        foreach ($themesRaw as $themeRaw) {
            $themes[$themeRaw['ProductThemeSet']['id']] = $themeRaw['ProductThemeSet'];
        }

        $filters = [
            'id' => 'id',
            'name_locale' => 'name',
            'description_locale' => 'description',
            'type' => 'type',
            'images' => 'images',
            'price' => 'price',
            'options' => 'options',
            'category_id' => 'category_id',
            'custom_id' => 'custom_id',
        ];
        $products =
            array_reduce($productsRaw,
                function($products, $productRaw) use ($filters, $themes) {
                    $products[$productRaw['Product']['id']] = array_reduce(array_keys($filters),
                        function($acc, $key) use ($productRaw, $filters) {
                            $acc[$filters[$key]] = $productRaw['Product'][$key];
                            return $acc;
                        }, []);

                    if ($productRaw['Product']['type'] === 'themed') {
                        $products[$productRaw['Product']['id']]['themes'] =
                            array_map(function ($theme) {
                                return $theme[CakeSession::read('Config.language')];
                            }, $themes[$productRaw['ProductTypeTheme']['theme_set_id']]['themes']);
                        $products[$productRaw['Product']['id']]['themes_locale'] =
                            $themes[$productRaw['ProductTypeTheme']['theme_set_id']]['themes'];
                        $products[$productRaw['Product']['id']]['themes_map'] =
                            $productRaw['ProductTypeTheme']['themes_map'];
                        $products[$productRaw['Product']['id']]['themeSetId'] =
                            $productRaw['ProductTypeTheme']['theme_set_id'];
                    } else {
                        $products[$productRaw['Product']['id']]['themes'] = [];
                    }

                    return $products;
                }, []);
        $products = array_map(function($id) use ($products) {return $products[$id];}, $productIds);

        $this->_renderJson([
            'status' => 'ok',
            'products' => $products,
            'categories' => $categories,
            'crosssell' => !empty($productCrosssell) ? $productCrosssell['ProductCrosssell'] : 'false',
            'buildYourOwn' => $buildYourOwns,
            'enableDigitals' => isset($session['Session']['options']['digitalEnable']) ? $session['Session']['options']['digitalEnable'] : null,
            'enableDigitalGroups' => $session['Session']['options']['digitalGroupsEnable'],
            'enableDiscount' => isset($session['Session']['options']['discountEnable']) && $session['Session']['options']['discountEnable'],
            'enableTouchups' => $session['Session']['options']['touchupsEnable'],
            'digitalGroupPriceIsScaling' => $session['Session']['options']['digitalGroupPriceIsScaling'],
            'digitalsPrice' => $session['Session']['options']['digitalPrice'],
            'digitalsPriceIsScaling' => $session['Session']['options']['digitalPriceIsScaling'],
            'digitalsGroupPrice' => $session['Session']['options']['digitalGroupPrice'],
            'discountProductIds' => $discountProductIds,
            'discountPrices' => isset($session['Session']['options']['discountPrices']) ? $session['Session']['options']['discountPrices'] : null,
            'discountGroupPrices' => isset($session['Session']['options']['discountGroupPrices']) ? $session['Session']['options']['discountGroupPrices'] : null,
            'touchupPrice' => $session['Session']['options']['touchupsPrice'],
            'touchupPriceIsScaling' => $session['Session']['options']['touchupsPriceIsScaling'],
        ]);
    }

    public function listSubjectCodePhotos() {
        $this->_expectGet(['code']);

        $this->loadModel('Subject');
        $this->loadModel('SubjectGroup');
        $subjects = $this->Subject->findByCode($this->request->query['code']);
        $groupPhotos = !empty($subjects['Subject']['mappings']['group']) && !empty($subjects['Subject']['info'][$subjects['Subject']['mappings']['group']])
            ? $this->SubjectGroup->findByGroup($subjects['Subject']['session_id'], $subjects['Subject']['info'][$subjects['Subject']['mappings']['group']])
            : null;

        if (empty($subjects)) {
            throw new NotFoundException();
        }

        $wwwRootLength = strlen(WWW_ROOT);
        foreach ($subjects['Subject']['photos'] as $key => $photo) {
            $subjects['Subject']['photos'][$key] = ltrim(substr(Path::join(Configure::read('Directories.thumbs'), hash('sha256', "{$photo}medium-watermarked") . '.webp'), $wwwRootLength), '/');
        }

        if (isset($groupPhotos['SubjectGroup'])) {
            foreach ($groupPhotos['SubjectGroup']['photos'] as $key => $photo) {
                $groupPhotos['SubjectGroup']['photos'][$key] = ltrim(substr(Path::join(Configure::read('Directories.thumbs'), hash('sha256', "{$photo}medium-watermarked") . '.webp'), $wwwRootLength), '/');
            }
        }

        $this->_renderJson([
            'status' => 'ok',
            'subjectId' => $subjects['Subject']['id'],
            'groupId' => $groupPhotos != null
                ? $groupPhotos['SubjectGroup']['id']
                : null,
            'photos' => $subjects['Subject']['photos'],
            'groupPhotos' => $groupPhotos != null
                ? $groupPhotos['SubjectGroup']['photos']
                : null,
            'group' => $groupPhotos != null
                ? $groupPhotos['SubjectGroup']['group']
                : null,
            'name' => $subjects['Subject']['display_name'],
            'sessionId' => $subjects['Subject']['session_id']
        ]);
    }

    public function preprocessPaypal() {
        $deliveryOptionsComponent = $this->Components->load('DeliveryOptions');
        $this->loadModel('Contact');
        $this->loadModel('Order');
        $this->loadModel('Transaction');
        $this->loadModel('StoreConfig');
        $this->loadModel('Product');
        $this->loadModel('DeliveryOption');
        $sessionModel = $AnotherModel = ClassRegistry::init('Session'); // To prevent the model from clobbering Session

        //HeO2Log::convergeSpecial("Start...");

        $this->_expectPost(['shippingId', 'comment']);
        $this->_expectSession(['Order.id', 'Order.sessionId', 'Order.weight', 'Order.contact']);
        $orderId = CakeSession::read('Order.id');
        $session = $sessionModel->findById(CakeSession::read('Order.sessionId'));
        $products = $this->Product->getOrganizedByIds();
        $virtualOnly = CakeSession::read('Order.virtualOnly');

        try {
            if (empty($session)) {
                $this->_renderJson([
                    'status' => 'not-found'
                ]);
                return;
            }
            //// Checking if payment is processing or was processed
            CakeSession::write('Order.paymentPaypal', true);

            // Calculate order total
            //HeO2Log::convergeSpecial('Calculating total...');
            $cashRegister = CashRegister::create();
            $cashRegister->orderSubtotal = CakeSession::read('Order.subtotal');
            try {
                if (($this->StoreConfig->configFreeShipping()['enabled'] && $this->StoreConfig->configFreeShipping()['threshold'] > $cashRegister->orderSubtotal ||
                    !$this->StoreConfig->configFreeShipping()['enabled']) && CakeSession::read('Order.virtualOnly') === false) {
                    $cashRegister->shipping = $deliveryOptionsComponent->calculatePrice(
                        $this->request->data['shippingId'], CakeSession::read('Order.weight'), CakeSession::read('Order.contact'));
                } else {
                    $this->Order->setFreeShipping($orderId);
                }
            } catch (NotFoundException $e) {
                CakeSession::write('Order.paymentPaypal', false);
                throw $e;
            }

            if (!empty($this->request->data['promoCode'])) {
                $this->loadModel('PromoCode');

                $promo = $this->PromoCode->findByCode($this->request->data['promoCode']);
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

                $cashRegister->promo = $promo['PromoCodeCampaign']['amount'];
                CakeSession::write('Order.promoCode', $this->request->data['promoCode']);
            }

            // Save contact, delivery id and comment
            $contactId = $this->Contact->saveAddress(null,
                CakeSession::read('Order.contact'), Address::create(CakeSession::read('Order.contact')),
                CakeSession::read('Order.newsletter') === 'true');
            $shippingId = $this->request->data['shippingId'];
            $shipping = $this->DeliveryOption->findId($shippingId);

            if (empty($shipping) && !$virtualOnly) {
                throw new NotFoundException();
            }
            $this->Order->saveDeliveryId($orderId, $shippingId, $shipping['DeliveryOption']);
            $this->Order->saveComment($orderId, $this->request->data['comment']);

            CakeSession::write('Order.cashSubtotal', $cashRegister->orderSubtotal);
            CakeSession::write('Order.cashShipping', max($cashRegister->shipping, 0));
            CakeSession::write('Order.cashPromo', $cashRegister->promo);
            CakeSession::write('Order.cashTotal', max($cashRegister->total, 0));
            CakeSession::write('Order.products', json_encode($products));
            CakeSession::write('Order.taxes', json_encode($this->_getOrderTaxes($cashRegister)));
            CakeSession::write('Order.taxesTotal', max($this->_getOrderTaxTotal($cashRegister), 0));
            CakeSession::write('Order.contactId', $contactId);
        } catch (Exception $e) {
            throw $e;
        } finally {
            CakeSession::write('Order.paymentPaypal', false);
        }

        $this->_renderJson([
            'status' => 'ok',
        ]);
    }

    public function preprocessStripe() {
        $deliveryOptionsComponent = $this->Components->load('DeliveryOptions');
        $this->loadModel('Contact');
        $this->loadModel('Order');
        $this->loadModel('Transaction');
        $this->loadModel('StoreConfig');
        $this->loadModel('Product');
        $this->loadModel('DeliveryOption');
        $sessionModel = $AnotherModel = ClassRegistry::init('Session'); // To prevent the model from clobbering Session

        $this->_expectPost(['shippingId', 'comment']);
        $this->_expectSession(['Order.id', 'Order.sessionId', 'Order.weight', 'Order.contact']);
        $orderId = CakeSession::read('Order.id');
        $session = $sessionModel->findById(CakeSession::read('Order.sessionId'));
        $products = $this->Product->getOrganizedByIds();
        $virtualOnly = CakeSession::read('Order.virtualOnly');
        $cashRegister = CashRegister::create();

        try {
            if (empty($session)) {
                $this->_renderJson([
                    'status' => 'not-found'
                ]);
                return;
            }

            // Calculate order total
            $cashRegister->orderSubtotal = CakeSession::read('Order.subtotal');
            try {
                if (($this->StoreConfig->configFreeShipping()['enabled'] && $this->StoreConfig->configFreeShipping()['threshold'] > $cashRegister->orderSubtotal ||
                    !$this->StoreConfig->configFreeShipping()['enabled']) && CakeSession::read('Order.virtualOnly') === false) {
                    $cashRegister->shipping = $deliveryOptionsComponent->calculatePrice(
                        $this->request->data['shippingId'], CakeSession::read('Order.weight'), CakeSession::read('Order.contact'));
                } else {
                    $this->Order->setFreeShipping($orderId);
                }
            } catch (NotFoundException $e) {
                throw $e;
            }

            if (!empty($this->request->data['promoCode'])) {
                $this->loadModel('PromoCode');

                $promo = $this->PromoCode->findByCode($this->request->data['promoCode']);
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

                $cashRegister->promo = $promo['PromoCodeCampaign']['amount'];
                CakeSession::write('Order.promoCode', $this->request->data['promoCode']);
            }

            // Save contact, delivery id and comment
            $contactId = $this->Contact->saveAddress(null,
                CakeSession::read('Order.contact'), Address::create(CakeSession::read('Order.contact')),
                CakeSession::read('Order.newsletter') === 'true');

            if (!$virtualOnly) {
                $shippingId = $this->request->data['shippingId'];
                $shipping = $this->DeliveryOption->findId($shippingId);
            }

            if (empty($shipping) && !$virtualOnly) {
                throw new NotFoundException();
            }

            if (!$virtualOnly) {
                $this->Order->saveDeliveryId($orderId, $shippingId, $shipping['DeliveryOption']);
            }
            $this->Order->saveComment($orderId, $this->request->data['comment']);

            CakeSession::write('Order.cashSubtotal', $cashRegister->orderSubtotal);
            CakeSession::write('Order.cashShipping', $cashRegister->shipping);
            CakeSession::write('Order.cashPromo', $cashRegister->promo);
            CakeSession::write('Order.cashTotal', $cashRegister->total);
            CakeSession::write('Order.products', json_encode($products));
            CakeSession::write('Order.taxes', json_encode($this->_getOrderTaxes($cashRegister)));
            CakeSession::write('Order.taxesTotal', max($this->_getOrderTaxTotal($cashRegister), 0));
            CakeSession::write('Order.contactId', $contactId);
        } catch (Exception $e) {
            throw $e;
        }

        $paymentParams = [
            'amount' => $cashRegister->total
        ];
        $payment = Payment::create();
        $payment->callback('Stripe', 'SetParams', $paymentParams);
        $clientSecret = $payment->getLink('Stripe');

        $this->_renderJson([
            'status' => 'ok',
            'clientSecret' => $clientSecret
        ]);
    }

    public function processCcPayment() {
        $deliveryOptionsComponent = $this->Components->load('DeliveryOptions');
        $this->loadModel('Contact');
        $this->loadModel('Order');
        $this->loadModel('Transaction');
        $this->loadModel('StoreConfig');
        $this->loadModel('Product');
        $sessionModel = $AnotherModel = ClassRegistry::init('Session'); // To prevent the model from clobbering Session

        //HeO2Log::convergeSpecial("Start...");

        $this->_expectPost(['shippingId', 'cc-number', 'cardholder-name', 'expiry-month', 'expiry-year', 'csc', 'comment']);
        $this->_expectSession(['Order.id', 'Order.sessionId', 'Order.weight', 'Order.contact']);
        $orderId = CakeSession::read('Order.id');
        $session = $sessionModel->findById(CakeSession::read('Order.sessionId'));
        $products = $this->Product->getOrganizedByIds();

        try {
            if (empty($session)) {
                $this->_renderJson([
                    'status' => 'not-found'
                ]);
                return;
            }
            //// Checking if payment is processing or was processed
            CakeSession::write('Order.paymentCC', true);

            // Calculate order total
            //HeO2Log::convergeSpecial('Calculating total...');
            $cashRegister = CashRegister::create();
            $cashRegister->orderSubtotal = CakeSession::read('Order.subtotal');
            try {
                if ($this->StoreConfig->configFreeShipping()['enabled'] && $this->StoreConfig->configFreeShipping()['threshold'] > $cashRegister->orderSubtotal ||
                    !$this->StoreConfig->configFreeShipping()['enabled']) {
                    $cashRegister->shipping = $deliveryOptionsComponent->calculatePrice(
                        $this->request->data['shippingId'], CakeSession::read('Order.weight'), CakeSession::read('Order.contact'));
                } else {
                    $this->Order->setFreeShipping($orderId);
                }
            } catch (NotFoundException $e) {
                CakeSession::write('Order.paymentCC', false);
                throw $e;
            }

            if (!empty($this->request->data['promoCode'])) {
                $this->loadModel('PromoCode');

                $promo = $this->PromoCode->findByCode($this->request->data['promoCode']);
                if (empty($promo)) {
                    throw new NotFoundException();
                }
                if ($promo['PromoCode']['used']) {
                    throw new NotFoundException();
                }
                if (!empty($campaign['PromoCodeCampaign']['options']['category_id']) &&
                        $campaign['PromoCodeCampaign']['options']['category_id'] !==
                        $session['Session']['category_id'] &&
                        $campaign['PromoCodeCampaign']['options']['category_id'] !== 'none') {
                    throw new NotFoundException();
                }

                $cashRegister->promo = $promo['PromoCodeCampaign']['options']['amount'];
                $this->Order->setPromoCode($orderId, $this->request->data['promoCode'],
                    $promo['PromoCodeCampaign']['options']['amount']);
            }

            // Save contact, delivery id and comment
            $contactId = $this->Contact->saveAddress(null,
                CakeSession::read('Order.contact'), Address::create(CakeSession::read('Order.contact')),
                CakeSession::read('Order.newsletter') === 'true');
            $shippingId = $this->request->data['shippingId'];
            $shipping = $this->DeliveryOption->findId($shippingId);

            if (empty($shipping)) {
                throw new NotFoundException();
            }
            $this->Order->saveDeliveryId($orderId, $shippingId, $shipping['DeliveryOption']);
            $this->Order->saveComment($orderId, $this->request->data['comment']);

            Configure::write('Order.taxes', json_encode($this->_getOrderTaxes($cashRegister)));

            // Process payment
            App::uses('Payment', 'Lib' . DS . 'Payment');
            App::uses('PaymentProcessorInterface', 'Lib' . DS . 'Payment');
            $ccAddress = CakeSession::read('Order.contact.street-address-1') . ', ' . CakeSession::read('Order.contact.street-address-2');

            $payment = Payment::create();
            $params = [
                PaymentProcessorInterface::REQUEST_SUBTOTAL => $cashRegister->orderSubtotal,
                PaymentProcessorInterface::REQUEST_TAXES => $this->_getOrderTaxTotal($cashRegister),
                PaymentProcessorInterface::REQUEST_SHIPPING => $cashRegister->shipping,
                PaymentProcessorInterface::REQUEST_TOTAL => $cashRegister->total,
                PaymentProcessorInterface::REQUEST_CURRENCY => 'CAD',
                PaymentProcessorInterface::REQUEST_CREDITCARD_NUMBER => $this->request->data['cc-number'],
                PaymentProcessorInterface::REQUEST_CSC => $this->request->data['csc'],
                PaymentProcessorInterface::REQUEST_EXPIRY => $this->request->data['expiry-month'] . $this->request->data['expiry-year'],
                PaymentProcessorInterface::REQUEST_CARDHOLDER_NAME => substr($this->request->data['cardholder-name'], 0, 20),
                PaymentProcessorInterface::REQUEST_ORDER_ID => $orderId,
                PaymentProcessorInterface::REQUEST_ADDRESS => $ccAddress,
                PaymentProcessorInterface::REQUEST_CITY => CakeSession::read('Order.contact.city'),
                PaymentProcessorInterface::REQUEST_STATE => CakeSession::read('Order.contact.region'),
                PaymentProcessorInterface::REQUEST_POSTAL_CODE => CakeSession::read('Order.contact.postal-code'),
                PaymentProcessorInterface::REQUEST_PHONE => CakeSession::read('Order.contact.phone'),
                PaymentProcessorInterface::REQUEST_EMAIL => CakeSession::read('Order.contact.email')
            ];

            $payment->callback('ConvergeAPI', 'ProcessPayment', $params);

            if ($params['response']['status'] === PaymentProcessorInterface::STATUS_APPROVED) {
                $this->loadModel('Order');

                CakeSession::write('Order.shipping_id', $this->request->data['shippingId']);
                $this->Order->completeOrder($orderId, $contactId, $cashRegister->shipping, json_encode($this->_getOrderTaxes($cashRegister)), $cashRegister->total);
                $this->Transaction->saveTransaction(
                    $orderId, 'ConvergeAPI',
                    $params['response'][PaymentProcessorInterface::RESPONSE_TRANSACTION_ID],
                    $params['response']
                );

                Event::emit('Order.complete', [
                    'cash' => $cashRegister,
                    'order_id' => $orderId,
                    'order' => CakeSession::read('Order'),
                    'products' => $products,
                    'shipping_id' => $this->request->data['shippingId']
                ]);

                if (!empty($this->request->data['promoCode'])) {
                    $this->PromoCode->setUsed($promo['PromoCode']['id'], $orderId);
                }
                CakeSession::write('Order.processed', true);
                CakeSession::write('Order.emailed', true);
            } else {
                $this->loadModel('Transaction');
                $this->Transaction->saveTransactionFail(
                    $orderId, 'ConvergeAPI',
                    $params['response'][PaymentProcessorInterface::RESPONSE_TRANSACTION_ID],
                    $params['response']
                );
            }

            if ($params['response'][PaymentProcessorInterface::RESPONSE_STATUS_KEY] === PaymentProcessorInterface::STATUS_NO_RESPONSE ||
                $params['response'][PaymentProcessorInterface::RESPONSE_STATUS_KEY] === PaymentProcessorInterface::STATUS_ERROR) {
                App::uses('AdminMailer', 'Lib');
                AdminMailer::send('The server was unable to process the transaction because of a technical problem. <br><br>' . json_encode($this->_filterCC($params)));
            } else {
                //HeO2Log::convergeSpecial("OrderId: {$orderId}; ...Nope");
            }

            $this->_renderJson([
                'status' => $params['response'][PaymentProcessorInterface::RESPONSE_STATUS_KEY],
            ]);
        } catch (Exception $e) {
            throw $e;
        } finally {
            CakeSession::write('Order.paymentCC', false);
        }
    }

    public function processPromo() {
        App::uses('Event', 'Lib');
        $deliveryOptionsComponent = $this->Components->load('DeliveryOptions');
        $this->loadModel('Contact');
        $this->loadModel('Order');
        $this->loadModel('Transaction');
        $this->loadModel('StoreConfig');
        $this->loadModel('Product');
        $sessionModel = ClassRegistry::init('Session'); // To prevent the model from clobbering Session

        $this->_expectPost(['promoCode']);
        $this->_expectSession(['Order.id', 'Order.sessionId', 'Order.weight', 'Order.contact']);
        $orderId = CakeSession::read('Order.id');
        $session = $sessionModel->findById(CakeSession::read('Order.sessionId'));
        $products = $this->Product->getOrganizedByIds();

        try {
            if (empty($session)) {
                $this->_renderJson([
                    'status' => 'not-found'
                ]);
                return;
            }
            CakeSession::write('Order.paymentPromo', true);

            $cashRegister = CashRegister::create();
            $cashRegister->orderSubtotal = CakeSession::read('Order.subtotal');

            if (empty($this->request->data['promoCode'])) {
                throw new BadRequestException('Missing promoCode');
            }

            $this->loadModel('PromoCode');

            $promo = $this->PromoCode->findByCode($this->request->data['promoCode']);
            if (empty($promo)) {
                throw new NotFoundException();
            }
            if ($promo['PromoCode']['used']) {
                throw new NotFoundException();
            }
            if ((!empty($campaign['Workflow']) &&
                 in_array($session['Session']['workflow_id'], array_map(function ($i) {return $i['id'];}, $campaign['Workflow']))) ||
                 !empty($campaign['Session']) &&
                 in_array($session['Session']['id'], array_map(function ($i) {return $i['id'];}, $campaign['Session']))) {
                throw new NotFoundException();
            }

            $cashRegister->promo = $promo['PromoCodeCampaign']['amount'];

            if ($cashRegister->total > 0.0) {
                throw new BadRequestException('CashRegister not 0');
            }

            $this->Order->setPromoCode($orderId, $this->request->data['promoCode'],
                $promo['PromoCodeCampaign']['amount']);

            // Save contact, delivery id and comment
            $contactId = $this->Contact->saveAddress(null,
                CakeSession::read('Order.contact'), Address::create(CakeSession::read('Order.contact')),
                CakeSession::read('Order.newsletter') === 'true');
            $this->Order->saveComment($orderId, $this->request->data['comment']);

            $this->loadModel('Order');

            $this->Order->completeOrder($orderId, $contactId, max($cashRegister->shipping, 0), json_encode($this->_getOrderTaxes($cashRegister)), max($cashRegister->total, 0));
            $this->Transaction->saveTransaction(
                $orderId, 'Promo',
                'Promo',
                null
            );
            Event::emit('Order.complete', [
                'cash' => $cashRegister,
                'order_id' => $orderId,
                'order' => CakeSession::read('Order'),
                'products' => $products,
                'shipping_id' => null
            ]);

            if (!empty($this->request->data['promoCode'])) {
                $this->PromoCode->setUsed($promo['PromoCode']['id'], $orderId);
            }
            CakeSession::write('Order.processed', true);
            CakeSession::write('Order.emailed', true);

            $this->_renderJson([
                'status' => 'ok',
            ]);
        } catch (Exception $e) {
            throw $e;
        } finally {
            CakeSession::write('Order.paymentPromo', false);
        }
    }

    public function promo($code = null) {
        $this->loadModel('PromoCode');
        $this->loadModel('PromoCodeCampaign');
        $sessionModel = ClassRegistry::init('Session'); // To prevent the model from clobbering Session

        $this->_expectSession(['Order.sessionId']);

        if ($code === null) {
            $code = $this->request->query['code'];
        }

        $promo = $this->PromoCode->findByCode($code);
        if (!empty($promo)) {
            $campaign = $this->PromoCodeCampaign->find('first', [
                'conditions' => ['PromoCodeCampaign.id' => $promo['PromoCode']['campaign_id']],
                'contain' => [
                    'Session',
                    'Workflow'
                ]
            ]);
            $session = $sessionModel->findId(CakeSession::read('Order.sessionId'));
        }

        if (empty($promo)) {
            $status = 'not-found';
        } else if ($promo['PromoCode']['used']) {
            $status = 'not-found';
        } else if ((!empty($campaign['Workflow']) &&
                   !in_array($session['Session']['workflow_id'], array_map(function ($i) {return $i['id'];}, $campaign['Workflow']))) ||
                   (!empty($campaign['Session']) &&
                   !in_array($session['Session']['id'], array_map(function ($i) {return $i['id'];}, $campaign['Session'])))) {
            $status = 'not-found';
        } else {
            $status = 'ok';
        }

        $this->_renderJson([
            'status' => $status,
            'amount' => $status === 'ok' ? $promo['PromoCodeCampaign']['amount'] : null,
            'options' => $status === 'ok' ? $promo['PromoCodeCampaign']['options'] : null
        ]);
    }

    public function setShipping() {
        $this->_expectPost(['id']);
        $this->_expectSession('Order.order_id');

        $shipping = [
            'id' => $this->request->data['id'],
            'price' => $this->request->data['price'],
            'eta' => $this->request->data['eta']
        ];

        CakeSession::write('Order.shipping', $shipping);

        $this->loadModel('Order');
        $this->Order->saveShippingStage(CakeSession::read('Order.order_id'), $shipping);

        $this->_renderJson(['status' => 'ok']);
    }

    public function updateComment() {
        $this->_expectPost('comment');
        $this->_expectSession('Order.id');
        $this->loadModel('Order');
        $this->Order->saveComment(CakeSession::read('Order.id'), $this->request->data['comment']);

        CakeSession::write('Order.comment', $this->request->data['comment']);

        $this->_renderJson(['status' => 'ok']);
    }

    public function updateContact() {
        $this->loadModel('Contact');
        $this->loadModel('Order');

        $this->_expectPost(['street-address-1', 'street-address-2', 'city', 'region', 'postal-code', 'country', 'email',
                            'phone', 'newsletter', 'first-name', 'last-name']);

        $response = [];
        $addressDetails = [];
        $phoneDetails = [];
        $address = Address::create($this->request->data);
        $phone = PhoneNumber::create($this->request->data['phone'], 'american');
        $email = !empty($this->request->data['email']) &&
            preg_match(self::_EMAIL_REGEX, $this->request->data['email']) === 1;
        $firstName = !empty(trim($this->request->data['first-name']));
        $lastName = !empty(trim($this->request->data['last-name']));

        $addressValidates = $address->validate($addressDetails);
        $phoneValidates = $phone->validate($phoneDetails);
        if ($addressValidates && $phoneValidates && $email && $firstName && $lastName) {
            $this->request->data['phone'] = $phone->format('short');

            $this->_contactToSession($this->request->data, $address);
            CakeSession::write('Order.newsletter', $this->request->data['newsletter']);

            $this->loadModel('Contact');
            $contactId = $this->Contact->saveAddress(
                CakeSession::read('Order.contact_id'),
                $this->request->data, $address, $this->request->data['newsletter']);
            $this->Order->saveContactid(CakeSession::read('Order.id'), $contactId);

            $response['status'] = 'ok';
        } else {
            $response['status'] = 'fail';
        }

        $response['fields'] = array_merge($addressDetails, $phoneDetails, [
            'email' => $email,
            'first-name' => $firstName,
            'last-name' => $lastName
        ]);
        $this->_renderJson($response);
    }

    public function validateCode($code) {
        $this->loadModel('Subject');
        $subject = $this->Subject->findByCode($code);
        $hidden = false;
        $session = null;

        if (!empty($subject)) {
            $this->loadModel('Session');
            $session = $this->Session->findById($subject['Subject']['session_id'], false);
        }

        if (empty($subject) || empty($session) || $hidden) {
            $this->_renderJson([
                'status' => 'not found'
            ]);
        } else {
            $this->_clearOrder();

            $this->_renderJson([
                'status' => 'found',
                'data' => $subject['Subject']
            ]);
        }
    }

    /* PRIVATE */
    private function _clearOrder() {
        CakeSession::delete('Order');
    }

    private function _contactToSession($requestData, $address) {
        CakeSession::write('Order.contact', [
            'first-name' => $requestData['first-name'],
            'last-name' => $requestData['last-name'],
            'email' => $requestData['email'],
            'phone' => $requestData['phone'],
            'street-address-1' => $address->streetAddress1(),
            'street-address-2' => $address->streetAddress2(),
            'city' => $address->city(),
            'region' => $address->region(),
            'postal-code' => $address->postalCode(),
            'country' => $address->country()
        ]);
    }

    private function _filterCC($params) {
        if (isset($params[PaymentProcessorInterface::REQUEST_CREDITCARD_NUMBER])) {
            $params[PaymentProcessorInterface::REQUEST_CREDITCARD_NUMBER] =
                str_repeat('*', strlen($params[PaymentProcessorInterface::REQUEST_CREDITCARD_NUMBER]) - 4) .
                substr($params[PaymentProcessorInterface::REQUEST_CREDITCARD_NUMBER], -4);
        }

        return $params;
    }

    private function _getOrderTaxes($cashRegister) {
        $taxes = Taxes::get();

        $orderTaxes = [];
        $orderTaxes['locality'] = Configure::read('Taxes.locality');
        $orderTaxes['canadian'] = [];

        foreach ($taxes as $tax) {
            $orderTaxes['canadian'][$tax] = max($cashRegister->{$tax}, 0);
        }

        return $orderTaxes;
    }

    private function _getOrderTaxTotal($cashRegister) {
        $taxes = Taxes::get();

        $taxTotal = 0;

        foreach ($taxes as $tax) {
            $taxTotal += $cashRegister->{$tax};
        }

        return $taxTotal;
    }
}
