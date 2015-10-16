/*jshint node: true */
'use strict';

/**
 * Class which lightly wraps the Parse.com objects.
 * @constructor
 * @param {Object} config
 * @param {string} config.PARSE_APP_ID
 * @param {string} config.PARSE_JS_KEY
 * @returns {Object}
 *  {@link getApi}
 */
module.exports = function (config) {

    var https = require('request'),
        Parse = require('parse/node').Parse;

    // Initialize our connection to parse.
    Parse.initialize(config.PARSE_APP_ID, config.PARSE_JS_KEY);

    /**
     * Gets a specific column of the request dog.
     * @private
     * @name getDogColumn
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDogColumn(request, response, key) {
        var query = new Parse.Query('Dog');
        query.get(request.params.dogId, {
            success: function (dog) {
                var data = {};
                data[key] = dog.get(key);
                response.json({
                    data: data
                });
            },
            error: function (dog, error) {
                response.json({
                    error: error,
                    data: dog
                });
            }
        });
    }

    /**
     * Gets an array of all dogs sorted ascending by name.
     * @name getDogs
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    function getDogs(request, response) {
        var query = new Parse.Query('Dog');
        query.ascending('name');
        query.find({
            success: function (dogs) {
                response.json({
                    data: dogs
                });
            },
            error: function (error, dogs) {
                response.json({
                    error: error,
                    data: dogs
                });
            }
        });
    }

    /**
     * Gets basic info for a specific dog.
     * @name getDogs
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDog(request, response) {
        var query = new Parse.Query('Dog');
        query.get(request.params.dogId, {
            success: function (dog) {
                response.json({
                    data: dog
                });
            },
            error: function (dog, error) {
                response.json({
                    error: error,
                    data: dog
                });
            }
        });
    }

    /**
     * Gets the notes column for a specific dog.
     * @name getDogNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} dogId
     * @returns {Object}
     */
    function getDogNotes(request, response) {

        var dog = new Parse.Object.extend('Dog'),
            query;

        dog.id = request.params.dogId;
        query = new Parse.Query('DogNotes');
        query.equalTo('dog', dog);
        query.find({
            success: function (notes) {
                response.json({
                    data: notes
                });
            },
            error: function (notes, error) {
                response.json({
                    error: error,
                    data: notes
                });
            }
        });
    }

    /**
     * Gets the photo column for a specific dog.
     * @name getDogPhoto
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDogPhoto(request, response) {
        getDogColumn(request, response, 'image');
    }

    /**
     * Gets the photo column for a specific dog.
     * @name getDogPhoto
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDogPhotoData(request, response) {
        var query = new Parse.Query('Dog');
        query.get(request.params.dogId, {
            success: function (dog) {
                https(dog.get('image').url, function (photoError, photoResponse) {
                    response.sendFile(photoResponse);
                });
            },
            error: function (dog, error) {
                response.json({
                    error: error,
                    data: dog
                });
            }
        });
    }

    /**
     * Gets the summary column for a specific dog.
     * @name getDogSummary
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDogSummary(request, response) {
        response.json({
            data: {}
        });
    }

    // Expose any methods from our module
    return {
        getDogs: getDogs,
        getDog: getDog,
        getDogNotes: getDogNotes,
        getDogPhoto: getDogPhoto,
        getDogSummary: getDogSummary
    };
};
