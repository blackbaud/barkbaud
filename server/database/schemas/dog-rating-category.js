/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    module.exports = require('mongoose').Schema({
        name: String,
        type: String,
        source: String
    });
}());