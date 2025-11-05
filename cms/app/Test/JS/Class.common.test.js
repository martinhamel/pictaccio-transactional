QUnit.test('a class can be extended to create a new class', function (assert) {
	var Test = HeO2.Class.extend({init: function() {}, testMethod: function() {}, testProperty: null});
	var testInstance = new Test();
	assert.ok(Test.prototype.hasOwnProperty('testMethod'), 'The class has a method testMethod');
	assert.ok(Test.prototype.hasOwnProperty('testProperty'), 'The class has a property testProperty');
	assert.ok(testInstance.__proto__.hasOwnProperty('testMethod'), 'The instance has a method testMethod');
	assert.ok(testInstance.__proto__.hasOwnProperty('testProperty'), 'The instance has a property testProperty');
});

QUnit.test('a class constructed through HeO2.Class has common methods _loadComponent, _talk, _listen, _stopListening', function (assert) {
	var Test = HeO2.Class.extend({});
	var testInstance = new Test();
	assert.ok(Test.prototype._loadComponent !== undefined, 'The class has common method _loadComponent');
	assert.ok(Test.prototype._talk !== undefined, 'The class has common method _talk');
	assert.ok(Test.prototype._listen !== undefined, 'The class has common method _listen');
	assert.ok(Test.prototype._stopListening !== undefined, 'The class has common method _stopListening');
	assert.ok(testInstance._loadComponent !== undefined, 'The instance has common method _loadComponent');
	assert.ok(testInstance._talk !== undefined, 'The instance has common method _talk');
	assert.ok(testInstance._listen !== undefined, 'The instance has common method _listen');
	assert.ok(testInstance._stopListening !== undefined, 'The instance has common method _stopListening');
});
