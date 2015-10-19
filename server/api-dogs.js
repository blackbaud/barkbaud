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
     * @name getNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getNotes(request, response) {

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
     * Gets the current home for a specific dog.
     * @name getCurrentHome
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getCurrentHome(request, response) {
        var queryDog = new Parse.Query('Dog'),
            queryOwnerHistory = new Parse.Query('DogOwnerHistory');

        // Get the requested dog
        queryDog.get(request.params.dogId, {
            success: function (dog) {
                queryOwnerHistory.get(dog.currentOwner, {
                    success: function (owner) {
                        apiNxt.getConstituent(request, owner.get('constituentId'), function (constituent) {
                            owner.set('constituent', constituent);
                            response.json({
                                data: owner
                            });
                        });
                    },
                    error: function (history, error) {
                        response.json({
                            error: error,
                            data: history
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
     * Gets the previous homes for a specific dog, excluding the current home.
     * @name getPreviousHomes
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @returns {Object}
     */
    function getPreviousHomes(request, response) {
        var queryDog = new Parse.Query('Dog'),
            queryOwnerHistory = new Parse.Query('DogOwnerHistory');

        // Get the requested dog
        queryDog.get(request.params.dogId, {
            success: function (dog) {

                // Get the owner history tied to this dog
                queryOwnerHistory.equalTo('dog', dog);
                queryOwnerHistory.notEqualTo('objectId', dog.currentOwner);
                queryOwnerHistory.find({

                    // Successfully found the owner history
                    success: function (history) {
                        var i = 0,
                            j = history.length,
                            responses = [];

                        function buildConstituent(index) {
                            apiNxt.getConstituent(request, history[index].get('constituentId'), function (constituent) {
                                history[index].set('constituent', constituent);
                                if (history.length === ++responses) {
                                    response.json({
                                        data: history
                                    });
                                }
                            });
                        }

                        // Find the constituent information for each of our owner in this dogs owner history
                        for (i; i < j; i++) {
                            buildConstituent(i);
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

    /**
     * Posts a note for a specific dog.
     * @name postNotes
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.body.constituentId
     * @param {string} request.body.title
     * @param {string} request.body.description
     * @param {string} request.body.addToOwner
     * @returns {Object}
     */
    function postNotes(request, response) {
        var query = new Parse.Query('Dog'),
            DogNote = new Parse.Object.extend('DogNotes'),
            date = new Date(),
            dogBodyNxt,
            dogBodyParse,
            dogDate,
            dogNote;

        query.get(request.params.dogId, {
            success: function (dog) {
                dogNote = new DogNote();
                dogDate = new Date();
                dogBodyParse = {
                    dog: dog,
                    date: dogDate,
                    title: request.body.title,
                    description: request.body.description
                };

                dogNote.save(dogBodyParse, {
                    success: function (dogNote) {
                        if (request.body.addConstituentNote) {
                            dogBodyNxt = JSON.stringify({
                                type: 'Barkbaud',
                                date: {
                                    y: dogDate.getYear(),
                                    m: dogDate.getMonth(),
                                    d: dogDate.getDay()
                                },
                                summary: request.body.title,
                                text: request.body.description
                            });
                            apiNxt.postNotes(request, request.body.constituentId, dogBodyNxt, function (apiDogNote) {
                                response.json({
                                    data: apiDogNote
                                });
                            });
                        } else {
                            response.json({
                                data: dogNote
                            });
                        }
                    },
                    error: function (dogNote, error) {
                        response.json({
                            error: error,
                            dogNote: dogNote
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

    // Expose any methods from our module
    return {
        getDogs: getDogs,
        getDog: getDog,
        getDogNotes: getNotes,
        getCurrentHome: getCurrentHome,
        getPreviousHomes: getPreviousHomes,
        postNotes: postNotes
    };
};
