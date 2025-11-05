QUnit.test('HTMLInputElement.checkValidity', function (assert) {
	var $checkValidityEmptyRequired = jQuery('#checkValidity-empty-required'),
		$checkValidityEmptyNotrequired = jQuery('#checkValidity-empty-notrequired'),
		$checkValidityNotemptyRequired = jQuery('#checkValidity-notempty-required'),
		$checkValidityNotemptyNotrequired = jQuery('#checkValidity-notempty-notrequired'),
		$checkValidityEmptyRequiredDisabled = jQuery('#checkValidity-empty-required-disabled'),
		$checkValidityNotemptyRequiredDisabled = jQuery('#checkValidity-notempty-required-disabled');

	assert.notOk($checkValidityEmptyRequired[0].checkValidity());
	assert.ok($checkValidityEmptyNotrequired[0].checkValidity());
	assert.ok($checkValidityNotemptyRequired[0].checkValidity());
	assert.ok($checkValidityNotemptyNotrequired[0].checkValidity());
	assert.ok($checkValidityEmptyRequiredDisabled[0].checkValidity());
	assert.ok($checkValidityNotemptyRequiredDisabled[0].checkValidity());
});
