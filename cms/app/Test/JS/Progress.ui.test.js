QUnit.module("Generic", {
	afterEach: function() {
		jQuery('#progress-ui-fixture-progress').empty().removeClass();
	}
});

QUnit.test('Progress has the following public method: destroy, progress, setOptions', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.UI.Progress.prototype.progress), 'has public method progress');
	assert.ok(jQuery.isFunction(HeO2.UI.Progress.prototype.setOptions), 'has public method setOptions');
});

QUnit.test('methods destroy, progress, setOptions return itself for chaining', function (assert) {
	var progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'});

	assert.ok(progress.progress(0) === progress, 'progress returned itself');
	assert.ok(progress.setOptions({}) === progress, 'progress returned itself');
	assert.ok(progress.destroy() === progress, 'progress returned itself');
});

QUnit.test('Progress has default options', function (assert) {
	var expectedDefault = {
		callbacks: {
			renderOverlay: null,
			renderProgressContainer: null
		},
		css: {
			bar: 'progress-bar',
			overlay: 'overlay',
			radial: 'progress-radial'
		},
		labelFont: 'Tahoma 15px',
		size: '40px',
		target: null,
		type: 'radial'
	};

	assert.deepEqual(HeO2.UI.Progress.prototype._DEFAULTS, expectedDefault, 'Progress default options are as expected');
});

QUnit.test('options can be set upon creation', function (assert) {
	var progress = new HeO2.UI.Progress({
		type: 'bar',
		target: 'test'
	});

	assert.equal(progress._options.type, 'bar', 'option type is bar');
	assert.equal(progress._options.target, 'test', 'option target is test');
});

QUnit.test('options can be set through the method setOptions', function (assert) {
	var progress = new HeO2.UI.Progress({});
	progress.setOptions({
		type: 'bar',
		target: 'test'
	});

	assert.equal(progress._options.type, 'bar', 'option type is bar');
	assert.equal(progress._options.target, 'test', 'option target is test');
});

QUnit.test('when size is set, height, width and line-height are correctly applied', function (assert) {
	var progress = new HeO2.UI.Progress({
		size: '100px',
		target: '#progress-ui-fixture-progress'
	});

	assert.equal(jQuery('#progress-ui-fixture-progress').height(), 100, 'height is 100px');
	assert.equal(jQuery('#progress-ui-fixture-progress').width(), 100, 'width is 100px');
	assert.equal(jQuery('#progress-ui-fixture-progress').css('line-height'), 100 * .75 + 'px', 'line-height is 75% of height');
});

QUnit.test('label font is correctly applied', function (assert) {
	var progress = new HeO2.UI.Progress({
		labelFont: '16px Times New Roman',
		target: '#progress-ui-fixture-progress'
	});

	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-family'), "'Times New Roman'", 'Font is Times new roman');
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-size'), '16px', 'Font size is 16px');

	jQuery('#progress-ui-fixture-progress').empty();
	progress.setOptions({labelFont: '16pt TIMES NEW ROMAN'});
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-family'), "'TIMES NEW ROMAN'", 'Font is Times new roman');
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-size'), '21.3333339691162px', 'Font size is 21.3333339691162px');

	jQuery('#progress-ui-fixture-progress').empty();
	progress.setOptions({labelFont: '16% Tahoma'});
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-family'), "Tahoma", 'Font is Tahoma');
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-size'), '6px', 'Font size is 6px');

	jQuery('#progress-ui-fixture-progress').empty();
	progress.setOptions({labelFont: 'Times new Roman 16em'});
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-family'), "'Times new Roman'", 'Font is Times new Roman');
	assert.equal(jQuery('#progress-ui-fixture-progress label').css('font-size'), '256px', 'Font size is 256px');
});

QUnit.test('css class is correctly set for radial upon capture', function (assert) {
	var progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'});

	assert.ok((jQuery('#progress-ui-fixture-progress').attr('class') || '').indexOf('progress-radial') !== -1, 'class has progress-radial');
});

QUnit.test('css class is correctly set for progress', function (assert) {
	var progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'});

	progress.progress(50);

	assert.ok((jQuery('#progress-ui-fixture-progress').attr('class') || '').indexOf('progress-50') !== -1, 'class has progress-50');
});

QUnit.test('label css class is correctly set to overlay', function (assert) {
	var progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'});

	assert.ok((jQuery('#progress-ui-fixture-progress').children('label').attr('class') || '').indexOf('overlay') !== -1, 'class has progress-radial');
});

QUnit.test('label is property set', function (assert) {
	var progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'});

	progress.progress(50);

	assert.equal(jQuery('#progress-ui-fixture-progress').find('label').text(), '50', 'label is 50');
});

QUnit.test('progress cannot be set outside of range 0..100 and are floored', function (assert) {
	var progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'});

	progress.progress(-1);
	assert.equal(progress._progress, 0, 'progress does not go below 0');

	progress.progress(101);
	assert.equal(progress._progress, 100, 'progress does not go above 100');

	progress.progress(66 / 5);
	assert.equal(progress._progress, Math.floor(66/5), 'progress was floored');
});

QUnit.test('when set, callbacks are called when their associated element is being rendered', function (assert) {
	assert.expect(2);

	var asyncContainer = assert.async(),
		asyncOverlay = assert.async(),
		renderProgressContainer = function($container) {assert.ok(true, 'renderProgressContainer was called'); asyncContainer();},
		renderOverlay = function($overlay) {assert.ok(true, 'renderOverlay was called'); asyncOverlay();},
		progress = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress', callbacks: {renderProgressContainer: renderProgressContainer, renderOverlay: renderOverlay}});
});

QUnit.test('widget can be destroyed', function (assert) {
	assert.expect(3);

	var fixture1 = jQuery('<div></div>').css({display: 'none'}).attr('id', 'progress-common-fixture-destroy-1'),
		fixture2 = jQuery('<div></div>').css({display: 'none'}).attr('id', 'progress-common-fixture-destroy-2'),
		progress1 = new HeO2.UI.Progress({target: fixture1}),
		progress2 = new HeO2.UI.Progress({target: fixture2}),
		progress3 = new HeO2.UI.Progress({target: '#progress-ui-fixture-progress'}),
		asyncDestroy = assert.async();

	jQuery('body').append([fixture1, fixture2]);

	progress1.destroy();
	progress2.destroy(true);

	assert.ok(jQuery('#progress-common-fixture-destroy-1').is(':empty'), 'Progress.destroy(false) release and empty the container');
	assert.notOk(jQuery('#progress-common-fixture-destroy-2').length, 'Progress.destroy(true) removed the container from the document');

	progress3.destroy(function() {assert.ok(true, 'callback called'); asyncDestroy();});
});
