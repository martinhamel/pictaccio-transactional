<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface RateSourceInterface {
    /**
     * @param $from Three letter currency code
     * @param $to Three letter currency code
     * @return float A float indicating the current rate
     */
    public function getRate($from, $to);
}
