QUnit.test('sprintf can format a string', function (assert) {
	assert.equal(HeO2.sprintf('test %s test %d', 'test', 1234), 'test test test 1234', "formatted to 'test test test 1234'");
});

QUnit.test('sprintf supports string', function (assert) {
	assert.equal(HeO2.sprintf('test %s test', 'test'), 'test test test', "formatted to 'test test test'");
	assert.equal(HeO2.sprintf('test %.2s test', 'test'), 'test te test', "formatted to 'test te test'");
});

QUnit.test('sprintf supports numbers', function (assert) {
	assert.equal(HeO2.sprintf('test %d test', 1234), 'test 1234 test', "formatted to 'test 1234 test'");
	assert.equal(HeO2.sprintf('test %d test', -1234), 'test -1234 test', "formatted to 'test -1234 test'");
});

QUnit.test('sprintf supports character', function (assert) {
	assert.equal(HeO2.sprintf('test %c test', 65), 'test A test', "formatted to 'test A test'");
});

QUnit.test('sprintf supports decimal', function (assert) {
	assert.equal(HeO2.sprintf('test %d test', 65), 'test 65 test', "formatted to 'test 65 test'");
});

QUnit.test('sprintf supports exponential notation', function (assert) {
	assert.equal(HeO2.sprintf('test %e test', 65000000000000), 'test 6.5e+13 test', "formatted to 'test 6.5E13 test'");
});

QUnit.test('sprintf supports float', function (assert) {
	assert.equal(HeO2.sprintf('test %f test', 3.141592), 'test 3.141592 test', "formatted to 'test 3.141592 test'");
	assert.equal(HeO2.sprintf('test %.4f test', 3.141592), 'test 3.1416 test', "formatted to 'test 3.1416 test'");
});

QUnit.test('sprintf supports octal', function (assert) {
	assert.equal(HeO2.sprintf('test %o test', 9), 'test 11 test', "formatted to 'test 11 test'");
});

QUnit.test('sprintf supports unsigned', function (assert) {
	assert.equal(HeO2.sprintf('test %u test', -65), 'test 65 test', "formatted to 'test 65 test'");
});

QUnit.test('sprintf supports hexa', function (assert) {
	assert.equal(HeO2.sprintf('test %x test', 256), 'test 100 test', "formatted to 'test 100 test'");
	assert.equal(HeO2.sprintf('test %x test', 1000), 'test 3e8 test', "formatted to 'test 3e8 test'");
	assert.equal(HeO2.sprintf('test %X test', 256), 'test 100 test', "formatted to 'test 100 test'");
	assert.equal(HeO2.sprintf('test %X test', 1000), 'test 3E8 test', "formatted to 'test 3E8 test'");
});
