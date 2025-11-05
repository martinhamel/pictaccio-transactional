QUnit.test("a Point can store a two dimension value", function(assert) {
	var point = new HeO2.Point(1, 2);
	assert.ok(point.x() === 1 && point.y() === 2, "The Point object has kept the coordinate it was created with");
});
