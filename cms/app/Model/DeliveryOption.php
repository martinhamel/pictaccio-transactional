<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class DeliveryOption extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $validate = [
        'id' => 'blank'
    ];
}
