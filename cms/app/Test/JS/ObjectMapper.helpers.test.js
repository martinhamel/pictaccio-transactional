QUnit.test('ObjectMapper can map keys to different names', function (assert) {
	"use strict";

	var obj1 = {
			prop1: 'test1',
			prop2: 'test2',
			prop3: 'test3'
		},
		expect1 = {
			mapped1: 'test1',
			mapped2: 'test2',
			mapped3: 'test3'
		},
		obj2 = {
			lvl1: {
				prop1: 'test1'
			},
			lvl2: {
				prop2: 'test2'
			}
		},
		expect2 = {
			prop1: 'test1',
			prop2: 'test2'
		}

	assert.deepEqual(HeO2.ObjectMapper.map(obj1, {prop1: 'mapped1', prop2: 'mapped2', prop3: 'mapped3'}), expect1, 'mapping of simple object successful');
	assert.deepEqual(HeO2.ObjectMapper.map(obj2, {'lvl1.prop1': 'prop1', 'lvl2.prop2': 'prop2'}), expect2, 'mapping of complex to simple successful');
});
