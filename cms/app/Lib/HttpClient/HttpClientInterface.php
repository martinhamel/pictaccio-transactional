<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface HttpClientInterface {
    /**
     * @return mixed An array describing the capability of the client
     * {
     *    'addPostFile' bool,
     *    'methodConnect' bool,
     *    'methodDelete' bool,
     *    'methodGet' bool,
     *    'methodHead' bool,
     *    'methodOptions' bool,
     *    'methodPost' bool,
     *    'methodPut' bool,
     *    'methodTrace' bool,
     *  'getBody' bool,
     *    'getHeaders' bool,
     *    'setHeaders' bool
     * }
     */
    public function getCaps();

    /**
     * @return bool Returns true if this client is available
     */
    public function isAvailable();

    /**
     * @param array $options An options with the desired options.
     * {
     *  'url' string,
     *  'method' string HTTP method
     *  'header' array
     * }
     *
     * @return void
     */
    public function open(array $options);

    public function addPostFile();

    /**
     * @param array $options Same as HttpClientInterface::open
     * @return void
     */
    public function send(array $options = null);

    /**
     * @return array Responses broken down in an array
     * {
     *  'header' array
     *  'body' string
     * }
     */
    public function getResponse();
}
