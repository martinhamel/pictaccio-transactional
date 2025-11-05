/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (global) {
	"use strict";

	var BUBBLE_TIMEOUT = 15000;

	global.imagePickerRef.tutorial = new (EventingClass.extend({
		_ADD_PHOTO_TUTORIAL_GOAL: {
				name: 'initial',
				groups: [
					{
						name: 'track-adding-photos',
						events: [
							{
								name: 'no-click',
								type: 'dom-object',
								params: {
									selector: '#add-photo',
									event: 'click',
									times: 0,
									delay: 10000
								}
							}
						]
					}
				]
			},
		_FAV_TUTORIAL_GOAL: {
				name: 'fav',
				groups: [
					{
						name: 'track-adding-photo',
						events: [
							/*{
								name: 'add-photo-click',
								type: 'event-object',
								params: {
									ref: global.imagePickerRef,
									event: 'photo-added'
								}
							}*/
							// Remember the condition that gets added before the goal is created in ._showGreenScreenBubble
						]
					}
				]
			},
		_FAV_ADDED_TUTORIAL_GOAL: {
				name: 'fav-added',
				groups: [
					{
						name: 'track-adding-fav',
						events: [
							{
								name: 'fav-added',
								type: 'event-object',
								params: {
									ref: global.imagePickerRef,
									event: 'fav-added'
								}
							},
							{
								name: 'no-fav-panel',
								type: 'event-object',
								params: {
									ref: global.imagePickerRef,
									event: 'fav-panel-opened',
									times: 0
								}
							}
						]
					},
					{
						name: 'track-panel-closed',
						events: [
							{
								name: 'panel-closed',
								type: 'event-object',
								params: {
									ref: global.imagePickerRef,
									event: 'fav-panel-closed'
								}
							}
						]
					}
				]
			},
		_GREEN_SCREEN_TUTORIAL_GOAL: {
				name: 'green-screen',
				groups: [
					{
						name: 'tracking-photo-added',
						events: [
							{
								name: 'photo-added',
								type: 'event-object',
								params: {
									ref: global.imagePickerRef,
									event: 'photo-added',
									eventProps: {hasGreenScreen: true}
								}
							}
						]
					}
				]
			},
		_NO_GREEN_SCREEN_TUTORIAL_GOAL: {
			name: 'no-green-screen',
			groups: [
				{
					name: 'tracking-photo-added',
					events: [
						{
							name: 'photo-added',
							type: 'event-object',
							params: {
								ref: global.imagePickerRef,
								event: 'photo-added',
								eventProps: {hasGreenScreen: false}
							}
						}
					]
				}
			]
		},

		_ADD_PHOTO_BUBBLE: {
			extraCss: 'magra',
			pointAt: '#add-photo',
			position: 'below',
			text: 'Pour commencer, cliquer sur \'Ajouter une photo\' pour choisir les photos que vous désirez garder.',
			width: '350px',
			dismissConditions: [
				{
					type: 'time',
					params: {
						delay: BUBBLE_TIMEOUT
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: '#add-photo',
						event: 'click'
					}
				}
			]
		},
		_HOW_TO_FAV_BUBBLE: {
			extraCss: 'magra',
			pointAt: '#backgrounds div:first-child div.favorite-icon',
			position: 'above',
			text: 'Pour vous aidez à choisir votre image de fond, vous pouvez enregistrer ceux que vous préférer dans vos favoris pour les retrouver plus facilement dans la bar des favoris sur la gauche.',
			width: '400px',
			dismissConditions: [
				{
					type: 'time',
					params: {
						delay: BUBBLE_TIMEOUT
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: 'itself',
						event: 'click'
					}
				},
				{
					type: 'event-object',
					params: {
						ref: global.imagePickerRef,
						event: 'fav-added'
					}
				}
			]
		},
		_HOW_TO_FAV_PANEL_BUBBLE: {
			extraCss: 'magra',
			pointAt: '#fav-button',
			position: 'above',
			text: 'Maintenant que vous avez ajouter un fond à vos favoris, vour pourrez le retrouver à tout moment en cliquant sur le bouton étoile pour ouvrir la barre des favoris.',
			width: '350px',
			dismissConditions: [
				{
					type: 'time',
					params: {
						delay: BUBBLE_TIMEOUT
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: 'itself',
						event: 'click'
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: '#add-photo',
						event: 'click'
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: '#fav-button',
						event: 'click'
					}
				}
			]
		},
		_GREEN_SCREEN_BUBBLE: {
			extraCss: 'magra',
			pointAt: '#selected-images img:last-child',
			position: 'below',
			text: 'Cette image <span style="font-weight: bold;">contient un fond vert</span>, vous pourrez donc changer le fond avec une des images ci-dessous. Cliquer simplement sur l\'image de fond désirez pour l\'appliquer l\'image sélectionée, celle afficher en évidence à droite.',
			width: '400px',
			dismissConditions: [
				{
					type: 'time',
					params: {
						delay: BUBBLE_TIMEOUT
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: 'itself',
						event: 'click'
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: '#add-photo',
						event: 'click'
					}
				}
			]
		},
		_NO_GREEN_SCREEN_BUBBLE: {
			extraCss: 'magra',
			pointAt: '#selected-images img:last-child',
			position: 'below',
			text: 'Cette image ne <span style="font-weight: bold">contient pas de fond vert</span>, il ne sera donc pas possible de changer le fond de cette image et les images des fonds n\'auront aucune effet sur cette photo.',
			width: '400px',
			dismissConditions: [
				{
					type: 'time',
					params: {
						delay: BUBBLE_TIMEOUT
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: 'itself',
						event: 'click'
					}
				},
				{
					type: 'dom-object',
					params: {
						selector: '#add-photo',
						event: 'click'
					}
				}
			]
		},

		init: function () {
			this._super();

			this._bubbleAddPhoto = null;
			this._bubbleHowToFav = null;
			this._bubbleHowToFavPanel = null;
			this._bubbleHowToGreenScreen = null;
			this._bubbleHowToNotGreenScreen = null;
			this._goalManager = null;
			this._needsCoaching = false;

			this._goalManager = new GoalManager();
			this._createGoals();
			this._startMinimalTutorial();
		},


		/* EVENT HANDLERS */
		_addPhotoGoal_achieved: function() {
			this._needsCoaching = true;
			this._startCoachingTutorials();
			this._goalManager.stop(this._ADD_PHOTO_TUTORIAL_GOAL.name);

			this._bubbleAddPhoto.show(true, true);
		},

		_favGoal_achieved: function() {
			this._goalManager.stop(this._FAV_TUTORIAL_GOAL.name);

			this._bubbleHowToFav.show(true, true);
		},

		_favAddedGoal_achieved: function() {
			this._goalManager.stop(this._FAV_ADDED_TUTORIAL_GOAL.name);

			this._bubbleHowToFavPanel.show(true, true);
		},

		_greenScreenGoal_achieved: function() {
			this._showGreenScreenBubble();
		},

		_noGreenScreenGoal_achieved: function() {
			this._showNoGreenScreenBubble();
		},


		/* PRIVATE */
		_createGoals: function() {
			this._goalManager
				.add(this._ADD_PHOTO_TUTORIAL_GOAL)
				.onGoal(this._ADD_PHOTO_TUTORIAL_GOAL.name, this._addPhotoGoal_achieved.bind(this))

				.add(this._FAV_ADDED_TUTORIAL_GOAL)
				.onGoal(this._FAV_ADDED_TUTORIAL_GOAL.name, this._favAddedGoal_achieved.bind(this))

				.add(this._GREEN_SCREEN_TUTORIAL_GOAL)
				.onGoal(this._GREEN_SCREEN_TUTORIAL_GOAL.name, this._greenScreenGoal_achieved.bind(this))

				.add(this._NO_GREEN_SCREEN_TUTORIAL_GOAL)
				.onGoal(this._NO_GREEN_SCREEN_TUTORIAL_GOAL.name, this._noGreenScreenGoal_achieved.bind(this));
		},

		_showGreenScreenBubble: function() {
			this._bubbleHowToGreenScreen =
				new Bubble(this._GREEN_SCREEN_BUBBLE)
					.show(true, true);

			// Need to add a condition onto _FAV_TUTORIAL_GOAL that uses an object that was created after the class definition.
			// Quite the kludge but.. oh well
			this._FAV_TUTORIAL_GOAL.groups[0].events.push({
				name: 'after-green-screen-bubble',
				type: 'event-object',
				params: {
					ref: this._bubbleHowToGreenScreen,
					event: 'dismissed'
				}
			});

			if (this._needsCoaching) {
				this._goalManager
					.add(this._FAV_TUTORIAL_GOAL)
					.onGoal(this._FAV_TUTORIAL_GOAL.name, this._favGoal_achieved.bind(this))
					.start(this._FAV_TUTORIAL_GOAL.name);
			}
		},

		_showNoGreenScreenBubble: function() {
			this._bubbleHowToNotGreenScreen =
				new Bubble(this._NO_GREEN_SCREEN_BUBBLE)
					.show(true, true);
		},

		_startCoachingTutorials: function() {
			this._goalManager
				.start(this._FAV_ADDED_TUTORIAL_GOAL.name);

			this._bubbleHowToFav = new Bubble(this._HOW_TO_FAV_BUBBLE);
			this._bubbleHowToFavPanel = new Bubble(this._HOW_TO_FAV_PANEL_BUBBLE);
		},

		_startMinimalTutorial: function() {
			this._goalManager
				.start(this._ADD_PHOTO_TUTORIAL_GOAL.name)
				.start(this._GREEN_SCREEN_TUTORIAL_GOAL.name)
				.start(this._NO_GREEN_SCREEN_TUTORIAL_GOAL.name);

			this._bubbleAddPhoto = new Bubble(this._ADD_PHOTO_BUBBLE);
		}
	}));
}(window));
