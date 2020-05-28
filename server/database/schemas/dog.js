const mongoose = require('mongoose');
const dogNoteSchema = require('./dog-note');
const dogOwnerSchema = require('./dog-owner');
const dogRatingSchema = require('./dog-rating');

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
  ratings: [dogRatingSchema],
  updatedAt: String
}, {
  collection: 'Dog'
});
