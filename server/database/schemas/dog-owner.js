/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    module.exports = require('mongoose').Schema({
        constituentId: String,
        createdAt: String,
        fromDate: String,
        isActive: {
            type: Boolean,
            default: false,
        },
        toDate: String,
        updatedAt: String
    });
}());