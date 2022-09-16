const { string, number } = require('joi');
const User = require('../models/user');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema);