/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var dogNoteSchema,
        dogOwnerSchema,
        mongoose;

    mongoose = require('mongoose');
    dogNoteSchema = require(__dirname + '/dog-note.js');
    dogOwnerSchema = require(__dirname + '/dog-owner.js');

    module.exports = mongoose.Schema({
        bio: String,
        breed: String,
        createdAt: String,
        owners: [dogOwnerSchema],
        gender: String,
        image: {
            file: String,
            data: String
        },
        name: String,
        notes: [dogNoteSchema],
        updatedAt: String
    }, {
        collection : 'Dog'
    });
}());