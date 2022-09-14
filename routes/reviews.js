const express = require("express");
const wrapAsync = require('../utilities/wrapAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas');

const router = express.Router({ mergeParams: true });

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new CustomErr(msg, 400);
    }
    next();
}

router.post('/', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;