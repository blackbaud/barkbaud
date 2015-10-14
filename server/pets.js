/*jshint node: true */
'use strict';

/**
 * Class which lightly wraps the Pet Finder API endpoints.
 * @constructor
 * @param {Object} config
 * @param {string} config.PETS_KEY
 * @param {string} config.PETS_SECRET
 * @returns {Object}
 *  {@link getApi}
 */
module.exports = function (config) {

    var http = require('request');

    /**
     * Requests a specific pet.
     * @name getConstituents
     * @param {Object} request
     * @param {Object} response
     */
    function get(id, request, response) {
        var options = {
            url: 'http://api.petfinder.com/pet.get',
            qs: {
                key: config.PETS_KEY,
                id: id,
                format: 'json'
            }
        };
        http(options, function (apiError, apiResponse, apiBody) {
            response.json(JSON.parse(apiBody));
        });
    }

    /**
     * Requests a random pet.
     * @name getConstituents
     * @param {Object} request
     * @param {Object} response
     */
    function getRandom(request, response) {
        var options = {
            url: 'http://api.petfinder.com/pet.getRandom',
            qs: {
                key: config.PETS_KEY,
                format: 'json'
            }
        };
        http(options, function (apiError, apiResponse, apiBody) {
            var json = JSON.parse(apiBody);
            get(json.petfinder.petIds.id.$t, request, response);
        });
    }

    return {
        getRandom: getRandom
    };
};
