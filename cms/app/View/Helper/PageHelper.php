<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */


class PageHelper extends AppHelper {
	public $helpers = array('Html');

	public function make($route, array $pages) {
		$pageLinks = '';
		$count = 0;
		foreach ($pages as $page) {
			$pageLinks .=
				'<a href="' .
				$this->_makeUrl($route, array($page['offset'], $page['limit'])) .
				'">' . $count++ . '</a> ';
		}

		return $pageLinks;
	}

	/* PRIVATE */
	private function _makeUrl($urlOrRoute, $params) {
		if (is_array($urlOrRoute)) {
			return $this->Html->url(array_merge($urlOrRoute, $params));
		} else {
			$url = $this->Html->url($urlOrRoute);
			if (substr($url, -1, 1) !== '/') {
				$url .= '/';
			}
			return $url . implode('/', $params);
		}
	}
}
