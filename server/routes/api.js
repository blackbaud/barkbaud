/*jshint node: true */
(function () {
    'use strict';

    var async,
        Dog,
        https,
        mongoose,
        Sky;

    async = require('async');
    https = require('request');
    mongoose = require('mongoose');
    Dog = require('../database/models/dog');
    Sky = require('../libs/sky');

    /**
     * Gets an array of all dogs sorted ascending by name.
     * @name getDogs
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    function getDogs(request, response) {
        Dog.find({}).sort({
            'name': 'ascending'
        }).exec(function (error, docs) {
            if (error) {
                return onParseError(response, error);
            }
            response.json({
                data: docs
            });
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
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, doc) {
            if (error) {
                return onParseError(response, error);
            }
            response.json({
                data: doc
            });
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
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            if (error) {
                return onParseError(response, error);
            }
            response.json({
                data: dog.notes
            });
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
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            var currentOwner;

            if (error) {
                return onParseError(response, error);
            }

            // Get the current owner.
            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive) {
                        currentOwner = owner;
                        return;
                    }
                });
            }

            if (currentOwner) {
                Sky.getConstituent(request, currentOwner.constituentId, function (constituent) {
                    var temp;
                    temp = currentOwner.toObject();
                    temp.constituent = constituent;
                    Sky.getConstituentProfilePicture(request, currentOwner.constituentId, function (data) {
                        if (!data.error) {
                            temp.constituent.profile_picture = data;
                        }
                        response.json({
                            data: temp
                        });
                    });
                });
            } else {
                response.json({
                    data: []
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
        Dog.aggregate([
            { $match: {
                '_id': mongoose.Types.ObjectId(request.params.dogId)
            } },
            { $unwind: "$owners" },
            { $project: {
                _id: '$owners._id',
                constituentId: '$owners.constituentId',
                fromDate: '$owners.fromDate',
                toDate: '$owners.toDate',
                isActive: '$owners.isActive'
            } },
            { $match: {
                isActive: false
            } },
            { $sort: {
                fromDate: -1
            } }
        ], function (error, owners) {
            var waterfall;
            waterfall = [];

            if (error) {
                return onParseError(response, error);
            }

            function fetchConstituent(index, callback) {
                Sky.getConstituent(request, owners[index].constituentId, function (constituent) {
                    owners[index].constituent = constituent;
                    if (typeof callback === "function") {
                        callback(null, ++index);
                    }
                });
            }

            owners.forEach(function (owner, i) {
                if (i === 0) {
                    waterfall.push(async.apply(fetchConstituent, i));
                } else {
                    waterfall.push(fetchConstituent);
                }
            });

            async.waterfall(waterfall, function (error) {
                if (error) {
                    return onParseError(response, error);
                }
                response.json({
                    data: owners
                });
            });
        });
    }

    function getFindHome(request, response) {
        Sky.getConstituentSearch(request, request.query.searchText, function (results) {
            response.json(results);
        });
    }

    /**
     * Sets the current home of the specified dog.
     * Sets the toDate of the previous currentHome first.
     * @name postCurrentHome
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.body.id
     */
    function postCurrentHome(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            var currentDate;

            if (error) {
                return onParseError(response, error);
            }

            currentDate = new Date();

            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive === true) {
                        owner.toDate = currentDate;
                        owner.isActive = false;
                    }
                });
            }

            dog.owners.push({
                constituentId: request.body.id,
                fromDate: currentDate,
                isActive: true
            });

            dog.save(function (error) {
                if (error) {
                    return onParseError(response, error);
                }
                response.json({
                    data: dog.toObject()
                });
            });
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
        Dog.findOne({
            _id: request.params.dogId
        }).exec(function (error, dog) {

            var currentDate,
                currentOwner,
                dogNote;

            if (error) {
                return onParseError(response, error);
            }

            // Get the current owner.
            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive) {
                        currentOwner = owner;
                        return;
                    }
                });
            }

            currentDate = new Date();

            // Validate current owner if requesting to addConstituentNote
            if (request.body.addConstituentNote && !currentOwner) {
                return onParseError(response, {
                    message: 'Dog does not have a current owner to save the note to.'
                });

            } else if (!request.body.title || !request.body.description || request.body.title === '' || request.body.description === '') {
                return onParseError(response, {
                    message: 'Title and description are required'
                });

            } else {
                dogNote = dog.notes.push({
                    date: currentDate,
                    title: request.body.title,
                    description: request.body.description
                });

                dog.save(function (error) {

                    if (error) {
                        return onParseError(response, error);
                    }

                    if (request.body.addConstituentNote) {
                        Sky.postNotes(request, {
                            constituent_id: currentOwner.constituentId,
                            type: 'Barkbaud',
                            date: {
                                y: currentDate.getFullYear(),
                                m: currentDate.getMonth() + 1,
                                d: currentDate.getDate()
                            },
                            summary: request.body.title,
                            text: request.body.description
                        }, function (note) {
                            response.json({
                                data: note
                            });
                        });
                    } else {
                        response.json({
                            data: dogNote
                        });
                    }
                });
            }
        });
    }

    /**
     * Handles parse errors
     * @internal
     * @name handleError
     * @param {Object} response
     * @param {Object} error
    */
    function onParseError(response, error) {
        response.status(500).json({
            error: error
        });
    }


    module.exports = {
          getCurrentHome: getCurrentHome,
          getDog: getDog,
          getDogs: getDogs,
          getFindHome: getFindHome,
          getNotes: getNotes,
          getPreviousHomes: getPreviousHomes,
          postCurrentHome: postCurrentHome,
          postNotes: postNotes
    };
}());
