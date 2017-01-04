/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var dogRatingCategorySchema
        mongoose;

    mongoose = require('mongoose');
    dogRatingCategorySchema = require(__dirname + '/dog-rating-category.js');
    
    module.exports = require('mongoose').Schema({
       source: String,
       category: [dogRatingCategorySchema],
       date: String,
       type: String,
       value: String,
       comment: String,
    });
}());