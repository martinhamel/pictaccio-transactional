QUnit.test('Number.isInteger returns true for integers', function(assert) {
	assert.ok(Number.isInteger(1));       // true
	assert.ok(Number.isInteger(-100000)); // true
	assert.ok(Number.isInteger(0));       // true
});

QUnit.test('Number.isInteger returns false for non integer', function(assert) {
	assert.notOk(Number.isInteger(0.1));     // false
	assert.notOk(Number.isInteger(Math.PI)); // false
	assert.notOk(Number.isInteger(NaN));     // false
	assert.notOk(Number.isInteger("10"));    // false
});
