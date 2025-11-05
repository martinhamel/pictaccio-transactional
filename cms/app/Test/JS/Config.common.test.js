QUnit.test('Config.load can load a remote configuration', function (assert) {
	assert.expect(3);

	var config = new HeO2.Config(),
		promise = config.load(serverUrl + 'exports/config.json'),
		configLoadedAsync = assert.async();

	assert.ok(jQuery.isFunction(promise.promise), 'Config.load returns a promise');

	promise.done(function () {
		assert.ok(HeO2.Config.prototype.__configLoaded, '__configLoaded flag is true');
		assert.notOk(jQuery.isEmptyObject(HeO2.Config.prototype.__config), '__config is not empty');
		configLoadedAsync();
	});
});

QUnit.test('Config.get can read a configuration option', function (assert) {
	assert.expect(1);

	var config = new HeO2.Config(),
		promise = config.load(serverUrl + 'exports/config.json'),
		configLoadedAsync = assert.async();

	promise.done(function () {
		assert.deepEqual(config.get('Language.available'), ['fra', 'eng'], "config.get('Language.available') should return ['fra', 'eng'], dependent on current configuration");
		configLoadedAsync();
	});
});
