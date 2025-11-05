QUnit.test('the public methods are present: setOptions, show', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.UI.Group.prototype.setOptions), 'setOptions is present');
	assert.ok(jQuery.isFunction(HeO2.UI.Group.prototype.show), 'show is present');
});

QUnit.test('the public methods return the object for chaining', function (assert) {
	var group = new HeO2.UI.Group({});

	assert.deepEqual(group.setOptions({}), group, 'setOptions returned itself');
	assert.deepEqual(group.show(''), group, 'setOptions returned itself');
});
QUnit.test('can toggle visibility on a group of nodes', function (assert) {
	var group = new HeO2.UI.Group({target: '#group-ui-fixture'});

	group.show('add');
	jQuery('#group-ui-fixture').find('.group-add').each(function(index, node) {
		assert.equal(node.style.display, 'block', 'all group-add are display:block');
	});
	jQuery('#group-ui-fixture').find('.group-edit').each(function(index, node) {
		assert.equal(node.style.display, 'none', 'all group-edit are display:none');
	});

	group.show('edit');
	jQuery('#group-ui-fixture').find('.group-edit').each(function(index, node) {
		assert.equal(node.style.display, 'block', 'all group-edit are display:block');
	});
	jQuery('#group-ui-fixture').find('.group-add').each(function(index, node) {
		assert.equal(node.style.display, 'none', 'all group-add are display:none');
	});
});

