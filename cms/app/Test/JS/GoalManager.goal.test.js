QUnit.test('Public interface is: add, onGoal, remove, start, stop, toggle', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.GoalManager.prototype.add), 'add is present');
	assert.ok(jQuery.isFunction(HeO2.GoalManager.prototype.onGoal), 'onGoal is present');
	assert.ok(jQuery.isFunction(HeO2.GoalManager.prototype.remove), 'remove is present');
	assert.ok(jQuery.isFunction(HeO2.GoalManager.prototype.start), 'start is present');
	assert.ok(jQuery.isFunction(HeO2.GoalManager.prototype.stop), 'stop is present');
	assert.ok(jQuery.isFunction(HeO2.GoalManager.prototype.toggle), 'toggle is present');
});

QUnit.test('Following methods return itself for chaining: add, onGoal, remove, start, stop, toggle', function (assert) {
	var goal = new HeO2.GoalManager();
	var goalDesc = {
		name: 'goal1',
		groups: [{
			name: 'group1',
			events: [{
				name: 'event1',
				type: 'dom-object',
				params: {}
			}]
		}]
	};

	assert.ok(goal.add(goalDesc), 'add returned itself');
	assert.ok(goal.onGoal(), 'onGoal returned itself');
	assert.ok(goal.start('goal1'), 'start returned itself');
	assert.ok(goal.stop('goal1'), 'stop returned itself');
	assert.ok(goal.toggle('goal1'), 'toggle returned itself');
	assert.ok(goal.remove('goal1'), 'remove returned itself');
});

QUnit.test('Can add goals', function (assert) {
	 var goal = new HeO2.GoalManager();
	goal.add({
		name: 'goal1',
		groups: [{
			name: 'group1',
			events: [{
				name: 'event1',
				type: 'dom-object',
				params: {}
			}]
		}]
	});

	assert.ok(goal._goals['goal1'] !== undefined, 'Goal was added');
});

QUnit.test('Can remove goals', function (assert) {
	var goal = new HeO2.GoalManager();
	goal.add({
		name: 'goal1',
		groups: [{
			name: 'group1',
			events: [{
				name: 'event1',
				type: 'dom-object',
				params: {}
			}]
		}]
	});

	goal.remove('goal1');
	assert.ok(goal._goals['goal1'] === undefined, 'Goal was added');
});

QUnit.test('Triggers after timeout', function (assert) {
	var goal = new HeO2.GoalManager(),
		asyncGoal = assert.async();
	goal.add({
			name: 'goal1',
			groups: [{
				name: 'group1',
				events: [{
					name: 'event1',
					type: 'time',
					params: {
						delay: 100
					}
				}]
			}]
		})
		.onGoal('goal1', function() {
			assert.ok(true, 'goal was triggered');
			asyncGoal();
		})
		.start('goal1');
});

QUnit.test('Can stop', function (assert) {
	var goal = new HeO2.GoalManager(),
		asyncGoal = assert.async();
		goal.add({
			name: 'goal1',
			groups: [{
				name: 'group1',
				events: [{
					name: 'event1',
					type: 'time',
					params: {
						delay: 250
					}
				}]
			}]
		})
		.onGoal('goal1', function() {
			assert.ok(false, 'goal should not have been triggered');
		})
		.start('goal1')
		.stop('goal1');

	setTimeout(function() {
		assert.ok(true, 'goal was not triggered');
		asyncGoal();
	}, 1000);
});
