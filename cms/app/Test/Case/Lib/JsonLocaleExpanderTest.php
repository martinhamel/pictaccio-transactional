<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('JsonLocaleExpander', 'Lib');

class JsonLocaleExpanderTest extends CakeTestCase {
	private $testModelSetTest = array(
			array(
				'products' => array(
					'product_id' => 1,
					'product_name_locale_json' => '{"eng": "Product 1", "fra": "Produit 1"}'
				),
				'categories' => array(
					'category_id' => 1,
					'category_name_locale_json' => '{"eng": "Category 1", "fra": "Catégorie 1"}'
				)
			), array(
				'products' => array(
					'product_id' => 2,
					'product_name_locale_json' => '{"eng": "Product 2", "fra": "Produit 2"}'
				),
				'categories' => array(
					'category_id' => 2,
					'category_name_locale_json' => '{"eng": "Category 2", "fra": "Catégorie 2"}'
				)
			)
		);
	private $testModelSetTestSingle = array(
			'products' => array(
				'product_id' => 1,
				'product_name_locale_json' => '{"eng": "Product 1", "fra": "Produit 1"}'
			),
			'categories' => array(
				'category_id' => 1,
				'category_name_locale_json' => '{"eng": "Category 1", "fra": "Catégorie 1"}'
			)
		);
	private $resultModelSetTest = array(
			array(
				'products' => array(
					'product_id' => 1,
					'product_name_locale' => 'Product 1',
					'product_name_locale_json' => '{"eng": "Product 1", "fra": "Produit 1"}'
				),
				'categories' => array(
					'category_id' => 1,
					'category_name_locale' => 'Category 1',
					'category_name_locale_json' => '{"eng": "Category 1", "fra": "Catégorie 1"}'
				)
			), array(
				'products' => array(
					'product_id' => 2,
					'product_name_locale' => 'Product 2',
					'product_name_locale_json' => '{"eng": "Product 2", "fra": "Produit 2"}'
				),
				'categories' => array(
					'category_id' => 2,
					'category_name_locale' => 'Category 2',
					'category_name_locale_json' => '{"eng": "Category 2", "fra": "Catégorie 2"}'
				)
			)
		);
	private $resultModelSetTestSingle = array(
		'products' => array(
			'product_id' => 1,
			'product_name_locale' => 'Product 1',
			'product_name_locale_json' => '{"eng": "Product 1", "fra": "Produit 1"}'
		),
		'categories' => array(
			'category_id' => 1,
			'category_name_locale' => 'Category 1',
			'category_name_locale_json' => '{"eng": "Category 1", "fra": "Catégorie 1"}'
		)
	);

	public function setUp() {
		parent::setUp();
		Configure::write('Config.language', 'eng');
	}

	public function test_expand() {
		$this->assertEquals($this->resultModelSetTest, JsonLocaleExpander::expandModelSet($this->testModelSetTest));
		$this->assertEquals($this->resultModelSetTestSingle, JsonLocaleExpander::expandModelSet($this->testModelSetTestSingle));
	}
}
