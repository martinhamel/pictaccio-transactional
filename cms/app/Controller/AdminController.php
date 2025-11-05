<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('Path', 'Lib');
App::uses('JsonLocaleExpander', 'Lib');
App::uses('PrivateController', 'Controller' . DS . 'Abstracts');
App::uses('AdminDropin', 'Controller' . DS . 'AdminDropins');
App::uses('AdminDropinHostInterface', 'Controller' . DS . 'Abstracts');
App::uses('BuildInfo', 'Lib');

define('ARUZIA_ADMINCONTROLLER_ADMIN_DROPINS_PATH', Path::join(APP, 'Controller', 'AdminDropins'));

class AdminController extends PrivateController implements AdminDropinHostInterface {
    public $components = ['Access', 'User'];

    /* CONSTANTS */
    const _ADMIN_DROPINS_PATH = ARUZIA_ADMINCONTROLLER_ADMIN_DROPINS_PATH;
    const _ADMIN_DROPIN_POSTFIX = 'Dropin';
    const _ADMIN_DROPIN_MANIFEST = 'manifest';


    /* FIELDS */
    private $_apiCallDetected = false;
    private $_dashDisabled = false;
    private $_dropins = [];
    private $_dropinsByCategory = [];
    private $_silenced = false;


    /* CONTRUCTOR */
    public function __construct($request = null, $response = null) {
        parent::__construct($request, $response);
    }


    /* LIFECYCLE */
    public function beforeFilter() {
        if (!$this->User->isAuthenticated()) {
            CakeSession::write('Flags.redirectUrl', $this->request->here);
            $this->redirect(['controller' => 'accounts', 'action' => 'login', 'private' => false]);
        }

        parent::beforeFilter();
        $this->_listInstalledDropins();
    }


    /* PUBLIC ACTIONS */
 /*   public function auth() {
        if ($this->request->is('post')) {
            if ($this->request->data['authkey'] === Configure::read('Admin.authkey')) {
                CakeSession::write('Admin.token', true);
                $this->redirect(Router::url(CakeSession::read('Admin.returnUrl'), true));
            }
        }
    }*/

    public function private_index($dropinUuid = null, $action = null) {
        $content = '';
        $dropin = null;

        if (!empty($dropinUuid)) {
            $dropin = $this->_executeDropin($dropinUuid, $action, array_slice(func_get_args(), 2));
        }

        if ($this->_apiCallDetected || $this->_silenced) {
            return;
        }

        $content = $dropin ?
            $dropin->render() :
            ($dropinUuid ?
                $this->_renderError('Missing dropin', "Cannot find dropin with UUID '{$dropinUuid}'") :
                ''); // View will render index if no content is given

        $this->set('categoryName', empty($dropin) ? '' : $dropin->getCategoryName());
        $this->set('dropinName', empty($dropin) ? '' : $dropin->getName());
        $this->set('dropin_content', $content);
        $this->set('dropins', $this->_dropinsByCategory);
        $this->set('nodash', $this->_dashDisabled);
        $this->set('buildInfoString', BuildInfo::makeInfoString($this->build));
        $this->set('dropinUuid', $dropinUuid);
        $this->layout = 'admin';
    }


    /* PRIVATE */
    private function _executeDropin($uuid, $action, $args) {
        $dropinInfo = $this->_getDropin($uuid);

        $dropinInfo['ref']->execute($action, $args);
        return $dropinInfo['ref'];
    }

    private function _getDropin($uuid) {
        if (empty($this->_dropins[$uuid])) {
            HeO2Log::error("AdminDropin | Cannot find dropin with UUID '{$uuid}'");
            return false;
        }

        $dropinInfo = $this->_dropins[$uuid];
        if (empty($dropinInfo['ref'])) {
            require Path::join($dropinInfo['path'], $dropinInfo['controller']) . '.php';
            $dropinInfo['ref'] = new $dropinInfo['controller']($dropinInfo, $this);
            $this->_loadDropinJsModuleIntoView($dropinInfo);
        }

        return $dropinInfo;
    }

    private function _getDropinLastUpdate($path) {
        $dropinLastModification = 0;
        $dropinDirectoryHandle = opendir($path);
        while ($file = readdir($dropinDirectoryHandle)) {
            if ($file !== '.sass-cache') {
                $testFilePath = Path::join($path, $file);
                $fileLastModification = filemtime($testFilePath);
                if (Path::isFile($testFilePath) && $fileLastModification > $dropinLastModification) {
                    $dropinLastModification = $fileLastModification;
                }
            }
        }

        return $dropinLastModification;
    }

    private function _listInstalledDropins() {
        $dropinFolderHandler = opendir(self::_ADMIN_DROPINS_PATH);
        while ($file = readdir($dropinFolderHandler)) {
            if ($file !== '.' && $file !== '..') {
                $dropinPath = Path::join(self::_ADMIN_DROPINS_PATH, $file);
                if (Path::isDirectory($dropinPath) &&
                    substr($file, -strlen(self::_ADMIN_DROPIN_POSTFIX) === self::_ADMIN_DROPIN_POSTFIX)
                ) {
                    $this->_loadDropinManifest($dropinPath);
                }
            }
        }

        $this->_sortDropinsCategories();
    }

    private function _loadDropinManifest($path) {
        $manifestPath = Path::join($path, self::_ADMIN_DROPIN_MANIFEST);
        if (Path::exist($manifestPath)) {
            $manifest = JsonLocaleExpander::expandSet(
                json_decode(file_get_contents($manifestPath), true)
            );
            if (!isset($this->_dropins[$manifest['uuid']])) {
                $dropinControllerFilename = Path::baseFilename($path);
                if (Path::exist(Path::join($path, $dropinControllerFilename)) . '.php') {
                    $this->_dropins[$manifest['uuid']] = [
                        'updated' => $this->_getDropinLastUpdate($path),
                        'path' => $path,
                        'controller' => $dropinControllerFilename,
                        'manifest' => $manifest
                    ];
                    if (empty($this->_dropinsByCategory[$manifest['category_locale']])) {
                        $this->_dropinsByCategory[$manifest['category_locale']] = [];
                    }
                    $this->_dropinsByCategory[$manifest['category_locale']][] = &$this->_dropins[$manifest['uuid']];
                } else{
                    HeO2Log::warning(("AdminDropin | Cannot find dropin controller '{$dropinControllerFilename}' in '{$path}'"));
                }
            } else{
                HeO2Log::warning("AdminDropin | UUID conflict between '{$path}' and '{$this->_dropins[$manifest['uuid']]['path']}'");
            }
        } else{
            HeO2Log::warning('AdminDropin | Cannot find manifest ' . $manifestPath);
        }
    }

    private function _loadDropinJsModuleIntoView($dropinInfo) {
        if (!empty($dropinInfo['manifest']['js_modules'])) {
            $this->set('dropin_script_load', "require('{$dropinInfo['manifest']['js_modules']}', admin_loaded);");
        }
    }

    private function _renderError($title, $description, $code = null) {
        return <<<HTML
<h2>{$title}</h2>
<p class="error">{$description}</p>
<pre>{$code}</pre>
HTML;
    }

    private function _sortDropinsCategories() {
        $orderSortFunc = create_function('$a, $b', 'return $a[\'manifest\'][\'order\'] === $b[\'manifest\'][\'order\'] ? strcmp($a[\'manifest\'][\'name_locale\'], $b[\'manifest\'][\'name_locale\']) : $a[\'manifest\'][\'order\'] > $b[\'manifest\'][\'order\'];');
        foreach ($this->_dropinsByCategory as &$category) {
            usort($category, $orderSortFunc);
        }
        ksort($this->_dropinsByCategory);
    }

    /* AdminDropinInterface */
    public function checkGet(array $expectQueryVariables = [], $redirect = null) {
        return $this->_expectGet($expectQueryVariables, $redirect);
    }

    public function checkPost($expectPostVariables = [], $redirect = null) {
        return $this->_expectPost($expectPostVariables, $redirect);
    }

    public function checkSession($expectSessionVariables, $redirect = null) {
        return $this->_expectSession($expectSessionVariables, $redirect);
    }

    public function disableHeO2Dash() {
        $this->_dashDisabled = true;
    }

    public function getDropin($uuid) {
        return $this->_getDropin($uuid)['ref'];
    }

    public function getRequest() {
        return $this->request;
    }

    public function renderJson($jsonData) {
        $this->_apiCallDetected = true;
        $this->_renderJson($jsonData);
        $this->autoLayout = false;
        $this->layout = false;
        $this->render(DS . 'Layouts' . DS . 'json' . DS . 'default');
    }

    public function silence() {
        $this->_silenced = true;
        $this->autoLayout = false;
        $this->layout = false;
        $this->render(false);
    }

    public function throwBadRequest($message = '') {
        http_response_code(500);
        throw new BadRequestException($message);
    }

    public function throwNotFound($message = '') {
        throw new NotFoundException($message);
    }
}
