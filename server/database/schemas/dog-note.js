/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    module.exports = require('mongoose').Schema({
        createdAt: String,
        date: String,
        description: String,
        title: String,
        updatedAt: String
    });
}());