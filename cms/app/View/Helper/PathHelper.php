<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */


App::uses('Path', 'Lib');

class PathHelper extends AppHelper {
	public function __call($name, $arguments) {
		return forward_static_call_array(array('Path', $name), $arguments);
	}
}
