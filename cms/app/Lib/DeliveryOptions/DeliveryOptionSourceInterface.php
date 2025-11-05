<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface DeliveryOptionSourceInterface {
    public static function friendlyId();

    public function configure($properties);

    public function enumProperties();

    public function eta();

    public function hasLateFees();

    public function id();

    public function label($html = false);

    public function name();

    public function price();

    public function priceLate();

    public function setDestination($address);

    public function setWeight($weight);

    public function visible();
}
