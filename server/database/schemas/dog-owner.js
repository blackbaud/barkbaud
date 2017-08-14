module.exports = require('mongoose').Schema({
    constituentId: String,
    createdAt: String,
    fromDate: String,
    isActive: {
        type: Boolean,
        default: false
    },
    toDate: String,
    updatedAt: String
});
