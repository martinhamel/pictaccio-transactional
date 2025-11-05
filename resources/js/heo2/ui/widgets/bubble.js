(function (HeO2, $) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const GoalManager = HeO2.require('HeO2.utils.GoalManager');
	const randomString = HeO2.require('HeO2.utils.randomString');
	const helpers = HeO2.require('HeO2.common.helpers');

	const DEFAULT_OPTIONS = {
        animation: {
            offsetAmplitude: '150px',
                duration: 500,
                easingIn: 'easeOutExpo',
                easingOut: 'easeOutExpo'
        },
        cssBackground: 'bubble-default-background',
        cssBubble: 'bubble-positioning',
        cssStyle: 'bubble-style',
        dismissConditions: [
            /* use GoalManager event structure
             * {
             *   name: <can be omitted
             *   type: <time, dom-object, event-object>,
             *   params: <see goalManager>
             *    Note: To refer to the bubble itself, set type to 'dom-object' and params.selector to 'itself'
             * }
             */
        ],
        extraCss: '',
        height: null,
        pointAt: {x: 0, y: 0},
        position: 'above', // above, below, left, right
        text: '',
        width: null
    };

	const DISMISS_GOAL_NAME = 'bubble-dismiss';

	const Bubble = EventingClass.extend({
        _attached: false,
        _bubbleNode: null,
		_bubblePosition: null,
		_options: null,
		_visible: false,

		init: function(options) {
			this._super();

			this._dismissGoal = new GoalManager()
				.on('event-trigger', this._goalEvent_trigger.bind(this));

			this.setOptions(options);
		},

        detach: function() {
            this._bubbleNode.detach();
            this._attached = false;
        },

		setOptions: function(options) {
			this._options = helpers.merge(true, this._options || DEFAULT_OPTIONS, options);
			['above', 'below', 'left', 'right'].indexOf(this._options.position) === -1 && (this._options.position = 'above');

			this._create();
			this._setDismissConditions();

			return this;
		},

		show: function(show, animate) {
		    show = show === undefined ? true : show;

		    if (show && this._attached === false) {
                $('body').append(this._bubbleNode);
            }

			if (this._visible === show) {
				return this;
			}

			this._showAnimated = animate;

			if (animate) {
				this._animate(show);
			} else {
				if (show) {
					this._bubbleNode.show();
					this._emitShow();
				} else {
					this._bubbleNode.hide();
					this._emitDismissed();
				}
			}
			this._dismissGoal.toggle(DISMISS_GOAL_NAME, show);

			return this;
		},

		text: function(text) {
			this._options.text = text;
			this._bubbleNode.html(text);
			return this;
		},


		/* EVENT HANDLERS */
		_goalEvent_trigger: function() {
			this._dismissGoal.stop('bubble-dismiss');
			this.show(false, this._showAnimated);
		},


		/* PRIVATE */
		_animate: function(show) {
			var pos = this._options.position;
			var top = parseInt(this._bubbleNode.css('top'), 10);
			var left = parseInt(this._bubbleNode.css('left'), 10);

			this._bubbleNode
				.css({
					opacity: show ? 0 : 1,
					display: 'block'
				})
				.offset({
					top: show ? (pos === 'above' ?
									top - parseInt(this._options.animation.offsetAmplitude, 10) :
									(pos === 'below' ?
										top + parseInt(this._options.animation.offsetAmplitude, 10) :
										top)) :
									top,
					left: show ? (pos === 'left' ?
									left - parseInt(this._options.animation.offsetAmplitude, 10) :
									(pos === 'right' ?
										left + parseInt(this._options.animation.offsetAmplitude, 10) :
										left)) :
									left
				})
				.animate({
					top: pos === 'above' ?
									'+=' + this._options.animation.offsetAmplitude :
									(pos === 'below' ?
										'-=' + this._options.animation.offsetAmplitude :
										undefined),
					left: pos === 'left' ?
									'+=' + this._options.animation.offsetAmplitude :
									(pos === 'right' ?
										'-=' + this._options.animation.offsetAmplitude :
										undefined),
					opacity: show ? 1 : 0
				}, this._options.animation.duration, show ? this._options.animation.easingIn : this._options.animation.easingOut,
				function() {
					if (!show) {
						this._bubbleNode.css(this._bubblePosition);
						this._emitDismissed();
						this._bubbleNode.hide();
					} else {
						this._emitShow();
					}
				}.bind(this)
			);
		},

		_computePointAt: function() {
			var elementNode = this._options.pointAt;

			// Attempt to cast to jQuery if pointAt isn't already a jQuery object
			elementNode.constructor !== $ && (elementNode = $(elementNode));

			this._options.pointAt = {
				x:  elementNode.offset().left +
						(['left', 'right'].indexOf(this._options.position) === -1 ?
							elementNode.outerWidth() / 2 :
							(this._options.position === 'right' ?
								elementNode.outerWidth() :
								0)),
				y: elementNode.offset().top +
						(this._options.position === 'below' ?
							elementNode.outerHeight() :
							(['left', 'right'].indexOf(this._options.position) !== -1 ? elementNode.outerHeight() / 2 :
							0))
			};
		},

		_create: function() {
			this._bubbleNode = $('<div></div>')
				.addClass(this._options.cssBubble)
				.addClass(this._options.position)
				.addClass(this._options.cssStyle)
				.addClass(this._options.cssBackground)
				.addClass(this._options.extraCss)
				.css({
					display: 'none',
					zIndex: 100000
				})
				.html(this._options.text);
			if (this._options.width) {
				this._bubbleNode.css('width', this._options.width);
			}
			if (this._options.height) {
				this._bubbleNode.css('height', this._options.height);
			}

			$('body').append(this._bubbleNode);
			this._position();
			this._attached = true;
		},

		_emitDismissed: function() {
			this._visible = false;
			this.emit('dismissed');
		},

		_emitShow: function() {
			this._visible = true;
			this.emit('show');
		},

		_position: function() {
			var bubblePosition = Object.create(null);
			var bubbleSize = {
				width: this._bubbleNode.width() + parseInt(this._bubbleNode.css('padding-left'), 10) + parseInt(this._bubbleNode.css('padding-right'), 10),
				height: this._bubbleNode.height() + parseInt(this._bubbleNode.css('padding-top'), 10) + parseInt(this._bubbleNode.css('padding-bottom'), 10)
			};

			this._options.pointAt.constructor !== Object && this._computePointAt();

			// TODO: Refactor hardcoded offsets for tick size
			switch (this._options.position) {
			case 'above':
				bubblePosition = {
					left: this._options.pointAt.x - bubbleSize.width / 2,
					top: this._options.pointAt.y - bubbleSize.height - 20
				};
				break;

			case 'below':
				bubblePosition = {
					left: this._options.pointAt.x - bubbleSize.width / 2,
					top: this._options.pointAt.y + 20
				};
				break;

			case 'left':
				bubblePosition = {
					left: this._options.pointAt.x - bubbleSize.width - 20,
					top: this._options.pointAt.y - (bubbleSize.height / 2)
				};
				break;

			case 'right':
				bubblePosition = {
					left: this._options.pointAt.x + 20,
					top: this._options.pointAt.y - (bubbleSize.height / 2)
				}
			}

			this._bubblePosition = bubblePosition;
			this._bubbleNode.css(bubblePosition);
		},

		_setDismissConditions: function() {
			for (var i = 0, length = this._options.dismissConditions.length; i < length; ++i) {
				if (this._options.dismissConditions[i].name === undefined) {
					this._options.dismissConditions[i].name = Date.now() + randomString.generate();
				}
				if (	this._options.dismissConditions[i].type === 'dom-object' &&
					this._options.dismissConditions[i].params.selector === 'itself') {
					this._options.dismissConditions[i].params.selector = this._bubbleNode;
				}
			}

			this._dismissGoal.add({
				name: DISMISS_GOAL_NAME,
				groups: [{
                    name: 'dismiss-group',
                    events: this._options.dismissConditions
                }]
			});
		}
	});

	Bubble.create = function(options, show) {
	    show = show === undefined ? true : show;
	    var bubble = new Bubble(options);
	    if (show) {
	        bubble.show();
        }
        return bubble;
    };

    HeO2.UI.Widgets.Bubble = Bubble;
}(HeO2, jQuery));
