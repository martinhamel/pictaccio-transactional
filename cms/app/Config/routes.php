<?php
/**
 * Routes configuration
 *
 * In this file, you set up routes to your controllers and their actions.
 * Routes are very important mechanism that allows you to freely connect
 * different URLs to chosen controllers and their actions (functions).
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

Router::parseExtensions('json');

/* PAGES */
Router::connect('/shutdown', ['controller' => 'pages', 'action' => 'shutdown']);
Router::connect('/checkout', ['controller' => 'order', 'action' => 'complete']);
Router::connect('/#services', ['controller' => 'pages', 'action' => 'home#services']);
Router::connect('/#contact-us', ['controller' => 'pages', 'action' => 'home#contact-us']);
Router::connect('/home', ['controller' => 'pages', 'action' => 'home']);
Router::connect('/daycare', ['controller' => 'pages', 'action' => 'daycare']);
Router::connect('/sport', ['controller' => 'pages', 'action' => 'sport']);
Router::connect('/graduation', ['controller' => 'pages', 'action' => 'graduation']);
Router::connect('/school', ['controller' => 'pages', 'action' => 'school']);
Router::connect('/garderies', ['controller' => 'pages', 'action' => 'daycare']);
Router::connect('/sport', ['controller' => 'pages', 'action' => 'sport']);
Router::connect('/finissants', ['controller' => 'pages', 'action' => 'graduation']);
Router::connect('/scolaire', ['controller' => 'pages', 'action' => 'school']);
Router::connect('/about-us', ['controller' => 'pages', 'action' => 'aboutUs']);
Router::connect('/contact-us', ['controller' => 'pages', 'action' => 'contact_us']);
Router::connect('/code_request', ['controller' => 'pages', 'action' => 'code_request']);
Router::connect('/terms_and_conditions', ['controller' => 'pages', 'action' => 'terms_and_conditions']);
Router::connect('/account', ['controller' => 'accounts', 'action' => 'index']);
Router::connect('/bits/:token', ['controller' => 'pages', 'action' => 'digitals', 'private' => false]);
Router::connect('/', ['controller' => 'pages', 'action' => 'home']);

/* ADMIN */
Router::connect('/admin', ['controller' => 'Admin', 'action' => 'index', 'private' => true]);
Router::connect('/admin/auth', ['controller' => 'Admin', 'action' => 'auth']);
Router::connect('/admin/*', ['controller' => 'Admin', 'action' => 'index', 'private' => true]);

/* SPECIALS */
Router::connect('/nous-joindre.php', ['controller' => 'pages', 'action' => 'home']);
Router::connect('/events/ecole-auclair', ['controller' => 'pages', 'action' => 'event_auclair']);
Router::connect('/events/oree-du-bois', ['controller' => 'pages', 'action' => 'event_oreedubois']);

CakePlugin::routes();

require CAKE . 'Config' . DS . 'routes.php';
