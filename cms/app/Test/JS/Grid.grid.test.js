// GRID OPERATIONS
QUnit.module('Operations', {
	beforeEach: function() {
		this.debugGrid = new HeO2.Grid({debug: true});
		this.prodGrid = new HeO2.Grid({debug: false});
	}
});

QUnit.test("calling 'create' creates a document", function(assert) {
	this.prodGrid.create();
	assert.notEqual(this.prodGrid._document, null, "Assert grid._document isn't null after calling create");
	assert.notEqual(this.prodGrid.getDocument(), null, 'The document object can be retrieved through Grid::getDocument() after a Grid::create() call')
});

QUnit.test('can open csv files', function(assert) {
	var documentBuilt = assert.async();
	assert.expect(3);

	this.prodGrid.on('document-ready', function() {
		var test01 = this.prodGrid._document.getCell(0, 1) || {value: null};
		var test12 = this.prodGrid._document.getCell(1, 2) || {value: null};

		assert.equal(test01.value, 'test01', 'A value from the CSV data can be correctly read');
		assert.equal(test12.value, 'test12', 'The bottom right cell can be correctly read');
		assert.notEqual(this.prodGrid.getDocument(), null, 'The document object can be retrieved through Grid::getDocument() after a Grid::open() call');

		documentBuilt();
	}.bind(this));

	this.prodGrid.open("test00,test01,test02\ntest10,test11,test12", 'text/csv');
});

QUnit.test('views can be added', function(assert) {
	this.prodGrid.addView('static-test', 'static', {});
	this.prodGrid.addView('edit-test', 'edit', {});

	assert.ok('static-test' in this.prodGrid._views, "The internal view map has a 'static-test' item");
	assert.ok(this.prodGrid._views['static-test'] instanceof HeO2.Grid._views.static, "The 'static-test' item on the internal map view map is of type 'staticView'");
	assert.ok('edit-test' in this.prodGrid._views, "The internal view map has a 'edit-test' item");
	assert.ok(this.prodGrid._views['edit-test'] instanceof HeO2.Grid._views.edit, "The 'static-test' item on the internal map view map is of type 'editView'");
});

QUnit.test('options can be set', function(assert) {
	this.prodGrid.setOptions({testOption: 'test'});

	assert.equal(this.prodGrid._options.testOption, 'test', 'The test option is present in the internal structure');
});

QUnit.test("option 'debug' correctly controls the logging of debug messages", function(assert) {
	var prodCalled = false, debugCalled = false;

	console.warn = function() {prodCalled = true};
	this.prodGrid.addView('rubbish', 'rubbish', {});
	console.warn = function() {debugCalled = true};
	this.debugGrid.addView('rubbish', 'rubbish', {});

	assert.notOk(prodCalled, "Grid with options.debug == false didn't call console.log()");
	assert.ok(debugCalled, "Grid with options.debug == true called console.log()");
});

QUnit.test("all Grid non-accessor public methods return itself to allow method chaining", function(assert) {
	assert.equal(this.prodGrid.create(), this.prodGrid, "Grid::create() returned itself");
	assert.equal(this.prodGrid.addView('id', 'static', {}), this.prodGrid, "Grid::addView() returned itself");
	assert.equal(this.prodGrid.open('', 'rubbish/mime'), this.prodGrid, "Grid::open() returned itself");
	assert.equal(this.prodGrid.setOptions({}), this.prodGrid, "Grid::setOptions() returned itself");
});



// GRID EVENTS
QUnit.module('Events', {
	beforeEach: function() {
		this.grid = new HeO2.Grid();
	}
});

QUnit.test("events 'creating' and 'created' are emitted on Grid.create()", function(assert) {
	var created = assert.async(), creating = assert.async();

	assert.expect(2);

	this.grid
		.on('creating', function() {
			assert.ok(true, "Assert event 'creating' is called");
			creating();
		})
		.on('created', function() {
			assert.ok(true, "Assert event 'created' is called");
			created();
		});

	this.grid.create();
});

QUnit.test("event 'creating' is able to cancel the operation", function(assert) {
	this.grid.on('creating', function(event) {
		event.cancel = true;
	});

	this.grid.create();
	assert.equal(this.grid._document, null, "Assert a document wasn't been created");
});

QUnit.test("events 'adding-view' and 'added-view' are emitted on Grid.addView()", function(assert) {
	assert.expect(2);

	var added = assert.async(), adding = assert.async();
	this.grid
		.on('adding-view', function() {
			assert.ok(true, 'adding-view emitted');
			adding();
		})
		.on('added-view', function() {
			assert.ok(true, 'added-view emitted');
			added();
		});

	this.grid.addView('static', 'static', {});
});

QUnit.test("event 'adding-view' is able to cancel the operation", function(assert) {
	this.grid.on('adding-view', function(event) {
		event.cancel = true;
	});

	this.grid.addView('static', 'static', {});
	assert.equal(this.grid._views['static'], null, "Assert a view wasn't been created");
});

QUnit.test("events 'opening-raw' and 'opened' are emitted on Grid.open() with a raw string", function(assert) {
	assert.expect(2);

	var opening = assert.async(), opened = assert.async();
	this.grid
		.on('opening-raw', function() {
			assert.ok(true, 'opening-raw emitted');
			opening();
		})
		.on('opened', function() {
			assert.ok(true, 'opened emitted');
			opened();
		});

	this.grid.open('test,test,test', 'text/csv');
});

QUnit.test("event 'opening-raw' is able to cancel the operation", function(assert) {
	this.grid.on('opening-raw', function(event) {
		event.cancel = true;
	});

	this.grid.open('test,test,test', 'text/csv');
	assert.equal(this.grid._document, null, "Assert a view wasn't been created");
});

/*
 QUnit.test("events 'opening-file' and 'opened' are emitted on Grid.open() with a file", function(assert) {
 assert.expect(2);

 var opening = assert.async(), opened = assert.async();
 this.grid
 .on('opening-raw', function() {
 assert.ok(true, 'opening-raw emitted');
 opening();
 })
 .on('opened', function() {
 assert.ok(true, 'opened emitted');
 opened();
 });

 this.grid.open('test,test,test', 'text/csv');
 });

 QUnit.test("event 'opening-raw' is able to cancel the operation", function(assert) {
 this.grid.on('opening-raw', function(event) {
 event.cancel = true;
 });

 this.grid.open('test,test,test', 'text/csv');
 assert.equal(this.grid._document, null, "Assert a view wasn't been created");
 });
 */

