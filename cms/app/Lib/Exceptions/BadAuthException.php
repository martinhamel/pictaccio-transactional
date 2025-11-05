<?php

class BadAuthException extends RuntimeException {
    public function __construct($user) {
        parent::__construct("Password for user '{$user}' is incorrect", 100002);
        $this->_user = $user;
    }
}
