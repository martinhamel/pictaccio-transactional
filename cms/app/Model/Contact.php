<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Contact extends AppModel {
    public function saveAddress($contactId, $contacts, Address $address, $newsletter = false) {
        if (empty($contactId)) {
            $this->create();
        } else{
            $this->id = $contactId;
        }

        $previous = $this->find('first', [
            'conditions' => [
                'first_name' => $contacts['first-name'],
                'last_name' => $contacts['last-name'],
                'email' => $contacts['email'],
                'phone' => $contacts['phone'],
                'street_address_1' => $address->streetAddress1(),
                'street_address_2' => $address->streetAddress2(),
                'city' => $address->city(),
                'region' => $address->region(),
                'postal_code' => $address->postalCode(),
                'country' => $address->country()
            ]
        ]);
        if (!empty($previous)) {
            $this->id = $previous['Contact']['id'];
        }

        $this->save([
            'first_name' => $contacts['first-name'],
            'last_name' => $contacts['last-name'],
            'email' => $contacts['email'],
            'phone' => $contacts['phone'],
            'street_address_1' => $address->streetAddress1(),
            'street_address_2' => $address->streetAddress2(),
            'city' => $address->city(),
            'region' => $address->region(),
            'postal_code' => $address->postalCode(),
            'country' => $address->country(),
            'newsletter' => $newsletter === 'true' ? 1 : 0
        ]);

        return $this->id;
    }
}
