<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Controller', 'Controller');
App::uses('LanguageFallback', 'Lib');
App::uses('Path', 'Lib');

class AppController extends Controller {
    public $components = [
        'DebugKit.Toolbar',
        'Session'
    ];

    public $build = '2023.19-1';

    public function beforeFilter() {
        parent::beforeFilter();

        $this->set('buildString', $this->build);
        $this->_checkLanguage();
        $this->_checkShutdown();
        //$this->CSRF->refresh();

        if (isset($this->params['api'])) {
            $this->_sendJsonHeaders();
        }

        //$this->_checkAccesses();
        $this->_filterQueryAndPostData();
    }

    /* PROTECTED */
    /**
     * @param array $expectQueryVariables
     * @param mixed $redirect Route array or string url to redirect to if the test fails. If this parameter is set to false, the method will notify the caller through a boolean return value.
     * @return bool
     */
    protected function _expectGet(array $expectQueryVariables = [], $redirect = null) {
        if (!is_array($expectQueryVariables)) {
            $expectQueryVariables = [$expectQueryVariables];
        }
        return $this->_checkRequest('get', $expectQueryVariables, $this->request->query, $redirect);
    }

    /**
     * @param array $expectPostVariables
     * @param mixed $redirect Route array or string url to redirect to if the test fails. If this parameter is set to false, the method will notify the caller through a boolean return value.
     * @return bool
     */
    protected function _expectPost($expectPostVariables = [], $redirect = null) {
        if (!is_array($expectPostVariables)) {
            $expectPostVariables = [$expectPostVariables];
        }
        return $this->_checkRequest('post', $expectPostVariables, $this->request->data, $redirect);
    }

    protected function _expectSession($expectSessionVariables, $redirect = null) {
        if (!is_array($expectSessionVariables)) {
            $expectSessionVariables = [$expectSessionVariables];
        }
        foreach ($expectSessionVariables as $variable) {
            if (!$this->Session->check($variable)) {
                if (empty($redirect)) {
                    throw new BadRequestException("Expecting SESSION variable {$variable}");
                }
                $this->redirect($redirect);
            }
        }
    }

    protected function _loadComponent($componentName, $addToThis = false, $overwrite = false) {
        $component = $this->Components->load($componentName);
        $component->initialize($this);
        if ($addToThis && (!isset($this->{$componentName}) || $overwrite)) {
            $this->{$componentName} = $component;
        }

        return $component;
    }

    protected function _sendJsonHeaders() {
        $this->autoRender = false;
        $this->autoLayout = false;
        $this->response->type('application/json');
    }

    protected function _renderJson(array $array) {
        $this->_absolutePathToServerRelative($array);
        $this->response->type('application/json');
        $this->set('json_data', $array);
        $this->render(DS . 'Layouts' . DS . 'json' . DS . 'default');
    }

    protected function _htmlEntitiesArray($array) {
        foreach ($array as &$arrayItem) {
            if (is_array($arrayItem)) {
                $arrayItem = $this->_htmlEntitiesArray($arrayItem);
            } else {
                $arrayItem = $arrayItem;
            }
        }

        return $array;
    }

    /* PRIVATE */
    private function _absolutePathToServerRelative(array &$array, $webroot = null, $webrootLength = null, $serverUrl = null) {
        $webroot = $webroot ?: Path::join(APP, 'webroot');
        $webrootLength = $webrootLength ?: strlen($webroot);
        $serverUrl = $serverUrl ?: Path::join($_SERVER['HTTP_HOST'], Router::url('/'));

        foreach ($array as &$item) {
            if (is_array($item)) {
                $this->_absolutePathToServerRelative($item, $webroot, $webrootLength, $serverUrl);
            } else if (is_string($item) && strpos($item, $webroot) === 0) {
                $item = substr($item, $webrootLength);
            }
        }
    }

    private function _checkLanguage() {
        if (strlen(Configure::read('Config.language')) === 5) {
            Configure::write('Config.language', substr(Configure::read('Config.language'), 0, 2));
        }

        if (!empty($this->request->query['lang']) &&
            array_search(substr($this->request->query['lang'], 0, 2), Configure::read('Language.available')) !== false) {
            CakeSession::write('Config.language', substr($this->request->query['lang'], 0, 2));
            header('X-Robots-Tag: noindex');
        }

        if (!CakeSession::check('Config.language')) {
            $this->set('hadNoLanguage', true);
            CakeSession::write(
                'Config.language',
                LanguageFallback::findAppropriateStatic($this->request->acceptLanguage())
            );
        } else {
            $this->set('hadNoLanguage', false);
        }
        Configure::write('Config.language', CakeSession::read('Config.language'));

        $contentLang = CakeSession::read('Config.language') === 'en' ? 'en' : 'fr';
        header("Content-Language: {$contentLang}");
    }

    private function _checkRequest($type, $expect, $variables, $redirect) {
        if (!$this->request->is($type)) {
            if ($redirect === false) {
                return false;
            } else if (empty($redirect)) {
                throw new BadRequestException("Expecting {$type} request");
            }
            $this->redirect($redirect);
        }

        foreach ($expect as $variable) {
            if (!isset($variables[$variable])) {
                if ($redirect === false) {
                    return false;
                } else if (empty($redirect)) {
                    throw new BadRequestException("Expecting {$type} variable {$variable}");
                }
                $this->redirect($redirect);
            }
        }

        return true;
    }

    private function _checkShutdown() {
        if ($this->here === '/exports/config.json') {
            return;
        }

        if (Configure::read('Config.shutdown') === true && $this->here !== '/shutdown') {
            $this->set('message', Configure::read('Config.shutdownMessage'));
            $this->render('/Pages/shutdown');
            $this->response->send();
            $this->_stop();
        }
    }

    private function _filterQueryAndPostData() {
        $this->request->query = $this->_htmlEntitiesArray($this->request->query);
        $this->request->data = $this->_htmlEntitiesArray($this->request->data);
    }
}
