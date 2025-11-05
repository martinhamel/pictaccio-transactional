<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class HTTP_CLIENT_CONFIG {
    public static $config = [
        'fallback' => [
            'CurlClient',
            'FileGetContentClient'
        ]
    ];
}
