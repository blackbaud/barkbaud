const mongoose = require('mongoose');
const schema = require('../schemas/dog');

module.exports = mongoose.model('Dog', schema);
