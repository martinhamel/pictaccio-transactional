<?php

/*
 * HeO2 client platform test runner
 */

set_time_limit(0);
ini_set('display_errors', 1);

/**
 * Use the DS to separate the directories in other defines
 */
if (!defined('DS')) {
	define('DS', DIRECTORY_SEPARATOR);
}

/**
 * These defines should only be edited if you have cake installed in
 * a directory layout other than the way it is distributed.
 * When using custom settings be sure to use the DS and do not add a trailing DS.
 */

/**
 * The full path to the directory which holds "app", WITHOUT a trailing DS.
 *
 */
if (!defined('ROOT')) {
	define('ROOT', dirname(dirname(dirname(__FILE__))));
}

/**
 * The actual directory name for the "app".
 *
 */
if (!defined('APP_DIR')) {
	define('APP_DIR', basename(dirname(dirname(__FILE__))));
}

/**
 * The absolute path to the "Cake" directory, WITHOUT a trailing DS.
 *
 * For ease of development CakePHP uses PHP's include_path. If you
 * need to cannot modify your include_path, you can set this path.
 *
 * Leaving this constant undefined will result in it being defined in Cake/bootstrap.php
 *
 * The following line differs from its sibling
 * /lib/Cake/Console/Templates/skel/webroot/test.php
 */
//define('CAKE_CORE_INCLUDE_PATH', ROOT . DS . 'lib');

/**
 * Editing below this line should not be necessary.
 * Change at your own risk.
 *
 */
if (!defined('WEBROOT_DIR')) {
	define('WEBROOT_DIR', basename(dirname(__FILE__)));
}
if (!defined('WWW_ROOT')) {
	define('WWW_ROOT', dirname(__FILE__) . DS);
}

if (!defined('CAKE_CORE_INCLUDE_PATH')) {
	if (function_exists('ini_set')) {
		ini_set('include_path', ROOT . DS . 'lib' . PATH_SEPARATOR . ini_get('include_path'));
	}
	if (!include 'Cake' . DS . 'bootstrap.php') {
		$failed = true;
	}
} else {
	if (!include CAKE_CORE_INCLUDE_PATH . DS . 'Cake' . DS . 'bootstrap.php') {
		$failed = true;
	}
}
if (!empty($failed)) {
	trigger_error("CakePHP core could not be found. Check the value of CAKE_CORE_INCLUDE_PATH in APP/webroot/index.php. It should point to the directory containing your " . DS . "cake core directory and your " . DS . "vendors root directory.", E_USER_ERROR);
}

if (Configure::read('debug') < 1) {
	throw new NotFoundException(__d('cake_dev', 'Debug setting does not allow access to this url.'));
}

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Heliox Creation - HeO2 client platform tests</title>
	<link rel="stylesheet" href="css/qunit.css">
</head>
<body>
<div id="qunit"></div>
<div id="qunit-fixture"></div>
<script src="js/test/qunit.js"></script>
<script src="js/bootstrap.js"></script>
<script>
	var HeO2 = {__unittest__: true};
	var serverUrl = 'http://192.168.1.139:8080/photosfv2/cms/';
	var btJsPath = serverUrl + 'js';
	bootstrap();
	require('jquery common forms adminForms validator grid ui effects goal template overview', function() {
		var $ = jQuery.noConflict();
	});
	var oldQUnitModule = QUnit.module,
		file = '';
	QUnit.module = function(name, params) {
		oldQUnitModule(file + ' | ' + name, params);
	};
</script>

<div style="display: none">
<?php $jsTestDirectory = APP . 'Test' . DS .'JS';
$jsDirectoryHandle = opendir($jsTestDirectory);
while ($file = readdir($jsDirectoryHandle)): if ($file !== '.' && $file !== '..' && substr($file, -12) === 'fixture.html'): ?>
	<? echo file_get_contents($jsTestDirectory . DS . $file); ?>
<?php endif; endwhile; closedir($jsDirectoryHandle); ?>
</div>

<?php
$jsDirectoryHandle = opendir($jsTestDirectory);
while ($file = readdir($jsDirectoryHandle)): if ($file !== '.' && $file !== '..' && substr($file, -7) === 'test.js'):?>
	<script>
		file = '<?php echo $file; ?>';
		<?php $content = file_get_contents($jsTestDirectory . DS . $file);
		if (substr(trim($content), 0, strlen('QUnit.module')) !== 'QUnit.module'):?>
		QUnit.module('Generic');
		<?php endif; echo $content; ?>
	</script>
<?php endif; endwhile; closedir($jsDirectoryHandle); ?>
</body>
</html>
