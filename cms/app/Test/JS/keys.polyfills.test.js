QUnit.test('Object.keys can create an array from an Object\'s keys', function (assert) {
	assert.deepEqual(Object.keys({prop1: null, prop2: null}), ['prop1', 'prop2'], 'returned an array of the keys');
});
