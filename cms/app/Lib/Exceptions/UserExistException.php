<?php

class UserExistException extends RuntimeException {
    public function __construct($user) {
        parent::__construct("User '{$user}' already exist", 100001);
        $this->_user = $user;
    }
}
