const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas');

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
        req.flash('error', 'You must sign in to perform that action');
        return res.redirect('/login');
    }
    next();
}