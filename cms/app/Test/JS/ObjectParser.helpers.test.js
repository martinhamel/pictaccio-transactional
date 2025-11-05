QUnit.test('ObjectParser can navigate a complex object structure from a dot separated path', function (assert) {
	"use strict";

	var obj = {
		lvl1: {
			prop1: 'test1'
		},
		lvl2: {
			prop2: 'test2'
		}
	};

	assert.equal(HeO2.ObjectParser.parse('lvl1.prop1', obj), 'test1', 'found lvl1.prop1');
});
