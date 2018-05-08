// @ts-nocheck
const mongoose = require('mongoose');
const schema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    specialization: {
        type: String,
        trim: true,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Class', schema);