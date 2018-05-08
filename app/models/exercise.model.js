// @ts-nocheck
const mongoose = require('mongoose');
const schema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    branch: {
        type: String,
        trim: true,
        required: true,
    },

    specialization: {
        type: String,
        trim: true,
        required: true,
    },

    typeOfStudy: {
        type: String,
        trim: true,
        required: true,
    },

    semester: {
        type: String,
        trim: true,
        required: true,
    },

    name: {
        type: String,
        trim: true,
        required: true
    },

    owner: { /* teacher */
        type: String,
        required: true
    },

    description: {
        type: String,
        trim: true,
    },

    file: {
        type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('Exercise', schema);