const mongoose = require('mongoose');
const dogRatingCategorySchema = require('./dog-rating-category');

module.exports = mongoose.Schema({
    category: dogRatingCategorySchema,
    source: String,
    value: Object,
    constituentRatingId: String
});
