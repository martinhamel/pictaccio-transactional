QUnit.test('trim added to String objects', function (assert) {
	assert.ok(jQuery.isFunction(''.trim), 'trim is present');
});

QUnit.test('when called with no param, trim removes trailing whitespace characters at the beginning and end of the string', function (assert) {
	var whitespace = ' \f\n\r\t\v\u00A0\u2028\u2029';

	for (var i = 0; i < whitespace.length; ++i) {
		assert.equal((whitespace.substr(i, 1) + 'test' + whitespace.substr(i, 1)).trim(), 'test', 'spaces have been removed');
		assert.equal((whitespace.substr(i, 1) + 'test').trim(), 'test', 'spaces have been removed');
		assert.equal(('test' + whitespace.substr(i, 1)).trim(), 'test', 'spaces have been removed');
	}
});

QUnit.test('can trim specified characters', function (assert) {
	assert.equal('---test---'.trim('-'), 'test', "trimmed to 'test'");
	assert.equal('-!-test-!-'.trim('-'), '!-test-!', "trimmed to '!-test-!'");
	assert.equal('test,'.trim(','), 'test', "trimmed to 'test'");
	assert.equal('!@#test#@!'.trim('!@#'), 'test', "trimmed to 'test'");
});
