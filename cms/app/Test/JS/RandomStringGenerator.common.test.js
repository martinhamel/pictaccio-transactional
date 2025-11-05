QUnit.test("a random string can be generated with Class._talk('random-string')", function (assert) {
	var random = HeO2.Class.prototype._talk('random-string');
	assert.ok(typeof random === 'string', 'returned value is a string');
	assert.notEqual(random, '', 'returned value is not an empty string');
});

QUnit.test('the random string is different on each call', function (assert) {
	var random = HeO2.Class.prototype._talk('random-string');
	assert.notEqual(random, HeO2.Class.prototype._talk('random-string'), 'value is different');
});

QUnit.test('the length of the string can be set', function (assert) {
	var random10 = HeO2.Class.prototype._talk('random-string', {length: 10}),
		random1 = HeO2.Class.prototype._talk('random-string', {length: 1}),
		random50 = HeO2.Class.prototype._talk('random-string', {length: 50});

	assert.equal(random10.length, 10, 'length of random string is 10');
	assert.equal(random1.length, 1, 'length of random string is 1');
	assert.equal(random50.length, 50, 'length of random string is 50');
});

QUnit.test('the string composition can be parametrized', function (assert) {
	var symbols = '!@#$%^&*()',
		randomUp = HeO2.Class.prototype._talk('random-string', {length: 50, include: {upper: true, lower: false}}),
		randomLow = HeO2.Class.prototype._talk('random-string', {length: 50, include: {upper: false, lower: true}}),
		randomNum = HeO2.Class.prototype._talk('random-string', {length: 50, include: {numbers: true, alpha: false}}),
		randomAlpha = HeO2.Class.prototype._talk('random-string', {length: 50, include: {numbers: false, alpha: true}}),
		randomSymbols = HeO2.Class.prototype._talk('random-string', {length: 50, include: {numbers: false, alpha: false, symbols: symbols}}),
		randomMix = HeO2.Class.prototype._talk('random-string', {length: 50, include: {symbols: symbols}});

	assert.ok(/^[A-Z0-9]+$/.test(randomUp), 'has only uppercase characters');
	assert.ok(/^[a-z0-9]+$/.test(randomLow), 'has only lowercase characters');
	assert.ok(/^[0-9]+$/.test(randomNum), 'has only numerical characters');
	assert.ok(/^[A-Za-z]+$/.test(randomAlpha), 'has only alpha characters');
	assert.ok(/^[!@#\$%\^&\*\(\)]+$/.test(randomSymbols), 'has only symbols characters');
	assert.ok(/^[!@#\$%\^&\*\(\)A-Za-z0-9]+$/.test(randomMix), 'has a mix of everything');
});
