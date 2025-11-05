QUnit.test('Object.create can create new objects', function (assert) {
	var ref = {
			prop1: 'test',
			prop2: 'test'
		},
		obj1 = Object.create(ref),
		obj2 = Object.create(ref);

	assert.equal(Object.keys(Object.create(null)).length, 0, 'Object.create(null) created an empty object');

	obj1.prop1 = 'something else';
	assert.notDeepEqual(obj1, obj2, 'Object.create() created object with different context');
});
