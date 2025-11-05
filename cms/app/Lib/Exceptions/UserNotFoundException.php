<?php

class UserNotFoundException extends RuntimeException {
    public function __construct($user) {
        parent::__construct("User '{$user}' not found", 100003);
        $this->_user = $user;
    }
}
