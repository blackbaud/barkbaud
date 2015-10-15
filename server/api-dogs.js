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

    var Parse = require('parse/node').Parse;

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
                response.json({
                    data: {
                        key: dog.get(key)
                    }
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
     * Gets an array of all dogs.
     * @name getDogs
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    function getDogs(request, response) {
        var query = new Parse.Query('Dog');
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
     * Gets the photo column for a specific dog.
     * @name getDogPhoto
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getDogPhoto(request, response) {
        getDogColumn(request, response, 'photo');
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

    /**
     * Gets the notes column for a specific dog.
     * @name getDogNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} dogId
     * @returns {Object}
     */
    function getDogNotes(request, response) {
        response.json({
            data: {
            }
        });
    }

    // Expose any methods from our module
    return {
        getDogs: getDogs,
        getDog: getDog,
        getDogSummary: getDogSummary,
        getDogNotes: getDogNotes
    };
};
