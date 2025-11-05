<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface ShippingSourceInterface {
    /**
     * @param array $params
     * {
     *  origin and destination: {
     *   apartment:
     *   civicNumber:
     *   streetName:
     *   city:
     *   province:
     *   country:
     *   postalCode:
     *  },
     *  weight:
     *  dimensions: {
     *   width:
     *   height:
     *   length:
     *  }
     * }
     *
     * @return mixed
     */
    function getRates(array $params);
}
