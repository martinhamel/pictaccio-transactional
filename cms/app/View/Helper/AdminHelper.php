<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */


class AdminHelper extends AppHelper {
	public function dropinUrl($uuid, $action = 'index', array $args = array()) {
		return
			str_replace('/private', '', str_replace('/index', '',
				Router::url(
					array_merge(
						array('controller' => 'admin', 'private' => true, $uuid, $action),
						$args
					)
				)
			));
	}
}
