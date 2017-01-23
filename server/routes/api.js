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

    mongoose.Promise = global.Promise;

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
        }).exec().then(function (docs) {
            response.json({
                count: docs.length || 0,
                value: docs
            });
        }).catch(function (error) {
            errorResponse(response, error);
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
        }).exec().then(function (doc) {
            response.json(doc);
        }).catch(function (error) {
            errorResponse(response, error);
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
                return errorResponse(response, error);
            }
            response.json({
                count: dog.notes.length || 0,
                value: dog.notes
            });
        });
    }

    function getNoteTypes(request, response) {
        Sky.getConstituentNoteTypes(request).then(function (data) {
            response.json(data);
        }).catch(function (error) {
            errorResponse(response, error);
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
        }).exec().then(function (dog) {
            var currentOwner;

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
                Sky.getConstituent(request, currentOwner.constituentId).then(function (constituent) {
                    var temp;
                    temp = currentOwner.toObject();
                    temp.constituent = constituent;
                    Sky.getConstituentProfilePicture(request, currentOwner.constituentId).then(function (data) {
                        if (!data.error) {
                            temp.constituent.profile_picture = data;
                        }
                        response.json(temp);
                    }).catch(function () {
                        response.json({});
                    });
                }).catch(function () {
                    response.json({
                        count: 0,
                        value: []
                    });
                });
            } else {
                response.json({
                    count: 0,
                    value: []
                });
            }
        }).catch(function (error) {
            errorResponse(response, error);
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
            if (error) {
                return errorResponse(response, error);
            }
            async.eachSeries(
                owners,
                function (owner, next) {
                    Sky.getConstituent(request, owner.constituentId).then(function (constituent) {
                        owner.constituent = constituent;
                        next(null);
                    }).catch(function () {
                        next(null);
                    });
                },
                function done(error) {
                    if (error) {
                        return errorResponse(response, error);
                    }
                    response.json({
                        count: owners.length || 0,
                        value: owners
                    });
                }
            );
        });
    }

    /**
     *
     * @name getFindHome
     * @param {Object} request
     * @param {Object} response
     */
    function getFindHome(request, response) {
        Sky.getConstituentSearch(request, request.query.searchText).then(function (results) {
            response.json(results);
        });
    }

    /**
     * Sets the current home of the specified dog.
     * Sets the toDate of the previous currentHome first.
     * @name postCurrentHome
     * @param {Object} request
     * @param {Object} response
     */
    function postCurrentHome(request, response) {
        Dog.findOne({
            '_id': request.params.dogId
        }).exec(function (error, dog) {
            var currentDate;

            if (error) {
                return errorResponse(response, error);
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
                    return errorResponse(response, error);
                }
                response.json(dog.toObject());
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
        }).exec().then(function (dog) {

            var currentDate,
                currentOwner,
                dogNote;

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
                return errorResponse(response, {
                    message: 'Dog does not have a current owner to save the note to.'
                });

            }

            if (!request.body.title || !request.body.description || request.body.title === '' || request.body.description === '') {
                return errorResponse(response, {
                    message: 'Title and description are required'
                });
            }

            dogNote = dog.notes.push({
                date: currentDate,
                title: request.body.title,
                description: request.body.description
            });

            dog.save().then(function () {
                if (request.body.addConstituentNote) {
                    Sky.postNotes(request, {
                        constituent_id: currentOwner.constituentId,
                        type: request.body.type || 'Barkbaud',
                        date: {
                            y: currentDate.getFullYear(),
                            m: currentDate.getMonth() + 1,
                            d: currentDate.getDate()
                        },
                        summary: request.body.title,
                        text: request.body.description
                    }).then(function (note) {
                        response.json(note);
                    });
                } else {
                    response.json(dogNote);
                }
            }).catch(function (error) {
                errorResponse(response, error);
            });
        }).catch(function (error) {
            errorResponse(response, error);
        });
    }

    /**
     *
     * @name getDogRatings
     * @param {Object} request
     * @param {Object} response
     */
    function getDogRatings(request, response) {
        Dog.findOne({
            _id: request.params.dogId
        }).exec(function (error, dog) {
            if (error) {
                return errorResponse(response, error);
            }
            response.json({
                count: dog.ratings.length || 0,
                value: dog.ratings
            });
        });
    }

    /**
     *
     * @name getDogRating
     * @param {Object} request
     * @param {String} request.param.dogId
     * @param {String} request.param.dogRatingId
     * @param {Object} response
     */
    function getDogRating(request, response) {
        Dog.findOne({
            _id: request.params.dogId
        }).exec(function (error, dog) {
            var lookup;
            if (error) {
                return errorResponse(response, error);
            }

            for (var i = 0; i < dog.ratings.length; i++) {
                if (dog.ratings[i]._id == request.params.dogRatingId) {
                    lookup = i;
                }
            }
            response.json(dog.ratings[lookup]);
        });
    }

    /**
     *
     * @name getDogRatingCategories
     * @param {Object} request
     * @param {Object} response
     */
    function getDogRatingCategories(request, response) {
        var dogCategories = ['House breaking', 'Activity level', 'Obedience', 'Motivated by', 'Estimated age', 'Favorite toy', 'Sheds', 'Allowance', 'Adoption date', 'Allowed treats per day'];
        
        Sky.getConstituentRatingCategories(request, request.query.sourceName || '').then(function (results) {
            var categoriesToReturn,
                categoryResponse;
                
            categoriesToReturn = [];
            for (var i = 0; i < results.value.length; i++) {
                if (dogCategories.indexOf(results.value[i].name) > -1) {
                    categoriesToReturn.push(results.value[i]);
                }
            }
            categoryResponse = {
                count: categoriesToReturn.length,
                value: categoriesToReturn
            };

            response.json(categoryResponse);
        });
    }

    /**
     *
     * @name getDogRatingCategoryValues
     * @param {Object} request
     * @param {Object} response
     */
    function getDogRatingCategoryValues(request, response) {
        Sky.getConstituentRatingCategoryValues(request, request.query.categoryName, request.query.sourceName || '').then(function (results) {
            response.json(results);
        });
    }

    /**
     *
     * @name getDogRatingSources
     * @param {Object} request
     * @param {Object} response
     */
    function getDogRatingSources(request, response) {        
        var dogSources,
            sourceResponse;
            
        dogSources = ['Barkbaud'];
        
        Sky.getConstituentRatingSources(request).then(function (results) {
            var sourcesToReturn = [];
            for (var i = 0; i < results.value.length; i++) {
                if (dogSources.indexOf(results.value[i].name) > -1) {
                    sourcesToReturn.push(results.value[i].name);
                }
            }
            sourceResponse = {
                count: sourcesToReturn.length,
                value: sourcesToReturn
            };

            response.json(sourceResponse)
        });
    }

    /**
     *
     * @name postDogRating
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.body.category
     * @param {string} request.body.source
     * @param {Object} request.body.value
     * @param {string} request.body.addConstituentRating
     */
    function postDogRating(request, response) {
        Dog.findOne({
            _id: request.params.dogId
        }).exec().then(function (dog) {

            var currentOwner,
                currentDate,
                categories,
                dogRating;

            currentDate = new Date();

            // Get the current owner.
            if (dog.owners) {
                dog.owners.forEach(function (owner) {
                    if (owner.isActive) {
                        currentOwner = owner;
                        return;
                    }
                });
            }

            // Test required fields
            if (!request.body.category || request.body.category === '') {
                return errorResponse(response, {
                    message: 'Category is required.'
                });
            }

            if (request.body.addConstituentRating) {
                // Validate current owner
                if (!currentOwner) {
                    return errorResponse(response, {
                        message: 'Dog does not have a current owner to save the rating to.'
                    });
                }

                // Create constituent rating
                Sky.postConstituentRatings(request, {
                    constituent_id: currentOwner.constituentId,
                    category: request.body.category.name,
                    date: currentDate.toISOString(),
                    source: request.body.source,
                    type: request.body.category.type,
                    value: request.body.value
                }).then(function (rating) {
                    // Create dog rating with constituent rating id
                    dogRating = dog.ratings.push({
                        category: request.body.category,
                        source: request.body.source,
                        value: request.body.value,
                        constituentRatingId: rating.id
                    });

                    dog.save().then(function () {
                        response.json(dogRating);
                    }).catch(function (error) {
                        errorResponse(response, error);
                    });

                    // Not sure if this is needed here but leaving just in case
                    response.json(rating);
                });
            }
            else {
                // Not creating constituent rating so just add dog rating without api call
                dogRating = dog.ratings.push({
                    category: request.body.category,
                    source: request.body.source,
                    value: request.body.value 
                });

                dog.save().then(function () {
                    response.json(dogRating);
                }).catch(function (error) {
                    errorResponse(response, error);
                });
            }            
        }).catch(function (error) {
            errorResponse(response, error);
        });
    }

    /**
     *
     * @name deleteDogRating
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.params.dogRatingId
     */
    function deleteDogRating(request, response) {
        Dog.findOne({
            _id: request.params.dogId
        }).exec().then(function (dog) {
            var lookup;
            for (var i = 0, len = dog.ratings.length; i < len; i++) {
                if (dog.ratings[i]._id == request.params.dogRatingId) {
                    lookup = i;
                    break;
                }
            }

            // If rating has a linked constituent rating, delete it as well
            if (dog.ratings[lookup].constituentRatingId) {
                Sky.deleteConstituentRating(request, dog.ratings[lookup].constituentRatingId).then(function () {
                    dog.ratings.splice(lookup, 1);
                    dog.save().then(function () {
                        response.send();
                    });
                }).catch(function (error) {
                    errorResponse(response, error);
                });
            }
            else {
                dog.ratings.splice(lookup, 1);
                dog.save().then(function () {
                    response.send();
                });
            }
        }).catch(function (error) {
            errorResponse(response, error);
        });
    }

    /**
     *
     * @name patchDogRating
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.dogId
     * @param {string} request.params.dogRatingId
     */
    function patchDogRating(request, response) {
        Dog.findOne({
            _id: request.params.dogId
        }).exec().then(function (dog) {
            var lookup;
            for (var i = 0, len = dog.ratings.length; i < len; i++) {
                if (dog.ratings[i]._id == request.params.dogRatingId) {
                    lookup = i;
                    break;
                }
            }

            // If rating has a linked constituent rating, delete it as well
            if (dog.ratings[lookup].constituentRatingId) {
                Sky.patchConstituentRating(request, dog.ratings[lookup].constituentRatingId, request.body).then(function () {
                    dog.ratings.splice(lookup, 1, request.body);
                    dog.save().then(function () {
                        response.send();
                    });
                }).catch(function (error) {
                    errorResponse(response, error);
                });
            }
            else {
                dog.ratings.splice(lookup, 1, request.body);
                dog.save().then(function () {
                    response.send();
                });
            }
        }).catch(function (error) {
            errorResponse(response, error);
        });
    }

    /**
     * Handles parse errors
     * @internal
     * @name handleError
     * @param {Object} response
     * @param {Object} error
    */
    function errorResponse(response, error) {
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
          getNoteTypes: getNoteTypes,
          getPreviousHomes: getPreviousHomes,
          postCurrentHome: postCurrentHome,
          postNotes: postNotes,
          getDogRatings: getDogRatings,
          getDogRating: getDogRating,
          getDogRatingCategories: getDogRatingCategories,
          getDogRatingCategoryValues: getDogRatingCategoryValues,
          getDogRatingSources: getDogRatingSources,
          postDogRating: postDogRating,
          patchDogRating: patchDogRating,
          deleteDogRating: deleteDogRating
    };
}());
