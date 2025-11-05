export const appConfig = `
<?php
Configure::write('Config.shutdown', false);
Configure::write('Config.shutdownMessage', 'This site is currently under maintenance. Please come back later.');

Configure::write('Language.available', ['fr','en']); // <- Array of configured languages
Configure::write('Language.fallback', 'fr'); // <- Fallback language
Configure::write('Config.default', 'fr'); // <- Default language

/**
 * Customizations
 */
Configure::write('Customizations.storeName', 'Pictaccio');

/**
 * Customer styles
 */
Configure::write('Customizations.colors.accent', '#84b74e');
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
Configure::write('Contacts.email', 'default');
Configure::write('Contacts.phoneNumber', 'default');
Configure::write('Contacts.addressLine1', 'default');
Configure::write('Contacts.addressLine2','default');
Configure::write('Contacts.city', 'default');
Configure::write('Contacts.region', 'default');
Configure::write('Contacts.country', 'default');
Configure::write('Contacts.postalCode', 'default');

/**
 * Canada Post
 */
Configure::write('CanadaPost.enabled', false);
Configure::write('CanadaPost.username', 'default');
Configure::write('CanadaPost.password', 'default');
Configure::write('CanadaPost.customerNumber', 'default');
Configure::write('CanadaPost.certificate', APP . 'Lib' . DS . 'Shipping' . DS . 'ShippingSources' . DS . 'CanadaPost' . DS . 'cacert.pem');
Configure::write('CanadaPost.apiUrl', 'https://ct.soa-gw.canadapost.ca/rs/ship/price');

/**
 * Taxes
 */
Configure::write('Taxes.locality', 'ca-qc');
Configure::write('Taxes.qst', .09975);
Configure::write('Taxes.qstId', 'default');
Configure::write('Taxes.gst', .05);
Configure::write('Taxes.gstId', 'default');
Configure::write('Taxes.hst', .13);
Configure::write('Taxes.hstId', 'default');
Configure::write('Taxes.pst', .06);
Configure::write('Taxes.pstId', 'default');

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
Configure::write('Stripe.enabled', false);
Configure::write('Stripe.publishableKey', 'default');
Configure::write('Stripe.secretKey', 'default');

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
Configure::write('Notify.addresses', ['default']);

/**
 * Admin contacts
 */
Configure::write('Admin.emails', ['default']);

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

Configure::write('URL.root', 'default');
Configure::write('URL.startOrder', Router::url(['controller' => 'order', 'action' => 'choose']));
Configure::write('URL.webCodeRequests', Router::url(['controller' => 'pages', 'action' => 'code_requests']));
Configure::write('URL.termsAndConditions', 'default');
Configure::write('URL.contactUs', 'default');
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
`.trim();

export const databaseConfig = `
<?php
require 'db_vars.php';

class DATABASE_CONFIG {
    public $default = array(
        'datasource' => 'Database/Postgres',
        'persistent' => false,
        'host' => DB_HOST,
        'login' => DB_USERNAME,
        'password' => DB_PASSWORD,
        'database' => DB_NAME,
        'prefix' => '',
        'encoding' => 'utf8',
        'unix_socket' => '',
        'schema' => 'transactional'
    );
    
    public $public = array(
        'datasource' => 'Database/Postgres',
        'persistent' => false,
        'host' => DB_HOST,
        'login' => DB_USERNAME,
        'password' => DB_PASSWORD,
        'database' => DB_NAME,
        'prefix' => '',
        'encoding' => 'utf8',
        'unix_socket' => '',
        'schema' => 'public'
    );
}
`.trim();

export const databaseVars = `
<?php
define('DB_HOST', getenv('DB_HOST'));
define('DB_USERNAME', getenv('DB_USERNAME'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_NAME', getenv('DB_DATABASE_NAME'));
`.trim();

export const coreConfig = `
<?php
/**
 * This is core configuration file.
 *
 * Use it to configure core behavior of Cake.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Config
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * CakePHP Debug Level:
 *
 * Production Mode:
 * 	0: No error messages, errors, or warnings shown. Flash messages redirect.
 *
 * Development Mode:
 * 	1: Errors and warnings shown, model caches refreshed, flash messages halted.
 * 	2: As in 1, but also with full debug messages and SQL output.
 *
 * In production mode, flash messages redirect after a time interval.
 * In development mode, you need to click the flash message to continue.
 */
Configure::write('debug', {{DEBUG_VALUE}});

/**
 * Configure the Error handler used to handle errors for your application. By default
 * ErrorHandler::handleError() is used. It will display errors using Debugger, when debug > 0
 * and log errors with CakeLog when debug = 0.
 *
 * Options:
 *
 * - handler - callback - The callback to handle errors. You can set this to any callable type,
 *   including anonymous functions.
 *   Make sure you add App::uses('MyHandler', 'Error'); when using a custom handler class
 * - level - integer - The level of errors you are interested in capturing.
 * - trace - boolean - Include stack traces for errors in log files.
 *
 * @see ErrorHandler for more information on error handling and configuration.
 */
	Configure::write('Error', array(
		'handler' => 'ErrorHandler::handleError',
		'level' => E_ALL & ~E_DEPRECATED,
		'trace' => true
	));

/**
 * Configure the Exception handler used for uncaught exceptions. By default,
 * ErrorHandler::handleException() is used. It will display a HTML page for the exception, and
 * while debug > 0, framework errors like Missing Controller will be displayed. When debug = 0,
 * framework errors will be coerced into generic HTTP errors.
 *
 * Options:
 *
 * - handler - callback - The callback to handle exceptions. You can set this to any callback type,
 *   including anonymous functions.
 *   Make sure you add App::uses('MyHandler', 'Error'); when using a custom handler class
 * - renderer - string - The class responsible for rendering uncaught exceptions. If you choose a custom class you
 *   should place the file for that class in app/Lib/Error. This class needs to implement a render method.
 * - log - boolean - Should Exceptions be logged?
 * - skipLog - array - list of exceptions to skip for logging. Exceptions that
 *   extend one of the listed exceptions will also be skipped for logging.
 *   Example: 'skipLog' => array('NotFoundException', 'UnauthorizedException')
 *
 * @see ErrorHandler for more information on exception handling and configuration.
 */
	Configure::write('Exception', array(
		'handler' => 'ErrorHandler::handleException',
		'renderer' => 'ExceptionRenderer',
		'log' => true
	));

/**
 * Application wide charset encoding
 */
	Configure::write('App.encoding', 'UTF-8');

/**
 * To configure CakePHP *not* to use mod_rewrite and to
 * use CakePHP pretty URLs, remove these .htaccess
 * files:
 *
 * /.htaccess
 * /app/.htaccess
 * /app/webroot/.htaccess
 *
 * And uncomment the App.baseUrl below. But keep in mind
 * that plugin assets such as images, CSS and JavaScript files
 * will not work without URL rewriting!
 * To work around this issue you should either symlink or copy
 * the plugin assets into you app's webroot directory. This is
 * recommended even when you are using mod_rewrite. Handling static
 * assets through the Dispatcher is incredibly inefficient and
 * included primarily as a development convenience - and
 * thus not recommended for production applications.
 */
	//Configure::write('App.baseUrl', env('SCRIPT_NAME'));

/**
 * To configure CakePHP to use a particular domain URL
 * for any URL generation inside the application, set the following
 * configuration variable to the http(s) address to your domain. This
 * will override the automatic detection of full base URL and can be
 * useful when generating links from the CLI (e.g. sending emails)
 */
Configure::write('App.fullBaseUrl', rtrim(getenv('BASE_URL'), '/'));

/**
 * Web path to the public images directory under webroot.
 * If not set defaults to 'img/'
 */
	//Configure::write('App.imageBaseUrl', 'img/');

/**
 * Web path to the CSS files directory under webroot.
 * If not set defaults to 'css/'
 */
	//Configure::write('App.cssBaseUrl', 'css/');

/**
 * Web path to the js files directory under webroot.
 * If not set defaults to 'js/'
 */
	//Configure::write('App.jsBaseUrl', 'js/');

/**
 * Uncomment the define below to use CakePHP prefix routes.
 *
 * The value of the define determines the names of the routes
 * and their associated controller actions:
 *
 * Set to an array of prefixes you want to use in your application. Use for
 * admin or other prefixed routes.
 *
 * 	Routing.prefixes = array('admin', 'manager');
 *
 * Enables:
 *	admin_index() and /admin/controller/index
 *	manager_index() and /manager/controller/index
 *
 */
	//Configure::write('Routing.prefixes', array('admin'));

/**
 * Turn off all caching application-wide.
 *
 */
	//Configure::write('Cache.disable', true);

/**
 * Enable cache checking.
 *
 * If set to true, for view caching you must still use the controller
 * public $cacheAction inside your controllers to define caching settings.
 * You can either set it controller-wide by setting public $cacheAction = true,
 * or in each action using $this->cacheAction = true.
 *
 */
	//Configure::write('Cache.check', true);

/**
 * Enable cache view prefixes.
 *
 * If set it will be prepended to the cache name for view file caching. This is
 * helpful if you deploy the same application via multiple subdomains and languages,
 * for instance. Each version can then have its own view cache namespace.
 * Note: The final cache file name will then be prefix_cachefilename.
 */
	//Configure::write('Cache.viewPrefix', 'prefix');

/**
 * Session configuration.
 *
 * Contains an array of settings to use for session configuration. The defaults key is
 * used to define a default preset to use for sessions, any settings declared here will override
 * the settings of the default config.
 *
 * ## Options
 *
 * - Session.cookie - The name of the cookie to use. Defaults to 'CAKEPHP'
 * - Session.timeout - The number of minutes you want sessions to live for. This timeout is handled by CakePHP
 * - Session.cookieTimeout - The number of minutes you want session cookies to live for.
 * - Session.checkAgent - Do you want the user agent to be checked when starting sessions? You might want to set the
 *    value to false, when dealing with older versions of IE, Chrome Frame or certain web-browsing devices and AJAX
 * - Session.defaults - The default configuration set to use as a basis for your session.
 *    There are four builtins: php, cake, cache, database.
 * - Session.handler - Can be used to enable a custom session handler. Expects an array of callables,
 *    that can be used with session_save_handler. Using this option will automatically add session.save_handler
 *    to the ini array.
 * - Session.autoRegenerate - Enabling this setting, turns on automatic renewal of sessions, and
 *    sessionids that change frequently. See CakeSession::$requestCountdown.
 * - Session.ini - An associative array of additional ini values to set.
 *
 * The built in defaults are:
 *
 * - 'php' - Uses settings defined in your php.ini.
 * - 'cake' - Saves session files in CakePHP's /tmp directory.
 * - 'database' - Uses CakePHP's database sessions.
 * - 'cache' - Use the Cache class to save sessions.
 *
 * To define a custom session handler, save it at /app/Model/Datasource/Session/<name>.php.
 * Make sure the class implements CakeSessionHandlerInterface and set Session.handler to <name>
 *
 * To use database sessions, run the app/Config/Schema/sessions.php schema using
 * the cake shell command: cake schema create Sessions
 *
 */
	Configure::write('Session', array(
		'defaults' => 'php',
		'cookie' => 'HeO2UID',
		'timeout' => 2629746,
		'cookieTimeout' => 2629746
	));

/**
 * A random string used in security hashing methods.
 */
	Configure::write('Security.salt', '3xcurvtif8a5a1sf8mx8ymyn94omz5b1if0y96uto9d3j4udnp');

/**
 * A random numeric string (digits only) used to encrypt/decrypt strings.
 */
	Configure::write('Security.cipherSeed', '82514659777746363690098317465989815');

/**
 * Apply timestamps with the last modified time to static assets (js, css, images).
 * Will append a query string parameter containing the time the file was modified. This is
 * useful for invalidating browser caches.
 *
 * Set to true to apply timestamps when debug > 0. Set to 'force' to always enable
 * timestamping regardless of debug value.
 */
	//Configure::write('Asset.timestamp', true);

/**
 * Compress CSS output by removing comments, whitespace, repeating tags, etc.
 * This requires a/var/cache directory to be writable by the web server for caching.
 * and /vendors/csspp/csspp.php
 *
 * To use, prefix the CSS link URL with '/ccss/' instead of '/css/' or use HtmlHelper::css().
 */
	//Configure::write('Asset.filter.css', 'css.php');

/**
 * Plug in your own custom JavaScript compressor by dropping a script in your webroot to handle the
 * output, and setting the config below to the name of the script.
 *
 * To use, prefix your JavaScript link URLs with '/cjs/' instead of '/js/' or use JsHelper::link().
 */
	//Configure::write('Asset.filter.js', 'custom_javascript_output_filter.php');

/**
 * The class name and database used in CakePHP's
 * access control lists.
 */
	Configure::write('Acl.classname', 'DbAcl');
	Configure::write('Acl.database', 'default');

/**
 * Uncomment this line and correct your server timezone to fix
 * any date & time related errors.
 */
	//date_default_timezone_set('UTC');

/**
 *
 * Cache Engine Configuration
 * Default settings provided below
 *
 * File storage engine.
 *
 * 	 Cache::config('default', array(
 *		'engine' => 'File', //[required]
 *		'duration' => 3600, //[optional]
 *		'probability' => 100, //[optional]
 * 		'path' => CACHE, //[optional] use system tmp directory - remember to use absolute path
 * 		'prefix' => 'cake_', //[optional]  prefix every cache file with this string
 * 		'lock' => false, //[optional]  use file locking
 * 		'serialize' => true, //[optional]
 * 		'mask' => 0664, //[optional]
 *	));
 *
 * APC (http://pecl.php.net/package/APC)
 *
 * 	 Cache::config('default', array(
 *		'engine' => 'Apc', //[required]
 *		'duration' => 3600, //[optional]
 *		'probability' => 100, //[optional]
 * 		'prefix' => Inflector::slug(APP_DIR) . '_', //[optional]  prefix every cache file with this string
 *	));
 *
 * Xcache (http://xcache.lighttpd.net/)
 *
 * 	 Cache::config('default', array(
 *		'engine' => 'Xcache', //[required]
 *		'duration' => 3600, //[optional]
 *		'probability' => 100, //[optional]
 *		'prefix' => Inflector::slug(APP_DIR) . '_', //[optional] prefix every cache file with this string
 *		'user' => 'user', //user from xcache.admin.user settings
 *		'password' => 'password', //plaintext password (xcache.admin.pass)
 *	));
 *
 * Memcache (http://www.danga.com/memcached/)
 *
 * 	 Cache::config('default', array(
 *		'engine' => 'Memcache', //[required]
 *		'duration' => 3600, //[optional]
 *		'probability' => 100, //[optional]
 * 		'prefix' => Inflector::slug(APP_DIR) . '_', //[optional]  prefix every cache file with this string
 * 		'servers' => array(
 * 			'127.0.0.1:11211' // localhost, default port 11211
 * 		), //[optional]
 * 		'persistent' => true, // [optional] set this to false for non-persistent connections
 * 		'compress' => false, // [optional] compress data in Memcache (slower, but uses less memory)
 *	));
 *
 *  Wincache (http://php.net/wincache)
 *
 * 	 Cache::config('default', array(
 *		'engine' => 'Wincache', //[required]
 *		'duration' => 3600, //[optional]
 *		'probability' => 100, //[optional]
 *		'prefix' => Inflector::slug(APP_DIR) . '_', //[optional]  prefix every cache file with this string
 *	));
 */

/**
 * Configure the cache handlers that CakePHP will use for internal
 * metadata like class maps, and model schema.
 *
 * By default File is used, but for improved performance you should use APC.
 *
 * Note: 'default' and other application caches should be configured in app/Config/bootstrap.php.
 *       Please check the comments in bootstrap.php for more info on the cache engines available
 *       and their settings.
 */
$engine = 'File';

// In development mode, caches should expire quickly.
$duration = '+999 days';
if (Configure::read('debug') > 0) {
	$duration = '+10 seconds';
}

// Prefix each application on the same server with a different string, to avoid Memcache and APC conflicts.
$prefix = 'pictaccio';

/**
 * Configure the cache used for general framework caching. Path information,
 * object listings, and translation cache files are stored with this configuration.
 */
Cache::config('_cake_core_', array(
	'engine' => $engine,
	'prefix' => $prefix . 'cake_core_',
	'path' => CACHE . 'persistent' . DS,
	'serialize' => ($engine === 'File'),
	'duration' => $duration
));

/**
 * Configure the cache for model and datasource caches. This cache configuration
 * is used to store schema descriptions, and table listings in connections.
 */
Cache::config('_cake_model_', array(
	'engine' => $engine,
	'prefix' => $prefix . 'cake_model_',
	'path' => CACHE . 'models' . DS,
	'serialize' => ($engine === 'File'),
	'duration' => $duration
));


Configure::write('Routing.prefixes', array('private'/*, 'api'*/));
`.trim();
