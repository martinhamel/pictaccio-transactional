<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Path', 'Lib');

class ItemImageHelper extends AppHelper {
	private $_assetDirectory;

	public function first($item) {
		$assets = $this->_findAsset($item);
		if (empty($assets)) {
			return null;
		}

		return Router::url('/' . $assets[0]['Asset']['path']);
	}


	/* PRIVATE */
	private function _findAsset($item) {
		if (isset($item['Product'])) {
			return $this->_fromProduct($item);
		} else if (isset($item['Package'])) {
			return $this->_fromPackage($item);
		}

		return null;
	}

	private function _fromPackage($item) {
		return $item['Package']['PackageAssetMap'];
	}

	private function _fromProduct($item) {
		return $item['Product']['ProductAssetMap'];
	}
}
