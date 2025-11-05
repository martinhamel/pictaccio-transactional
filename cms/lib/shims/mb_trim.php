<?php

function mb_trim($str) {
	return mb_ereg_replace('^[[:space:]]*([\s\S]*?)[[:space:]]*$', '\1', $str );
}
