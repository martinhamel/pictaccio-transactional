QUnit.module('Generic', {
	afterEach: function() {
		jQuery('#tags-ui-fixture').empty();
	}
});

QUnit.test('Class has factory method create', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.UI.Tags.create), 'Factory is present');
});

QUnit.test('Public interface is: tags setOptions', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.UI.Tags.prototype.setOptions), 'setOptions is present');
});

QUnit.test('CUSTOM_INPUT and TAGS_INPUT are added to target', function (assert) {
	var tags = HeO2.UI.Tags.create({target: '#tags-ui-fixture'});

	assert.ok(jQuery('#tags-ui-fixture').hasClass(HeO2.CONST.UI_CLASSES.CUSTOM_INPUT), 'has class CUSTOM_INPUT');
	assert.ok(jQuery('#tags-ui-fixture').hasClass(HeO2.CONST.UI_CLASSES.TAGS_INPUT), 'has class TAGS_INPUT');

});

QUnit.test('Following methods return itself for chaining: setOptions', function (assert) {
	var tags = HeO2.UI.Tags.create();
	assert.equal(tags.setOptions(), tags, 'setOptions returned itself');
});

QUnit.test('Tags set through options or tags are rendered', function (assert) {
	var tags = ['tag1', 'tag2', 'tag3'],
		tagsOptions = HeO2.UI.Tags.create({target: '#tags-ui-fixture', tags: tags}),
		tagsFixture = jQuery('#tags-ui-fixture');

	assert.equal(tagsFixture.find('span').eq(0).text(), 'tag1', 'first tag is tag1');
	assert.equal(tagsFixture.find('span').eq(1).text(), 'tag2', 'first tag is tag2');
	assert.equal(tagsFixture.find('span').eq(2).text(), 'tag3', 'first tag is tag3');

	tagsFixture.empty();
	var tagsTags = HeO2.UI.Tags.create({target: '#tags-ui-fixture'});
	tagsTags.tags(tags);

	assert.equal(tagsFixture.find('span').eq(0).text(), 'tag1', 'first tag is tag1');
	assert.equal(tagsFixture.find('span').eq(1).text(), 'tag2', 'first tag is tag2');
	assert.equal(tagsFixture.find('span').eq(2).text(), 'tag3', 'first tag is tag3');
});
