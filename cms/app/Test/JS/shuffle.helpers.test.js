QUnit.test('a method shuffle is present on Array', function (assert) {
	assert.ok(jQuery.isFunction(Array.prototype.shuffle), 'present!');
});

QUnit.test('can shuffle an array in place', function (assert) {
	var a = [1, 2, 3, 4, 5, 6],
		baseline = [1, 2, 3, 4, 5, 6],
		clone = function(a) {
			var na = [];
			a.forEach(function(slot) {
				na.push(slot);
			});

			return na;
		};



	assert.notDeepEqual(a.shuffle(), baseline, 'the array was shuffled');
	assert.notDeepEqual(clone(a.shuffle()), clone(a.shuffle()), 'returns a different shuffled array on each call');
	assert.notDeepEqual([1, 2, 3, 4, 5, 6].shuffle(), [1, 2, 3, 4, 5, 6].shuffle(), 'shuffles differently when given the same input');
});
