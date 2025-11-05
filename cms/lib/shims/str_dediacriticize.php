<?php

function str_dediacriticize($str) {
	$DIACRITICS = array('ë', 'ï', 'ü', 'ä', 'ö', 'ç', 'Ë', 'Ï', 'Ü', 'Ä', 'Ö', 'Ç');
	$LATIN = array('e', 'i', 'u', 'a', 'o', 'c', 'E', 'I', 'U', 'A', 'O', 'C');

	return str_replace($DIACRITICS, $LATIN, $str);
}
