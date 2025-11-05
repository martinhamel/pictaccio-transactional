<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class Category extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank'
    ];
}
