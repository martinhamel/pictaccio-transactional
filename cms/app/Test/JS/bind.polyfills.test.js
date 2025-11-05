QUnit.test('Function.bind can bind a context with a function', function (assert) {
	var o = {test: 'test'},
		f = function() {
			assert.deepEqual(this, o, 'context was correctly set');
		};

	f.bind(o)();
});
