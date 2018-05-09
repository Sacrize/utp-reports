// @ts-nocheck
const mongoose = require('mongoose');
const schema = mongoose.Schema({

  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },

  studentName: {
    type: String,
    trim: true,
    required: true
  },

  studentIndex: { /* student / numer indexu */
    type: String,
    trim: true,
    required: false,
  },

  status: {
    type: String,
    required: false,
    default: 'waiting'
  },

  file: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    max: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now,
    max: Date.now
  }

});

module.exports = mongoose.model('Report', schema);