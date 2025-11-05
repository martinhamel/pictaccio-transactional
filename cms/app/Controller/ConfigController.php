<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ConfigController extends AppController {
    /* PUBLIC ACTIONS */
    public function lang() {
        if (empty($this->request->data['lang'])) {
            throw new BadRequestException();
        }

        if (array_search($this->request->data['lang'], Configure::read('Language.available')) !== false) {
            $this->Session->write('Config.language', $this->request->data['lang']);
        }
    }
}
