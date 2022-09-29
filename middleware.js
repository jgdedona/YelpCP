const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema, userSchema } = require('./schemas');
const CustomErr = require('./utilities/CustomErr');

module.exports.validateCamp = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new CustomErr(msg, 400);
    }
    next();
}

module.exports.validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new CustomErr(msg, 400);
    }
    next();
}

module.exports.validateUser = function (req, res, next) {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        // throw new CustomErr(msg, 400);
        req.flash('error', `${msg}`);
        return res.redirect('/register');
    }
    next();
}

module.exports.errorFlashes = async function (req, res, next) {
    const { id } = req.params;
    const reg = /^[a-f0-9]{24}$/gi;
    if (!id.match(reg)) {
        req.flash('error', 'Invalid campground ID');
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    next();
}

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.redirectedFrom = req.originalUrl;
        req.flash('error', 'You must sign in to perform that action');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthorizedCamp = async function (req, res, next) {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground && !campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to perform that action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isAuthorizedReview = async function (req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (review && !review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to perform that action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}