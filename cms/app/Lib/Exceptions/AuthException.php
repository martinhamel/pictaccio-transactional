<?php

class AuthException extends RuntimeException {
    public function __construct($reason) {
        parent::__construct("Auth failure: ${reason}", 100005);
    }
}
