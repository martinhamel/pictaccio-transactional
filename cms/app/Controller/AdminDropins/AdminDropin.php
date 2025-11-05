<?php

App::uses('Path', 'Lib');
App::uses('AdminDropinHostInterface', 'Controller' . DS . 'Abstracts');

class AdminDropin {
    const _DEFAULT_ACTION = 'index';

    /* FIELDS */
    protected $_host = null;
    protected $_viewPath = null;
    protected $_request = null;

    private $_dropinInfo = null;
    private $_view = null;
    private $_viewName = '';


    /* PUBLIC */
    public function __construct($dropinInfo, AdminDropinHostInterface $host) {
        $this->_host = $host;
        //$this->_request = $request;
        $this->_dropinInfo = $dropinInfo;
        $this->_viewPath = Path::relative($dropinInfo['path'], Path::join([APP, 'View']));
        $this->_request = $this->_host->getRequest();

        $this->_view = new View(null);
        $this->_view->layout = false;
    }

    public function execute($action, $args) {
        $renderedContent = null;

        if (empty($action)) {
            $action = self::_DEFAULT_ACTION;
        }
        $this->_setViewName($action);

        if (method_exists($this, $action)) {
            call_user_func_array([$this, $action], $args);
        } else{
            CakeLog::warning("AdminDropin | Action {$action} was not found in {$this->_dropinInfo['controller']}");
        }

        return $renderedContent;
    }

    public function getCategoryName() {
        return $this->_dropinInfo['manifest']['category_locale'];
    }

    public function getName() {
        return $this->_dropinInfo['manifest']['name_locale'];
    }

    public function render() {
        $this->_view->viewPath = $this->_viewPath;
        $this->_view->loadHelper('Admin');
        return $this->_view->render($this->_viewName) ?: 'Dropin has no content';
    }


    /* PROTECTED */
    protected function _loadModel($model) {
        $loadedModel = ClassRegistry::init($model);
        if ($loadedModel) {
            $this->{$model} = $loadedModel;
            return true;
        }
        return false;
    }

    protected function _set($key, $value) {
        $this->_view->set($key, $value);
    }

    protected function _setViewName($name) {
        $this->_viewName = $name;
    }
}
