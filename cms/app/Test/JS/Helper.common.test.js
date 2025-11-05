QUnit.test('Helper.isEmpty can identify empty objects', function (assert) {
	assert.ok(HeO2.Helper.isEmpty({}), '{} is empty');
	assert.ok(HeO2.Helper.isEmpty(Object.create(null), 'Object.create(null) is empty'));
	assert.ok(HeO2.Helper.isEmpty(Object.create({}), 'Object.create({}}) is empty'));
	assert.ok(HeO2.Helper.isEmpty(new Object), 'new Object is empty');
	assert.ok(HeO2.Helper.isEmpty([]), '[] is empty');
	assert.ok(HeO2.Helper.isEmpty(new Array), 'new Array is empty');
	assert.ok(HeO2.Helper.isEmpty(''), '\'\' is empty');

	assert.notOk(HeO2.Helper.isEmpty({prop: undefined}), '{prop: undefined} is not empty');
	assert.notOk(HeO2.Helper.isEmpty(0), '0 is not empty');
	assert.notOk(HeO2.Helper.isEmpty([0]), '[0] is not empty');
	assert.notOk(HeO2.Helper.isEmpty(['']), '[\'\'] is not empty');
	assert.notOk(HeO2.Helper.isEmpty(Object.create({prop: null}), 'Object.create({prop: null}) is not empty'));
});

QUnit.test('Helper.merge can merge shallow object', function (assert) {
	var obj1 = {prop1: 'val1'},
		obj2 = {prop2: 'val2'};
		obj3 = {prop3: 'val3', level: {prop3: 'val3'}};

	assert.deepEqual(HeO2.Helper.merge(obj1, obj2), {prop1: 'val1', prop2: 'val2'}, 'both object are combined');
	assert.deepEqual(HeO2.Helper.merge(obj1, obj3), {prop1: 'val1', prop3: 'val3', level: Object.create(null)}, 'deeper level is initialized with an empty object');
});

QUnit.test('Helper.merge can merge deep object', function (assert) {
	var obj1 = {prop1: 'val1'},
		obj2 = {prop2: 'val2', level: {prop3: 'val3'}},
		expect = {prop1: 'val1', prop2: 'val2', level: {prop3: 'val3'}};

	assert.deepEqual(HeO2.Helper.merge(true, obj1, obj2), expect, 'both objects are combined');
});

QUnit.test('When Helper.merge encounters a property that appears in multiple input object, the latest (rightmost one at the call site) has priority', function (assert) {
	var obj1 = {prop1: 'val1'},
		obj2 = {prop1: 'val2'},
		expectVal1 = {prop1: 'val1'},
		expectVal2 = {prop1: 'val2'};

	assert.deepEqual(HeO2.Helper.merge(obj1, obj2), expectVal2, 'prop1 is val2');
	assert.deepEqual(HeO2.Helper.merge(obj2, obj1), expectVal1, 'prop1 is val1');
});

QUnit.test('Helper.merge honors the recurse level when set, defaults to 10', function (assert) {
	var obj = {level1: {level2: {level3: {level4: {level5: {level6: {level7: {level8: {level9: {level10: {level11: {prop: 'val'}}}}}}}}}}}},
		expect5 = {level1: {level2: {level3: {level4: {level5: Object.create(null)}}}}},
		expect10 = {level1: {level2: {level3: {level4: {level5: {level6: {level7: {level8: {level9: {level10: Object.create(null)}}}}}}}}}};

	assert.deepEqual(HeO2.Helper.merge(true, 5, {}, obj), expect5, 'stops after level5');
	assert.deepEqual(HeO2.Helper.merge(true, {}, obj), expect10, 'stops after level10');
});

QUnit.test('Helper.merge does not duplicate DOM node, only the reference is copied', function (assert) {
	var divNode = document.createElement('div'),
		obj = {dom: divNode},
		mergedShallow = HeO2.Helper.merge({}, obj),
		mergedDeep = HeO2.Helper.merge(true, {}, obj);

	assert.equal(mergedShallow.dom, divNode, 'only the reference was copied');
	assert.equal(mergedDeep.dom, divNode, 'only the reference was copied');
});

QUnit.test('Helper.merge does not duplicate jQuery object, only the reference is copied', function (assert) {
	var jq = jQuery('div'),
		obj = {jqObj: jq},
		mergedShallow = HeO2.Helper.merge({}, obj),
		mergedDeep = HeO2.Helper.merge(true, {}, obj);

	assert.equal(mergedShallow.jqObj, jq, 'only the reference was copied');
	assert.equal(mergedDeep.jqObj, jq, 'only the reference was copied');
});

QUnit.test('Helper.merge leaves nulls alone', function (assert) {
	var obj1 = {prop1: null},
		obj2 = {prop2: null};

	assert.deepEqual(HeO2.Helper.merge(obj1, obj2), {prop1: null, prop2: null}, 'both props are null');
	assert.deepEqual(HeO2.Helper.merge(true, obj1, obj2), {prop1: null, prop2: null}, 'both props are null');
});

QUnit.test('Helper.merge leaves arrays alone', function (assert) {
	var obj1 = {a1: ['a']},
		obj2 = {a2: ['b']};

	assert.deepEqual(HeO2.Helper.merge(obj1, obj2), {a1: ['a'], a2: ['b']}, 'arrays are still arrays');
	assert.deepEqual(HeO2.Helper.merge(true, obj1, obj2), {a1: ['a'], a2: ['b']}, 'arrays are still arrays');
});

QUnit.test('Helper.merge can merge objects created with Object.create(null)', function (assert) {
	var obj1 = Object.create(null),
		obj2 = {test: ''},
		merged = HeO2.Helper.merge(obj1, obj2);
	assert.deepEqual(merged, {test: ''}, 'merged without exceptions');
});

QUnit.test('Helper.concatUnique with default options uses the first array as the destination', function (assert) {
	var a1 = ['a', 'b', 'c'],
		a2 = ['c', 'd', 'e'];

	var defaultTest = HeO2.Helper.concatUnique(a1, a2);
	assert.deepEqual(defaultTest, ['a','b','c','d','e'], 'concatenated unique values');
	assert.equal(defaultTest, a1, 'return value is a1');
});

QUnit.test('Helper.concatUnique create a new array for its destination when its first argument is true', function (assert) {
	var a1 = ['a', 'b', 'c'],
		a2 = ['c', 'd', 'e'];

	var newArrayTest = HeO2.Helper.concatUnique(true, a1, a2);
	assert.deepEqual(newArrayTest, ['a','b','c','d','e'], 'concatenated unique values');
	assert.notEqual(newArrayTest, a1, 'return value is not a1');
});

QUnit.test('Helper.concatUnique adds non array argument to the destination', function (assert) {
	var testFirstArray = HeO2.Helper.concatUnique(['a'], 'b'),
		testFirstPrimitive = HeO2.Helper.concatUnique('a', ['b']);

	assert.deepEqual(testFirstArray, ['a','b'], 'concatenated unique values');
	assert.deepEqual(testFirstPrimitive, ['a','b'], 'concatenated unique values');
});

QUnit.test('Helper.isNumeric returns true for numeric values', function (assert) {
	assert.ok(HeO2.Helper.isNumeric('10'));
	assert.ok(HeO2.Helper.isNumeric(10));
	assert.ok(HeO2.Helper.isNumeric(Math.PI));
	assert.ok(HeO2.Helper.isNumeric('10.5'));
	assert.ok(HeO2.Helper.isNumeric('.5'));
	assert.ok(HeO2.Helper.isNumeric('0.5'));
	assert.ok(HeO2.Helper.isNumeric('-5'));
	assert.ok(HeO2.Helper.isNumeric(.50));
});

QUnit.test('Helper.isNumeric returns false for non numeric values', function (assert) {
	assert.notOk(HeO2.Helper.isNumeric('1f0'));
	assert.notOk(HeO2.Helper.isNumeric('f10'));
	assert.notOk(HeO2.Helper.isNumeric('10f'));
	assert.notOk(HeO2.Helper.isNumeric('test'));
	assert.notOk(HeO2.Helper.isNumeric('10.0.3'));
	//assert.notOk(HeO2.Helper.isNumeric('044'));
});

QUnit.test('Helper.currency can format a number as a currency string', function (assert) {
	assert.equal(HeO2.Helper.currency(5), '$5.00');
	assert.equal(HeO2.Helper.currency(.5), '$0.50');
	assert.equal(HeO2.Helper.currency(1000), '$1,000.00');
});

QUnit.test('Helper.currency returns null for invalid input', function (assert) {
	assert.equal(HeO2.Helper.currency('invalid'), null);
	assert.equal(HeO2.Helper.currency(null), null);
	assert.equal(HeO2.Helper.currency({}), null);
	assert.equal(HeO2.Helper.currency([]), null);
});

QUnit.test('Helper.currency allow to configure the format using Helper.currency.format()', function (assert) {
	assert.equal(HeO2.Helper.currency.format('{#}$'), '${#}', 'format returns the old format');
	assert.equal(HeO2.Helper.currency(5), '5.00$');
	HeO2.Helper.currency.format('${#}');
});

QUnit.test('Helper.currency.format() returns current format when called with no arguments', function (assert) {
	assert.equal(HeO2.Helper.currency.format(), '${#}');
});
