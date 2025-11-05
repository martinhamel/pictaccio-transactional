(function (HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const ViewComponent = HeO2.require('HeO2.View.Component');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const GOOGLE_MAP_DEFAULTS = {
        disableDefaultUI: false,
        gesture: 'none',
        keyboard: false,
        mapType: 'roadmap', // roadmap, satellite, hybrid, terrain
        zoom: 10,
    };
    const GOOGLE_MAP_STYLE_DEFAULTS = {
        elementType: 'all',
        featureType: 'road',
    };
    const GOOGLE_MAP_GEOCODE_STATUS = {
        OK: 'ok',
        ZERO_RESULTS: 'no-results',
        OVER_QUERY_LIMIT: 'over-limit',
        REQUEST_DENIED: 'denied',
        INVALID_REQUEST: 'invalid',
        UNKNOWN_ERROR: 'unknown-error',
        ERROR: 'error'
    };
    const GOOGLE_MAP_COMPONENTS_MAP = {
        street_number: 'civicNumber',
        route: 'streetName',
        locality: 'city',
        sublocality: 'city',
        administrative_area_level_1: 'state',
        administrative_area_level_2: 'stateSublevel2',
        administrative_area_level_3: 'stateSublevel3',
        country: 'country',
        postal_code: 'postalCode'
    };
    const LATLNG_REGEX = /^(-?\d+(?:\.\d+)?), *(-?\d+(?:\.\d+)?)$/;
    const POSITION_ASYNC = {};

    /**
     *
     * @type {GoogleMap}
     */
    const GoogleMap = EventingClass.extend({
        init: function(targetNode, options) {
            this._super();

            this._options = helpers.merge(GOOGLE_MAP_DEFAULTS, options);
            this._targetNode = targetNode;
            this._map = null;
            this._markers = [];
            this._namedMarkers = Object.create(null);
            this._disambiguateCallback = null;

            this._createMap();
        },

        center: function(position, callback) {
            position = this._position(position, function(results) {
                callback(results, function(index) {
                    if (results.status === 'ok') {
                        this._center(results.matches[index].location.latlng);
                    }
                }.bind(this));
            }.bind(this));

            if (position !== POSITION_ASYNC) {
                this._center(position);
            }

            return this;
        },

        disambiguate: function(matches, target, callback) {
            var targetNode = $(target);

            if (targetNode.length === 0) {
                console.error('GoogleMapsComponent: target not found');
                return;
            }
            if (!targetNode.is('ul')) {
                console.error('GoogleMapsComponent: target must be a UL node, \'' + target.nodeType + '\' given');
                return;
            }
            if (this._disambiguateCallback) {
                this._disambiguateCallback();
            }

            this._disambiguateCallback = callback;
            targetNode.on('click', 'li', function (event) {
                callback($(event.currentTarget).data('index'));
                this._disambiguateCallback = null;
            });
            for (var i = 0, length = matches.length; i < length; ++i) {

                targetNode.append($('<li>' + (matches[i].parts.civicNumber || '[MISSING]') + ' ' + (matches[i].parts.streetName || '[MISSING]') + ' ' + (matches[i].parts.city || '[MISSING]') +
                        '<small>' + (matches[i].parts.state || '[MISSING]') + ' ' + (matches[i].parts.postalCode || '[MISSING]') + ', ' + (matches[i].parts.country || '[MISSING]') + '</small></li>')
                    .data('index', i));
            }
        },

        placeMarker: function(position, name, options, callback) {
            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            position = this._position(position, function(results) {
                callback(results, function(index) {
                    if (results.status === 'ok') {
                        this._placeMarker(name, results.matches[index].location.latlng);
                        if (options.center === true) {
                            this._center(results.matches[index].location.latlng)
                        }
                        if (options.zoom) {
                            this.zoom(options.zoom);
                        }
                    }
                }.bind(this));
            }.bind(this));

            if (position !== POSITION_ASYNC) {
                this._placeMarker(name, position);
            }

            return this;
        },

        removeMarker: function(name) {
            if (this._namedMarkers[name]) {
                this._namedMarkers[name].setMap(null);
                delete this._namedMarkers[name];
            }

            return this;
        },

        zoom: function(level) {
            this._map.setZoom(level);
            return this;
        },

        /* PRIVATE */
        _breakdownAddress: function(match) {
            var parts = Object.create(null);
            for (var i = 0, length = match.address_components.length; i < length; ++i) {
                for (var j = 0, typesLength = match.address_components[i].types.length; j < typesLength; ++j) {
                    if (GOOGLE_MAP_COMPONENTS_MAP[match.address_components[i].types[j]] !== undefined) {
                        parts[GOOGLE_MAP_COMPONENTS_MAP[match.address_components[i].types[j]]] = match.address_components[i].long_name;
                        parts[GOOGLE_MAP_COMPONENTS_MAP[match.address_components[i].types[j]] + '_short'] = match.address_components[i].short_name;
                        continue;
                    }
                }
            }

            return parts;
        },

        _center: function(latlng) {
            this._map.setCenter(latlng);
        },

        _createMap: function() {
            this._map = new google.maps.Map(this._targetNode[0],
                this._prepareMapOptions()
            );
        },

        _createStyle: function() {
            var styleOptions = {
                name: 'noLinks'
            };

            var MAP_STYLE = [
                {
                    featureType: 'road',
                    elementType: 'all',
                    stylers: [
                        { visibility: 'on' }
                    ]
                }
            ];

            var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
            map.mapTypes.set('noLinks', mapType);
        },

        _placeMarker: function(name, latlng) {
            var marker = new google.maps.Marker({
                position: latlng,
                map: this._map
            });

            if (name) {
                if (this._namedMarkers[name] !== undefined) {
                    this.removeMarker(name);
                }
                this._namedMarkers[name] = marker;
            } else {

                this._markers.push(marker);
            }
        },

        _position: function(descriptor, callback) {
            var latlngMatches = descriptor.match(LATLNG_REGEX);
            if (latlngMatches) {
                return new google.maps.LatLng(latlngMatches[1], latlngMatches[2]);
            } else {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({address: descriptor}, function(response, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        callback({
                            status: 'ok',
                            matches: this._prepareGeocodingResults(response)
                        })

                    } else {
                        callback({
                            status: GOOGLE_MAP_GEOCODE_STATUS[status]
                        })
                    }
                }.bind(this));

                return POSITION_ASYNC;
            }

            logger.warn('GoogleMap: Unknown position descriptor \'' + descriptor + '\'');
            return new google.maps.LatLng(0, 0);
        },

        _prepareGeocodingResults: function(response) {
            var results = [];

            for (var i = 0, length = response.length; i < length; ++i) {
                results.push({
                    parts: this._breakdownAddress(response[i]),
                    components: response[i].address_components,
                    formatted: response[i].formatted_address,
                    location: {
                        lat: response[i].geometry.location.lat(),
                        lng: response[i].geometry.location.lng(),
                        type: response[i].geometry.location_type,
                        latlng: response[i].geometry.location
                    },
                    types: response[i].types,
                    placeId: response[i].place_id
                });
            }

            return results;
        },

        _prepareMapOptions: function() {
            return {
                center: this._position(this._options.center),
                disableDefaultUI: this._options.disableDefaultUI,
                gestureHandling: this._options.gesture,
                keyboardShortcuts: this._options.keyboard,
                mapTypeID: this._options.mapType,
                zoom: parseInt(this._options.zoom, 10)
            }
        }
    });


    const GOOGLEMAPS_ATTRIBUTE_NAME = 'data-heo2-gmaps';
    const GOOGLEMAPS_NODE_SELECTOR = '[' + GOOGLEMAPS_ATTRIBUTE_NAME + ']';

    /**
     *
     * @type {GoogleMapsComponent}
     */
    const GoogleMapsComponent = ViewComponent.extend({
        /* LIFE CYCLE */
        _initialize: function() {
            this.maps = Object.create(null);
        },

        _attach: function() {
            $(GOOGLEMAPS_NODE_SELECTOR)
                .each(function(index, element) {
                    var elementNode = $(element);
                    var params = this._parseParamString(elementNode.attr(GOOGLEMAPS_ATTRIBUTE_NAME));
                    var name = params.name || element.id;

                    if (this.maps[name] !== undefined) {
                        logger.error('GoogleMapsComponent: Map target \'' + name + '\' already exist');
                        return;
                    }

                    this.maps[name] = new GoogleMap(elementNode, params);
                }.bind(this));
        },

        /* EVENT HANDLERS */

        /* PRIVATE */
    });

    ViewComponent.add('GoogleMaps', GoogleMapsComponent);
}(HeO2, jQuery));
