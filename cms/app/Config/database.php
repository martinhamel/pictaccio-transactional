<?php
require 'db_vars.php';

class DATABASE_CONFIG {
    public $default = array(
        'datasource' => 'Database/Postgres',
        'persistent' => false,
        'host' => DB_HOST,
        'login' => DB_USERNAME,
        'password' => DB_PASSWORD,
        'database' => DB_NAME,
        'prefix' => '',
        'encoding' => 'utf8',
        'unix_socket' => '',
        'schema' => 'transactional'
    );
    
    public $public = array(
        'datasource' => 'Database/Postgres',
        'persistent' => false,
        'host' => DB_HOST,
        'login' => DB_USERNAME,
        'password' => DB_PASSWORD,
        'database' => DB_NAME,
        'prefix' => '',
        'encoding' => 'utf8',
        'unix_socket' => '',
        'schema' => 'public'
    );
}