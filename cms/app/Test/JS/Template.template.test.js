QUnit.test('Public interface is: render', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.Template.prototype.render), 'render is present');
});

QUnit.test('html can be set from a string when the template is created', function (assert) {
	var template = new HeO2.Template({html: '<h1>This is a test</h1><form method="post"><input type="text" name="test" /><input type="submit" /></form>'}),
		rendered = template.render();

	assert.deepEqual(rendered[0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].nodeName, 'H1 tag was rendered');
	assert.deepEqual(rendered[0].innerText, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].innerText, 'H1 text was set');
	assert.deepEqual(rendered[1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].nodeName, 'FORM tag was rendered');
	assert.deepEqual(rendered[1].attributes.method.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].attributes.method.nodeValue, 'FORM method was set');
	assert.deepEqual(rendered[1][0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].nodeName, 'INPUT TEXT tag was rendered');
	assert.deepEqual(rendered[1][0].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].attributes.type.nodeValue, 'INPUT TEXT type was set');
	assert.deepEqual(rendered[1][1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].nodeName, 'INPUT SUBMIT tag was rendered');
	assert.deepEqual(rendered[1][1].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].attributes.type.nodeValue, 'INPUT SUBMIT type was set');
});

QUnit.test('html can be set from an array when the template is created', function (assert) {
	var template = new HeO2.Template({html: [
			'<h1>This is a test</h1>',
			'<form method="post">',
			'<input type="text" name="test" />',
			'<input type="submit" />',
			'</form>'
		]}),
		rendered = template.render();

	assert.deepEqual(rendered[0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].nodeName, 'H1 tag was rendered');
	assert.deepEqual(rendered[0].innerText, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].innerText, 'H1 text was set');
	assert.deepEqual(rendered[1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].nodeName, 'FORM tag was rendered');
	assert.deepEqual(rendered[1].attributes.method.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].attributes.method.nodeValue, 'FORM method was set');
	assert.deepEqual(rendered[1][0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].nodeName, 'INPUT TEXT tag was rendered');
	assert.deepEqual(rendered[1][0].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].attributes.type.nodeValue, 'INPUT TEXT type was set');
	assert.deepEqual(rendered[1][1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].nodeName, 'INPUT SUBMIT tag was rendered');
	assert.deepEqual(rendered[1][1].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].attributes.type.nodeValue, 'INPUT SUBMIT type was set');
});

QUnit.test('html can be set from a string when calling render', function (assert) {
	var template = new HeO2.Template(),
		rendered = template.render('<h1>This is a test</h1><form method="post"><input type="text" name="test" /><input type="submit" /></form>');

	assert.deepEqual(rendered[0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].nodeName, 'H1 tag was rendered');
	assert.deepEqual(rendered[0].innerText, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].innerText, 'H1 text was set');
	assert.deepEqual(rendered[1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].nodeName, 'FORM tag was rendered');
	assert.deepEqual(rendered[1].attributes.method.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].attributes.method.nodeValue, 'FORM method was set');
	assert.deepEqual(rendered[1][0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].nodeName, 'INPUT TEXT tag was rendered');
	assert.deepEqual(rendered[1][0].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].attributes.type.nodeValue, 'INPUT TEXT type was set');
	assert.deepEqual(rendered[1][1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].nodeName, 'INPUT SUBMIT tag was rendered');
	assert.deepEqual(rendered[1][1].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].attributes.type.nodeValue, 'INPUT SUBMIT type was set');
});

QUnit.test('html can be set from an array when calling render', function (assert) {
	var template = new HeO2.Template(),
		rendered = template.render([
			'<h1>This is a test</h1>',
			'<form method="post">',
			'<input type="text" name="test" />',
			'<input type="submit" />',
			'</form>'
		]);

	assert.deepEqual(rendered[0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].nodeName, 'H1 tag was rendered');
	assert.deepEqual(rendered[0].innerText, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].innerText, 'H1 text was set');
	assert.deepEqual(rendered[1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].nodeName, 'FORM tag was rendered');
	assert.deepEqual(rendered[1].attributes.method.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].attributes.method.nodeValue, 'FORM method was set');
	assert.deepEqual(rendered[1][0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].nodeName, 'INPUT TEXT tag was rendered');
	assert.deepEqual(rendered[1][0].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].attributes.type.nodeValue, 'INPUT TEXT type was set');
	assert.deepEqual(rendered[1][1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].nodeName, 'INPUT SUBMIT tag was rendered');
	assert.deepEqual(rendered[1][1].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].attributes.type.nodeValue, 'INPUT SUBMIT type was set');
});

QUnit.test('html set in a render call has precedence', function (assert) {
	var template = new HeO2.Template({html: '<span>This is different</span>'}),
		rendered = template.render('<h1>This is a test</h1><form method="post"><input type="text" name="test" /><input type="submit" /></form>');

	assert.deepEqual(rendered[0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].nodeName, 'H1 tag was rendered');
	assert.deepEqual(rendered[0].innerText, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].innerText, 'H1 text was set');
	assert.deepEqual(rendered[1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].nodeName, 'FORM tag was rendered');
	assert.deepEqual(rendered[1].attributes.method.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].attributes.method.nodeValue, 'FORM method was set');
	assert.deepEqual(rendered[1][0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].nodeName, 'INPUT TEXT tag was rendered');
	assert.deepEqual(rendered[1][0].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].attributes.type.nodeValue, 'INPUT TEXT type was set');
	assert.deepEqual(rendered[1][1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].nodeName, 'INPUT SUBMIT tag was rendered');
	assert.deepEqual(rendered[1][1].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].attributes.type.nodeValue, 'INPUT SUBMIT type was set');
});

QUnit.test('html set in a render call has precedence', function (assert) {
	var template = new HeO2.Template({html: '<span>This is different</span>'}),
		rendered = template.render([
			'<h1>This is a test</h1>',
			'<form method="post">',
			'<input type="text" name="test" />',
			'<input type="submit" />',
			'</form>'
		]);

	assert.deepEqual(rendered[0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].nodeName, 'H1 tag was rendered');
	assert.deepEqual(rendered[0].innerText, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[0].innerText, 'H1 text was set');
	assert.deepEqual(rendered[1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].nodeName, 'FORM tag was rendered');
	assert.deepEqual(rendered[1].attributes.method.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1].attributes.method.nodeValue, 'FORM method was set');
	assert.deepEqual(rendered[1][0].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].nodeName, 'INPUT TEXT tag was rendered');
	assert.deepEqual(rendered[1][0].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][0].attributes.type.nodeValue, 'INPUT TEXT type was set');
	assert.deepEqual(rendered[1][1].nodeName, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].nodeName, 'INPUT SUBMIT tag was rendered');
	assert.deepEqual(rendered[1][1].attributes.type.nodeValue, jQuery('#template-template-fixture-test-form-expected')[0].childNodes[1][1].attributes.type.nodeValue, 'INPUT SUBMIT type was set');
});

QUnit.test('leave warning about unknown functions in the rendered elements', function (assert) {
	var template = new HeO2.Template({html: '<h1>((invalid::some-value))</h1>'});
	assert.equal(template.render()[0].childNodes[0].nodeValue, '<unknown function invalid>', 'h1 node value is <unknown function invalid>');
});

QUnit.test('can parse lang tags', function (assert) {
	var template = new HeO2.Template({html: '<h1>((lang::GENERIC_YES))</h1><h1>((lang::\'test\'))</h1>'}),
		rendered = template.render();
	assert.equal(rendered[0].childNodes[0].nodeValue, 'GENERIC_YES', 'h1 node value is GENERIC_YES via token');
	assert.equal(rendered[1].childNodes[0].nodeValue, 'test', 'h1 node value is test via string');
});

QUnit.test('on input nodes, parse the value property', function (assert) {
	var template = new HeO2.Template({html: '<input type="button" value="((lang::GENERIC_YES))" />'});
	assert.equal(template.render()[0].attributes.value.nodeValue, 'GENERIC_YES', 'input tag value is GENERIC_YES');
});

QUnit.test('a text tag that resolves to HTML is parsed', function (assert) {
	jQuery.i18n.messageStore.messages.en = {};
	jQuery.i18n.messageStore.messages.en.HTML_TEST = '<div></div><div></div>';

	var template = new HeO2.Template({html: '<div>((lang::HTML_TEST))<span></span></div>'}),
		rendered = template.render();
	assert.equal(rendered[0].childNodes[0].childNodes.length, 2, '2 child div nodes are created');
	assert.equal(rendered[0].childNodes[1].nodeName, 'SPAN', 'siblings are preserved');
});

QUnit.test('the state function allows to change the text of an element based on state', function (assert) {
	var template = new HeO2.Template({html: '<div>((state::id on|GENERIC_ON off|GENERIC_OFF))</div>'}),
		rendered = template.render();

	assert.equal(rendered[0].childNodes[0].nodeValue, 'GENERIC_ON', 'the first state is used as the default value, GENERIC_ON in this case');
	template.state('id', 'off');
	assert.equal(rendered[0].childNodes[0].nodeValue, 'GENERIC_OFF', 'the state was changed to GENERIC_OFF');
});

QUnit.test('var function can render arbitrary values', function (assert) {
	var template = new HeO2.Template({html: '<div>((var::test))</div>'}),
		rendered = template.render({
			callbacks: {
				varMapper: function(name) {
					assert.equal(name.value, 'test', "var name is 'test'");
					return 'woot!';
				}
			}
		});

	assert.equal(jQuery(rendered).text(), 'woot!', "rendered text is 'woot!'");
});

QUnit.test('var function can render arbitrary values', function (assert) {
	var template = new HeO2.Template({html: '<div data-test="((var::test))"></div>'}),
		rendered = template.render({
			callbacks: {
				varMapper: function(name) {
					return 'woot!';
				}
			}
		});

	assert.equal(jQuery(rendered).attr('data-test'), 'woot!', "rendered text is 'woot!'");
});
