<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface AdminDropinHostInterface {
    public function checkGet(array $expectQueryVariables = [], $redirect = null);

    public function checkPost($expectPostVariables = [], $redirect = null);

    public function checkSession($expectSessionVariables, $redirect = null);

    public function disableHeO2Dash();

    public function getDropin($uuid);

    public function getRequest();

    public function renderJson($jsonData);

    public function silence();

    public function throwBadRequest();

    public function throwNotFound();
}
