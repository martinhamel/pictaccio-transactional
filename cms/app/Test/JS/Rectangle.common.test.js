QUnit.test('a Rectangle can store a rectangle coordinates', function(assert) {
	var rect = new HeO2.Rectangle(1, 2, 3, 4);
	assert.ok(rect.left() === 1 && rect.top() === 2 && rect.right() === 3 && rect.bottom() === 4, 'The Rectangle object has kept the coordinates it was created with');
});
QUnit.test('a Rectangle can calculate a rectangle coordinates from width and height', function(assert) {
	var rect = new HeO2.Rectangle(1, 2, 5, 5, true);
	assert.equal(rect.right(), 6, 'right() should return 6');
	assert.equal(rect.bottom(), 7, 'bottom() should return 7');

	rect.width(10);
	rect.height(10);
	assert.equal(rect.right(), 11, 'right() should now be 11');
	assert.equal(rect.bottom(), 12, 'bottom() should now be 12');
});
QUnit.test('a Rectangle can calculate the width and height from coordinates', function(assert) {
	var rect = new HeO2.Rectangle(1, 2, 3, 4);
	assert.equal(rect.width(), 2, "width() should be 2");
	assert.equal(rect.height(), 2, "height() should be 2");
});
