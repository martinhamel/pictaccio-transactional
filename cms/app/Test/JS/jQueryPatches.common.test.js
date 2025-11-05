QUnit.test('jQuery is patched to return the correct width of display:none elements', function (assert) {
	assert.equal(jQuery('#jquerypatches-common-fixture-width-height').width(), 100, 'jQuery.width() return 100 for display:none div');
});

QUnit.test('jQuery is patched to return the correct height of display:none elements', function (assert) {
	assert.equal(jQuery('#jquerypatches-common-fixture-width-height').height(), 100, 'jQuery.height() return 100 for display:none div');
});
