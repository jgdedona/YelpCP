const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { cloudinary } = require('../cloudinary/index');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200');
});

const campgroundSchema = new Schema({
    title: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { toJSON: { virtuals: true } });

campgroundSchema.virtual('properties').get(function () {
    const properties = {title: this.title, location: this.location, link: `/campgrounds/${this._id}`};
    return properties;
});

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        await Review.deleteMany({ _id: { $in: campground.reviews } });
        for (let image of campground.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);