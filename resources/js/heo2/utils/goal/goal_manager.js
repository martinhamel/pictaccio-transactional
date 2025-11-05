/**

 Goal descriptor reference:
 {
	 name: <goal name>
	 groups: [
		 {
			 // This represent a group of events that must fire before evaluating the next group (if present)
			 // When all events in the section have fired, event section-complete is fired
			 name: <section name, must be unique within the goal>
				 events: [
					 {
						 name: <event name, must be unique within the section>
						 type: <type of event>
						 params: {
						 params depends on the type, see type reference
					 }
				 }
			 ]
		 },
		 [...]
	 ]
 }
 */
/**
 Type reference:

 type: 'time',
 params: {
 	delay: <in millisecond>
 }

 type: 'dom-object',
 params: {
	 selector: <valid jquery selector>
	 event: <event name>
	 times: <number of time the event must fire before trigger, set to 0 to triggers when the event hasn't fired>
	 delay: <in millisecond, default: 0. Applicable only if times == 0, will fire if the event hasn't occurred for the amount of time specified>
	 eventProps: { optional, evaluate the properties of the event against this set for equality. If a more complex comparison is needed, set the property to a function [bool function(name, value)] }
 }

 type: 'event-object", // An object with a 'on' and 'off' methods such as any object inheriting from 'EventingClass'
 params {
	 ref: <a reference to the object>
	 event: <event name>
	 times: <default: 1. Number of time the event must fire before trigger, set to 0 to triggers when the event hasn't fired>
	 delay: <in millisecond, default: 0. Applicable only if times == 0, will fire if the event hasn't occurred for the amount of time specified>
	 eventProps: { optional, evaluate the properties of the event against this set for equality. If a more complex comparison is needed, set the property to a function [bool function(propertyValue)] }
 }

 */
/**
 Emits:

 - Upon completion of a goal
 goal-achieved, <goal-name>-goal-achieved {
	 name: <goal name>
 }

 - When a single event triggers
 event-trigger {
	 goalName: <goal name>,
	 groupName: <group name>,
	 eventName: <event name>
 }

 - When all events in a goal have been triggered
 group-trigger {
	 goalName: <goal name>,
	 groupName: <group name>
 }

 - When an handler is needed to construct a goal [emitted on the handler module]
 request-handler {
	 eventTrigger: <the function that should be called when a module concludes all conditions for an event have been met>
	 func: <the function that is provided by the handler module. [void function(action), where action can be either 'start' or 'stop']
	 params: <params object from the goal descriptor>
 }
 */

(function (HeO2) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const logger = HeO2.require('HeO2.common.logger');

	const GoalManager = EventingClass.extend({
		_handlers: null,
		_goals: null,

		init: function() {
			this._super();

			this._handlers = Object.create(null);
			this._goals = Object.create(null);

			this._createHandlers();
		},

		add: function(goal) {
			if (goal.name.indexOf(' ') !== -1) {
				throw new Error('GoalManager: Invalid goal name, it is either duplicate or contains spaces: ' + goal.name);
			}
			if (typeof this._goals[goal.name] !== 'undefined') {
				this.remove(goal.name);
			}

			this._prepareGoal(goal);
			this._goals[goal.name] = goal;

			return this;
		},

		onGoal: function(name, callback) {
			return this.on(name + '-goal-achieved', callback);
		},

		remove: function(goalNames) {
			goalNames = this._parseGoalNames(goalNames);

			for (var i = 0, length = goalNames.length; i < length; ++i) {
				delete this._goals[goalNames[i]];
			}

			return this;
		},

		start: function(goalNames) {
			this._controlGoals(goalNames, 'start');
			return this;
		},

		stop: function(goalNames) {
			this._controlGoals(goalNames, 'stop');
			return this;
		},

		toggle: function(goalNames, start) {
			if (start) {
				this.start(goalNames);
			} else {
				this.stop(goalNames);
			}

			return this;
		},


		/* PRIVATE */
		_controlGoals: function(goalNames, action) {
			goalNames = this._parseGoalNames(goalNames);

			for (var i = 0, length = goalNames.length; i < length; ++i) {
				var goal = this._goals[goalNames[i]];
				if (goal === undefined) {
					logger.warn('GoalManager: Unknown goal name: ' + goalNames[i]);
					continue;
				}

				goal[action]();
			}
		},

		_createGoalControlFunc: function(goal, action) {
			return function() {
				goal.groups[0][action]();
			}.bind(this);
		},

		_createGroupControlFunc: function(group, action) {
			return function () {
				for (var i = 0, length = group.events.length; i < length; ++i) {
					group.events[i].handler(action);
				}
			}.bind(this);
		},

		_createGoalTriggerFunc: function(goal) {
			return function() {
				var args = {
					name: goal.name
				};

				this.emit('goal-achieved', args);
				this.emit(goal.name + '-goal-achieved', args);
			}.bind(this);
		},

		_createNextGroupTriggerFunc: function(goal, group, nextGroup) {
			if (typeof nextGroup !== 'undefined') {
				return function() {
					group.stop();
					nextGroup.start();
				}.bind(this);
			}

			return goal.trigger;
		},

		_createEventTriggerFunc: function(goal, group, event) {
			return function() {
				this.emit('event-trigger', {
					goalName: goal.name,
					groupName: group.name,
					eventName: event.name
				});
				group.trigger();
			}.bind(this);
		},

		_createGroupTriggerFunc: function(goal, group) {
			return function() {
				if (++group.triggeredCount === group.events.length) {
					this.emit('group-trigger', {
						goalName: goal.name,
						groupName: group.name
					});

					group.nextGroupTrigger();
				}
			}.bind(this);
		},

		_createHandlers: function() {
			var typeHandlers = GoalManager._typeHandlers;
			for (var i = 0, length = typeHandlers.length; i < length; ++i) {
				if (this._handlers[typeHandlers[i].type] !== undefined) {
					continue;
				}
				this._handlers[typeHandlers[i].type] = new typeHandlers[i].handler(this);
			}
		},

		_parseGoalNames: function(goalNames) {
			if (typeof goalNames === 'string') {
				if (goalNames.indexOf(' ') !== -1) {
					return goalNames.split(' ');
				} else {
					return [goalNames];
				}
			}

			throw new Error('GoalManager: Unsupported goal names string format: ' + goalNames);
		},

		_prepareGoal: function(goal) {
			goal.trigger = this._createGoalTriggerFunc(goal);
			goal.start = this._createGoalControlFunc(goal, 'start');
			goal.stop = this._createGoalControlFunc(goal, 'stop');

			for (var i = 0, groupsLength = goal.groups.length; i < groupsLength; ++i) {
				var group = goal.groups[i];
				group.triggeredCount = 0;
				group.trigger = this._createGroupTriggerFunc(goal, group);
				group.nextGroupTrigger = this._createNextGroupTriggerFunc(goal, group, goal.groups[i + 1]);
				group.start = this._createGroupControlFunc(group, 'start');
				group.stop = this._createGroupControlFunc(group, 'stop');

				for (var j = 0, eventsLength = group.events.length; j < eventsLength; ++j) {
					var event = group.events[j];
					var handler = this._handlers[event.type];
					var args = {
						eventTrigger: this._createEventTriggerFunc(goal, group, event),
						func: null,
						params: event.params
					};

					if (handler === undefined) {
						console.warn('GoalManager: Unsupported event type: ' + event.type);
					}

					handler.emit('request-handler', args);
					event.handler = args.func;
				}
			}
		}
	});

	/* STATIC */
	GoalManager._typeHandlers = [];
	GoalManager.addTypeHandler = function (type, handlerType) {
		GoalManager._typeHandlers.push({
			type: type,
			handler: handlerType
		});
	};

	HeO2.utils.GoalManager = GoalManager;
}(HeO2));
