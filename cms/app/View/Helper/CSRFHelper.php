<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */


class CSRFHelper extends AppHelper {
    public function makeCSRFTokenField() {
        /*if (!CakeSession::check('Config.csrf')) {
            throw new FatalErrorException('No CSRF token in session');
        }

        $token = CakeSession::read('Config.csrf');*/
        return "";
    }
}
