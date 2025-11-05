QUnit.test('ArraySearcher can find a value in a complex object structure', function(assert) {
	var ret = HeO2.ArraySearcher.search([{
			level1_1: {level2_1: 'value11', level2_2: 'value12', level2_3: 'value13'},
			level1_2: {level2_1: 'value14', level2_2: 'value15', level2_3: 'value16'},
			level1_3: {level2_1: 'value17', level2_2: 'value18', level2_3: 'value19'}
		},{
			level1_1: {level2_1: 'value21', level2_2: 'value22', level2_3: 'value23'},
			level1_2: {level2_1: 'value24', level2_2: 'test', level2_3: 'value26'},
			level1_3: {level2_1: 'value27', level2_2: 'value28', level2_3: 'value29'}
		},{
			level1_1: {level2_1: 'value31', level2_2: 'value32', level2_3: 'value33'},
			level1_2: {level2_1: 'value34', level2_2: 'value35', level2_3: 'value36'},
			level1_3: {level2_1: 'value37', level2_2: 'value83', level2_3: 'value39'}
		}], 'level1_2.level2_2', 'test');

	assert.deepEqual(ret, {
		level1_1: {level2_1: 'value21', level2_2: 'value22', level2_3: 'value23'},
		level1_2: {level2_1: 'value24', level2_2: 'test', level2_3: 'value26'},
		level1_3: {level2_1: 'value27', level2_2: 'value28', level2_3: 'value29'}
	}, 'Found it!');
});
