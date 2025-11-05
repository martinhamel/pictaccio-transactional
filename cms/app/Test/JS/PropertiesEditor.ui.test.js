QUnit.test('Public interface is: list, restore, setOptions, toggle', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.UI.PropertiesEditor.prototype.list), 'list is present');
	assert.ok(jQuery.isFunction(HeO2.UI.PropertiesEditor.prototype.restore), 'restore is present');
	assert.ok(jQuery.isFunction(HeO2.UI.PropertiesEditor.prototype.setOptions), 'setOptions is present');
	assert.ok(jQuery.isFunction(HeO2.UI.PropertiesEditor.prototype.toggle), 'toggle is present');
});

QUnit.test('Following methods return itself for chaining: restore, setOptions, toggle', function (assert) {
	var prop = new HeO2.UI.PropertiesEditor();
	assert.equal(prop.restore(), prop, 'restore returned itself');
	assert.equal(prop.setOptions(), prop, 'setOptions returned itself');
	assert.equal(prop.toggle(), prop, 'setOptions returned itself');
});

QUnit.test('renders properly', function (assert) {
	var prop = new HeO2.UI.PropertiesEditor({
		target: '#propertieseditor-ui-fixture',
		properties: {
			group1: {
				prop1: {
					type: 'text',
					'default': 'test'
				},
				prop2: {
					type: 'number',
					'default': '10'
				}
			}
		}
	});

	assert.equal(jQuery('#propertieseditor-ui-fixture > div > div')[0].getImmediateText(), 'group1', 'Group header present');
	assert.equal(jQuery('#propertieseditor-ui-fixture > div > table tr').first().find('td')[0].getImmediateText(), 'prop1', 'prop1 label is present');
	assert.equal(jQuery('#propertieseditor-ui-fixture-group1-prop1').val(), 'test', 'prop1 default value was set');
	assert.equal(jQuery('#propertieseditor-ui-fixture > div > table tr').eq(1).find('td')[0].getImmediateText(), 'prop2', 'prop2 label is present');
	assert.equal(jQuery('#propertieseditor-ui-fixture-group1-prop2').val(), 10, 'prop2 default value was set');
});

QUnit.test('can restore', function (assert) {
	var prop = new HeO2.UI.PropertiesEditor({
			target: '#propertieseditor-ui-fixture',
			properties: {
				group1: {
					prop1: {
						type: 'text',
						'default': 'test'
					},
					prop2: {
						type: 'number',
						'default': '10'
					}
				}
			}
		})
		.restore({
			group1: {
				prop1: 'real value',
				prop2: 100
			}
		});

	assert.equal(jQuery('#propertieseditor-ui-fixture-group1-prop1').val(), 'real value', 'prop1 default value was set');
	assert.equal(jQuery('#propertieseditor-ui-fixture-group1-prop2').val(), 100, 'prop2 default value was set');
});
