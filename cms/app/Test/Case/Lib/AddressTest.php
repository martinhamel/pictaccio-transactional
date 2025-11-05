<?php

App::uses('Address', 'Lib');

class AddressTest extends CakeTestCase {
	private  $_addressCivicNumber = array(
			'civic' => '5482',
			'street' => 'Louvain',
			'city' => 'Montreal',
			'province' => 'qc',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressCivicInStreet = array(
			'street' => '5482 Louvain',
			'city' => 'Montreal',
			'state' => 'on',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressSpaceInStreet = array(
			'civic' => 5482,
			'street' => 'de Louvain',
			'city' => 'Montreal',
			'state' => 'on',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressHyphenInStreet = array(
		'civic' => 5482,
		'street' => 'de-Louvain',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressApostropheInStreet = array(
		'civic' => 5482,
		'street' => 'de\'Louvain',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressCivicSpaceInStreet = array(
			'street' => '5482 de Louvain',
			'city' => 'Montreal',
			'state' => 'on',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressCivicHyphenInStreet = array(
		'street' => '5482 de-Louvain',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressCivicApostropheInStreet = array(
		'street' => '5482 de\'Louvain',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressNumberedStreet1 = array(
		'street' => '5482 4e Rang',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressNumberedStreet2 = array(
		'street' => '5482 Route 122',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressNumberedStreet3 = array(
		'street' => '5482 Route 122',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressAccentedStreet = array(
		'street' => '5482 Rue de éèêàÀÉÊÈëçÇ',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressCommaStreet = array(
		'street' => '5482, rang du 4e Louvain',
		'city' => 'Montreal',
		'state' => 'on',
		'postalCode' => 'G0F 3D6'
	);
	private $_addressHyphenApartment = array(
	    'street' => '152-A, 15e avenue',
        'city' => 'Montreal',
        'state' => 'on',
        'postalCode' => 'G0F 3D6'
    );
	private $_addressApartment = array(
			'civic' => '5482',
			'street' => 'Louvain',
			'apartment' => '4',
			'city' => 'Montreal',
			'state' => 'Quebec',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressApartementInStreet = array(
			'street' => '5482 Louvain #4',
			'city' => 'Montreal',
			'state' => 'Ontario',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressMissing = array(
			'city' => 'Montreal',
			'state' => 'Ontario',
			'postalCode' => 'G0F 3D6'
	);
	private $_addressMalformedStreet = array(
			'street' => 'Louvain 5482',
			'city' => 'Montreal',
			'state' => 'Ontario',
			'postalCode' => 'G0F 3D6'
	);

	public function test_civicNumberSeparate() {
		$address = Address::create($this->_addressCivicNumber);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Québec', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$alternateCivicNumber = $this->_addressCivicNumber;
		$alternateCivicNumber['civicNumber'] = $alternateCivicNumber['civic'];
		unset($alternateCivicNumber['civic']);
		$address = Address::create($alternateCivicNumber);
		$this->assertEquals(5482, $address->civicNumber());

		$alternateCivicNumber = $this->_addressCivicNumber;
		$alternateCivicNumber['civic-number'] = $alternateCivicNumber['civic'];
		unset($alternateCivicNumber['civic']);
		$address = Address::create($alternateCivicNumber);
		$this->assertEquals(5482, $address->civicNumber());

		$alternateCivicNumber = $this->_addressCivicNumber;
		$alternateCivicNumber['civic_number'] = $alternateCivicNumber['civic'];
		unset($alternateCivicNumber['civic']);
		$address = Address::create($alternateCivicNumber);
		$this->assertEquals(5482, $address->civicNumber());
	}

	public function test_civicWithStreet() {
		$address = Address::create($this->_addressCivicInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$alternateStreet = $this->_addressCivicInStreet;
		$alternateStreet['address'] = $alternateStreet['street'];
		unset($alternateStreet['street']);
		$address = Address::create($alternateStreet);
		$this->assertEquals(5482, $address->civicNumber());
	}

	public function test_spaceInStreet() {
		$address = Address::create($this->_addressSpaceInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('de Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create($this->_addressCivicSpaceInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('de Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_hyphenInStreet() {
		$address = Address::create($this->_addressHyphenInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('de-Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create($this->_addressCivicHyphenInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('de-Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_apostropheInStreet() {
		$address = Address::create($this->_addressApostropheInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('de\'Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create($this->_addressCivicApostropheInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('de\'Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_numberedStreets() {
		$address = Address::create($this->_addressNumberedStreet1);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('4e Rang', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create($this->_addressNumberedStreet2);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Route 122', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create($this->_addressNumberedStreet3);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Route 122', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_accentedStreet() {
		$address = Address::create($this->_addressAccentedStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Rue de éèêàÀÉÊÈecC', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_commaStreet() {
		$address = Address::create($this->_addressCommaStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('rang du 4e Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_apartment() {
		$address = Address::create($this->_addressApartment);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Québec', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());
		$this->assertEquals('4', $address->apartment());

		$alternateApartment = $this->_addressApartment;
		$alternateApartment['app'] = $alternateApartment['apartment'];
		unset($alternateApartment['apartment']);
		$address = Address::create($alternateApartment);
		$this->assertEquals('4', $address->apartment());

		$alternateApartment = $this->_addressApartment;
		$alternateApartment['apartment'] = 'b';
		$address = Address::create($alternateApartment);
		$this->assertEquals('b', $address->apartment());
	}

	public function test_apartmentInStreet() {
		$address = Address::create($this->_addressApartementInStreet);
		$this->assertEquals(5482, $address->civicNumber());
		$this->assertEquals('Louvain', $address->street());
		$this->assertEquals('Montreal', $address->city());
		$this->assertEquals('Ontario', $address->region());
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain #B';
		$address = Address::create($alternateApartment);
		$this->assertEquals('B', $address->apartment());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain app.B';
		$address = Address::create($alternateApartment);
		$this->assertEquals('B', $address->apartment());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain app.4';
		$address = Address::create($alternateApartment);
		$this->assertEquals('4', $address->apartment());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain app. B';
		$address = Address::create($alternateApartment);
		$this->assertEquals('B', $address->apartment());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain app. 4';
		$address = Address::create($alternateApartment);
		$this->assertEquals('4', $address->apartment());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain app B';
		$address = Address::create($alternateApartment);
		$this->assertEquals('B', $address->apartment());

		$alternateApartment = $this->_addressApartementInStreet;
		$alternateApartment['street'] = '5482 Louvain app 4';
		$address = Address::create($alternateApartment);
		$this->assertEquals('4', $address->apartment());
	}

	public function testAppartmentAfterHyphen() {
/*        private $_addressHyphenAppartment = array(
            'street' => '152-A, 15e avenue',
            'city' => 'Montreal',
            'state' => 'on',
            'postalCode' => 'G0F 3D6'
        );*/

        $address = Address::create($this->_addressHyphenApartment);

        $this->assertEquals('152', $address->civicNumber());
        $this->assertEquals('A', $address->apartment());
        $this->assertTextEquals('15e avenue', $address->street());
    }

	public function test_postalCode() {
		$address = Address::create(array('postal' => 'G0F3D6'));
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create(array('postal-code' => 'G0F 3D6'));
		$this->assertEquals('G0F 3D6', $address->postalCode());

		$address = Address::create(array('code' => 'G0F 3D6'));
		$this->assertEquals('G0F 3D6', $address->postalCode());
	}

	public function test_malformedCivicWithStreet() {
		$address = Address::create(array('street' => 'Louvain 5482'));
		$this->assertNull($address->civicNumber());
		$this->assertEquals('Louvain 5482', $address->street());

		$address = Address::create(array('street' => '#5 5482 Louvain'));
		$this->assertNull($address->civicNumber());
		$this->assertEquals('Louvain', $address->street());

		$address = Address::create(array('street' => '#A 5482 Louvain'));
		$this->assertNull($address->civicNumber());
		$this->assertEquals('Louvain', $address->street());
	}

	public function test_validate() {
		$address = Address::create($this->_addressCivicNumber);
		$this->assertTrue($address->validate());

		$address = Address::create($this->_addressApartementInStreet);
		$this->assertTrue($address->validate());

		$address = Address::create($this->_addressCivicInStreet);
		$this->assertTrue($address->validate());

		$address = Address::create($this->_addressApartment);
		$this->assertTrue($address->validate());
	}

	public function test_notValidate() {
		$address = Address::create($this->_addressMissing);
		$this->assertFalse($address->validate());

		$address = Address::create($this->_addressMalformedStreet);
		$this->assertFalse($address->validate());
	}

	public function test_address1() {
	    $address = Address::create(array('street' => '280, av. Saint-Charles'));
	    $this->assertTextEquals($address->civicNumber(), '280');
	    $this->assertTextEquals($address->street(), 'av. Saint-Charles');
    }

    public function test_address2() {
        $address = Address::create(array('street' => '20 croissant de l’aigle'));
        $this->assertTextEquals($address->civicNumber(), '20');
        $this->assertTextEquals($address->street(), 'croissant de l’aigle');
    }

    public function test_address3() {
        $address = Address::create(array('street' => '1510 ch. Rockland'));
        $this->assertTextEquals($address->civicNumber(), '1510');
        $this->assertTextEquals($address->street(), 'ch. Rockland');
    }

    public function test_address4() {
        $address = Address::create(array('street' => '3, avenue Thornton'));
        $this->assertTextEquals($address->civicNumber(), '3');
        $this->assertTextEquals($address->street(), 'avenue Thornton');
    }

    public function test_address5() {
        $address = Address::create(array('street' => '2317 J.-B Vilenne'));
        $this->assertTextEquals($address->civicNumber(), '2317');
        $this->assertTextEquals($address->street(), 'J.-B Vilenne');
    }

    public function test_address6() {
        $address = Address::create(array('street' => '285 rue Hôtel-de-ville'));
        $this->assertTextEquals($address->civicNumber(), '285');
        $this->assertTextEquals($address->street(), 'rue Hôtel-de-ville');
    }

    public function test_address7() {
        $address = Address::create(array('street' => '162, 26 eme avenue'));
        $this->assertTextEquals($address->civicNumber(), '162');
        $this->assertTextEquals($address->street(), '26 eme avenue');
    }
}
