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
module.exports = function (config, apiNxt) {

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
     * Gets all notes for a specific dog.
     * @name getDogNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} dogId
     * @returns {Object}
     */
    function getDogNotes(request, response) {

        var queryDog = new Parse.Query('Dog'),
            queryNotes = new Parse.Query('DogNotes');

        queryDog.get(request.params.dogId, {
            success: function (dog) {
                queryNotes.equalTo('dog', dog);
                queryNotes.find({
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
        var queryDog = new Parse.Query('Dog'),
            queryOwnerHistory = new Parse.Query('DogOwnerHistory');

        // Get the requested dog
        queryDog.get(request.params.dogId, {
            success: function (dog) {

                // Get the owner history tied to this dog
                queryOwnerHistory.equalTo('dog', dog);
                queryOwnerHistory.find({

                    // Successfully found the owner history
                    success: function (history) {
                        var i = 0,
                            j = history.length,
                            responses = 0;

                        // Find the constituent information for each of our owner in this dogs owner history
                        for (i; i < j; i++) {
                            apiNxt.getConstituent(request, history[i].get('constituentId'), function (constituent) {
                                history[i].set('constituent', constituent);
                                if (history.length === ++responses) {
                                    response.json({
                                        data: history
                                    });
                                }
                            });
                        }

                    },

                    // Error getting the owner history
                    error: function (history, error) {
                        response.json({
                            error: error,
                            data: history
                        });
                    }
                });
            },

            // Error getting the requested dog
            error: function (dog, error) {
                response.json({
                    error: error,
                    data: dog
                });
            }
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
