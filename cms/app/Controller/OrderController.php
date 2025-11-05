<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CashRegister', 'Lib');
App::uses('Taxes', 'Lib');

class OrderController extends AppController {
    /* PUBLIC ACTIONS */
    public function index() {
        $this->loadModel('StoreConfig');

        $this->set('promoConfig', $this->StoreConfig->configFreeShipping());
    }

    public function complete() {
        if (CakeSession::check('Order.cleared')) {
            CakeSession::clear('Order');
            $this->redirect(['controller' => 'order']);
        }

        $this->loadModel('Product');
        $this->loadModel('ProductCatalog');
        $this->loadModel('Order');
        $this->loadModel('StoreConfig');
        $this->loadModel('ProductThemeSet');
        $this->loadModel('Session');
        $this->loadModel('Subject');
        $this->loadModel('SubjectGroup');

        $this->_expectPost(['order'], ['controller' => 'order', 'action' => 'index']);
        $order = $this->_htmlEntitiesArray(json_decode(htmlspecialchars_decode($this->request->data['order']), true));
        $this->request->comment = substr($this->request->comment, 0, 3000);

        try {
            $wwwRootLength = strlen(WWW_ROOT);
            $photosMap = array_reduce($order['photoSelection'], function($photosMap, $selection) use ($wwwRootLength) {
                $subjects = $this->Subject->findByCode($selection['image']['subjectCode']);
                $groupPhotos = !empty($subjects['Subject']['mappings']['group']) && !empty($subjects['Subject']['info'][$subjects['Subject']['mappings']['group']])
                    ? $this->SubjectGroup->findByGroup($subjects['Subject']['session_id'], $subjects['Subject']['info'][$subjects['Subject']['mappings']['group']])
                    : null;

                foreach ($subjects['Subject']['photos'] as $key => $photo) {
                    $photosMap[ltrim(substr(Path::join(Configure::read('Directories.thumbs'), hash('sha256', "{$photo}medium-watermarked") . '.webp'), $wwwRootLength + strlen(Configure::read('Directories.transacExtraPub'))), '/')]
                        = $photo;
                }
                if (isset($groupPhotos['SubjectGroup'])) {
                    foreach ($groupPhotos['SubjectGroup']['photos'] as $key => $photo) {
                        $photosMap[ltrim(substr(Path::join(Configure::read('Directories.thumbs'), hash('sha256', "{$photo}medium-watermarked") . '.webp'), $wwwRootLength + strlen(Configure::read('Directories.transacExtraPub'))), '/')]
                            = $photo;
                    }
                }

                return $photosMap;
            }, []);

            // Remove extra folder prefix from image paths
            $order['photoSelection_internal'] = array_map(function($selection) use ($photosMap) {
                $selection['image']['url'] = $photosMap[substr($selection['image']['url'], strlen(Configure::read('Directories.transacExtraPub')) + 2)];
                return $selection;
            }, $order['photoSelection']);

            $order['photoSelection'] = array_map(function($selection) {
                $selection['image']['url'] = substr($selection['image']['url'], strlen(Configure::read('Directories.transacExtraPub')) + 2);
                return $selection;
            }, $order['photoSelection']);

            $order['subjectCode_internal'] = array_map(function($selection) use ($photosMap) {
                $selection['photos'] = array_map(function($picture) use ($photosMap) {
                    $picture['url'] = $photosMap[substr($picture['url'], strlen(Configure::read('Directories.transacExtraPub')) + 2)];
                    return $picture;
                }, $selection['photos']);
                return $selection;
            }, $order['subjectCode']);

            $order['subjectCode'] = array_map(function($selection) {
                $selection['photos'] = array_map(function($picture) {
                    $picture['url'] = substr($picture['url'], strlen(Configure::read('Directories.transacExtraPub')) + 2);
                    return $picture;
                }, $selection['photos']);
                return $selection;
            }, $order['subjectCode']);

            // Validate cart
            $session = $this->Session->find('first', [
                'conditions' => [
                   'Session.id' => $order['sessionId'],
                   'Session.expire_date >=' => date('Y-m-d'),
                   'Session.publish_date <=' => date('Y-m-d'),
                   'Session.archived' => false
                ]
            ]);

            if (empty($session)) {
                throw new NotFoundException("Session {$order['sessionId']} not found");
            }

            $products = array_reduce($this->Product->find('all', [
                   'contain' => [
                       'ProductCatalog',
                       'ProductCategory',
                       'ProductTypeTheme'
                   ]
               ]),
                function($products, $product) {
                    $products[$product['Product']['id']] = array_merge($product['Product'], [
                        'ProductTypeTheme' => $product['ProductTypeTheme'],
                        'ProductCatalog' => $product['ProductCatalog'],
                        'ProductCategory' => $product['ProductCategory']
                    ]);
                    return $products;
                }, []);
            $themes = array_reduce($this->ProductThemeSet->find('all'),
                function($themes, $theme) {
                    $themes[$theme['ProductThemeSet']['id']] = $theme['ProductThemeSet'];
                    return $themes;
                }, []);
            $order = array_reduce($order['cart'],
                function($order, &$cartItem) use ($products, $session, $themes) {
                    switch ($cartItem['productId']) {
                    case 'touchup':
                        $this->_processTouchupProduct($order, $session, $cartItem);
                        break;

                    case 'digital':
                        $this->_processDigitalsProduct($order, $session, $cartItem);
                        break;

                    default:
                        $this->_processDbProduct($order, $products[$cartItem['productId']], $products, $cartItem, $themes);
                        break;
                    }

                    return $order;
                }, array_merge($order, ['orderSubtotal' => 0.0, 'weight' => 0]));
            $virtualOnly = array_reduce($order['cart'], function($virtualOnly, $cartItem) {
                return $virtualOnly && ($cartItem['productId'] === 'digital' || $cartItem['productId'] === 'touchup');
            }, true);

            // Save to session and DB
            CakeSession::write('Order.sessionId', $order['sessionId']);
            CakeSession::write('Order.cart', $order['cart']);
            CakeSession::write('Order.photoSelection', $order['photoSelection_internal']);
            CakeSession::write('Order.subjectCode', $order['subjectCode_internal']);
            CakeSession::write('Order.subtotal', $order['orderSubtotal']);
            CakeSession::write('Order.weight', $order['weight']);
            CakeSession::write('Order.virtualOnly', $virtualOnly);
            $orderId = $this->Order->savePreCompleteStage(
                $order['sessionId'], $order['photoSelection_internal'], $order['cart'], $order['orderSubtotal'], $order['comment'], CakeSession::read('Order.id'));
            if (empty($orderId)) {
                throw new ErrorException("Order::complete: Failed to save to DB");
            }
            CakeSession::write('Order.id', $orderId);

            // Prepare variables for View
            $cashRegister = CashRegister::create();
            $cashRegister->orderSubtotal = $order['orderSubtotal'];
            $cashRegister->promo = 0;
            $activeCcProcessor = $this->_getActiveCcProcessor();
            $payment = Payment::create();

            $this->set('cashRegister', $cashRegister);
            $this->set('taxes', Taxes::get());
            $this->set('activeCcProcessor', $activeCcProcessor);
            $this->set('paymentLinks', $payment->getLinks());
            $this->set('shippingConfig', $this->StoreConfig->configFreeShipping());
            $this->set('cart', $order['cart']);
            $this->set('photoSelection', $order['photoSelection']);
            $this->set('products', $products);
            $this->set('contact', CakeSession::Read('Order.contact'));
            $this->set('comment', CakeSession::Read('Order.comment'));
            $this->set('virtualOnly', $virtualOnly);
        } catch (NotFoundException $error) {
            $this->redirect(['controller' => 'order', 'action' => 'no_session']);
        }
    }

    public function no_session() {
    }

    /* PRIVATE */
    private function _calculateDigitalsPrice($order, $session, $cartItem) {
        $photoSelection = $cartItem['selection'];
        $digitalsPrice = $session['Session']['options']['digitalPrice'];
        $digitalsGroupPrice = $session['Session']['options']['digitalGroupPrice'];
        $discountPrices = isset($session['Session']['options']['discountPrices']) ? $session['Session']['options']['discountPrices'] : null;
        $discountGroupPrices = isset($session['Session']['options']['discountGroupPrices']) ? $session['Session']['options']['discountGroupPrices'] : null;
        $discountElegibleSelection = $this->_getDiscountEligibleSelectionFromProducts($session, $order['cart']);
        $counts = $this->_countDigitalCopyType($order['photoSelection'], $photoSelection, $discountElegibleSelection);
        $price = 0;
        $groupPrice = 0;
        $discountPrice = 0;
        $discountGroupPrice = 0;

        $consideredDigitalCount = $counts['digitalCount'] + $counts['discountDigitalCount'];
        if ($consideredDigitalCount > 0) {
            $price = array_reduce(($consideredDigitalCount <= count($digitalsPrice) ?
                array_slice($digitalsPrice, 0, $consideredDigitalCount) :
                array_merge(
                    $digitalsPrice,
                    array_fill(0, $consideredDigitalCount - count($digitalsPrice),
                        array_values(array_slice($digitalsPrice, -1))[0]))
            ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);
        }

        $consideredGroupDigitalCount = $counts['groupDigitalCount'] + $counts['discountGroupDigitalCount'];
        if ($digitalsGroupPrice && $consideredGroupDigitalCount > 0) {
            $groupPrice = array_reduce(($consideredGroupDigitalCount <= count($digitalsGroupPrice) ?
                array_slice($digitalsGroupPrice, 0, $consideredGroupDigitalCount) :
                array_merge(
                    $digitalsGroupPrice,
                    array_fill(0, $consideredGroupDigitalCount - count($digitalsGroupPrice),
                        array_values(array_slice($digitalsGroupPrice, -1))[0]))
            ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);
        }

        $discountDigitalCount = $counts['discountDigitalCount'];
        if ($discountPrices && $discountDigitalCount > 0) {
            $discountPrice = array_reduce(($discountDigitalCount <= count($discountPrices) ?
                array_slice($discountPrices, 0, $discountDigitalCount) :
                array_merge(
                    $discountPrices,
                    array_fill(0, $discountDigitalCount - count($discountPrices),
                        array_values(array_slice($discountPrices, -1))[0]))
            ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);
        }

        $discountGroupDigitalCount = $counts['discountGroupDigitalCount'];
        if ($discountGroupPrices && $discountGroupDigitalCount > 0) {
            $discountGroupPrice = array_reduce(($discountGroupDigitalCount <= count($discountGroupPrices) ?
                array_slice($discountGroupPrices, 0, $discountGroupDigitalCount) :
                array_merge(
                    $discountGroupPrices,
                    array_fill(0, $discountGroupDigitalCount - count($discountGroupPrices),
                        array_values(array_slice($discountGroupPrices, -1))[0]))
            ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);
        }

        return round($price +
            $groupPrice -
            $discountPrice -
            $discountGroupPrice, 2);
    }

    private function _calculateItemSubtotal($product, $selectionCount, $quantity, $cartItem) {
        $price = 0;

        if (isset($product['options']['usePriceScale']) && $product['options']['usePriceScale']) {
            $totalProductCount = $selectionCount * $quantity;
            if (!empty($product['options']['digitalImage'])) {
                $digitalImageSlice = explode(',', $product['options']['digitalImage']);
            }

            $price =
                array_reduce(($totalProductCount <= count($product['options']['priceScale']) ?
                        array_slice($product['options']['priceScale'], 0, $totalProductCount) :
                        array_merge(
                            $product['options']['priceScale'],
                            array_fill(0, $totalProductCount - count($product['options']['priceScale']),
                                       array_values(array_slice($product['options']['priceScale'], -1))[0]))
                    ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);

            if (isset($product['options']['digitalImage']) && $product['options']['digitalImage']
                    && isset($cartItem['digitalImage']) && $cartItem['digitalImage'] === '1') {
                $price +=
                    array_reduce(($totalProductCount <= count($digitalImageSlice) ?
                        array_slice($digitalImageSlice, 0, $totalProductCount) :
                        array_merge(
                            $digitalImageSlice,
                            array_fill(0, $totalProductCount - count($digitalImageSlice),
                                array_values(array_slice($digitalImageSlice, -1))[0]))
                    ), function($sum, $slidePrice) {return $sum + (float) $slidePrice;}, 0);
            }
        } else {
            $price = round($product['price'] * $selectionCount * $quantity, 2);

            if (isset($product['options']['digitalImage']) &&
                isset($cartItem['digitalImage']) && $cartItem['digitalImage'] === '1') {

                $price += (float) $product['options']['digitalImage'] * $selectionCount;
            }
        }

        return $price;
    }

    private function _countDigitalCopyType($orderSelection, $photoSelection, $discountEligibleSelection) {
        $digitalCount = 0;
        $groupDigitalCount = 0;
        $discountDigitalCount = 0;
        $discountGroupDigitalCount = 0;

        foreach ($photoSelection as $photoId) {
           $photo = $orderSelection[$photoId];

           if (!$photo) {
               continue;
           }

           if (isset($photo['image']) && isset($photo['image']['groupId']) && in_array($photoId, $discountEligibleSelection)) {
               ++$discountGroupDigitalCount;
           } else if (isset($photo['image']) && isset($photo['image']['groupId'])) {
               ++$groupDigitalCount;
           } else if (in_array($photoId, $discountEligibleSelection)) {
               ++$discountDigitalCount;
           } else {
               ++$digitalCount;
           }
        }

        return [
           'digitalCount' => $digitalCount,
           'groupDigitalCount' => $groupDigitalCount,
           'discountDigitalCount' => $discountDigitalCount,
           'discountGroupDigitalCount' => $discountGroupDigitalCount
        ];
    }

    private function _getActiveCcProcessor() {
        return Configure::read('Stripe.enabled')
            ? 'Stripe'
            : (Configure::read('ConvergeAPI.enabled')
                ? 'ConvergeAPI'
                : null);
    }

    private function _getDiscountEligibleSelectionFromProducts($session, $cart) {
        if (!isset($session['Session']['options']['discountCatalogId'])) {
            return [];
        }

        $discountProductIds = $this->ProductCatalog->findProducts($session['Session']['options']['discountCatalogId']);

        if (empty($discountProductIds) || $discountProductIds === null) {
            return [];
        }

        $eligibleItems = array_filter($cart, function($item) use ($discountProductIds) {
            return in_array($item['productId'], $discountProductIds);
        });
        $eligibleSelection = array_reduce($eligibleItems, function($selection, $item) {
            return array_merge($selection, $item['selection']);
        }, []);

        return array_unique($eligibleSelection);
    }

    private function _processDbProduct(&$order, $product, $products, &$cartItem, $themes) {
        $productId = (int) $cartItem['productId'];

        if (empty($products[$productId])) {
            throw new NotFoundException("Product {$cartItem['productId']} not found");
        }

        if (!isset($products[$productId]['options']['allowMix']) || !$products[$productId]['options']['allowMix']) {
            $lastSubjectCode = '';
            foreach ($cartItem['selection'] as $selectionId) {
                if (!empty($order['photoSelection'][$selectionId]['image']['group'])) {
                    continue;
                }
                if (!empty($lastSubjectCode) && $order['photoSelection'][$selectionId]['image']['subjectCode'] !== $lastSubjectCode) {
                    throw new FatalErrorException("OrderController::complete: Mix children found on product disallowing it");
                }
                $lastSubjectCode = $order['photoSelection'][$selectionId]['image']['subjectCode'];
            }
        }

        if (!isset($products[$productId]['options']['groupPhotoAllow']) || !$products[$productId]['options']['groupPhotoAllow']) {
            foreach ($cartItem['selection'] as $selectionId) {
                if (!empty($order['photoSelection'][$selectionId]['image']['group'])) {
                    throw new FatalErrorException("OrderController::complete: Group picture found on product disallowing it");
                }
            }
        }

        if ($product['type'] === 'themed') {
            $cartItem['themeSet'] = $themes[$product['ProductTypeTheme']['theme_set_id']]['themes'][$cartItem['theme']];
        }

        $itemSubtotal = $this->_calculateItemSubtotal($products[$cartItem['productId']], count($cartItem['selection']), $cartItem['quantity'], $cartItem);
        $cartItem['productName'] = $products[$cartItem['productId']]['name_locale'];
        $cartItem['productType'] = $products[$cartItem['productId']]['type'];
        $cartItem['productNameLocale'] = $products[$cartItem['productId']]['name_locale_original'];
        $cartItem['productPrice'] = (float) $products[$cartItem['productId']]['price'];
        $cartItem['productImage'] = (!$cartItem['theme'] || $cartItem['theme'] === '')
             ? (isset($products[$cartItem['productId']]['options']['defaultImage'])
                 ? $products[$cartItem['productId']]['images'][$products[$cartItem['productId']]['options']['defaultImage']]
                 : (count(array_values($products[$cartItem['productId']]['images'])) > 0
                    ? array_values($products[$cartItem['productId']]['images'])[0]
                    : 'img/missing_image.png'))
             :  $products[$cartItem['productId']]['images'][$products[$cartItem['productId']]['ProductTypeTheme']['themes_map'][$cartItem['theme']]];
        $cartItem['itemSubtotal'] = $itemSubtotal;
        $cartItem['comment'] = substr($cartItem['comment'], 0, 150);
        $cartItem['quantity'] = (int) $cartItem['quantity'];

        $order['orderSubtotal'] += $itemSubtotal;
        $order['weight'] += $products[$cartItem['productId']]['weight'] * $cartItem['quantity'] * count($cartItem['selection']);
    }

    private function _processDigitalsProduct(&$order, $session, &$cartItem) {
        $price = $this->_calculateDigitalsPrice($order, $session, $cartItem);

        $cartItem['productNameLocale'] = ['fr' => 'Fichiers numériques', 'en' => 'Digital files'];
        $cartItem['productName'] = CakeSession::read('Config.language') == 'en' ? 'Digital files' : 'Fichiers numériques';
        $cartItem['productType'] = 'digital';
        $cartItem['productImage'] = 'img/digitals.webp';
        $cartItem['productPrice'] = $price;
        $cartItem['itemSubtotal'] = $price;

        $order['orderSubtotal'] += $cartItem['itemSubtotal'];
    }

    private function _processTouchupProduct(&$order, $session, &$cartItem) {
        $cartItem['productNameLocale'] = ['fr' => 'Retouche', 'en' => 'Touchup'];
        $cartItem['productName'] = CakeSession::read('Config.language') == 'en' ? 'Touchup' : 'Retouche';
        $cartItem['productType'] = 'touchup';
        $cartItem['productImage'] = 'img/touchups.webp';
        $cartItem['productPrice'] = $session['Session']['options']['touchupsPrice'][0];
        $cartItem['itemSubtotal'] = $session['Session']['options']['touchupsPrice'][0];

        $order['orderSubtotal'] += $cartItem['itemSubtotal'];
    }
}
