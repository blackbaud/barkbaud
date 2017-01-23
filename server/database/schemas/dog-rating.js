/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var dogRatingCategorySchema,
        mongoose;
        
    mongoose = require('mongoose');
    dogRatingCategorySchema = require(__dirname + '/dog-rating-category.js');

    module.exports = require('mongoose').Schema({
        category: dogRatingCategorySchema,
        source: String,
        value: Object,
        constituentRatingId: String
    });
}());