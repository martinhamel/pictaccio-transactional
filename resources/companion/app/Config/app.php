<?php
Configure::write('Config.shutdown', false);
Configure::write('Config.shutdownMessage', '');

Configure::write('Language.available', ['en','fr']); // <- Array of configured languages
Configure::write('Language.fallback', 'en'); // <- Fallback language
Configure::write('Config.default', 'en'); // <- Default language

/**
 * Customizations
 */
Configure::write('Customizations.storeName', 'Chez Martin');

/**
 * Customer styles
 */
Configure::write('Customizations.colors.accent', '#ff7800');
Configure::write('Customizations.colors.background1', '#ffffff');
Configure::write('Customizations.colors.background2', '#e6e6e6');
Configure::write('Customizations.colors.background3', '#cccccc');
Configure::write('Customizations.colors.importantBackground1', '#1a1a1a');
Configure::write('Customizations.colors.importantBackground2', '#333333');
Configure::write('Customizations.decorations.borderRadius', '8px');
Configure::write('Customizations.decorations.boxShadow', '0 0 0 0 rgba(0, 0, 0, 0)');

/**
 * Internal styles
 */
Configure::write('Customizations.adminColors.accent', '#84b74e');
Configure::write('Customizations.adminColors.background1', '#000000');
Configure::write('Customizations.adminColors.background2', '#333333');
Configure::write('Customizations.adminColors.background3', '#666666');
Configure::write('Customizations.adminColors.importantBackground1', '#999999');
Configure::write('Customizations.adminColors.importantBackground2', '#cccccc');
Configure::write('Customizations.adminDecorations.borderRadius', '8px');
Configure::write('Customizations.adminDecorations.boxShadow', '0 0 0 0 rgba(0, 0, 0, 0)');

/**
 * Formats
 */
Configure::write('Formats', [
    'datetime' => '%d-%m-%Y %H:%M %p',
    'date' => '%d-%m-%Y',
    'time' => '%H:%M %p'
]);

/**
 * Order
 */
Configure::write('Order', [
    'clientCode' => [
        'maxLength' => 8
    ]
]);

/**
 * Contacts
 */
Configure::write('Contacts.email', 'service@aaa.com');
Configure::write('Contacts.phoneNumber', '');
Configure::write('Contacts.addressLine1', '1512 rue le Caron');
Configure::write('Contacts.addressLine2','');
Configure::write('Contacts.city', 'Montréal');
Configure::write('Contacts.region', 'qc');
Configure::write('Contacts.country', 'canada');
Configure::write('Contacts.postalCode', 'H4E1J8');

/**
 * Canada Post
 */
Configure::write('CanadaPost.enabled', true);
Configure::write('CanadaPost.username', 'martin@komunide.com');
Configure::write('CanadaPost.password', 'password');
Configure::write('CanadaPost.customerNumber', '1234');
Configure::write('CanadaPost.certificate', APP . 'Lib' . DS . 'Shipping' . DS . 'ShippingSources' . DS . 'CanadaPost' . DS . 'cacert.pem');
Configure::write('CanadaPost.apiUrl', 'https://ct.soa-gw.canadapost.ca/rs/ship/price');

/**
 * Taxes
 */
Configure::write('Taxes.locality', 'ca-qc');
Configure::write('Taxes.qst', 0.05);
Configure::write('Taxes.qstId', '32432432');
Configure::write('Taxes.gst', 0.05);
Configure::write('Taxes.gstId', '432423');
Configure::write('Taxes.hst', 0);
Configure::write('Taxes.hstId', '');
Configure::write('Taxes.pst', 0);
Configure::write('Taxes.pstId', '');

/**
 * Cash Register Descriptor
 */
Configure::write('CashRegister.quebec', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'qst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.qst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'qst', 'gst']
    ]
]);
Configure::write('CashRegister.ontario', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'hst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.hst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'hst']
    ]
]);
Configure::write('CashRegister.alberta', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst']
    ]
]);
Configure::write('CashRegister.saskatchewan', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'pst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.pst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst', 'pst']
    ]
]);
Configure::write('CashRegister.british-columbia', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'pst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.pst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst', 'pst']
    ]
]);
Configure::write('CashRegister.manitoba', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'pst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.pst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst', 'pst']
    ]
]);
Configure::write('CashRegister.new-brunswick', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'hst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.hst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'hst']
    ]
]);
Configure::write('CashRegister.newfoundland-and-labrador', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'hst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.hst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'hst']
    ]
]);
Configure::write('CashRegister.nova-scotia', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'hst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.hst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'hst']
    ]
]);
Configure::write('CashRegister.northwest-territories', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst']
    ]
]);
Configure::write('CashRegister.nunavut', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst']
    ]
]);
Configure::write('CashRegister.prince-edward-island', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'hst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.hst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'hst']
    ]
]);
Configure::write('CashRegister.yukon', [
    'orderSubtotal' => null,
    'shipping' => null,
    'late' => null,
    'promo' => null,
    'subtotal' => [
        'sum' => ['orderSubtotal', 'shipping', 'late']
    ],
    'subtotalPromo' => [
        'subtract' => ['subtotal', 'promo']
    ],
    'gst' => [
        'multiply' => ['subtotalPromo', Configure::read('Taxes.gst')]
    ],
    'total' => [
        'sum' => ['subtotalPromo', 'gst']
    ]
]);

/**
 * Paypal
 */
Configure::write('Paypal.enabled', false);
Configure::write('Paypal.username', 'default');
Configure::write('Paypal.password', 'default');
Configure::write('Paypal.signature', 'default');
Configure::write('Paypal.endpoint', 'default');

/**
 * Stripe
 */
Configure::write('Stripe.enabled', true);
Configure::write('Stripe.publishableKey', '321321');
Configure::write('Stripe.secretKey', '432432');

/**
 * ConvergeAPI
 */
Configure::write('ConvergeAPI.enabled', false);
Configure::write('ConvergeAPI.merchantId', 'default');
Configure::write('ConvergeAPI.userId', 'default');
Configure::write('ConvergeAPI.pin', 'default');

/**
 * Payments
 */
Configure::write('Payments', [
    'enabled' => [
        'converge', 'paypal-ec'
    ]
]);

/**
 * Orders
 */
Configure::write('Orders',
    [
        'status' => [
            0 => 'ORDER_PENDING',
            1 => 'ORDER_IN_PROGRESS',
            2 => 'ORDER_SHIPPED',
            3 => 'ORDER_COMPLETE'
        ]
    ]
);

/**
 * Directories
 */
Configure::write('Directories', [
    'static' => WWW_ROOT . 'static',
    'pictures' => WWW_ROOT . 'pub' . DS . 'photos',
    'thumbs' => WWW_ROOT . 'pub' . DS . 'thumbs',
    'assets' => WWW_ROOT . 'assets',
    'transacExtraPub' => getenv('PUBLIC_FOLDER')
]);

/**
 * Addresses to notify upon receiving an order
 */
Configure::write('Notify.addresses', ['not@aaa.com']);

/**
 * Admin contacts
 */
Configure::write('Admin.emails', ['not@aaa.com']);

/**
 * Google reCaptcha api key
 */
Configure::write('reCaptcha', [
    'secret' => 'default',
    'debug_ip' => ''
]);

/* Do not edit */
Configure::write('Private', [
    'prefix' => 'private'
]);

Configure::write('URL.root', 'https://aaa.com');
Configure::write('URL.startOrder', Router::url(['controller' => 'order', 'action' => 'choose']));
Configure::write('URL.webCodeRequests', Router::url(['controller' => 'pages', 'action' => 'code_requests']));
Configure::write('URL.termsAndConditions', 'https://aaa.com');
Configure::write('URL.contactUs', 'https://aaa.com');
Configure::write('URL.confirmPaymentSuccessPaypal', Router::url(['controller' => 'confirm'], true));
Configure::write('URL.confirmPaymentFailPaypal', Router::url(['controller' => 'confirm', 'action' => 'fail'], true));
Configure::write('URL.confirmPaymentSuccessConverge', substr(Router::url(['controller' => 'confirm']), 1));
Configure::write('URL.confirmPaymentSuccessStripe', substr(Router::url(['controller' => 'confirm']), 1));

Configure::write('Paths', [
   'siteStateConfig' => APP . DS . 'Config' . DS .  'site_state.json'
]);

Configure::write('BuildInfo', [
    'path' => APP . DS . 'Config' . DS . 'build_info.json',
    'runMode' => 'debug'
]);

Cache::config('site', [
    'engine' => 'File',
    'prefix' => '',
    'serialize' => true,
    'duration' => '+5 seconds',
    'probability' => 0
]);