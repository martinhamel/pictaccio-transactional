QUnit.test('Public interface is: refresh, setOptions, setRenderer, watch', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.UI.List.prototype.refresh), 'refresh is present');
	assert.ok(jQuery.isFunction(HeO2.UI.List.prototype.setOptions), 'setOptions is present');
	assert.ok(jQuery.isFunction(HeO2.UI.List.prototype.setRenderer), 'setRenderer is present');
	assert.ok(jQuery.isFunction(HeO2.UI.List.prototype.watch), 'watch is present');
});

QUnit.test('Followign methods return itself for chaining: refresh, setOptions, setRenderer, watch', function (assert) {
	var list = new HeO2.UI.List();

	assert.equal(list.refresh(), list, 'refresh returned itself');
	assert.equal(list.setOptions(), list, 'setOptions returned itself');
	assert.equal(list.setRenderer(), list, 'setRenderer returned itself');
	assert.equal(list.watch(), list, 'watch returned itself');
});

QUnit.test('can render a list of picture', function (assert) {
	var list = new HeO2.UI.List({
			target: '#list-ui-fixture',
			list: [
				{image: 'img/heliox.svg'},
				{image: 'img/heliox.svg'}
			]
		})
		.setRenderer('Image')
		.refresh();

	assert.equal(jQuery('#list-ui-fixture').children('img').length, 2, 'both images were rendered');
});

QUnit.test('all renderer are present: Image', function (assert) {
	assert.ok(HeO2.UI.List.renderers !== undefined, 'renderers is present');
	assert.ok(HeO2.UI.List.renderers.Image !== undefined, 'Image renderer is present');
});
