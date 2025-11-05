<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ExportsController extends AppController {
    public $components = ['RequestHandler'];

    /* PUBLIC ACTIONS */
    public function element() {
        if (!$this->request->is('post')) {
            throw new BadRequestException();
        }

        if (!empty($this->request->data['elements'])) {
            $this->_renderJson($this->_renderElements());
        }
    }

    public function config() {
        require APP . 'Config' . DS . 'exportConfigs.php';

        $configs = [];
        foreach (EXPORT_CONFIGS::$items as $key) {
            $configs[$key] = Configure::read($key);
        }

        $this->set(compact('configs'));
        $this->set('_serialize', 'configs');
    }

    public function locale($langCode, $includeAdmin = null) {
        require APP . 'Config' . DS . 'exportStrings.php';

        Configure::write('Config.language', $langCode);

        $locale = [];
        foreach (EXPORT_STRINGS::$defaults as $key) {
            $locale[$key] = __($key);
        }
        if ($includeAdmin === 'wa') {
            foreach (EXPORT_STRINGS::$admin as $key) {
                $locale[$key] = __($key);
            }
        }

        $this->set(compact('locale'));
        $this->set('_serialize', 'locale');
    }

    /* PRIVATE */
    private function _renderElements() {
        require_once APP . 'Config' . DS . 'exportElements.php';

        $view = new View();
        $view->autoLayout = false;

        $response = [];

        foreach ($this->request->data['elements'] as $element) {
            if (array_search($element['element'], EXPORT_ELEMENTS::$whitelist) === false) {
                continue;
            }

            $element['element'] = str_replace('/', DS, $element['element']);

            $response[] = [
                'requestId' => $element['requestId'],
                'rendered' => $view->element($element['element'], isset($element['params']) ? $element['params'] : [])
            ];
        }

        return $response;
    }
}
