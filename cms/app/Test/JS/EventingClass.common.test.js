QUnit.test('EventingClass has the following public methods: on, off, emit', function (assert) {
	assert.ok(HeO2.EventingClass.prototype.on !== undefined, 'EventintClass.on is present');
	assert.ok(HeO2.EventingClass.prototype.off !== undefined, 'EventintClass.off is present');
	assert.ok(HeO2.EventingClass.prototype.emit !== undefined, 'EventintClass.emit is present');
});

QUnit.test('on, off, emit return the object itself for chaining', function (assert) {
	var test = new HeO2.EventingClass();

	assert.deepEqual(test, test.on('test', function() {}));
	assert.deepEqual(test, test.off('test', function() {}));
	assert.deepEqual(test, test.emit('test'));
});

QUnit.test('can register callbacks with event names', function (assert) {
	assert.expect(2);

	var test = new HeO2.EventingClass(),
		asyncEvent1 = assert.async(),
		asyncEvent2 = assert.async();

	test.on('event1', function() {
		assert.ok(true, 'event1 was called');
		asyncEvent1();
	});
	test.on('event2', function() {
		assert.ok(true, 'event2 was called');
		asyncEvent2();
	});

	test.emit('event1');
	test.emit('event2');
});

QUnit.test('one off callbacks are called only once', function (assert) {
	assert.expect(0);

	var test = new HeO2.EventingClass(),
		asyncEvent = assert.async();

	test.on('event', function() {
		asyncEvent();
	}, null, true);
	test.emit('event');
	test.emit('event');
});

QUnit.test('parameters can be passed to callbacks', function (assert) {
	assert.expect(1);

	var test = new HeO2.EventingClass(),
		testParam = {prop1: 'string', prop2: 1},
		asyncEvent = assert.async();

	test.on('event', function(param) {
		assert.deepEqual(testParam, param);
		asyncEvent();
	});
	test.emit('event', testParam);
});

QUnit.test('calling context can be set', function (assert) {
	assert.expect(1);

	var test = new HeO2.EventingClass(),
		testContext = {prop1: 'string', prop2: 1},
		asyncEvent = assert.async();

	test.on('event', function(param) {
		assert.deepEqual(testContext, this);
		asyncEvent();
	}, testContext);
	test.emit('event');
});
